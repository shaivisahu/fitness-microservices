import axios from 'axios';

// All traffic goes via API Gateway on :8080
// Gateway routes: /api/auth → auth-service:8081
//                 /api/workouts → workout-service:8082
//                 /api/diet → diet-service:8083
//                 /api/ai → ai-service:8084
//                 /api/stats → stats-service:8085

const B = '/api';

// ── Auth (auth-service) ───────────────────────────────────────────
export const authApi = {
    register: d => axios.post(`${B}/auth/register`, d).then(r => r.data),
    login:    d => axios.post(`${B}/auth/login`, d).then(r => r.data),
    profile:  ()  => axios.get(`${B}/auth/profile`).then(r => r.data),
    update:   d  => axios.put(`${B}/auth/profile`, d).then(r => r.data),
};

// ── Workouts (workout-service) ────────────────────────────────────
export const workoutApi = {
    create:    d         => axios.post(`${B}/workouts`, d).then(r => r.data),
    getAll:    ()        => axios.get(`${B}/workouts`).then(r => r.data),
    getByRange:(s, e)    => axios.get(`${B}/workouts/range`, { params: { start: s, end: e } }).then(r => r.data),
    delete:    id        => axios.delete(`${B}/workouts/${id}`),
};

// ── Diet (diet-service) ───────────────────────────────────────────
export const dietApi = {
    create:    d       => axios.post(`${B}/diet`, d).then(r => r.data),
    getByDate: date    => axios.get(`${B}/diet`, { params: { date } }).then(r => r.data),
    getByRange:(s, e)  => axios.get(`${B}/diet/range`, { params: { start: s, end: e } }).then(r => r.data),
    delete:    id      => axios.delete(`${B}/diet/${id}`),
};

// ── Stats (stats-service) ─────────────────────────────────────────
export const statsApi = {
    dashboard: ()          => axios.get(`${B}/stats/dashboard`).then(r => r.data),
    progress:  (days = 30) => axios.get(`${B}/stats/progress`, { params: { days } }).then(r => r.data),
};

// ── AI (ai-service) ───────────────────────────────────────────────
// The AI service needs context pre-fetched from stats/workout/diet
// We build it here so the AI service can focus on calling Anthropic
export const aiApi = {
    async suggest(type, customPrompt = null) {
        // Build rich context from live data across services
        const [stats, workouts, todayDiet] = await Promise.all([
            statsApi.dashboard().catch(() => null),
            workoutApi.getAll().catch(() => []),
            dietApi.getByDate(new Date().toISOString().split('T')[0]).catch(() => []),
        ]);

        const context = buildContext(stats, workouts, todayDiet);

        return axios.post(`${B}/ai/suggest`, {
            type,
            customPrompt,
            userContext: context,
        }).then(r => r.data);
    },
    history: () => axios.get(`${B}/ai/history`).then(r => r.data),
};

// Build a plain-text context string from live service data
function buildContext(stats, workouts, todayDiet) {
    const lines = [];

    if (stats) {
        lines.push('TODAY\'S STATS:');
        lines.push(`Calories consumed: ${Math.round(stats.todayCaloriesConsumed || 0)} kcal`);
        lines.push(`Calories burned: ${stats.todayCaloriesBurned || 0} kcal`);
        lines.push(`Protein: ${Math.round(stats.todayProtein || 0)}g`);
        lines.push(`Carbs: ${Math.round(stats.todayCarbs || 0)}g`);
        lines.push(`Fat: ${Math.round(stats.todayFat || 0)}g`);
        lines.push(`Weekly workout minutes: ${stats.weeklyWorkoutMinutes || 0}`);
        lines.push(`Total sessions logged: ${stats.totalWorkouts || 0}`);
        lines.push('');
    }

    if (workouts && workouts.length > 0) {
        lines.push('RECENT WORKOUTS (last 5):');
        workouts.slice(0, 5).forEach(w => {
            let line = `- ${w.workoutDate}: ${w.workoutName} (${w.workoutType})`;
            if (w.durationMinutes) line += `, ${w.durationMinutes}min`;
            if (w.caloriesBurned) line += `, ${w.caloriesBurned} kcal burned`;
            if (w.exercises && w.exercises.length > 0) {
                const exNames = w.exercises.slice(0, 4).map(e => {
                    let s = e.name;
                    if (e.sets && e.reps) s += ` ${e.sets}x${e.reps}`;
                    if (e.weight) s += ` @${e.weight}kg`;
                    return s;
                }).join(', ');
                line += ` | ${exNames}`;
            }
            lines.push(line);
        });
        lines.push('');
    }

    if (todayDiet && todayDiet.length > 0) {
        lines.push('TODAY\'S FOOD:');
        todayDiet.forEach(d => {
            lines.push(`- ${d.mealType}: ${d.foodName} (${Math.round(d.calories || 0)} kcal)`);
        });
    }

    return lines.join('\n') || 'No data logged yet.';
}

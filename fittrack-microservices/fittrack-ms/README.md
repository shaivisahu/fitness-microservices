# ⚡ FitTrack Microservices v3

> Spring Cloud · Kafka · Docker Compose · React · Claude AI

---

## 🏗️ Architecture

```
React (3000)
     │
     ▼
API Gateway (8080)  ←──── Eureka Server (8761)
     │                         ▲
     ├── /api/auth    ──► Auth Service (8081) ──► MySQL auth (3307)
     ├── /api/workouts ──► Workout Service (8082) ──► MySQL workout (3308)
     │                              │
     ├── /api/diet   ──► Diet Service (8083) ──► MySQL diet (3309)
     │                              │
     ├── /api/ai     ──► AI Service (8084) ──► MySQL ai (3310)
     │                              │
     └── /api/stats  ──► Stats Service (8085) ──► MySQL stats (3311)
                                    ▲
                          Kafka Event Bus (9092)
                         /              \
                  workout.logged      diet.updated
                  (published by       (published by
                   Workout Svc)        Diet Svc)
```

---

## 📦 Services

| Service | Port | Purpose |
|---------|------|---------|
| Eureka Server | 8761 | Service registry & discovery |
| Config Server | 8888 | Centralised config (optional) |
| API Gateway | 8080 | Single entry point, JWT validation, routing |
| Auth Service | 8081 | Register, login, user profiles |
| Workout Service | 8082 | Log workouts + publishes Kafka events |
| Diet Service | 8083 | Log food entries + publishes Kafka events |
| AI Service | 8084 | Anthropic Claude AI suggestions (async, rate-limited) |
| Stats Service | 8085 | Kafka consumer, aggregates daily summaries |

---

## 🚀 Quick Start (Docker)

### Prerequisites
- Docker & Docker Compose
- Anthropic API key

### 1. Clone and set your API key

```bash
cd fittrack-ms
echo "ANTHROPIC_API_KEY=your_key_here" > .env
```

### 2. Build all services

```bash
# Build each Spring Boot service
for svc in eureka-server config-server api-gateway auth-service workout-service diet-service ai-service stats-service; do
  echo "Building $svc..."
  cd $svc && mvn clean package -DskipTests && cd ..
done
```

### 3. Start everything

```bash
docker-compose up --build
```

Wait ~60 seconds for all services to register with Eureka.

### 4. Start the frontend

```bash
cd frontend
npm install
npm start
```

Open **http://localhost:3000**

---

## 🔧 Run Without Docker (local dev)

Start services in this order (each in its own terminal):

```bash
# Terminal 1: Kafka (via Docker only)
docker-compose up zookeeper kafka mysql-auth mysql-workout mysql-diet mysql-ai mysql-stats

# Terminal 2: Eureka
cd eureka-server && mvn spring-boot:run

# Terminal 3: API Gateway
cd api-gateway && mvn spring-boot:run

# Terminal 4: Auth
cd auth-service && mvn spring-boot:run

# Terminal 5: Workout
cd workout-service && mvn spring-boot:run

# Terminal 6: Diet
cd diet-service && mvn spring-boot:run

# Terminal 7: AI
ANTHROPIC_API_KEY=your_key cd ai-service && mvn spring-boot:run

# Terminal 8: Stats
cd stats-service && mvn spring-boot:run

# Terminal 9: Frontend
cd frontend && npm install && npm start
```

---

## 🔌 API Endpoints (all via Gateway on :8080)

### Auth — `/api/auth`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/register` | ✗ | Register new user |
| POST | `/login` | ✗ | Login, returns JWT |
| GET | `/profile` | ✓ | Get user profile |
| PUT | `/profile` | ✓ | Update profile |

### Workouts — `/api/workouts`
| Method | Path | Description |
|--------|------|-------------|
| POST | `/` | Log workout → Kafka `workout.logged` |
| GET | `/` | All workouts for authenticated user |
| GET | `/range?start=&end=` | Filter by date range |
| DELETE | `/{id}` | Delete workout |

### Diet — `/api/diet`
| Method | Path | Description |
|--------|------|-------------|
| POST | `/` | Add food entry → Kafka `diet.updated` |
| GET | `/?date=` | Entries for a date |
| GET | `/range?start=&end=` | Date range |
| DELETE | `/{id}` | Delete entry |

### Stats — `/api/stats`
| Method | Path | Description |
|--------|------|-------------|
| GET | `/dashboard` | Today's aggregated stats |
| GET | `/progress?days=30` | Progress data points |

### AI — `/api/ai`
| Method | Path | Description |
|--------|------|-------------|
| POST | `/suggest` | Generate AI analysis (async) |
| GET | `/history` | Past suggestions |

**AI request body:**
```json
{
  "type": "WORKOUT_PLAN",
  "customPrompt": null,
  "userContext": "auto-built by frontend from live service data"
}
```

---

## ⚙️ How Microservices Talk

### JWT Flow
1. User logs in → Auth Service returns JWT
2. Frontend attaches `Authorization: Bearer <token>` to every request
3. Gateway's `JwtAuthFilter` validates the token
4. Gateway injects `X-Auth-User: username` header
5. Downstream services read `@RequestHeader("X-Auth-User")` — no JWT code needed in business services

### Kafka Event Flow
```
User logs workout
  → Workout Service saves to MySQL
  → Publishes to topic: workout.logged
        { username, date, caloriesBurned, durationMinutes, workoutType }
  → Stats Service consumes event
  → Updates daily_summaries table
  → Dashboard instantly reflects new numbers
```

Same pattern for `diet.updated`.

### AI Context Flow
```
User clicks "Generate Analysis"
  → Frontend calls stats, workouts, diet APIs in parallel
  → Builds plain-text context string
  → Sends to AI Service with { type, userContext }
  → AI Service calls Anthropic Claude API (async)
  → Returns personalised suggestion
  → Saved to ai_suggestions table
```

---

## 🗄️ Databases

Each service owns its own schema. No cross-service DB queries allowed.

| Database | Port | Tables |
|----------|------|--------|
| fittrack_auth | 3307 | users |
| fittrack_workout | 3308 | workout_logs, exercises |
| fittrack_diet | 3309 | diet_entries |
| fittrack_ai | 3310 | ai_suggestions |
| fittrack_stats | 3311 | daily_summaries |

---

## 📊 Kafka Topics

| Topic | Producer | Consumer | Payload |
|-------|----------|----------|---------|
| `workout.logged` | Workout Service | Stats Service | WorkoutEvent |
| `diet.updated` | Diet Service | Stats Service | DietEvent |

---

## 🛡️ Security

- Passwords hashed with BCrypt in Auth Service
- JWT validated at Gateway level only — business services trust `X-Auth-User`
- JWT secret shared via environment variable `JWT_SECRET`
- All business endpoints require valid Bearer token
- AI rate limit: 20 requests/hour per user (in-memory, per AI Service instance)
- CORS locked to `http://localhost:3000`

---

## 📁 Project Structure

```
fittrack-ms/
├── docker-compose.yml          ← one command to start everything
├── eureka-server/              ← service discovery (port 8761)
├── config-server/              ← centralised config (port 8888)
├── api-gateway/                ← JWT filter + routing (port 8080)
│   └── filter/JwtAuthFilter   ← validates JWT, injects X-Auth-User
├── auth-service/               ← port 8081
├── workout-service/            ← port 8082, Kafka producer
├── diet-service/               ← port 8083, Kafka producer
├── ai-service/                 ← port 8084, Anthropic API, async
├── stats-service/              ← port 8085, Kafka consumer
└── frontend/                   ← React + Syne/DM Mono theme
    └── services/api.js         ← builds AI context from live data
```

---

## 🔑 Environment Variables

| Variable | Default | Used by |
|----------|---------|---------|
| `ANTHROPIC_API_KEY` | — | AI Service |
| `JWT_SECRET` | `fittrack-jwt-secret-key-...` | Gateway, Auth Service |
| `DB_URL` | per service | All business services |
| `DB_USER` | `root` | All business services |
| `DB_PASS` | `root` | All business services |
| `KAFKA_SERVERS` | `localhost:9092` | Workout, Diet, Stats, AI |
| `EUREKA_URI` | `http://localhost:8761/eureka` | All services |

---

## 📦 Production Build

```bash
# Backend — build all JARs
mvn clean package -DskipTests

# Frontend — static build
cd frontend && npm run build

# Deploy with Docker
docker-compose -f docker-compose.yml up -d
```

View Eureka dashboard: **http://localhost:8761**

package com.fittrack.ai.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Component
public class RateLimiter {

    @Value("${app.ai.rate-limit-per-hour:20}")
    private int maxPerHour;

    private final Map<String, AtomicInteger> counters   = new ConcurrentHashMap<>();
    private final Map<String, Long>          windowStart = new ConcurrentHashMap<>();

    private static final long WINDOW_MS = 3_600_000L;

    public boolean allow(String username) {
        long now = System.currentTimeMillis();
        windowStart.putIfAbsent(username, now);
        if (now - windowStart.get(username) > WINDOW_MS) {
            windowStart.put(username, now);
            counters.put(username, new AtomicInteger(0));
        }
        counters.putIfAbsent(username, new AtomicInteger(0));
        return counters.get(username).incrementAndGet() <= maxPerHour;
    }

    public int remaining(String username) {
        long now = System.currentTimeMillis();
        Long start = windowStart.get(username);
        if (start == null || now - start > WINDOW_MS) return maxPerHour;
        AtomicInteger c = counters.get(username);
        return c == null ? maxPerHour : Math.max(0, maxPerHour - c.get());
    }
}

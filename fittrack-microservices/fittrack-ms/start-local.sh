#!/bin/bash
# FitTrack Microservices — Local Dev Start Script
# Starts Kafka + DBs via Docker, services locally via Maven
# Run from the fittrack-ms root directory

set -e

echo "Starting infrastructure (Kafka + MySQL)..."
docker-compose up -d zookeeper kafka mysql-auth mysql-workout mysql-diet mysql-ai mysql-stats

echo "Waiting for infrastructure to be ready..."
sleep 15

echo ""
echo "Starting Eureka Server (background)..."
cd eureka-server && mvn spring-boot:run -q &
EUREKA_PID=$!
cd ..
sleep 12

echo "Starting API Gateway (background)..."
cd api-gateway && mvn spring-boot:run -q &
GW_PID=$!
cd ..
sleep 8

echo "Starting Auth Service (background)..."
cd auth-service && mvn spring-boot:run -q &
AUTH_PID=$!
cd ..

echo "Starting Workout Service (background)..."
cd workout-service && mvn spring-boot:run -q &
WORKOUT_PID=$!
cd ..

echo "Starting Diet Service (background)..."
cd diet-service && mvn spring-boot:run -q &
DIET_PID=$!
cd ..

echo "Starting AI Service (background)..."
cd ai-service && mvn spring-boot:run -q &
AI_PID=$!
cd ..

echo "Starting Stats Service (background)..."
cd stats-service && mvn spring-boot:run -q &
STATS_PID=$!
cd ..

echo ""
echo "============================================"
echo "  All services started!"
echo "  Eureka:   http://localhost:8761"
echo "  Gateway:  http://localhost:8080"
echo "  Frontend: cd frontend && npm start"
echo "============================================"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait and handle shutdown
cleanup() {
  echo "Shutting down services..."
  kill $EUREKA_PID $GW_PID $AUTH_PID $WORKOUT_PID $DIET_PID $AI_PID $STATS_PID 2>/dev/null
  exit 0
}
trap cleanup SIGINT SIGTERM
wait

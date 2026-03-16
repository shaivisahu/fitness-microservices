#!/bin/bash
# FitTrack Microservices — Build All Script
# Run from the fittrack-ms root directory

set -e

echo "======================================"
echo "  FitTrack Microservices Build Script"
echo "======================================"
echo ""

SERVICES=(
  "eureka-server"
  "config-server"
  "api-gateway"
  "auth-service"
  "workout-service"
  "diet-service"
  "ai-service"
  "stats-service"
)



for svc in "${SERVICES[@]}"; do
  echo ">>> Building $svc..."
  cd "$svc"
  mvn clean package -DskipTests -q
  echo "    ✓ $svc built successfully"
  cd ..
done

echo ""
echo "======================================"
echo "  All services built successfully!"
echo "  Run: docker-compose up --build"
echo "======================================"

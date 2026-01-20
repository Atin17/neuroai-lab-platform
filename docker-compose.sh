#!/bin/bash

# NeuroAI Lab Platform - Docker Compose Helper Script

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${BLUE}ℹ ${1}${NC}"
}

print_success() {
    echo -e "${GREEN}✓ ${1}${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ ${1}${NC}"
}

# Check if Docker and Docker Compose are installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_warning "Docker is not installed. Please install Docker Desktop or Docker Engine."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_warning "Docker Compose is not installed. Please install Docker Compose."
        exit 1
    fi
    
    print_success "Docker and Docker Compose are installed"
}

# Start services
start() {
    print_info "Starting NeuroAI Lab Platform..."
    docker-compose up -d
    
    print_info "Waiting for services to be healthy..."
    sleep 5
    
    # Check service health
    if docker-compose ps | grep -q "healthy"; then
        print_success "All services are running"
        print_info "Access the application at: http://localhost:3000"
        print_info "MinIO Console at: http://localhost:9001 (minioadmin/minioadmin)"
        print_info "MySQL at: localhost:3306 (neuroai_user/neuroai_password)"
    else
        print_warning "Some services may still be starting. Check logs with: docker-compose logs -f"
    fi
}

# Stop services
stop() {
    print_info "Stopping NeuroAI Lab Platform..."
    docker-compose down
    print_success "Services stopped"
}

# View logs
logs() {
    docker-compose logs -f "${1:-app}"
}

# Reset database
reset_db() {
    print_warning "Resetting database..."
    docker-compose down -v
    print_info "Restarting services..."
    start
}

# Build images
build() {
    print_info "Building Docker images..."
    docker-compose build
    print_success "Build complete"
}

# Show usage
usage() {
    cat << EOF
NeuroAI Lab Platform - Docker Compose Helper

Usage: ./docker-compose.sh [COMMAND]

Commands:
    start       Start all services (default)
    stop        Stop all services
    logs        View service logs (usage: ./docker-compose.sh logs [service])
    build       Build Docker images
    reset-db    Reset database and restart services
    help        Show this help message

Examples:
    ./docker-compose.sh start
    ./docker-compose.sh logs app
    ./docker-compose.sh logs db
    ./docker-compose.sh reset-db

EOF
}

# Main script
main() {
    check_docker
    
    case "${1:-start}" in
        start)
            start
            ;;
        stop)
            stop
            ;;
        logs)
            logs "$2"
            ;;
        build)
            build
            ;;
        reset-db)
            reset_db
            ;;
        help|--help|-h)
            usage
            ;;
        *)
            print_warning "Unknown command: $1"
            usage
            exit 1
            ;;
    esac
}

main "$@"

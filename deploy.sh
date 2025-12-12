#!/bin/bash

# APTX SpectraX Raindrop Deployment Script
# This script deploys the application to Raindrop with all SmartComponents

set -e

echo "🚀 Starting APTX SpectraX deployment to Raindrop..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check if Raindrop CLI is installed
    if ! command -v raindrop &> /dev/null; then
        log_error "Raindrop CLI not found. Please install it first."
        echo "Install with: npm install -g @raindrop/cli"
        exit 1
    fi
    
    # Check if user is logged in
    if ! raindrop auth whoami &> /dev/null; then
        log_error "Not logged into Raindrop. Please run 'raindrop auth login' first."
        exit 1
    fi
    
    # Check required environment variables
    required_vars=("RAINDROP_ENDPOINT" "RAINDROP_API_KEY" "GOOGLE_AI_API_KEY")
    missing_vars=()
    
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            missing_vars+=("$var")
        fi
    done
    
    if [ ${#missing_vars[@]} -ne 0 ]; then
        log_error "Missing required environment variables:"
        printf '  %s\n' "${missing_vars[@]}"
        echo "Please set these variables before deploying."
        exit 1
    fi
    
    log_success "All prerequisites checked!"
}

# Build the application
build_app() {
    log_info "Building the application..."
    
    # Install dependencies
    npm ci
    
    # Run type checking
    npm run typecheck
    
    # Build the application
    npm run build
    
    log_success "Application built successfully!"
}

# Deploy SmartComponents first
deploy_smartcomponents() {
    log_info "Deploying SmartComponents..."
    
    # Deploy SmartBuckets
    log_info "Creating SmartBuckets..."
    rainbucket create users --schema-file schemas/users.json || true
    rainbucket create courses --schema-file schemas/courses.json || true
    rainbucket create progress --schema-file schemas/progress.json || true
    rainbucket create enrollments --schema-file schemas/enrollments.json || true
    
    # Deploy SmartMemory configurations
    log_info "Configuring SmartMemory..."
    rainmemory configure adaptive-paths --ttl "24h" || true
    rainmemory configure user-sessions --ttl "8h" || true
    rainmemory configure content-cache --ttl "1h" || true
    rainmemory configure emotion-states --ttl "24h" || true
    
    # Deploy SmartInference models
    log_info "Configuring SmartInference..."
    raininference create liquidmetal-adaptive \
        --model "gemini-2.5-flash" \
        --temperature 0.7 \
        --max-tokens 2000 || true
        
    raininference create content-generator \
        --model "gemini-2.5-flash" \
        --temperature 0.8 \
        --max-tokens 2500 || true
        
    raininference create progress-analyzer \
        --model "gemini-2.5-flash" \
        --temperature 0.6 \
        --max-tokens 2000 || true
    
    log_success "SmartComponents deployed successfully!"
}

# Deploy the main application
deploy_app() {
    log_info "Deploying application to Raindrop..."
    
    # Deploy using raindrop.yaml configuration
    raindrop deploy --config raindrop.yaml
    
    log_success "Application deployed successfully!"
}

# Verify deployment
verify_deployment() {
    log_info "Verifying deployment..."
    
    # Get the deployed URL
    APP_URL=$(raindrop apps get aptx-spectrax --query url -o text)
    
    if [ -z "$APP_URL" ]; then
        log_error "Could not retrieve application URL"
        exit 1
    fi
    
    log_info "Testing application health..."
    
    # Test the health endpoint
    if curl -f "$APP_URL/api/raindrop" > /dev/null 2>&1; then
        log_success "Health check passed!"
    else
        log_error "Health check failed"
        exit 1
    fi
    
    # Test the Raindrop API endpoint
    if curl -f "$APP_URL/api/raindrop" -X GET > /dev/null 2>&1; then
        log_success "Raindrop API is responding!"
    else
        log_warning "Raindrop API test failed, but deployment may still be successful"
    fi
    
    log_success "Deployment verification completed!"
    echo "🌐 Application is available at: $APP_URL"
}

# Initialize sample data
initialize_data() {
    log_info "Initializing sample data..."
    
    # Create sample course data
    curl -X POST "$APP_URL/api/raindrop" \
        -H "Content-Type: application/json" \
        -d '{
            "command": "smartbucket.create",
            "input": {
                "bucket": "courses",
                "data": {
                    "courseId": "math-basics",
                    "title": "Math Basics for Kids",
                    "description": "Fun math activities for children with Down syndrome",
                    "subject": "Mathematics",
                    "ageGroup": "8-12 years",
                    "difficulty": "beginner",
                    "modules": []
                }
            }
        }' || true
    
    log_success "Sample data initialized!"
}

# Main deployment flow
main() {
    echo "🎯 APTX SpectraX - LiquidMetal AI Learning Platform"
    echo "=================================================="
    echo ""
    
    check_prerequisites
    build_app
    deploy_smartcomponents
    deploy_app
    verify_deployment
    initialize_data
    
    echo ""
    echo "🎉 Deployment completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Visit your application at the URL above"
    echo "2. Create an account and explore the courses"
    echo "3. Try the adaptive learning tools"
    echo "4. Test the LiquidMetal AI features"
    echo ""
    echo "For support, check the Raindrop documentation or create an issue."
}

# Handle script interruption
trap 'log_error "Deployment interrupted"; exit 1' INT

# Run main function
main "$@"
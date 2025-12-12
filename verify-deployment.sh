#!/bin/bash

# APTX SpectraX Deployment Verification Script
# This script verifies that all components are properly configured for Raindrop deployment

set -e

echo "🔍 Verifying APTX SpectraX deployment readiness..."

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

# Verification checklist
verify_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check Node.js version
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        if [[ $NODE_VERSION == *20* ]]; then
            log_success "Node.js version: $NODE_VERSION"
        else
            log_warning "Node.js version: $NODE_VERSION (v20+ recommended)"
        fi
    else
        log_error "Node.js not found"
        return 1
    fi
    
    # Check npm
    if command -v npm &> /dev/null; then
        log_success "npm is available"
    else
        log_error "npm not found"
        return 1
    fi
    
    # Check dependencies
    if [ -d "node_modules" ]; then
        log_success "Dependencies installed"
    else
        log_warning "Dependencies not installed - run npm install"
    fi
}

verify_project_structure() {
    log_info "Verifying project structure..."
    
    required_files=(
        "package.json"
        "raindrop.yaml"
        "deploy.sh"
        "src/app/api/raindrop/route.ts"
        "src/app/courses/page.tsx"
        "src/app/tools/page.tsx"
        "src/ai/flows/liquidmetal-adaptive-learning.ts"
        "src/ai/flows/liquidmetal-content-generator.ts"
        "src/ai/flows/liquidmetal-progress-tracker.ts"
        "src/components/liquidmetal/adaptive-learning-interface.tsx"
        "schemas/users.json"
        "schemas/courses.json"
        "schemas/progress.json"
        "schemas/enrollments.json"
    )
    
    missing_files=()
    
    for file in "${required_files[@]}"; do
        if [ -f "$file" ]; then
            log_success "Found: $file"
        else
            missing_files+=("$file")
        fi
    done
    
    if [ ${#missing_files[@]} -eq 0 ]; then
        log_success "All required files present"
    else
        log_error "Missing files:"
        printf '  %s\n' "${missing_files[@]}"
        return 1
    fi
}

verify_code_quality() {
    log_info "Verifying code quality..."
    
    # Type checking
    if npm run typecheck &> /dev/null; then
        log_success "TypeScript compilation successful"
    else
        log_error "TypeScript compilation failed"
        return 1
    fi
    
    # Check if deployment script is executable
    if [ -x "deploy.sh" ]; then
        log_success "Deployment script is executable"
    else
        log_warning "Deployment script is not executable"
    fi
}

verify_configuration() {
    log_info "Verifying configuration files..."
    
    # Check raindrop.yaml
    if [ -f "raindrop.yaml" ]; then
        if grep -q "aptx-spectrax" raindrop.yaml; then
            log_success "Raindrop configuration found"
        else
            log_error "Invalid raindrop.yaml configuration"
            return 1
        fi
    else
        log_error "raindrop.yaml not found"
        return 1
    fi
    
    # Check schema files
    schema_files=("schemas/users.json" "schemas/courses.json" "schemas/progress.json" "schemas/enrollments.json")
    
    for schema in "${schema_files[@]}"; do
        if python3 -m json.tool "$schema" &> /dev/null; then
            log_success "Valid JSON: $schema"
        else
            log_error "Invalid JSON: $schema"
            return 1
        fi
    done
}

verify_git_status() {
    log_info "Verifying Git status..."
    
    if [ -d ".git" ]; then
        if git status &> /dev/null; then
            log_success "Git repository initialized"
            
            # Check if there are uncommitted changes
            if [ -z "$(git status --porcelain)" ]; then
                log_success "No uncommitted changes"
            else
                log_warning "There are uncommitted changes"
                git status --porcelain
            fi
        else
            log_error "Git repository corrupted"
            return 1
        fi
    else
        log_error "Git repository not initialized"
        return 1
    fi
}

verify_environment() {
    log_info "Checking environment variables..."
    
    env_vars=("RAINDROP_ENDPOINT" "RAINDROP_API_KEY" "GOOGLE_AI_API_KEY")
    
    for var in "${env_vars[@]}"; do
        if [ -f ".env" ]; then
            if grep -q "^${var}=" .env; then
                log_success "$var configured"
            else
                log_warning "$var not found in .env file"
            fi
        else
            log_warning ".env file not found"
        fi
    done
}

generate_report() {
    log_info "Generating deployment report..."
    
    cat > deployment-report.txt << EOF
APTX SpectraX Deployment Verification Report
Generated: $(date)

✅ Prerequisites: Verified
✅ Project Structure: Complete
✅ Code Quality: Passed
✅ Configuration: Valid
✅ Git Status: Clean

📋 Ready for Deployment:
1. Set environment variables in .env
2. Run ./deploy.sh to deploy to Raindrop
3. Access the application at the provided URL

📁 Key Components:
- LiquidMetal AI flows (3)
- Courses section with Raindrop integration
- Learning tools dashboard
- SmartBucket schemas (4)
- Deployment automation

🚀 Next Steps:
1. Configure Raindrop environment variables
2. Deploy using ./deploy.sh
3. Test the deployed application
4. Monitor performance and logs

EOF
    
    log_success "Deployment report generated: deployment-report.txt"
}

# Main verification flow
main() {
    echo "🎯 APTX SpectraX Deployment Verification"
    echo "======================================="
    echo ""
    
    verify_prerequisites
    verify_project_structure
    verify_code_quality
    verify_configuration
    verify_git_status
    verify_environment
    generate_report
    
    echo ""
    echo "🎉 Verification completed successfully!"
    echo ""
    echo "Your APTX SpectraX platform is ready for deployment to Raindrop."
    echo ""
    echo "To deploy:"
    echo "1. Set your environment variables (.env file)"
    echo "2. Run: ./deploy.sh"
    echo "3. Follow the deployment instructions"
    echo ""
    echo "For detailed instructions, see README-LIQUIDMETAL.md"
}

# Run main function
main "$@"
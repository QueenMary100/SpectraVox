# APTX SpectraX - LiquidMetal AI Implementation

## 🌟 Overview

APTX SpectraX is an adaptive learning platform specifically designed for children with Down syndrome, powered by LiquidMetal AI and deployed on Raindrop. This implementation includes modern tools, courses with Raindrop memory integration, and comprehensive support features.

## 🚀 Features

### 🧠 LiquidMetal AI Tools
- **Adaptive Learning Paths**: Personalized learning journeys based on individual needs
- **Content Generation**: AI-generated educational content with accommodations
- **Progress Analysis**: Real-time progress tracking with AI recommendations
- **Emotion Tracking**: Mood-based activity suggestions and adaptations

### 📚 Courses Section
- **Raindrop SmartBuckets**: Structured course storage and management
- **Adaptive Content**: Courses that adapt to different learning styles
- **Progress Tracking**: Comprehensive monitoring of student progress
- **Age-Appropriate Content**: Materials designed for different age groups

### 🛠️ Modern Learning Tools
- **Voice Assistant**: Speech recognition and text-to-speech capabilities
- **Interactive Games**: Adaptive educational games with visual supports
- **Art Studio**: Creative tools with accessibility features
- **Music Maker**: Audio-based learning with rhythm and patterns
- **Photo Fun**: Visual learning with augmented reality features
- **Social Stories**: Emotion and social skills development

### 🏗️ Raindrop Integration
- **SmartBuckets**: Organized data storage for users, courses, progress, and enrollments
- **SmartMemory**: Caching system for adaptive paths and sessions
- **SmartInference**: AI model execution for content generation
- **SmartSQL**: Query optimization for data analysis

## 📋 Installation & Setup

### Prerequisites
- Node.js 20+
- Raindrop CLI installed
- Raindrop account with SmartComponents access
- Google AI API key

### Environment Variables
```bash
RAINDROP_ENDPOINT="your-raindrop-endpoint"
RAINDROP_API_KEY="your-raindrop-api-key"
GOOGLE_AI_API_KEY="your-google-ai-api-key"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="your-app-url"
```

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start Genkit development server
npm run genkit:dev
```

## 🚀 Deployment to Raindrop

### Automatic Deployment
```bash
# Deploy with all SmartComponents
./deploy.sh
```

### Manual Deployment Steps

1. **Setup SmartBuckets**
```bash
rainbucket create users --schema-file schemas/users.json
rainbucket create courses --schema-file schemas/courses.json
rainbucket create progress --schema-file schemas/progress.json
rainbucket create enrollments --schema-file schemas/enrollments.json
```

2. **Configure SmartMemory**
```bash
rainmemory configure adaptive-paths --ttl "24h"
rainmemory configure user-sessions --ttl "8h"
rainmemory configure content-cache --ttl "1h"
rainmemory configure emotion-states --ttl "24h"
```

3. **Setup SmartInference**
```bash
raininference create liquidmetal-adaptive --model "gemini-2.5-flash"
raininference create content-generator --model "gemini-2.5-flash"
raininference create progress-analyzer --model "gemini-2.5-flash"
```

4. **Deploy Application**
```bash
raindrop deploy --config raindrop.yaml
```

## 📁 Project Structure

```
src/
├── ai/                           # LiquidMetal AI flows
│   ├── flows/
│   │   ├── liquidmetal-adaptive-learning.ts
│   │   ├── liquidmetal-content-generator.ts
│   │   └── liquidmetal-progress-tracker.ts
│   └── raindrop-smartcomponents.ts
├── app/
│   ├── api/raindrop/             # Raindrop API integration
│   ├── courses/                  # Courses section
│   └── tools/                    # Learning tools dashboard
├── components/
│   ├── liquidmetal/              # AI-powered components
│   │   └── adaptive-learning-interface.tsx
│   └── dashboard-layout.tsx      # Updated navigation
├── lib/
│   └── raindrop.ts               # Raindrop integration
├── schemas/                      # SmartBucket schemas
│   ├── users.json
│   ├── courses.json
│   ├── progress.json
│   └── enrollments.json
├── raindrop.yaml                 # Deployment configuration
└── deploy.sh                     # Deployment script
```

## 🎯 Key Components

### 1. Adaptive Learning Interface
- Personalized content delivery
- Real-time adaptations based on performance
- Multi-sensory support (visual, audio, kinesthetic)
- Progress tracking with AI insights

### 2. Courses System
- Structured learning paths with modules and activities
- Age-appropriate content for all age groups
- Accommodations for different learning needs
- AI-generated content when needed

### 3. Learning Tools Dashboard
- Emotion-based activity recommendations
- Interactive tools with accessibility features
- Voice and visual support throughout
- Progress celebration and motivation

### 4. Raindrop SmartComponents
- **SmartBuckets**: Data persistence and organization
- **SmartMemory**: Performance optimization
- **SmartInference**: AI model execution
- **SmartSQL**: Data analysis and reporting

## 🔧 Configuration

### Raindrop.yaml Configuration
The `raindrop.yaml` file contains all deployment settings including:
- Environment variables
- Resource allocation
- Auto-scaling rules
- SmartComponent configurations
- Security settings
- Monitoring and alerting

### SmartBucket Schemas
Each SmartBucket has a corresponding JSON schema in the `schemas/` directory:
- **users.json**: User profiles and preferences
- **courses.json**: Course content and structure
- **progress.json**: Student progress tracking
- **enrollments.json**: Course enrollment data

## 📊 Monitoring & Analytics

### Health Checks
- Application health: `/api/raindrop`
- Raindrop connection status
- SmartComponent availability

### Metrics Tracked
- User engagement and progress
- AI model performance
- System response times
- Error rates and success metrics

## 🎨 Accessibility Features

### Visual Supports
- High contrast modes
- Large text options
- Visual schedules and cues
- Image-based instructions

### Audio Supports
- Text-to-speech throughout
- Voice commands
- Audio feedback and cues
- Adjustable speech rates

### Interaction Supports
- Touch-friendly interfaces
- Simple gestures
- Keyboard navigation
- Switch device compatibility

### Cognitive Supports
- Simplified language
- Consistent layouts
- Predictable routines
- Step-by-step instructions

## 🔄 AI Flows

### 1. Adaptive Learning Path Generation
```typescript
const path = await generateAdaptiveLearningPath({
  studentId: "user123",
  ageGroup: "8-12 years",
  currentLevel: "beginner",
  learningGoals: ["Improve math skills"],
  specialNeeds: {
    cognitiveLevel: "moderate",
    attentionSpan: "15-20 minutes",
    preferredLearningStyle: ["visual", "kinesthetic"]
  },
  subjectArea: "Mathematics"
});
```

### 2. Content Generation
```typescript
const content = await generateLiquidMetalContent({
  topic: "Counting Numbers",
  ageGroup: "6-10 years",
  contentType: "activity",
  learningObjective: "Count to 10",
  specialNeeds: {
    cognitiveLevel: "moderate",
    preferredLearningStyle: ["visual"]
  },
  duration: "15 minutes"
});
```

### 3. Progress Analysis
```typescript
const analysis = await analyzeLiquidMetalProgress({
  studentId: "user123",
  learningPath: [...],
  currentGoals: ["Complete counting module"],
  specialNeeds: {
    cognitiveLevel: "moderate",
    preferredLearningStyle: ["visual"]
  }
});
```

## 🌐 Deployment URLs

After deployment, your application will be available at:
- Main app: `https://aptx-spectrax.raindrop.app`
- API: `https://aptx-spectrax.raindrop.app/api/raindrop`
- Health check: `https://aptx-spectrax.raindrop.app/api/raindrop`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally and deploy to staging
5. Submit a pull request

## 📞 Support

- Raindrop Documentation: https://docs.raindrop.app
- Genkit Documentation: https://firebase.google.com/docs/genkit
- Google AI API: https://ai.google.dev

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**APTX SpectraX** - Empowering children with Down syndrome through adaptive AI technology 🌈
# **App Name**: AptX: Inclusive AI Learning

## Core Features:

- Curriculum Upload & Processing: Teachers upload curriculum (PDF, DOCX, images). Document AI extracts text, Vertex AI Gemini simplifies content, generates visuals (Imagen 2), and creates audio narration (Cloud Text-to-Speech). Data is stored in Firestore and Cloud Storage.
- Adaptive Exam Generation: Generate multiple-choice (2-3 options), image-based, and audio questions from curriculum using Vertex AI Gemini, with adaptive difficulty based on student performance. Scoring and explanations are provided.
- Personalized Learning Experience: Students access simplified lessons with large buttons, one concept per screen, audio playback, visual storyboards, repeat options, minimal text, and high contrast.
- Guardian Progress Dashboard: Guardians track student progress, time spent per lesson, difficulty level, suggested revisions, and social/emotional indicators.
- Role-Based Authentication: Secure user authentication using Google Identity Platform with email/password and middleware-based role protection for teachers, guardians, and students.
- AI-Powered Content Simplification: Utilize Vertex AI Gemini as a tool to simplify complex curriculum content into smaller, child-friendly chunks with appropriate descriptions.
- Real-time Adaptive learning and remediation: The system tracks each student and, as needed, initiates a lesson to refresh their knowledge of any previous skills required in order to proceed to more advanced material.

## Style Guidelines:

- Primary color: Sky blue (#87CEEB) to promote a sense of calm and focus.
- Background color: Light gray (#F0F0F0) to ensure high contrast and reduce eye strain.
- Accent color: Soft orange (#FFB347) for interactive elements to grab attention without being overbearing.
- Body and headline font: 'PT Sans' for a modern look that's friendly and accessible.
- Code font: 'Source Code Pro' for clear display of configuration.
- Use simple, clear icons to visually represent concepts and actions. The icons must use sufficient stroke width to improve accessibility.
- The interface features a clear, linear layout with generous spacing between elements, large tap targets, and minimal on-screen distractions, to facilitate simple navigation.
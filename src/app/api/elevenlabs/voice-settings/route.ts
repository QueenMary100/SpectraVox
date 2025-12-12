import { NextResponse } from 'next/server';

interface VoiceSettings {
  voiceId: string;
  stability: number;
  similarity_boost: number;
  style: number;
  use_speaker_boost: boolean;
  model_id: string;
}

// Available voices for children with Down syndrome
const CHILD_FRIENDLY_VOICES = [
  {
    id: 'Lily',
    voice_id: 'pNInz6obpgDQGcFmaJgB',
    name: 'Lily - Gentle Female',
    description: 'Soft, nurturing voice perfect for storytelling'
  },
  {
    id: 'Sam',
    voice_id: 'IKne3meq5aSn9KDjJd5qU',
    name: 'Sam - Friendly Male',
    description: 'Warm, encouraging voice for instructions'
  },
  {
    id: 'Ruby',
    voice_id: 'D38z5RxDW7weeaXLiU28p',
    name: 'Ruby - Cheerful Female',
    description: 'Bright, happy voice for positive reinforcement'
  },
  {
    id: 'Leo',
    voice_id: 'TX3LMaTeBmr4hYm6Q9Iu',
    name: 'Leo - Calm Male',
    description: 'Soothing voice for relaxing activities'
  }
];

// Optimized settings for children with special needs
const OPTIMIZED_SETTINGS: VoiceSettings = {
  voice_id: 'pNInz6obpgDQGcFmaJgB', // Lily (gentle female)
  stability: 0.75,          // Higher stability for consistency
  similarity_boost: 0.70,   // Enhanced similarity for clarity
  style: 0.5,              // Neutral style
  use_speaker_boost: true,  // Enhanced audio quality
  model_id: 'eleven_multilingual_v2' // Best for clear speech
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Get available voices
    if (body.action === 'get_voices') {
      return NextResponse.json({
        voices: CHILD_FRIENDLY_VOICES,
        recommended: OPTIMIZED_SETTINGS
      });
    }

    // Update voice settings
    if (body.action === 'update_settings') {
      const settings: VoiceSettings = {
        ...OPTIMIZED_SETTINGS,
        ...body.settings
      };

      // Validate settings
      if (settings.stability < 0 || settings.stability > 1 ||
          settings.similarity_boost < 0 || settings.similarity_boost > 1 ||
          settings.style < 0 || settings.style > 1) {
        return NextResponse.json(
          { error: 'Invalid voice settings. Values must be between 0 and 1.' },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        settings,
        message: 'Voice settings updated successfully'
      });
    }

    // Test voice with sample text
    if (body.action === 'test_voice') {
      const { voiceId, text = "Hello! This is a test of your voice settings." } = body;
      
      if (!voiceId) {
        return NextResponse.json(
          { error: 'Voice ID is required for testing' },
          { status: 400 }
        );
      }

      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': process.env.ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: OPTIMIZED_SETTINGS
        })
      });

      if (!response.ok) {
        const error = await response.text();
        return NextResponse.json(
          { error: `ElevenLabs API error: ${error}` },
          { status: response.status }
        );
      }

      const audioBuffer = await response.arrayBuffer();
      const base64Audio = Buffer.from(audioBuffer).toString('base64');

      return NextResponse.json({
        success: true,
        audioData: `data:audio/mpeg;base64,${base64Audio}`,
        message: 'Voice test generated successfully'
      });
    }

    return NextResponse.json(
      { error: 'Invalid action specified' },
      { status: 400 }
    );

  } catch (error) {
    console.error('ElevenLabs voice settings error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
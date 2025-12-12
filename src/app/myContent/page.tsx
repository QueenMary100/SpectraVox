"use client";

import React, { useState, useRef } from 'react';

type Message = { id: string; role: 'user' | 'assistant'; text: string };

export default function MyContentPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  async function sendMessage() {
    if (!input.trim()) return;
    const userMessage: Message = { id: String(Date.now()), role: 'user', text: input.trim() };
    setMessages((m) => [...m, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/raindrop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: 'smartinference.run', input: { prompt: userMessage.text } }),
      });
      const data = await res.json();
      const assistantText = (data?.output || data?.text || JSON.stringify(data)).toString();
      const assistantMessage: Message = { id: String(Date.now() + 1), role: 'assistant', text: assistantText };
      setMessages((m) => [...m, assistantMessage]);
    } catch (err) {
      const assistantMessage: Message = { id: String(Date.now() + 1), role: 'assistant', text: 'Error generating response.' };
      setMessages((m) => [...m, assistantMessage]);
    } finally {
      setLoading(false);
    }
  }

  async function generateAudio(messageText?: string) {
    const text = messageText ?? messages[messages.length - 1]?.text ?? '';
    if (!text) return;
    setLoading(true);
    try {
      const res = await fetch('/api/elevenlabs/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice: 'alloy' }),
      });
      const data = await res.json();
      if (data?.audio && data?.contentType) {
        const src = `data:${data.contentType};base64,${data.audio}`;
        if (!audioRef.current) audioRef.current = new Audio();
        audioRef.current.src = src;
        await audioRef.current.play();
      }
    } catch (err) {
      console.error('TTS error', err);
    } finally {
      setLoading(false);
    }
  }

  function downloadDocument() {
    const content = messages.map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.text}`).join('\n\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mycontent.txt';
    a.click();
    URL.revokeObjectURL(url);
  }

  async function generateVideo() {
    // placeholder: ask the server to generate a script / placeholder video asset
    setLoading(true);
    try {
      const res = await fetch('/api/video/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: messages.map((m) => `${m.role}: ${m.text}`).join('\n') }),
      });
      const data = await res.json();
      if (data?.videoUrl) {
        window.open(data.videoUrl, '_blank');
      } else if (data?.script) {
        alert('Generated video script:\n\n' + data.script);
      }
    } catch (err) {
      console.error('Video generation error', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">My Content</h1>
      <div className="mb-4 rounded-lg border bg-card p-4">
        <div className="mb-3 max-h-72 overflow-auto">
          {messages.length === 0 && <p className="text-muted-foreground">Start a chat to generate content.</p>}
          {messages.map((m) => (
            <div key={m.id} className={m.role === 'user' ? 'mb-3 text-right' : 'mb-3'}>
              <div className={m.role === 'user' ? 'inline-block rounded-lg bg-primary px-3 py-2 text-white' : 'inline-block rounded-lg bg-muted px-3 py-2'}>
                {m.text}
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            className="flex-1 rounded-md border px-3 py-2"
            placeholder="Say something..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
          />
          <button className="btn" onClick={sendMessage} disabled={loading}>Send</button>
          <button className="btn" onClick={() => generateAudio()} disabled={loading}>Audio</button>
          <button className="btn" onClick={downloadDocument}>Document</button>
          <button className="btn" onClick={generateVideo} disabled={loading}>Video</button>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">Audio uses ElevenLabs via server route; video is a placeholder using Raindrop smart inference.</p>
    </div>
  );
}

'use client';

import { useCallback, useRef, useEffect } from 'react';
import { Send, Loader2, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useChatStore } from '@/store/chat-store';
import { ChatMessage } from './ChatMessage';
import { Button } from '@/components/ui/Button';

const QUICK_CHIPS = [
  'Best noise-cancelling headphones under £200?',
  'Compare Dyson V15 vs Shark Stratos',
  'Is now a good time to buy a 4K TV?',
  'Cheapest MacBook Air M3 right now?',
];

export function AIAssistant() {
  const { messages, isStreaming, addMessage, appendToLastMessage, setStreaming } = useChatStore();
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;

    addMessage({ role: 'user', content: trimmed });
    setInput('');
    setStreaming(true);

    addMessage({ role: 'assistant', content: '' });

    try {
      const allMessages = useChatStore.getState().messages;
      const apiMessages = allMessages.slice(0, -1).map(m => ({ role: m.role, content: m.content }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...apiMessages, { role: 'user', content: trimmed }] }),
      });

      if (!res.body) throw new Error('No stream');
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.type === 'content_block_delta' && data.delta?.type === 'text_delta') {
              appendToLastMessage(data.delta.text);
            }
          } catch { /* skip non-JSON lines */ }
        }
      }
    } catch {
      appendToLastMessage('Sorry, something went wrong. Please try again.');
    } finally {
      setStreaming(false);
    }
  }, [isStreaming, addMessage, appendToLastMessage, setStreaming]);

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] min-h-[500px]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-12 h-12 bg-scout-dark rounded-2xl flex items-center justify-center mb-4">
              <Sparkles size={20} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-scout-dark mb-2">Ask Scout anything</h2>
            <p className="text-scout-muted text-sm max-w-sm mb-6">
              Get personalised shopping advice, price comparisons, and deal alerts from our AI assistant.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {QUICK_CHIPS.map(chip => (
                <button
                  key={chip}
                  onClick={() => sendMessage(chip)}
                  className="px-4 py-2 bg-white border border-scout-border rounded-xl text-sm text-scout-dark hover:border-scout-dark transition-colors text-left"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map(msg => (
            <ChatMessage key={msg.id} message={msg} />
          ))
        )}
        {isStreaming && messages[messages.length - 1]?.role === 'assistant' && !messages[messages.length - 1]?.content && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-scout-bg border border-scout-border flex items-center justify-center text-xs font-bold text-scout-muted">S</div>
            <div className="bg-white border border-scout-border rounded-2xl px-4 py-3">
              <Loader2 size={16} className="text-scout-muted animate-spin" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-scout-border bg-white p-4">
        <div className="flex gap-3 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
            placeholder="Ask about prices, comparisons, or deals…"
            rows={1}
            className="flex-1 resize-none bg-scout-bg border border-scout-border rounded-xl px-4 py-3 text-sm text-scout-dark placeholder:text-scout-muted focus:outline-none focus:ring-2 focus:ring-scout-dark/20 focus:border-scout-dark transition-all"
          />
          <Button
            variant="primary"
            size="icon"
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isStreaming}
          >
            {isStreaming ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </Button>
        </div>
      </div>
    </div>
  );
}

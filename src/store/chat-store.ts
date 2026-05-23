import { create } from 'zustand';
import type { ChatMessage } from '@/types';

interface ChatState {
  messages: ChatMessage[];
  isStreaming: boolean;
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  appendToLastMessage: (chunk: string) => void;
  setStreaming: (streaming: boolean) => void;
  clear: () => void;
}

export const useChatStore = create<ChatState>()((set) => ({
  messages: [],
  isStreaming: false,
  addMessage: (message) =>
    set((s) => ({
      messages: [...s.messages, {
        ...message,
        id: `${Date.now()}-${Math.random()}`,
        timestamp: new Date(),
      }],
    })),
  appendToLastMessage: (chunk) =>
    set((s) => {
      if (s.messages.length === 0) return s;
      const messages = [...s.messages];
      messages[messages.length - 1] = {
        ...messages[messages.length - 1],
        content: messages[messages.length - 1].content + chunk,
      };
      return { messages };
    }),
  setStreaming: (isStreaming) => set({ isStreaming }),
  clear: () => set({ messages: [], isStreaming: false }),
}));

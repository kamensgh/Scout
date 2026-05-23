import { cn } from '@/lib/utils';
import type { ChatMessage as ChatMessageType } from '@/types';

interface ChatMessageProps {
  message: ChatMessageType;
}

function renderMarkdown(text: string) {
  return text
    .split('\n')
    .map((line) => {
      const bold = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      if (line.startsWith('- ') || line.startsWith('• ')) {
        return `<li class="ml-4 list-disc">${bold.slice(2)}</li>`;
      }
      if (line.trim() === '') return '<br/>';
      return `<p>${bold}</p>`;
    })
    .join('');
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={cn('flex gap-3', isUser && 'flex-row-reverse')}>
      {/* Avatar */}
      <div className={cn(
        'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-1',
        isUser ? 'bg-scout-dark text-white' : 'bg-scout-bg border border-scout-border text-scout-muted'
      )}>
        {isUser ? 'You' : 'S'}
      </div>

      {/* Bubble */}
      <div className={cn(
        'max-w-[80%] rounded-2xl px-4 py-3 text-sm',
        isUser
          ? 'bg-scout-dark text-white rounded-tr-sm'
          : 'bg-white border border-scout-border text-scout-dark rounded-tl-sm'
      )}>
        <div
          className="leading-relaxed prose-sm space-y-1"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }}
        />
        <time className={cn('text-xs mt-2 block', isUser ? 'text-white/50' : 'text-scout-muted')}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </time>
      </div>
    </div>
  );
}

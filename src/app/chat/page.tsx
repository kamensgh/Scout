import { AIAssistant } from '@/components/ai/AIAssistant';

export const metadata = {
  title: 'AI Assistant',
  description: 'Ask Scout anything about prices, products, and deals. Get instant recommendations and price comparisons.',
  openGraph: {
    title: 'AI Shopping Assistant — Scout',
    description: 'Ask Scout anything about prices, products, and deals.',
  },
};

export default function ChatPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <p className="section-label mb-1">AI Assistant</p>
        <h1 className="text-2xl font-bold text-scout-dark">Ask Scout anything</h1>
      </div>
      <div className="bg-white border border-scout-border rounded-2xl overflow-hidden">
        <AIAssistant />
      </div>
    </div>
  );
}

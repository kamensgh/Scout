import Anthropic from '@anthropic-ai/sdk';
import type { ParsedSearchIntent, Product } from '@/types';

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) {
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return client;
}

export async function parseSearchIntent(query: string): Promise<ParsedSearchIntent> {
  const anthropic = getClient();
  const fallback: ParsedSearchIntent = {
    query,
    nearMe: false,
    sortBy: 'relevance',
    filters: {},
  };

  try {
    const msg = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 256,
      system: `Extract shopping search intent from query. Return JSON only:
{"query":"original","category":"audio|computing|tvs|home|kitchen|furniture|diy|sports|null","maxPricePence":number_or_null,"brand":"string_or_null","nearMe":bool,"sortBy":"relevance|price_asc|price_desc|rating|distance","filters":{}}`,
      messages: [{ role: 'user', content: query }],
    });

    const text = msg.content[0].type === 'text' ? msg.content[0].text : '';
    const json = text.match(/\{[\s\S]*\}/)?.[0];
    if (!json) return fallback;
    const parsed = JSON.parse(json);
    return { ...fallback, ...parsed };
  } catch {
    return fallback;
  }
}

export async function generateComparisonSummary(products: Product[]): Promise<string> {
  const anthropic = getClient();
  const summaries = products.map(
    (p) => `${p.name} — lowest £${(p.lowestPricePence / 100).toFixed(2)}, rated ${p.rating}/5`
  );

  const msg = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 512,
    system: 'You are a concise UK shopping assistant. Write 2-3 sentences comparing these products. Focus on value for money. British English.',
    messages: [{ role: 'user', content: summaries.join('\n') }],
  });

  return msg.content[0].type === 'text' ? msg.content[0].text : '';
}

export function createChatStream(messages: { role: 'user' | 'assistant'; content: string }[]) {
  const anthropic = getClient();
  return anthropic.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: `You are Scout's AI shopping assistant. Help UK shoppers find the best deals. Be concise, friendly, and value-focused. Use British English. When recommending products, mention current prices and which retailers stock them.`,
    messages,
  });
}

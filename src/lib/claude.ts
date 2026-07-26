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
    (p) => `${p.name} — lowest price ${(p.lowestPricePence / 100).toFixed(2)}, rated ${p.rating}/5`
  );

  const msg = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 512,
    system: 'You are a concise shopping assistant. Write 2-3 sentences comparing these products. Focus on value for money.',
    messages: [{ role: 'user', content: summaries.join('\n') }],
  });

  return msg.content[0].type === 'text' ? msg.content[0].text : '';
}

export async function generateProductDetails(
  name: string,
  category: string,
  lowestPricePence: number,
  storeCount: number,
): Promise<{ description: string; specs: Record<string, string> }> {
  const anthropic = getClient();
  const fallback = {
    description: `${name} available from ${storeCount} retailer${storeCount !== 1 ? 's' : ''}.`,
    specs: {} as Record<string, string>,
  };

  try {
    const msg = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      system: `You are a product database. Given a product name, category, and price, return a JSON object with:
- "description": 2 sentences describing the product and its key benefits
- "specs": 5-7 key specification key-value pairs relevant to that product category

Return JSON only, no markdown fences.`,
      messages: [{
        role: 'user',
        content: `Name: ${name}\nCategory: ${category}\nPrice: ${(lowestPricePence / 100).toFixed(2)}\nRetailers: ${storeCount}`,
      }],
    });

    const text = msg.content[0].type === 'text' ? msg.content[0].text : '';
    const json = text.match(/\{[\s\S]*\}/)?.[0];
    if (!json) return fallback;
    const parsed = JSON.parse(json);
    return {
      description: parsed.description || fallback.description,
      specs: parsed.specs || {},
    };
  } catch {
    return fallback;
  }
}

export function createChatStream(messages: { role: 'user' | 'assistant'; content: string }[]) {
  const anthropic = getClient();
  return anthropic.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: `You are Scout's AI shopping assistant. Help shoppers worldwide find the best deals. Be concise, friendly, and value-focused. When recommending products, mention current prices and which retailers stock them.`,
    messages,
  });
}

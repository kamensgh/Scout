import { readFileSync, existsSync } from 'fs';
import Anthropic from '@anthropic-ai/sdk';

type ImageMediaType = 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';

export async function verifyScreenshot(
  imagePath: string,
  habitName: string,
  apiKey: string,
): Promise<{ verified: boolean; explanation: string }> {
  if (!existsSync(imagePath)) {
    return { verified: false, explanation: `File not found: ${imagePath}` };
  }

  const ext = imagePath.split('.').pop()?.toLowerCase();
  const mediaTypeMap: Record<string, ImageMediaType> = {
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    webp: 'image/webp',
  };
  const mediaType: ImageMediaType = (ext && mediaTypeMap[ext]) || 'image/png';

  try {
    const imageData = readFileSync(imagePath);
    const base64 = imageData.toString('base64');

    const client = new Anthropic({ apiKey });
    const response = await client.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 200,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64 } },
            {
              type: 'text',
              text: `Does this screenshot show evidence that someone completed the habit: "${habitName}"?\n\nReply with exactly YES or NO on the first line, then one sentence explaining why.`,
            },
          ],
        },
      ],
    });

    const text = response.content[0]?.type === 'text' ? response.content[0].text.trim() : '';
    const verified = text.toUpperCase().startsWith('YES');
    return { verified, explanation: text };
  } catch (e) {
    return { verified: false, explanation: `AI verification failed: ${String(e)}` };
  }
}

import { OpenAI } from 'openai';

const getClient = () => {
  if (!process.env.OPENAI_API_KEY) {
    throw Object.assign(new Error('OPENAI_API_KEY is not configured'), { status: 503 });
  }

  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
};

export const parseRefurbScope = async ({ text, sqft }) => {
  const prompt = `
    As a UK Quantity Surveyor, analyze this refurb scope: "${text}".
    The property is ${sqft} sqft.
    Return a JSON object with estimated costs for:
    rewire, plumbing, kitchen, bathroom, decoration, and structural.
    Use current UK average rates.
    Format: { "items": [{ "name": string, "cost": number, "confidence": number }] }
  `;

  const completion = await getClient().chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'gpt-3.5-turbo-1106',
    response_format: { type: 'json_object' },
  });

  return JSON.parse(completion.choices[0].message.content);
};

import OpenAI from "openai";

export async function callQwen(messages, options = {}) {
  const openai = new OpenAI();
  const stream = await openai.chat.completions.create({
    model: options.model || "gpt-4.1-mini",
    messages,
    temperature: options.temperature ?? 0.7,
    max_tokens: options.max_tokens ?? 2048,
    stream: true,
  });

  return stream;
}
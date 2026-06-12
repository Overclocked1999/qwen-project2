const QWEN_API_URL = process.env.QWEN_API_URL || "https://integrate.api.nvidia.com/v1/chat/completions";
const QWEN_API_KEY = process.env.QWEN_API_KEY;

export async function callQwen(messages, options = {}) {
  const res = await fetch(QWEN_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${QWEN_API_KEY}`,
      "Content-Type": "application/json",
      "Accept": "text/event-stream",
    },
    body: JSON.stringify({
      model: options.model || "qwen/qwen3.5-397b-a17b",
      messages,
      temperature: options.temperature ?? 0.7,
      top_p: options.top_p ?? 0.8,
      max_tokens: options.max_tokens ?? 2048,
      stream: options.stream ?? true,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }

  return res;
}
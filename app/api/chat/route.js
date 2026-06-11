import { callQwen } from "@/lib/qwen";

export async function POST(req) {
  try {
    const { messages } = await req.json();

    const res = await callQwen(messages);

    return new Response(res.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });

  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500 }
    );
  }
}
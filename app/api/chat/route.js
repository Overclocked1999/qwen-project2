import { callQwen } from "@/lib/qwen";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const { messages } = await req.json();

    const stream = await callQwen(messages);

    return new Response(stream.toReadableStream(), {
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
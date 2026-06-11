"use client";

import { useState, useRef, useEffect } from "react";

type Msg = {
  role: "user" | "assistant";
  content: string;
};

export default function Page() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userMsg: Msg = { role: "user", content: input };
    const updated = [...messages, userMsg];

    setMessages(updated);
    setInput("");
    setLoading(true);

    const assistantIndex = updated.length;

    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "" },
    ]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updated }),
      });

      if (!res.body) throw new Error("No stream");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      let buffer = "";
      let fullText = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;

          const data = line.replace("data: ", "").trim();

          if (data === "[DONE]") continue;

          try {
            const json = JSON.parse(data);
            const token = json?.choices?.[0]?.delta?.content;

            if (token) {
              fullText += token;

              setMessages((prev) => {
                const copy = [...prev];
                copy[assistantIndex] = {
                  role: "assistant",
                  content: fullText,
                };
                return copy;
              });
            }
          } catch {}
        }
      }
    } catch (err: any) {
      setMessages((prev) => {
        const copy = [...prev];
        copy[assistantIndex] = {
          role: "assistant",
          content: "Error: " + err.message,
        };
        return copy;
      });
    }

    setLoading(false);
  }

  return (
    <div style={styles.page}>
      <div ref={chatRef} style={styles.chat}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              ...styles.msg,
              alignSelf: m.role === "user" ? "flex-end" : "flex-start",
              background: m.role === "user" ? "#2b6cff" : "#1f1f1f",
            }}
          >
            {m.content}
          </div>
        ))}

        {loading && (
          <div style={{ ...styles.msg, background: "#1f1f1f" }}>
            Thinking...
          </div>
        )}
      </div>

      <div style={styles.inputBar}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Message..."
          style={styles.input}
          disabled={loading}
        />

        <button
          onClick={sendMessage}
          disabled={loading}
          style={styles.button}
        >
          Send
        </button>
      </div>
    </div>
  );
}

const styles: any = {
  page: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "#0f0f0f",
    color: "white",
    fontFamily: "Arial",
  },

  chat: {
    flex: 1,
    padding: 20,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    overflowY: "auto",
  },

  msg: {
    padding: 12,
    borderRadius: 12,
    maxWidth: "75%",
    whiteSpace: "pre-wrap",
    lineHeight: 1.4,
  },

  inputBar: {
    display: "flex",
    padding: 10,
    background: "#151515",
    gap: 10,
  },

  input: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    border: "none",
    outline: "none",
    background: "#222",
    color: "white",
    resize: "none",
    height: 60,
  },

  button: {
    padding: "10px 16px",
    borderRadius: 10,
    border: "none",
    background: "#2b6cff",
    color: "white",
    cursor: "pointer",
  },
};
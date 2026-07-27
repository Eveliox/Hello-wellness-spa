import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { CHAT_SYSTEM_PROMPT } from "@/lib/chat-prompt";

export const runtime = "nodejs";

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(2000),
});

const bodySchema = z.object({
  messages: z.array(messageSchema).min(1).max(20),
});

export async function POST(request: Request) {
  const rl = await checkRateLimit(request, "chat");
  if (!rl.allowed) return rateLimitResponse(rl);

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json(
      { ok: false, message: "Chat is not configured." },
      { status: 503 },
    );
  }

  let parsed;
  try {
    parsed = bodySchema.safeParse(await request.json());
  } catch {
    return Response.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }
  if (!parsed.success) {
    return Response.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  const client = new Anthropic({ apiKey });

  const stream = client.messages.stream({
    model: "claude-haiku-4-5",
    max_tokens: 512,
    system: [
      {
        type: "text",
        text: CHAT_SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: parsed.data.messages,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
      } catch (error) {
        console.error("[chat] stream error", error);
        controller.enqueue(
          encoder.encode(
            "\n\nSorry — something went wrong. Try WhatsApp or call us and we'll help right away.",
          ),
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}

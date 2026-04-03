import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    const message = await client.messages.create({
      model: "claude-opus-4-20250514",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      return NextResponse.json(
        { error: "Unexpected response type" },
        { status: 500 },
      );
    }

    return NextResponse.json({ content: content.text });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "AI request failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

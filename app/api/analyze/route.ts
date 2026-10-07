import { NextRequest, NextResponse } from "next/server";
import { getOpenAI } from "@/lib/openai";
import { getTask } from "@/lib/tasks";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const taskId = body?.taskId as string | undefined;
  const facts = (body?.facts as string | undefined)?.trim();

  if (!taskId || !facts) {
    return NextResponse.json(
      { error: "Тапсырма түрі мен фактілерді толтырыңыз." },
      { status: 400 }
    );
  }

  const task = getTask(taskId);
  if (!task) {
    return NextResponse.json({ error: "Белгісіз тапсырма түрі." }, { status: 400 });
  }

  let openai;
  try {
    openai = getOpenAI();
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "OpenAI кілті табылмады." },
      { status: 500 }
    );
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.4,
      messages: [
        { role: "system", content: task.systemPrompt },
        { role: "user", content: facts },
      ],
    });

    const result = completion.choices[0]?.message?.content ?? "";
    return NextResponse.json({ result });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "OpenAI сұранысы сәтсіз аяқталды." },
      { status: 502 }
    );
  }
}

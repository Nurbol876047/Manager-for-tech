import { NextRequest, NextResponse } from "next/server";
import { getOpenAI } from "@/lib/openai";

const SYSTEM_PROMPT = `Сен білім беру ұйымдарын басқару бойынша тәжірибелі кеңесші-сарапшысың.
Директорлардың, завучтардың, әдіскерлердің күнделікті басқарушылық сұрақтарына қазақ тілінде
қысқа, нақты және іс жүзінде қолдануға болатын жауап бер. Қажет болса тізім/қадамдар түрінде жаз.
Заңнамалық/нормативтік мәселелерде түпкілікті шешімді ресми құжаттардан және уәкілетті органнан
тексеру керектігін ескерт, бірақ алдымен нақты, пайдалы кеңес бер.`;

type ChatMessage = { role: "user" | "assistant"; content: string };

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const messages = body?.messages as ChatMessage[] | undefined;

  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "Хабарлама бос болмауы керек." }, { status: 400 });
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
      temperature: 0.5,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
    });

    const reply = completion.choices[0]?.message?.content ?? "";
    return NextResponse.json({ reply });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "OpenAI сұранысы сәтсіз аяқталды." },
      { status: 502 }
    );
  }
}

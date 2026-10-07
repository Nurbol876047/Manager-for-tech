import { NextRequest, NextResponse } from "next/server";
import { getOpenAI } from "@/lib/openai";

const SYSTEM_PROMPT = (count: number) => `Сен пән мұғалімдеріне және әдіскерлерге арналған тест құрастырушысың.
Пайдаланушы жазған тақырып, сынып деңгейі және пән бойынша қазақ тілінде тест құр.

Талаптар:
- Сұрақ саны: дәл ${count}.
- Әр сұрақ 4 жауап нұсқасымен берілсін (A, B, C, D).
- Сұрақтар тақырыпқа және сынып деңгейіне сай, оқу бағдарламасына сәйкес болсын.
- Қиындық деңгейі аралас болсын (жеңілден қиынға қарай).

Жауапты міндетті түрде осы екі бөліммен бер:
## Тест сұрақтары
(нөмірленген сұрақтар, әр сұрақтың астында A–D нұсқалары)
## Жауаптар кілті
(әр сұрақ нөміріне қарсы дұрыс жауап әрпі, қысқа түсіндірмемен)`;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const prompt = (body?.prompt as string | undefined)?.trim();
  const rawCount = Number(body?.count);
  const count = Number.isFinite(rawCount)
    ? Math.min(30, Math.max(1, Math.round(rawCount)))
    : 10;

  if (!prompt) {
    return NextResponse.json(
      { error: "Тест тақырыбын жазыңыз." },
      { status: 400 }
    );
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
        { role: "system", content: SYSTEM_PROMPT(count) },
        { role: "user", content: prompt },
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

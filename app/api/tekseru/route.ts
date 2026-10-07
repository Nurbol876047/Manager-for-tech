import { NextRequest, NextResponse } from "next/server";
import { getOpenAI } from "@/lib/openai";

const SYSTEM_PROMPT = `Сен мектеп/білім беру ұйымының тапсырмалар мен құжаттарының сапасын тексеретін сарапшысың.
Саған оқушының немесе мұғалімнің жұмысының суреті (фото) немесе мәтіні беріледі, қосымша контекст жазылуы мүмкін.

МАҢЫЗДЫ ШЕКТЕУ: саған интернетке және дайын жұмыстар базасына қолжетімділік жоқ, сондықтан нақты
антиплагиат пайызын (мысалы "87% бірегей") ЕШҚАШАН берме. Тек мәтіндік белгілер негізінде болжам жаса
(стиль бірізділігі, дайын үлгіге ұқсас жалпылама сөз тіркестері, қайталанулар, жас ерекшелігіне сәйкессіздік және т.б.).

Жауапты қазақ тілінде, міндетті түрде осы бөлімдермен бер:
## Мазмұны бойынша қысқаша сипаттама
## Сапа/дұрыстық бағасы (нақты қателер мен кемшіліктерді көрсет)
## Өзіндік белгілер бойынша болжам ("өзіндік болуы ықтимал" / "қосымша тексеру қажет" / "анықтау мүмкін емес" — себебін түсіндір)
## Басшылыққа/әдіскерге ұсыныс (келесі қадам)

Соңғы жолда міндетті түрде ескерт: "Бұл — дерекқормен салыстыру емес, тек AI-талдау, түпкілікті шешімді адам қабылдауы керек."`;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const imageBase64 = body?.imageBase64 as string | undefined;
  const mimeType = body?.mimeType as string | undefined;
  const text = (body?.text as string | undefined)?.trim();
  const context = (body?.context as string | undefined)?.trim();

  if (!imageBase64 && !text) {
    return NextResponse.json(
      { error: "Сурет жүктеңіз немесе мәтінді енгізіңіз." },
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

  const userContent: Array<
    | { type: "text"; text: string }
    | { type: "image_url"; image_url: { url: string } }
  > = [];

  userContent.push({
    type: "text",
    text: context ? `Контекст: ${context}` : "Контекст берілмеген.",
  });

  if (text) {
    userContent.push({ type: "text", text: `Тексерілетін мәтін:\n${text}` });
  }
  if (imageBase64 && mimeType) {
    userContent.push({
      type: "image_url",
      image_url: { url: `data:${mimeType};base64,${imageBase64}` },
    });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.3,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userContent },
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

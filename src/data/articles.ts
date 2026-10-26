export type Article = {
  id: string;
  title: string;
  summary: string;
  body: string;
  updatedAt: string;
  sourceUrl?: string;
};

export const articles: Article[] = [
  {
    id: 'anmeldung',
    title: 'Anmeldung — Wohnsitz anmelden',
    summary: 'Sida aad isku diiwaan gelinayso deegaanka aad ku nooshahay.',
    body:
      'Markaad guri cusub gasho, waa inaad 14 maalmood gudahood isku diiwaan geliso xafiiska degmadaada (Bürgeramt). ' +
      'Waxaad u baahan tahay: aqoonsiga (Pass), heshiiska guriga (Mietvertrag), iyo foomka ay bixiyaan xafiiska. ' +
      'Diiwaangelintu waxay muhiim u tahay furista akoonka bangiga, iyo helista waxbarashada afka Jarmalka.',
    updatedAt: '2026-10-26',
    sourceUrl: 'https://www.bmi.bund.de/',
  },
  {
    id: 'krankenversicherung',
    title: 'Krankenversicherung — Caymiska caafimaadka',
    summary: 'Caymiska caafimaadka waa qasab Jarmalka gudihiisa.',
    body:
      'Qof kasta oo Jarmalka ku nool waa inuu lahaadaa caymis caafimaad (Krankenversicherung). ' +
      'Haddii aad shaqeyso, shaqo-bixiyahaaga ayaa qayb ka bixinaya. Haddii aadan shaqeyn, waxaad ku biiri kartaa ' +
      'caymiska dadweynaha (gesetzliche Krankenversicherung) ama mid gaar ah (private). ' +
      'La xiriir xafiiska caymiska si aad u hesho macluumaad sax ah.',
    updatedAt: '2026-10-26',
  },
  {
    id: 'deutschkurse',
    title: 'Deutschkurse — Koorsooyinka afka Jarmalka',
    summary: 'Sida loo helo koorso af Jarmalka oo lacag la’aan ah ama jaban.',
    body:
      'Koorsooyinka afka Jarmalka ee loo yaqaan Integrationskurs waxaa bixiya BAMF. Qof kasta oo awood u leh ' +
      'waa inuu codsado. Waxaa jira koorsooyin A1 ilaa B1. Qaar ka mid ah waa lacag la’aan haddii aad hesho oggolaansho. ' +
      'La xiriir xafiiskaaga maxalliga ah (Ausländerbehörde ama Jobcenter) si aad u ogaato sida loo codsado.',
    updatedAt: '2026-10-26',
  },
  {
    id: 'notruf',
    title: 'Notrufnummern — Lambarrada degdegga',
    summary: 'Lambarrada muhiimka ah ee xaaladaha degdegga ah.',
    body:
      '112 — Dab damis iyo ambalaas (europäische Notrufnummer).\n' +
      '110 — Booliska.\n' +
      '116 117 — Dhakhtarka xilliga habeenkii iyo fasaxyada (ärztlicher Bereitschaftsdienst).\n' +
      'Waxaad wici kartaa 112 xitaa haddii aadan af Jarmalka ku hadlin — waxay ku hadlaan Ingiriisi.',
    updatedAt: '2026-10-26',
  },
  {
    id: 'kindergeld',
    title: 'Kindergeld — Lacagta carruurta',
    summary: 'Lacagta dawladda siiso waalidka carruurta.',
    body:
      'Kindergeld waa lacag dawladeed oo la siiyo waalidka carruurta ka yar 18 sano (ama ilaa 25 haddii ay wax baranayaan). ' +
      'Waxaad ka codsan kartaa xafiiska Familienkasse. Waxaad u baahan tahay aqoonsi, iyo caddaynta inaad Jarmalka ku nooshahay. ' +
      'Xaddiga lacagtu wuu kala duwan yahay sanad kasta.',
    updatedAt: '2026-10-26',
  },
];
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
    summary: 'Sida aad isku diiwaan gelinayso deegaanka aad ku nooshahay iyo dukumintiyada loo baahan yahay.',
    body:
      'Markaad guri cusub gasho ama aad Jarmalka usoo guurto, waa inaad sharci ahaan 14 maalmood gudahood isku diiwaan geliso xafiiska muwaadiniinta ee degmadaada (Bürgeramt ama Bürgerbüro). ' +
      'Kudiiwaangelinta guriga waa mid dadka dhan ku qasab ah. ' +
      'Waxaad u baahan tahay dukumintiyadan:\n' +
      '1. Baasaboor ama kaarka aqoonsiga rasmiga ah (Pass / Personalausweis).\n' +
      '2. Heshiiska guriga (Mietvertrag).\n' +
      '3. Foomka caddaynta milkiilaha guriga (Wohnungsgeberbestätigung) oo uu mulkiiluhu saxiixay.\n' +
      '4. Foomka codsiga diiwaangelinta oo buuxa (Anmeldeformular).\n\n' +
      'Diiwaangelintu waxay saldhig u tahay helista Lambarka Cashuurta (Steueridentifikationsnummer), furista akoonka bangiga, codsiga caymiska, iyo isdiiwaangelinta koorsooyinka afka Jarmalka.',
    updatedAt: '2026-10-26',
    sourceUrl: 'https://www.bmi.bund.de/',
  },
  {
    id: 'krankenversicherung',
    title: 'Krankenversicherung — Caymiska caafimaadka',
    summary: 'Hagaha dhammaystiran ee caymiska caafimaadka qasabka ah ee Jarmalka.',
    body:
      'Qof kasta oo Jarmalka ku nool waa inuu lahaadaa caymis caafimaad (Krankenversicherung). Jarmalka wuxuu leeyahay oo ka shaqeeya laba dhiig-shiil oo caymis ah:\n' +
      '1. Caymiska Caafimaadka Dadweynaha (Gesetzliche Krankenversicherung - GKV): Kaas oo ay adeegsadaan badankooda dadka shaqeeya, ardayda, iyo kuwa caawinaada dawladda ka hela. Haddii aad shaqeyso, adiga iyo shaqo-bixiyahaaga ayaa kala bar ka bixinaya lacagta bishii.\n' +
      '2. Caymiska Caafimaadka Gaarka ah (Private Krankenversicherung - PKV): Kaas oo loogu talagalay dadka ganacsatada ah ama kuwa mushaharkoodu aadka u sareeyo.\n\n' +
      'Haddii aad ka badbaaday shaqo la’aan oo aad caawinaad ka hesho Jobcenter ama Sozialamt, iyaga ayaa bixinaya lacagta caymiskaaga. Caymisku wuxuu daboolaa booqashada dhakhtarka, daawaynta isbitaalka, iyo dawooyinka intooda badan.',
    updatedAt: '2026-10-26',
    sourceUrl: 'https://www.bundesgesundheitsministerium.de/',
  },
  {
    id: 'deutschkurse',
    title: 'Deutschkurse — Koorsooyinka afka Jarmalka',
    summary: 'Macluumaad ku saabsan koorsooyinka isku-dhafka (Integrationskurs) iyo kuwa xirfadaha.',
    body:
      'Koorsooyinka afka Jarmalka ee rasmiga ah ee loo yaqaan Integrationskurs waxaa maamula Maamulka Socdaalka iyo Qaxootiga Federal-ka (BAMF). ' +
      'Koorsadu waxay ka kooban tahay barashada luqadda (A1 ilaa B1) iyo koorsada jihaynta (Orientierungskurs) oo lagu baranayo sharciga, taariikhda, iyo dhaqanka Jarmalka.\n\n' +
      'Sida loo codsado iyo kharashka:\n' +
      '• Haddii aad ka hesho oggolaansho (Berechtigungsschein) Ausländerbehörde, Jobcenter, ama BAMF, koorsadu waa kugu lacag la’aan ama waxaad bixinaysaa kharash aad u yar.\n' +
      '• Markaad si guul leh u gudubto imtixaanka B1 iyo Orientierungskurs 2 sano gudahood, waxaad codsan kartaa in dub loogu soo celiyo 50% kharashkii aad bixisay.\n' +
      '• Kadib level-ka B1, waxaa jira koorsooyin xirfadeed oo loogu talagalay shaqada (Berufssprachkurse - B2/C1).',
    updatedAt: '2026-10-26',
    sourceUrl: 'https://www.bamf.de/',
  },
  {
    id: 'notruf',
    title: 'Notrufnummern — Lambarrada degdegga ah',
    summary: 'Lambarrada muhiimka ah ee xaaladaha degdegga ah, gargaarka caafimaad, iyo booliska.',
    body:
      'Xaaladaha degdegga ah, waa inaad taqaandaa lambarrada bilaashka ah ee shaqeeya 24/7:\n' +
      '• 112 — Dab-damiska (Feuerwehr) iyo Ambalaasta (Rettungsdienst). Adeegso marka ay jirto xaalad halis ku ah nafta, shil halis ah, ama dab.\n' +
      '• 110 — Booliska (Polizei). Adeegso marka uu dhaco dambi, shil gaari, ama khatar ammaan.\n' +
      '• 116 117 — Dhakhtarka gargaarka degdegga ah (Ärztlicher Bereitschaftsdienst). Adeegso marka aad buukto xilliyada habeenkii, sabtida, ama axadda ee xafiisyada dhakhaatiirtu kiisa kiisa xiran yihiin, laakiin aysan ahayn xaalad nafi ku jirto.\n' +
      '• 116 116 — Lambarka xirista kaararka bangiga (Sperr-Notruf) haddii kaarkooda bangiga uu ka lumo ama la xado.\n\n' +
      'Wicitaanka 112 iyo 110 waa bilaash telefon kasta, xitaa haddii aysan SIM-kaar ku jirin. Haddii aadan af Jarmal si fiican u hadlin, la hadal iyaga iyadoo Ingiriisi ah.',
    updatedAt: '2026-10-26',
  },
  {
    id: 'kindergeld',
    title: 'Kindergeld — Lacagta carruurta',
    summary: 'Shuruudaha iyo sida loo codsado taageerada dhaqaale ee carruurta.',
    body:
      'Kindergeld waa taageero dhaqaale oo ay dawladda Jarmalku bixiso bisi kasta si loogu caawiyo waalidiinta kuleylka iyo tarbiyada carruurta. ' +
      'Lacagtan waxaa la bixiyaa ilaa ilmuhu ka gaaro 18 sano (ama ilaa 25 sano haddii uu sii wado waxbarashada ama tababarka xirfadda/Ausbildung).\n\n' +
      'Qodobbada muhiimka ah:\n' +
      '1. Codsiga waxaa loo submit-gareeyaa xafiiska Familienkasse ee hoostaga Agentur für Arbeit.\n' +
      '2. Waxaad u baahan tahay: Aqoonsiga (Pass), lambarrada cashuurta ee waalidka iyo ilmaha (Steuer-ID), iyo shahaadada dhalashada ilmaha (Geburtsurkunde).\n' +
      '3. Dadka u dhashay dalalka ka baxsan EU waxay u baahan yihiin sharciga deegaanka oo haboon (Niederlassungserlaubnis ama Aufenthaltsgestattung/Aufenthaltstitel oo leh xuquuq shaqo).\n\n' +
      'Xaddiga lacagta carruurtu waa dhowr boqol oo Euro bishii halka ilmo kasta, waxaana toos loogu shubaa akoonka bangiga waalidka.',
    updatedAt: '2026-10-26',
    sourceUrl: 'https://www.arbeitsagentur.de/familie-und-kinder',
  },
];
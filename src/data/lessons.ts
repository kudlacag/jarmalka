export type ExerciseType = 'multiple_choice' | 'sentence_build' | 'spelling';

export type VocabItem = {
  de: string;
  so: string;
};

export type Exercise = {
  id: string;
  type: ExerciseType;
  prompt: string;
  options: string[]; 
  correctAnswer: string;
};

export type Lesson = {
  id: string;
  title: string;
  titleDe: string;
  unit: number;
  vocabulary: VocabItem[];
  exercises: Exercise[];
};

const baseLessons: Lesson[] = [
  {
    id: 'a1-01-person',
    title: 'Qofka & Isbarashada',
    titleDe: 'Person und Vorstellung',
    unit: 1,
    vocabulary: [
      { de: 'der Name', so: 'Magaca' }, { de: 'die Adresse', so: 'Cinwaanka' },
      { de: 'die Telefonnummer', so: 'Lambarka telefoonka' }, { de: 'der Geburtstag', so: 'Taariikhda dhalashada' },
      { de: 'das Alter', so: 'Da\'da' }, { de: 'die Schule', so: 'Dugsiga' },
      { de: 'der Beruf', so: 'Shaqada' }, { de: 'ledig', so: 'Keliska ah' },
      { de: 'verheiratet', so: 'Aroosan / Qoys leh' }, { de: 'ich', so: 'Aniga' },
      { de: 'du', so: 'Adiga' }, { de: 'er', so: 'Isaga' }, { de: 'sie', so: 'Iyada' },
    ],
    exercises: [
      { id: 'p1', type: 'multiple_choice', prompt: 'der Name', options: ['Magaca', 'Cinwaanka', 'Da\'da'], correctAnswer: 'Magaca' },
      { id: 'p2', type: 'multiple_choice', prompt: 'die Adresse', options: ['Cinwaanka', 'Lambarka telefoonka', 'Asalka'], correctAnswer: 'Cinwaanka' },
      { id: 'p3', type: 'multiple_choice', prompt: 'der Geburtstag', options: ['Taariikhda dhalashada', 'Jinsiga', 'Shaqada'], correctAnswer: 'Taariikhda dhalashada' },
      { id: 'p4', type: 'multiple_choice', prompt: 'ledig', options: ['Keliska ah', 'Aroosan / Qoys leh', 'La furay'], correctAnswer: 'Keliska ah' },
      { id: 'p5', type: 'multiple_choice', prompt: 'ich', options: ['Aniga', 'Adiga', 'Isaga'], correctAnswer: 'Aniga' },
      { id: 'p6', type: 'sentence_build', prompt: 'Magacaygu waa Ali.', options: ['Mein', 'Name', 'ist', 'Ali'], correctAnswer: 'Mein Name ist Ali' },
      { id: 'p7', type: 'sentence_build', prompt: 'Waxaan ku noolahay Berlin.', options: ['Ich', 'wohne', 'in', 'Berlin'], correctAnswer: 'Ich wohne in Berlin' },
    ],
  },
  {
    id: 'a1-02-family',
    title: 'Qoyska & Shaqada',
    titleDe: 'Familie und Beruf',
    unit: 2,
    vocabulary: [
      { de: 'die Familie', so: 'Qoyska' }, { de: 'der Vater', so: 'Aabbe' },
      { de: 'die Mutter', so: 'Hooyo' }, { de: 'die Eltern', so: 'Waalidka' },
      { de: 'der Sohn', so: 'Wiil' }, { de: 'die Tochter', so: 'Gabar' },
      { de: 'das Kind', so: 'Ilmo' }, { de: 'der Bruder', so: 'Walaal (wiil)' },
      { de: 'die Schwester', so: 'Walaal (gabar)' }, { de: 'der Arzt', so: 'Dhakhtar' },
      { de: 'der Lehrer', so: 'Macalin' }, { de: 'der Student', so: 'Arday' },
    ],
    exercises: [
      { id: 'f1', type: 'multiple_choice', prompt: 'der Vater', options: ['Aabbe', 'Hooyo', 'Walaal'], correctAnswer: 'Aabbe' },
      { id: 'f2', type: 'multiple_choice', prompt: 'die Mutter', options: ['Hooyo', 'Aabbe', 'Ayeeyo'], correctAnswer: 'Hooyo' },
      { id: 'f3', type: 'multiple_choice', prompt: 'der Bruder', options: ['Walaal (wiil)', 'Walaal (gabar)', 'Awoowe'], correctAnswer: 'Walaal (wiil)' },
      { id: 'f4', type: 'multiple_choice', prompt: 'die Schwester', options: ['Walaal (gabar)', 'Walaal (wiil)', 'Eedo'], correctAnswer: 'Walaal (gabar)' },
      { id: 'f5', type: 'sentence_build', prompt: 'Waxaan ahay macalin.', options: ['Ich', 'bin', 'Lehrer'], correctAnswer: 'Ich bin Lehrer' },
    ],
  },
  {
    id: 'a1-03-hobbies',
    title: 'Waqtiga Firaaqada & Ciyaaraha',
    titleDe: 'Freizeit und Hobbys',
    unit: 3,
    vocabulary: [
      { de: 'die Freizeit', so: 'Waqtiga firaaqada' }, { de: 'das Hobby', so: 'Hiwaayadda' },
      { de: 'Sport', so: 'Ciyaaraha' }, { de: 'Musik', so: 'Muusig' },
      { de: 'der Film', so: 'Filimka' }, { de: 'das Buch', so: 'Buugga' },
      { de: 'lesen', so: 'Akhri' }, { de: 'schreiben', so: 'Qor' },
      { de: 'hören', so: 'Dhageyso' }, { de: 'spielen', so: 'Ciyaar' },
      { de: 'schwimmen', so: 'Dabbaal' }, { de: 'Fußball', so: 'Kubbadda cagta' },
    ],
    exercises: [
      { id: 'h1', type: 'multiple_choice', prompt: 'das Hobby', options: ['Hiwaayadda', 'Shaqada', 'Waqtiga'], correctAnswer: 'Hiwaayadda' },
      { id: 'h2', type: 'multiple_choice', prompt: 'lesen', options: ['Akhri', 'Qor', 'Dhageyso'], correctAnswer: 'Akhri' },
      { id: 'h3', type: 'multiple_choice', prompt: 'schwimmen', options: ['Dabbaal', 'Ordaya', 'Qoob-ka-cayaar'], correctAnswer: 'Dabbaal' },
      { id: 'h4', type: 'sentence_build', prompt: 'Waan ciyaaraa kubbadda cagta.', options: ['Ich', 'spiele', 'Fußball'], correctAnswer: 'Ich spiele Fußball' },
    ],
  },
  {
    id: 'a1-04-food',
    title: 'Cunto & Maqaayad',
    titleDe: 'Essen und Restaurant',
    unit: 4,
    vocabulary: [
      { de: 'das Wasser', so: 'Biyo' }, { de: 'das Brot', so: 'Rooti' },
      { de: 'die Milch', so: 'Caano' }, { de: 'der Kaffee', so: 'Qaxwo' },
      { de: 'der Tee', so: 'Shaah' }, { de: 'das Fleisch', so: 'Hilib' },
      { de: 'der Fisch', so: 'Kalluun' }, { de: 'der Apfel', so: 'Tufaax' },
      { de: 'das Frühstück', so: 'Quraac' }, { de: 'die Rechnung', so: 'Biilka' },
      { de: 'die Speisekarte', so: 'Liiska cuntada' }, { de: 'bezahlen', so: 'Bixi' },
    ],
    exercises: [
      { id: 'fd1', type: 'multiple_choice', prompt: 'das Wasser', options: ['Biyo', 'Caano', 'Shaah'], correctAnswer: 'Biyo' },
      { id: 'fd2', type: 'multiple_choice', prompt: 'das Brot', options: ['Rooti', 'Hilib', 'Bariis'], correctAnswer: 'Rooti' },
      { id: 'fd3', type: 'multiple_choice', prompt: 'der Apfel', options: ['Tufaax', 'Moos', 'Liin'], correctAnswer: 'Tufaax' },
      { id: 'fd4', type: 'multiple_choice', prompt: 'die Rechnung', options: ['Biilka', 'Liiska cuntada', 'Quraac'], correctAnswer: 'Biilka' },
      { id: 'fd5', type: 'sentence_build', prompt: 'Waxaan cabbaa shaah.', options: ['Ich', 'trinke', 'Tee'], correctAnswer: 'Ich trinke Tee' },
      { id: 'fd6', type: 'sentence_build', prompt: 'Waxaan rabaa inaan bixiyo.', options: ['Ich', 'möchte', 'bezahlen'], correctAnswer: 'Ich möchte bezahlen' },
    ],
  },
  {
    id: 'a1-05-shopping',
    title: 'Iibsashada & Lacagta',
    titleDe: 'Einkaufen und Geld',
    unit: 5,
    vocabulary: [
      { de: 'das Geschäft', so: 'Dukaanka' }, { de: 'der Supermarkt', so: 'Suuqweyne' },
      { de: 'das Geld', so: 'Lacagta' }, { de: 'der Euro', so: 'Yuuro' },
      { de: 'der Preis', so: 'Qiimaha' }, { de: 'teuer', so: 'Qaali' },
      { de: 'billig', so: 'Jaban / Raqiis' }, { de: 'kaufen', so: 'Iibso' },
      { de: 'die Kasse', so: 'Khasnadda' }, { de: 'die Tüte', so: 'Boorso / jawaan' },
    ],
    exercises: [
      { id: 'sh1', type: 'multiple_choice', prompt: 'das Geschäft', options: ['Dukaanka', 'Suuqa', 'Lacagta'], correctAnswer: 'Dukaanka' },
      { id: 'sh2', type: 'multiple_choice', prompt: 'teuer', options: ['Qaali', 'Jaban / Raqiis', 'Qiimo leh'], correctAnswer: 'Qaali' },
      { id: 'sh3', type: 'multiple_choice', prompt: 'kaufen', options: ['Iibso', 'Iibi', 'Bixi'], correctAnswer: 'Iibso' },
      { id: 'sh4', type: 'sentence_build', prompt: 'Waxaan rabaa inaan wax iibsado.', options: ['Ich', 'möchte', 'etwas', 'kaufen'], correctAnswer: 'Ich möchte etwas kaufen' },
    ],
  },
  {
    id: 'a1-06-routine',
    title: 'Nolol Maalmeedka & Waqtiga',
    titleDe: 'Tägliches Leben und Zeit',
    unit: 6,
    vocabulary: [
      { de: 'die Arbeit', so: 'Shaqada' }, { de: 'der Termin', so: 'Ballanta' },
      { de: 'die Zeit', so: 'Waqtiga' }, { de: 'der Tag', so: 'Maalinta' },
      { de: 'der Morgen', so: 'Subaxa' }, { de: 'der Abend', so: 'Habeenka' },
      { de: 'heute', so: 'Maanta' }, { de: 'morgen', so: 'Berri' },
      { de: 'gestern', so: 'Shalay' }, { de: 'immer', so: 'Had iyo jeer' },
      { de: 'oft', so: 'Badanaa' }, { de: 'nie', so: 'Marnaba' },
    ],
    exercises: [
      { id: 'd1', type: 'multiple_choice', prompt: 'die Arbeit', options: ['Shaqada', 'Dugsiga', 'Ballanta'], correctAnswer: 'Shaqada' },
      { id: 'd2', type: 'multiple_choice', prompt: 'heute', options: ['Maanta', 'Berri', 'Shalay'], correctAnswer: 'Maanta' },
      { id: 'd3', type: 'multiple_choice', prompt: 'morgen', options: ['Berri', 'Maanta', 'Shalay'], correctAnswer: 'Berri' },
      { id: 'd4', type: 'sentence_build', prompt: 'Waxaan shaqeeyaa subax kasta.', options: ['Ich', 'arbeite', 'jeden', 'Morgen'], correctAnswer: 'Ich arbeite jeden Morgen' },
    ],
  },
  {
    id: 'a1-07-invitations',
    title: 'Casumaadka & Xafladaha',
    titleDe: 'Einladungen und Feste',
    unit: 7,
    vocabulary: [
      { de: 'die Party', so: 'Xafladda' }, { de: 'die Einladung', so: 'Casumaadka' },
      { de: 'das Geschenk', so: 'Hadiyadda' }, { de: 'feiern', so: 'Dabaaldeg' },
      { de: 'tanzen', so: 'Ciyaar (qoob-ka-cayaar)' }, { de: 'singen', so: 'Hees' },
      { de: 'Lust haben', so: 'Xiise / Rabitaan lahow' }, { de: 'Zeit haben', so: 'Waqti lahow' },
      { de: 'Geburtstag', so: 'Maalinta dhalashada' }, { de: 'leider', so: 'Nasiib-darro' },
    ],
    exercises: [
      { id: 'i1', type: 'multiple_choice', prompt: 'die Party', options: ['Xafladda', 'Casumaadka', 'Hadiyadda'], correctAnswer: 'Xafladda' },
      { id: 'i2', type: 'multiple_choice', prompt: 'feiern', options: ['Dabaaldeg', 'Ciyaar (qoob-ka-cayaar)', 'Hees'], correctAnswer: 'Dabaaldeg' },
      { id: 'i3', type: 'sentence_build', prompt: 'Waqti ma haysataa?', options: ['Hast', 'du', 'Zeit'], correctAnswer: 'Hast du Zeit' },
    ],
  },
  {
    id: 'a1-08-housing',
    title: 'Guriga & Alaabta',
    titleDe: 'Wohnen und Möbel',
    unit: 8,
    vocabulary: [
      { de: 'das Haus', so: 'Guriga' }, { de: 'die Wohnung', so: 'Aqalka / Dhismaha' },
      { de: 'das Zimmer', so: 'Qolka' }, { de: 'die Küche', so: 'Jikada' },
      { de: 'das Bad', so: 'Musqusha' }, { de: 'der Tisch', so: 'Miiska' },
      { de: 'der Stuhl', so: 'Kursiga' }, { de: 'das Bett', so: 'Sariirta' },
      { de: 'der Schrank', so: ' armaajo / armaajada' }, { de: 'das Sofa', so: 'Fadhiga' },
    ],
    exercises: [
      { id: 'ho1', type: 'multiple_choice', prompt: 'das Haus', options: ['Guriga', 'Aqalka / Dhismaha', 'Qolka'], correctAnswer: 'Guriga' },
      { id: 'ho2', type: 'multiple_choice', prompt: 'die Küche', options: ['Jikada', 'Musqusha', 'Qolka jiifka'], correctAnswer: 'Jikada' },
      { id: 'ho3', type: 'multiple_choice', prompt: 'der Tisch', options: ['Miiska', 'Kursiga', 'Sariirta'], correctAnswer: 'Miiska' },
      { id: 'ho4', type: 'sentence_build', prompt: 'Gurigaagu waa weyn yahay.', options: ['Das', 'Haus', 'ist', 'groß'], correctAnswer: 'Das Haus ist groß' },
    ],
  },
  {
    id: 'a1-09-weather',
    title: 'Cimilada & Dhacdooyinka',
    titleDe: 'Wetter und Ereignisse',
    unit: 9,
    vocabulary: [
      { de: 'das Wetter', so: 'Cimilada' }, { de: 'die Sonne', so: 'Qorraxda' },
      { de: 'der Regen', so: 'Roobka' }, { de: 'der Schnee', so: 'Barafka' },
      { de: 'warm', so: 'Diiran' }, { de: 'kalt', so: 'Qabow' },
      { de: 'windig', so: 'Dabaysha leh' }, { de: 'das Konzert', so: 'Rikoorka / Bandhigga muusiga' },
      { de: 'das Kino', so: 'Shineemada' }, { de: 'das Museum', so: 'Madxafka' },
    ],
    exercises: [
      { id: 'w1', type: 'multiple_choice', prompt: 'das Wetter', options: ['Cimilada', 'Qorraxda', 'Roobka'], correctAnswer: 'Cimilada' },
      { id: 'w2', type: 'multiple_choice', prompt: 'kalt', options: ['Qabow', 'Diiran', 'Dabaysha leh'], correctAnswer: 'Qabow' },
      { id: 'w3', type: 'multiple_choice', prompt: 'die Sonne', options: ['Qorraxda', 'Barafka', 'Roobka'], correctAnswer: 'Qorraxda' },
      { id: 'w4', type: 'sentence_build', prompt: 'Maanta waa qabow.', options: ['Heute', 'ist', 'es', 'kalt'], correctAnswer: 'Heute ist es kalt' },
    ],
  },
  {
    id: 'a1-10-internet',
    title: 'Internetka & Caawimaadda',
    titleDe: 'Internet und Hilfe',
    unit: 10,
    vocabulary: [
      { de: 'das Internet', so: 'Internetka' }, { de: 'der Computer', so: 'Kombuyuutarka' },
      { de: 'das Handy', so: 'Telefoonka gacanta' }, { de: 'die E-Mail', so: 'Iimaylka' },
      { de: 'die Hilfe', so: 'Caawimaadda' }, { de: 'helfen', so: 'Caawi' },
      { de: 'täglich', so: 'Maalin kasta' }, { de: 'die Stunde', so: 'Saacadda' },
      { de: 'die Minute', so: 'Daqiiqadda' }, { de: 'die Woche', so: 'Toddobaadka' },
    ],
      exercises: [
      { id: 'in1', type: 'multiple_choice', prompt: 'das Handy', options: ['Telefoonka gacanta', 'Kombuyuutarka', 'Internetka'], correctAnswer: 'Telefoonka gacanta' },
      { id: 'in2', type: 'multiple_choice', prompt: 'helfen', options: ['Caawi', 'Iimayl', 'Akhri'], correctAnswer: 'Caawi' },
      
      // THIS IS THE FIX: Options must be separate words
      { id: 'in3', type: 'sentence_build', prompt: 'Ma caawin karaa?', options: ['Kann', 'ich', 'helfen'], correctAnswer: 'Kann ich helfen' },
      
      // Let's add a sentence for the word "Internet"
      { id: 'in4', type: 'sentence_build', prompt: 'Internetka waa fiican yahay.', options: ['Das', 'Internet', 'ist', 'gut'], correctAnswer: 'Das Internet ist gut' },
    ],
  },
  {
    id: 'a1-11-apologies',
    title: 'Raaligelin & Macluumaad',
    titleDe: 'Entschuldigung und Informationen',
    unit: 11,
    vocabulary: [
      { de: 'die Entschuldigung', so: 'Raaligelinta' }, { de: 'der Stadtplan', so: 'Khariidadda magaalada' },
      { de: 'die Frage', so: 'Su\'aasha' }, { de: 'die Antwort', so: 'Jawaabta' },
      { de: 'die Verspätung', so: 'Daahitaanka' }, { de: 'warten', so: 'Sug' },
      { de: 'pünktlich', so: 'Waqtiga ilaaliya' }, { de: 'spät', so: 'Daah / Habeen sii dhacay' },
      { de: 'der Zug', so: 'Tareenka' }, { de: 'der Bus', so: 'Baska' },
    ],
    exercises: [
      { id: 'ap1', type: 'multiple_choice', prompt: 'die Frage', options: ['Su\'aasha', 'Jawaabta', 'Raaligelinta'], correctAnswer: 'Su\'aasha' },
      { id: 'ap2', type: 'multiple_choice', prompt: 'der Zug', options: ['Tareenka', 'Baska', 'Khariidadda'], correctAnswer: 'Tareenka' },
      { id: 'ap3', type: 'sentence_build', prompt: 'Waan ka xumahay, waan daahay.', options: ['Es', 'tut', 'mir', 'leid', 'ich', 'bin', 'spät'], correctAnswer: 'Es tut mir leid ich bin spät' },
    ],
  },
  {
    id: 'a1-12-appointments',
    title: 'Ballamaha & Xafiiska',
    titleDe: 'Termine und Büro',
    unit: 12,
    vocabulary: [
      { de: 'der Termin', so: 'Ballanta' }, { de: 'das Büro', so: 'Xafiiska' },
      { de: 'der Kalender', so: 'Kalandarka' }, { de: 'der Stift', so: 'Qalinka' },
      { de: 'das Papier', so: 'Warqadda' }, { de: 'der Tisch', so: 'Miiska' },
      { de: 'die Wand', so: 'Darbiga' }, { de: 'der Drucker', so: 'Daabacaha (Printer)' },
      { de: 'wichtig', so: 'Muhiim' }, { de: 'dringend', so: 'Degdeg ah' },
    ],
    exercises: [
      { id: 't1', type: 'multiple_choice', prompt: 'der Termin', options: ['Ballanta', 'Xafiiska', 'Kalandarka'], correctAnswer: 'Ballanta' },
      { id: 't2', type: 'multiple_choice', prompt: 'der Stift', options: ['Qalinka', 'Warqadda', 'Daabacaha (Printer)'], correctAnswer: 'Qalinka' },
      { id: 't3', type: 'sentence_build', prompt: 'Qalinku waa miiska dushiisa.', options: ['Der', 'Stift', 'ist', 'auf', 'dem', 'Tisch'], correctAnswer: 'Der Stift ist auf dem Tisch' },
    ],
  },
  {
    id: 'a1-13-personal',
    title: 'Macluumaadka Gaarka ah',
    titleDe: 'Persönliche Angaben',
    unit: 13,
    vocabulary: [
      { de: 'das Geburtsjahr', so: 'Sanadka dhalashada' }, { de: 'der Familienstand', so: 'Xaaladda qoyska' },
      { de: 'die Nationalität', so: 'Jinsiyadda' }, { de: 'die Sprache', so: 'Luqadda' },
      { de: 'das Foto', so: 'Sawirka' }, { de: 'die Hochzeit', so: 'Arooska' },
      { de: 'das Alter', so: 'Da\'da' }, { de: 'die Unterschrift', so: 'Saxiixa' },
    ],
    exercises: [
      { id: 'pe1', type: 'multiple_choice', prompt: 'das Foto', options: ['Sawirka', 'Arooska', 'Saxiixa'], correctAnswer: 'Sawirka' },
      { id: 'pe2', type: 'multiple_choice', prompt: 'die Hochzeit', options: ['Arooska', 'Da\'da', 'Luqadda'], correctAnswer: 'Arooska' },
      { id: 'pe3', type: 'sentence_build', prompt: 'Waxaan dhashay 1995.', options: ['Ich', 'bin', '1995', 'geboren'], correctAnswer: 'Ich bin 1995 geboren' },
    ],
  },
  {
    id: 'a1-14-wishes',
    title: 'Rabitaanka & Waqtigii Hore',
    titleDe: 'Wünsche und Vergangenheit',
    unit: 14,
    vocabulary: [
      { de: 'reisen', so: 'Safra' }, { de: 'der Urlaub', so: 'Fasaxa' },
      { de: 'das Meer', so: 'Badda' }, { de: 'der Berg', so: 'Buurta' },
      { de: 'gestern', so: 'Shalay' }, { de: 'letzte Woche', so: 'Toddobaadkii hore' },
      { de: 'letztes Jahr', so: 'Sanadkii hore' }, { de: 'der Strand', so: 'Xeebta' },
      { de: 'fliegen', so: 'Duul' }, { de: 'fahren', so: 'Wado / kaxeeyo' },
    ],
    exercises: [
      { id: 'w1', type: 'multiple_choice', prompt: 'der Urlaub', options: ['Fasaxa', 'Badda', 'Buurta'], correctAnswer: 'Fasaxa' },
      { id: 'w2', type: 'multiple_choice', prompt: 'reisen', options: ['Safra', 'Duul', 'Wado / kaxeeyo'], correctAnswer: 'Safra' },
      { id: 'w3', type: 'sentence_build', prompt: 'Sanadkii hore waxaan aaday Jarmalka.', options: ['Letztes', 'Jahr', 'bin', 'ich', 'nach', 'Deutschland', 'gefahren'], correctAnswer: 'Letztes Jahr bin ich nach Deutschland gefahren' },
    ],
  },
  {
    id: 'a1-15-health',
    title: 'Caafimaadka & Jirka',
    titleDe: 'Gesundheit und Körper',
    unit: 15,
    vocabulary: [
      { de: 'die Gesundheit', so: 'Caafimaadka' }, { de: 'der Körper', so: 'Jirka' },
      { de: 'der Kopf', so: 'Madaxa' }, { de: 'der Bauch', so: 'Caloosha' },
      { de: 'der Arm', so: 'Gacanta' }, { de: 'das Bein', so: 'Lugta' },
      { de: 'der Schmerz', so: 'Xanuunka' }, { de: 'krank', so: 'Jiran' },
      { de: 'gesund', so: 'Caafimaad qaba' }, { de: 'der Arzt', so: 'Dhakhtarka' },
    ],
    exercises: [
      { id: 'he1', type: 'multiple_choice', prompt: 'der Kopf', options: ['Madaxa', 'Jirka', 'Gacanta'], correctAnswer: 'Madaxa' },
      { id: 'he2', type: 'multiple_choice', prompt: 'der Schmerz', options: ['Xanuunka', 'Caafimaadka', 'Lugta'], correctAnswer: 'Xanuunka' },
      { id: 'he3', type: 'multiple_choice', prompt: 'krank', options: ['Jiran', 'Caafimaad qaba', 'Dhakhtar'], correctAnswer: 'Jiran' },
      { id: 'he4', type: 'sentence_build', prompt: 'Madaxayga ayaa xanuunaya.', options: ['Ich', 'habe', 'Kopfschmerzen'], correctAnswer: 'Ich habe Kopfschmerzen' },
    ],
  },
  {
    id: 'a1-16-clothes',
    title: 'Dharka & Iibsashada',
    titleDe: 'Kleidung und Einkaufen',
    unit: 16,
    vocabulary: [
      { de: 'die Kleidung', so: 'Dharka' }, { de: 'das Hemd', so: 'Shaarka' },
      { de: 'die Hose', so: 'Surwaalka' }, { de: 'der Rock', so: 'Guntiin / Galyar' },
      { de: 'das Kleid', so: 'Dirays / Khamiis dheddig' }, { de: 'die Schuhe', so: 'Kabaha' },
      { de: 'die Farbe', so: 'Midabka' }, { de: 'rot', so: 'Casaan' },
      { de: 'blau', so: 'Buluug' }, { de: 'schwarz', so: 'Madow' },
    ],
    exercises: [
      { id: 'c1', type: 'multiple_choice', prompt: 'das Hemd', options: ['Shaarka', 'Surwaalka', 'Dirays / Khamiis dheddig'], correctAnswer: 'Shaarka' },
      { id: 'c2', type: 'multiple_choice', prompt: 'die Schuhe', options: ['Kabaha', 'Dharka', 'Midabka'], correctAnswer: 'Kabaha' },
      { id: 'c3', type: 'multiple_choice', prompt: 'rot', options: ['Casaan', 'Buluug', 'Madow'], correctAnswer: 'Casaan' },
      { id: 'c4', type: 'sentence_build', prompt: 'Shaarkaagu aad buu u qurux badan yahay.', options: ['Das', 'Hemd', 'ist', 'sehr', 'schön'], correctAnswer: 'Das Hemd ist sehr schön' },
    ],
  },
  {
    id: 'a1-17-travel',
    title: 'Safarka & Jihada',
    titleDe: 'Reisen und Wegbeschreibung',
    unit: 17,
    vocabulary: [
      { de: 'die Reise', so: 'Safarka' }, { de: 'der Bahnhof', so: 'Saldhigga tareenka' },
      { de: 'der Flughafen', so: 'Garoonka diyaaradaha' }, { de: 'die Fahrkarte', so: 'Tikidhka safarka' },
      { de: 'links', so: 'Bidix' }, { de: 'rechts', so: 'Midig' },
      { de: 'geradeaus', so: 'Toos u soco' }, { de: 'der Norden', so: 'Waqooyi' },
      { de: 'der Süden', so: 'Koonfur' }, { de: 'weit', so: 'Fog' },
    ],
    exercises: [
      { id: 'tr1', type: 'multiple_choice', prompt: 'der Bahnhof', options: ['Saldhigga tareenka', 'Garoonka diyaaradaha', 'Tikidhka'], correctAnswer: 'Saldhigga tareenka' },
      { id: 'tr2', type: 'multiple_choice', prompt: 'links', options: ['Bidix', 'Midig', 'Toos u soco'], correctAnswer: 'Bidix' },
      { id: 'tr3', type: 'multiple_choice', prompt: 'der Norden', options: ['Waqooyi', 'Koonfur', 'Fog'], correctAnswer: 'Waqooyi' },
      { id: 'tr4', type: 'sentence_build', prompt: 'Tareenku goormuu baxayaa?', options: ['Wann', 'fährt', 'der', 'Zug', 'ab'], correctAnswer: 'Wann fährt der Zug ab' },
    ],
  },
  {
    id: 'a1-18-routines',
    title: 'Caadooyinka & Saldhigga',
    titleDe: 'Routinen und Bahnhof',
    unit: 18,
    vocabulary: [
      { de: 'die Routine', so: 'Caadada joogtada ah' }, { de: 'aufstehen', so: 'Kac' },
      { de: 'schlafen', so: 'Seexo' }, { de: 'frühstücken', so: 'Quraac' },
      { de: 'der Gleis', so: 'Jidka tareenka (Platform)' }, { de: 'umsteigen', so: 'Beddel gaari / tareen' },
      { de: 'einsteigen', so: 'Kor u bax (gaari fuul)' }, { de: 'aussteigen', so: 'Ka deg' },
      { de: 'die Abfahrt', so: 'Bixitaanka' }, { de: 'die Ankunft', so: 'Imaatinka' },
    ],
    exercises: [
      { id: 'ro1', type: 'multiple_choice', prompt: 'aufstehen', options: ['Kac', 'Seexo', 'Quraac'], correctAnswer: 'Kac' },
      { id: 'ro2', type: 'multiple_choice', prompt: 'der Gleis', options: ['Jidka tareenka (Platform)', 'Bixitaanka', 'Imaatinka'], correctAnswer: 'Jidka tareenka (Platform)' },
      { id: 'ro3', type: 'multiple_choice', prompt: 'aussteigen', options: ['Ka deg', 'Kor u bax (gaari fuul)', 'Beddel gaari / tareen'], correctAnswer: 'Ka deg' },
      { id: 'ro4', type: 'sentence_build', prompt: 'Waxaan kacaa 7:00 subaxnimo.', options: ['Ich', 'stehe', 'um', '7', 'Uhr', 'auf'], correctAnswer: 'Ich stehe um 7 Uhr auf' },
    ],
  }
];

// New function to generate the letter bank for spelling
// Add this helper function if you don't have it already
function generateLetterBank(word: string): string[] {
  const letters = word.replace(/\s/g, '').split(''); // Remove spaces and split
  // Add a few random extra letters to make it harder
  const extraLetters = ['a', 'e', 'i', 'o', 'u', 'n', 'r', 's', 't'].sort(() => 0.5 - Math.random()).slice(0, 3);
  return [...letters, ...extraLetters].sort(() => 0.5 - Math.random());
}function generateDynamicExercises(lesson: Lesson): Lesson {
  const generatedMCQs: Exercise[] = [];
  const vocab = lesson.vocabulary;

  // 1. Generate a Multiple Choice question for EVERY vocabulary word
  vocab.forEach((item, index) => {
    const otherVocab = vocab.filter(v => v.de !== item.de && v.so !== item.so);
    const shuffledOthers = [...otherVocab].sort(() => 0.5 - Math.random());
    const distractors = shuffledOthers.slice(0, 2);

    if (index % 2 === 0) {
      generatedMCQs.push({
        id: `mc-${index}-de-so`,
        type: 'multiple_choice',
        prompt: item.de,
        options: [item.so, ...distractors.map(d => d.so)],
        correctAnswer: item.so,
      });
    } else {
      generatedMCQs.push({
        id: `mc-${index}-so-de`,
        type: 'multiple_choice',
        prompt: item.so,
        options: [item.de, ...distractors.map(d => d.de)],
        correctAnswer: item.de,
      });
    }
  });

  // 2. Generate ONE Spelling Exercise per lesson (using the longest word)
  if (vocab.length > 0) {
    const longestVocab = [...vocab].sort((a, b) => b.de.length - a.de.length)[0];
    const wordToSpell = longestVocab.de; // e.g., "das Internet"
    
    // Create a bank of letters. We use ' ' (a real space) for the space button.
    const letters = wordToSpell.split(''); // This keeps the space intact!
    const extraLetters = ['a', 'e', 'i', 'o', 'u', 'n', 'r', 's', 't', 'm', 'l', 'd', 'h'];
    const randomExtras = extraLetters.sort(() => 0.5 - Math.random()).slice(0, 3);
    
    // Combine and shuffle
    const letterBank = [...letters, ...randomExtras].sort(() => 0.5 - Math.random());

    generatedMCQs.push({
      id: `spell-${lesson.id}`,
      type: 'spelling',
      prompt: longestVocab.so, // Show Somali (e.g., "Internetka")
      options: letterBank, // The letters to tap
      correctAnswer: wordToSpell, // e.g., "das Internet"
    });
  }

  // 3. Keep the custom sentence building exercises
  const sentenceExercises = lesson.exercises.filter(
    e => e.type === 'sentence_build' && e.options && e.options.length > 0
  ).map((ex, i) => {
    let fixedOptions = ex.options;
    if (ex.options.length === 1 && typeof ex.options[0] === 'string') {
      fixedOptions = ex.options[0].split(' ');
    }
    
    return {
      ...ex,
      id: `sb-${i}`,
      options: fixedOptions
    };
  });

  // 4. Combine them
  return {
    ...lesson,
    exercises: [...generatedMCQs, ...sentenceExercises]
  };
}

// MAKE SURE THESE TWO LINES ARE AT THE VERY BOTTOM:
export const a1Lessons: Lesson[] = baseLessons.map(generateDynamicExercises);

export const levels = [
  { id: 'a1', title: 'A1', subtitle: 'Heerka 1 (A1)', unlocked: true, color: '#4189DD' },
  { id: 'a2', title: 'A2', subtitle: 'Heerka 2 (A2)', unlocked: false, color: '#DD0000' },
  { id: 'b1', title: 'B1', subtitle: 'Heerka 3 (B1)', unlocked: false, color: '#FFCE00' },
];
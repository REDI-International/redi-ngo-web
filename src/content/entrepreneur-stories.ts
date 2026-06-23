export const SLICE_IDS = ["tailor", "retail", "hardware", "textiles", "professional"] as const;
export type SliceId = (typeof SLICE_IDS)[number];

export interface LocalizedText {
  en: string;
  ro: string;
}

export interface EntrepreneurStory {
  slug: string;
  sliceId: SliceId;
  name: LocalizedText;
  role: LocalizedText;
  location: LocalizedText;
  title: LocalizedText;
  excerpt: LocalizedText;
  body: LocalizedText;
  highlight: LocalizedText;
  program: LocalizedText;
  image: string;
}

export const entrepreneurStories: EntrepreneurStory[] = [
  {
    slug: "ion-master-craftsman-clejani",
    sliceId: "tailor",
    name: { en: "Ion", ro: "Ion" },
    role: { en: "Master craftsman", ro: "Meșter croitor" },
    location: { en: "Clejani, Romania", ro: "Clejani, România" },
    title: {
      en: "Crafts that employ a community",
      ro: "Meșteșuguri care angajează o comunitate",
    },
    excerpt: {
      en: "Ion runs a tailoring workshop where Roma craft traditions meet formal business — and young apprentices learn skills Europe's labour market needs.",
      ro: "Ion conduce un atelier de croitorie unde tradițiile meșteșugului rom se întâlnesc cu afacerea formală — iar tinerii ucenici învață competențe de care piața muncii europeană are nevoie.",
    },
    body: {
      en: "Ion learned tailoring from his father and grandfather in Clejani, a village known for Roma musical and craft heritage. For years he worked informally — sewing uniforms and alterations from a room in his home, paid in cash, with no contracts and no visibility beyond word of mouth.\n\nWhen REDI business facilitators visited the community, Ion joined a grant-readiness workshop. With EU-funded support, he registered his workshop, bought industrial sewing equipment, and hired two young apprentices from the neighbourhood.\n\nToday Ion supplies school uniforms to three local schools and trains teenagers who might otherwise leave for informal work abroad. \"My father taught me the stitch,\" he says. \"Now I teach the next generation how to run a business, not just sew a seam.\"\n\nFor Ion, formalisation was never about paperwork alone — it was about dignity, steady income, and keeping Roma craft alive in a country that still undervalues both.",
      ro: "Ion a învățat croitoria de la tatăl și bunicul său în Clejani, un sat cunoscut pentru patrimoniul muzical și meșteșugăresc rom. Ani de zile a lucrat informal — cusând uniforme și retușuri dintr-o cameră din casă, plătit cash, fără contracte și fără vizibilitate dincolo de recomandări.\n\nCând facilitatorii de afaceri REDI au vizitat comunitatea, Ion s-a înscris la un atelier de pregătire pentru granturi. Cu sprijin finanțat de UE, și-a înregistrat atelierul, a cumpărat echipament industrial de cusut și a angajat doi ucenici tineri din cartier.\n\nAstăzi Ion furnizează uniforme școlare pentru trei școli locale și instruiește adolescenți care altfel ar pleca spre muncă informală în străinătate. „Tatăl meu m-a învățat cusutura”, spune el. „Acum îi învăț pe cei tineri cum să conducă o afacere, nu doar cum să coasă.”\n\nPentru Ion, formalizarea nu a fost niciodată doar despre acte — a fost despre demnitate, venit stabil și păstrarea meșteșugului rom într-o țară care încă subestimează ambele.",
    },
    highlight: {
      en: "EU-funded projects connect master craftspeople with grants, training, and markets.",
      ro: "Proiectele finanțate de UE conectează meșterii cu granturi, formare și piețe.",
    },
    program: {
      en: "Grant Support · EU Projects",
      ro: "Suport Granturi · Proiecte UE",
    },
    image: "/home/entrepreneurs/entrepreneur-1.png",
  },
  {
    slug: "elena-clothing-retailer",
    sliceId: "retail",
    name: { en: "Elena", ro: "Elena" },
    role: { en: "Clothing retailer", ro: "Comerciantă cu îmbrăcăminte" },
    location: { en: "Skopje region, North Macedonia", ro: "Regiunea Skopje, Macedonia de Nord" },
    title: {
      en: "From market stall to storefront",
      ro: "De la tarabă la magazin",
    },
    excerpt: {
      en: "Elena turned weekend market sales into a registered shop — with REDI youth entrepreneurship support and PappoShop helping her reach customers online.",
      ro: "Elena a transformat vânzările de weekend de la piață într-un magazin înregistrat — cu sprijinul REDI pentru antreprenoriatul tinerilor și PappoShop care o ajută să ajungă la clienți online.",
    },
    body: {
      en: "Elena started with a folding table at the weekend market — children's clothing she sourced from wholesalers, sold at thin margins, packed away every Sunday evening. She was 24, supporting her mother and two younger siblings, and had never written a business plan.\n\nThrough REDI's youth entrepreneurship programme, Elena learned pricing, inventory management, and how to register as a sole trader. A mentor from the Regional Business Centre helped her find a small shop unit on a busy street.\n\nListing on PappoShop gave Elena her first online customers — mothers beyond her neighbourhood who discovered her quality and fair prices. Within a year she hired a part-time assistant and began mentoring two other young Roma women starting in retail.\n\n\"I used to hide my receipts in a shoebox,\" Elena laughs. \"Now I have a shop sign with my name on it. That changes how people see you — and how you see yourself.\"",
      ro: "Elena a început cu o masă pliantă la piața de weekend — haine pentru copii pe care le procura de la angrosiști, vândute cu marje mici, împachetate în fiecare duminică seara. Avea 24 de ani, o susținea pe mama și doi frați mai mici și nu scrisese niciodată un plan de afaceri.\n\nPrin programul REDI de antreprenoriat pentru tineri, Elena a învățat stabilirea prețurilor, gestiunea stocurilor și cum să se înregistreze ca persoană fizică autorizată. Un mentor de la Centrul Regional de Afaceri a ajutat-o să găsească un spațiu comercial mic pe o stradă aglomerată.\n\nListarea pe PappoShop i-a adus primii clienți online — mame dincolo de cartierul ei care au descoperit calitatea și prețurile corecte. În decurs de un an a angajat un asistent cu jumătate de normă și a început să ghideze alte două tinere roma care încep în retail.\n\n„Îmi ascundeam chitanțele într-o cutie de pantofi”, spune Elena râzând. „Acum am un magazin cu numele meu pe firmă. Asta schimbă modul în care te văd oamenii — și modul în care te vezi pe tine.”",
    },
    highlight: {
      en: "PappoShop helps Roma entrepreneurs — especially women and youth — reach customers beyond their neighbourhood.",
      ro: "PappoShop ajută antreprenorii romi — în special femeile și tinerii — să ajungă la clienți dincolo de cartier.",
    },
    program: {
      en: "Youth Entrepreneurship · PappoShop",
      ro: "Antreprenoriat tineri · PappoShop",
    },
    image: "/home/entrepreneurs/entrepreneur-2.png",
  },
  {
    slug: "marko-plumbing-supplies",
    sliceId: "hardware",
    name: { en: "Marko", ro: "Marko" },
    role: { en: "Plumbing supplies retailer", ro: "Comerciant materiale sanitare" },
    location: { en: "Niš, Serbia", ro: "Niš, Serbia" },
    title: {
      en: "Building supply chains that last",
      ro: "Lanțuri de aprovizionare durabile",
    },
    excerpt: {
      en: "Marko grew an informal plumbing stall into a registered hardware store — connected to suppliers and peers through the REDI Business Club.",
      ro: "Marko a transformat o tarabă informală de materiale sanitare într-un magazin de bricolaj înregistrat — conectat la furnizori și colegi prin REDI Business Club.",
    },
    body: {
      en: "Marko sold pipes, fittings, and tools from a roadside stall outside Niš for eight years. He knew every plumber in the area by name, but banks refused him credit because he had no registration papers and no collateral beyond his van.\n\nAt a REDI Business Club meeting in Serbia, Marko met other Roma entrepreneurs facing the same barriers — informal starts, formal growth blocked by missing documents and networks. Club mentors helped him register his business, set up basic accounting, and negotiate wholesale terms with regional suppliers.\n\nThe stall became a proper store with shelving, a sign, and a point-of-sale system. Marko now supplies small construction firms and employs his nephew part-time. He still attends monthly club sessions to share what worked — and what did not.\n\n\"Before the club, I thought I was the only one struggling with the bank,\" Marko says. \"Now I know the system — and I know I am not alone.\"",
      ro: "Marko a vândut țevi, fittinguri și unelte de pe o tarabă la marginea drumului, lângă Niš, timp de opt ani. Cunoștea fiecare instalator din zonă pe nume, dar băncile i-au refuzat creditul pentru că nu avea acte de înregistrare și nicio garanție în afară de duba sa.\n\nLa o întâlnire REDI Business Club în Serbia, Marko i-a întâlnit pe alți antreprenori romi care se confruntau cu aceleași bariere — începuturi informale, creștere formală blocată de lipsa documentelor și rețelelor. Mentorii clubului l-au ajutat să-și înregistreze afacerea, să organizeze contabilitatea de bază și să negocieze condiții en-gros cu furnizori regionali.\n\nTaraba a devenit un magazin adevărat cu rafturi, firmă și sistem de casă. Marko acum furnizează mici firme de construcții și își angajează nepotul cu jumătate de normă. Participă în continuare la sesiunile lunare ale clubului pentru a împărtăși ce a funcționat — și ce nu.\n\n„Înainte de club, credeam că sunt singurul care se luptă cu banca”, spune Marko. „Acum cunosc sistemul — și știu că nu sunt singur.”",
    },
    highlight: {
      en: "Business Clubs offer training, mentoring, and peer networks across Serbia, North Macedonia, and beyond.",
      ro: "Cluburile de Afaceri oferă formare, mentorat și rețele de peer în Serbia, Macedonia de Nord și nu numai.",
    },
    program: {
      en: "REDI Business Club · supplier networks",
      ro: "REDI Business Club · rețele furnizori",
    },
    image: "/home/entrepreneurs/entrepreneur-3.png",
  },
  {
    slug: "fatima-textile-trader",
    sliceId: "textiles",
    name: { en: "Fatima", ro: "Fatima" },
    role: { en: "Textile trader", ro: "Comerciantă textile" },
    location: { en: "Tirana, Albania", ro: "Tirana, Albania" },
    title: {
      en: "Fabric, finance, and formal jobs",
      ro: "Textile, finanțare și locuri de muncă formale",
    },
    excerpt: {
      en: "Fatima scaled her fabric business with a REDI Fund-backed microloan — hiring workers and supplying upholstery to hotels across the region.",
      ro: "Fatima și-a extins afacerea cu textile printr-un microcredit susținut de REDI Fund — angajând muncitori și furnizând tapiserie hotelurilor din regiune.",
    },
    body: {
      en: "Fatima traded fabric from a market stand in Tirana — buying rolls on credit from importers, cutting samples for customers, turning small profits week by week. She dreamed of a workshop but could not save enough for bulk purchases.\n\nA REDI business facilitator assessed her sales records and referred her to a partner microfinance institution backed by the REDI Fund. The loan was modest — enough for two bulk fabric orders and a second-hand industrial cutting table.\n\nFatima hired four women from her community, registered the workshop, and won a contract supplying upholstery fabric to a hotel chain. Her employees receive payslips for the first time. She repaid the loan on schedule and is now applying for a second, larger facility to expand into home textiles.\n\n\"Banks saw a woman at a market stall,\" Fatima says. \"REDI saw a business owner who needed a fair chance.\"",
      ro: "Fatima comercializa textile de pe o tarabă de piață din Tirana — cumpăra role pe credit de la importatori, tăia mostre pentru clienți, obținând profituri mici săptămână de săptămână. Visa la un atelier, dar nu putea economisi suficient pentru achiziții en-gros.\n\nUn facilitator de afaceri REDI i-a evaluat evidențele de vânzări și a recomandat-o unei instituții partenere de microfinanțare susținute de REDI Fund. Creditul a fost modest — suficient pentru două comenzi en-gros de material și o masă industrială de tăiere second-hand.\n\nFatima a angajat patru femei din comunitatea sa, a înregistrat atelierul și a câștigat un contract de furnizare a materialelor de tapiserie pentru un lanț hotelier. Angajatele ei primesc fluturași de salariu pentru prima dată. A rambursat creditul la timp și acum aplică pentru o a doua facilitate, mai mare, pentru a se extinde în textile de casă.\n\n„Băncile au văzut o femeie la o tarabă de piață”, spune Fatima. „REDI a văzut o proprietară de afaceri care avea nevoie de o șansă corectă.”",
    },
    highlight: {
      en: "REDI Fund is Europe's first Roma impact investment vehicle, channelling finance to entrepreneurs banks overlook.",
      ro: "REDI Fund este primul vehicul de investiții de impact rom din Europa, canalizând finanțare către antreprenori pe care băncile îi ignoră.",
    },
    program: {
      en: "REDI Fund · microfinance",
      ro: "REDI Fund · microfinanțare",
    },
    image: "/home/entrepreneurs/entrepreneur-4.png",
  },
  {
    slug: "denis-digital-entrepreneur",
    sliceId: "professional",
    name: { en: "Denis", ro: "Denis" },
    role: { en: "Digital entrepreneur", ro: "Antreprenor digital" },
    location: { en: "Bucharest, Romania", ro: "București, România" },
    title: {
      en: "Digital skills, real businesses",
      ro: "Competențe digitale, afaceri reale",
    },
    excerpt: {
      en: "Denis built a bookkeeping and admin service using free courses on redi.business — and became an EIF-backed loan beneficiary to scale further.",
      ro: "Denis a construit un serviciu de contabilitate și administrare folosind cursuri gratuite pe redi.business — și a devenit beneficiar al unui credit EIF pentru a se extinde.",
    },
    body: {
      en: "Denis left school early and worked odd jobs before discovering he had a knack for numbers and organisation. He started helping small shop owners with invoices and tax filings from a shared office desk — informal, trusted, but limited.\n\nFree micro-lessons on redi.business taught him invoicing software, GDPR basics, and how to pitch services to SMEs. He completed the EntreComp curriculum and earned a certificate that gave clients confidence a bank never would.\n\nWhen REDI secured a €2 million EIF loan facility to support Roma entrepreneurship, Denis was among the first beneficiaries — using the funds to hire a junior assistant and invest in accounting software licences. He now serves a dozen regular clients and trains others on the Learn pillar.\n\n\"People told me office work wasn't for Roma,\" Denis says. \"I told them watch my screen — this is my business, and it is formal, digital, and growing.\"",
      ro: "Denis a părăsit școala devreme și a făcut diverse munci înainte de a descoperi că are talent pentru cifre și organizare. A început să ajute mici comercianți cu facturi și declarații fiscale de la un birou partajat — informal, de încredere, dar limitat.\n\nMicro-lecțiile gratuite de pe redi.business l-au învățat software de facturare, elemente de bază GDPR și cum să-și promoveze serviciile către IMM-uri. A finalizat curriculumul EntreComp și a obținut un certificat care le-a dat clienților încredere pe care o bancă nu ar fi oferit-o niciodată.\n\nCând REDI a obținut o facilitate de credit EIF de 2 milioane de euro pentru sprijinirea antreprenoriatului rom, Denis a fost printre primii beneficiari — folosind fondurile pentru a angaja un asistent junior și a investi în licențe de software contabil. Acum deservește o duzină de clienți fideli și instruiește alții pe pilonul Învață.\n\n„Oamenii mi-au spus că munca de birou nu e pentru romi”, spune Denis. „Le-am spus să privească ecranul meu — asta e afacerea mea, și e formală, digitală și în creștere.”",
    },
    highlight: {
      en: "The Learn pillar on redi.business offers micro-lessons, EntreComp curriculum, and certifications — free for Roma entrepreneurs.",
      ro: "Pilonul Învață de pe redi.business oferă micro-lecții, curriculum EntreComp și certificări — gratuit pentru antreprenorii romi.",
    },
    program: {
      en: "redi.business · Learn pillar",
      ro: "redi.business · Pilonul Învață",
    },
    image: "/home/entrepreneurs/entrepreneur-5.png",
  },
];

const storyBySlug = new Map(entrepreneurStories.map((s) => [s.slug, s]));
const storyBySliceId = new Map(entrepreneurStories.map((s) => [s.sliceId, s]));

export function getEntrepreneurStory(slug: string): EntrepreneurStory | undefined {
  return storyBySlug.get(slug);
}

export function getStoryBySliceId(sliceId: SliceId): EntrepreneurStory {
  const story = storyBySliceId.get(sliceId);
  if (!story) throw new Error(`No story for slice: ${sliceId}`);
  return story;
}

export function getStorySlugForSlice(sliceId: SliceId): string {
  return getStoryBySliceId(sliceId).slug;
}

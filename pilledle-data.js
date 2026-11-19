// Data til Pilledle. Tilføj gerne flere præparater – rækkefølgen af dagens opgaver blandes automatisk.
// atc: WHO ATC-kode · brug/former: lister (overlap giver gul) · status: H = håndkøb, R = receptpligtig, A = afhængighedsskabende

const ATC_HOVEDGRUPPER = {
    A: 'Fordøjelse og stofskifte', B: 'Blod', C: 'Hjerte-kar', D: 'Hud', G: 'Urogenital og kønshormoner',
    H: 'Hormoner (systemisk)', J: 'Infektioner', M: 'Muskler og skelet', N: 'Nervesystemet',
    R: 'Luftveje', S: 'Sanseorganer',
};

const ATC_GRUPPER = {
    A02B: 'Mavesår og refluks', A03F: 'Prokinetika', A04A: 'Antiemetika', A06A: 'Laksantia',
    A10A: 'Insuliner', A10B: 'Blodsukkersænkende (ej insulin)',
    B01A: 'Antitrombotiske midler', B03A: 'Jernpræparater',
    C01A: 'Hjerteglykosider', C01D: 'Vasodilatatorer (hjerte)', C03A: 'Thiazider', C03C: 'Loop-diuretika',
    C03D: 'Kaliumbesparende diuretika', C07A: 'Betablokkere', C08C: 'Calciumantagonister (kar)',
    C09A: 'ACE-hæmmere', C09C: 'Angiotensin II-antagonister', C10A: 'Lipidsænkende midler',
    D01A: 'Svampemidler (hud)', D06A: 'Antibiotika (hud)', D07A: 'Kortikosteroider (hud)',
    G03A: 'Hormonelle kontraceptiva', G03C: 'Østrogener', G04B: 'Urologika', G04C: 'Prostatahyperplasi',
    H02A: 'Kortikosteroider (systemisk)', H03A: 'Thyreoideamidler',
    J01A: 'Tetracykliner', J01C: 'Penicilliner', J01E: 'Sulfonamider og trimethoprim', J01F: 'Makrolider',
    J01M: 'Quinoloner', J01X: 'Andre antibiotika', J05A: 'Antivirale midler',
    M01A: 'NSAID', M04A: 'Urinsyregigt', M05B: 'Osteoporose',
    N02A: 'Opioider', N02B: 'Andre analgetika', N02C: 'Migrænemidler', N03A: 'Antiepileptika',
    N04B: 'Dopaminerge midler', N05A: 'Antipsykotika', N05B: 'Anxiolytika', N05C: 'Sovemidler',
    N06A: 'Antidepressiva', N06B: 'Psykostimulantia', N06D: 'Demensmidler',
    R01A: 'Næsemidler', R03A: 'Inhalerede adrenergika', R03B: 'Andre inhalationsmidler',
    R03D: 'Andre midler mod astma/KOL', R06A: 'Antihistaminer',
    S01A: 'Antiinfektiva (øje)', S01E: 'Glaukommidler',
};

const STATUS_NAVN = { H: 'Håndkøb', R: 'Receptpligtig', A: 'Afhængighedsskabende' };

const PRÆPARATER = [
    // A – Fordøjelse og stofskifte
    { navn: 'Omeprazol', mærker: ['Losec'], atc: 'A02BC01', klasse: 'Protonpumpehæmmer', brug: ['Mave-tarm'], former: ['Kapsel', 'Tablet'], status: 'H', beskrivelse: 'Hæmmer mavesyreproduktionen. Bruges ved refluks, mavesår og som ulcusprofylakse.' },
    { navn: 'Metoclopramid', mærker: ['Primperan'], atc: 'A03FA01', klasse: 'Dopaminantagonist', brug: ['Kvalme'], former: ['Tablet', 'Injektion'], status: 'R', beskrivelse: 'Prokinetisk middel mod kvalme. Kan give ekstrapyramidale bivirkninger.' },
    { navn: 'Ondansetron', mærker: ['Zofran'], atc: 'A04AA01', klasse: '5-HT3-antagonist', brug: ['Kvalme'], former: ['Tablet', 'Injektion'], status: 'R', beskrivelse: 'Mod kvalme, bl.a. ved kemoterapi og efter operation. Kan forlænge QT-intervallet.' },
    { navn: 'Laktulose', mærker: ['Lactulose', 'Duphalac'], atc: 'A06AD11', klasse: 'Osmotisk laksans', brug: ['Forstoppelse'], former: ['Mikstur'], status: 'H', beskrivelse: 'Sukkerstof der trækker vand ind i tarmen. Bruges også ved hepatisk encefalopati.' },
    { navn: 'Macrogol', mærker: ['Movicol', 'Moxalole'], atc: 'A06AD65', klasse: 'Osmotisk laksans', brug: ['Forstoppelse'], former: ['Pulver'], status: 'H', beskrivelse: 'Pulver der opløses i vand og blødgør afføringen. Meget brugt til børn og ældre.' },
    { navn: 'Insulin glargin', mærker: ['Lantus', 'Toujeo', 'Abasaglar'], atc: 'A10AE04', klasse: 'Langtidsvirkende insulin', brug: ['Diabetes'], former: ['Injektion'], status: 'R', beskrivelse: 'Basalinsulin, der gives én gang dagligt.' },
    { navn: 'Metformin', mærker: ['Glucophage'], atc: 'A10BA02', klasse: 'Biguanid', brug: ['Diabetes'], former: ['Tablet'], status: 'R', beskrivelse: 'Førstevalg ved type 2-diabetes. Pauseres ved dehydrering og svært nedsat nyrefunktion.' },
    { navn: 'Semaglutid', mærker: ['Ozempic', 'Wegovy', 'Rybelsus'], atc: 'A10BJ06', klasse: 'GLP-1-analog', brug: ['Diabetes', 'Overvægt'], former: ['Injektion', 'Tablet'], status: 'R', beskrivelse: 'Dansk udviklet og verdensberømt. Gives typisk som ugentlig pen.' },
    { navn: 'Empagliflozin', mærker: ['Jardiance'], atc: 'A10BK03', klasse: 'SGLT2-hæmmer', brug: ['Diabetes', 'Hjertesvigt'], former: ['Tablet'], status: 'R', beskrivelse: 'Får nyrerne til at udskille sukker i urinen. Gavnlig ved hjertesvigt og nyresygdom.' },

    // B – Blod
    { navn: 'Warfarin', mærker: ['Marevan'], atc: 'B01AA03', klasse: 'Vitamin K-antagonist', brug: ['Blodprop'], former: ['Tablet'], status: 'R', beskrivelse: 'Klassisk blodfortyndende middel, der kræver INR-kontrol.' },
    { navn: 'Clopidogrel', mærker: ['Plavix'], atc: 'B01AC04', klasse: 'P2Y12-hæmmer', brug: ['Blodprop'], former: ['Tablet'], status: 'R', beskrivelse: 'Trombocythæmmer efter blodprop i hjerte eller hjerne.' },
    { navn: 'Acetylsalicylsyre', mærker: ['Hjertemagnyl', 'Magnyl', 'Treo'], atc: 'B01AC06', klasse: 'Trombocythæmmer', brug: ['Blodprop'], former: ['Tablet'], status: 'H', beskrivelse: 'I lav dosis (75 mg) som forebyggelse af ny blodprop.' },
    { navn: 'Rivaroxaban', mærker: ['Xarelto'], atc: 'B01AF01', klasse: 'Faktor Xa-hæmmer (DOAK)', brug: ['Blodprop', 'Atrieflimren'], former: ['Tablet'], status: 'R', beskrivelse: 'DOAK, der tages én gang dagligt sammen med mad.' },
    { navn: 'Apixaban', mærker: ['Eliquis'], atc: 'B01AF02', klasse: 'Faktor Xa-hæmmer (DOAK)', brug: ['Blodprop', 'Atrieflimren'], former: ['Tablet'], status: 'R', beskrivelse: 'Meget brugt DOAK ved atrieflimren. Tages to gange dagligt.' },
    { navn: 'Jern (ferrosulfat)', mærker: ['Ferro Duretter', 'Ferrosulfat'], atc: 'B03AA07', klasse: 'Jerntilskud', brug: ['Blodmangel'], former: ['Tablet'], status: 'H', beskrivelse: 'Mod jernmangelanæmi. Giver ofte sort afføring og mavegener.' },

    // C – Hjerte-kar
    { navn: 'Digoxin', mærker: ['Digoxin'], atc: 'C01AA05', klasse: 'Hjerteglykosid', brug: ['Atrieflimren', 'Hjertesvigt'], former: ['Tablet'], status: 'R', beskrivelse: 'Gammelt middel fra fingerbøl. Smalt terapeutisk vindue.' },
    { navn: 'Nitroglycerin', mærker: ['Nitrolingual', 'Glycerylnitrat'], atc: 'C01DA02', klasse: 'Nitrat', brug: ['Angina'], former: ['Resoriblet', 'Spray'], status: 'R', beskrivelse: 'Under tungen ved anfald af hjertekrampe. Giver ofte hovedpine.' },
    { navn: 'Bendroflumethiazid + kalium', mærker: ['Centyl med Kaliumklorid', 'Centyl'], atc: 'C03AB01', klasse: 'Thiazid', brug: ['Hypertension'], former: ['Tablet'], status: 'R', beskrivelse: 'Vanddrivende middel mod forhøjet blodtryk. Gives ofte med kalium.' },
    { navn: 'Furosemid', mærker: ['Furix'], atc: 'C03CA01', klasse: 'Loop-diuretikum', brug: ['Hjertesvigt', 'Ødemer'], former: ['Tablet', 'Injektion'], status: 'R', beskrivelse: 'Kraftigt vanddrivende. Virker på Henles slynge.' },
    { navn: 'Spironolacton', mærker: ['Spirix'], atc: 'C03DA01', klasse: 'Aldosteronantagonist', brug: ['Hjertesvigt', 'Hypertension'], former: ['Tablet'], status: 'R', beskrivelse: 'Kaliumbesparende vanddrivende middel. Kan give gynækomasti.' },
    { navn: 'Metoprolol', mærker: ['Selo-Zok', 'Seloken'], atc: 'C07AB02', klasse: 'Betablokker', brug: ['Hypertension', 'Angina', 'Atrieflimren', 'Hjertesvigt'], former: ['Tablet'], status: 'R', beskrivelse: 'Selektiv β1-blokker, der sænker pulsen.' },
    { navn: 'Bisoprolol', mærker: ['Emconcor'], atc: 'C07AB07', klasse: 'Betablokker', brug: ['Hypertension', 'Hjertesvigt', 'Atrieflimren'], former: ['Tablet'], status: 'R', beskrivelse: 'Selektiv β1-blokker, der doseres én gang dagligt.' },
    { navn: 'Amlodipin', mærker: ['Norvasc'], atc: 'C08CA01', klasse: 'Calciumantagonist', brug: ['Hypertension', 'Angina'], former: ['Tablet'], status: 'R', beskrivelse: 'Udvider blodkarrene. Typisk bivirkning er ankelødemer.' },
    { navn: 'Enalapril', mærker: ['Renitec'], atc: 'C09AA02', klasse: 'ACE-hæmmer', brug: ['Hypertension', 'Hjertesvigt'], former: ['Tablet'], status: 'R', beskrivelse: 'Hæmmer dannelsen af angiotensin II. Kan give tør hoste.' },
    { navn: 'Lisinopril', mærker: ['Zestril'], atc: 'C09AA03', klasse: 'ACE-hæmmer', brug: ['Hypertension', 'Hjertesvigt'], former: ['Tablet'], status: 'R', beskrivelse: 'ACE-hæmmer én gang dagligt. Kontrollér kalium og kreatinin.' },
    { navn: 'Ramipril', mærker: ['Triatec'], atc: 'C09AA05', klasse: 'ACE-hæmmer', brug: ['Hypertension', 'Hjertesvigt'], former: ['Kapsel', 'Tablet'], status: 'R', beskrivelse: 'ACE-hæmmer med dokumentation for kardiovaskulær forebyggelse.' },
    { navn: 'Losartan', mærker: ['Cozaar'], atc: 'C09CA01', klasse: 'Angiotensin II-antagonist', brug: ['Hypertension'], former: ['Tablet'], status: 'R', beskrivelse: 'Alternativ til ACE-hæmmer uden tør hoste.' },
    { navn: 'Candesartan', mærker: ['Atacand'], atc: 'C09CA06', klasse: 'Angiotensin II-antagonist', brug: ['Hypertension', 'Hjertesvigt'], former: ['Tablet'], status: 'R', beskrivelse: 'Sartan, der også bruges som migræneprofylakse.' },
    { navn: 'Simvastatin', mærker: ['Zocor'], atc: 'C10AA01', klasse: 'Statin', brug: ['Kolesterol'], former: ['Tablet'], status: 'R', beskrivelse: 'Kolesterolsænkende. Tages traditionelt om aftenen.' },
    { navn: 'Atorvastatin', mærker: ['Lipitor', 'Zarator'], atc: 'C10AA05', klasse: 'Statin', brug: ['Kolesterol'], former: ['Tablet'], status: 'R', beskrivelse: 'Potent statin og førstevalg i Danmark.' },
    { navn: 'Rosuvastatin', mærker: ['Crestor'], atc: 'C10AA07', klasse: 'Statin', brug: ['Kolesterol'], former: ['Tablet'], status: 'R', beskrivelse: 'Det mest potente statin.' },
    { navn: 'Ezetimib', mærker: ['Ezetrol'], atc: 'C10AX09', klasse: 'Kolesteroloptagelseshæmmer', brug: ['Kolesterol'], former: ['Tablet'], status: 'R', beskrivelse: 'Hæmmer optagelsen af kolesterol i tarmen. Lægges ofte oven i et statin.' },

    // D – Hud
    { navn: 'Terbinafin creme', mærker: ['Lamisil'], atc: 'D01AE15', klasse: 'Allylamin', brug: ['Svamp'], former: ['Creme'], status: 'H', beskrivelse: 'Mod fodsvamp og ringorm.' },
    { navn: 'Fusidinsyre', mærker: ['Fucidin'], atc: 'D06AX01', klasse: 'Lokalt antibiotikum', brug: ['Infektion', 'Hud'], former: ['Creme'], status: 'R', beskrivelse: 'Creme mod børnesår (impetigo). Resistens er et problem.' },
    { navn: 'Hydrocortison creme', mærker: ['Mildison', 'Uniderm'], atc: 'D07AA02', klasse: 'Svagt kortikosteroid', brug: ['Eksem', 'Hud'], former: ['Creme'], status: 'H', beskrivelse: 'Gruppe I-steroid, mildt nok til ansigtet og til børn.' },
    { navn: 'Betamethason creme', mærker: ['Betnovat'], atc: 'D07AC01', klasse: 'Stærkt kortikosteroid', brug: ['Eksem', 'Psoriasis', 'Hud'], former: ['Creme', 'Salve'], status: 'R', beskrivelse: 'Gruppe III-steroid til eksem og psoriasis på kroppen.' },

    // G – Urogenital og kønshormoner
    { navn: 'P-pille (levonorgestrel + ethinylestradiol)', mærker: ['Microgyn', 'Rigevidon'], atc: 'G03AA07', klasse: 'Kombineret p-pille', brug: ['Prævention'], former: ['Tablet'], status: 'R', beskrivelse: 'Førstevalg blandt kombinerede p-piller pga. lavere tromboserisiko.' },
    { navn: 'Estradiol', mærker: ['Vagifem', 'Estrogel', 'Estrofem'], atc: 'G03CA03', klasse: 'Østrogen', brug: ['Overgangsalder'], former: ['Tablet', 'Vaginaltablet', 'Gel', 'Plaster'], status: 'R', beskrivelse: 'Kvindeligt kønshormon mod hedeture og som lokalbehandling af tørre slimhinder efter overgangsalderen.' },
    { navn: 'Solifenacin', mærker: ['Vesicare'], atc: 'G04BD08', klasse: 'Antimuskarin', brug: ['Blære'], former: ['Tablet'], status: 'R', beskrivelse: 'Mod overaktiv blære. Antikolinerge bivirkninger som mundtørhed.' },
    { navn: 'Sildenafil', mærker: ['Viagra'], atc: 'G04BE03', klasse: 'PDE5-hæmmer', brug: ['Erektil dysfunktion'], former: ['Tablet'], status: 'R', beskrivelse: 'Oprindeligt udviklet mod angina. Må ikke kombineres med nitrater.' },
    { navn: 'Tamsulosin', mærker: ['Omnic'], atc: 'G04CA02', klasse: 'Alfa-blokker', brug: ['Prostata'], former: ['Kapsel'], status: 'R', beskrivelse: 'Afslapper glat muskulatur i prostata og blærehals. Bruges også ved nyresten.' },

    // H – Hormoner
    { navn: 'Prednisolon', mærker: ['Prednisolon'], atc: 'H02AB06', klasse: 'Glukokortikoid', brug: ['Inflammation', 'Astma/KOL'], former: ['Tablet'], status: 'R', beskrivelse: 'Systemisk binyrebarkhormon, fx ved KOL-exacerbation og polymyalgia rheumatica.' },
    { navn: 'Levothyroxin', mærker: ['Eltroxin', 'Euthyrox'], atc: 'H03AA01', klasse: 'Thyreoideahormon', brug: ['Stofskifte'], former: ['Tablet'], status: 'R', beskrivelse: 'Tages fastende om morgenen mod for lavt stofskifte.' },

    // J – Infektioner
    { navn: 'Doxycyclin', mærker: ['Doxycyclin', 'Vibradox'], atc: 'J01AA02', klasse: 'Tetracyklin', brug: ['Infektion'], former: ['Tablet'], status: 'R', beskrivelse: 'Bruges bl.a. ved borrelia og klamydia. Giver lysfølsomhed.' },
    { navn: 'Amoxicillin', mærker: ['Imacillin', 'Imaxi'], atc: 'J01CA04', klasse: 'Bredspektret penicillin', brug: ['Infektion'], former: ['Tablet', 'Mikstur'], status: 'R', beskrivelse: 'Aminopenicillin, der bl.a. bruges ved otitis og pneumoni.' },
    { navn: 'Pivmecillinam', mærker: ['Selexid'], atc: 'J01CA08', klasse: 'Penicillin (mecillinam)', brug: ['Infektion', 'Blære'], former: ['Tablet'], status: 'R', beskrivelse: 'Førstevalg ved ukompliceret cystitis i Danmark.' },
    { navn: 'Phenoxymethylpenicillin', mærker: ['Penicillin V', 'Primcillin', 'Vepicombin'], atc: 'J01CE02', klasse: 'Smalspektret penicillin', brug: ['Infektion'], former: ['Tablet', 'Mikstur'], status: 'R', beskrivelse: 'Det mest brugte antibiotikum i dansk almen praksis.' },
    { navn: 'Dicloxacillin', mærker: ['Diclocil', 'Dicillin'], atc: 'J01CF01', klasse: 'Penicillinasefast penicillin', brug: ['Infektion', 'Hud'], former: ['Kapsel'], status: 'R', beskrivelse: 'Mod stafylokokker, fx ved hudinfektioner og erysipelas med sår.' },
    { navn: 'Trimethoprim', mærker: ['Trimopan'], atc: 'J01EA01', klasse: 'Folsyreantagonist', brug: ['Infektion', 'Blære'], former: ['Tablet', 'Mikstur'], status: 'R', beskrivelse: 'Mod urinvejsinfektion. Kan øge kalium.' },
    { navn: 'Clarithromycin', mærker: ['Klacid'], atc: 'J01FA09', klasse: 'Makrolid', brug: ['Infektion'], former: ['Tablet', 'Mikstur'], status: 'R', beskrivelse: 'Alternativ ved penicillinallergi. Mange interaktioner (CYP3A4).' },
    { navn: 'Azithromycin', mærker: ['Zithromax'], atc: 'J01FA10', klasse: 'Makrolid', brug: ['Infektion'], former: ['Tablet', 'Mikstur'], status: 'R', beskrivelse: 'Makrolid med lang halveringstid, fx som engangsdosis ved klamydia.' },
    { navn: 'Ciprofloxacin', mærker: ['Ciproxin'], atc: 'J01MA02', klasse: 'Fluorquinolon', brug: ['Infektion'], former: ['Tablet'], status: 'R', beskrivelse: 'Bredspektret middel, der bruges med forsigtighed pga. senebivirkninger.' },
    { navn: 'Nitrofurantoin', mærker: ['Furadantin'], atc: 'J01XE01', klasse: 'Nitrofuranderivat', brug: ['Infektion', 'Blære'], former: ['Tablet'], status: 'R', beskrivelse: 'Mod blærebetændelse. Virker ikke ved lav nyrefunktion.' },
    { navn: 'Valaciclovir', mærker: ['Valtrex'], atc: 'J05AB11', klasse: 'Nukleosidanalog', brug: ['Infektion', 'Herpes'], former: ['Tablet'], status: 'R', beskrivelse: 'Prodrug af aciclovir mod herpes zoster og genital herpes.' },

    // M – Muskler og skelet
    { navn: 'Diclofenac', mærker: ['Voltaren', 'Diclon'], atc: 'M01AB05', klasse: 'NSAID', brug: ['Smerter', 'Inflammation'], former: ['Tablet', 'Gel'], status: 'R', beskrivelse: 'NSAID med relativt høj kardiovaskulær risiko.' },
    { navn: 'Ibuprofen', mærker: ['Ipren', 'Ibumetin', 'Brufen', 'Ibuprofen'], atc: 'M01AE01', klasse: 'NSAID', brug: ['Smerter', 'Feber', 'Inflammation'], former: ['Tablet', 'Mikstur'], status: 'H', beskrivelse: 'Danmarks mest kendte NSAID. Pas på nyrer og mave.' },
    { navn: 'Naproxen', mærker: ['Pronaxen', 'Naproxen'], atc: 'M01AE02', klasse: 'NSAID', brug: ['Smerter', 'Inflammation'], former: ['Tablet'], status: 'H', beskrivelse: 'NSAID med lang halveringstid og relativt gunstig hjerteprofil.' },
    { navn: 'Allopurinol', mærker: ['Zyloric'], atc: 'M04AA01', klasse: 'Xanthinoxidasehæmmer', brug: ['Urinsyregigt'], former: ['Tablet'], status: 'R', beskrivelse: 'Sænker urinsyren som forebyggelse af podagra.' },
    { navn: 'Alendronat', mærker: ['Fosamax'], atc: 'M05BA04', klasse: 'Bisfosfonat', brug: ['Osteoporose'], former: ['Tablet'], status: 'R', beskrivelse: 'Én gang ugentligt, fastende, med et stort glas vand og siddende oprejst.' },

    // N – Nervesystemet
    { navn: 'Morfin', mærker: ['Contalgin', 'Morfin'], atc: 'N02AA01', klasse: 'Opioid', brug: ['Smerter'], former: ['Tablet', 'Injektion', 'Mikstur'], status: 'A', beskrivelse: 'Det klassiske opioid. Husk laksantia.' },
    { navn: 'Oxycodon', mærker: ['OxyNorm', 'OxyContin'], atc: 'N02AA05', klasse: 'Opioid', brug: ['Smerter'], former: ['Tablet', 'Kapsel'], status: 'A', beskrivelse: 'Stærkt opioid som alternativ til morfin.' },
    { navn: 'Tramadol', mærker: ['Mandolgin', 'Tramadol'], atc: 'N02AX02', klasse: 'Opioid', brug: ['Smerter'], former: ['Tablet', 'Kapsel'], status: 'A', beskrivelse: 'Svagt opioid med serotonerg effekt. Risiko for kramper og serotonergt syndrom.' },
    { navn: 'Paracetamol', mærker: ['Panodil', 'Pinex', 'Pamol', 'Panodil Junior'], atc: 'N02BE01', klasse: 'Anilid', brug: ['Smerter', 'Feber'], former: ['Tablet', 'Mikstur', 'Stikpille'], status: 'H', beskrivelse: 'Førstevalg mod smerter og feber. Levertoksisk ved overdosis.' },
    { navn: 'Sumatriptan', mærker: ['Imigran'], atc: 'N02CC01', klasse: 'Triptan', brug: ['Migræne'], former: ['Tablet', 'Næsespray', 'Injektion'], status: 'R', beskrivelse: 'Anfaldsbehandling af migræne via 5-HT1B/1D-receptorer.' },
    { navn: 'Lamotrigin', mærker: ['Lamictal'], atc: 'N03AX09', klasse: 'Antiepileptikum', brug: ['Epilepsi', 'Bipolar'], former: ['Tablet'], status: 'R', beskrivelse: 'Optrappes langsomt pga. risiko for alvorligt udslæt.' },
    { navn: 'Gabapentin', mærker: ['Neurontin'], atc: 'N02BF01', klasse: 'Gabapentinoid', brug: ['Neuropatiske smerter', 'Epilepsi'], former: ['Kapsel', 'Tablet'], status: 'R', beskrivelse: 'Mod nervesmerter, fx efter helvedesild.' },
    { navn: 'Levetiracetam', mærker: ['Keppra'], atc: 'N03AX14', klasse: 'Antiepileptikum', brug: ['Epilepsi'], former: ['Tablet', 'Mikstur'], status: 'R', beskrivelse: 'Meget brugt mod epilepsi. Kan give irritabilitet.' },
    { navn: 'Pregabalin', mærker: ['Lyrica'], atc: 'N02BF02', klasse: 'Gabapentinoid', brug: ['Neuropatiske smerter', 'Angst', 'Epilepsi'], former: ['Kapsel'], status: 'R', beskrivelse: 'Mod nervesmerter og generaliseret angst. Risiko for misbrug.' },
    { navn: 'Levodopa', mærker: ['Madopar', 'Sinemet'], atc: 'N04BA02', klasse: 'Dopaminforstadie', brug: ['Parkinson'], former: ['Kapsel', 'Tablet'], status: 'R', beskrivelse: 'Hovedhjørnestenen i behandlingen af Parkinsons sygdom.' },
    { navn: 'Olanzapin', mærker: ['Zyprexa'], atc: 'N05AH03', klasse: 'Atypisk antipsykotikum', brug: ['Psykose', 'Bipolar'], former: ['Tablet'], status: 'R', beskrivelse: 'Effektivt antipsykotikum med betydelig vægtøgning.' },
    { navn: 'Quetiapin', mærker: ['Seroquel'], atc: 'N05AH04', klasse: 'Atypisk antipsykotikum', brug: ['Psykose', 'Bipolar'], former: ['Tablet'], status: 'R', beskrivelse: 'Antipsykotikum, der i lav dosis desværre ofte bruges som sovemiddel.' },
    { navn: 'Lithium', mærker: ['Litarex', 'Lithium'], atc: 'N05AN01', klasse: 'Stemningsstabilisator', brug: ['Bipolar'], former: ['Tablet'], status: 'R', beskrivelse: 'Kræver plasmakontrol. Smalt terapeutisk vindue.' },
    { navn: 'Diazepam', mærker: ['Stesolid'], atc: 'N05BA01', klasse: 'Benzodiazepin', brug: ['Angst', 'Kramper'], former: ['Tablet', 'Klysma', 'Injektion'], status: 'A', beskrivelse: 'Langtidsvirkende benzodiazepin. Også rektalt ved feberkramper.' },
    { navn: 'Oxazepam', mærker: ['Oxapax'], atc: 'N05BA04', klasse: 'Benzodiazepin', brug: ['Angst', 'Abstinenser'], former: ['Tablet'], status: 'A', beskrivelse: 'Benzodiazepin, der bl.a. bruges ved alkoholabstinenser.' },
    { navn: 'Zopiclon', mærker: ['Imovane'], atc: 'N05CF01', klasse: 'Z-hypnotikum', brug: ['Søvnløshed'], former: ['Tablet'], status: 'A', beskrivelse: 'Sovemiddel med metallisk smag. Kun til kortvarig brug.' },
    { navn: 'Melatonin', mærker: ['Circadin'], atc: 'N05CH01', klasse: 'Melatoninagonist', brug: ['Søvnløshed'], former: ['Tablet'], status: 'R', beskrivelse: 'Kroppens eget søvnhormon. Receptpligtigt i Danmark.' },
    { navn: 'Amitriptylin', mærker: ['Saroten'], atc: 'N06AA09', klasse: 'Tricyklisk antidepressivum', brug: ['Depression', 'Neuropatiske smerter'], former: ['Tablet'], status: 'R', beskrivelse: 'Bruges i dag mest i lav dosis mod nervesmerter og hovedpine.' },
    { navn: 'Citalopram', mærker: ['Cipramil'], atc: 'N06AB04', klasse: 'SSRI', brug: ['Depression', 'Angst'], former: ['Tablet'], status: 'R', beskrivelse: 'SSRI med dosisbegrænsning pga. QT-forlængelse.' },
    { navn: 'Sertralin', mærker: ['Zoloft'], atc: 'N06AB06', klasse: 'SSRI', brug: ['Depression', 'Angst'], former: ['Tablet'], status: 'R', beskrivelse: 'Det mest brugte SSRI i Danmark og førstevalg i mange vejledninger.' },
    { navn: 'Escitalopram', mærker: ['Cipralex'], atc: 'N06AB10', klasse: 'SSRI', brug: ['Depression', 'Angst'], former: ['Tablet'], status: 'R', beskrivelse: 'Den aktive S-enantiomer af et andet SSRI. Udviklet i Danmark.' },
    { navn: 'Mirtazapin', mærker: ['Remeron'], atc: 'N06AX11', klasse: 'NaSSA', brug: ['Depression', 'Søvnløshed'], former: ['Tablet'], status: 'R', beskrivelse: 'Sederende antidepressivum, der øger appetitten.' },
    { navn: 'Venlafaxin', mærker: ['Efexor'], atc: 'N06AX16', klasse: 'SNRI', brug: ['Depression', 'Angst'], former: ['Kapsel'], status: 'R', beskrivelse: 'SNRI med tydelige seponeringssymptomer.' },
    { navn: 'Duloxetin', mærker: ['Cymbalta'], atc: 'N06AX21', klasse: 'SNRI', brug: ['Depression', 'Neuropatiske smerter'], former: ['Kapsel'], status: 'R', beskrivelse: 'SNRI, der også bruges mod diabetisk neuropati.' },
    { navn: 'Methylphenidat', mærker: ['Ritalin', 'Concerta', 'Medikinet'], atc: 'N06BA04', klasse: 'Centralstimulans', brug: ['ADHD'], former: ['Tablet', 'Kapsel'], status: 'A', beskrivelse: 'Førstevalg ved ADHD hos børn og voksne.' },
    { navn: 'Donepezil', mærker: ['Aricept'], atc: 'N06DA02', klasse: 'Kolinesterasehæmmer', brug: ['Demens'], former: ['Tablet'], status: 'R', beskrivelse: 'Mod Alzheimers sygdom. Kan give bradykardi.' },

    // R – Luftveje
    { navn: 'Xylometazolin', mærker: ['Otrivin', 'Zymelin'], atc: 'R01AA07', klasse: 'Alfa-agonist (afsvællende)', brug: ['Forkølelse'], former: ['Næsespray'], status: 'H', beskrivelse: 'Afsvællende næsespray. Højst ca. 10 dage pga. rebound.' },
    { navn: 'Mometason næsespray', mærker: ['Nasonex', 'Mometason'], atc: 'R01AD09', klasse: 'Nasalt kortikosteroid', brug: ['Allergi'], former: ['Næsespray'], status: 'H', beskrivelse: 'Steroid-næsespray mod høfeber og kronisk rhinosinuitis.' },
    { navn: 'Salbutamol', mærker: ['Ventoline', 'Buventol', 'Airomir'], atc: 'R03AC02', klasse: 'Korttidsvirkende β2-agonist', brug: ['Astma/KOL'], former: ['Inhalation'], status: 'R', beskrivelse: 'Den blå anfaldsmedicin ved astma.' },
    { navn: 'Budesonid + formoterol', mærker: ['Symbicort', 'Bufomix'], atc: 'R03AK07', klasse: 'Steroid + langtidsvirkende β2-agonist', brug: ['Astma/KOL'], former: ['Inhalation'], status: 'R', beskrivelse: 'Kombinationsinhalator, der kan bruges både som vedligehold og anfaldsbehandling.' },
    { navn: 'Budesonid inhalation', mærker: ['Pulmicort', 'Giona'], atc: 'R03BA02', klasse: 'Inhaleret kortikosteroid', brug: ['Astma/KOL'], former: ['Inhalation'], status: 'R', beskrivelse: 'Forebyggende steroid til inhalation. Skyl munden efter brug.' },
    { navn: 'Tiotropium', mærker: ['Spiriva'], atc: 'R03BB04', klasse: 'Langtidsvirkende antikolinergikum', brug: ['Astma/KOL'], former: ['Inhalation'], status: 'R', beskrivelse: 'LAMA én gang dagligt, primært ved KOL.' },
    { navn: 'Montelukast', mærker: ['Singulair'], atc: 'R03DC03', klasse: 'Leukotrienreceptorantagonist', brug: ['Astma/KOL', 'Allergi'], former: ['Tablet'], status: 'R', beskrivelse: 'Tablet mod astma. Pas på neuropsykiatriske bivirkninger hos børn.' },
    { navn: 'Cetirizin', mærker: ['Zyrtec', 'Cetirizin'], atc: 'R06AE07', klasse: 'Antihistamin', brug: ['Allergi'], former: ['Tablet', 'Mikstur'], status: 'H', beskrivelse: 'Andengenerations-antihistamin mod høfeber og nældefeber.' },
    { navn: 'Loratadin', mærker: ['Clarityn', 'Loratadin'], atc: 'R06AX13', klasse: 'Antihistamin', brug: ['Allergi'], former: ['Tablet'], status: 'H', beskrivelse: 'Ikke-sederende antihistamin mod allergi.' },

    // S – Sanseorganer
    { navn: 'Kloramfenikol øjendråber', mærker: ['Kloramfenikol', 'Chloromycetin'], atc: 'S01AA01', klasse: 'Lokalt antibiotikum', brug: ['Infektion', 'Øjne'], former: ['Øjendråber'], status: 'R', beskrivelse: 'Mod bakteriel øjenbetændelse.' },
    { navn: 'Latanoprost', mærker: ['Xalatan', 'Monoprost'], atc: 'S01EE01', klasse: 'Prostaglandinanalog', brug: ['Glaukom', 'Øjne'], former: ['Øjendråber'], status: 'R', beskrivelse: 'Mod grøn stær. Kan gøre øjenvipperne længere og iris mørkere.' },
];

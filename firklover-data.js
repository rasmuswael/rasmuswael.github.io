// Data til Firkløver: hver opgave har 4 grupper á 4 lægemidler.
// niveau 1–4 = fra let (gul) til lumsk (lilla). Hvert navn må kun passe i én gruppe i samme opgave.

const OPGAVER = [
    [
        { niveau: 1, navn: 'Statiner', medlemmer: ['Simvastatin', 'Atorvastatin', 'Rosuvastatin', 'Pravastatin'] },
        { niveau: 2, navn: 'SSRI', medlemmer: ['Sertralin', 'Citalopram', 'Escitalopram', 'Fluoxetin'] },
        { niveau: 3, navn: 'ACE-hæmmere', medlemmer: ['Enalapril', 'Ramipril', 'Lisinopril', 'Captopril'] },
        { niveau: 4, navn: 'Betablokkere', medlemmer: ['Metoprolol', 'Bisoprolol', 'Propranolol', 'Atenolol'] },
    ],
    [
        { niveau: 1, navn: 'Handelsnavne for paracetamol', medlemmer: ['Panodil', 'Pinex', 'Pamol', 'Arax'] },
        { niveau: 2, navn: 'Opioider', medlemmer: ['Morfin', 'Oxycodon', 'Tramadol', 'Kodein'] },
        { niveau: 3, navn: 'Inhalatorer', medlemmer: ['Ventoline', 'Spiriva', 'Symbicort', 'Pulmicort'] },
        { niveau: 4, navn: 'Mod blærebetændelse', medlemmer: ['Pivmecillinam', 'Nitrofurantoin', 'Trimethoprim', 'Sulfamethizol'] },
    ],
    [
        { niveau: 1, navn: 'Benzodiazepiner', medlemmer: ['Diazepam', 'Oxazepam', 'Alprazolam', 'Lorazepam'] },
        { niveau: 2, navn: 'Antihistaminer', medlemmer: ['Cetirizin', 'Loratadin', 'Desloratadin', 'Fexofenadin'] },
        { niveau: 3, navn: 'DOAK (blodfortyndende)', medlemmer: ['Apixaban', 'Rivaroxaban', 'Edoxaban', 'Dabigatran'] },
        { niveau: 4, navn: 'Doseres én gang om ugen', medlemmer: ['Alendronat', 'Ozempic', 'Methotrexat', 'Trulicity'] },
    ],
    [
        { niveau: 1, navn: 'Vanddrivende', medlemmer: ['Furosemid', 'Bendroflumethiazid', 'Spironolacton', 'Bumetanid'] },
        { niveau: 2, navn: 'Mod epilepsi', medlemmer: ['Lamotrigin', 'Levetiracetam', 'Valproat', 'Carbamazepin'] },
        { niveau: 3, navn: 'Smalt terapeutisk vindue', medlemmer: ['Lithium', 'Warfarin', 'Digoxin', 'Fenytoin'] },
        { niveau: 4, navn: 'Kan farve urinen', medlemmer: ['Rifampicin', 'Methylenblåt', 'Nitrofurantoin', 'Levodopa'] },
    ],
    [
        { niveau: 1, navn: 'Ibuprofen-mærker', medlemmer: ['Ipren', 'Ibumetin', 'Brufen', 'Ibumax'] },
        { niveau: 2, navn: 'Insuliner', medlemmer: ['Lantus', 'NovoRapid', 'Levemir', 'Tresiba'] },
        { niveau: 3, navn: 'SSRI-handelsnavne', medlemmer: ['Zoloft', 'Cipralex', 'Cipramil', 'Fontex'] },
        { niveau: 4, navn: 'Mod ADHD', medlemmer: ['Ritalin', 'Concerta', 'Strattera', 'Elvanse'] },
    ],
    [
        { niveau: 1, navn: 'Glukokortikoider', medlemmer: ['Prednisolon', 'Hydrocortison', 'Betamethason', 'Dexamethason'] },
        { niveau: 2, navn: 'Mod svamp', medlemmer: ['Terbinafin', 'Flukonazol', 'Nystatin', 'Clotrimazol'] },
        { niveau: 3, navn: 'Mod virus', medlemmer: ['Aciclovir', 'Valaciclovir', 'Oseltamivir', 'Remdesivir'] },
        { niveau: 4, navn: 'Udviklet i Danmark', medlemmer: ['Escitalopram', 'Semaglutid', 'Fusidinsyre', 'Calcipotriol'] },
    ],
    [
        { niveau: 1, navn: 'Protonpumpehæmmere', medlemmer: ['Omeprazol', 'Pantoprazol', 'Esomeprazol', 'Lansoprazol'] },
        { niveau: 2, navn: 'Mod kvalme', medlemmer: ['Ondansetron', 'Metoclopramid', 'Domperidon', 'Meclozin'] },
        { niveau: 3, navn: 'Afføringsmidler', medlemmer: ['Laktulose', 'Movicol', 'Bisacodyl', 'Natriumpicosulfat'] },
        { niveau: 4, navn: 'Triptaner (migræneanfald)', medlemmer: ['Sumatriptan', 'Rizatriptan', 'Zolmitriptan', 'Eletriptan'] },
    ],
    [
        { niveau: 1, navn: 'Calciumantagonister', medlemmer: ['Amlodipin', 'Felodipin', 'Nifedipin', 'Lercanidipin'] },
        { niveau: 2, navn: 'Angiotensin II-antagonister', medlemmer: ['Losartan', 'Candesartan', 'Valsartan', 'Irbesartan'] },
        { niveau: 3, navn: 'Trombocythæmmere', medlemmer: ['Acetylsalicylsyre', 'Clopidogrel', 'Ticagrelor', 'Prasugrel'] },
        { niveau: 4, navn: 'Mod hjerterytmeforstyrrelser', medlemmer: ['Amiodaron', 'Flecainid', 'Digoxin', 'Dronedaron'] },
    ],
    [
        { niveau: 1, navn: 'Steroid-næsespray', medlemmer: ['Nasonex', 'Avamys', 'Rhinocort', 'Flixonase'] },
        { niveau: 2, navn: 'Mod grøn stær', medlemmer: ['Latanoprost', 'Timolol', 'Brimonidin', 'Dorzolamid'] },
        { niveau: 3, navn: 'Mod hoste eller slim', medlemmer: ['Noscapin', 'Dextromethorphan', 'Bromhexin', 'Acetylcystein'] },
        { niveau: 4, navn: 'Antistoffer (ender på -mab)', medlemmer: ['Adalimumab', 'Infliximab', 'Omalizumab', 'Denosumab'] },
    ],
    [
        { niveau: 1, navn: 'Antipsykotika', medlemmer: ['Quetiapin', 'Olanzapin', 'Aripiprazol', 'Haloperidol'] },
        { niveau: 2, navn: 'Sovemidler', medlemmer: ['Zopiclon', 'Zolpidem', 'Melatonin', 'Propiomazin'] },
        { niveau: 3, navn: 'Tricykliske antidepressiva', medlemmer: ['Amitriptylin', 'Nortriptylin', 'Imipramin', 'Clomipramin'] },
        { niveau: 4, navn: 'Mod demens', medlemmer: ['Donepezil', 'Rivastigmin', 'Galantamin', 'Memantin'] },
    ],
    [
        { niveau: 1, navn: 'Øjendråber', medlemmer: ['Kloramfenikol', 'Xalatan', 'Fucithalmic', 'Monoprost'] },
        { niveau: 2, navn: 'Pen til selvinjektion', medlemmer: ['Ozempic', 'EpiPen', 'Lantus', 'Forsteo'] },
        { niveau: 3, navn: 'Fås som plaster', medlemmer: ['Fentanyl', 'Buprenorphin', 'Nikotin', 'Rivastigmin'] },
        { niveau: 4, navn: 'Kan gives som stikpille', medlemmer: ['Stesolid', 'Panodil Junior', 'Diclofenac', 'Bisacodyl'] },
    ],
    [
        { niveau: 1, navn: 'Penicilliner', medlemmer: ['Phenoxymethylpenicillin', 'Amoxicillin', 'Dicloxacillin', 'Pivmecillinam'] },
        { niveau: 2, navn: 'Makrolider', medlemmer: ['Clarithromycin', 'Azithromycin', 'Erythromycin', 'Roxithromycin'] },
        { niveau: 3, navn: 'Tetracykliner', medlemmer: ['Doxycyclin', 'Tetracyklin', 'Lymecyklin', 'Minocyklin'] },
        { niveau: 4, navn: 'Fluorquinoloner', medlemmer: ['Ciprofloxacin', 'Moxifloxacin', 'Levofloxacin', 'Ofloxacin'] },
    ],
    [
        { niveau: 1, navn: 'Kan give tør hoste', medlemmer: ['Ramipril', 'Lisinopril', 'Enalapril', 'Perindopril'] },
        { niveau: 2, navn: 'Kan give vægtøgning', medlemmer: ['Mirtazapin', 'Olanzapin', 'Insulin', 'Pioglitazon'] },
        { niveau: 3, navn: 'Kan give lysfølsomhed', medlemmer: ['Doxycyclin', 'Amiodaron', 'Hydrochlorthiazid', 'Isotretinoin'] },
        { niveau: 4, navn: 'Kan give gynækomasti', medlemmer: ['Spironolacton', 'Ketoconazol', 'Cimetidin', 'Finasterid'] },
    ],
    [
        { niveau: 1, navn: 'Mod type 2-diabetes', medlemmer: ['Metformin', 'Sitagliptin', 'Empagliflozin', 'Glimepirid'] },
        { niveau: 2, navn: 'Kønshormoner', medlemmer: ['Estradiol', 'Progesteron', 'Testosteron', 'Levonorgestrel'] },
        { niveau: 3, navn: 'Mod osteoporose', medlemmer: ['Alendronat', 'Zoledronsyre', 'Denosumab', 'Teriparatid'] },
        { niveau: 4, navn: 'Skjoldbruskkirtlen', medlemmer: ['Levothyroxin', 'Liothyronin', 'Methimazol', 'Propylthiouracil'] },
    ],
    [
        { niveau: 1, navn: 'NSAID', medlemmer: ['Ibuprofen', 'Naproxen', 'Diclofenac', 'Celecoxib'] },
        { niveau: 2, navn: 'Mod nervesmerter', medlemmer: ['Gabapentin', 'Pregabalin', 'Amitriptylin', 'Duloxetin'] },
        { niveau: 3, navn: 'Mod urinsyregigt', medlemmer: ['Allopurinol', 'Febuxostat', 'Colchicin', 'Probenecid'] },
        { niveau: 4, navn: 'Mod leddegigt (DMARD)', medlemmer: ['Methotrexat', 'Sulfasalazin', 'Hydroxychloroquin', 'Leflunomid'] },
    ],
];

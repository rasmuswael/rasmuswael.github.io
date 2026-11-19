// Fælles hjælpefunktioner til beregnerne.

// Dansk talformat. Runder NED som standard, så et maksimum aldrig overskrides.
function tal(x, decimaler = 0, afrunding = 'ned') {
    const f = Math.pow(10, decimaler);
    const v = afrunding === 'ned' ? Math.floor(x * f + 1e-9) / f : Math.round(x * f) / f;
    return v.toLocaleString('da-DK', { minimumFractionDigits: 0, maximumFractionDigits: decimaler });
}

// Læser et talfelt (accepterer også komma). Returnerer NaN hvis tomt/ugyldigt.
function læsTal(id) {
    const v = String(document.getElementById(id).value).trim().replace(',', '.');
    return v === '' ? NaN : parseFloat(v);
}

function visTabel(el, rækker) {
    el.innerHTML = '<table>' + rækker.map(r =>
        '<tr><th>' + r[0] + '</th><td>' + r[1] + '</td></tr>'
    ).join('') + '</table>';
}

function visBesked(el, tekst) {
    el.innerHTML = '<div class="besked">' + tekst + '</div>';
}

// Kør beregn() ved enhver ændring i formularen
function bindAlle(beregn) {
    document.querySelectorAll('input, select').forEach(el => {
        el.addEventListener('input', beregn);
        el.addEventListener('change', beregn);
    });
    beregn();
}

// ---------- Doseringsregler (bruges af beregnerne og af Doseringsdyst) ----------
// Alle returnerer { mgMin, mgMax } pr. dosis (+ evt. ml) eller { fejl: tekst }.

const PANODIL_JUNIOR_MG_PR_ML = 24;
const IBUPROFEN_MIKSTUR_MG_PR_ML = 20;

// Paracetamol, børn 5–< 50 kg: 50–60 mg/kg/døgn fordelt på 4 doser (Lægehåndbogen)
function paracetamolDosis(kg) {
    if (kg < 5) return { fejl: 'Under 5 kg / 3 måneder: anden dosering' };
    if (kg >= 50) return { voksen: true, mgMin: 500, mgMax: 1000, døgnMax: 3000, doser: '3–4' };
    const døgnMin = 50 * kg, døgnMax = 60 * kg;
    return {
        døgnMin, døgnMax, doser: 4,
        mgMin: døgnMin / 4, mgMax: døgnMax / 4,
        mlMin: døgnMin / 4 / PANODIL_JUNIOR_MG_PR_ML, mlMax: døgnMax / 4 / PANODIL_JUNIOR_MG_PR_ML,
    };
}

// Ibuprofen, børn ≥ 6 mdr. og ≥ 7 kg: 5–7,5 mg/kg pr. dosis, højst 20–30 mg/kg/døgn (Lægehåndbogen)
function ibuprofenDosis(kg) {
    if (kg < 7) return { fejl: 'Under 6 måneder / 7 kg: må ikke gives' };
    if (kg >= 40) return { voksen: true, mgMin: 200, mgMax: 400, døgnMax: 1200 };
    return {
        mgMin: 5 * kg, mgMax: 7.5 * kg, døgnMin: 20 * kg, døgnMax: 30 * kg,
        mlMin: 5 * kg / IBUPROFEN_MIKSTUR_MG_PR_ML, mlMax: 7.5 * kg / IBUPROFEN_MIKSTUR_MG_PR_ML,
    };
}

// Antibiotika-mikstur til børn (Børnedoseringstabel, "Infektioner i almen praksis" v. 6.4, aug. 2025)
const ANTIBIOTIKA = {
    pcv:      { navn: 'Penicillin V', mgPrKg: 50, styrke: 50, doser: 3 },
    amox:     { navn: 'Amoxicillin', mgPrKg: 50, styrke: 50, doser: 3, maks: 3000 },
    amoxclav: { navn: 'Amoxicillin + clavulansyre', mgPrKg: 50, styrke: 50, doser: 3, maksKg: 40,
                note: 'Kun børn over 1 måned. Dosis angivet som amoxicillin (+ 12,5 mg/kg/døgn clavulansyre).' },
    clari:    { navn: 'Clarithromycin', mgPrKg: 15, doser: 2 },
    trim:     { navn: 'Trimethoprim', mgPrKg: 6, styrke: 10, doser: 2 },
};

function antibiotikaDosis(middel, kg) {
    const m = ANTIBIOTIKA[middel];
    if (kg < 5) return { fejl: 'Under 5 kg: ikke dækket af tabellen – kontakt pædiater' };
    if (kg >= (m.maksKg || 40)) return { fejl: 'Voksendosering (tabletter)' };
    let døgn = m.mgPrKg * kg, loft = false;
    if (m.maks && døgn > m.maks) { døgn = m.maks; loft = true; }
    const dosis = døgn / m.doser;
    // Clarithromycin: 25 mg/ml under 10 kg, begge ved 10–12 kg, ellers 50 mg/ml
    const styrker = m.styrke ? [m.styrke] : (kg < 10 ? [25] : kg <= 12 ? [25, 50] : [50]);
    return { middel: m, døgn, dosis, loft, styrker, ml: styrker.map(s => ({ styrke: s, dosis: dosis / s, døgn: døgn / s })) };
}

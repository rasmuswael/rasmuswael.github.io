// Fælles kode til spillene: lagring, dagens opgave, statistik, deling og forslagsliste.

const DAG = 86400000;

const norm = s => String(s).toLowerCase().normalize('NFC').replace(/[\s\-\.\/+()'’]/g, '');

// localStorage kan være blokeret (privat browsing m.m.) – spillet skal virke alligevel
function lager(nøgle, værdi) {
    try {
        if (værdi === undefined) return JSON.parse(localStorage.getItem(nøgle));
        localStorage.setItem(nøgle, JSON.stringify(værdi));
    } catch (e) { return null; }
}

function datoNøgle(d = new Date()) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

// Seedet tilfældighedsgenerator (mulberry32)
function rng(frø) {
    let s = frø >>> 0;
    return () => {
        s = (s + 0x6D2B79F5) >>> 0;
        let t = s;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}

function blandet(liste, frø) {
    const r = liste.slice();
    const tilfældig = typeof frø === 'function' ? frø : (frø === undefined ? Math.random : rng(frø));
    for (let i = r.length - 1; i > 0; i--) {
        const j = Math.floor(tilfældig() * (i + 1));
        [r[i], r[j]] = [r[j], r[i]];
    }
    return r;
}

function dagsNummer(nøgle) {
    const [å, m, d] = nøgle.split('-').map(Number);
    return Math.round((Date.UTC(å, m - 1, d) - Date.UTC(2026, 0, 1)) / DAG);
}

// Samme element for alle spillere på en given dato; rækkefølgen er fast blandet
function dagensElement(liste, frø, nøgle) {
    const r = blandet(liste, frø);
    const n = r.length;
    return r[((dagsNummer(nøgle) % n) + n) % n];
}

function tilfældigtAndet(liste, undtagen) {
    if (liste.length < 2) return liste[0];
    let e;
    do { e = liste[Math.floor(Math.random() * liste.length)]; } while (e === undtagen);
    return e;
}

// ---------- Statistik for vind/tab-spil ----------
function registrérResultat(spilnavn, iDag, vundet, forsøg) {
    const nøgle = spilnavn + '-stats';
    const st = lager(nøgle) || { spillet: 0, vundet: 0, stime: 0, bedste: 0, sidste: null, fordeling: [] };
    if (st.sidste === iDag) return st;
    const igår = datoNøgle(new Date(Date.now() - DAG));
    st.spillet++;
    if (vundet) {
        st.vundet++;
        st.fordeling = st.fordeling || [];
        st.fordeling[forsøg - 1] = (st.fordeling[forsøg - 1] || 0) + 1;
        st.stime = st.sidsteVundet === igår ? st.stime + 1 : 1;
        st.sidsteVundet = iDag;
        st.bedste = Math.max(st.bedste, st.stime);
    } else {
        st.stime = 0;
    }
    st.sidste = iDag;
    lager(nøgle, st);
    return st;
}

function statistikHTML(spilnavn) {
    const st = lager(spilnavn + '-stats');
    if (!st) return '';
    return '<div class="statistik">' +
        '<div><b>' + st.spillet + '</b><span>Spillet</span></div>' +
        '<div><b>' + Math.round(100 * st.vundet / Math.max(st.spillet, 1)) + '</b><span>% vundet</span></div>' +
        '<div><b>' + st.stime + '</b><span>Stime</span></div>' +
        '<div><b>' + st.bedste + '</b><span>Bedste stime</span></div></div>';
}

// ---------- Deling ----------
function delKnap(knap, tekst) {
    knap.onclick = async () => {
        const t = typeof tekst === 'function' ? tekst() : tekst;
        try { await navigator.clipboard.writeText(t); knap.textContent = 'Kopieret ✓'; }
        catch (e) { prompt('Kopiér dit resultat:', t); }
    };
}

// ---------- Forslagsliste (combobox) ----------
// Erstatter <datalist>, som iOS kun viser 3 forslag fra.
// opts: { felt, liste, form, boks, elementer, navn(e), aliaser(e), deaktiveret(e), vælg(e), låst(), fejl(tekst), ingen }
function lavForslag(opts) {
    const { felt, liste, form, boks } = opts;
    const aliaser = opts.aliaser || (() => []);
    const deaktiveret = opts.deaktiveret || (() => false);
    const låst = opts.låst || (() => false);
    let synlige = [], aktiv = -1;

    // Opslag: navn og alle aliaser -> element
    const opslag = new Map();
    for (const e of opts.elementer) {
        opslag.set(norm(opts.navn(e)), e);
        for (const a of aliaser(e)) if (!opslag.has(norm(a))) opslag.set(norm(a), e);
    }
    function find(tekst) {
        const t = String(tekst).trim();
        const m = t.match(/\(([^)]+)\)\s*$/);          // "Panodil (Paracetamol)"
        if (m && opslag.has(norm(m[1]))) return opslag.get(norm(m[1]));
        return opslag.get(norm(t)) || null;
    }

    // 0: navn starter med teksten, 1: alias starter med, 2: indeholder. Tom tekst = alle alfabetisk.
    function filtrér(tekst) {
        const t = norm(tekst);
        const alfabetisk = (a, b) => opts.navn(a).localeCompare(opts.navn(b), 'da');
        if (!t) return opts.elementer.slice().sort(alfabetisk);
        const grupper = [[], [], []];
        for (const e of opts.elementer) {
            const n = norm(opts.navn(e)), al = aliaser(e).map(norm);
            if (n.startsWith(t)) grupper[0].push(e);
            else if (al.some(a => a.startsWith(t))) grupper[1].push(e);
            else if (n.includes(t) || al.some(a => a.includes(t))) grupper[2].push(e);
        }
        return grupper.flatMap(g => g.sort(alfabetisk));
    }

    function åbn() {
        if (låst()) return luk();
        const t = norm(felt.value);
        synlige = filtrér(felt.value);
        aktiv = -1;
        liste.innerHTML = synlige.length
            ? synlige.map((e, i) => {
                let al = aliaser(e).filter(a => norm(a) !== norm(opts.navn(e)));
                // Aliaser der matcher søgningen først, så man kan se hvorfor rækken er med; højst 4 vises
                if (t) al = [...al.filter(a => norm(a).includes(t)), ...al.filter(a => !norm(a).includes(t))];
                const vis = al.slice(0, 4).concat(al.length > 4 ? ['+ ' + (al.length - 4) + ' flere'] : []);
                const fra = deaktiveret(e);
                return '<li id="' + liste.id + '-' + i + '" role="option" data-i="' + i + '"' + (fra ? ' class="gættet" aria-disabled="true"' : '') + '>' +
                    '<b>' + opts.navn(e) + '</b>' + (vis.length ? '<small>' + vis.join(' · ') + '</small>' : '') + '</li>';
            }).join('')
            : '<li class="tom">' + (opts.ingen || 'Ingen match') + '</li>';
        liste.hidden = false;
        liste.scrollTop = 0;
        felt.setAttribute('aria-expanded', 'true');
        felt.removeAttribute('aria-activedescendant');
    }
    function luk() {
        liste.hidden = true;
        aktiv = -1;
        felt.setAttribute('aria-expanded', 'false');
        felt.removeAttribute('aria-activedescendant');
    }
    function markér(i) {
        const rækker = liste.querySelectorAll('li[role="option"]');
        if (!rækker.length) return;
        aktiv = (i + rækker.length) % rækker.length;
        rækker.forEach((r, j) => r.classList.toggle('aktiv', j === aktiv));
        rækker[aktiv].scrollIntoView({ block: 'nearest' });
        felt.setAttribute('aria-activedescendant', rækker[aktiv].id);
    }
    function vælg(e) {
        if (låst()) return;
        if (!e) { opts.fejl('Kender ikke “' + felt.value.trim() + '” – vælg fra listen.'); return; }
        if (deaktiveret(e)) { opts.fejl('Du har allerede gættet ' + opts.navn(e) + '.'); return; }
        felt.value = '';
        luk();
        felt.blur();          // skjul tastaturet på mobil, så ledetrådene kan ses
        opts.vælg(e);
    }

    felt.addEventListener('focus', () => {
        åbn();
        if (boks) setTimeout(() => boks.scrollIntoView({ block: 'start', behavior: 'smooth' }), 300);
    });
    felt.addEventListener('input', () => { opts.fejl(''); åbn(); });
    felt.addEventListener('blur', () => setTimeout(luk, 150));
    felt.addEventListener('keydown', e => {
        if (e.key === 'ArrowDown') { e.preventDefault(); if (liste.hidden) åbn(); markér(aktiv + 1); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); markér(aktiv - 1); }
        else if (e.key === 'Escape') luk();
    });
    // pointerdown + preventDefault: feltet mister ikke fokus før valget registreres
    liste.addEventListener('pointerdown', e => e.preventDefault());
    liste.addEventListener('click', e => {
        const li = e.target.closest('li[role="option"]');
        if (!li || li.classList.contains('gættet')) return;
        vælg(synlige[Number(li.dataset.i)]);
    });
    form.addEventListener('submit', e => {
        e.preventDefault();
        if (!liste.hidden && aktiv >= 0) return vælg(synlige[aktiv]);
        if (!felt.value.trim()) return;
        vælg(find(felt.value));
    });

    return { find, filtrér, åbn, luk };
}

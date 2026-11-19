// Fælles hamburger-menu. Tilføj nye sider her – så kommer de med på alle sider.
(function () {
    const MENU = [
        { gruppe: null, links: [['index.html', 'Forside']] },
        { gruppe: 'Børn', links: [
            ['panodil.html', 'Panodil (paracetamol)'],
            ['ibuprofen.html', 'Ibuprofen'],
            ['antibiotika.html', 'Antibiotika-mikstur'],
        ]},
        { gruppe: 'Nyrer', links: [['nyrefunktion.html', 'eGFR / kreatininclearance']] },
        { gruppe: 'Hjerte-kar', links: [
            ['cha2ds2va.html', 'CHA₂DS₂-VA'],
            ['score2.html', 'SCORE2 / SCORE2-OP'],
        ]},
        { gruppe: 'Øvrigt', links: [
            ['termin.html', 'Terminsberegner'],
            ['mdi.html', 'MDI (depression)'],
        ]},
        { gruppe: 'Spil', links: [
            ['pilledle.html', 'Pilledle – gæt lægemidlet'],
            ['diagnosedle.html', 'Diagnosedle – stil diagnosen'],
            ['firklover.html', 'Firkløver – find grupperne'],
            ['skurken.html', 'Hvem er skurken? – bivirkninger'],
            ['kombi.html', 'Farlig kombi? – interaktioner'],
            ['dosering.html', 'Doseringsdyst – ram dosis'],
        ]},
    ];

    const her = location.pathname.split('/').pop() || 'index.html';
    let html = '<summary aria-label="Menu" title="Menu">☰</summary><nav>';
    for (const g of MENU) {
        if (g.gruppe) html += '<div class="gruppe">' + g.gruppe + '</div>';
        for (const [href, navn] of g.links) {
            html += '<a href="' + href + '"' + (href === her ? ' aria-current="page"' : '') + '>' + navn + '</a>';
        }
    }
    html += '</nav>';

    const menu = document.createElement('details');
    menu.className = 'menu';
    menu.innerHTML = html;
    document.body.prepend(menu);

    // Luk menuen ved klik udenfor eller Escape
    document.addEventListener('click', e => { if (!menu.contains(e.target)) menu.open = false; });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') menu.open = false; });
})();

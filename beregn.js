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

// Indlæses i <head> uden defer, så pink mode sættes, før siden tegnes (ingen blink ved sideskift).
try { if (localStorage.getItem('tema') === 'pink') document.documentElement.dataset.tema = 'pink'; } catch (e) {}

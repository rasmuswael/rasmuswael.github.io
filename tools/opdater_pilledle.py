#!/usr/bin/env python3
"""Opdaterer pilledle-officiel.js med handelsnavne og former fra Lægemiddelstyrelsen.

Kilde: Lægemiddelstyrelsens liste over godkendte lægemidler (Excel, opdateres dagligt).
Kun præparater der er i Medicinpriser (dvs. markedsført) tages med, og kun for de
ATC-koder der findes i pilledle-data.js.

Brug (fra repoets rod):
    python3 tools/opdater_pilledle.py            # henter listen fra nettet
    python3 tools/opdater_pilledle.py liste.xlsx # bruger en allerede hentet fil

Kun standardbiblioteket bruges.
"""
import datetime
import io
import json
import re
import sys
import urllib.request
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

KILDE_URL = "https://laegemiddelstyrelsen.dk/LinkArchive.ashx?id=0BD4960F0D7744E3BABC951431681ECC&lang=en"
ROD = Path(__file__).resolve().parent.parent
DATA_JS = ROD / "pilledle-data.js"
UD_JS = ROD / "pilledle-officiel.js"
NS = {"s": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}

# LægemiddelForm (små bogstaver) -> spillets formkategori. Første match vinder.
FORMER = [
    ("vaginal", "Vaginaltablet"),
    ("øjendråber", "Øjendråber"), ("øjengel", "Øjendråber"), ("øjensalve", "Øjendråber"),
    ("næsespray", "Næsespray"), ("næsedråber", "Næsespray"),
    ("inhalation", "Inhalation"), ("til inhalation", "Inhalation"),
    ("resoribletter", "Resoriblet"), ("sublingual", "Resoriblet"), ("mundhulespray", "Spray"),
    ("tablet", "Tablet"),
    ("kapsl", "Kapsel"),
    ("suppositori", "Stikpille"),
    ("rektal", "Klysma"), ("klysma", "Klysma"),
    ("injektion", "Injektion"), ("infusion", "Injektion"),
    ("granulat til oral suspension", "Mikstur"), ("pulver til oral suspension", "Mikstur"),
    ("pulver til oral", "Pulver"), ("pulver", "Pulver"), ("granulat", "Pulver"),
    ("oral opløsning", "Mikstur"), ("oral suspension", "Mikstur"), ("mikstur", "Mikstur"),
    ("orale dråber", "Mikstur"), ("sirup", "Mikstur"),
    ("creme", "Creme"), ("salve", "Salve"), ("gel", "Gel"), ("liniment", "Creme"), ("kutan", "Creme"),
    ("plaster", "Plaster"), ("plastre", "Plaster"),
]


def hent(sti=None):
    if sti:
        return Path(sti).read_bytes()
    req = urllib.request.Request(KILDE_URL, headers={"User-Agent": "Mozilla/5.0 (pilledle-opdatering)"})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read()


def kolonne_nr(ref):
    bogstaver = re.match(r"[A-Z]+", ref).group()
    n = 0
    for b in bogstaver:
        n = n * 26 + ord(b) - 64
    return n - 1


def læs_xlsx(indhold):
    """Returnerer rækkerne i første ark som lister af strenge."""
    z = zipfile.ZipFile(io.BytesIO(indhold))
    delte = []
    if "xl/sharedStrings.xml" in z.namelist():
        for si in ET.fromstring(z.read("xl/sharedStrings.xml")).findall("s:si", NS):
            delte.append("".join(t.text or "" for t in si.iter("{%s}t" % NS["s"])))
    ark = ET.fromstring(z.read("xl/worksheets/sheet1.xml"))
    rækker = []
    for række in ark.iter("{%s}row" % NS["s"]):
        celler = {}
        for c in række.findall("s:c", NS):
            v = c.find("s:v", NS)
            if c.get("t") == "s" and v is not None:
                tekst = delte[int(v.text)]
            elif c.get("t") == "inlineStr":
                tekst = "".join(t.text or "" for t in c.iter("{%s}t" % NS["s"]))
            else:
                tekst = v.text if v is not None else ""
            celler[kolonne_nr(c.get("r"))] = (tekst or "").strip()
        if celler:
            rækker.append([celler.get(i, "") for i in range(max(celler) + 1)])
    return rækker


def find_kolonne(overskrift, *navne):
    norm = [h.lower().replace(" ", "").replace("-", "") for h in overskrift]
    for navn in navne:
        n = navn.lower().replace(" ", "").replace("-", "")
        if n in norm:
            return norm.index(n)
    sys.exit("Fandt ikke kolonnen %r i %r" % (navne, overskrift))


def form_kategori(form):
    f = form.lower()
    for nøgle, kategori in FORMER:
        if nøgle in f:
            return kategori
    return None


def renset_navn(navn):
    # 'Paracetamol "Teva"' -> 'Paracetamol' ; 'Madopar 125' -> 'Madopar'
    navn = re.sub(r'["“”].*?["“”]', "", navn)
    navn = re.sub(r"(\s+[\d][\d,./]*)+\s*$", "", navn)
    return re.sub(r"\s+", " ", navn).strip(" ,.-")


def bogstaver(s):
    return re.sub(r"[^a-zæøå]", "", s.lower())


def ligner_generisk(navn, generisk):
    """Sandt for generiske stavemåder og salte: 'Omeprazole', 'Metoprololsuccinat', 'Mometasonfuroat'."""
    n, g = bogstaver(navn), bogstaver(generisk)
    return n == g or n.startswith(g[:6]) or g.startswith(n)


def main():
    js = DATA_JS.read_text(encoding="utf-8")
    præparater = re.findall(r"navn: '([^']+)'.*?atc: '([A-Z]\d\d[A-Z]{2}\d\d)'", js)
    atc_til_navn = {atc: navn for navn, atc in præparater}

    rækker = læs_xlsx(hent(sys.argv[1] if len(sys.argv) > 1 else None))
    # Overskriftsrækken er den første der indeholder "ATC"
    start = next(i for i, r in enumerate(rækker) if any("atc" in c.lower() for c in r))
    hoved = rækker[start]
    k_navn = find_kolonne(hoved, "Lægemiddel", "Navn")
    k_atc = find_kolonne(hoved, "ATC-Kode", "ATC")
    k_form = find_kolonne(hoved, "LægemiddelForm", "Lægemiddelform", "Form")
    k_pris = find_kolonne(hoved, "Er i Medicinpriser", "ErIMedicinpriser")

    data = {atc: {"mærker": set(), "former": set()} for atc in atc_til_navn}
    ukendte_former = {}
    for r in rækker[start + 1:]:
        r = r + [""] * (len(hoved) - len(r))
        atc = r[k_atc].upper()
        if atc not in data or r[k_pris].strip().lower() not in ("ja", "yes", "true", "1", "x"):
            continue
        kategori = form_kategori(r[k_form])
        if kategori:
            data[atc]["former"].add(kategori)
        else:
            ukendte_former.setdefault(r[k_form], set()).add(atc)
        navn = renset_navn(r[k_navn])
        if navn and not ligner_generisk(navn, atc_til_navn[atc]):
            # Samme navn med forskellig skrivemåde (Selo-zok/Selo-Zok) tælles kun én gang
            if not any(m.lower() == navn.lower() for m in data[atc]["mærker"]):
                data[atc]["mærker"].add(navn)

    dansk = lambda s: s.lower().replace("æ", "{").replace("ø", "|").replace("å", "}")
    ud = {atc: {"mærker": sorted(v["mærker"], key=dansk), "former": sorted(v["former"])}
          for atc, v in data.items() if v["mærker"] or v["former"]}

    dato = datetime.date.today().isoformat()
    UD_JS.write_text(
        "// GENERERET af tools/opdater_pilledle.py – redigér ikke i hånden.\n"
        "// Kilde: Lægemiddelstyrelsen, liste over godkendte lægemidler (kun markedsførte præparater).\n"
        "const OFFICIEL = " + json.dumps({"opdateret": dato, "kilde": KILDE_URL, "data": ud},
                                          ensure_ascii=False, indent=1) + ";\n",
        encoding="utf-8")

    print("Skrev %s (%d af %d ATC-koder fundet)" % (UD_JS.name, len(ud), len(atc_til_navn)))
    for atc, navn in sorted(atc_til_navn.items()):
        v = ud.get(atc)
        print("  %-8s %-40s %s" % (atc, navn, "INGEN MATCH" if not v else
              "%d mærker, former: %s" % (len(v["mærker"]), ", ".join(v["former"]))))
    if ukendte_former:
        print("\nForme uden kategori (udvid FORMER):")
        for f, atcs in sorted(ukendte_former.items()):
            print("  %r: %s" % (f, ", ".join(sorted(atcs))))


if __name__ == "__main__":
    main()

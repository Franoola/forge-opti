# Forge Master Optimizer - Mobile & Web Edition

Wersja webowa i mobilna aplikacji **Forge Master Optimizer** stworzona z myślą o telefonach (Android oraz iPhone / iOS) i przeglądarkach desktopowych.

---

## 🚀 Jak uruchomić lokalnie (do testów na PC i telefonie w tej samej sieci Wi-Fi)

Wystarczy dowolny serwer HTTP. W folderze projektu wpisz w terminalu:

```bash
cd web
python -m http.server 8000
```

1. Na komputerze otwórz w przeglądarce: `http://localhost:8000`
2. Na telefonie (podłączonym do tej samej sieci Wi-Fi) otwórz: `http://<IP_KOMPUTERA>:8000` (np. `http://192.168.1.50:8000`).

---

## 🌐 Jak wrzucić za darmo do internetu (dla całego klanu w 1 minutę)

Możesz udostępnić tę aplikację klanowiczom pod darmowym adresem HTTPS:

### Sposób A: Vercel (Najprostszy i najszybszy)
1. Wejdź na [vercel.com](https://vercel.com) i zaloguj się.
2. Kliknij **Add New Project** i przeciągnij folder `web/` lub połącz z repozytorium GitHub.
3. Gotowe! Otrzymasz natychmiast link w stylu: `https://twoj-klan-opti.vercel.app`

### Sposób B: GitHub Pages
1. Wrzuć zawartość folderu `web/` do repozytorium na GitHubie.
2. W ustawieniach repozytorium przejdź do zakładki **Pages** i wybierz branch `main` -> root folder.
3. Strona będzie dostępna pod adresem: `https://twoj-login.github.io/nazwa-repo/`

### Sposób C: Netlify / Cloudflare Pages
- Działa analogicznie – wystarczy przeciągnąć folder `web/`.

---

## 📱 Jak dodać aplikację do ekranu telefonu (PWA - Pełny ekran bez pasków przeglądarki)

Aplikacja jest w pełni zgodna z technologią **Progressive Web App (PWA)** i posiada wbudowany Service Worker (działa nawet **offline** bez internetu!).

### Na Androidzie (Google Chrome):
1. Otwórz link do aplikacji w Chrome.
2. Kliknij menu (trzy kropki w prawym górnym rogu).
3. Wybierz **„Dodaj do ekranu głównego”** (lub „Zainstaluj aplikację”).
4. Na pulpicie telefonu pojawi się normalna ikona aplikacji z logo Forge Master. Po kliknięciu odpala się na pełnym ekranie jak natywna gra/appka.

### Na iPhone / iOS (Safari):
1. Otwórz link do aplikacji w przeglądarce Safari.
2. Kliknij przycisk **Udostępnij** (kwadrat ze strzałką w górę na dole ekranu).
3. Zjedź w dół i wybierz **„Do ekranu początkowego”** (Add to Home Screen).
4. Kliknij „Dodaj”. Gotowe!

---

## ✨ Funkcjonalności wersji mobilnej

1. **Silnik bojowy 1:1 z wersją PC:**
   - Pełne obliczanie Real DPS, Real HPS, Effective Multiplier, Optimal Match %.
   - Uwzględnienie wszystkich progów **Attack Speed Breakpoints** (w tym nowo dodanego **+203.0% -> 0.4s** i **+233.4% -> 0.35s**).
   - Dynamiczny przelicznik Crit Chance z wróżki Mira na bazie Skill Damage (Fairy blocks).
   - Sprzętowy cutoff statystyk przy przełączaniu broni Melee / Ranged.

2. **Kafelkowy interfejs dotykowy:**
   - Sloty zbroi 1–8 oraz Sloty Mount i Pet 1–3 z dynamicznym podświetleniem barw rzadkości (Common, Rare, Epic, Legendary, Ultimate, Mythic).
   - Wpisywanie wartości bazowych z obsługą skrótów `k` i `m` (np. `20k`, `1.3m`).
   - Szybki symulator zamiany przedmiotu (**Marginal Swap Simulator**) z wyliczaniem jakości dropu (**Item Quality Score**).

3. **Storage Optimizer na telefonie:**
   - Magazyn petów i mountów z pełną edycją i dodawaniem.
   - Symulacja wszystkich kombinacji 1 Mount + 3 Pety w ułamku sekundy.
   - Wymuszenie protokołu przetrwania (minimum 30% Lifesteal) i priorytetyzacja realnego DPS.
   - Przycisk **„Apply to Build”** od razu wyposażający zwycięski zestaw.

4. **Synchronizacja i Backup JSON:**
   - Przycisk **💾 JSON** na górnym pasku pozwala wkleić lub pobrać plik `forge_master_build.json`.
   - Automatyczna migracja starych plików klanowiczów (bez zer x1000) do nowego standardu `format_version: 2`.
   - Wszystkie zmiany są automatycznie zapisywane w pamięci telefonu (`localStorage`).

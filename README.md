# Movie Recommender — Frontend

Aplikacja webowa systemu rekomendacji filmów zbudowana przy użyciu **Next.js 16**. Umożliwia przeglądanie bazy filmów, korzystanie z rankingów oraz uzyskiwanie spersonalizowanych rekomendacji opartych na trzech niezależnych silnikach.

---

## Struktura projektu

```
recommender/
├── next.config.ts           # Konfiguracja Next.js (domeny obrazów TMDB)
├── tailwind.config.ts       # Konfiguracja Tailwind CSS
├── tsconfig.json            # Konfiguracja TypeScript
├── package.json             # Zależności projektu
│
├── public/
│   └── manifest.json        # Manifest PWA
│
└── src/
    ├── app/                 # Strony i trasy API (Next.js App Router)
    │   ├── page.tsx         # Strona główna
    │   ├── layout.tsx       # Główny layout aplikacji
    │   ├── movies/          # Baza filmów
    │   ├── rankings/        # Rankingi filmów
    │   ├── recommender/     # Widok rekomendacji
    │   └── api/
    │       ├── movies/      # Endpoint pobierania filmów
    │       ├── recommendations_v1/   # Proxy → backend v1
    │       ├── recommendations_v2/   # Proxy → backend v2
    │       ├── recommendations_gemini/  # Silnik Gemini AI
    │       └── health/      # Status backendu
    │
    ├── components/
    │   ├── global/          # NavBar, MovieCard, SearchBar, Title…
    │   ├── layout/          # Background, Container, LenisProvider…
    │   ├── movies/          # MovieList, MovieFilters, MovieModal…
    │   ├── rankings/        # MovieRankingCard, MovieRankingList
    │   └── recommender/     # RecommenderCard
    │
    ├── data/
    │   ├── full_data_web.json     # Pełna baza filmów (frontend)
    │   ├── top100_rating.json     # Top 100 wg oceny
    │   ├── top100_votes.json      # Top 100 wg liczby głosów
    │   └── top100_revenue.json    # Top 100 wg przychodów
    │
    ├── lib/                 # Logika pomocnicza (filtry, sortowanie, store'y Zustand)
    └── types/               # Typy TypeScript
```

---

## Silniki rekomendacji

### v1 — Podobieństwo kosinusowe (proxy)

Żądania przekazywane do zewnętrznego serwisu FastAPI na Render.com.

**Endpoint:** `POST /api/recommendations_v1`

```json
{
  "movie_id": 550,
  "k": 8
}
```

**Odpowiedź:**
```json
{
  "source_id": 550,
  "recommendations": [
    { "id": 807, "title": "Se7en" }
  ]
}
```

---

### v2 — Hybrydowy (embeddingi + BM25) (proxy)

Żądania przekazywane do zewnętrznego serwisu FastAPI na Render.com.

**Endpoint:** `POST /api/recommendations_v2`

```json
{
  "movie_id": 550,
  "k": 8,
  "top_m": 200
}
```

**Odpowiedź:**
```json
{
  "source_id": 550,
  "recommendations": [
    {
      "id": 807,
      "title": "Se7en",
      "score": 0.94,
      "why": "gatunki: thriller, crime"
    }
  ]
}
```

---

### v3 — Google Gemini AI

Rekomendacje generowane przez model językowy Google Gemini bezpośrednio po stronie serwera Next.js. Klucz API nigdy nie trafia do przeglądarki.

**Endpoint:** `POST /api/recommendations_gemini`

```json
{
  "movie_id": 550,
  "k": 8
}
```

**Odpowiedź:**
```json
{
  "source_id": 550,
  "recommendations": [
    {
      "id": 807,
      "title": "Se7en",
      "reason": "Podobny klimat i tematyka psychologiczna."
    }
  ]
}
```

---

## Pozostałe endpointy API

| Metoda | Ścieżka | Opis |
|--------|---------|------|
| `GET` | `/api/movies` | Lista filmów z filtrowaniem i paginacją |
| `GET` | `/api/health` | Status działania zewnętrznego API backendu |

Parametry zapytania dla `/api/movies`:

| Parametr | Typ | Opis |
|----------|-----|------|
| `page` | number | Numer strony (domyślnie: 1) |
| `perPage` | number | Wyników na stronę (domyślnie: 24, max: 60) |
| `query` | string | Fraza wyszukiwania |
| `genre` | string | Filtrowanie po gatunku |
| `language` | string | Filtrowanie po języku |
| `rating` | number | Minimalna ocena |
| `year` | number | Minimalny rok produkcji |
| `sort` | string | Kryterium sortowania |

---

## Wymagania wstępne

- Node.js 18+
- Klucz API Google Gemini (wymagany do silnika v3)

---

## Konfiguracja zmiennych środowiskowych

Utwórz plik `.env.local` w głównym katalogu projektu:

```bash
# Wymagany — klucz API Google Gemini (silnik rekomendacji v3)
GEMINI_API_KEY=twój_klucz_gemini

# Opcjonalne — nadpisanie domyślnego modelu Gemini (domyślnie: gemini-2.5-flash)
GEMINI_MODEL_ID=gemini-2.5-flash

# Opcjonalne — nadpisanie adresu zewnętrznego API backendu
RECOMMENDER_V1_URL=http://localhost:8000/api/v1/recommendations
RECOMMENDER_V2_URL=http://localhost:8000/api/v2/recommendations
```

Darmowy plan Gemini pozwala na około 100 żądań na dobę.

---

## Instalacja i uruchomienie

### 1. Zainstaluj zależności

```bash
npm install
```

### 2. Skonfiguruj zmienne środowiskowe

```bash
# Skopiuj przykładowy plik i uzupełnij wartości
cp .env.local.example .env.local
```

### 3. Uruchom serwer deweloperski

```bash
npm run dev
```

Aplikacja dostępna pod adresem: [http://localhost:3000](http://localhost:3000)

### 4. Budowanie do produkcji

```bash
npm run build
npm run start
```

---

## Zależności

| Pakiet | Zastosowanie |
|--------|-------------|
| `next` | Framework (App Router, SSR, API Routes) |
| `react` / `react-dom` | Biblioteka UI |
| `tailwindcss` | Stylowanie (utility-first CSS) |
| `@headlessui/react` | Dostępne komponenty UI (modal, listbox…) |
| `@heroicons/react` | Ikony SVG |
| `framer-motion` | Animacje i przejścia |
| `lenis` | Płynne przewijanie strony |
| `zustand` | Globalny stan aplikacji |
| `colorthief` | Ekstrakcja dominujących kolorów z plakatów |

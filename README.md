# Dickens Pub – Digitalt Reservasjonssystem

**Bacheloroppgave BAC3030 – IT og ledelse**
Universitetet i Sørøst-Norge (USN), Våren 2026

- **Utvikler:** Szymon Piotr Daraz
- **Veileder:** Marius Rohde Johannessen
- **Oppdragsgiver:** Dickens Pub, Drammen

## Om prosjektet

Dette er et fullstack reservasjonssystem utviklet for Dickens Pub i Drammen, byens eldste pub siden 1970. Systemet erstatter den manuelle reservasjonsprosessen (telefon og papirkalender) med en digital løsning som lar gjester reservere bord visuelt gjennom et interaktivt kart over lokalet.

Prosjektet ble gjennomført som et individuelt bachelorprosjekt og dekker hele utviklingsprosessen fra kravinnsamling til fungerende MVP.

## Hovedfunksjoner

### For gjester

- Visuell kalender med norske dagnavn for valg av dato
- Interaktivt bordkart over første etasje med 20 bord (T1–T9, V1–V8, H1–H3)
- Fargekoding av bord: grønn (ledig), rød (opptatt), gul (valgt), grå (for liten kapasitet)
- Tidsvelger med 15-minutters intervaller, tilpasset ukedager (12:00–21:00) og helger (11:00–21:00)
- Landskodevalg for telefonnummer med støtte for 11 land (Norge, Sverige, Danmark, UK, Tyskland, Frankrike, Italia, Spania, Polen, Nederland, Finland)
- Felt for tilleggsinformasjon (allergier, bursdager, spesielle behov)
- Bekreftelsesside med Dickens sitt telefonnummer for spørsmål

### For ansatte (Admin)

- Reservasjonsliste med søk på navn eller telefonnummer
- Filtrering av reservasjoner etter dato
- Godkjenne eller avslå reservasjonsforespørsler
- Redigere og slette eksisterende reservasjoner
- Visuelt bordkart med sanntidsoversikt over bordstatus
- Tooltip ved hover over opptatte bord som viser hvem som har reservert

### Automatisk forretningslogikk

- Bookinger må gjøres minst 24 timer i forveien
- Ingen reservasjoner aksepteres etter kl. 21:00
- Dobbeltbookingsbeskyttelse på server-siden
- Kapasitetssjekk mot bordets faktiske plassantall
- Automatisk utløp av reservasjoner 90 minutter etter booket tid
- Telefonnummervalidering mot landskode og riktig antall siffer

### Sanntidsfunksjonalitet

- Alle endringer i reservasjoner oppdateres umiddelbart for alle tilkoblede brukere
- Bruker Supabase sin PostgreSQL LISTEN/NOTIFY via WebSocket
- Frontend lytter med anon key (kun lesetilgang), backend skriver med service role key

## Teknologier

| Teknologi      | Versjon       | Rolle                                |
|----------------|---------------|--------------------------------------|
| React          | 18.3          | Frontend-rammeverk                   |
| Vite           | 8.0           | Utviklingsserver og byggesystem      |
| Tailwind CSS   | 3.4           | Styling og responsivt design         |
| React Router   | 7.15          | Klientside-navigasjon                |
| Node.js        | –             | Kjøremiljø for backend               |
| Express        | 5.2           | HTTP-server og API-rammeverk         |
| Supabase JS    | 2.105         | Klientbibliotek for database         |
| PostgreSQL     | via Supabase  | Relasjonsdatabase                    |

## Prosjektstruktur

```
dickens-pub-reservasjon/
├── backend/
│   ├── index.js                  # Express server, alle API-endepunkter, validering og utløpslogikk
│   ├── package.json              # Backend-avhengigheter (express, cors, dotenv, supabase-js)
│   └── .env.example              # Mal for miljøvariabler (Supabase URL og nøkler)
├── frontend/
│   ├── index.html                # HTML-inngangspunkt for Vite
│   ├── src/
│   │   ├── App.jsx               # React Router oppsett, definerer ruter for offentlig og admin
│   │   ├── supabase.js           # Supabase klientkonfigurasjon med anon key for sanntid
│   │   ├── main.jsx              # React entry point, rendrer App-komponenten
│   │   ├── index.css             # Global CSS og Tailwind-importering
│   │   ├── constants.js          # Delte konstanter (bordposisjoner, landskoder, reservasjonslengde)
│   │   └── components/
│   │       ├── PublicBooking.jsx    # Orkestrator for bookingflyten, styrer steg 1 og 2
│   │       ├── Step1Calendar.jsx    # Datovelger med norske månedsnavn og ukedager
│   │       ├── Step2FloorPlan.jsx   # Interaktivt bordkart, bookingskjema og sanntidslytting
│   │       ├── TimeDropdown.jsx     # Tidsvelger, ukedager 12–21 og helger 11–21, 15 min intervaller
│   │       ├── GuestDropdown.jsx    # Nedtrekksmeny for antall gjester (1–7)
│   │       ├── Header.jsx           # Header med Dickens-logo og undertekst
│   │       ├── Footer.jsx           # Footer med skjult admin-lenke
│   │       └── admin/
│   │           ├── AdminLayout.jsx       # Sidebar-layout med navigasjon mellom admin-sider
│   │           ├── ReservationsView.jsx  # Reservasjonstabell med søk, filter, redigering og sletting
│   │           └── TableMap.jsx          # Visuelt admin-bordkart med tooltip og datofilter
│   ├── package.json              # Frontend-avhengigheter (react, react-dom, react-router-dom, supabase-js)
│   ├── vite.config.js            # Vite konfigurasjon, utviklingsserver på port 8000
│   ├── tailwind.config.js        # Tailwind konfigurasjon med Dickens-farger (grønn, gull, krem)
│   └── postcss.config.js         # PostCSS konfigurasjon for Tailwind CSS-prosessering
├── tests/
│   ├── test-system.js            # End-to-end test: POST reservasjon, GET alle, verifiser data
│   ├── test_phone.sh             # Telefonvalidering: gyldig NO, ugyldig NO, gyldig UK
│   └── run_cloud_tests.sh        # Kapasitetssjekk, 24h-regel, stengetid, admin CRUD-syklus
├── supabase_schema_and_seed.sql  # SQL-skjema for areas, tables, reservations + seed-data for 20 bord
└── README.md                     # Denne filen
```

## Installasjon

### Forutsetninger

- Node.js (v18 eller nyere)
- npm
- En Supabase-konto (gratis tier fungerer)

### 1. Database

1. Opprett et nytt prosjekt på [supabase.com](https://supabase.com)
2. Gå til SQL Editor i Supabase Dashboard
3. Kjør innholdet i `supabase_schema_and_seed.sql`
4. Verifiser at tabellene `areas`, `tables` og `reservations` er opprettet med data

### 2. Backend

```bash
cd backend
npm install
```

Opprett en `.env` fil basert på `.env.example`:

```
SUPABASE_URL=https://ditt-prosjekt.supabase.co
SUPABASE_SERVICE_ROLE_KEY=din-service-role-key-her
```

Start serveren:

```bash
node index.js
```

Du skal se: `Supabase Server running on http://localhost:5001`

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontenden kjører på http://localhost:8000

### 4. Miljøvariabler frontend

Opprett en `.env` fil i frontend-mappen basert på `.env.example`:

```
VITE_SUPABASE_URL=https://ditt-prosjekt.supabase.co
VITE_SUPABASE_ANON_KEY=din-anon-key-her
```

## API-endepunkter

| Metode | Endepunkt                      | Beskrivelse                                                |
|--------|--------------------------------|------------------------------------------------------------|
| GET    | `/areas`                       | Henter alle soner i lokalet                                |
| GET    | `/tables`                      | Henter alle bord, kan filtreres med `?areaId=1`            |
| GET    | `/tables/availability`         | Sjekker ledige bord for gitt dato, tid og antall gjester   |
| GET    | `/api/occupied-tables`         | Henter liste over opptatte bord-IDer for dato og tid       |
| GET    | `/reservations`                | Henter alle reservasjoner med bord- og soneinformasjon     |
| POST   | `/reservations`                | Opprett ny reservasjon med full validering                 |
| PUT    | `/reservations/:id`            | Oppdater en eksisterende reservasjon                       |
| DELETE | `/reservations/:id`            | Slett en reservasjon permanent                             |
| PATCH  | `/reservations/:id/accept`     | Endre status fra `pending` til `accepted`                  |
| PATCH  | `/reservations/:id/decline`    | Endre status til `declined`                                |

## Database

Tre tabeller med følgende relasjoner:

- `areas` (1) → (N) `tables`: En sone har mange bord
- `tables` (1) → (N) `reservations`: Et bord har mange reservasjoner

Reservasjonsstatus-flyt: `pending` → `accepted` / `declined` / `expired`

## Testing

End-to-end systemtest (POST, GET, verifiser):

```bash
node tests/test-system.js
```

Telefonvalideringstest (gyldig NO, ugyldig NO, gyldig UK):

```bash
bash tests/test_phone.sh
```

Forretningslogikk-tester (kapasitet, 24h-regel, stengetid, CRUD):

```bash
bash tests/run_cloud_tests.sh
```

## Kjente begrensninger

- Ingen autentisering på admin-panelet
- Kun første etasje innendørs er implementert
- Ingen SMS/e-postvarsling til gjester
- Noen feilmeldinger er på engelsk
- Bordposisjonering er hardkodet med CSS-prosenter
- Ingen GDPR-samtykke eller automatisk sletting av persondata

## Fremtidig utvikling

- SMS-bekreftelser til gjester
- Innlogging for admin-panelet
- Støtte for andre etasje og uteterrasser
- Integrering med kassesystem
- 360-graders visning fra bordene
- Automatisk sletting av persondata (GDPR)

## Kontakt

Szymon Piotr Daraz
szymondaraz@gmail.com
IT og ledelse, USN

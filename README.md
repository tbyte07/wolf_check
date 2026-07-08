# WolfCheck

Eine Web-App für **Christian Wolf** (Gründer von *More Nutrition*), um virale
Videos mit **Ernährungs-, Fitness- und Gesundheits-Falschaussagen** zu sichten
und für die spätere Richtigstellung zu markieren.

Diese erste Version ist der **Inbox- & Review-Flow**: alle gefundenen Videos
landen als Karten in einer Inbox, Chris öffnet ein Video, sieht das echte
Plattform-Embed und entscheidet — **Annehmen**, **Ablehnen** oder
**Zu oft verwendet**. Getroffene Entscheidungen bleiben über Filter jederzeit
einsehbar.

Design & visuelle Sprache stammen aus dem More-inspirierten
**WolfCheck-Designsystem** (Rose `#F30378`, Sky `#0287FF`, Barlow Semi
Condensed + Figtree). Kein More-Logo — eigene `wolfcheck`-Wortmarke.

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Supabase** (Postgres) als Datenquelle — serverseitig via `@supabase/supabase-js`
- **lucide-react** für Icons
- Deploy-Ziel: **Vercel**

## Datenquelle

Eine einzige Supabase-Tabelle `final_results`:

| Spalte        | Typ           | Bedeutung                                            |
| ------------- | ------------- | ---------------------------------------------------- |
| `link`        | text (unique) | Video-URL                                            |
| `plattform`   | text          | `instagram` \| `tiktok` \| `youtube`                 |
| `titel`       | text          | Titel                                                |
| `hypothese`   | text          | die konkrete Falschaussage (Hauptzeile je Karte)     |
| `views`       | integer       | Aufrufe                                              |
| `likes`       | integer       | Likes                                                |
| `status`      | text          | `open` \| `accepted` \| `declined` \| `decrease`     |
| `gefunden_am` | timestamptz   | Fundzeitpunkt                                        |

> **RLS-Hinweis:** Die App nutzt den **Anon-Key** serverseitig für `select`
> und `update`. Damit das funktioniert, müssen entweder RLS-Policies auf
> `final_results` `select`/`update` für die anon-Rolle erlauben, oder RLS ist
> deaktiviert. (Für diese erste Version ohne Login bewusst so gehalten.)

## Features (dieser Stand)

1. **Inbox** — Karten-Grid aller Zeilen im aktiven Status (Default `open`),
   sortierbar nach **Views / Likes / Neueste** (absteigend).
2. **Karte** — lazy-geladenes Thumbnail (nur Bild, kein Embed), Titel,
   Hypothese, Plattform-Badge, Views, Likes, Fundzeitpunkt.
3. **Detail-Ansicht (Modal)** — lädt **erst beim Öffnen** das passende Embed:
   - YouTube: `iframe` aus der Video-ID
   - TikTok: offizielles `embed.js`
   - Instagram: offizielles `embed.js`

   Das jeweilige Skript wird nur geladen, wenn eine Karte dieser Plattform
   geöffnet wird — nicht vorab für die ganze Seite.
4. **Aktionen** — **Annehmen** (`accepted`), **Ablehnen** (`declined`),
   **Zu oft verwendet** (`decrease`). Danach verlässt die Zeile die offene
   Inbox und die Ansicht kehrt zum Grid zurück.
5. **Status-Filter** — `open` / `accepted` / `declined` / `decrease`, damit
   frühere Entscheidungen einsehbar bleiben.
6. **Responsive** — nutzbar auf Desktop und Mobile.

### Thumbnails

- **YouTube:** direkt aus der Video-ID (`i.ytimg.com`), kein Netzwerkaufruf.
- **TikTok:** öffentlicher oEmbed-Endpunkt (serverseitig, gecached).
- **Instagram:** derzeit gestylter Platzhalter (Instagram-oEmbed braucht ein
  Meta-App-Token). Sobald ein Token vorliegt, lässt sich das ergänzen — oder
  eine `thumbnail_url`-Spalte an `final_results` hängen.

Alles läuft über die Route `GET /api/thumb?platform=…&link=…`, auf die die
Karten-`<img loading="lazy">` zeigen.

### (Noch) nicht enthalten

Login/Auth, Export, Faktencheck-Generierung und jegliche KI-Content-Erstellung
— bewusst außen vor in diesem Durchgang.

## Lokal starten

```bash
npm install
cp .env.example .env.local   # SUPABASE_URL und SUPABASE_ANON_KEY eintragen
npm run dev                  # http://localhost:3000
```

## Deploy auf Vercel

1. Dieses Repo bei **Vercel → Add New → Project** importieren.
2. Framework wird als **Next.js** erkannt — Defaults passen.
3. Unter **Settings → Environment Variables** setzen:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
4. **Deploy**.

## Umgebungsvariablen

| Variable            | Beschreibung                              |
| ------------------- | ----------------------------------------- |
| `SUPABASE_URL`      | Projekt-URL, z. B. `https://xxx.supabase.co` |
| `SUPABASE_ANON_KEY` | Anon/Public API-Key des Projekts          |

Beide werden **nur serverseitig** gelesen (kein `NEXT_PUBLIC_`-Präfix), der
Key gelangt also nie in den Browser.

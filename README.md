# Transparenzranking.de

[![Build status](https://github.com/okfde/transparenzranking.de/actions/workflows/build.yml/badge.svg)](https://github.com/okfde/transparenzranking.de/actions/workflows/build.yml)

[Transparenzranking.de](https://transparenzranking.de) vergleicht alle
Transparenzregelungen Deutschlands.

## Setup

```bash
yarn install
yarn dev # start dev server
yarn build # build for production
```

## Content

Der Inhalt der Seite wird aus den YAML- und Markdowndateien unter
[`./src/data`](./src/data) generiert.

### Kategorien und Kriterien

Die [Kategorien](./src/data/categories.yml) bestehen aus `title`, `slug` (ein
URL-freundlicher, einmaliger Identifier), `color` (einer CSS-kompatiblen Farbe,
etwa `#fff`) und einer `description`.

Zu diesen Oberkategorien können die [Rankingkriterien](./src/data/criteria.yml)
angelegt werden. Diese bestehen ebenfalls aus `title` und `description`,
beinhalten zudem auch die Eigenschaft `maxPoints` (der für dieses Kriterium
maximal erreichbaren Punktzahl). Die übergeordnete Kategorie kann mit `category`
gesetzt werden. Dabei wird der `slug` einer aus der
[Kategoriedatei](./src/data/categories.yml) angegeben.

### Länder

Jedes Land hat unter [`./src/data/states`](./src/data/states) sowohl eine
gleichnamige Markdown- und YAML-Datei (etwa `berlin.md` und `berlin.yml`). Zudem
sollte unter [`./src/assets/img/wappen`](./src/assets/img/wappen) ein Wappen im
svg-Format abgelegt werden (ebenfalls gleicher Dateiname). In der Markdowndatei
kann eine ausführliche Beschreibung zum Land formuliert werden.

Die YAML-Datei beinhaltet folgende Eigenschaften (Beispiel:
[Berlin](./src/data/states/berlin.yml)):

- `name`
- `short`: die Abkürzung des Landesnamen, etwa BE
- `year`: das Inkrafttreten des Gesetzes
- `updated`: optional wann das Gesetz das letzte Mal aktualisiert wurde
- `fdsId`: die unter [`fds.yml`](./src/data/fds.yml) angelegte ID der
  FragDenStaat-Jurisdiktion (etwa `1` für den Bund)
- `type`: ein unter [`lawtypes.yml`](./src/data/lawtypes.yml) definierter
  Gesetzestyp wie `ifg`. Gibt es kein Gesetz, wird `false` angegeben
- `criteria`: gibt es kein IFG, kann diese Eigenschaft weggelassen werden. Eine
  Liste von Kriterien, bestehend aus
  - `title`: der Kriterientitel, wie unter
    [`criteria.yml`](./src/data/criteria.yml) angegeben
  - `points`: die erreichten Punkte
  - `citation`: die zitierte Gesetzesstelle
  - `citationLink`: optional. Ein absoluter URL zum Gesetz. Standardmäßig ein
    Anker für die FragDenStaat-Gesetzesseite.
  - `limitation`: optionale Einschränkung

## Lizenz

Der Code ist [MIT-lizensiert](./LICENSE), die Inhalte (alle `.yml` und `.md`
Dateien) fallen unter [CC-BY 4.0](https://creativecommons.org/licenses/by/4.0/).

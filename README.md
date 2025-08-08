# Line Puzzle - Commerciële Web App

Een moderne, responsieve puzzelgame gebouwd met Next.js 14, React 18, TypeScript en Tailwind CSS.

## 🎮 Features

### Gameplay
- **Dynamische puzzelgeneratie** - Willekeurig gegenereerde, altijd oplosbare puzzels
- **Meerdere moeilijkheidsniveaus** - Van Easy tot Expert (80 levels totaal)
- **Grid variatie** - Van 4x4 tot 10x10 grids
- **Intuïtieve controls** - Touch en mouse support

### Obstakels & Speciale Elementen
- **Geblokkeerde vakjes** - Ontoegankelijke cellen
- **Eenrichtingsvakjes** - Alleen doorgang in één richting
- **Teleport-nummers** - Spring naar andere locaties
- **Multipliers** - Verhoog je score
- **Energie-vakjes** - Kosten energie om te passeren

### Progressie Systeem
- **Level systeem** - 80 unieke levels
- **Achievements** - 6 verschillende achievements om te ontgrendelen
- **Dagelijkse uitdagingen** - Elke dag een nieuwe uitdaging
- **Statistieken** - Bijhouden van je voortgang

### Gebruikerservaring
- **Modern design** - Glasmorphisme en gradient effecten
- **Vloeiende animaties** - Framer Motion voor smooth transitions
- **Responsief** - Werkt op alle apparaten
- **Offline speelbaar** - PWA ondersteuning
- **State persistence** - Je voortgang wordt automatisch opgeslagen

## 🚀 Installatie & Setup

1. **Navigeer naar de project folder:**
```bash
cd C:\Users\mehdi\Documents\Projects\Puzzle_Game
```

2. **Installeer dependencies:**
```bash
npm install
```

3. **Start de development server:**
```bash
npm run dev
```

4. **Open in je browser:**
```
http://localhost:3000
```

## 📦 Build voor Productie

```bash
npm run build
npm start
```

## 🎯 Game Mechaniek

### Hoe te spelen:
1. Begin bij nummer 1
2. Trek een lijn naar nummer 2, dan 3, enzovoort
3. Vermijd obstakels en gebruik speciale vakjes strategisch
4. Voltooi de puzzel in zo min mogelijk zetten voor de hoogste score

### Scoring:
- Basis score: 1000 punten
- -10 punten per zet
- Bonus sterren voor snelle voltooiing
- Multipliers verhogen je score

## 🛠️ Technologie Stack

- **Framework:** Next.js 14 (App Router)
- **UI Library:** React 18
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand met persistence
- **Animaties:** Framer Motion
- **Icons:** Lucide React

## 📱 PWA Features

De app is volledig PWA-ready:
- Installeerbaar op mobiele apparaten
- Offline speelbaar
- App-achtige ervaring

## 🎨 Customization

### Kleuren aanpassen:
Bewerk `tailwind.config.ts` voor custom kleuren

### Nieuwe obstakeltypes toevoegen:
1. Voeg type toe in `gameStore.ts`
2. Implementeer logica in `GameBoard.tsx`
3. Voeg visuele stijl toe

### Levels uitbreiden:
Pas `generateLevels()` functie aan in `gameStore.ts`

## 🔄 Toekomstige Features

- [ ] Multiplayer modus
- [ ] Seizoens-evenementen  
- [ ] Community challenges
- [ ] Internationale ranglijsten
- [ ] Meer obstakeltypes
- [ ] Sound effects & muziek
- [ ] Tutorial mode
- [ ] Hints systeem

## 📝 Monetarisatie Opties

Het project is voorbereid voor:
- Premium levels (uitbreidingspakketten)
- Advertentie integratie
- In-app aankopen voor hints
- Cosmetic upgrades

## 🐛 Bekende Issues

- Eerste keer laden kan even duren
- Touch controls kunnen soms haperig zijn op oudere apparaten

## 💡 Tips voor Development

1. **Hot Reload:** Wijzigingen worden automatisch geladen
2. **State debugging:** Check browser DevTools > Application > Local Storage
3. **Performance:** Use React DevTools Profiler voor optimalisatie

## 📄 Licentie

Dit project is gemaakt voor commercieel gebruik.

---

**Veel plezier met je Line Puzzle game! 🎮**
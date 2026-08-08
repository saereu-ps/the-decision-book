# 🔮 The Decision Book (คัมภีร์ตัดสินใจ)

A highly immersive, interactive web application inspired by the concept of "The Decision Book" (or the Magic 8 Ball). Built with HTML, CSS, and Vanilla JavaScript, this project features stunning visual effects, procedural audio, and a premium magical aesthetic.

## ✨ Features

- **Mystical Interface**: A beautiful day/night cycle UI featuring a glowing crystal ball and a fortune-telling cat.
- **"Charge Your Intent" Mechanic**: Users must click and hold to "charge" their question. The UI reacts with intense vibration, glow effects, and a rising synthesizer tone using the Web Audio API.
- **Quantum Decypher Animation**: Answers are revealed through a matrix-style scramble of Thai characters, English letters, and mystical symbols before locking into the final prediction.
- **Procedural Soundscapes**: 100% synthesized sound effects (no external audio files required) for typing, charging, and the final explosion.
- **Stardust Cursor**: A custom glowing cursor that leaves a trail of fading golden stardust across the screen.

## 🚀 How to Run Locally

Since this is a static web app, no build step is required!

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/the-decision-book.git
   ```
2. Open the directory:
   ```bash
   cd the-decision-book
   ```
3. Open `index.html` in any modern web browser.
   *(For testing audio features, a local server like Live Server in VS Code is recommended, but not strictly required).*

## 🌍 Deployment (Vercel)

This project is fully ready to be deployed to Vercel.

1. Push the code to a GitHub repository.
2. Log in to [Vercel](https://vercel.com/) and click **Add New Project**.
3. Import your GitHub repository.
4. Leave the Framework Preset as `Other` (or default).
5. Click **Deploy**. Vercel will automatically serve the static files.

## 🛠️ Technology Stack
- **HTML5**: Semantic structure.
- **CSS3**: Advanced animations (`@keyframes`), 3D transforms, glassmorphism (`backdrop-filter`), and CSS variables for theming.
- **Vanilla JavaScript**: State management, Web Audio API synthesis, particle system generation, and DOM manipulation. No external libraries were used.

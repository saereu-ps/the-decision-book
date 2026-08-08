// --- Web Audio API (Procedural Soundscapes) ---
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

function playTick() {
    if(audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800 + Math.random() * 400, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1500, audioCtx.currentTime + 0.05);
    
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
}

function playBoom() {
    if(audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.8);
    
    gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.8);
}

let chargingOsc = null;
let chargingGain = null;

function startChargeSound() {
    if(audioCtx.state === 'suspended') audioCtx.resume();
    if(chargingOsc) stopChargeSound();
    
    chargingOsc = audioCtx.createOscillator();
    chargingGain = audioCtx.createGain();
    
    chargingOsc.type = 'triangle';
    chargingOsc.frequency.setValueAtTime(50, audioCtx.currentTime);
    chargingOsc.frequency.linearRampToValueAtTime(400, audioCtx.currentTime + 2.0); // Rises over 2 seconds
    
    chargingGain.gain.setValueAtTime(0, audioCtx.currentTime);
    chargingGain.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 1.0);
    
    chargingOsc.connect(chargingGain);
    chargingGain.connect(audioCtx.destination);
    chargingOsc.start();
}

function stopChargeSound() {
    if (chargingGain && chargingOsc) {
        chargingGain.gain.cancelScheduledValues(audioCtx.currentTime);
        chargingGain.gain.setValueAtTime(chargingGain.gain.value, audioCtx.currentTime);
        chargingGain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
        chargingOsc.stop(audioCtx.currentTime + 0.1);
        chargingOsc = null;
        chargingGain = null;
    }
}

// Utility to create a consistent SVG wrapper
const getSvgIcon = (pathData) => `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        ${pathData}
    </svg>
`;

const svgCheck = getSvgIcon('<path d="M20 6L9 17l-5-5"/>');
const svgCross = getSvgIcon('<path d="M18 6L6 18M6 6l12 12"/>');
const svgStar = getSvgIcon('<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>');
const svgQuestion = getSvgIcon('<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>');
const svgLightning = getSvgIcon('<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>');
const svgClock = getSvgIcon('<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>');
const svgHeart = getSvgIcon('<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>');

// --- Background Effects ---
const particlesContainer = document.getElementById('particles');
const dynamicBg = document.getElementById('dynamicBg');

// Generate 40 magical floating particles
for (let i = 0; i < 40; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    // Randomize particle size, position, and animation timing
    const size = Math.random() * 4 + 2;
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    const duration = Math.random() * 20 + 10;
    const delay = Math.random() * 10;

    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${posX}%`;
    particle.style.top = `${posY}%`;
    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `${delay}s`;

    particlesContainer.appendChild(particle);
}

// Subtle parallax effect on mouse move
document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth - 0.5;
    const mouseY = e.clientY / window.innerHeight - 0.5;
    
    // Move the background slightly based on mouse position
    dynamicBg.style.transform = `translate(${mouseX * 20}px, ${mouseY * 20}px)`;

    // --- Magical Custom Cursor ---
    const magicCursor = document.getElementById('magicCursor');
    if (magicCursor) {
        magicCursor.style.left = `${e.clientX}px`;
        magicCursor.style.top = `${e.clientY}px`;
        
        // Spawn stardust
        if (Math.random() > 0.6) {
            const star = document.createElement('div');
            star.classList.add('stardust');
            star.style.left = `${e.clientX}px`;
            star.style.top = `${e.clientY}px`;
            star.style.width = `${Math.random() * 4 + 2}px`;
            star.style.height = star.style.width;
            document.body.appendChild(star);
            setTimeout(() => star.remove(), 800);
        }
    }
});

// 3D Holographic Tilt Effect for Desktop
const catScene = document.getElementById('catButton');
const catImg = document.getElementById('catImage');
const cardReflection = document.getElementById('cardReflection');

// --- Gyroscope Parallax for Mobile ---
window.addEventListener('deviceorientation', (e) => {
    if (!e.gamma || !e.beta) return;
    
    // gamma is left-to-right tilt (-90 to 90)
    // beta is front-to-back tilt (-180 to 180)
    let xTilt = Math.max(-30, Math.min(30, e.gamma)); 
    let yTilt = Math.max(-30, Math.min(30, e.beta - 45)); // assume resting phone angle is ~45deg
    
    // Move background opposite to tilt
    dynamicBg.style.transform = `translate(${xTilt * -1}px, ${yTilt * -1}px)`;
    
    // Tilt the cat
    catImg.style.transform = `scale(1.05) rotateX(${yTilt * -0.5}deg) rotateY(${xTilt * 0.5}deg)`;
    
    const bgPosX = 50 + (xTilt * 2);
    const bgPosY = 50 + (yTilt * 2);
    cardReflection.style.backgroundPosition = `${bgPosX}% ${bgPosY}%`;
});

catScene.addEventListener('mousemove', (e) => {
    // Get dimensions and center of the scene
    const rect = catScene.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within the element.
    const y = e.clientY - rect.top;  // y position within the element.
    
    // Calculate rotation (-15deg to 15deg)
    const xPct = (x / rect.width) - 0.5;
    const yPct = (y / rect.height) - 0.5;
    
    // Invert X/Y for natural tilt: moving mouse right tilts right edge down (rotateY positive)
    const rotateX = -yPct * 30; // max 15 deg
    const rotateY = xPct * 30;  // max 15 deg
    
    catImg.style.transform = `scale(1.05) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    
    // Shift glossy foil reflection
    const bgPosX = 50 + (xPct * 100);
    const bgPosY = 50 + (yPct * 100);
    cardReflection.style.backgroundPosition = `${bgPosX}% ${bgPosY}%`;
});

catScene.addEventListener('mouseleave', () => {
    // Reset to normal when mouse leaves
    catImg.style.transform = `scale(1) rotateX(0deg) rotateY(0deg)`;
    catImg.style.transition = `transform 0.5s ease`; // add transition for smooth snap back
    cardReflection.style.backgroundPosition = `100% 100%`;
});

catScene.addEventListener('mouseenter', () => {
    catImg.style.transition = `none`; // remove transition for instant tracking while hovering
});

const answers = [
    // --- Thai Positive ---
    "แน่นอนที่สุด",
    "เป็นไปได้สูงมาก",
    "ใช่เลยล่ะ!",
    "ไร้ข้อกังขา",
    "คุณมาถูกทางแล้ว",
    "เชื่อสัญชาตญาณของคุณเถอะ",
    "ผลลัพธ์จะออกมาดีเยี่ยม",
    "ลุยเลย รออะไรอยู่!",
    "ทุกอย่างเป็นใจให้คุณ",
    "ใช่! ทำมันเลย",
    "เวลาที่เหมาะสมคือตอนนี้",
    "ความสำเร็จรออยู่",
    "ไม่ต้องลังเล",
    "เทพเจ้าแมวอวยพรคุณ",
    "เป็นไอเดียที่ยอดเยี่ยมมาก",
    "ก้าวต่อไป อย่าหยุด",
    "การตัดสินใจที่ดีที่สุด",
    "พลังบวกมาเต็ม",
    
    // --- Thai Negative ---
    "อย่าเพิ่งเลยดีกว่า",
    "ยังไม่ใช่ตอนนี้",
    "โอกาสสำเร็จน้อยมาก",
    "พักก่อนเถอะนะ",
    "ลองคิดทบทวนดูอีกที",
    "แมวส่ายหัวให้สิ่งนี้",
    "หยุดความคิดนั้นซะ",
    "มีอุปสรรคใหญ่รออยู่",
    "ยังไม่พร้อมหรอก",
    "เสี่ยงเกินไป",
    "ผลลัพธ์อาจไม่เป็นอย่างที่คิด",
    "เปลี่ยนแผนเถอะ",
    "ใจเย็นๆ แล้วถอยมาก้าวหนึ่ง",
    "วันนี้ยังไม่ใช่วันของคุณ",
    
    // --- Thai Ambiguous / Action ---
    "ลองถามใจตัวเองดูอีกครั้ง",
    "คำตอบอยู่ในใจคุณแล้ว",
    "รออีกนิดดีกว่า",
    "ต้องใช้เวลามากกว่านี้",
    "โฟกัสที่ปัจจุบันก่อน",
    "ลองปรึกษาคนใกล้ตัวดู",
    "อนาคตไม่แน่นอน",
    "ขึ้นอยู่กับการกระทำของคุณ",
    "ความอดทนคือสิ่งที่จำเป็น",
    "ตั้งสติก่อนตัดสินใจ",
    "ลองมองในมุมกลับดูบ้าง",
    "ต้องการข้อมูลเพิ่มเติม",
    "คำตอบยังไม่ชัดเจนในตอนนี้",
    
    // --- English Positive ---
    "Absolutely.",
    "Without a doubt.",
    "Yes, definitely.",
    "Most likely.",
    "Outlook good.",
    "Signs point to yes.",
    "Go for it!",
    "Trust yourself.",
    "This is your moment.",
    "Do it now.",
    "Unquestionably.",
    "Green light!",
    
    // --- English Negative ---
    "Don't count on it.",
    "My reply is no.",
    "Outlook not so good.",
    "Very doubtful.",
    "Not the right time.",
    "Reconsider your options.",
    "Better not.",
    "Hard no.",
    "Try a different approach.",
    "Too risky.",
    
    // --- English Ambiguous / Action ---
    "Ask again later.",
    "Cannot predict now.",
    "Concentrate and ask again.",
    "Focus on what you can control.",
    "The future is unwritten.",
    "Follow your heart.",
    "More information needed.",
    "Embrace the uncertainty.",
    
    // --- Line Art Symbols (replaces Emojis) ---
    `${svgCheck} <div>ไปได้สวย</div>`,
    `${svgCross} <div>อย่าเสี่ยงดีกว่า</div>`,
    `${svgStar} <div>ผลลัพธ์ระดับ 5 ดาว</div>`,
    `${svgQuestion} <div>สถานการณ์ยังคลุมเครือ</div>`,
    `${svgLightning} <div>ลงมือทำทันที</div>`,
    `${svgClock} <div>อดทนรออีกสักนิด</div>`,
    `${svgHeart} <div>ทำตามเสียงหัวใจ</div>`
];

document.addEventListener('DOMContentLoaded', () => {
    const catButton = document.getElementById('catButton');
    const questionInput = document.getElementById('questionInput');
    const answerOverlay = document.getElementById('answerOverlay');
    const closeBtn = document.getElementById('closeBtn');
    const askAgainBtn = document.getElementById('askAgainBtn');
    
    const flashBang = document.getElementById('flashBang');
    const magicExplosion = document.getElementById('magicExplosion');
    const crystalGlow = document.getElementById('crystalGlow');
    const questionInputObj = document.getElementById('questionInput');
    const questionDisplay = document.getElementById('questionDisplay');
    const answerText = document.getElementById('answerText');
    const themeSwitch = document.getElementById('themeSwitch');
    
    // Magic Typewriter Effect
    let typingTimer;
    questionInputObj.addEventListener('keyup', (e) => {
        if (e.key !== 'Enter') playTick(); // Play ticking sound
        crystalGlow.classList.add('magic-typewriter');
        clearTimeout(typingTimer);
        typingTimer = setTimeout(() => {
            crystalGlow.classList.remove('magic-typewriter');
        }, 150);
    });

    let isAnimating = false;

    // Theme Toggle Logic
    const catImage = document.getElementById('catImage');
    themeSwitch.addEventListener('change', (e) => {
        if (e.target.checked) {
            document.body.classList.add('theme-day');
            catImage.src = 'fortune_cat_day.png';
        } else {
            document.body.classList.remove('theme-day');
            catImage.src = 'fortune_cat.png';
        }
    });

    // --- Quantum Decypher Effect ---
    const thaiChars = 'กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮ';
    const engChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const symbols = '!@#$%^&*✧✦⚝🔮✨';
    const allScrambleChars = thaiChars + engChars + symbols;

    function startDecypherEffect(element, finalString, duration) {
        let iterations = 0;
        const maxIterations = duration / 30; // 30ms per frame
        
        const interval = setInterval(() => {
            element.innerText = finalString.split('').map((letter, index) => {
                if(letter === ' ') return ' ';
                // Characters lock in from left to right gradually
                if(index < (iterations / maxIterations) * finalString.length) {
                    return finalString[index];
                }
                return allScrambleChars[Math.floor(Math.random() * allScrambleChars.length)];
            }).join('');
            
            if(iterations >= maxIterations) {
                clearInterval(interval);
                element.textContent = finalString;
            }
            iterations++;
        }, 30);
    }

    let chargeTimer = null;
    let isCharging = false;
    let chargeStartTime = 0;

    function startCharging() {
        if (isAnimating) return;
        isCharging = true;
        chargeStartTime = Date.now();
        catScene.classList.add('charging');
        startChargeSound();
        if (navigator.vibrate) {
            // Pulse vibration to simulate charging
            navigator.vibrate([50, 150, 50, 150, 100, 100, 100, 100, 200, 50, 200]);
        }
    }

    function stopCharging(triggerOracle) {
        if (!isCharging) return;
        isCharging = false;
        catScene.classList.remove('charging');
        stopChargeSound();
        if (navigator.vibrate) navigator.vibrate(0); // Stop charging vibration

        const chargeDuration = Date.now() - chargeStartTime;
        
        // If held for less than 500ms, fizzle out (do nothing, let them try again)
        // If held for >500ms and triggerOracle is true, BOOM!
        if (triggerOracle && chargeDuration > 500) {
            executeOracleReveal();
        }
    }

    catScene.addEventListener('mousedown', startCharging);
    catScene.addEventListener('touchstart', (e) => { e.preventDefault(); startCharging(); }, {passive: false});

    catScene.addEventListener('mouseup', () => stopCharging(true));
    catScene.addEventListener('touchend', () => stopCharging(true));

    catScene.addEventListener('mouseleave', () => stopCharging(false));
    catScene.addEventListener('touchcancel', () => stopCharging(false));

    function executeOracleReveal() {
        if (isAnimating) return;
        isAnimating = true;
        catScene.classList.add('animating');
        
        playBoom();
        if (navigator.vibrate) navigator.vibrate([200, 50, 300]); // Heavy boom vibration

        const question = questionInput.value.trim();
        const finalQuestion = question === "" ? "สิ่งที่คุณกำลังคิดอยู่..." : `"${question}"`;

        const randomAnswerObj = answers[Math.floor(Math.random() * answers.length)];
        
        // --- Secret Easter Eggs ---
        let finalAnswerToReveal = randomAnswerObj;
        const qLower = question.toLowerCase();
        
        if (qLower.includes("หิว") || qLower.includes("กินอะไรดี") || qLower.includes("กินไรดี")) {
            finalAnswerToReveal = "แมวแนะนำให้ไปหาปลาทูทอดกินนะ เมี๊ยว~";
        } else if (qLower.includes("ถูกหวย") || qLower.includes("รวยไหม") || qLower.includes("รางวัลที่ 1")) {
            finalAnswerToReveal = "เตรียมตัวเป็นเศรษฐีได้เลย! (แต่ต้องซื้อให้ถูกเลขนะ)";
        } else if (qLower.includes("แฟน") || qLower.includes("ความรัก") || qLower.includes("เนื้อคู่") || qLower.includes("คนคุย")) {
            finalAnswerToReveal = "ความรักอยู่รอบตัวคุณ รออีกนิดเดี๋ยวก็มา 💖";
        } else if (qLower.includes("the matrix")) {
            finalAnswerToReveal = "Wake up... The Matrix has you.";
        } else if (qLower === "") {
            finalAnswerToReveal = "คุณไม่ได้ถามอะไรเลย... แต่คำตอบคือ 'ลุยเลย!'";
        } else if (qLower.includes("เหนื่อย") || qLower.includes("ท้อ")) {
            finalAnswerToReveal = "พักผ่อนเถอะนะ พรุ่งนี้ค่อยเริ่มใหม่ เป็นกำลังใจให้";
        } else if (qLower.includes("สอบ") || qLower.includes("เกรด")) {
            finalAnswerToReveal = "อ่านหนังสือเพิ่มอีกนิด ผ่านฉลุยแน่นอน!";
        }

        // Dramatic Reveal Sequence
        flashBang.classList.remove('hidden');
        flashBang.classList.add('active');
        magicExplosion.classList.remove('hidden');
        magicExplosion.classList.add('burst');

        setTimeout(() => {
            // Fade out blackout
            flashBang.classList.remove('active');
            setTimeout(() => flashBang.classList.add('hidden'), 300);
            // Cleanup explosion
            magicExplosion.classList.remove('burst');
            magicExplosion.classList.add('hidden');

            // Show answer overlay
            questionDisplay.textContent = finalQuestion;
            answerText.innerHTML = "";
            answerOverlay.classList.remove('hidden');
            
            // Start the Decypher scramble effect (lasts 2 seconds)
            startDecypherEffect(answerText, finalAnswerToReveal, 2000);
            
            // Stop cat animation
            catScene.classList.remove('animating');
            isAnimating = false;
        }, 600); // Wait for explosion peak
    }

    // Event Listeners for overlay
    closeBtn.addEventListener('click', () => {
        answerOverlay.classList.add('hidden');
    });

    askAgainBtn.addEventListener('click', () => {
        answerOverlay.classList.add('hidden');
        questionInput.value = '';
        questionInput.focus();
    });

    // Enter key support
    questionInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            executeOracleReveal();
            questionInput.blur();
        }
    });
});

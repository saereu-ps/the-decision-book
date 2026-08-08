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
    // --- Strong YES (เอาเลย!) ---
    "แน่นอนที่สุด ทำเลย!",
    "เป็นไปได้สูงมาก ลุย!",
    "ใช่เลยล่ะ ไม่มีอะไรต้องลังเล",
    "ไร้ข้อกังขา ดำเนินการทันที",
    "ผลลัพธ์จะออกมาดีเยี่ยมแน่นอน",
    "ลุยเลย รออะไรอยู่!",
    "ทุกอย่างเป็นใจให้คุณ",
    "คำตอบคือ 'ใช่!' 100%",
    "เวลาที่เหมาะสมที่สุดคือตอนนี้",
    "ความสำเร็จรออยู่ตรงหน้า",
    "เทพเจ้าแมวขอฟันธงว่า 'เอาเลย!'",
    "เป็นไอเดียที่ยอดเยี่ยมที่สุด",
    "ก้าวต่อไป อย่าหยุด",
    "การตัดสินใจที่ดีที่สุดในชีวิต",
    "พลังบวกมาเต็ม ลุยให้สุด!",
    "ไฟเขียวผ่านฉลุย!",
    "ไม่มีทางพลาดแน่นอน",
    "โอกาสแบบนี้ไม่ได้มีบ่อยๆ คว้าไว้!",
    "ชนะใสๆ ไม่ต้องสืบ",
    "เชื่อมั่นในตัวเอง แล้วทำเลย!",
    "ฟ้าเปิดแล้ว ลุยยย!",
    "อย่ามัวแต่คิด ลงมือเลย",
    "โชคชะตาบอกว่า 'ใช่' แน่นอน",
    
    // --- Funny / Trolling YES (กวนๆ แต่ให้ทำ) ---
    "ถามมาได้... ก็ต้องทำสิ!",
    "ถ้าไม่ทำตอนนี้ จะไปทำตอนไหนฮะ?",
    "เอาเลย! พังค่อยว่ากันใหม่",
    "ทำเถอะ ถือว่าแมวขอ",
    "ไม่ต้องพึ่งไสยศาสตร์หรอก ลุยเลย!",
    "จัดไปวัยรุ่น! รอดูความยิ่งใหญ่",
    "ใจสู้รึเปล่า? ไหวไหมบอกมา... ลุย!",
    "ถ้ากลัวก็กลับไปนอนซะ แต่ถ้าแน่ก็ลุย!",
    "เจ็บแค่มดกัด... ลุยดิ!",
    "ทำไปเถอะ ถึงแย่ก็ถือเป็นคอนเทนต์",
    "รวยเละเทะแน่นอน (มั้งนะ) เอาเลย!",
    "จดๆ จ้องๆ อยู่นั่นแหละ กดสูตรติดแล้ว ลุย!",
    
    // --- Strong NO (หยุด!) ---
    "อย่าทำเด็ดขาด!",
    "หยุดความคิดนั้นซะ ตอนนี้เลย",
    "โอกาสพังพินาศสูงมาก",
    "ไม่มีทางเป็นไปได้",
    "ถอยออกมาเดี๋ยวนี้!",
    "แมวส่ายหัวรัวๆ คำตอบคือ 'ไม่!'",
    "หายนะกำลังรออยู่ เลิกคิดซะ",
    "มีอุปสรรคใหญ่รออยู่ อย่าเสี่ยง",
    "ยังไม่พร้อมหรอก พับโปรเจกต์ไปก่อน",
    "เสี่ยงเกินไป ไม่คุ้มค่าเหนื่อย",
    "ผลลัพธ์จะเลวร้ายกว่าที่คิด",
    "เปลี่ยนแผนเถอะ เชื่อข้า",
    "ทางตัน อย่าดันทุรัง",
    "วันนี้และวันหน้า ก็ยังไม่ใช่วันของคุณในเรื่องนี้",
    "พังแน่นอน ห้ามทำ!",
    "ล้มเลิกซะเถอะ ไม่รอดหรอก",
    "แค่คิดก็ผิดแล้ว",
    "เสียเวลาเปล่าๆ อย่าทำเลย",
    "โอกาสรอดริบหรี่มาก",
    "คำตอบคือ 'ไม่!' แบบไร้เยื่อใย",
    "ดับอนาถแน่นอน หยุดเถอะ",
    "บอกเลยว่า พัง พัง พัง!",
    
    // --- Funny / Trolling NO (กวนๆ และห้ามทำ) ---
    "สภาพ... อย่าหาทำเลยดีกว่า",
    "ถามจริง? ไปเอาความมั่นใจมาจากไหนก่อน",
    "เดี๋ยวก็หาทำพาซวยหรอก หยุด!",
    "ทำแล้วระวังจะต้องมาร้องไห้ทีหลังนะ",
    "ถ้าทำนี่เตรียมตัวเขียนคำขอโทษได้เลย",
    "หนีไปปปปปปปป!",
    "เอาปากกามาวงเลยว่า 'บ้ง' แน่นอน",
    "ทำไปก็เหนื่อยฟรี ไปนอนเถอะ",
    "บุญบารมีที่มี ไม่น่าจะพอนะ ยกเลิกเถอะ",
    "อย่าดันทุรังเลย แมวสงสาร",
    "เตือนแล้วนะ ถ้าดื้อก็เตรียมตัวบรรลัย",
    "ถ้าทำนี่คือซื้อตั๋ว VIP สู่ความชิบหายเลยนะ",
    
    // --- MASSIVE EXPANSION: Ultra Trolling YES ---
    "แมวคอนเฟิร์ม! ลุยโลดดดด",
    "ถ้าเรื่องแค่นี้ยังไม่กล้า ก็ไปนอนซะ ไปทำเลย!",
    "ไม่ต้องคิดแล้ว ลุยมันเดี๋ยวนี้แหละ",
    "กดปุ่มสตาร์ทเดี๋ยวนี้!",
    "ถ้าไม่ทำวันนี้ พรุ่งนี้ก็ขี้เกียจอยู่ดี ทำเลย!",
    "ถ้าใจบอกว่าใช่ แล้วจะรอให้ใครมาตัดริบบิ้น?",
    "หมอ(แมว)ดูแล้ว ดวงกำลังขึ้น ทำเลย!",
    "ลุยเลยลูกพี่ แมวซัพพอร์ตเสมอ!",
    "เจ็บก็แค่ร้องไห้ แต่ถ้าไม่ทำจะเสียดายนะ ลุย!",
    "พุ่งชนเลยลูกพี่!",
    "ทำเลย! อย่าลืมซื้อขนมแมวเลียมาถวายด้วยล่ะ",
    "สู้เขาสิวะอีหญิง/อีชาย! ลุย!",
    "ปังปุริเย่แน่นอน จัดไป!",
    "เชื่อพี่ พี่เรียนมา... ลุยเลย!",
    "ไม่ต้องห่วงเรื่องเวรกรรม ลุยก่อนค่อยไปแก้กรรมทีหลัง",
    "ดวงคุณกำลังมา รีบคว้าไว้เลย!",
    "ลุยให้สุด แล้วไปหยุดที่ความรวย!",
    "ไฟเขียวสว่างจ้าขนาดนี้ ไม่ทำก็บ้าแล้ว",
    "จัดไปชุดใหญ่ไฟกระพริบ!",
    "คุณคือผู้ถูกเลือก ลงมือทำเลย!",
    
    // --- MASSIVE EXPANSION: Ultra Trolling NO ---
    "แมวขอร้องล่ะ อย่าเลย",
    "พักก่อนมั้ย? หน้าตาเธอดูล้าๆ นะ",
    "อันตรายระดับ 10 ริกเตอร์ หนีไป!",
    "ถ้าอยากพังพินาศก็ทำเลย แต่แมวเตือนแล้วนะ",
    "เก็บแรงไว้ทำอย่างอื่นเถอะ",
    "อย่าหาทำ! แมวเหนื่อยจะเตือน",
    "ความคิดแบบนี้ เอาไปโยนทิ้งทะเลเถอะ",
    "กลับไปล้างหน้า สวดมนต์ แล้วนอนซะ",
    "ทำแล้วเตรียมตัวไปรดน้ำมนต์ 9 วัดได้เลย",
    "ชิบหายของแท้ ห้ามทำ!",
    "กราบล่ะ เลิกคิดเรื่องนี้เถอะ",
    "ถ้าดื้อทำ ระวังจะไม่มีแม้แต่เศษอาหารประทังชีวิต",
    "เอาความมั่นใจแบบผิดๆ นี้มาจากไหน หยู๊ดดดด!",
    "พังกว่านี้ก็คือซากปรักหักพังแล้วลูกเอ๊ย",
    "พักก่อนน๊าาาา ไหว้ล่ะ",
    "ถ้าทำลงไป ก็เตรียมตัวขึ้นเขียงได้เลย",
    "หยุดเถอะ ถือว่าทำบุญทำทานให้ตัวเอง",
    "ดวงตกสุดๆ ช่วงนี้ หลบไปก่อนดีกว่า",
    "แมวเห็นอนาคตแล้ว... เละเทะ! อย่าทำ",
    "ใครแนะนำมา? เลิกคบไปเลยนะ ไม่รอดแน่",

    
    // --- Strong English ---
    "Absolutely. Do it!",
    "Without a doubt, YES.",
    "Go for it right now!",
    "Green light, full speed ahead!",
    "Hell YES!",
    "Make it happen.",
    "My reply is a hard NO.",
    "Stop. Don't do it.",
    "Too risky. Abort mission.",
    "Never in a million years.",
    "Nope. Just nope.",
    "Big mistake. Don't.",
    
    // --- Decisive Line Art Symbols ---
    `${svgCheck} <div>ไปได้สวย ลุยเลย!</div>`,
    `${svgCheck} <div>ถูกต้องที่สุด!</div>`,
    `${svgCheck} <div>จัดไปอย่าให้เสีย!</div>`,
    `${svgCross} <div>อย่าเสี่ยงเด็ดขาด!</div>`,
    `${svgCross} <div>หยุดดันทุรัง!</div>`,
    `${svgCross} <div>พังแน่นอน!</div>`,
    `${svgLightning} <div>ลงมือทำทันที!</div>`
];

document.addEventListener('DOMContentLoaded', () => {
    // --- iOS 13+ Gyroscope Permission ---
    // Apple requires permission to be granted via a direct 'click' or 'touchend' event.
    let hasRequestedGyro = false;
    const initGyro = () => {
        if (!hasRequestedGyro && typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
            DeviceOrientationEvent.requestPermission().catch(console.error);
            hasRequestedGyro = true;
        }
        document.removeEventListener('click', initGyro);
        document.removeEventListener('touchend', initGyro);
    };
    document.addEventListener('click', initGyro);
    document.addEventListener('touchend', initGyro);

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
    let recentAnswers = []; // Keep track of recent answers to prevent repeats
    let askCount = 0; // Cat Mood tracker

    // --- Cat Mood Responses ---
    const annoyedResponses = [
        "ถามอะไรนักหนา ไปนอนได้แล้ว!",
        "พลังเวทย์หมดแล้วย่ะ ชิ่วๆ",
        "คุณว่าแมวไม่เหนื่อยเหรอ? แมวก็เหนื่อยนะ!",
        "หยุดถามได้แล้ว แมวจะไปเลียเนื้อแล้ว",
        "อีกแล้วเหรอ? คุณไม่เบื่อเลยหรือไง?",
        "แมวเริ่มหงุดหงิดแล้วนะ... หยุดได้แล้ว",
        "ถามเยอะจริงๆ ตั้งแต่ครั้งแรกก็ตอบไปแล้วนะ!",
        "คำตอบก็เหมือนเดิมนั่นแหละ จะถามทำไม!",
    ];
    const refuseResponses = [
        "แมวปิดร้านแล้ว! พอกันก่อนนะ",
        "เมี๊ยวววววว! (แมวเดินออกจากห้องแล้ว)",
        "ไม่ตอบ! แมวหมดแรงแล้ว ไว้พรุ่งนี้ค่อยมาใหม่นะ",
        "...เงียบ",
        "แมวนอนไปแล้ว ช่วงนี้ติดต่อไม่ได้นะเมียว",
        "zZzZzZz... (แกล้งหลับ)",
    ];

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
        askCount++;
        catScene.classList.add('animating');
        
        playBoom();
        if (navigator.vibrate) navigator.vibrate([200, 50, 300]); // Heavy boom vibration

        const question = questionInput.value.trim();
        const finalQuestion = question === "" ? "สิ่งที่คุณกำลังคิดอยู่..." : `"${question}"`;

        let randomAnswerObj;
        do {
            randomAnswerObj = answers[Math.floor(Math.random() * answers.length)];
        } while (recentAnswers.includes(randomAnswerObj));
        
        recentAnswers.push(randomAnswerObj);
        if (recentAnswers.length > 15) {
            recentAnswers.shift();
        }
        
        // --- Cat Mood System ---
        let finalAnswerToReveal = randomAnswerObj;
        
        if (askCount >= 10) {
            // Cat REFUSES to answer
            finalAnswerToReveal = refuseResponses[Math.floor(Math.random() * refuseResponses.length)];
        } else if (askCount >= 5) {
            // Cat is ANNOYED (50% chance to override)
            if (Math.random() > 0.5) {
                finalAnswerToReveal = annoyedResponses[Math.floor(Math.random() * annoyedResponses.length)];
            }
        }

        // --- Secret Easter Eggs (only if cat is not in mood override) ---
        if (askCount < 10) {
            const qLower = question.toLowerCase();
            if (qLower.includes("หิว") || qLower.includes("กินอะไรดี") || qLower.includes("กินไรดี")) {
                finalAnswerToReveal = "แมวแนะนำให้ไปหาปลาทูทอดกินนะ เมี๊ยว~";
            } else if (qLower.includes("ถูกหวย") || qLower.includes("รวยไหม") || qLower.includes("รางวัลที่ 1")) {
                finalAnswerToReveal = "เตรียมตัวเป็นเศรษฐีได้เลย! (แต่ต้องซื้อให้ถูกเลขนะ)";
            } else if (qLower.includes("แฟน") || qLower.includes("ความรัก") || qLower.includes("เนื้อคู่") || qLower.includes("คนคุย")) {
                finalAnswerToReveal = "ความรักอยู่รอบตัวคุณ รออีกนิดเดี๋ยวก็มา";
            } else if (qLower.includes("the matrix")) {
                finalAnswerToReveal = "Wake up... The Matrix has you.";
            } else if (qLower.includes("เหนื่อย") || qLower.includes("ท้อ")) {
                finalAnswerToReveal = "พักผ่อนเถอะนะ พรุ่งนี้ค่อยเริ่มใหม่ เป็นกำลังใจให้";
            } else if (qLower.includes("สอบ") || qLower.includes("เกรด")) {
                finalAnswerToReveal = "อ่านหนังสือเพิ่มอีกนิด ผ่านฉลุยแน่นอน!";
            }
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

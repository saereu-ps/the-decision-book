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

function playSwitchSound(isTurningOn) {
    if(audioCtx.state === 'suspended') audioCtx.resume();
    
    // Play a cat collar bell sound
    const freqs = isTurningOn ? [1200, 1550, 2100] : [1000, 1300, 1800];
    
    freqs.forEach(freq => {
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
        
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
    });
}

let ambientStarted = false;
let ambientMasterGain = null;
let magicHumOsc = null;
let sparkleTimeout = null;

function startAmbientDrone() {
    if(ambientStarted) return;
    if(audioCtx.state === 'suspended') audioCtx.resume();
    
    ambientStarted = true;
    
    ambientMasterGain = audioCtx.createGain();
    ambientMasterGain.gain.value = 0.2; // Soft volume
    ambientMasterGain.connect(audioCtx.destination);
    
    // Mystical Hum
    magicHumOsc = audioCtx.createOscillator();
    magicHumOsc.type = 'sine';
    magicHumOsc.frequency.value = 174; // Magical mystical frequency
    
    const humGain = audioCtx.createGain();
    humGain.gain.value = 0.05; // Very quiet base hum
    
    // Slow breathing modulation for the hum
    const humLfo = audioCtx.createOscillator();
    humLfo.type = 'sine';
    humLfo.frequency.value = 0.1; // 10s cycle
    const humLfoGain = audioCtx.createGain();
    humLfoGain.gain.value = 0.03;
    humLfo.connect(humLfoGain);
    humLfoGain.connect(humGain.gain);
    
    magicHumOsc.connect(humGain);
    humGain.connect(ambientMasterGain);
    magicHumOsc.start();
    humLfo.start();
    
    // Random Magical Sparkles (A major pentatonic)
    const scale = [440, 493.88, 554.37, 659.25, 739.99, 880];
    
function playSparkle() {
        if(!ambientStarted) return;
        
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.type = 'sine';
        
        // Pick a random note, 2 octaves up
        const freq = scale[Math.floor(Math.random() * scale.length)] * 2;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        
        // Soft attack, long bell-like decay
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.06, audioCtx.currentTime + 0.5);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 3);
        
        osc.connect(gainNode);
        gainNode.connect(ambientMasterGain);
        
        osc.start();
        osc.stop(audioCtx.currentTime + 3);
        
        // Schedule next random sparkle (between 0.5 and 2 seconds)
        sparkleTimeout = setTimeout(playSparkle, Math.random() * 1500 + 500);
    }
    
    playSparkle(); // Start the sparkle loop
}

document.addEventListener('click', () => {
    startAmbientDrone();
    
    // Unlock Web Speech API for iOS Safari
    if ('speechSynthesis' in window) {
        const unlockUtterance = new SpeechSynthesisUtterance('');
        unlockUtterance.volume = 0; // Silent
        window.speechSynthesis.speak(unlockUtterance);
    }
}, { once: true });

// Pre-load voices for Safari/Chrome
if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
    };
}

function speakAnswer(text) {
    if (!('speechSynthesis' in window)) return;
    
    // Stop any currently playing speech
    window.speechSynthesis.cancel();
    
    const cleanText = text.replace(/<[^>]*>?/gm, '').trim();
    if (!cleanText) return;
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'th-TH'; // Thai language
    
    const voices = window.speechSynthesis.getVoices();
    const thaiVoices = voices.filter(v => v.lang.includes('th') || v.lang === 'th-TH');
    
    if (thaiVoices.length > 0) {
        // Try to pick the default Thai voice available
        utterance.voice = thaiVoices[0];
    }
    
    const isRudeMode = document.getElementById('rudeSwitch') ? document.getElementById('rudeSwitch').checked : false;
    
    // Drop the pitch significantly to simulate a male/deep voice if the OS default is female
    utterance.pitch = isRudeMode ? 0.3 : 0.5; 
    utterance.rate = 1.0; 
    
    window.speechSynthesis.speak(utterance);
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

function playHeartbeat() {
    if(audioCtx.state === 'suspended') audioCtx.resume();
    const time = audioCtx.currentTime;

    function createThump(startTime) {
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(100, startTime);
        osc.frequency.exponentialRampToValueAtTime(0.01, startTime + 0.3);
        
        gainNode.gain.setValueAtTime(1.0, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);
        
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.3);
    }

    createThump(time);
    createThump(time + 0.2); // Second thump 200ms later
}

let chargingOsc = null;
let chargingGain = null;
let purrOsc = null;
let purrGain = null;
let purrLfo = null;
let purrLfoGain = null;

function startChargeSound() {
    if(audioCtx.state === 'suspended') audioCtx.resume();
    if(chargingOsc) stopChargeSound();
    
    // --- Synthesizer rising tone ---
    chargingOsc = audioCtx.createOscillator();
    chargingGain = audioCtx.createGain();
    
    chargingOsc.type = 'triangle';
    chargingOsc.frequency.setValueAtTime(50, audioCtx.currentTime);
    chargingOsc.frequency.linearRampToValueAtTime(400, audioCtx.currentTime + 2.0);
    
    chargingGain.gain.setValueAtTime(0, audioCtx.currentTime);
    chargingGain.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 1.0);
    
    chargingOsc.connect(chargingGain);
    chargingGain.connect(audioCtx.destination);
    chargingOsc.start();

    // --- Cat Purr Effect ---
    purrOsc = audioCtx.createOscillator();
    purrOsc.type = 'sawtooth';
    purrOsc.frequency.setValueAtTime(25, audioCtx.currentTime); // Low rumble

    purrGain = audioCtx.createGain();
    purrGain.gain.setValueAtTime(0, audioCtx.currentTime);
    purrGain.gain.linearRampToValueAtTime(0.8, audioCtx.currentTime + 0.5); // Fade in purr

    // LFO for the purr "motor" effect (Amplitude modulation)
    purrLfo = audioCtx.createOscillator();
    purrLfo.type = 'sine';
    purrLfo.frequency.setValueAtTime(15, audioCtx.currentTime); // Purr speed (15Hz)

    purrLfoGain = audioCtx.createGain();
    purrLfoGain.gain.setValueAtTime(0.5, audioCtx.currentTime); // Modulation depth

    // Connect LFO to main gain
    purrLfo.connect(purrLfoGain);
    purrLfoGain.connect(purrGain.gain);

    // Filter to make it sound muffled/bassy like a purr
    const purrFilter = audioCtx.createBiquadFilter();
    purrFilter.type = 'lowpass';
    purrFilter.frequency.setValueAtTime(200, audioCtx.currentTime);

    purrOsc.connect(purrGain);
    purrGain.connect(purrFilter);
    purrFilter.connect(audioCtx.destination);

    purrOsc.start();
    purrLfo.start();
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

    if (purrGain && purrOsc) {
        purrGain.gain.cancelScheduledValues(audioCtx.currentTime);
        purrGain.gain.setValueAtTime(purrGain.gain.value, audioCtx.currentTime);
        purrGain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.2); // Fade out purr
        purrOsc.stop(audioCtx.currentTime + 0.2);
        purrLfo.stop(audioCtx.currentTime + 0.2);
        purrOsc = null;
        purrLfo = null;
        purrGain = null;
        purrLfoGain = null;
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

const rudeAnswers = [
    // Extremely rude / sarcastic / passive aggressive responses (SFW but harsh)
    "ถามโง่ๆ... หุบปากแล้วไปทำซะ",
    "เรื่องของมึง กูไม่เกี่ยว",
    "สมองมีก็หัดคิดเองบ้างนะ",
    "ปัญญาอ่อน... จะเอาอะไรกับแมววะ",
    "ไปถามหมานู่น กูขี้เกียจตอบ",
    "ไม่ต้องทำหรอก ทำไปก็เจ๊ง",
    "เพ้อเจ้อ! ตื่นเถอะมึง",
    "มั่นหน้าเนาะ... เอาที่มึงสบายใจ",
    "ถามเพื่อ? สุดท้ายมึงก็ทำตามใจตัวเองอยู่ดี",
    "สาระแนจริง เรื่องแค่นี้คิดเองไม่ได้รึไง",
    "ชีวิตมึงพังแน่ ทำใจไว้เลย",
    "รอให้หิมะตกในไทยก่อน ค่อยทำ",
    "ไปตายซะ (หยอกๆ แต่ทำไปก็เจ๊งจริงๆ)",
    "ประสาทแดก... กูรำคาญ",
    "หัดพึ่งตัวเองบ้าง อย่ามารบกวนเวลาพักผ่อน",
    "ความหวังเป็นศูนย์ ตัดใจเถอะ",
    "มึงคิดว่ากูแคร์เหรอ? เหมียว!",
    "ไร้สาระ! เอาเวลาไปนอนดีกว่า",
    "ฝันไปเถอะ! ชาติหน้าตอนบ่ายๆ",
    "ถ้าตอบว่า 'ดี' มึงจะเชื่อมั้ยล่ะ? โง่จริง",
    "อย่าให้กูต้องด่า ไปทำอย่างอื่นไป",
    "ทำไมมึงโง่จังวะ เรื่องแค่นี้ต้องถาม",
    "นี่มึงจริงจังปะเนี่ย? ปัญญาอ่อนสุดๆ",
    "เรื่องของมึง ชีวิตมึง มึงเลือกเอง",
    "ก็ลองดูดิ... เตรียมผ้าเช็ดหน้าไว้ด้วยนะ",
    // Expanded Extreme/Spicy Responses (User Requested)
    "โง่ดักดานแบบนี้ ไปนอนร้องไห้ใต้เตียงไป๊",
    "น้ำหน้าอย่างมึงอ่ะนะ? ถุย!",
    "กูเห็นอนาคตมึงละ... มืดมนชิบหาย",
    "เห่าหาพ่อมึงเหรอ ไปทำมาหากินไป",
    "อย่าเสือกเรื่องที่มึงไม่ควรยุ่ง โง่แล้วยังอวดฉลาด",
    "สภาพ! ดูสารรูปตัวเองก่อนค่อยมาถาม",
    "รำคาญโว้ย! ถามหาสวรรค์วิมานอะไร",
    "ถ้าสมองมึงมีรอยหยักเท่าเม็ดถั่ว กูจะดีใจมาก",
    "ไปมุดหัวอยู่ในส้วมไป๊ อย่ามาให้กูเห็นหน้า",
    "มึงมันตัวซวย หยิบจับอะไรก็พังพินาศหมดแหละ",
    "ถามซ้ำๆ อยู่นั่นแหละ พ่อมึงตายรึไง",
    "คำตอบคือ 'เสือก' เข้าใจมั้ยไอ้ควาย",
    "ตอแหล! มึงรู้อยู่แก่ใจยังจะมาถามกูอีก",
    "อยากได้คำตอบดีๆ? ไปหาแมวตัวอื่นไป ไอ้เวร",
    "กูสมเพชมึงว่ะ จริงๆ นะ",
    "ทำห่าอะไรก็ไม่เจริญหรอก สันดานแบบนี้",
    "อย่ามาทำตัวเรียกร้องความสนใจ น่ารังเกียจ",
    "ไปกินขี้ซะ เผื่อสมองจะแล่นขึ้นมาบ้าง",
    "หน้าม้าน! โดนหลอกซ้ำซากก็ยังไม่จำ",
    "สันดานเสียยังไงก็แก้ไม่หายเนาะ",
    "รกโลกว่ะมึงอ่ะ หายใจทิ้งไปวันๆ",
    "อย่ามาบีบน้ำตาแถวนี้ กูจะอ้วก",
    "ปอดแหก! แค่นี้ก็ต้องมาพึ่งกู ขยะเอ๊ย",
    // -------------------------------------------------------------------------
    // V3: Ultra Toxic / Aggressive / Insulting Responses (User Explicitly Requested)
    // -------------------------------------------------------------------------
    "เหยียบขี้ไก่ไม่ฝ่อ สันดานกระจอกแบบมึงทำไรก็เจ๊ง",
    "อีหน้าโง่! ถามคำถามแบบนี้แม่มึงไม่ด่าบ้างรึไง",
    "สารรูปอย่างมึง หมายังเมิน นับประสาอะไรกับกู",
    "ชาตินี้มึงคงทำได้แค่นี้แหละ ไอ้ขี้แพ้",
    "โง่แล้วยังขยันหาเรื่องใส่ตัว ปัญญาอ่อนชิบหาย",
    "มึงควรก้มกราบตีนกูนะ ที่กูยังสละเวลามาด่ามึงเนี่ย",
    "คนอย่างมึงตายๆ ไปซะก็ดี รกโลกเปล่าๆ",
    "สมองมึงมีไว้คั่นหูเฉยๆ ใช่มั้ย ไอ้เวรเอ๊ย",
    "ทำตัวไร้ค่าขนาดนี้ พ่อแม่มึงภูมิใจบ้างปะ",
    "หน้าอย่างมึง ชาตินี้อย่าหวังว่าจะได้ดี",
    "สกปรก! ทั้งความคิดทั้งสันดาน ไปชุบตัวใหม่ไป๊",
    "ไอ้สันดานไพร่! มึงคิดว่าตัวเองสูงส่งนักรึไง",
    "กระจอกสัส! เจอเรื่องแค่นี้ก็ร้องไห้ขี้มูกโป่ง",
    "ตอแหลเก่งนักนะ ระวังเวรกรรมตามสนอง",
    "เกิดมาเสียชาติเกิดจริงๆ มึงเนี่ย",
    "หน้าด้านหน้าทน ไล่เท่าไหร่ก็ไม่ไป น่ารำคาญ",
    "ความคิดตื้นเขินเหมือนรอยหยักในสมองมึงเลย",
    "มึงนี่มันเป็นภาระสังคมจริงๆ รีบๆ หายไปซะทีเถอะ",
    "กูขยะแขยงมึงว่ะ แค่เห็นคำถามก็อยากจะอ้วกแล้ว",
    "โง่ซ้ำซาก! มึงเคยเรียนรู้อะไรจากความผิดพลาดบ้างมั้ย",
    // -------------------------------------------------------------------------
    // V4: Extreme Sarcastic / Mocking / Passive Aggressive (User Requested)
    // -------------------------------------------------------------------------
    "โอ๊ยยยย กราบล่ะครับ หยุดถามเรื่องโง่ๆ แบบนี้สักทีเถอะ กูไหว้ล่ะ!",
    "เก่งจังเลย เก่งเรื่องหาทำแต่ความชิบหายให้ตัวเองเนี่ย",
    "สุดยอด! เป็นความคิดที่บรรเจิดมาก (ประชดนะ เผื่อมึงโง่จนแยกไม่ออก)",
    "จ้า พ่อคนฉลาด พ่ออัจฉริยะ ทำไปเลยจ้า เจ๊งมาอย่ามาร้องนะ",
    "เหนื่อยจะด่าแล้วว่ะ มึงช่วยเอาสมองไปล้างน้ำหน่อยเหอะ",
    "อืม... น่าสนใจดีนะ (กูแกล้งชมไปงั้นแหละ ขี้เกียจขัดคนโง่)",
    "สาธุ ขอให้มึงรอดละกันนะ ทรงนี้ไม่น่ารอดเกิน 3 วัน",
    "โห คิดได้ไงเนี่ย?! ต้องโง่ระดับไหนถึงจะคิดอะไรแบบนี้ออกมาได้",
    "เชิญครับ เชิญรับกรรมที่ตัวเองก่อไว้ตามสบายเลยครับ",
    "กราบตีนกู 3 ที แล้วกูจะบอกว่ามันเวิร์คมั้ย (แต่มึงคงทำไปแล้วสินะ ไอ้โง่)",
    "ร้องขอชีวิตกูสิ! เผื่อกูจะสงสารแล้วบอกความจริงว่ามึงมันกระจอกแค่ไหน",
    "ว้าว... ช่างเป็นการตัดสินใจที่... ส้นตีนมากครับ!",
    "อนุโมทนาบุญด้วยนะ ขอให้เจริญๆ (ลงฮวบๆ)",
    "มึงนี่มันตำนานจริงๆ... ตำนานความโง่ดักดานที่หาใครเปรียบไม่ได้",
    "กูยอมแพ้ละ มึงอยากทำอะไรก็ทำไปเถอะ ขี้เกียจเตือนควายละ",
    "ปุยมุ้ยยยย โง่ปุยมุ้ยยยยยยยยยย",
    "ช่วยกูด้วย! มีคนบ้าหลงเข้ามาถามอะไรปัญญาอ่อนๆ ตรงนี้!",
    "มึงเอาเวลาที่มานั่งถามกู ไปหาหมอเช็คสมองบ้างก็ดีนะ",
    "สาบานว่านี่คือใช้สมองคิดแล้ว? กูตกใจมากเลยนะเนี่ย",
    "เอาที่สบายใจเลยจ้า แต่อย่าลืมเตรียมโลงศพรอไว้ด้วยนะ"
];

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

    const catImage = document.getElementById('catImage');
    themeSwitch.addEventListener('change', (e) => {
        playSwitchSound(e.target.checked);
        if (e.target.checked) {
            document.body.classList.add('theme-day');
            catImage.src = 'fortune_cat_day.png';
        } else {
            document.body.classList.remove('theme-day');
            catImage.src = 'fortune_cat.png';
        }
    });

    const rudeSwitch = document.getElementById('rudeSwitch');
    if (rudeSwitch) {
        rudeSwitch.addEventListener('change', (e) => {
            playSwitchSound(e.target.checked);
        });
    }

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

    let consecutiveTaps = 0;
    let tapTimer = null;

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

    function triggerSecretKnock() {
        const knockResponses = [
            "ไม่ได้หลับ! แค่พักสายตา เมี๊ยว!",
            "จะเคาะทำไม ยังไม่ได้พิมพ์คำถามเลย!",
            "ของมันต้องใช้สมาธินะ อย่ากวนสิ",
            "เคาะหาปลาทูเหรอ? ไม่มีหรอกนะ",
            "อ๊ะ! ตกใจหมดเลย... อย่าเล่นแบบนี้สิ",
        ];
        const finalAnswerToReveal = knockResponses[Math.floor(Math.random() * knockResponses.length)];
        
        flashBang.classList.remove('hidden');
        flashBang.classList.add('active');
        
        setTimeout(() => {
            flashBang.classList.remove('active');
            setTimeout(() => flashBang.classList.add('hidden'), 300);

            questionDisplay.textContent = "... (ก๊อก ก๊อก ก๊อก)";
            answerText.innerHTML = "";
            answerOverlay.classList.remove('hidden');
            
            startDecypherEffect(answerText, finalAnswerToReveal, 1500);
        }, 300);
    }

    function stopCharging(triggerOracle) {
        if (!isCharging) return;
        isCharging = false;
        catScene.classList.remove('charging');
        stopChargeSound();
        if (navigator.vibrate) navigator.vibrate(0); // Stop charging vibration

        const chargeDuration = Date.now() - chargeStartTime;
        
        // If held for >500ms and triggerOracle is true, BOOM!
        if (triggerOracle && chargeDuration > 500) {
            playHeartbeat();
            if (navigator.vibrate) navigator.vibrate([100, 100, 100]); // Heartbeat vibration
            setTimeout(() => {
                executeOracleReveal();
            }, 600); // 600ms suspense pause
        } else if (triggerOracle && chargeDuration <= 200) {
            // Secret Knock Logic: 3 rapid taps with empty input
            const question = questionInput.value.trim();
            if (question === "") {
                consecutiveTaps++;
                clearTimeout(tapTimer);
                tapTimer = setTimeout(() => {
                    consecutiveTaps = 0;
                }, 1000); // Reset after 1s

                if (consecutiveTaps >= 3) {
                    consecutiveTaps = 0;
                    triggerSecretKnock();
                }
            }
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
        const isRudeMode = document.getElementById('rudeSwitch').checked;
        const currentAnswerPool = isRudeMode ? rudeAnswers : answers;

        do {
            randomAnswerObj = currentAnswerPool[Math.floor(Math.random() * currentAnswerPool.length)];
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

        // --- Time-based System (00:00 - 03:59) ---
        const currentHour = new Date().getHours();
        if (askCount < 5 && currentHour >= 0 && currentHour < 4) {
            const lateNightResponses = [
                "เวลานี้อย่าเพิ่งถามเลย... บางเรื่องปล่อยให้มืดมิดไปเถอะ",
                "ดึกป่านนี้แล้ว ไปนอนเถอะนะ แมวก็ง่วง",
                "มีใครบางคน... หรือบางสิ่ง กำลังรอให้คุณหลับตา",
                "พลังงานบางอย่างบอกให้คุณวางมือถือแล้วไปนอน",
                "ความมืดมิดมีคำตอบซ่อนอยู่... แต่คุณอาจไม่อยากรู้หรอก"
            ];
            // 50% chance to override standard answer if late at night
            if (Math.random() > 0.5) {
                finalAnswerToReveal = lateNightResponses[Math.floor(Math.random() * lateNightResponses.length)];
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
            } else if (qLower.includes("หางาน") || qLower.includes("สมัครงาน") || qLower.includes("สัมภาษณ์งาน") || qLower.includes("เรซูเม่") || qLower.includes("ตกงาน") || qLower.includes("ว่างงาน") || qLower.includes("รอเรียก")) {
                const jobHuntingResponses = [
                    "เรซูเม่ปังขนาดนี้ บริษัทไหนไม่รับก็พลาดแล้ว!",
                    "ส่งใบสมัครต่อไป! ตำแหน่งที่ใช่กำลังรอคุณอยู่",
                    "ช่วงนี้ดวงเรื่องงานกำลังมา เตรียมรับสาย HR ได้เลย",
                    "พักผ่อนบ้างนะ อย่าเพิ่งเครียดเกินไป เดี๋ยวมันก็มาเอง",
                    "ที่นี่ไม่รับก็ไปที่อื่น บริษัทไม่ได้มีที่เดียวในโลก!",
                    "ซ้อมตอบคำถามสัมภาษณ์ไว้ให้ดี โอกาสมาถึงแล้วต้องคว้าไว้",
                    "ถ้าเขาไม่เห็นค่าเรา ก็หาที่ที่เขาเห็นค่าเราสิ!",
                    "ใจเย็นๆ ของดีต้องรอหน่อย คนเก่งๆ แบบคุณหาไม่ยากหรอก (เอ๊ะ หรือยาก?)",
                    "พรุ่งนี้ลองร่อนเรซูเม่ใหม่ดูนะ วันนี้อาจจะแค่ฤกษ์ไม่ดี",
                    "ได้งานแน่นอน! (ถ้าคุณไม่เลือกงานมากเกินไปนะ)",
                    "ถือซะว่าว่างงานคือการได้พักร้อนยาวๆ ชาร์จแบตไปก่อน",
                    "ลองบนบานศาลกล่าวดูไหม? เผื่อช่วยได้ (หยอกๆ)",
                    "แต่งตัวรอสัมภาษณ์เลย ออร่าคนกำลังจะได้งานจับแล้ว!",
                    "ลองปรับเรซูเม่ดูนิดหน่อย อาจจะเตะตา HR กว่าเดิม",
                    "เดี๋ยวเขาก็โทรมา... ถ้าเขาไม่โทรมาก็โทรไปหาเขาเองเลย ใจๆ ไป!"
                ];
                finalAnswerToReveal = jobHuntingResponses[Math.floor(Math.random() * jobHuntingResponses.length)];
            } else if (qLower.includes("งาน") || qLower.includes("เจ้านาย") || qLower.includes("สัมภาษณ์") || qLower.includes("โปรเจกต์") || qLower.includes("ลาออก") || qLower.includes("ทำงาน")) {
                const workResponses = [
                    "สู้ต่อไป ทาเคชิ! เจ้านายรอประเมินอยู่",
                    "ลาออกเลยสิ รออะไร! (หยอกๆ อดทนไว้นะ)",
                    "งานหนักไม่เคยฆ่าใคร แต่ทำให้อยากตายเฉยๆ",
                    "ความพยายามอยู่ที่ไหน ความสำเร็จอยู่ที่นั่น ลุยเลย!",
                    "พักผ่อนบ้างนะ งานไม่ได้หนีไปไหนหรอก",
                    "เตรียมรับข่าวดีเรื่องงานเร็วๆ นี้!"
                ];
                finalAnswerToReveal = workResponses[Math.floor(Math.random() * workResponses.length)];
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
            
            // Speak the answer aloud
            speakAnswer(finalAnswerToReveal);
            
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

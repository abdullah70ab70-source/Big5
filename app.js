// دوال التوست والتنبيهات
let toastTimeout;
function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.innerText = msg;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toast.classList.remove('show'), 2000);
}

// التعامل مع تنبيه الاستئناف
function closeResumeBanner() {
    document.getElementById('resume-banner').classList.remove('show');
}
function resumePlayback() {
    closeResumeBanner();
    if(window.resumeData) {
        if (window.resumeData.id === 'radio') {
            playRadio();
        } else {
            playSurah(window.resumeData.id, window.resumeData.url);
        }
    }
}

// التعامل مع شريط تثبيت التطبيق الانزلاقي
function closeInstallBanner() {
    document.getElementById('install-banner').classList.remove('show');
}

const surahNamesEn = [
    "", "Al-Fatihah", "Al-Baqarah", "Ali 'Imran", "An-Nisa", "Al-Ma'idah", "Al-An'am", "Al-A'raf", "Al-Anfal", "At-Tawbah", "Yunus", "Hud", "Yusuf", "Ar-Ra'd", "Ibrahim", "Al-Hijr", "An-Nahl", "Al-Isra", "Al-Kahf", "Maryam", "Taha",
    "Al-Anbiya", "Al-Hajj", "Al-Mu'minun", "An-Nur", "Al-Furqan", "Ash-Shu'ara", "An-Naml", "Al-Qasas", "Al-'Ankabut", "Ar-Rum", "Luqman", "As-Sajdah", "Al-Ahzab", "Saba", "Fatir", "Ya-Sin", "As-Saffat", "Sad", "Az-Zumar", "Ghafir",
    "Fussilat", "Ash-Shura", "Az-Zukhruf", "Ad-Dukhan", "Al-Jathiyah", "Al-Ahqaf", "Muhammad", "Al-Fath", "Al-Hujurat", "Qaf", "Adh-Dhariyat", "At-Tur", "An-Najm", "Al-Qamar", "Ar-Rahman", "Al-Waqi'ah", "Al-Hadid", "Al-Mujadila", "Al-Hashr", "Al-Mumtahanah",
    "As-Saff", "Al-Jumu'ah", "Al-Munafiqun", "At-Taghabun", "At-Talaq", "At-Tahrim", "Al-Mulk", "Al-Qalam", "Al-Haqqah", "Al-Ma'arij", "Nuh", "Al-Jinn", "Al-Muzzammil", "Al-Muddaththir", "Al-Qiyamah", "Al-Insan", "Al-Mursalat", "An-Naba", "An-Nazi'at", "'Abasa",
    "At-Takwir", "Al-Infitar", "Al-Mutaffifin", "Al-Inshiqaq", "Al-Buruj", "At-Tariq", "Al-A'la", "Al-Ghashiyah", "Al-Fajr", "Al-Balad", "Ash-Shams", "Al-Layl", "Ad-Duhaa", "Ash-Sharh", "At-Tin", "Al-'Alaq", "Al-Qadr", "Al-Bayyinah", "Az-Zalzalah", "Al-'Adiyat",
    "Al-Qari'ah", "At-Takathur", "Al-'Asr", "Al-Humazah", "Al-Fil", "Quraysh", "Al-Ma'un", "Al-Kawthar", "Al-Kafirun", "An-Nasr", "Al-Masad", "Al-Ikhlas", "Al-Falaq", "An-Nas"
];

const translations = {
    ar: { langLabel: "EN", sheikhPrefix: "الشيخ", surahPrefix: "سورة", downloading: "جاري تحميل", downloadComplete: "تم التحميل بنجاح!", resumeBtn: "متابعة الاستماع", cancelBtn: "إلغاء", radioTitle: "إذاعة القرآن الكريم من القاهرة", live: "مباشر", installTitle: "تثبيت تطبيق Egy Quran", installDesc: "تجربة استماع أسرع وتعمل بدون إنترنت", installBtn: "تثبيت", radioTooltip: "إذاعة القرآن الكريم" },
    en: { langLabel: "AR", sheikhPrefix: "Sheikh", surahPrefix: "Surah", downloading: "Downloading", downloadComplete: "Download Complete!", resumeBtn: "Resume Listening", cancelBtn: "Cancel", radioTitle: "Holy Quran Radio Cairo", live: "LIVE", installTitle: "Install Egy Quran App", installDesc: "Faster experience with offline support", installBtn: "Install", radioTooltip: "Holy Quran Radio" }
};
let currentLang = 'ar';
const radioUrl = "https://stream.radiojar.com/8s5u5tpdtwzuv";

const recitersList = [
    { id: "husary", nameAr: "محمود خليل الحصري", nameEn: "Mahmoud Khalil Al-Husary", image: "hosary.jpg" },
    { id: "minshawi", nameAr: "محمد صديق المنشاوي", nameEn: "Muhammad Siddiq Minshawi", image: "minshawy.jpg" },
    { id: "mustafa", nameAr: "مصطفى إسماعيل", nameEn: "Mustafa Ismail", image: "mustafa.jpg" },
    { id: "banna", nameAr: "محمود علي البنا", nameEn: "Mahmoud Ali Al-Banna", image: "banna.jpg" },
    { id: "basit", nameAr: "عبد الباسط عبد الصمد", nameEn: "Abdul Basit Abdul Samad", image: "basit.jpg" }
];

const editionsConfig = {
    "husary": { 
        1: { pillAr: "حفص (الإذاعة)", pillEn: "Hafs (Radio)", file: "husary_1.json", descAr: "الإذاعة المصرية", descEn: "Egyptian Radio" }, 
        2: { pillAr: "ورش", pillEn: "Warsh", file: "husary_2.json", descAr: "رواية ورش عن نافع", descEn: "Warsh A'n Nafi'" }, 
        3: { pillAr: "قالون", pillEn: "Qalun", file: "husary_3.json", descAr: "رواية قالون عن نافع", descEn: "Qalun A'n Nafi'" }, 
        4: { pillAr: "الدوري", pillEn: "Al-Duri", file: "husary_4.json", descAr: "رواية الدوري عن أبي عمرو", descEn: "Al-Duri A'n Abi Amr" },
        5: { pillAr: "المجود", pillEn: "Mujawwad", file: "husary_5.json", descAr: "التلاوة المجودة", descEn: "Mujawwad Recitation" } 
    },
    "minshawi": { 
        1: { pillAr: "حفص (الإذاعة)", pillEn: "Hafs (Radio)", file: "minshawi_1.json", descAr: "الإذاعة المصرية", descEn: "Egyptian Radio" }, 
        2: { pillAr: "الختمة الثانية", pillEn: "2nd Khatma", file: "minshawi_2.json", descAr: "الختمة الثانية (المفقودة)", descEn: "The Second Khatma (Lost)" },
        3: { pillAr: "المعلم", pillEn: "Mu'allim", file: "minshawi_3.json", descAr: "المصحف المعلم", descEn: "Al-Mushaf Al-Mu'allim" },
        4: { pillAr: "المجود", pillEn: "Mujawwad", file: "minshawi_4.json", descAr: "التلاوة المجودة", descEn: "Mujawwad Recitation" }
    },
    "mustafa": { 
        1: { pillAr: "حفص (الإذاعة)", pillEn: "Hafs (Radio)", file: "mustafa_1.json", descAr: "الإذاعة المصرية", descEn: "Egyptian Radio" },
        2: { pillAr: "المجود", pillEn: "Mujawwad", file: "mustafa_2.json", descAr: "التلاوة المجودة", descEn: "Mujawwad Recitation" }
    },
    "banna": { 
        1: { pillAr: "حفص (الإذاعة)", pillEn: "Hafs (Radio)", file: "banna_1.json", descAr: "الإذاعة المصرية", descEn: "Egyptian Radio" },
        2: { pillAr: "المجود", pillEn: "Mujawwad", file: "banna_2.json", descAr: "التلاوة المجودة", descEn: "Mujawwad Recitation" }
    },
    "basit": { 
        1: { pillAr: "حفص (الإذاعة)", pillEn: "Hafs (Radio)", file: "basit_1.json", descAr: "الإذاعة المصرية", descEn: "Egyptian Radio" },
        2: { pillAr: "ورش", pillEn: "Warsh", file: "basit_2.json", descAr: "رواية ورش عن نافع", descEn: "Warsh A'n Nafi'" },
        3: { pillAr: "المجود", pillEn: "Mujawwad", file: "basit_3.json", descAr: "التلاوة المجودة", descEn: "Mujawwad Recitation" }
    }
};

const icons = {
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
    pause: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>',
    loading: '<svg class="loading-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"></path></svg>',
    sun: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path></svg>',
    moon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>',
    download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>'
};

// تهيئة المشغل
let audioInstance = new Audio();
audioInstance.crossOrigin = "anonymous"; 

// متغيرات تضخيم الصوت
let audioCtx, gainNode, audioSource;

// دالة تهيئة مضخم الصوت مع التعامل مع الأخطاء وإجبار فتح المسار
function initAudioBoost() {
    try {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                audioCtx = new AudioContext();
                audioSource = audioCtx.createMediaElementSource(audioInstance);
                gainNode = audioCtx.createGain();
                gainNode.gain.value = 3.5; // قوة تضخيم الصوت (350%)
                audioSource.connect(gainNode);
                gainNode.connect(audioCtx.destination);
            }
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume().catch(e => console.log("Context Resume Error:", e));
        }
    } catch (e) {
        console.log("Audio API Init Error:", e);
    }
}

let currentTheme = 'light', currentSheikhId = "husary", currentEdition = 1;
let activeSurahsData = [], playingSurahId = null, playingSheikhId = null, playingEditionId = null, isBuffering = false;
let isRadioHeaderActive = false;
let isFocusMode = false;

let preloadAudioObj = new Audio(); 
let preloadedSurahId = null;

let activeDownloads = {};
let savedReciterEditions = {}; 

let playbackMode = 'autonext'; 
let playbackMenuOpen = false;

function getSurahName(id, nameAr) { return currentLang === 'ar' ? nameAr : surahNamesEn[id]; }

function updateHeaderUI() {
    if (isFocusMode && (playingSheikhId || playingSurahId === 'radio')) {
        if (playingSurahId === 'radio') {
            document.getElementById('header-avatar-img').src = 'radio.png';
            document.getElementById('main-title').innerHTML = `<strong>${translations[currentLang].radioTitle}</strong>`;
            document.getElementById('header-subtitle').innerText = translations[currentLang].live;
        } else {
            const s = recitersList.find(r => r.id === playingSheikhId);
            document.getElementById('header-avatar-img').src = s.image;
            document.getElementById('main-title').innerHTML = `${translations[currentLang].sheikhPrefix} <strong>${currentLang === 'ar' ? s.nameAr : s.nameEn}</strong>`;
            document.getElementById('header-subtitle').innerText = currentLang === 'ar' ? editionsConfig[playingSheikhId][playingEditionId].descAr : editionsConfig[playingSheikhId][playingEditionId].descEn;
        }
    } else {
        if (isRadioHeaderActive) {
            document.getElementById('header-avatar-img').src = 'radio.png';
            document.getElementById('main-title').innerHTML = `<strong>${translations[currentLang].radioTitle}</strong>`;
            document.getElementById('header-subtitle').innerText = translations[currentLang].live;
        } else {
            const s = recitersList.find(r => r.id === currentSheikhId);
            if (s) {
                document.getElementById('header-avatar-img').src = s.image;
                document.getElementById('main-title').innerHTML = `${translations[currentLang].sheikhPrefix} <strong>${currentLang === 'ar' ? s.nameAr : s.nameEn}</strong>`;
                document.getElementById('header-subtitle').innerText = currentLang === 'ar' ? editionsConfig[currentSheikhId][currentEdition].descAr : editionsConfig[currentSheikhId][currentEdition].descEn;
            }
        }
    }
}

function toggleLanguage() {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;
    document.documentElement.style.setProperty('--dir', document.documentElement.dir);
    
    document.getElementById('lang-label').innerText = translations[currentLang].langLabel;
    document.getElementById('resume-btn-yes').innerText = translations[currentLang].resumeBtn;
    document.getElementById('resume-btn-no').innerText = translations[currentLang].cancelBtn;
    
    document.getElementById('install-title').innerText = translations[currentLang].installTitle;
    document.getElementById('install-desc').innerText = translations[currentLang].installDesc;
    document.getElementById('install-action-btn').innerText = translations[currentLang].installBtn;
    document.getElementById('radio-tooltip').innerText = translations[currentLang].radioTooltip;

    updateHeaderUI();
    setPlaybackMode(playbackMode);
    
    if (playingSurahId === 'radio') {
        document.getElementById('player-track-title').innerText = translations[currentLang].radioTitle;
        document.getElementById('total-time').innerText = translations[currentLang].live;
    } else if (playingSurahId) {
        const sData = activeSurahsData.find(s => s.id === playingSurahId);
        if(sData) document.getElementById('player-track-title').innerText = `${translations[currentLang].surahPrefix} ${getSurahName(sData.id, sData.name)}`;
    }

    renderSheikhCarousel();
    renderEditionDropdown();
    if (activeSurahsData && activeSurahsData.length > 0) {
        renderSurahsList();
    }

    const metaDesc = document.querySelector('meta[name="description"]');
    if (isRadioHeaderActive || playingSurahId === 'radio') {
        document.title = `Egy Quran - ${translations[currentLang].radioTitle}`;
        if (metaDesc) metaDesc.setAttribute("content", currentLang === 'ar' ? "استمع إلى البث المباشر لإذاعة القرآن الكريم من القاهرة على منصة Egy Quran." : "Listen to the live broadcast of Holy Quran Radio Cairo on Egy Quran.");
    } else {
        const s = recitersList.find(r => r.id === currentSheikhId);
        if (s) {
            const sheikhName = currentLang === 'ar' ? s.nameAr : s.nameEn;
            document.title = `Egy Quran - ${currentLang === 'ar' ? 'الشيخ' : 'Sheikh'} ${sheikhName}`;
            if (metaDesc) metaDesc.setAttribute("content", currentLang === 'ar' ? `استمع وحمل القرآن الكريم كاملاً بصوت الشيخ ${sheikhName} بجودة عالية وبدون إعلانات مزعجة على Egy Quran.` : `Listen and download the complete Holy Quran by Sheikh ${sheikhName} in high quality on Egy Quran.`);
        }
    }
}

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.body.className = currentTheme === 'dark' ? 'dark-theme' : '';
    document.getElementById('theme-toggle-btn').innerHTML = currentTheme === 'dark' ? icons.moon : icons.sun;
}

function toggleFocusMode() {
    isFocusMode = !isFocusMode;
    const focusBtn = document.getElementById('focus-toggle-btn');
    
    if (isFocusMode) {
        document.body.classList.add('focus-mode-active');
        window.scrollTo({ top: 0, behavior: 'smooth' }); 
        if (focusBtn) focusBtn.classList.add('active-feature');
        showToast(currentLang === 'ar' ? 'تم تفعيل وضع الاستماع الهادئ' : 'Focus Mode Enabled');
    } else {
        document.body.classList.remove('focus-mode-active');
        if (focusBtn) focusBtn.classList.remove('active-feature');
        showToast(currentLang === 'ar' ? 'تم إيقاف وضع الاستماع الهادئ' : 'Focus Mode Disabled');
    }
    updateHeaderUI();
    syncUIWithAudioState(); 
}

function togglePlaybackMenu(event) {
    if(event) event.stopPropagation();
    playbackMenuOpen = !playbackMenuOpen;
    const menu = document.getElementById('playback-menu');
    if (playbackMenuOpen) { menu.classList.add('show'); } 
    else { menu.classList.remove('show'); }
}

document.addEventListener('click', (e) => {
    if (playbackMenuOpen && !e.target.closest('#playback-wrapper')) togglePlaybackMenu();
});

function setPlaybackMode(mode, event) {
    if(event) event.stopPropagation();
    playbackMode = mode;
    audioInstance.loop = (mode === 'loop');

    const btn = document.getElementById('btn-playback-mode');
    const textSpan = document.getElementById('playback-text');
    const iconSvg = document.getElementById('playback-icon');

    if (mode === 'autonext') {
        btn.classList.add('active-feature');
        textSpan.innerText = currentLang === 'ar' ? 'تلقائي' : 'Auto';
        iconSvg.innerHTML = '<path d="M8 6h13"></path><path d="M8 12h13"></path><path d="M8 18h13"></path><path d="M3 6h.01"></path><path d="M3 12h.01"></path><path d="M3 18h.01"></path>';
    } else if (mode === 'loop') {
        btn.classList.add('active-feature');
        textSpan.innerText = currentLang === 'ar' ? 'تكرار' : 'Loop';
        iconSvg.innerHTML = '<polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path>';
    } else {
        btn.classList.remove('active-feature');
        textSpan.innerText = currentLang === 'ar' ? 'إيقاف' : 'Off';
        iconSvg.innerHTML = '<circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>';
    }

    renderPlaybackMenu();
    if (playbackMenuOpen) togglePlaybackMenu();
}

function renderPlaybackMenu() {
    const menu = document.getElementById('playback-menu');
    const items = [
        { id: 'autonext', textAr: 'تشغيل تلقائي', textEn: 'Auto-Next' },
        { id: 'loop', textAr: 'تكرار السورة', textEn: 'Loop Surah' },
        { id: 'off', textAr: 'إيقاف', textEn: 'Off' }
    ];
    menu.innerHTML = items.map(item =>
        `<div class="playback-menu-item ${playbackMode === item.id ? 'active' : ''}" onclick="setPlaybackMode('${item.id}', event)">
            ${currentLang === 'ar' ? item.textAr : item.textEn}
        </div>`
    ).join('');
}

function syncUIWithAudioState() {
    const isPlaying = !audioInstance.paused;
    const statusIcon = isBuffering ? icons.loading : (isPlaying ? icons.pause : icons.play);
    document.getElementById('player-play-btn').innerHTML = statusIcon;

    const radioBtn = document.getElementById('radio-btn');
    if (radioBtn) {
        if (playingSurahId === 'radio' && isPlaying && !isBuffering) {
            radioBtn.classList.add('radio-active');
        } else {
            radioBtn.classList.remove('radio-active');
        }
    }

    const isHeaderMatchingPlaying = isFocusMode || 
        (playingSurahId === 'radio' && isRadioHeaderActive) || 
        (playingSurahId !== 'radio' && currentSheikhId === playingSheikhId && currentEdition == playingEditionId);

    const headerEq = document.getElementById('header-equalizer');
    if (headerEq) {
        if (isPlaying && !isBuffering && isHeaderMatchingPlaying) {
            headerEq.classList.add('playing');
        } else {
            headerEq.classList.remove('playing');
        }
    }

    document.querySelectorAll('.surah-row').forEach(row => {
        const sId = parseInt(row.getAttribute('data-id'));
        const playBtn = row.querySelector('.play-cell');
        const isCurrentActive = (sId === playingSurahId && playingSurahId !== 'radio' && currentSheikhId === playingSheikhId && currentEdition === playingEditionId);
        if (isCurrentActive) { row.classList.add('active-row'); playBtn.innerHTML = isBuffering ? icons.loading : (isPlaying ? icons.pause : icons.play); } 
        else { row.classList.remove('active-row'); playBtn.innerHTML = icons.play; }
    });

    document.querySelectorAll('.sheikh-item').forEach(item => {
        const sId = item.getAttribute('data-id');
        let badge = item.querySelector('.playing-badge');
        if (sId === playingSheikhId && isPlaying && !isBuffering && playingSurahId !== 'radio') {
            if (!badge) item.querySelector('.sheikh-avatar-container').insertAdjacentHTML('beforeend', `<div class="playing-badge"><div class="equalizer-bar" style="animation: equalize 0.8s infinite alternate"></div><div class="equalizer-bar" style="animation: equalize 0.5s infinite alternate; animation-delay:0.1s"></div><div class="equalizer-bar" style="animation: equalize 0.7s infinite alternate; animation-delay:0.2s"></div></div>`);
        } else if (badge) badge.remove();
    });

    document.querySelectorAll('.edition-pill').forEach(pill => {
        const pillKey = pill.getAttribute('data-key');
        const isPlayingThisEdition = (currentSheikhId === playingSheikhId && pillKey == playingEditionId && isPlaying && !isBuffering && playingSurahId !== 'radio');
        let dot = pill.querySelector('.active-dot');
        if (isPlayingThisEdition) {
            if (!dot) pill.insertAdjacentHTML('beforeend', `<span class="active-dot"></span>`);
        } else {
            if (dot) dot.remove();
        }
    });
}

async function loadEditionData(sheikhId, editionNum) {
    const config = editionsConfig[sheikhId][editionNum];
    if (!config) return; 
    const cacheKey = `cache_${config.file}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) { activeSurahsData = JSON.parse(cached); renderSurahsList(); }
    try {
        const res = await fetch(config.file);
        const data = await res.json();
        activeSurahsData = data;
        localStorage.setItem(cacheKey, JSON.stringify(data));
        renderSurahsList();
    } catch (e) { console.error("Error loading JSON"); }
}

function renderSheikhCarousel() {
    document.getElementById('sheikh-carousel').innerHTML = recitersList.map(s => {
        const nameToShow = currentLang === 'ar' ? s.nameAr : s.nameEn;
        return `<div class="sheikh-item ${s.id === currentSheikhId ? 'active' : ''}" data-id="${s.id}" onclick="selectSheikh('${s.id}')">
                    <div class="sheikh-avatar-container"><img src="${s.image}" class="sheikh-avatar-img"></div>
                    <div style="font-size:0.65rem; font-weight:700; margin-top:6px;">${nameToShow}</div>
                </div>`;
    }).join('');
    syncUIWithAudioState();
}

function renderSurahsList() {
    document.getElementById('main-surah-list').innerHTML = activeSurahsData.map(s => {
        return `<div class="surah-row" data-id="${s.id}">
                    <div class="surah-info"><span class="surah-number">${String(s.id).padStart(3, '0')}</span><span class="surah-name">${translations[currentLang].surahPrefix} ${getSurahName(s.id, s.name)}</span></div>
                    <div class="surah-actions" style="flex-direction: ${currentLang === 'ar' ? 'row' : 'row-reverse'};">
                        <button class="surah-action-btn play-cell" onclick="playSurah(${s.id}, '${s.url}')">${icons.play}</button>
                        <button class="surah-action-btn" onclick="startDownload(${s.id}, '${s.url}')" title="تحميل">${icons.download}</button>
                    </div>
                </div>`;
    }).join('');
    syncUIWithAudioState();
}

const dlModal = document.getElementById('download-modal'), dlFill = document.getElementById('dl-progress-fill'), dlPct = document.getElementById('dl-modal-pct'), dlTitle = document.getElementById('dl-modal-title');
async function startDownload(id, url) {
    if (activeDownloads[id]) return; activeDownloads[id] = true;
    const sData = activeSurahsData.find(s => s.id === id); const sName = getSurahName(id, sData.name);
    dlModal.style.display = 'flex'; dlFill.style.width = '0%'; dlPct.innerText = '0%'; dlTitle.innerText = `${translations[currentLang].downloading} ${sName}...`;
    try {
        const response = await fetch(url, { mode: 'cors' });
        if (!response.ok) throw new Error("Network Error");
        const total = parseInt(response.headers.get('content-length'), 10);
        const reader = response.body.getReader();
        let received = 0; let chunks = [];
        while(true) {
            const {done, value} = await reader.read();
            if (done) break; chunks.push(value); received += value.length;
            if (total) { const pct = Math.round((received / total) * 100); dlFill.style.width = pct + '%'; dlPct.innerText = pct + '%'; } 
            else { dlPct.innerHTML = '<span class="loading-spin" style="display:inline-block; width:15px; height:15px;">⏳</span>'; }
        }
        const blob = new Blob(chunks, { type: 'audio/mpeg' }); const objectUrl = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = objectUrl; a.download = `${translations[currentLang].surahPrefix}_${sName}.mp3`;
        document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(objectUrl);
        finishDownloadUI(id);
    } catch (err) {
        const a = document.createElement('a'); a.href = url; a.download = `${translations[currentLang].surahPrefix}_${sName}.mp3`; a.target = '_blank';
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        finishDownloadUI(id);
    }
}
function finishDownloadUI(id) { dlTitle.innerText = translations[currentLang].downloadComplete; dlFill.style.width = '100%'; dlPct.innerText = '100%'; setTimeout(() => { dlModal.style.display = 'none'; delete activeDownloads[id]; }, 1500); }

async function selectSheikh(id) {
    currentSheikhId = id;
    isRadioHeaderActive = false;
    
    if (id === playingSheikhId && playingEditionId && editionsConfig[id][playingEditionId]) currentEdition = playingEditionId; else currentEdition = savedReciterEditions[id] || 1;
    const s = recitersList.find(r => r.id === id);

    const sheikhName = currentLang === 'ar' ? s.nameAr : s.nameEn;
    document.title = `Egy Quran - ${currentLang === 'ar' ? 'الشيخ' : 'Sheikh'} ${sheikhName}`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
        metaDesc.setAttribute("content", currentLang === 'ar' ? 
            `استمع وحمل القرآن الكريم كاملاً بصوت الشيخ ${sheikhName} بجودة عالية وبدون إعلانات مزعجة على Egy Quran.` : 
            `Listen and download the complete Holy Quran by Sheikh ${sheikhName} in high quality on Egy Quran.`);
    }
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + `?sheikh=${id}`;
    window.history.pushState({ path: newUrl }, '', newUrl);

    updateHeaderUI();

    renderSheikhCarousel(); renderEditionDropdown(); await loadEditionData(id, currentEdition);
    
    if (playingSurahId && playingSurahId !== 'radio' && playingSheikhId === id && playingEditionId === currentEdition) {
        const sData = activeSurahsData.find(sur => sur.id === playingSurahId);
        if(sData && audioInstance.src === "") {
            audioInstance.src = sData.url;
            document.getElementById('global-player').style.display = 'block';
            document.getElementById('player-track-title').innerText = `${translations[currentLang].surahPrefix} ${getSurahName(sData.id, sData.name)}`;
            syncUIWithAudioState();
        }
    }
}

function renderEditionDropdown() {
    const configs = editionsConfig[currentSheikhId]; const keys = Object.keys(configs);
    const pills = keys.map(key => `<div class="edition-pill ${currentEdition == key ? 'active' : ''}" data-key="${key}" onclick="selectEditionDropdown(${key}, event)">${currentLang === 'ar' ? configs[key].pillAr : configs[key].pillEn}</div>`).join('');
    document.getElementById('edition-dropdown-wrapper').innerHTML = `<div class="edition-list-wrapper"><div class="edition-list">${pills}</div></div>`;
    syncUIWithAudioState(); 
}

async function selectEditionDropdown(num, event) {
    if(event) event.stopPropagation(); if(currentEdition == num) return; 
    currentEdition = num; savedReciterEditions[currentSheikhId] = num; 
    isRadioHeaderActive = false;
    
    updateHeaderUI();
    renderEditionDropdown(); await loadEditionData(currentSheikhId, num);
}

function hideRadioDiscovery() {
    document.getElementById('radio-tooltip').classList.remove('show');
    document.getElementById('radio-badge').classList.remove('show');
    localStorage.setItem('radioDiscovered', 'true');
}

function playRadio() {
    hideRadioDiscovery();
    initAudioBoost(); 

    if (playingSurahId === 'radio') { togglePlayPause(); return; }
    
    playingSurahId = 'radio'; 
    playingSheikhId = null; 
    playingEditionId = null;
    
    isBuffering = true; 
    
    // إصلاح مشكلة المتصفح: تفريغ المسار القديم وإجباره على التحديث
    audioInstance.pause();
    audioInstance.src = radioUrl; 
    audioInstance.loop = false;
    audioInstance.load(); 
    
    audioInstance.play().catch(e => {
        console.log("Audio Play Error:", e);
        isBuffering = false;
        syncUIWithAudioState();
    });
    
    localStorage.setItem('lastPlayedQuran', JSON.stringify({ sheikh: null, edition: null, surah: 'radio' }));
    
    document.getElementById('global-player').style.display = 'block'; 
    document.getElementById('player-track-title').innerText = translations[currentLang].radioTitle;
    
    isRadioHeaderActive = true;
    updateHeaderUI();
    
    document.title = `Egy Quran - ${translations[currentLang].radioTitle}`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", currentLang === 'ar' ? "استمع إلى البث المباشر لإذاعة القرآن الكريم من القاهرة على منصة Egy Quran." : "Listen to the live broadcast of Holy Quran Radio Cairo on Egy Quran.");
    
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + `?listen=radio`;
    window.history.pushState({ path: newUrl }, '', newUrl);

    document.getElementById('progress-bar-fill').style.width = '100%';
    document.getElementById('progress-thumb').style.display = 'none';
    document.getElementById('time-separator').style.display = 'none';
    document.getElementById('curr-time').innerText = "";
    document.getElementById('total-time').innerText = translations[currentLang].live;
    
    syncUIWithAudioState();
    
    if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({ 
            title: translations[currentLang].radioTitle, 
            artist: translations[currentLang].live, 
            album: 'Egy Quran', 
            artwork: [ { src: 'radio.png', sizes: '512x512', type: 'image/png' } ] 
        });
        navigator.mediaSession.setActionHandler('play', () => togglePlayPause()); 
        navigator.mediaSession.setActionHandler('pause', () => togglePlayPause());
        navigator.mediaSession.setActionHandler('previoustrack', null); 
        navigator.mediaSession.setActionHandler('nexttrack', null);
        navigator.mediaSession.setActionHandler('seekto', null); 
    }
}

function playSurah(id, url) {
    initAudioBoost(); 
    if (playingSurahId === id && playingSheikhId === currentSheikhId && playingEditionId === currentEdition) { togglePlayPause(); return; }
    
    isRadioHeaderActive = false;
    playingSurahId = id; playingSheikhId = currentSheikhId; playingEditionId = currentEdition;
    
    isBuffering = true; 
    
    // إصلاح مشكلة المتصفح: تفريغ المسار القديم وإجباره على التحديث
    audioInstance.pause();
    audioInstance.src = url; 
    audioInstance.loop = (playbackMode === 'loop');
    audioInstance.load();
    
    audioInstance.play().catch(e => {
        console.log("Audio Play Error:", e);
        isBuffering = false;
        syncUIWithAudioState();
    });
    
    localStorage.setItem('lastPlayedQuran', JSON.stringify({ sheikh: playingSheikhId, edition: playingEditionId, surah: playingSurahId }));
    const sData = activeSurahsData.find(s => s.id === id); const sName = getSurahName(id, sData.name);
    const sheikhObj = recitersList.find(r => r.id === currentSheikhId);
    
    document.getElementById('global-player').style.display = 'block'; 
    document.getElementById('player-track-title').innerText = `${translations[currentLang].surahPrefix} ${sName}`;
    
    document.getElementById('progress-thumb').style.display = 'block';
    document.getElementById('time-separator').style.display = 'inline';

    updateHeaderUI();
    syncUIWithAudioState();
    
    if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({ title: `${translations[currentLang].surahPrefix} ${sName}`, artist: currentLang === 'ar' ? sheikhObj.nameAr : sheikhObj.nameEn, album: 'مصحف كبار القراء', artwork: [ { src: sheikhObj.image, sizes: '512x512', type: 'image/jpeg' } ] });
        navigator.mediaSession.setActionHandler('play', () => togglePlayPause()); navigator.mediaSession.setActionHandler('pause', () => togglePlayPause());
        navigator.mediaSession.setActionHandler('previoustrack', () => playPrevious()); navigator.mediaSession.setActionHandler('nexttrack', () => playNext());
        navigator.mediaSession.setActionHandler('seekto', (details) => { audioInstance.currentTime = details.seekTime; });
    }
}

function togglePlayPause() { 
    initAudioBoost(); 
    if (audioInstance.paused && audioInstance.src) {
        isBuffering = true;
        syncUIWithAudioState();
        
        // إعادة تحميل البث المباشر
        if (playingSurahId === 'radio') {
            audioInstance.pause();
            audioInstance.src = radioUrl;
            audioInstance.load();
        }
        
        audioInstance.play().catch(e => {
            console.log("Audio Play Error:", e);
            isBuffering = false;
            syncUIWithAudioState();
        });
    } else {
        audioInstance.pause(); 
    }
}
function playNext() { 
    if(playingSurahId === 'radio') return;
    const idx = activeSurahsData.findIndex(s => s.id === playingSurahId); if (idx < activeSurahsData.length - 1) { const next = activeSurahsData[idx + 1]; playSurah(next.id, next.url); } 
}
function playPrevious() { 
    if(playingSurahId === 'radio') return;
    const idx = activeSurahsData.findIndex(s => s.id === playingSurahId); if (idx > 0) { const prev = activeSurahsData[idx - 1]; playSurah(prev.id, prev.url); } 
}

audioInstance.addEventListener('waiting', () => { isBuffering = true; syncUIWithAudioState(); });
audioInstance.addEventListener('playing', () => { isBuffering = false; syncUIWithAudioState(); });
audioInstance.addEventListener('play', () => { isBuffering = true; syncUIWithAudioState(); });
audioInstance.addEventListener('pause', () => { isBuffering = false; syncUIWithAudioState(); });

audioInstance.addEventListener('error', () => {
    if (!navigator.onLine) {
        isBuffering = true; 
    } else {
        isBuffering = false;
    }
    syncUIWithAudioState();
    showToast(currentLang === 'ar' ? "خطأ في الاتصال، يرجى التحقق من الإنترنت" : "Network error, please check connection");
});

window.addEventListener('online', () => {
    if (isBuffering && playingSurahId && !audioInstance.paused) {
        audioInstance.load();
        audioInstance.play().catch(e => console.log(e));
        showToast(currentLang === 'ar' ? "تمت استعادة الاتصال، جاري التشغيل..." : "Connection restored, playing...");
    }
});

window.addEventListener('offline', () => {
    if (!audioInstance.paused || isBuffering) {
        isBuffering = true;
        syncUIWithAudioState();
        showToast(currentLang === 'ar' ? "انقطع الاتصال بالإنترنت" : "Internet connection lost");
    }
});

audioInstance.onended = () => {
    if (playbackMode === 'autonext' && playingSurahId !== 'radio') {
        playNext();
    }
};

audioInstance.ontimeupdate = () => {
    if (playingSurahId === 'radio') {
        document.getElementById('progress-bar-fill').style.width = '100%';
        document.getElementById('curr-time').innerText = "";
        document.getElementById('total-time').innerText = translations[currentLang].live;
    } else if (audioInstance.duration && !isDragging) {
        document.getElementById('progress-bar-fill').style.width = ((audioInstance.currentTime / audioInstance.duration) * 100) + '%';
        document.getElementById('curr-time').innerText = formatTime(audioInstance.currentTime);
        document.getElementById('total-time').innerText = formatTime(audioInstance.duration);

        if (playbackMode === 'autonext' && (audioInstance.duration - audioInstance.currentTime) < 15) {
            const idx = activeSurahsData.findIndex(s => s.id === playingSurahId);
            if (idx !== -1 && idx < activeSurahsData.length - 1) {
                const nextSurah = activeSurahsData[idx + 1];
                if (preloadedSurahId !== nextSurah.id) {
                    preloadAudioObj.src = nextSurah.url;
                    preloadAudioObj.preload = "auto";
                    preloadedSurahId = nextSurah.id;
                }
            }
        }
    }
};

function formatTime(s) { if(isNaN(s) || s === Infinity) return "00:00"; const m = Math.floor(s/60), sec = Math.floor(s%60); return `${m}:${sec < 10 ? '0'+sec : sec}`; }

let isDragging = false; 
let currentSeekPct = 0;
const progressContainer = document.getElementById('progress-container');

const seek = (e) => { 
    if (playingSurahId === 'radio') return currentSeekPct; 
    const rect = progressContainer.getBoundingClientRect(); 
    let clientX = 0;
    if (e.type.includes('touch')) {
        if (e.touches && e.touches.length > 0) clientX = e.touches[0].clientX;
        else if (e.changedTouches && e.changedTouches.length > 0) clientX = e.changedTouches[0].clientX;
    } else {
        clientX = e.clientX;
    }
    let pct = (clientX - rect.left) / rect.width; 
    pct = Math.max(0, Math.min(1, pct)); 
    document.getElementById('progress-bar-fill').style.width = (pct * 100) + '%'; 
    currentSeekPct = pct;
    return pct; 
};

progressContainer.addEventListener('mousedown', (e) => { if(playingSurahId==='radio') return; isDragging = true; seek(e); }); 
window.addEventListener('mousemove', (e) => { if (isDragging) seek(e); }); 
window.addEventListener('mouseup', (e) => { if (isDragging) { isDragging = false; if(audioInstance.duration && audioInstance.duration !== Infinity) audioInstance.currentTime = currentSeekPct * audioInstance.duration; } });

progressContainer.addEventListener('touchstart', (e) => { if(playingSurahId==='radio') return; isDragging = true; seek(e); }, {passive: false}); 
window.addEventListener('touchmove', (e) => { if (isDragging) seek(e); }, {passive: false}); 
window.addEventListener('touchend', (e) => { if (isDragging) { isDragging = false; if (e.changedTouches) seek(e); if(audioInstance.duration && audioInstance.duration !== Infinity) audioInstance.currentTime = currentSeekPct * audioInstance.duration; } }); 

progressContainer.addEventListener('click', (e) => { if(playingSurahId !== 'radio' && audioInstance.duration && audioInstance.duration !== Infinity) audioInstance.currentTime = seek(e) * audioInstance.duration; });

let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    setTimeout(() => {
        document.getElementById('install-banner').classList.add('show');
    }, 2000); 
});

document.getElementById('install-action-btn').addEventListener('click', async () => {
    if (deferredPrompt) {
        document.getElementById('install-banner').classList.remove('show');
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        deferredPrompt = null;
    }
});

window.addEventListener('appinstalled', () => {
    document.getElementById('install-banner').classList.remove('show');
    showToast(currentLang === 'ar' ? 'تم تثبيت التطبيق بنجاح!' : 'App installed successfully!');
});

if ('serviceWorker' in navigator) { window.addEventListener('load', () => { navigator.serviceWorker.register('sw.js').catch(err => console.log('SW failed')); }); }

(async () => {
    document.getElementById('theme-toggle-btn').innerHTML = currentTheme === 'dark' ? icons.moon : icons.sun;
    setPlaybackMode('autonext'); 
    
    let targetSheikh = 'husary'; 
    const savedState = JSON.parse(localStorage.getItem('lastPlayedQuran'));
    
    const urlParams = new URLSearchParams(window.location.search);
    const reciterFromUrl = urlParams.get('sheikh'); 
    const listenFromUrl = urlParams.get('listen');

    if (listenFromUrl === 'radio') {
        playingSurahId = 'radio';
        isRadioHeaderActive = true;
    } else if (reciterFromUrl && recitersList.some(r => r.id === reciterFromUrl)) {
        targetSheikh = reciterFromUrl;
        if(savedState && savedState.sheikh === targetSheikh) {
            savedReciterEditions[targetSheikh] = savedState.edition;
            playingSheikhId = savedState.sheikh; 
            playingEditionId = savedState.edition; 
            playingSurahId = savedState.surah; 
        }
    } else if (savedState && savedState.sheikh) { 
        targetSheikh = savedState.sheikh; 
        savedReciterEditions[targetSheikh] = savedState.edition; 
        playingSheikhId = savedState.sheikh; 
        playingEditionId = savedState.edition; 
        playingSurahId = savedState.surah; 
    } else if (savedState && savedState.surah === 'radio') {
        playingSurahId = 'radio';
    }
    
    await selectSheikh(targetSheikh);

    if (listenFromUrl === 'radio') {
        playRadio();
    }

    if (!localStorage.getItem('radioDiscovered')) {
        setTimeout(() => {
            document.getElementById('radio-tooltip').classList.add('show');
            document.getElementById('radio-badge').classList.add('show');
        }, 2500); 
    }

    if(savedState && savedState.surah && listenFromUrl !== 'radio') {
        if (savedState.surah === 'radio') {
            audioInstance.src = radioUrl;
            document.getElementById('global-player').style.display = 'block';
            document.getElementById('player-track-title').innerText = translations[currentLang].radioTitle;
            
            isRadioHeaderActive = true;
            updateHeaderUI();

            document.getElementById('progress-bar-fill').style.width = '100%';
            document.getElementById('progress-thumb').style.display = 'none';
            document.getElementById('time-separator').style.display = 'none';
            document.getElementById('curr-time').innerText = "";
            document.getElementById('total-time').innerText = translations[currentLang].live;
            syncUIWithAudioState();
        } else {
            const sData = activeSurahsData.find(s => s.id === savedState.surah);
            if(sData && audioInstance.src === "") {
                const sName = getSurahName(sData.id, sData.name);
                const promptText = currentLang === 'ar' ? `هل تود إكمال الاستماع إلى سورة ${sName}؟` : `Resume listening to Surah ${sName}?`;
                document.getElementById('resume-text').innerText = promptText;
                document.getElementById('resume-banner').classList.add('show');
                
                window.resumeData = { id: sData.id, url: sData.url };
                setTimeout(() => closeResumeBanner(), 15000);
            }
        }
    }
})();
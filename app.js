/* ================================================
   EGY QURAN — app.js (Upgraded)
   - const/let محسّنة
   - textContent بدلاً من innerText
   - localStorage محاط بـ try/catch
   - aria-* تُحدَّث لـ accessibility
   - inline styles مُزالة ومستبدلة بـ CSS classes
   - كود أكثر نظافة وأداءً
   ================================================ */

'use strict';

// ── دوال المساعدة ──

let toastTimeout;

function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toast.classList.remove('show'), 2200);
}

function safeLocalGet(key) {
    try { return JSON.parse(localStorage.getItem(key)); }
    catch { return null; }
}

function safeLocalSet(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); }
    catch { /* صامت — Incognito أو ممتلئ */ }
}

function safeLocalCheck(key) {
    try { return !!localStorage.getItem(key); }
    catch { return false; }
}

// ── التعامل مع بانر الاستئناف ──

function closeResumeBanner() {
    document.getElementById('resume-banner').classList.remove('show');
}

function resumePlayback() {
    closeResumeBanner();
    if (window.resumeData) {
        if (window.resumeData.id === 'radio') {
            playRadio();
        } else {
            playSurah(window.resumeData.id, window.resumeData.url);
        }
    }
}

// ── التعامل مع بانر التثبيت ──

function closeInstallBanner() {
    document.getElementById('install-banner').classList.remove('show');
}

// ── بيانات السور والقراء ──

const surahNamesEn = [
    "", "Al-Fatihah", "Al-Baqarah", "Ali 'Imran", "An-Nisa", "Al-Ma'idah", "Al-An'am",
    "Al-A'raf", "Al-Anfal", "At-Tawbah", "Yunus", "Hud", "Yusuf", "Ar-Ra'd", "Ibrahim",
    "Al-Hijr", "An-Nahl", "Al-Isra", "Al-Kahf", "Maryam", "Taha", "Al-Anbiya", "Al-Hajj",
    "Al-Mu'minun", "An-Nur", "Al-Furqan", "Ash-Shu'ara", "An-Naml", "Al-Qasas", "Al-'Ankabut",
    "Ar-Rum", "Luqman", "As-Sajdah", "Al-Ahzab", "Saba", "Fatir", "Ya-Sin", "As-Saffat", "Sad",
    "Az-Zumar", "Ghafir", "Fussilat", "Ash-Shura", "Az-Zukhruf", "Ad-Dukhan", "Al-Jathiyah",
    "Al-Ahqaf", "Muhammad", "Al-Fath", "Al-Hujurat", "Qaf", "Adh-Dhariyat", "At-Tur", "An-Najm",
    "Al-Qamar", "Ar-Rahman", "Al-Waqi'ah", "Al-Hadid", "Al-Mujadila", "Al-Hashr", "Al-Mumtahanah",
    "As-Saff", "Al-Jumu'ah", "Al-Munafiqun", "At-Taghabun", "At-Talaq", "At-Tahrim", "Al-Mulk",
    "Al-Qalam", "Al-Haqqah", "Al-Ma'arij", "Nuh", "Al-Jinn", "Al-Muzzammil", "Al-Muddaththir",
    "Al-Qiyamah", "Al-Insan", "Al-Mursalat", "An-Naba", "An-Nazi'at", "'Abasa", "At-Takwir",
    "Al-Infitar", "Al-Mutaffifin", "Al-Inshiqaq", "Al-Buruj", "At-Tariq", "Al-A'la", "Al-Ghashiyah",
    "Al-Fajr", "Al-Balad", "Ash-Shams", "Al-Layl", "Ad-Duhaa", "Ash-Sharh", "At-Tin", "Al-'Alaq",
    "Al-Qadr", "Al-Bayyinah", "Az-Zalzalah", "Al-'Adiyat", "Al-Qari'ah", "At-Takathur", "Al-'Asr",
    "Al-Humazah", "Al-Fil", "Quraysh", "Al-Ma'un", "Al-Kawthar", "Al-Kafirun", "An-Nasr",
    "Al-Masad", "Al-Ikhlas", "Al-Falaq", "An-Nas"
];

const translations = {
    ar: {
        langLabel: "EN",
        sheikhPrefix: "الشيخ",
        surahPrefix: "سورة",
        downloading: "جاري تحميل",
        downloadComplete: "تم التحميل بنجاح!",
        resumeBtn: "متابعة الاستماع",
        cancelBtn: "إلغاء",
        radioTitle: "إذاعة القرآن الكريم من القاهرة",
        live: "مباشر",
        installTitle: "تثبيت تطبيق Egy Quran",
        installDesc: "تجربة استماع أسرع وتعمل بدون إنترنت",
        installBtn: "تثبيت",
        radioTooltip: "إذاعة القرآن الكريم",
        focusOn: "تم تفعيل وضع الاستماع الهادئ",
        focusOff: "تم إيقاف وضع الاستماع الهادئ",
        installed: "تم تثبيت التطبيق بنجاح!",
        networkError: "خطأ في الاتصال، يرجى التحقق من الإنترنت",
        reconnected: "تمت استعادة الاتصال، جاري التشغيل...",
        disconnected: "انقطع الاتصال بالإنترنت",
    },
    en: {
        langLabel: "AR",
        sheikhPrefix: "Sheikh",
        surahPrefix: "Surah",
        downloading: "Downloading",
        downloadComplete: "Download Complete!",
        resumeBtn: "Resume Listening",
        cancelBtn: "Cancel",
        radioTitle: "Holy Quran Radio Cairo",
        live: "LIVE",
        installTitle: "Install Egy Quran App",
        installDesc: "Faster experience with offline support",
        installBtn: "Install",
        radioTooltip: "Holy Quran Radio",
        focusOn: "Focus Mode Enabled",
        focusOff: "Focus Mode Disabled",
        installed: "App installed successfully!",
        networkError: "Network error, please check connection",
        reconnected: "Connection restored, playing...",
        disconnected: "Internet connection lost",
    }
};

let currentLang = 'ar';
const radioUrl = "https://stream.radiojar.com/8s5u5tpdtwzuv";

const recitersList = [
    { id: "husary",   nameAr: "محمود خليل الحصري",       nameEn: "Mahmoud Khalil Al-Husary",  image: "hosary.jpg" },
    { id: "minshawi", nameAr: "محمد صديق المنشاوي",      nameEn: "Muhammad Siddiq Minshawi",  image: "minshawy.jpg" },
    { id: "mustafa",  nameAr: "مصطفى إسماعيل",           nameEn: "Mustafa Ismail",            image: "mustafa.jpg" },
    { id: "banna",    nameAr: "محمود علي البنا",          nameEn: "Mahmoud Ali Al-Banna",      image: "banna.jpg" },
    { id: "basit",    nameAr: "عبد الباسط عبد الصمد",    nameEn: "Abdul Basit Abdul Samad",   image: "basit.jpg" }
];

const editionsConfig = {
    husary: {
        1: { pillAr: "حفص (الإذاعة)", pillEn: "Hafs (Radio)", file: "husary_1.json", descAr: "الإذاعة المصرية",            descEn: "Egyptian Radio" },
        2: { pillAr: "ورش",           pillEn: "Warsh",         file: "husary_2.json", descAr: "رواية ورش عن نافع",         descEn: "Warsh A'n Nafi'" },
        3: { pillAr: "قالون",         pillEn: "Qalun",         file: "husary_3.json", descAr: "رواية قالون عن نافع",       descEn: "Qalun A'n Nafi'" },
        4: { pillAr: "الدوري",        pillEn: "Al-Duri",       file: "husary_4.json", descAr: "رواية الدوري عن أبي عمرو",  descEn: "Al-Duri A'n Abi Amr" },
        5: { pillAr: "المجود",        pillEn: "Mujawwad",      file: "husary_5.json", descAr: "التلاوة المجودة",           descEn: "Mujawwad Recitation" }
    },
    minshawi: {
        1: { pillAr: "حفص (الإذاعة)",  pillEn: "Hafs (Radio)", file: "minshawi_1.json", descAr: "الإذاعة المصرية",               descEn: "Egyptian Radio" },
        2: { pillAr: "الختمة الثانية", pillEn: "2nd Khatma",   file: "minshawi_2.json", descAr: "الختمة الثانية (المفقودة)",      descEn: "The Second Khatma (Lost)" },
        3: { pillAr: "المعلم",         pillEn: "Mu'allim",     file: "minshawi_3.json", descAr: "المصحف المعلم",                 descEn: "Al-Mushaf Al-Mu'allim" },
        4: { pillAr: "المجود",         pillEn: "Mujawwad",     file: "minshawi_4.json", descAr: "التلاوة المجودة",               descEn: "Mujawwad Recitation" }
    },
    mustafa: {
        1: { pillAr: "حفص (الإذاعة)", pillEn: "Hafs (Radio)", file: "mustafa_1.json", descAr: "الإذاعة المصرية",  descEn: "Egyptian Radio" },
        2: { pillAr: "المجود",        pillEn: "Mujawwad",     file: "mustafa_2.json", descAr: "التلاوة المجودة",  descEn: "Mujawwad Recitation" }
    },
    banna: {
        1: { pillAr: "حفص (الإذاعة)", pillEn: "Hafs (Radio)", file: "banna_1.json", descAr: "الإذاعة المصرية",  descEn: "Egyptian Radio" },
        2: { pillAr: "المجود",        pillEn: "Mujawwad",     file: "banna_2.json", descAr: "التلاوة المجودة",  descEn: "Mujawwad Recitation" }
    },
    basit: {
        1: { pillAr: "حفص (الإذاعة)", pillEn: "Hafs (Radio)", file: "basit_1.json", descAr: "الإذاعة المصرية",    descEn: "Egyptian Radio" },
        2: { pillAr: "ورش",           pillEn: "Warsh",        file: "basit_2.json", descAr: "رواية ورش عن نافع",  descEn: "Warsh A'n Nafi'" },
        3: { pillAr: "المجود",        pillEn: "Mujawwad",     file: "basit_3.json", descAr: "التلاوة المجودة",    descEn: "Mujawwad Recitation" }
    }
};

// ── الأيقونات ──

const icons = {
    play:     '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>',
    pause:    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>',
    loading:  '<svg class="loading-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/></svg>',
    sun:      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>',
    moon:     '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
    download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>'
};

// ── المشغل الصوتي ──

const audioInstance = new Audio();
audioInstance.crossOrigin = "anonymous";

// تضخيم الصوت عبر Web Audio API
let audioCtx, gainNode, audioSource;

function initAudioBoost() {
    try {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            audioCtx = new AudioContext();
            audioSource = audioCtx.createMediaElementSource(audioInstance);
            gainNode = audioCtx.createGain();
            gainNode.gain.value = 2.8; // تضخيم معتدل (280%) — أقل تشويهاً من 350%
            audioSource.connect(gainNode);
            gainNode.connect(audioCtx.destination);
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume().catch(e => console.warn("AudioContext resume:", e));
        }
    } catch (e) {
        console.warn("Web Audio API:", e);
    }
}

// ── حالة التطبيق ──

let currentTheme       = 'light';
let currentSheikhId    = 'husary';
let currentEdition     = 1;
let activeSurahsData   = [];
let playingSurahId     = null;
let playingSheikhId    = null;
let playingEditionId   = null;
let isBuffering        = false;
let isRadioHeaderActive = false;
let isFocusMode        = false;
let playbackMode       = 'autonext';
let playbackMenuOpen   = false;
let savedReciterEditions = {};
let activeDownloads    = {};

const preloadAudioObj = new Audio();
let preloadedSurahId  = null;

// ── دوال المساعدة ──

function getSurahName(id, nameAr) {
    return currentLang === 'ar' ? nameAr : (surahNamesEn[id] || nameAr);
}

function formatTime(s) {
    if (isNaN(s) || s === Infinity) return "00:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec < 10 ? '0' + sec : sec}`;
}

// ── تحديث واجهة الرأس ──

function updateHeaderUI() {
    const avatarImg = document.getElementById('header-avatar-img');
    const mainTitle = document.getElementById('main-title');
    const subtitle  = document.getElementById('header-subtitle');

    if (isFocusMode && (playingSheikhId || playingSurahId === 'radio')) {
        if (playingSurahId === 'radio') {
            avatarImg.src = 'radio.png';
            avatarImg.alt = translations[currentLang].radioTitle;
            mainTitle.innerHTML = `<strong>${translations[currentLang].radioTitle}</strong>`;
            subtitle.textContent = translations[currentLang].live;
        } else {
            const s = recitersList.find(r => r.id === playingSheikhId);
            if (s) {
                avatarImg.src = s.image;
                avatarImg.alt = currentLang === 'ar' ? s.nameAr : s.nameEn;
                mainTitle.innerHTML = `${translations[currentLang].sheikhPrefix} <strong>${currentLang === 'ar' ? s.nameAr : s.nameEn}</strong>`;
                subtitle.textContent = currentLang === 'ar'
                    ? editionsConfig[playingSheikhId][playingEditionId].descAr
                    : editionsConfig[playingSheikhId][playingEditionId].descEn;
            }
        }
    } else {
        if (isRadioHeaderActive) {
            avatarImg.src = 'radio.png';
            avatarImg.alt = translations[currentLang].radioTitle;
            mainTitle.innerHTML = `<strong>${translations[currentLang].radioTitle}</strong>`;
            subtitle.textContent = translations[currentLang].live;
        } else {
            const s = recitersList.find(r => r.id === currentSheikhId);
            if (s) {
                avatarImg.src = s.image;
                avatarImg.alt = currentLang === 'ar' ? s.nameAr : s.nameEn;
                mainTitle.innerHTML = `${translations[currentLang].sheikhPrefix} <strong>${currentLang === 'ar' ? s.nameAr : s.nameEn}</strong>`;
                subtitle.textContent = currentLang === 'ar'
                    ? editionsConfig[currentSheikhId][currentEdition].descAr
                    : editionsConfig[currentSheikhId][currentEdition].descEn;
            }
        }
    }
}

// ── تغيير اللغة ──

function toggleLanguage() {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    const dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = currentLang;
    document.documentElement.style.setProperty('--dir', dir);

    document.getElementById('lang-label').textContent       = translations[currentLang].langLabel;
    document.getElementById('resume-btn-yes').textContent   = translations[currentLang].resumeBtn;
    document.getElementById('resume-btn-no').textContent    = translations[currentLang].cancelBtn;
    document.getElementById('install-title').textContent    = translations[currentLang].installTitle;
    document.getElementById('install-desc').textContent     = translations[currentLang].installDesc;
    document.getElementById('install-action-btn').textContent = translations[currentLang].installBtn;
    document.getElementById('radio-tooltip').textContent    = translations[currentLang].radioTooltip;

    updateHeaderUI();
    setPlaybackMode(playbackMode);

    if (playingSurahId === 'radio') {
        document.getElementById('player-track-title').textContent = translations[currentLang].radioTitle;
        document.getElementById('total-time').textContent = translations[currentLang].live;
    } else if (playingSurahId) {
        const sData = activeSurahsData.find(s => s.id === playingSurahId);
        if (sData) {
            document.getElementById('player-track-title').textContent =
                `${translations[currentLang].surahPrefix} ${getSurahName(sData.id, sData.name)}`;
        }
    }

    renderSheikhCarousel();
    renderEditionDropdown();
    if (activeSurahsData.length > 0) renderSurahsList();
    updatePageMeta();
}

// ── تحديث الـ SEO ديناميكياً ──

function updatePageMeta() {
    const metaDesc = document.querySelector('meta[name="description"]');
    if (isRadioHeaderActive || playingSurahId === 'radio') {
        document.title = `Egy Quran - ${translations[currentLang].radioTitle}`;
        if (metaDesc) metaDesc.setAttribute("content",
            currentLang === 'ar'
                ? "استمع إلى البث المباشر لإذاعة القرآن الكريم من القاهرة على منصة Egy Quran."
                : "Listen to the live broadcast of Holy Quran Radio Cairo on Egy Quran."
        );
    } else {
        const s = recitersList.find(r => r.id === currentSheikhId);
        if (s) {
            const name = currentLang === 'ar' ? s.nameAr : s.nameEn;
            document.title = `Egy Quran - ${currentLang === 'ar' ? 'الشيخ' : 'Sheikh'} ${name}`;
            if (metaDesc) metaDesc.setAttribute("content",
                currentLang === 'ar'
                    ? `استمع وحمل القرآن الكريم كاملاً بصوت الشيخ ${name} بجودة عالية على Egy Quran.`
                    : `Listen and download the complete Holy Quran by Sheikh ${name} in high quality on Egy Quran.`
            );
        }
    }
}

// ── تبديل المظهر ──

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.body.className = currentTheme === 'dark' ? 'dark-theme' : '';
    document.getElementById('theme-toggle-btn').innerHTML =
        currentTheme === 'dark' ? icons.moon : icons.sun;
    document.getElementById('theme-toggle-btn').setAttribute(
        'aria-label', currentTheme === 'dark' ? 'التبديل إلى الوضع الفاتح' : 'التبديل إلى الوضع الداكن'
    );
}

// ── وضع الاستماع الهادئ ──

function toggleFocusMode() {
    isFocusMode = !isFocusMode;
    const focusBtn = document.getElementById('focus-toggle-btn');
    document.body.classList.toggle('focus-mode-active', isFocusMode);

    if (isFocusMode) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        focusBtn?.classList.add('active-feature');
        focusBtn?.setAttribute('aria-pressed', 'true');
        showToast(translations[currentLang].focusOn);
    } else {
        focusBtn?.classList.remove('active-feature');
        focusBtn?.setAttribute('aria-pressed', 'false');
        showToast(translations[currentLang].focusOff);
    }

    updateHeaderUI();
    syncUIWithAudioState();
}

// ── قائمة وضع التشغيل ──

function togglePlaybackMenu(event) {
    event?.stopPropagation();
    playbackMenuOpen = !playbackMenuOpen;
    const menu = document.getElementById('playback-menu');
    const btn  = document.getElementById('btn-playback-mode');
    menu.classList.toggle('show', playbackMenuOpen);
    btn?.setAttribute('aria-expanded', playbackMenuOpen ? 'true' : 'false');
}

document.addEventListener('click', (e) => {
    if (playbackMenuOpen && !e.target.closest('#playback-wrapper')) {
        togglePlaybackMenu();
    }
});

function setPlaybackMode(mode, event) {
    event?.stopPropagation();
    playbackMode = mode;
    audioInstance.loop = (mode === 'loop');

    const btn      = document.getElementById('btn-playback-mode');
    const textSpan = document.getElementById('playback-text');
    const iconSvg  = document.getElementById('playback-icon');

    const modeMap = {
        autonext: {
            active: true,
            textAr: 'تلقائي', textEn: 'Auto',
            icon: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>'
        },
        loop: {
            active: true,
            textAr: 'تكرار', textEn: 'Loop',
            icon: '<polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>'
        },
        off: {
            active: false,
            textAr: 'إيقاف', textEn: 'Off',
            icon: '<circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>'
        }
    };

    const cfg = modeMap[mode] || modeMap.off;
    btn?.classList.toggle('active-feature', cfg.active);
    if (textSpan) textSpan.textContent = currentLang === 'ar' ? cfg.textAr : cfg.textEn;
    if (iconSvg) iconSvg.innerHTML = cfg.icon;

    renderPlaybackMenu();
    if (playbackMenuOpen) togglePlaybackMenu();
}

function renderPlaybackMenu() {
    const menu = document.getElementById('playback-menu');
    if (!menu) return;
    const items = [
        { id: 'autonext', textAr: 'تشغيل تلقائي', textEn: 'Auto-Next' },
        { id: 'loop',     textAr: 'تكرار السورة',  textEn: 'Loop Surah' },
        { id: 'off',      textAr: 'إيقاف',          textEn: 'Off' }
    ];
    menu.innerHTML = items.map(item => `
        <div class="playback-menu-item ${playbackMode === item.id ? 'active' : ''}"
             role="menuitem"
             onclick="setPlaybackMode('${item.id}', event)">
            ${currentLang === 'ar' ? item.textAr : item.textEn}
        </div>
    `).join('');
}

// ── مزامنة واجهة المشغل مع حالة الصوت ──

function syncUIWithAudioState() {
    const isPlaying = !audioInstance.paused;
    const statusIcon = isBuffering ? icons.loading : (isPlaying ? icons.pause : icons.play);
    const playBtn = document.getElementById('player-play-btn');
    if (playBtn) {
        playBtn.innerHTML = statusIcon;
        playBtn.setAttribute('aria-label', isPlaying ? 'إيقاف مؤقت' : 'تشغيل');
    }

    // زر الراديو
    const radioBtn = document.getElementById('radio-btn');
    if (radioBtn) {
        radioBtn.classList.toggle(
            'radio-active',
            playingSurahId === 'radio' && isPlaying && !isBuffering
        );
    }

    // المعادل الصوتي في الرأس
    const isHeaderMatchingPlaying =
        isFocusMode ||
        (playingSurahId === 'radio' && isRadioHeaderActive) ||
        (playingSurahId !== 'radio' && currentSheikhId === playingSheikhId && currentEdition == playingEditionId);

    const headerEq = document.getElementById('header-equalizer');
    if (headerEq) {
        headerEq.classList.toggle('playing', isPlaying && !isBuffering && isHeaderMatchingPlaying);
    }

    // تحديث صفوف السور
    document.querySelectorAll('.surah-row').forEach(row => {
        const sId = parseInt(row.getAttribute('data-id'));
        const playBtn = row.querySelector('.play-cell');
        const isActive = (
            sId === playingSurahId &&
            playingSurahId !== 'radio' &&
            currentSheikhId === playingSheikhId &&
            currentEdition === playingEditionId
        );
        row.classList.toggle('active-row', isActive);
        if (playBtn) {
            playBtn.innerHTML = isActive
                ? (isBuffering ? icons.loading : (isPlaying ? icons.pause : icons.play))
                : icons.play;
        }
    });

    // شارة التشغيل على القارئ النشط
    document.querySelectorAll('.sheikh-item').forEach(item => {
        const sId = item.getAttribute('data-id');
        const container = item.querySelector('.sheikh-avatar-container');
        let badge = item.querySelector('.playing-badge');
        const shouldShow = sId === playingSheikhId && isPlaying && !isBuffering && playingSurahId !== 'radio';

        if (shouldShow && !badge && container) {
            container.insertAdjacentHTML('beforeend',
                `<div class="playing-badge" aria-hidden="true">
                    <div class="equalizer-bar" style="animation:equalize 0.8s infinite alternate"></div>
                    <div class="equalizer-bar" style="animation:equalize 0.5s infinite alternate;animation-delay:0.1s"></div>
                    <div class="equalizer-bar" style="animation:equalize 0.7s infinite alternate;animation-delay:0.2s"></div>
                </div>`
            );
        } else if (!shouldShow && badge) {
            badge.remove();
        }
    });

    // النقطة على رواية التشغيل
    document.querySelectorAll('.edition-pill').forEach(pill => {
        const pillKey = pill.getAttribute('data-key');
        const isActive = (
            currentSheikhId === playingSheikhId &&
            pillKey == playingEditionId &&
            isPlaying && !isBuffering &&
            playingSurahId !== 'radio'
        );
        let dot = pill.querySelector('.active-dot');
        if (isActive && !dot) {
            pill.insertAdjacentHTML('beforeend', `<span class="active-dot" aria-hidden="true"></span>`);
        } else if (!isActive && dot) {
            dot.remove();
        }
    });
}

// ── تحميل بيانات الطبعة ──

async function loadEditionData(sheikhId, editionNum) {
    const config = editionsConfig[sheikhId]?.[editionNum];
    if (!config) return;

    const cacheKey = `cache_${config.file}`;
    const cached = safeLocalGet(cacheKey);
    if (cached) {
        activeSurahsData = cached;
        renderSurahsList();
    }

    try {
        const res = await fetch(config.file);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        activeSurahsData = data;
        safeLocalSet(cacheKey, data);
        renderSurahsList();
    } catch (e) {
        console.error("تعذّر تحميل بيانات الطبعة:", e);
    }
}

// ── رسم قائمة القراء ──

function renderSheikhCarousel() {
    const carousel = document.getElementById('sheikh-carousel');
    if (!carousel) return;

    carousel.innerHTML = recitersList.map(s => {
        const name = currentLang === 'ar' ? s.nameAr : s.nameEn;
        return `
            <div class="sheikh-item ${s.id === currentSheikhId ? 'active' : ''}"
                 data-id="${s.id}"
                 onclick="selectSheikh('${s.id}')"
                 role="listitem"
                 tabindex="0"
                 aria-label="${name}"
                 onkeydown="if(event.key==='Enter'||event.key===' ')selectSheikh('${s.id}')">
                <div class="sheikh-avatar-container">
                    <img src="${s.image}" class="sheikh-avatar-img" alt="${name}" loading="lazy">
                </div>
                <div class="sheikh-name">${name}</div>
            </div>
        `;
    }).join('');

    syncUIWithAudioState();
}

// ── رسم قائمة السور ──

function renderSurahsList() {
    const container = document.getElementById('main-surah-list');
    if (!container) return;

    container.innerHTML = activeSurahsData.map(s => {
        const surahName = getSurahName(s.id, s.name);
        const actionsDir = currentLang === 'ar' ? 'row' : 'row-reverse';
        return `
            <div class="surah-row" data-id="${s.id}">
                <div class="surah-info">
                    <span class="surah-number">${String(s.id).padStart(3, '0')}</span>
                    <span class="surah-name">${translations[currentLang].surahPrefix} ${surahName}</span>
                </div>
                <div class="surah-actions" style="flex-direction:${actionsDir}">
                    <button class="surah-action-btn play-cell"
                            onclick="playSurah(${s.id}, '${s.url}')"
                            aria-label="تشغيل ${surahName}">
                        ${icons.play}
                    </button>
                    <button class="surah-action-btn"
                            onclick="startDownload(${s.id}, '${s.url}')"
                            aria-label="تحميل ${surahName}">
                        ${icons.download}
                    </button>
                </div>
            </div>
        `;
    }).join('');

    syncUIWithAudioState();
}

// ── التحميل ──

const dlModal = document.getElementById('download-modal');
const dlFill  = document.getElementById('dl-progress-fill');
const dlPct   = document.getElementById('dl-modal-pct');
const dlTitle = document.getElementById('dl-modal-title');
const dlTrack = document.querySelector('.dl-progress-track');

async function startDownload(id, url) {
    if (activeDownloads[id]) return;
    activeDownloads[id] = true;

    const sData = activeSurahsData.find(s => s.id === id);
    const sName = getSurahName(id, sData.name);

    if (dlModal) dlModal.style.display = 'flex';
    if (dlFill)  dlFill.style.width = '0%';
    if (dlPct)   dlPct.textContent = '0%';
    if (dlTitle) dlTitle.textContent = `${translations[currentLang].downloading} ${sName}...`;
    if (dlTrack) dlTrack.setAttribute('aria-valuenow', '0');

    try {
        const response = await fetch(url, { mode: 'cors' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const total = parseInt(response.headers.get('content-length'), 10);
        const reader = response.body.getReader();
        let received = 0;
        const chunks = [];

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(value);
            received += value.length;

            if (total) {
                const pct = Math.round((received / total) * 100);
                if (dlFill)  dlFill.style.width = pct + '%';
                if (dlPct)   dlPct.textContent = pct + '%';
                if (dlTrack) dlTrack.setAttribute('aria-valuenow', pct);
            }
        }

        const blob = new Blob(chunks, { type: 'audio/mpeg' });
        const objectUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = objectUrl;
        a.download = `${translations[currentLang].surahPrefix}_${sName}.mp3`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(objectUrl);
        finishDownloadUI(id);
    } catch {
        // fallback: فتح الرابط مباشرة
        const a = document.createElement('a');
        a.href = url;
        a.download = `${translations[currentLang].surahPrefix}_${sName}.mp3`;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        finishDownloadUI(id);
    }
}

function finishDownloadUI(id) {
    if (dlTitle) dlTitle.textContent = translations[currentLang].downloadComplete;
    if (dlFill)  dlFill.style.width = '100%';
    if (dlPct)   dlPct.textContent = '100%';
    if (dlTrack) dlTrack.setAttribute('aria-valuenow', '100');
    setTimeout(() => {
        if (dlModal) dlModal.style.display = 'none';
        delete activeDownloads[id];
    }, 1600);
}

// ── اختيار القارئ ──

async function selectSheikh(id) {
    currentSheikhId = id;
    isRadioHeaderActive = false;

    currentEdition = (id === playingSheikhId && playingEditionId && editionsConfig[id][playingEditionId])
        ? playingEditionId
        : (savedReciterEditions[id] || 1);

    const s = recitersList.find(r => r.id === id);
    if (!s) return;

    updatePageMeta();

    const newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?sheikh=${id}`;
    window.history.pushState({ path: newUrl }, '', newUrl);

    updateHeaderUI();
    renderSheikhCarousel();
    renderEditionDropdown();
    await loadEditionData(id, currentEdition);

    // استعادة حالة المشغل إن كان مقطوعاً
    if (playingSurahId && playingSurahId !== 'radio' && playingSheikhId === id && playingEditionId === currentEdition) {
        const sData = activeSurahsData.find(sur => sur.id === playingSurahId);
        if (sData && !audioInstance.src) {
            audioInstance.src = sData.url;
            const player = document.getElementById('global-player');
            if (player) player.style.display = 'block';
            const trackTitle = document.getElementById('player-track-title');
            if (trackTitle) trackTitle.textContent =
                `${translations[currentLang].surahPrefix} ${getSurahName(sData.id, sData.name)}`;
            syncUIWithAudioState();
        }
    }
}

// ── رسم الروايات ──

function renderEditionDropdown() {
    const wrapper = document.getElementById('edition-dropdown-wrapper');
    if (!wrapper) return;

    const configs = editionsConfig[currentSheikhId];
    const pills = Object.keys(configs).map(key => `
        <div class="edition-pill ${currentEdition == key ? 'active' : ''}"
             data-key="${key}"
             onclick="selectEditionDropdown(${key}, event)"
             role="button"
             tabindex="0"
             onkeydown="if(event.key==='Enter'||event.key===' ')selectEditionDropdown(${key},event)">
            ${currentLang === 'ar' ? configs[key].pillAr : configs[key].pillEn}
        </div>
    `).join('');

    wrapper.innerHTML = `<div class="edition-list-wrapper"><div class="edition-list">${pills}</div></div>`;
    syncUIWithAudioState();
}

async function selectEditionDropdown(num, event) {
    event?.stopPropagation();
    if (currentEdition == num) return;

    currentEdition = num;
    savedReciterEditions[currentSheikhId] = num;
    isRadioHeaderActive = false;

    updateHeaderUI();
    renderEditionDropdown();
    await loadEditionData(currentSheikhId, num);
}

// ── الراديو ──

function hideRadioDiscovery() {
    document.getElementById('radio-tooltip')?.classList.remove('show');
    document.getElementById('radio-badge')?.classList.remove('show');
    safeLocalSet('radioDiscovered', true);
}

function playRadio() {
    hideRadioDiscovery();
    initAudioBoost();

    if (playingSurahId === 'radio') { togglePlayPause(); return; }

    playingSurahId    = 'radio';
    playingSheikhId   = null;
    playingEditionId  = null;
    isBuffering       = true;

    audioInstance.pause();
    audioInstance.src  = radioUrl;
    audioInstance.loop = false;
    audioInstance.load();

    audioInstance.play().catch(e => {
        console.warn("Radio play error:", e);
        isBuffering = false;
        syncUIWithAudioState();
    });

    safeLocalSet('lastPlayedQuran', { sheikh: null, edition: null, surah: 'radio' });

    const player = document.getElementById('global-player');
    if (player) player.style.display = 'block';
    const trackTitle = document.getElementById('player-track-title');
    if (trackTitle) trackTitle.textContent = translations[currentLang].radioTitle;

    isRadioHeaderActive = true;
    updateHeaderUI();
    updatePageMeta();

    const newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?listen=radio`;
    window.history.pushState({ path: newUrl }, '', newUrl);

    // إخفاء شريط التقدم للراديو
    const fill   = document.getElementById('progress-bar-fill');
    const thumb  = document.getElementById('progress-thumb');
    const sep    = document.getElementById('time-separator');
    const curr   = document.getElementById('curr-time');
    const total  = document.getElementById('total-time');
    if (fill)  fill.style.width = '100%';
    if (thumb) thumb.style.display = 'none';
    if (sep)   sep.style.display = 'none';
    if (curr)  curr.textContent = '';
    if (total) total.textContent = translations[currentLang].live;

    syncUIWithAudioState();

    if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: translations[currentLang].radioTitle,
            artist: translations[currentLang].live,
            album: 'Egy Quran',
            artwork: [{ src: 'radio.png', sizes: '512x512', type: 'image/png' }]
        });
        navigator.mediaSession.setActionHandler('play',          () => togglePlayPause());
        navigator.mediaSession.setActionHandler('pause',         () => togglePlayPause());
        navigator.mediaSession.setActionHandler('previoustrack', null);
        navigator.mediaSession.setActionHandler('nexttrack',     null);
        navigator.mediaSession.setActionHandler('seekto',        null);
    }
}

// ── تشغيل سورة ──

function playSurah(id, url) {
    initAudioBoost();

    // نفس السورة — بدّل تشغيل/إيقاف
    if (playingSurahId === id && playingSheikhId === currentSheikhId && playingEditionId === currentEdition) {
        togglePlayPause();
        return;
    }

    isRadioHeaderActive = false;
    playingSurahId      = id;
    playingSheikhId     = currentSheikhId;
    playingEditionId    = currentEdition;
    isBuffering         = true;

    audioInstance.pause();
    audioInstance.src  = url;
    audioInstance.loop = (playbackMode === 'loop');
    audioInstance.load();

    audioInstance.play().catch(e => {
        console.warn("Surah play error:", e);
        isBuffering = false;
        syncUIWithAudioState();
    });

    safeLocalSet('lastPlayedQuran', {
        sheikh: playingSheikhId,
        edition: playingEditionId,
        surah: playingSurahId
    });

    const sData     = activeSurahsData.find(s => s.id === id);
    const sName     = getSurahName(id, sData?.name);
    const sheikhObj = recitersList.find(r => r.id === currentSheikhId);

    const player = document.getElementById('global-player');
    if (player) player.style.display = 'block';
    const trackTitle = document.getElementById('player-track-title');
    if (trackTitle) trackTitle.textContent = `${translations[currentLang].surahPrefix} ${sName}`;

    // إظهار مقبض الشريط
    const thumb = document.getElementById('progress-thumb');
    const sep   = document.getElementById('time-separator');
    if (thumb) thumb.style.display = 'block';
    if (sep)   sep.style.display = 'inline';

    updateHeaderUI();
    syncUIWithAudioState();

    if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title:   `${translations[currentLang].surahPrefix} ${sName}`,
            artist:  currentLang === 'ar' ? sheikhObj?.nameAr : sheikhObj?.nameEn,
            album:   'مصحف كبار القراء',
            artwork: [{ src: sheikhObj?.image || 'icon.png', sizes: '512x512', type: 'image/jpeg' }]
        });
        navigator.mediaSession.setActionHandler('play',          () => togglePlayPause());
        navigator.mediaSession.setActionHandler('pause',         () => togglePlayPause());
        navigator.mediaSession.setActionHandler('previoustrack', () => playPrevious());
        navigator.mediaSession.setActionHandler('nexttrack',     () => playNext());
        navigator.mediaSession.setActionHandler('seekto',        (d) => { audioInstance.currentTime = d.seekTime; });
    }
}

// ── التحكم الأساسي ──

function togglePlayPause() {
    initAudioBoost();

    if (audioInstance.paused && audioInstance.src) {
        isBuffering = true;
        syncUIWithAudioState();

        if (playingSurahId === 'radio') {
            audioInstance.pause();
            audioInstance.src = radioUrl;
            audioInstance.load();
        }

        audioInstance.play().catch(e => {
            console.warn("Play error:", e);
            isBuffering = false;
            syncUIWithAudioState();
        });
    } else {
        audioInstance.pause();
    }
}

function playNext() {
    if (playingSurahId === 'radio') return;
    const idx = activeSurahsData.findIndex(s => s.id === playingSurahId);
    if (idx !== -1 && idx < activeSurahsData.length - 1) {
        const next = activeSurahsData[idx + 1];
        playSurah(next.id, next.url);
    }
}

function playPrevious() {
    if (playingSurahId === 'radio') return;
    const idx = activeSurahsData.findIndex(s => s.id === playingSurahId);
    if (idx > 0) {
        const prev = activeSurahsData[idx - 1];
        playSurah(prev.id, prev.url);
    }
}

// ── أحداث المشغل ──

audioInstance.addEventListener('waiting', () => { isBuffering = true;  syncUIWithAudioState(); });
audioInstance.addEventListener('playing', () => { isBuffering = false; syncUIWithAudioState(); });
audioInstance.addEventListener('play',    () => { isBuffering = true;  syncUIWithAudioState(); });
audioInstance.addEventListener('pause',   () => { isBuffering = false; syncUIWithAudioState(); });

audioInstance.addEventListener('error', () => {
    isBuffering = !navigator.onLine;
    syncUIWithAudioState();
    showToast(translations[currentLang].networkError);
});

audioInstance.addEventListener('ended', () => {
    if (playbackMode === 'autonext' && playingSurahId !== 'radio') {
        playNext();
    }
});

// ── تحديث شريط التقدم ──

audioInstance.addEventListener('timeupdate', () => {
    const fill  = document.getElementById('progress-bar-fill');
    const curr  = document.getElementById('curr-time');
    const total = document.getElementById('total-time');

    if (playingSurahId === 'radio') {
        if (fill)  fill.style.width = '100%';
        if (curr)  curr.textContent = '';
        if (total) total.textContent = translations[currentLang].live;
    } else if (audioInstance.duration && !isDragging) {
        const pct = (audioInstance.currentTime / audioInstance.duration) * 100;
        if (fill)  fill.style.width = pct + '%';
        if (curr)  curr.textContent = formatTime(audioInstance.currentTime);
        if (total) total.textContent = formatTime(audioInstance.duration);

        // تحديث aria
        const progressContainer = document.getElementById('progress-container');
        if (progressContainer) progressContainer.setAttribute('aria-valuenow', Math.round(pct));

        // تحميل مسبق للسورة التالية
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
});

// ── أحداث الشبكة ──

window.addEventListener('online', () => {
    if (isBuffering && playingSurahId && !audioInstance.paused) {
        audioInstance.load();
        audioInstance.play().catch(console.warn);
        showToast(translations[currentLang].reconnected);
    }
});

window.addEventListener('offline', () => {
    if (!audioInstance.paused || isBuffering) {
        isBuffering = true;
        syncUIWithAudioState();
        showToast(translations[currentLang].disconnected);
    }
});

// ── شريط التقدم — سحب وإفلات ──

let isDragging = false;
let currentSeekPct = 0;
const progressContainer = document.getElementById('progress-container');

const seek = (e) => {
    if (playingSurahId === 'radio') return currentSeekPct;
    const rect = progressContainer.getBoundingClientRect();
    let clientX = 0;

    if (e.type.includes('touch')) {
        clientX = e.touches?.[0]?.clientX ?? e.changedTouches?.[0]?.clientX ?? 0;
    } else {
        clientX = e.clientX;
    }

    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const fill = document.getElementById('progress-bar-fill');
    if (fill) fill.style.width = (pct * 100) + '%';
    currentSeekPct = pct;
    return pct;
};

if (progressContainer) {
    progressContainer.addEventListener('mousedown', (e) => { if (playingSurahId === 'radio') return; isDragging = true; seek(e); });
    progressContainer.addEventListener('touchstart', (e) => { if (playingSurahId === 'radio') return; isDragging = true; seek(e); }, { passive: false });
    progressContainer.addEventListener('click', (e) => {
        if (playingSurahId !== 'radio' && audioInstance.duration && audioInstance.duration !== Infinity) {
            audioInstance.currentTime = seek(e) * audioInstance.duration;
        }
    });
}

window.addEventListener('mousemove', (e) => { if (isDragging) seek(e); });
window.addEventListener('touchmove', (e) => { if (isDragging) seek(e); }, { passive: false });

window.addEventListener('mouseup', (e) => {
    if (isDragging) {
        isDragging = false;
        if (audioInstance.duration && audioInstance.duration !== Infinity) {
            audioInstance.currentTime = currentSeekPct * audioInstance.duration;
        }
    }
});

window.addEventListener('touchend', (e) => {
    if (isDragging) {
        isDragging = false;
        if (e.changedTouches) seek(e);
        if (audioInstance.duration && audioInstance.duration !== Infinity) {
            audioInstance.currentTime = currentSeekPct * audioInstance.duration;
        }
    }
});

// ── تثبيت التطبيق (PWA) ──

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    setTimeout(() => {
        document.getElementById('install-banner')?.classList.add('show');
    }, 2500);
});

document.getElementById('install-action-btn')?.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    document.getElementById('install-banner')?.classList.remove('show');
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
});

window.addEventListener('appinstalled', () => {
    document.getElementById('install-banner')?.classList.remove('show');
    showToast(translations[currentLang].installed);
});

// ── Service Worker ──

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').catch(() => {});
    });
}

// ── التهيئة الأولى ──

(async () => {
    // ضبط أيقونة الثيم
    document.getElementById('theme-toggle-btn').innerHTML = currentTheme === 'dark' ? icons.moon : icons.sun;

    setPlaybackMode('autonext');

    let targetSheikh = 'husary';
    const savedState = safeLocalGet('lastPlayedQuran');
    const urlParams  = new URLSearchParams(window.location.search);
    const reciterFromUrl = urlParams.get('sheikh');
    const listenFromUrl  = urlParams.get('listen');

    if (listenFromUrl === 'radio') {
        playingSurahId = 'radio';
        isRadioHeaderActive = true;
    } else if (reciterFromUrl && recitersList.some(r => r.id === reciterFromUrl)) {
        targetSheikh = reciterFromUrl;
        if (savedState?.sheikh === targetSheikh) {
            savedReciterEditions[targetSheikh] = savedState.edition;
            playingSheikhId  = savedState.sheikh;
            playingEditionId = savedState.edition;
            playingSurahId   = savedState.surah;
        }
    } else if (savedState?.sheikh) {
        targetSheikh = savedState.sheikh;
        savedReciterEditions[targetSheikh] = savedState.edition;
        playingSheikhId  = savedState.sheikh;
        playingEditionId = savedState.edition;
        playingSurahId   = savedState.surah;
    } else if (savedState?.surah === 'radio') {
        playingSurahId = 'radio';
    }

    await selectSheikh(targetSheikh);

    if (listenFromUrl === 'radio') playRadio();

    // عرض تلميح الراديو للمستخدمين الجدد
    if (!safeLocalCheck('radioDiscovered')) {
        setTimeout(() => {
            document.getElementById('radio-tooltip')?.classList.add('show');
            document.getElementById('radio-badge')?.classList.add('show');
        }, 2800);
    }

    // استعادة الحالة المحفوظة
    if (savedState?.surah && listenFromUrl !== 'radio') {
        if (savedState.surah === 'radio') {
            audioInstance.src = radioUrl;
            const player = document.getElementById('global-player');
            if (player) player.style.display = 'block';
            const trackTitle = document.getElementById('player-track-title');
            if (trackTitle) trackTitle.textContent = translations[currentLang].radioTitle;

            isRadioHeaderActive = true;
            updateHeaderUI();

            const fill  = document.getElementById('progress-bar-fill');
            const thumb = document.getElementById('progress-thumb');
            const sep   = document.getElementById('time-separator');
            const curr  = document.getElementById('curr-time');
            const total = document.getElementById('total-time');
            if (fill)  fill.style.width = '100%';
            if (thumb) thumb.style.display = 'none';
            if (sep)   sep.style.display = 'none';
            if (curr)  curr.textContent = '';
            if (total) total.textContent = translations[currentLang].live;

            syncUIWithAudioState();
        } else {
            const sData = activeSurahsData.find(s => s.id === savedState.surah);
            if (sData && !audioInstance.src) {
                const sName = getSurahName(sData.id, sData.name);
                const promptText = currentLang === 'ar'
                    ? `هل تود إكمال الاستماع إلى سورة ${sName}؟`
                    : `Resume listening to Surah ${sName}?`;
                const resumeText = document.getElementById('resume-text');
                if (resumeText) resumeText.textContent = promptText;
                document.getElementById('resume-banner')?.classList.add('show');
                window.resumeData = { id: sData.id, url: sData.url };
                setTimeout(closeResumeBanner, 15000);
            }
        }
    }
})();

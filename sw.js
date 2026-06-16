const CACHE_NAME = 'egy-quran-v3';

// قائمة بالملفات الأساسية
const ASSETS = [
    './',
    './index.html',
    './icon.png',
    './manifest.json',
    './hosary.jpg', 
    './minshawy.jpg', 
    './mustafa.jpg', 
    './banna.jpg', 
    './basit.jpg',
    './husary_1.json', './husary_2.json', './husary_3.json', './husary_4.json', './husary_5.json',
    './minshawi_1.json', './minshawi_2.json',
    './mustafa_1.json',
    './banna_1.json',
    './basit_1.json'
];

// حدث التثبيت: تخزين الملفات بشكل آمن لا يتأثر لو كان هناك ملف مفقود
self.addEventListener('install', (e) => {
    self.skipWaiting(); // إجبار المتصفح على تشغيل النسخة الجديدة فوراً
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return Promise.all(
                ASSETS.map(url => {
                    return cache.add(url).catch(err => console.log('تم تخطي هذا الملف:', url));
                })
            );
        })
    );
});

// حدث التفعيل: مسح الكاش القديم
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(keys.map((key) => {
                if (key !== CACHE_NAME) {
                    return caches.delete(key);
                }
            }));
        })
    );
    self.clients.claim(); // السيطرة على الصفحة فوراً
});

// حدث الجلب (Fetch) لمعالجة الريفريش وتشغيل الموقع بدون إنترنت
self.addEventListener('fetch', (e) => {
    // عدم تخزين الصوتيات في ذاكرة الهاتف
    if (e.request.url.includes('.mp3')) {
        return; 
    }

    // 1. معالجة "الريفريش" والسحب للأسفل
    if (e.request.mode === 'navigate') {
        e.respondWith(
            fetch(e.request).catch(() => {
                // إذا كان النت فاصلاً، اعرض الصفحة المحفوظة إجبارياً
                return caches.match('./index.html') || caches.match('./');
            })
        );
        return;
    }

    // 2. معالجة باقي الملفات (الصور والأكواد)
    e.respondWith(
        caches.match(e.request, { ignoreSearch: true }).then((cachedResponse) => {
            return cachedResponse || fetch(e.request);
        })
    );
});
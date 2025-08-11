// wwwroot/pwa-install.js
let deferredPrompt = null;
let dotnetHelper = null;

function isStandaloneDisplayMode() {
    // Android/desktop
    if (window.matchMedia('(display-mode: standalone)').matches) return true;
    // iOS Safari
    if (navigator.standalone === true) return true;
    // Otras heurísticas (por si abre desde WebAPK)
    if (document.referrer && document.referrer.startsWith('android-app://')) return true;
    return false;
}

window.pwaInstall = {
    init: (helper) => {
        dotnetHelper = helper;

        window.addEventListener('beforeinstallprompt', (e) => {
            // Chrome/Edge en Android/desktop
            e.preventDefault();
            deferredPrompt = e;
            if (dotnetHelper) {
                dotnetHelper.invokeMethodAsync('OnCanInstallChanged', true);
            }
        });

        window.addEventListener('appinstalled', () => {
            deferredPrompt = null;
            if (dotnetHelper) {
                dotnetHelper.invokeMethodAsync('OnInstalled');
            }
        });

        // Cambios en display-mode (algunas plataformas lo emiten)
        window.matchMedia('(display-mode: standalone)').addEventListener('change', (evt) => {
            if (dotnetHelper) {
                dotnetHelper.invokeMethodAsync('OnInstallStateChanged', evt.matches);
            }
        });
    },

    isInstalled: () => {
        return isStandaloneDisplayMode();
    },

    canInstall: () => {
        // true si llegó el beforeinstallprompt y aún no está instalada
        return !!deferredPrompt && !isStandaloneDisplayMode();
    },

    promptInstall: async () => {
        if (!deferredPrompt) return 'unavailable';
        deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        // Chrome solo permite usar el prompt una vez
        deferredPrompt = null;
        if (dotnetHelper) {
            dotnetHelper.invokeMethodAsync('OnCanInstallChanged', false);
        }
        return choice.outcome; // 'accepted' | 'dismissed'
    },

    isIOS: () => {
        const ua = window.navigator.userAgent.toLowerCase();
        return /iphone|ipad|ipod/.test(ua);
    },

    isSafari: () => {
        const ua = window.navigator.userAgent;
        const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
        return isSafari;
    }
};

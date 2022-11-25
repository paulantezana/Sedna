(() => {
    const rootElement = document.documentElement;

    // Load saved scheme
    const snSchemeSaved = sessionStorage.getItem('sn-scheme');
    if (snSchemeSaved) {
        buildScheme(snSchemeSaved, false);
    } else {
        
    }


    function SnSetTheme(themeName){
    }

    window.SnSetTheme = SnSetTheme;

    // Build Scheme
    function buildScheme(selectScheme) {
        if(selectScheme === 'light'){
            document.documentElement.classList.add('SnTheme-light');
            document.documentElement.classList.remove('SnTheme-darck');
            sessionStorage.setItem('sn-scheme', selectScheme);
        } else if(selectScheme === 'darck'){
            document.documentElement.classList.add('SnTheme-darck');
            document.documentElement.classList.remove('SnTheme-light');
            sessionStorage.setItem('sn-scheme', selectScheme);
        }
    }


    // Default device scheme mode
    if (!snSchemeSaved && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        buildScheme('darck');
        snSchemeSaved = 'darck';
    }

    // Listener
    const schemeMode = document.getElementById('gSchemeChecked');
    if (schemeMode) {
        schemeMode.checked = snSchemeSaved === 'darck';
        schemeMode.addEventListener("change", () => {
            if (schemeMode.checked === true) {
                buildScheme('darck');
            } else {
                buildScheme('light');
            }
        });
    }
})();

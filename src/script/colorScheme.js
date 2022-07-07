(() => {
    const defaultSchemes = {
        darck: {
            snColorBg: 'var(--gray-11)',
            snColorBgAlt: 'var(--gray-12)',

            snColorText: 'var(--gray-5)',
            snColorTextAlt: 'var(--gray-7)',

            snColorBorder: 'var(--gray-10)',
        },
        light: {
            snColorBg: 'hsl(209,11%,98%)',
            snColorBgAlt: 'var(--gray-1)',

            snColorText: 'var(--gray-10)',
            snColorTextAlt: 'var(--gray-7)',

            snColorBorder: 'var(--gray-4)',
        }
    };

    // Build Scheme
    function buildScheme(selectScheme) {
        if (defaultSchemes[selectScheme]) {
            let currentScheme = defaultSchemes[selectScheme];
            let rootStyles = document.documentElement.style;
            for (const cssVarName in currentScheme) {
                if (currentScheme.hasOwnProperty(cssVarName)) {
                    let property = currentScheme[cssVarName];
                    rootStyles.setProperty(`--${cssVarName}`, property);
                }
            }
            sessionStorage.setItem('sn-scheme', selectScheme);
        }
    }

    // Load saved scheme
    const snSchemeSaved = sessionStorage.getItem('sn-scheme');
    if (snSchemeSaved) {
        buildScheme(snSchemeSaved, false);
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

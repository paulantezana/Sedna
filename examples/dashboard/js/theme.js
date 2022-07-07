(()=>{
    document.addEventListener('DOMContentLoaded',() => {
        const defaultThemes = {
            darck: {
                snColorBg: 'var(--gray-10)',
                snColorBgAlt: 'var(--gray-11)',
                snColorHover: 'var(--gray-12)',

                snColorText: 'var(--gray-5)',
                snColorTextAlt: '#94aab9',

                snColorBorder: 'var(--gray-10)',
            },
            light: {
                snColorBg: '#EFF3F6',
                snColorBgAlt: '#FFFFFF',
                snColorHover: '#0000000d',

                snColorText: '#333333',
                snColorTextAlt: '#ABABAB',

                snColorBorder: '#DFE2E2',
            },
        };

        function buildTheme(selectTheme) {
            if (defaultThemes[selectTheme]){
                let currentTheme = defaultThemes[selectTheme];
                let rootStyles = document.documentElement.style;
                for (const cssVarName in currentTheme) {
                    if (currentTheme.hasOwnProperty(cssVarName)) {
                        let property = currentTheme[cssVarName];
                        rootStyles.setProperty(`--${cssVarName}`, property);
                    }
                }
                sessionStorage.setItem('snTheme', selectTheme);
            }
        }

        const snTheme = sessionStorage.getItem('snTheme');
        if (snTheme) {
            buildTheme(snTheme, false);
        }

        const themeMode = document.getElementById('themeMode');
        if (themeMode){
            themeMode.checked = snTheme === 'darck';
            themeMode.addEventListener('change', () => {
                if (themeMode.checked === true) {
                    buildTheme('darck');
                } else {
                    buildTheme('light');
                }
            });
        }
    });
})();
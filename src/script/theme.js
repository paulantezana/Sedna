export class Theme {
    constructor() {
        this.defaultThemes = {
            'darck': {
                snColorBg: '#2A3B47',
                snColorBgAlt: '#22323d',
                snColorHover: '#0000000d',

                snColorText: '#cad8e2',
                snColorTextAlt: '#94aab9',

                snColorBorder: '#374b58',

                snColorDark: '#2A3B47',
                snColorDarkAlt: 'hsl(208, 29%, 10%)',
                snColorDarkInverse: '#b6bcc0',
            },
            'light': {
                snColorBg: '#F6F8FA',
                snColorBgAlt: '#FFFFFF',
                snColorHover: '#0000000d',

                snColorText: '#333333',
                snColorTextAlt: 'rgb(202, 202, 202)',

                snColorBorder: '#DFE2E2',

                snColorDark: '#2A3B47',
                snColorDarkAlt: 'hsl(208, 29%, 10%)',
                snColorDarkInverse: '#b6bcc0',
            },
            'theme1': {
                snColor1: '#FF4D4F',
                snColor1Inverse: '#FFFFFF',
                snColor1Light: '#fe6668',
                snColor1Dark: '#fa3c3e',
            },
            'theme2': {
                snColor1: '#EF8615',
                snColor1Inverse: '#FFFFFF',
                snColor1Light: '#fea443',
                snColor1Dark: '#d07109',
            },
            'theme3': {
                snColor1: '#99D010',
                snColor1Inverse: '#FFFFFF',
                snColor1Light: '#c5f943',
                snColor1Dark: '#76a306',
            },
            'theme4': {
                snColor1: '#9A40D6',
                snColor1Inverse: '#FFFFFF',
                snColor1Light: '#b358f0',
                snColor1Dark: '#8c30c9',
            },
            'theme5': {
                snColor1: '#3899f3',
                snColor1Inverse: '#FFFFFF',
                snColor1Light: '#369bf9',
                snColor1Dark: '#1370c6',
            },
        };
        this.currentTheme = {};
        this.mode = 'light';
        this.themeName = '';
        this.listenActions();
        this.loadTheme();
    }

    saveTheme(theme) {
        sessionStorage.setItem('snTheme', JSON.stringify(theme));
    }

    loadTheme() {
        let snTheme = sessionStorage.getItem('snTheme');
        if (snTheme) {
            this.buildTheme(JSON.parse(snTheme), false);
        }
    }

    buildTheme(selectTheme, byName = true) {
        
        let newTheme = {};
        if (byName) {
            newTheme = this.defaultThemes[selectTheme] || {};
        } else {
            newTheme = selectTheme.currentTheme || {};
            this.mode = selectTheme.mode;
            this.themeName = selectTheme.themeName;
        }
        this.currentTheme = { ...this.currentTheme, ...newTheme };
        this.saveTheme({
            currentTheme: this.currentTheme,
            mode: this.mode,
            themeName: this.themeName,
        });

        // Set radio checket
        const changeTheme = document.getElementById(this.themeName);
        if(changeTheme){
            changeTheme.checked = true;
        }

        const themeMode = document.getElementById('themeMode');
        if (themeMode) {
            if(this.mode == 'light'){
                themeMode.checked = false;
            } else {
                themeMode.checked = true;
            }
        }


        // Set Styles DOM
        let rootStyles = document.documentElement.style;
        for (const cssVarName in this.currentTheme) {
            if (this.currentTheme.hasOwnProperty(cssVarName)) {
                let propertie = this.currentTheme[cssVarName];
                rootStyles.setProperty(`--${cssVarName}`, propertie);
            }
        }
    }

    listenActions() {
        const themeMode = document.getElementById('themeMode');
        if (themeMode) {
            themeMode.addEventListener('change', () => {
                if (themeMode.checked == true) {
                    this.mode = 'darck';
                    this.buildTheme('darck');
                } else {
                    this.mode = 'light';
                    this.buildTheme('light');
                }
            });
        }

        const changeTheme = document.getElementById('ChangeTheme');
        if (changeTheme) {
            changeTheme.addEventListener('change', e => {
                this.themeName = `theme${e.target.value}`;
                this.buildTheme(`theme${e.target.value}`);
            });
        }
        
    }

}
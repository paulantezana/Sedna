export const SnTheme = {
    theme: '',
    init() {
        // Root Element
        const rootElement = document.documentElement;

        // Load saved scheme
        const snSchemeSaved = sessionStorage.getItem('sn-scheme');
        if (snSchemeSaved) {
            this.setTheme(snSchemeSaved);
        } else {
            if(rootElement.classList.contains('SnTheme-light')){
                this.setTheme('light');
            } else if(rootElement.classList.contains('SnTheme-darck')){
                this.setTheme('darck');
            } else {
                // rootElement.classList.contains('ssss') // Set custom theme name
            }
        }

        // Listener
        const radioElements = document.getElementsByName('snTheme');
        radioElements.forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.setTheme(radio.value);
            });
        });
    },
    setTheme(themeName){
        document.documentElement.classList.remove('SnTheme-darck');
        document.documentElement.classList.remove('SnTheme-light');
        const radioElements = document.getElementsByName('snTheme');

        // Set current theme name
        if(themeName === 'light'){
            document.documentElement.classList.add('SnTheme-light');
            this.theme = 'light';
        } else if(themeName === 'darck'){
            document.documentElement.classList.add('SnTheme-darck');
            this.theme = 'darck';
        } else if(themeName === 'system'){
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.documentElement.classList.add('SnTheme-darck');
                this.theme = 'darck';
            } else {
                document.documentElement.classList.add('SnTheme-light');
                this.theme = 'light';
            }
        } else {
            document.documentElement.classList.add('SnTheme-' + themeName);
            this.theme = themeName;
        }

        // Save in storage
        sessionStorage.setItem('sn-scheme', this.theme);

        // Set checked in radio button
        radioElements.forEach(radio => {
            if(radio.value === themeName){
                radio.checked = true;
            }
        });
    }

}

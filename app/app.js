import './scss/app.scss';
import './prism/prism';

import * as all from './script/colorScheme';

// Primary Menu
SnMenu({
    menuId: "SiteMenu",
    toggleButtonID: "SiteMenu-toggle",
    toggleClass: "SiteMenu-is-show",
    contextId: "Site",
    parentClose: true,
    menuCloseID: "SiteMenu-wrapper",
    iconClassDown: 'fas fa-chevron-down',
    iconClassUp: 'fas fa-chevron-up',
});

// Aside menu
SnMenu({
    menuId: 'AsideMenu',
    toggleButtonID: 'AsideMenu-toggle',
    toggleClass: 'AsideMenu-is-show',
    menuCloseID: 'AsideMenu-close',
});

let codeBox = document.querySelectorAll('.CodeBox');
if (codeBox) {
    codeBox.forEach(item => {
        let codeBoxShow = item.querySelector('.CodeBox-show');
        let codeBoxCode = item.querySelector('.CodeBox-code');
        let codeBoxCopy = item.querySelector('.CodeBox-copy');
        if (codeBoxShow && codeBoxCode) {
            codeBoxShow.addEventListener('click', () => {
                codeBoxCode.classList.toggle('is-expand');
            });

            if (codeBoxCopy) {
                codeBoxCopy.addEventListener('click', () => {
                    let range = document.createRange();
                    range.selectNode(codeBoxCode);
                    window.getSelection().removeAllRanges();
                    window.getSelection().addRange(range);
                    document.execCommand("copy");
                    window.getSelection().removeAllRanges();

                    SnMessage.success({ content: 'copy success' });
                });
            }
        }

    });
}
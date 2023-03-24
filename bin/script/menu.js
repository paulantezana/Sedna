const SnActiveParentMenu = (linkElement, menuId, iconClassUp, iconClassDown) => {
    const parentNode = linkElement.parentElement;
    if (parentNode.tagName === 'UL' && parentNode.id !== menuId) {
        // Open container
        parentNode.classList.add('is-show');

        // Set icon open
        let iconPrevious = parentNode?.previousElementSibling?.querySelector('.toggle');
        if (iconPrevious) {

            // Remove class down
            iconClassDown.split(' ').forEach(iClass => {
                iconPrevious.classList.remove(iClass);
            });

            // Add class up
            iconClassUp.split(' ').forEach(iClass => {
                iconPrevious.classList.add(iClass);
            });
        }
    }

    // Recursive
    if (parentNode !== null && parentNode.id !== menuId) {
        SnActiveParentMenu(parentNode, menuId, iconClassUp, iconClassDown);
    }
}

const SnActiveMenu = (links, menuId = '', iconClassUp = '', iconClassDown = '') => {
    if (links) {
        links.forEach(link => {
            const url = document.location.href;
            if (link.href === url && link.href !== '#') {
                link.parentNode.classList.add('is-active');
                SnActiveParentMenu(link, menuId, iconClassUp, iconClassDown);
            }
        });
    }
    return links;
};

const SnMenu = ({
    menuId = "SnMenu",
    toggleButtonID = "SnMenu-toggle",
    contextId = "Site",
    toggleClass = "SnMenu-is-show",
    menuCloseID = '',
    iconClassDown = 'icon-down',
    iconClassUp = 'icon-up',
}) => {

    let SnMenuApi = {
        menu: null,
        context: null,
        toggleAction: null,
        closeAction: null,
        init() {
            this.menu = document.getElementById(menuId);
            if (!this.menu) {
                console.warn(`Not found ${menuId}`);
                return;
            }

            // Get all sub menu
            let items = this.menu.querySelectorAll("li"); // select all items
            for (let ele of items) {
                if (ele.childElementCount === 2) { // if submenu
                    let toggle = ele.firstElementChild; // First element
                    let content = ele.lastElementChild; // Second element

                    // Creando un nuevo elemento e insertando justo despues del enlace
                    let iconToggleEle = document.createElement('i');
                    iconClassDown.split(' ').forEach(iClass => {
                        iconToggleEle.classList.add(iClass);
                    });

                    iconToggleEle.classList.add('toggle');
                    toggle.appendChild(iconToggleEle);
                    toggle.classList.add('is-toggle');

                    iconToggleEle.addEventListener('click', e => {
                        e.preventDefault();

                        let isShow = content.classList.contains('is-show') ?? false;

                        if (isShow) {
                            iconClassUp.split(' ').forEach(iClass => {
                                iconToggleEle.classList.remove(iClass); // add Icon up
                            });
                            iconClassDown.split(' ').forEach(iClass => {
                                iconToggleEle.classList.add(iClass);
                            });
                        } else {
                            iconClassDown.split(' ').forEach(iClass => {
                                iconToggleEle.classList.remove(iClass);
                            });
                            iconClassUp.split(' ').forEach(iClass => {
                                iconToggleEle.classList.add(iClass); // add Icon up
                            });
                        }

                        content.classList.toggle('is-show'); // add class show menu
                    });
                }
            }

            // get context
            this.context = document.getElementById(contextId);

            // Toggle menu
            this.toggleAction = document.getElementById(toggleButtonID);
            if (this.toggleAction) {
                this.toggleAction.addEventListener('click', () => {
                    this.toggle();
                });
            }

            // Menu close remove class
            if (menuCloseID !== '') {
                this.closeAction = document.getElementById(menuCloseID);
                if (this.closeAction) {
                    this.closeAction.addEventListener('click', () => {
                        this.close();
                    });

                    // Set stop propagation
                    if (this.closeAction.hasChildNodes()) {
                        [...this.closeAction.children].forEach(item => {
                            item.addEventListener('click', e => {
                                e.stopPropagation();
                            });
                        });
                    }

                    // Set Stop propagation
                    this.menu.addEventListener('click', e => {
                        e.stopPropagation();
                    });
                }
            }

            // actives
            this.setActive();
        },
        open() {
            if (this.context)
                this.context.classList.add(toggleClass);
        },
        close() {
            if (this.context)
                this.context.classList.remove(toggleClass);
        },
        toggle() {
            if (this.context)
                this.context.classList.toggle(toggleClass);
        },
        setActive() {
            if (this.menu)
                SnActiveMenu([...this.menu.querySelectorAll('a')], menuId, iconClassUp, iconClassDown);
        }
    }

    SnMenuApi.init();
    return SnMenuApi;
};

export { SnMenu, SnActiveMenu }

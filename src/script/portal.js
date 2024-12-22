class SnPortal {
    constructor(entityName) {
        this.entityName = entityName;
        this.portalId = `${this.entityName}SnPortalWrapper`;
        this.addStyles();
    }

    addStyles() {
        const styles = `
            .SnPortal {
                position: fixed;
                background-color: white;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                z-index: 1000;
                max-width: 90vw;
                max-height: 90vh;
                overflow: auto;
            }
            .SnPortalOverlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0,0,0,0.5);
                z-index: 999;
            }
        `;
        const styleElement = document.createElement('style');
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);
    }

    renderMenuPortal(key, positionOrElement, content = "", toggle = true) {
        let portalNode = document.getElementById(this.portalId);
        let overlay = document.querySelector('.SnPortalOverlay');

        const closePortal = () => {
            if (portalNode) portalNode.remove();
            if (overlay) overlay.remove();
        };

        if (!portalNode) {
            portalNode = document.createElement('div');
            portalNode.setAttribute('id', this.portalId);
            portalNode.classList.add('SnPortal');

            overlay = document.createElement('div');
            overlay.classList.add('SnPortalOverlay');

            // Cambiamos el manejo del evento de clic en el overlay
            overlay.addEventListener('mousedown', (e) => {
                if (e.target === overlay) {
                    closePortal();
                }
            });

            document.body.appendChild(overlay);
            document.body.appendChild(portalNode);

            // Evitar que los clics dentro del portal se propaguen al overlay
            portalNode.addEventListener('mousedown', (e) => {
                e.stopPropagation();
            });
        } else {
            const origin = portalNode.getAttribute('origin');
            if (toggle && origin == key) {
                closePortal();
                return;
            }
        }

        portalNode.setAttribute('origin', key);
        portalNode.innerHTML = content;

        // Asegurarse de que el contenido esté renderizado antes de calcular la posición
        setTimeout(() => {
            this.setPosition(portalNode, positionOrElement);
        }, 0);

        return {
            close: closePortal
        };
    }

    setPosition(portalNode, positionOrElement) {
        if (positionOrElement instanceof Element) {
            this.setPositionByElement(portalNode, positionOrElement);
        } else {
            this.setPositionByXY(portalNode, positionOrElement.x, positionOrElement.y);
        }
    }

    setPositionByElement(portalNode, referElement) {
        const referElementRect = referElement.getBoundingClientRect();
        const portalRect = portalNode.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let top, left;

        // Calcular posición vertical
        if (referElementRect.bottom + portalRect.height <= viewportHeight) {
            // Hay espacio debajo del elemento
            top = referElementRect.bottom;
        } else if (referElementRect.top - portalRect.height >= 0) {
            // Hay espacio encima del elemento
            top = referElementRect.top - portalRect.height;
        } else {
            // No hay espacio arriba ni abajo, centramos verticalmente
            top = Math.max(0, (viewportHeight - portalRect.height) / 2);
        }

        // Calcular posición horizontal
        if (referElementRect.left + portalRect.width <= viewportWidth) {
            // Hay espacio a la derecha del elemento
            left = referElementRect.left;
        } else if (referElementRect.right - portalRect.width >= 0) {
            // Hay espacio a la izquierda del elemento
            left = referElementRect.right - portalRect.width;
        } else {
            // No hay espacio a los lados, centramos horizontalmente
            left = Math.max(0, (viewportWidth - portalRect.width) / 2);
        }

        portalNode.style.top = `${top}px`;
        portalNode.style.left = `${left}px`;
    }

    setPositionByXY(portalNode, x, y) {
        const portalRect = portalNode.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let top = y;
        let left = x;

        // Ajustar verticalmente si se sale de la ventana
        if (y + portalRect.height > viewportHeight) {
            top = Math.max(0, viewportHeight - portalRect.height);
        }

        // Ajustar horizontalmente si se sale de la ventana
        if (x + portalRect.width > viewportWidth) {
            left = Math.max(0, viewportWidth - portalRect.width);
        }

        portalNode.style.top = `${top}px`;
        portalNode.style.left = `${left}px`;
    }
}

export default SnPortal;
// Uso:
// const portalManager = new PortalManager('miEntidad');
// const portal = portalManager.renderMenuPortal('clave1', elementoReferencia, menuHtml);
// portal.close(); // Para cerrar el portal programáticamente

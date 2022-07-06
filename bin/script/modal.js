let closeModal = (m) => {
    m.classList.remove('visible');
    document.body.style.overflow = 'auto';
};

export let SnModal = {
    dataModals: null,
    openModals: [],
    scope: undefined,

    init() {
        this.render();

        // Modal close the mask
        this.dataModals = document.querySelectorAll('[data-modal]')
        for (let i = 0; i < this.dataModals.length; i++) {
            let maskClose = this.dataModals[i].dataset.maskclose || true;
            if(maskClose === true || maskClose === "true"){
                this.dataModals[i].addEventListener('click', (event) => {
                    let modalName = this.dataModals[i].dataset.modal
                    this.close(modalName)
                })
            }
        }

        // Modal button trigger open
        let triggers = document.querySelectorAll('[data-modaltrigger]')
        for (let i = 0; i < triggers.length; i++) {
            triggers[i].addEventListener('click', (event) => {
                let modalName = triggers[i].dataset.modaltrigger
                this.open(modalName)
            })
        }

        // Modal button close
        let closes = document.querySelectorAll('[data-modalclose]')
        for (let i = 0; i < closes.length; i++) {
            closes[i].addEventListener('click', (event) => {
                let modalName = closes[i].dataset.modalclose
                this.close(modalName)
            })
        }

        // Listen keyboart close las open modal
        window.addEventListener('keyup', (event) => {
            if (SnModal.openModals.length && event.keyCode === 27) {
                SnModal.closeLastModal()
            }
        })
    },

    render(){
        if(this.scope === undefined){
            this.scope = document.createElement('div');
            this.scope.classList.add(`${window.classPrefix}Modal-gScope`);
            document.body.appendChild(this.scope);
        }
    },

    open(modalName, cb) {
        let modal = document.querySelector(`[data-modal="${modalName}"]`)

        // If modal is already open, don't do anything
        if (this.openModals.indexOf(modal) >= 0) return

        if (modal) {
            modal.classList.add('visible')

            // Modal prevent events
            let modalContent = modal.querySelector(`.${window.classPrefix}Modal`);
            if (modalContent) {
                modalContent.addEventListener('click', (event) => {
                    event.stopPropagation()
                })
            }

            // Disable parent scrolling when modal is open
            document.body.style.overflow = 'hidden'

            this.openModals.push(modal)
        } else {
            console.warn('Could not find modal with name "%s"', modalName)
        }

        typeof cb === 'function' && cb()
    },

    close(modalName, cb) {
        let modal = document.querySelector(`[data-modal="${modalName}"]`)

        // If modal is already open, don't do anything
        // if (this.openModals.indexOf(modal) >= 0) return

        if (modal) {
            closeModal(modal)

            this.openModals.pop(modal)
        } else {
            console.warn('Could not find modal with name "%s"', modalName)
        }

        typeof cb === 'function' && cb()
    },

    closeLastModal(cb) {
        let modal = this.openModals.pop()
        closeModal(modal)
        typeof cb === 'function' && cb()
    },

    confirm({
        confirm = true,
        title = '',
        type = 'question',
        content = '',
        input = false,
        inputValue = '',
        okClassNames = 'primary',
        cancelClassNames = '',
        cancelText = 'Cancelar',
        okText = 'OK',
        onOk = () => { },
        onCancel = () => { }
    }) {
        this.render();

        let uniqueIdName = window.classPrefix + 'ConfirmModal' + (document.querySelectorAll(`.${window.classPrefix}Modal`).length + 1);
        let divEl = document.createElement('div');

        let cancelTemp = confirm
            ? `<button class="${window.classPrefix}Btn ${cancelClassNames}" id="cancel${uniqueIdName}" type="button">${cancelText}</button>`
            : '';
        
        let inputHtml = input === true ? `<div class="${window.classPrefix}Modal-confirmInput"><input type="text" class="${window.classPrefix}Form-control" id="input${uniqueIdName}" value="${inputValue}"></div>`: '';

        divEl.innerHTML = `
            <div class="${window.classPrefix}Modal-wrapper" data-modal="${uniqueIdName}" >
                <div class="${window.classPrefix}Modal confirm">
                    <div class="${window.classPrefix}Modal-body confirm">
                        <div class="${window.classPrefix}Modal-confirmIcon ${type}">${SnIcon[type]}</div>
                        <div class="${window.classPrefix}Modal-confirmTile">${title}</div>
                        <div class="${window.classPrefix}Modal-confirmContent">${content}</div>
                        ${inputHtml}
                        <div class="${window.classPrefix}Modal-confirmBtns">
                            ${cancelTemp}
                            <button class="${window.classPrefix}Btn ${okClassNames}" id="ok${uniqueIdName}" type="button">${okText}</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.scope.appendChild(divEl);
        this.open(uniqueIdName);

        let inputData = document.getElementById(`input${uniqueIdName}`);
        if(inputData){
            inputData.focus();
        }
        let btnCancel = document.getElementById(`cancel${uniqueIdName}`);
        if (btnCancel) {
            btnCancel.addEventListener('click', e => {
                e.preventDefault();
                this.close(uniqueIdName);
                this.scope.removeChild(divEl);
                onCancel(inputData ? inputData.value : '');
            });
        }

        let btnOk = document.getElementById(`ok${uniqueIdName}`);
        if (btnOk) {
            btnOk.addEventListener('click', e => {
                e.preventDefault();
                this.close(uniqueIdName);
                this.scope.removeChild(divEl);
                onOk(inputData ? inputData.value : '');
            });
            btnOk.focus();
        }
    },

    info({
        title = '',
        content = '',
        okText = 'OK',
        onOk = () => { },
        ...rest
    }) {
        this.confirm({
            confirm: false,
            type: 'info',
            title,
            content,
            okText,
            onOk,
            ...rest
        });
    },

    success({
        title = '',
        content = '',
        okText = 'OK',
        onOk = () => { },
        ...rest
    }) {
        this.confirm({
            confirm: false,
            type: 'success',
            title,
            content,
            okText,
            onOk,
            ...rest
        });
    },

    danger({
        title = '',
        content = '',
        okText = 'OK',
        onOk = () => { },
        ...rest
    }) {
        this.confirm({
            confirm: false,
            type: 'danger',
            title,
            content,
            okText,
            onOk,
            ...rest
        });
    },

    warning({
        title = '',
        content = '',
        okText = 'OK',
        onOk = () => { },
        ...rest
    }) {
        this.confirm({
            confirm: false,
            type: 'warning',
            title,
            content,
            okText,
            onOk,
            ...rest
        });
    }
};
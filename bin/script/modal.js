import { SnUniqueId } from './conmon';

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
            this.scope.classList.add('SnModal-gScope');
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
            let modalContent = modal.querySelector('.SnModal');
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
        okType = 'primary',
        cancelType = '',
        cancelText = 'Cancelar',
        okText = 'OK',
        onOk = () => { },
        onCancel = () => { }
    }) {
        this.render();

        let uniqueIdName = 'Sn' + SnUniqueId();
        let divEl = document.createElement('div');

        let cancelTemp = confirm
            ? `<div class="SnBtn ${cancelType}" id="cancel${uniqueIdName}">${cancelText}</div>`
            : '';
        
        let inputHtml = input === true ? `<div class="SnModal-confirmInput"><input type="text" class="SnForm-control" id="input${uniqueIdName}" value="${inputValue}"></div>`: '';

        // let showIcon = confirm()
        divEl.innerHTML = `
            <div class="SnModal-wrapper" data-modal="${uniqueIdName}" >
                <div class="SnModal confirm">
                    <div class="SnModal-body confirm">
                        <div class="SnModal-confirmIcon ${type}">${SnIcon[type]}</div>
                        <div class="SnModal-confirmTile">${title}</div>
                        <div class="SnModal-confirmContent">${content}</div>
                        ${inputHtml}
                        <div class="SnModal-confirmBtns">
                            ${cancelTemp}
                            <div class="SnBtn ${okType}" id="ok${uniqueIdName}">${okText}</div>
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
        }
    },

    info({
        title = '',
        content = '',
        okText = 'OK',
        onOk = () => { },
    }) {
        this.confirm({
            confirm: false,
            type: 'info',
            title,
            content,
            okText,
            onOk,
        });
    },

    success({
        title = '',
        content = '',
        okText = 'OK',
        onOk = () => { },
    }) {
        this.confirm({
            confirm: false,
            type: 'success',
            title,
            content,
            okText,
            onOk,
        });
    },

    error({
        title = '',
        content = '',
        okText = 'OK',
        onOk = () => { },
    }) {
        this.confirm({
            confirm: false,
            type: 'error',
            title,
            content,
            okText,
            onOk,
        });
    },

    warning({
        title = '',
        content = '',
        okText = 'OK',
        onOk = () => { },
    }) {
        this.confirm({
            confirm: false,
            type: 'warning',
            title,
            content,
            okText,
            onOk,
        });
    }
};
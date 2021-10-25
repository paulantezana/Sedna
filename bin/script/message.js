export let SnMessage = {
    transitionLength: 700,
    scope: undefined,
    info({ content = '', duration = 6000 }) {
        this.message(content, duration, 'info', 'info');
    },
    success({ content = '', duration = 6000 }) {
        this.message(content, duration, 'success', 'success');
    },
    error({ content = '', duration = 6000 }) {
        this.message(content, duration, 'error', 'error');
    },
    warning({ content = '', duration = 6000 }) {
        this.message(content, duration, 'warning', 'warning');
    },
    message(message, time, addClass = 'default', type = 'question') {
        if (!time || time === 'default') {
            time = 20000;
        }
        this.render();
        let messageEl = document.createElement('div');
        messageEl.classList.add(`${window.classPrefix}Message`, addClass);
        messageEl.innerHTML = `<span class="${window.classPrefix}Message-icon">${SnIcon[type]}</span>${message}`;

        this.scope.prepend(messageEl);
        setTimeout(
            () => messageEl.classList.add('open')
        );
        setTimeout(
            () => messageEl.classList.remove('open'),
            time
        );
        setTimeout(
            () => this.scope.removeChild(messageEl),
            time + this.transitionLength
        );
    },
    render(){
        if(this.scope === undefined){
            this.scope = document.createElement('div');
            this.scope.classList.add(`${window.classPrefix}Message-gScope`);
            document.body.appendChild(this.scope);
        }
    }
}
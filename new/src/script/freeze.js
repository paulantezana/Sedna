export let SnFreeze = {
    scope: undefined,
    unFreeze(selector) {
        let parentSelector = document.querySelector(selector) || document;
        let element = parentSelector.querySelector(`.${window.classPrefix}Freeze-wrapper`);
        if (element) {
            element.classList.add("is-unfreezing");
            setTimeout(() => {
                if (element) {
                    element.classList.remove("is-unfreezing");
                    if(element.parentElement != null || element.parentElement != undefined){
                        element.parentElement.removeChild(element);
                    }
                }
            }, 250);
        }
    },
    freeze(options = {}) {
        this.render();
        let parent = document.querySelector(options.selector) || document.body;
        this.scope.setAttribute("data-text", options.text || "Loading");
        if (document.querySelector(options.selector)) {
            this.scope.style.position = "absolute";
            parent.style.position = "relative";
        }
        parent.appendChild(this.scope);
    },
    render(){
        if(this.scope === undefined){
            this.scope = document.createElement('div');
            this.scope.classList.add(`${window.classPrefix}SnFreeze-wrapper`);
            document.body.appendChild(this.scope);
        }
    }
};
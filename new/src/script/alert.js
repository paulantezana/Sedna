export let SnAlert = {
    init() {
        let alertEles = document.querySelectorAll(`.${window.classPrefix}Alert`);
        [...alertEles].forEach(item => {
            let alertEle = item.querySelector(`.${window.classPrefix}Alert-close`);
            if (alertEle) {
                alertEle.addEventListener('click', () => {
                    item.remove();
                });
            }
        });
    },
    // close() {

    // },
    // reload() {
    //     this.init();
    // }
}

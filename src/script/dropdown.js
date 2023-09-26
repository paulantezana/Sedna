function SnDropdown() {
    let lastDropdown = false;

    function toggleDropdown(listElem) {
        if (!listElem.classList.contains('show')) {
            listElem.classList.add('show');

            if (lastDropdown && lastDropdown !== listElem) {
                lastDropdown.classList.remove('show');
            }
            lastDropdown = listElem;
        } else {
            lastDropdown = false;
            listElem.classList.remove('show');
        }
    }

    function closeLastDropdown() {
        if (lastDropdown) {
            lastDropdown.classList.remove('show');
        }
    }

    document.querySelectorAll('.SnDropdown').forEach(item => {
        let toggleElem = item.querySelector('.SnDropdown-toggle');
        let listElem = toggleElem.nextElementSibling;

        if (!item.classList.contains('listen')) {
            item.classList.add('listen');
            toggleElem.addEventListener('click', e => {
                e.stopPropagation();
                toggleDropdown(listElem);
            }, true);

            if (listElem.classList.contains('no-closable')) {
                listElem.addEventListener('click', e => {
                    e.stopPropagation();
                });
            }
        }
    });

    window.addEventListener('click', e => {
        closeLastDropdown();
    });
}

export default SnDropdown;



class SnFilter {
    constructor(options) {
        // -------------------------------------------------------------------------------
        // Init vars ---------------------------------------------------------------------
        this.options = options;
        this.filters = [];
        this.options.entity ??= SnUniqueId();
        this.options.elementId ??= '';
        this.options.columns ??= [];
        this.options.filters ??= [];

        // -------------------------------------------------------------------------------
        // Init data ---------------------------------------------------------------------
        if (this.options.filters.length > 0) {
            this.filters = this.options.filters;
        }

        // Rerender
        this._render();
    }

    addFilter(optionId, parentId) {
        const firstColumn = this.options.columns.find(item => item.filterable);
        if (firstColumn === undefined) {
            SnMessage.warning({ content: 'No hay columnas configuradas para filtrar.' });
            return;
        }

        switch (optionId) {
            case '1': // Si
            case '2': // Si no
                const indexMatch = this.filters.findIndex(item => item.id == parentId);
                const newfilter = {
                    id: SnUniqueId(),
                    logicalOperator: 'AND',
                    prefix: optionId == '1' ? 'DONDE' : 'DONDE NO',
                    operator: (firstColumn.type || 'text') === 'text' ? 'contiene' : '=',
                    field: firstColumn.field,
                    type: firstColumn.type || 'text',
                    value1: '',
                    value2: ''
                };

                if (indexMatch === -1) {
                    this.filters.push({
                        id: this.filters.length + 1,
                        logicalOperator: 'AND',
                        prefix: optionId === '1' ? 'DONDE' : 'DONDE NO',
                        eval: [newfilter]
                    });
                } else {
                    this.filters[indexMatch].eval = [...this.filters[indexMatch].eval, newfilter];
                }
                break;
            case '3': // o
            case '4': // o no
                const filterEval = {
                    id: SnUniqueId(),
                    logicalOperator: 'OR',
                    prefix: optionId == '3' ? 'DONDE' : 'DONDE NO',
                    operator: (firstColumn.type || 'text') === 'text' ? 'contiene' : '=',
                    field: firstColumn.field,
                    type: firstColumn.type || 'text',
                    value1: '',
                    value2: ''
                };
                this.filters.push({
                    id: SnUniqueId(),
                    logicalOperator: 'OR',
                    prefix: optionId == '3' ? 'DONDE' : 'DONDE NO',
                    eval: [filterEval]
                });
                break;
            default:
                alert('ERROR: FILTER UNSUPPORT');
                break;
        }

        // Rerender
        this._render();
    }

    removeFilter(id, parentId) {
        const indexParent = this.filters.findIndex(item => item.id == parentId);
        if (indexParent === undefined) {
            alert('ERROR: FILTER DELETE');
        }

        this.filters[indexParent].eval = this.filters[indexParent].eval.filter(item => item.id != id);
        if (this.filters[indexParent].eval.length === 0 && indexParent > 0) {
            this.filters.splice(indexParent, 1);
        }

        this._render();
    }

    _updateFilter(option, value, id, parentId, render = true) {
        const indexParent = this.filters.findIndex(item => item.id == parentId);
        if (indexParent === undefined) {
            alert('ERROR: FILTER UPDATE');
        }

        this.filters[indexParent].eval = this.filters[indexParent].eval.map(item => item.id == id ? ({ ...item, [option]: value }) : item);

        if (render) {
            this._render();
        }
    }

    _buildAddFilterButton(parentId) {
        return `<div class="SnDropdown">
                    <div class="SnDropdown-toggle SnBtn sm radio jsAction SnMr-2"><i class="SnMr-2" style="display: inline-flex;">${SnIcon.plus}</i>Añadir filtro</div>
                    <ul class="SnDropdown-list jsFilter${this.options.entity}" style="left: 0; min-width: auto">
                        <li class="SnDropdown-item" data-type="1" data-parentid="${parentId}">Si</li>
                        <li class="SnDropdown-item" data-type="2" data-parentid="${parentId}">Si no</li>
                        <li class="SnDropdown-item" data-type="3" data-parentid="${parentId}">O</li>
                        <li class="SnDropdown-item" data-type="4" data-parentid="${parentId}">O no</li>
                    </ul>
                </div>`
    }

    _render() {
        const filterWrapper = document.getElementById(this.options.elementId);
        const prefixData = [
            { id: 'DONDE', description: 'DONDE' },
            { id: 'DONDE NO', description: 'DONDE NO' }
        ];
        const stringOperatorArray = [
            { id: 'contiene', description: 'contiene' },
            { id: 'empieza por', description: 'empieza por' },
            { id: 'es', description: 'es' },
            { id: 'no es', description: 'no es' },
            { id: 'no contiene', description: 'no contiene' },
            { id: 'se encuentra entre (incluye)', description: 'se encuentra entre (incluye)' },
            { id: 'es mayor que e incluye', description: 'es mayor que e incluye' },
            { id: 'es menor que e incluye', description: 'es menor que e incluye' },
            { id: 'no tiene valor.', description: 'no tiene valor.' },
        ];
        const numericOperatorArray = [
            { id: '=', description: '=' },
            { id: '<>', description: '<>' },
            { id: 'se encuentra entre (incluye)', description: 'se encuentra entre (incluye)' },
            { id: '<', description: '<' },
            { id: '<=', description: '<=' },
            { id: '>', description: '>' },
            { id: '>=', description: '>=' },
            { id: 'no tiene valor', description: 'no tiene valor' },
        ];

        let text = '';
        this.filters.forEach((cf, inx) => {
            if (this.filters.length > 1) {
                if (cf.logicalOperator.toUpperCase() === 'OR' && cf.prefix.toUpperCase() === 'DONDE') {
                    text += inx == 0 ? '<div>Ya sea<div>' : '<div>O<div>';
                } else if (cf.logicalOperator.toUpperCase() === 'OR' && cf.prefix.toUpperCase() === 'DONDE NO') {
                    text += '<div>Ni tampoco<div>';
                }
            }

            // Content
            cf.eval.forEach(ev => {
                text += `<div class="MultiFilter SnMb-2">
                            <div class="MultiFilter-item"><button class="SnBtn radio icon jsFilterRowRemove${this.options.entity} jsAction" data-id="${ev.id}" data-parentid="${cf.id}"><i>${SnIcon.close}</i></button></div>
                            <div class="MultiFilter-item">
                                <select class="SnForm-control jsFilterRowPrefix${this.options.entity}" data-id="${ev.id}" data-parentid="${cf.id}">
                                    ${prefixData.map(row => `<option value="${row.id}" ${ev.prefix === row.id ? 'selected' : ''}>${row.description}</option>`).join('')}
                                </select>
                            </div>
                            <div class="MultiFilter-item">
                                <select class="SnForm-control jsFilterRowField${this.options.entity}" data-id="${ev.id}" data-parentid="${cf.id}">
                                    ${this.options.columns.map(row => row.filterable ? `<option value="${row.field}" ${ev.field === row.field ? 'selected' : ''} data-type="${row.type || 'text'}">${row.title}</option>` : '').join('')}
                                </select>
                            </div>
                            <div class="MultiFilter-item">
                                <select class="SnForm-control jsFilterRowOperator${this.options.entity}" data-id="${ev.id}" data-parentid="${cf.id}">
                                    ${(ev.type === 'number' || ev.type === 'date' || ev.type === 'datetime-local')
                        ? (numericOperatorArray.map(opt => `<option value="${opt.id}" ${ev.operator === opt.id ? 'selected' : ''}>${opt.description}</option>`).join(''))
                        : (stringOperatorArray.map(opt => `<option value="${opt.id}" ${ev.operator === opt.id ? 'selected' : ''}>${opt.description}</option>`).join(''))
                    }
                                </select>
                            </div>
                            <div class="MultiFilter-item">
                                <input type="${ev.type || 'text'}" class="SnForm-control jsFilterRowValue1${this.options.entity}" data-id="${ev.id}" data-parentid="${cf.id}" placeholder="Ingresa un valor" value="${ev.value1}">
                            </div>
                            <div class="MultiFilter-item">
                                ${ev.operator === 'se encuentra entre (incluye)' ? `<span class="SnMr-2">Y</span><input type="${ev.type || 'text'}" class="SnForm-control jsFilterRowValue2${this.options.entity}" data-id="${ev.id}" data-parentid="${cf.id}" placeholder="Ingresa un valor" value="${ev.value2}">` : ''}
                            </div>
                        </div>`;
            });

            // After
            text += this._buildAddFilterButton(cf.id);
        });

        // Add filter in empty
        if (this.filters.length === 0) {
            text += this._buildAddFilterButton(0);
        }

        // text += `<button class="SnBtn sm radio jsAction SnMl-2" id="${this.options.entity}FilterCopy"><i class="fa-solid fa-copy"></i></button>`;

        // Draw content
        filterWrapper.innerHTML = text;
        SnDropdown();

        // Filter listeners
        const filterOptions = document.querySelectorAll(`.jsFilter${this.options.entity}`);
        filterOptions.forEach(item => {
            [...item.children].forEach(fi => {
                fi.addEventListener('click', e => {
                    this.addFilter(fi.dataset.type, fi.dataset.parentid);
                });
            });
        });

        // Filter remove
        const removes = document.querySelectorAll(`.jsFilterRowRemove${this.options.entity}`);
        removes.forEach(item => {
            item.addEventListener('click', e => {
                this.removeFilter(item.dataset.id, item.dataset.parentid);
            });
        });

        // Prefix listener
        const prefixs = document.querySelectorAll(`.jsFilterRowPrefix${this.options.entity}`);
        prefixs.forEach(item => {
            item.addEventListener('change', e => {
                this._updateFilter('prefix', item.value, item.dataset.id, item.dataset.parentid);
            });
        });

        // Field listener
        const fields = document.querySelectorAll(`.jsFilterRowField${this.options.entity}`);
        fields.forEach(item => {
            item.addEventListener('change', e => {
                const dataType = item.options[item.selectedIndex].getAttribute('data-type');
                this._updateFilter('field', item.value, item.dataset.id, item.dataset.parentid, false);
                this._updateFilter('type', dataType, item.dataset.id, item.dataset.parentid);
            });
        });

        // Operator listener
        const operators = document.querySelectorAll(`.jsFilterRowOperator${this.options.entity}`);
        operators.forEach(item => {
            item.addEventListener('change', e => {
                this._updateFilter('operator', item.value, item.dataset.id, item.dataset.parentid);
            });
        });

        // Value 1
        const value1s = document.querySelectorAll(`.jsFilterRowValue1${this.options.entity}`);
        value1s.forEach(item => {
            item.addEventListener('change', e => {
                this._updateFilter('value1', item.value, item.dataset.id, item.dataset.parentid);
            });
        });

        // Value 2
        let value2s = document.querySelectorAll(`.jsFilterRowValue2${this.options.entity}`);
        value2s.forEach(item => {
            item.addEventListener('change', e => {
                this._updateFilter('value2', item.value, item.dataset.id, item.dataset.parentid);
            });
        });

        // Emit event changes
        if (this.options?.onUpdated && typeof this.options?.onUpdated === "function") {
            this.options.onUpdated(this);
        }
    }
}

export default SnFilter;

class SnTable {
    constructor(options) {
        // -------------------------------------------------------------------------------
        // Init vars ---------------------------------------------------------------------
        this.options = options;
        this.columnSorters = {};
        this.selectRows = [];
        this.rowKey = 'id';
        this.result = {};
        this.filter = null;
        this.limit = 20;
        this.page = 1;
        this.summaryFields = [];

        // Init var in options
        this.options.paramKeys ??= ['id'];
        this.options.actions ??= [];
        this.options.entity ??= SnUniqueId();
        this.options.elementId ??= '';
        this.options.selectable ??= true;
        this.options.columns ??= [];
        this.options.filters ??= [];
        this.options.tableHeadTopHtml ??= '';
        this.options.filterEnabled ??= true;
        this.options.selectableRadio ??= true;
        this.options.toolbar ??= '';

        // Default Sorter
        if (this.rowKey.length > 0) {
            this.columnSorters = {
                field: this.rowKey,
                order: 'desc',
            }
        }

        // Summary cols
        this._setDefaultValues();

        // Init
        this._renderTemplate();
        this.getData();
    }

    //  ========================================================================================
    //  U T I L S
    _setDefaultValues() {
        // Set columns default properties
        this.options.columns = this.options.columns.map(item => ({
            ...item,
            id: item.id ?? SnUniqueId(),
            visible: [undefined, null, true, 1, '1'].includes(item.visible)
        })).sort((a, b) => a.position_index - b.position_index);

        // Init summary fields
        this.summaryFields = this.options.columns.filter(item => item.type === 'number' && !!item.summaryOperator).map(item => ({ ...item, values: [] }));
    }

    _getTableActionParamValues(row) {
        // Get values
        let items = Object.entries(row).filter(([key, value]) => this.options.paramKeys.includes(key));

        // Order
        items.sort((a, b) => {
            let positionA = this.options.paramKeys.indexOf(a[0]);
            let positionB = this.options.paramKeys.indexOf(b[0]);
            return positionA - positionB;
        })

        // Set only values and is string in ""
        items = items.map(([key, val]) => (typeof val === 'string') ? `'${val}'` : val);

        // Return value in string
        return items.join('_');
    }

    _getTableActions() {
        return this.options.actions.filter(item => item.position === 'TABLE');
    }

    _getVisibleColumns() {
        return this.options.columns.filter(item => [true, 1, '1'].includes(item.visible));
    }

    //  ========================================================================================
    //  T A B L E     Z O N E
    //  ========================================================================================
    getData() {
        SnFreeze.freeze({ selector: `#${this.options.elementId}` });
        SnLoadingState(true, 'jsAction');

        this.options.data({
            filter: this.filter?.filters ?? [],
            sorter: this.columnSorters,
            limit: this.limit,
            page: this.page,
        })
            .then((result) => {
                this.result = result;
                this.selectRows = [];

                this._renderTableBody();
                this._renderFilterDescriptions();
            })
            .catch((err) => {
                console.error('SnTable fetch error ', err);
            })
            .finally((e) => {
                SnFreeze.unFreeze(`#${this.options.elementId}`);
                SnLoadingState(false, 'jsAction');
            });
    }

    _renderTemplate() {
        let tableEle = document.getElementById(this.options.elementId);

        // Render table base
        tableEle.innerHTML = `<div id="${this.options.entity}DataTable" class="SnDataTable">
                                    <div class="SnDataTable-toolbar" id="${this.options.entity}DataTableToolbar">
                                        <div class="SnDataTable-toolbar-left" id="${this.options.entity}FilterDescription"></div>
                                        <div class="SnDataTable-toolbar-right">${this.options.toolbar}
                                            <div class="SnBtn sm radio jsAction SnMb-2" data-modaltrigger="${this.options.entity}ModalFilter" id="${this.options.entity}ModalFilterToggle">${SnIcon.filter}</div>
                                            <div class="SnModal-wrapper" data-modal="${this.options.entity}ModalFilter" data-maskclose="false">
                                                <div class="SnModal" style="max-width: 90vw;">
                                                    <div class="SnModal-close" data-modalclose="${this.options.entity}ModalFilter" id="${this.options.entity}ModalFilterClose"><i>${SnIcon.close}</i></div>
                                                    <div class="SnModal-header">Filtro</div>
                                                    <div class="SnModal-body">
                                                        <div id="${this.options.entity}FilterWrapper"></div>
                                                        <button class="SnBtn radio block primary SnMt-3" id="${this.options.entity}FilterAply"><i class="SnMr-2">${SnIcon.filter}</i>Aplicar filtro</button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="SnDropdown">
                                                <div class="SnDropdown-toggle SnBtn sm radio jsAction SnMl-2 SnMb-2"><i>${SnIcon.column}</i></div>
                                                <div class="SnDropdown-list SnDataTableFilter no-closable">
                                                    <div class="SnForm-item inner">
                                                        <label for="headerCompany" class="SnForm-label">Buscar columna</label>
                                                        <input type="search" class="SnForm-control sm" id="${this.options.entity}SearchCols">
                                                    </div>
                                                    <ul class="SnList SnDataTableFilter-list" id="${this.options.entity}ListCols">
                                                        ${this.options.columns.map(col => `<li><input type="checkbox" class="js${this.options.entity}ToggleCols" data-key="${col.id}" ${col.visible === true ? 'checked' : ''}><span class="SnMl-2">${col.title}</span></li>`).join('')}
                                                    </ul>
                                                    <div class="SnDataTableFilter-footer">
                                                        <button class="SnBtn radio" id="${this.options.entity}HideAllCols">Ocultar todo</button>
                                                        <button class="SnBtn radio SnMl-3" id="${this.options.entity}ShowAllCols">Mostrar todo</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="SnDataTable-table">
                                        <div class="SnTable-wrapper">
                                            <table class="SnTable" id="${this.options.entity}Table">
                                                <thead id="${this.options.entity}TableHead"></thead>
                                                <tbody id="${this.options.entity}TableBody">${this._buildEmptyRow()}</tbody>
                                                <tfoot id="${this.options.entity}TableFoot"></tfoot>
                                            </table>
                                        </div>
                                        <div id="${this.options.entity}Pagination"></div>
                                    </div>
                                    <div class="SnDataTable-detail" id="${this.options.entity}SnDataTableDetail">
                                    </div>
                                </div>`;

        // Hide menu portarls
        document.body.addEventListener('click', () => {
            const tableRowMenuPortal = document.getElementById(`${this.options.entity}TableRowMenuPortal`);
            if (tableRowMenuPortal !== null) {
                tableRowMenuPortal.remove();
            }
        });

        window.addEventListener('resize', () => {
            const tableRowMenuPortal = document.getElementById(`${this.options.entity}TableRowMenuPortal`);
            if (tableRowMenuPortal !== null) {
                tableRowMenuPortal.remove();
            }
        });

        // Render filter
        if (this.options.filterEnabled) {
            this.filter = new SnFilter({
                entity: this.options.entity,
                columns: this.options.columns,
                filters: this.options.filters,
                elementId: `${this.options.entity}FilterWrapper`
            });
        }

        this._renderTableHead();

        // Toolbar listener
        const filterToggle = document.getElementById(`${this.options.entity}ModalFilterToggle`);
        filterToggle.addEventListener('click', (e) => {
            e.preventDefault();
            SnModal.open(`${this.options.entity}ModalFilter`);
        });

        const filterClose = document.getElementById(`${this.options.entity}ModalFilterClose`);
        filterClose.addEventListener('click', (e) => {
            e.preventDefault();
            SnModal.close(`${this.options.entity}ModalFilter`);
        });

        const filterAply = document.getElementById(`${this.options.entity}FilterAply`);
        filterAply.addEventListener('click', e => {
            e.preventDefault();
            this.getData();
            SnModal.close(`${this.options.entity}ModalFilter`);
        });

        // ===================================================================================================
        // S H O W   A N D   H I D E   C O L U M N S
        // ===================================================================================================
        const searchCols = document.getElementById(`${this.options.entity}SearchCols`);
        searchCols.addEventListener('input', e => {
            this._reRenderColumnFilter(false, searchCols.value);
        });

        const toggleCols = document.querySelectorAll(`.js${this.options.entity}ToggleCols`);
        toggleCols.forEach(checkbox => {
            checkbox.addEventListener('change', e => {
                this.options.columns = this.options.columns.map(item => ({ ...item, visible: (item.id === checkbox.dataset.key ? checkbox.checked : item.visible) }));
                this._reRenderColumnFilter(true);
            });
        });

        // hide all
        const hideAllCols = document.getElementById(`${this.options.entity}HideAllCols`);
        hideAllCols.addEventListener('click', e => {
            this.options.columns = this.options.columns.map(item => ({ ...item, visible: false }));
            this._reRenderColumnFilter(true);
        });

        // show all
        const showAllCols = document.getElementById(`${this.options.entity}ShowAllCols`);
        showAllCols.addEventListener('click', e => {
            this.options.columns = this.options.columns.map(item => ({ ...item, visible: true }));
            this._reRenderColumnFilter(true);
        });
    }

    _renderTableHead() {
        let entityTableHead = document.getElementById(`${this.options.entity}TableHead`);

        // Head Table
        let tableHeadHtml = '';
        this._getVisibleColumns().forEach(item => {
            tableHeadHtml += `<th ${item.style != undefined ? `style="${item.style}"` : ''} title="${item.tooltip || item.title}">
                                <div class="SnDataTableCaption">
                                    <div class="SnDataTableCaption-left">${item.title}</div>
                                    ${item.sortable ? `<div class="jsSorterCol${this.options.entity} SnDataTableCaption-right not-print" data-field="${item.field}" data-order="" title="Ordenar">
                                                            <i>${SnIcon.sortUp}</i>
                                                        </div>` : ''}
                                </div>
                                ${item.filterable ? `<input type="${(item.type === 'datetime-local' || item.type === 'date') ? item.type : 'search'}" value="${this.getTableColumnFilterValue(item.field) ?? ''}" class="jsFilterValue${this.options.entity} SnForm-control sm SnMt-1 SnMb-1 not-print" data-field="${item.field}">` : ''}
                            </th>`;
        });

        entityTableHead.innerHTML = `${this.options.tableHeadTopHtml}
                                    <tr>
                                        ${this.options.selectable ? (this.options.selectableRadio ? '<th class="not-print"></th>' : `<th class="not-print"><input type="checkbox" id="${this.options.entity}TableSelectHead"></th>`) : ''}
                                        ${tableHeadHtml}
                                    </tr>`;

        // Filter listeners
        let filterValue = document.querySelectorAll(`.jsFilterValue${this.options.entity}`);
        filterValue.forEach(item => {
            const inputType = item.getAttribute('type');

            // Change listener -- EXPERIMENTAL
            if (inputType === 'date' || inputType === 'datetime-local') {
                item.addEventListener('change', e => {
                    this.setTableColumnFilter(e.target.dataset.field, e.target.value);
                });
            }

            // Key Up Listener
            item.addEventListener('keyup', e => {
                if (e.key === 'Enter') {
                    this.setTableColumnFilter(e.target.dataset.field, e.target.value);
                }
            });
        });

        // Sort listeners
        let sorterCol = document.querySelectorAll(`.jsSorterCol${this.options.entity}`);
        sorterCol.forEach(item => {
            item.addEventListener('click', e => {
                let fieldName = item.dataset.field;
                let orderType = item.dataset.order;
                this.columnSorters = {
                    field: fieldName,
                    order: orderType === '' ? 'asc' : (orderType === 'asc' ? 'desc' : 'asc'),
                };

                sorterCol.forEach(col => {
                    if (col.dataset.field !== fieldName) {
                        col.setAttribute('data-order', '');
                        col.innerHTML = '<i>' + SnIcon.sortUp + '</i>';
                        col.classList.remove('sort');
                    } else {
                        col.setAttribute('data-order', this.columnSorters.order);
                        col.innerHTML = '<i>' + (this.columnSorters.order === 'asc' ? SnIcon.sortUp : SnIcon.sortDown) + '</i>';
                        col.classList.add('sort');
                    }
                });

                this.getData();
            });
        });

        // Selected lsitener
        if (this.options.selectable) {
            const selectHead = document.getElementById(`${this.options.entity}TableSelectHead`);
            if (selectHead) {
                selectHead.addEventListener('change', e => {
                    if (selectHead.checked) {
                        if (this.result.data) {
                            this.selectRows = this.result.data.map(item => item[this.rowKey]);
                        }
                    } else {
                        this.selectRows = [];
                    }
                    this._reRenderSelectRowChecked();
                });
            }
        }

        this._setResizeListener();
    }

    _renderTableBody() {
        this._setDefaultValues();

        let tableBodyHtml = '';
        if (this.result.data.length === 0) {
            tableBodyHtml += this._buildEmptyRow();
        } else {
            this.result.data.forEach(item => {
                // Prepare to render
                const paramValues = this._getTableActionParamValues(item);
                if (this.options.rowRender && typeof this.options.rowRender === "function") {
                    tableBodyHtml += this.options.rowRender(item, this, paramValues);
                } else {
                    tableBodyHtml += `<tr class="${item.state == 0 ? 'canceled' : ''}" key="${item.id}" data-params="${paramValues}">
                                            ${this._buildSelectColumn(item)}
                                            ${this._buildDataRow(item)}
                                        </tr>`;
                }

                // Prepate to summary
                this.summaryFields = this.summaryFields.map(summary => {
                    const newValue = parseFloat(item[summary.field] || 0);
                    return ({ ...summary, values: [...summary.values, newValue] });
                });
            });
        }

        let entityTableBody = document.getElementById(`${this.options.entity}TableBody`);
        entityTableBody.innerHTML = tableBodyHtml;

        // Render summary
        this._renderSummary();

        // Render pagination
        this._renderPagination();

        // Dispatch event
        if (this.options.updated && typeof this.options.updated === "function") {
            this.options.updated(this);
        }

        // If not found data
        if (this.result.data.length === 0) {
            return;
        }

        // Select listeners
        if (this.options.selectable) {
            const tableRowSelect = document.querySelectorAll(`[id^="${this.options.entity}TableRowSelect"]`);
            [...tableRowSelect].forEach(item => {
                item.addEventListener('change', e => {
                    const selectId = item.dataset.id;
                    if (item.checked) {
                        if (this.selectRows.indexOf(selectId) === -1) {
                            if (this.options.selectableRadio) {
                                this.selectRows = [selectId];
                            } else {
                                this.selectRows.push(selectId);
                            }
                        }
                    } else {
                        this.selectRows = this.options.selectableRadio ? [] : this.selectRows.filter(i => i != selectId);
                    }
                    this._reRenderSelectRowChecked();
                });
            });
        }

        // Menu Listeners
        if (this._getTableActions().length > 0) {
            const tableRowMenus = document.querySelectorAll(`[id^="${this.options.entity}TableMenu"]`);
            [...tableRowMenus].forEach(element => {
                element.addEventListener('click', e => {
                    e.preventDefault();
                    e.stopPropagation();

                    const id = element.getAttribute('key');
                    const params = (element.dataset.params ?? '').split('_');

                    this._renderActionMenu(id, element, true, params);
                });
            });

            const tableRow = document.querySelectorAll(`#${this.options.entity}Table tbody tr`);
            [...tableRow].forEach(tr => {
                tr.addEventListener('contextmenu', e => {
                    e.preventDefault();

                    const id = tr.getAttribute('key');
                    const params = (tr.dataset.params ?? '').split('_');
                    this._renderActionMenu(id, { x: e.pageX, y: e.pageY }, false, params);
                });
            });
        }
    }

    _setResizeListener() {
        const entityName = this.options.entity;
        const table = document.getElementById(`${entityName}Table`);

        let row = table.getElementsByTagName('tr')[0],
            cols = row ? row.children : undefined;
        if (!cols) return;

        table.style.overflow = 'hidden';

        let tableHeight = table.offsetHeight;

        for (let i = 0; i < cols.length; i++) {
            let div = createDiv(tableHeight);
            cols[i].appendChild(div);
            cols[i].style.position = 'relative';
            setListeners(div);
        }

        function setListeners(div) {
            let pageX, curCol, nxtCol, curColWidth, nxtColWidth, tableWidth;

            div.addEventListener('mousedown', function (e) {

                tableWidth = document.getElementById(`${entityName}Table`).offsetWidth;
                curCol = e.target.parentElement;
                nxtCol = curCol.nextElementSibling;
                pageX = e.pageX;

                let padding = paddingDiff(curCol);

                curColWidth = curCol.offsetWidth - padding;
                //  if (nxtCol)
                //nxtColWidth = nxtCol.offsetWidth - padding;
            });

            div.addEventListener('mouseover', function (e) {
                e.target.style.borderRight = '2px solid var(--color1-6)';
            })

            div.addEventListener('mouseout', function (e) {
                e.target.style.borderRight = '';
            })

            document.addEventListener('mousemove', function (e) {
                if (curCol) {
                    let diffX = e.pageX - pageX;

                    // if (nxtCol)
                    //nxtCol.style.width = (nxtColWidth - (diffX)) + 'px';

                    curCol.style.width = (curColWidth + diffX) + 'px';
                    document.getElementById(`${entityName}Table`).style.width = tableWidth + diffX + "px"
                }
            });

            document.addEventListener('mouseup', function (e) {
                curCol = undefined;
                nxtCol = undefined;
                pageX = undefined;
                nxtColWidth = undefined;
                curColWidth = undefined
            });
        }

        function createDiv(height) {
            let div = document.createElement('div');
            div.style.top = 0;
            div.style.right = 0;
            div.style.width = '5px';
            div.style.position = 'absolute';
            div.style.cursor = 'col-resize';
            div.style.userSelect = 'none';
            // div.style.height = height + 'px';
            div.style.height = '100%';
            return div;
        }

        function paddingDiff(col) {

            if (getStyleVal(col, 'box-sizing') == 'border-box') {
                return 0;
            }

            let padLeft = getStyleVal(col, 'padding-left');
            let padRight = getStyleVal(col, 'padding-right');
            return (parseInt(padLeft) + parseInt(padRight));

        }

        function getStyleVal(elm, css) {
            return (window.getComputedStyle(elm, null).getPropertyValue(css))
        }
    }

    _renderSummary() {
        // Validate
        if (this.summaryFields.length === 0) {
            return;
        }

        // Init
        const calcValues = (values = [], ope = 'sum') => {
            if (values.length === 0) {
                return 0;
            }

            let total = 0;

            if (ope === 'sum' || ope === 'avg') {
                total = values.reduce((a, b) => a + b, 0);
            } else if (ope === 'max') {
                total = values.reduce((a, b) => a < b ? b : a, values[0]);
            } else if (ope === 'min') {
                total = values.reduce((a, b) => a > b ? b : a, values[0]);
            }

            if (ope === 'avg') {
                total = total / values.length;
            }

            return total;
        }

        const summaryHtml = this._getVisibleColumns().map(col => {
            const colData = this.summaryFields.find(summary => summary.field === col.field);
            return colData ? `<td>${SnFormatNumber(calcValues(colData.values, colData.summaryOperator ?? 'sum'))}</td>` : '<td></td>';
        }).join('');

        let entityTableFoot = document.getElementById(`${this.options.entity}TableFoot`);
        entityTableFoot.innerHTML = `<tr>${this.options.selectable ? '<td></td>' : ''}${summaryHtml}</tr>`;
    }

    _renderPagination() {
        const result = this.result;
        let pagina = parseInt(result.current);
        let totalPage = parseInt(result.pages);

        let linksQuantity = 3;
        let lastPage = totalPage;
        let startPage = ((pagina - linksQuantity) > 0) ? pagina - linksQuantity : 1;
        let endPage = ((pagina + linksQuantity) < totalPage) ? pagina + linksQuantity : totalPage;

        let paginationHtml = '';
        if (totalPage > 1) {

            paginationHtml = '<nav aria-label="..."><ul class="SnPagination">';

            let claseCss = (pagina == 1) ? "disabled" : "";
            paginationHtml += `<li class="SnPagination-item ${claseCss}"><button id="${this.options.entity}PreviousPage" class="SnPagination-link"><i class="fas fa-chevron-left"></i></button></li>`;

            if (startPage > 1) {
                paginationHtml += `<li class="SnPagination-item"><button id="${this.options.entity}FirstPage" class="SnPagination-link">1</button></li>`;
                paginationHtml += '<li class="SnPagination-item disabled"><span class="SnPagination-link">...</span></li>';
            }

            // for ($i = startPage; $i <= endPage; $i++) {
            for (let i = startPage; i <= endPage; i++) {
                claseCss = (pagina == i) ? "active" : "";
                paginationHtml += `<li class="SnPagination-item ${claseCss}"><button class="SnPagination-link js${this.options.entity}Page" data-id="${i}">${i}</button></li>`;
            }

            if (endPage < lastPage) {
                paginationHtml += '<li class="SnPagination-item disabled"><span class="SnPagination-link">...</span></li>';
                paginationHtml += `<li class="SnPagination-item"><button id="${this.options.entity}LastPage" class="SnPagination-link">${lastPage}</button></li>`;
            }

            claseCss = (pagina == lastPage || totalPage == 0) ? "disabled" : "";
            paginationHtml += `<li class="SnPagination-item ${claseCss}"><button id="${this.options.entity}NextPage" class="SnPagination-link"><i class="fas fa-chevron-right"></i></button></li>`;
            paginationHtml += '</ul></nav>';
        }

        let tableFooter = `
            <div class="SnDataTable-pagination SnMt-3">
                <div class="SnDataTable-pagination-left">Mostrando: <span>${result.data.length} de ${result.total}</span></div>
                <div class="SnDataTable-pagination-center">
                    ${paginationHtml}
                </div>
                <div class="SnDataTable-pagination-right">
                    <select class="SnForm-control" id="${this.options.entity}Limit">` +
            [10, 20, 50, 100, 200, 300, 500, 1000].map(value => `<option value="${value}" ${value == result.limit ? 'selected' : ''}>${value}</option>`).join('') +
            `</select>
                </div>
            </div>
        `;

        let entityPagination = document.getElementById(`${this.options.entity}Pagination`);
        entityPagination.innerHTML = tableFooter;


        // Limit Event
        let entityLimit = document.getElementById(`${this.options.entity}Limit`);
        entityLimit.addEventListener('change', () => {
            this.limit = entityLimit.value;
            this.getData();
        });

        // Pagination listeners
        if (totalPage > 1) {
            let previousPageEle = document.getElementById(`${this.options.entity}PreviousPage`);
            if (previousPageEle) {
                previousPageEle.addEventListener('click', e => {
                    e.preventDefault();
                    this.page = pagina - 1;
                    this.getData();
                });
            }

            let firstPageEle = document.getElementById(`${this.options.entity}FirstPage`);
            if (firstPageEle) {
                firstPageEle.addEventListener('click', e => {
                    e.preventDefault();
                    this.page = 1;
                    this.getData();
                });
            }

            let pageEle = document.querySelectorAll(`.js${this.options.entity}Page`);
            pageEle.forEach(p => {
                p.addEventListener('click', e => {
                    e.preventDefault();
                    this.page = p.dataset.id;
                    this.getData();
                });
            });

            let lastPageEle = document.getElementById(`${this.options.entity}LastPage`);
            if (lastPageEle) {
                lastPageEle.addEventListener('click', e => {
                    e.preventDefault();
                    this.page = lastPage;
                    this.getData();
                });
            }

            let nextPageEle = document.getElementById(`${this.options.entity}NextPage`);
            if (nextPageEle) {
                nextPageEle.addEventListener('click', e => {
                    e.preventDefault();
                    this.page = pagina + 1;
                    this.getData();
                });
            }
        }
    }

    //  ========================================================================================
    //  T A B L E     Z O N E    B U I L D S
    _buildEmptyRow() {
        return `<tr>
                    <td colspan="${this.options.columns.length + (this.options.selectable ? 1 : 0)}">
                        <div class="SnEmpty">

                            <div>No hay datos que mostrar</div>
                        </div>
                    </td>
                </tr>`;
    }

    _buildMenuButton(col, item) {
        const paramValues = this._getTableActionParamValues(item);
        return `<td style="padding: 0"><div class="SnTable-menu jsAction"><span>${this._buildCustomRow(col, item)}</span><button type="button" class="SnBtn jsAction" id="${this.options.entity}TableMenu_${item.id}" key="${item.id}" data-params="${paramValues}" title="Mostrar más opciones"><i class="fa-solid fa-ellipsis-vertical"></i></button></div></td>`;
    }

    _buildCustomRow(row, item) {
        if (row.customRender && typeof row.customRender === "function") {
            return row.customRender(item, this);
        } else {
            return item[row.field];
        }
    }

    _buildDataRow(item) {
        return this._getVisibleColumns().map((col, colIndex) => (colIndex === 0 && this._getTableActions().length > 0) ? this._buildMenuButton(col, item) : `<td>${this._buildCustomRow(col, item)}</td>`).join('')
    }

    //  ========================================================================================
    //  P O R T A L
    _renderActionMenu(id, positionOrElement, toggle, params = []) {
        let actionHtml = '';
        this._getTableActions().forEach((act, idx) => {
            const eventName = (act?.event_name_prefix?.length > 1 ? act.event_name_prefix : this.options.entity) + act.event_name;
            actionHtml += `<li class="SnList-item jsAction" key="${act.id || idx}" onclick="${eventName}('${this.options.entity}','${act.screen_id_controller}', [${params.join(',')}])">
                                    <i class="${act.icon} SnMr-2"></i>${act.title}
                                </li>`;
        });

        actionHtml = `<ul class="SnList menu" style="right: 0; min-width: auto">${actionHtml}</ul>`;

        this.renderMenuPortal(id, positionOrElement, actionHtml, toggle);
    }

    renderMenuPortal(key, positionOrElement, content = "", toggle = true) {
        const setPositionByElement = (portalNode, referElement) => {
            let top = 0, left = 0;
            const referElementRect = referElement.getBoundingClientRect();
            const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const elementHeight = referElement.offsetHeight;
            const elementWidth = referElement.offsetWidth;

            // Get portal size
            const portalNodeRect = portalNode.getBoundingClientRect();

            // Calculate Top or Button
            const virtualTop = (referElementRect.top + scrollTop + elementHeight);
            if ((virtualTop + portalNodeRect.height) < window.innerHeight) {
                top = virtualTop + 'px';
            } else {
                top = (virtualTop - (portalNodeRect.height + elementHeight)) + 'px';
            }

            // Calculate Left or Right
            const virtualLeft = (referElementRect.left + scrollLeft + elementWidth);
            if (virtualLeft < portalNodeRect.width) {
                left = virtualLeft + 'px';
            } else {
                left = (virtualLeft - portalNodeRect.width) + 'px';
            }

            // Set final position
            portalNode.style.top = top;
            portalNode.style.left = left;
        }

        const setPositionByXY = (portalNode, x, y) => {
            let top = 0, left = 0;

            const portalNodeRect = portalNode.getBoundingClientRect();

            if ((y + portalNodeRect.height) < window.innerHeight) {
                top = y + 'px';
            } else {
                top = (y - portalNodeRect.height) + 'px';
            }

            if ((x + portalNodeRect.width) < window.innerWidth) {
                left = x + 'px';
            } else {
                left = (x - portalNodeRect.width) + 'px';
            }

            // Set final position
            portalNode.style.top = top;
            portalNode.style.left = left;
        }

        // Create element
        let portalNode = document.getElementById(`${this.options.entity}TableRowMenuPortal`);
        if (!portalNode) {
            portalNode = document.createElement('div');
            portalNode.setAttribute('id', `${this.options.entity}TableRowMenuPortal`);
            portalNode.classList.add('SnPortal');

            document.body.appendChild(portalNode);
        } else {
            const origin = portalNode.getAttribute('origin');
            if (toggle && origin == key) { // Remove is some origin
                portalNode.remove();
                return;
            }
        }

        portalNode.setAttribute('origin', key); // Set current origin

        // Render element
        portalNode.innerHTML = content;

        // Set position element
        if (!positionOrElement.parentNode) { // IS NOT DOM ELEMENT
            setPositionByXY(portalNode, positionOrElement.x, positionOrElement.y);
        } else { // IS DOM ELEMENT
            setPositionByElement(portalNode, positionOrElement);
        }
    }

    //  ========================================================================================
    //  C H E C K B O X      S E L E C T E D
    _buildSelectColumn(item) {
        if (this.options.selectable) {
            return `<td><input type="checkbox" class="jsAction" id="${this.options.entity}TableRowSelect${item[this.rowKey]}" data-id="${item[this.rowKey]}"></td>`;
        } else {
            return '';
        }
    }

    _reRenderSelectRowChecked() {
        [...document.querySelectorAll(`[id^="${this.options.entity}TableRowSelect"]`)].forEach(row => {
            row.checked = false;
        });

        this.selectRows.forEach(row => {
            const rowSelect = document.getElementById(`${this.options.entity}TableRowSelect${row}`);
            if (rowSelect) {
                rowSelect.checked = true;
            }
        });

        if (this.options.onSelectChange && typeof this.options.onSelectChange === "function") {
            this.options.onSelectChange(this);
        }
    }

    //  ========================================================================================
    //  C U S T O M      F I L T E R
    setTableColumnFilter(fieldName, fieldValue) {
        this.filter.setCustomFilterGroup(0, fieldName, fieldValue);
        this.page = 1;
        this.getData();

        this._renderFilterDescriptions();
    }

    getTableColumnFilterValue(fieldName) {
        const indexMatch = this.filter.filters.findIndex(item => item.id === 0);
        const columnMatch = this.filter.filters[indexMatch]?.eval?.find(item => item.field === fieldName);
        return columnMatch?.value1;
    }

    _renderFilterDescriptions() {
        const formatedValue = (value, type) => {
            if (!['datetime-local', 'date'].includes(type)) {
                return value;
            }
            if ((value || '').length === 0) {
                return value;
            }

            const months = [
                'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
                'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
            ];

            const dateParts = value.split(" ");
            const date = dateParts[0];
            const time = dateParts[1];

            const [year, month, day] = date.split("-");
            const monthName = months[parseInt(month, 10) - 1];

            let result = `${parseInt(day, 10)} de ${monthName} de ${year}`;

            // if (time) {
            //   const [hourPart, minutePart] = time.split(":");
            //   result += ` a las ${hourPart}:${minutePart}`;
            // }

            return result;
        }

        const filterDescription = document.getElementById(`${this.options.entity}FilterDescription`);
        const allFilterLenght = this.filter.filters.reduce((prev, current) => (current.eval.length > 0) ? (prev + 1) : prev, 0);

        let text = '';
        this.filter.filters.forEach((cf, inx) => {
            if (allFilterLenght.length > 1) {
                if (cf.logicalOperator.toUpperCase() === 'OR' && cf.prefix.toUpperCase() === 'DONDE') {
                    text += inx == 0 ? '<div>Ya sea<div>' : '<div>O<div>';
                } else if (cf.logicalOperator.toUpperCase() === 'OR' && cf.prefix.toUpperCase() === 'DONDE NO') {
                    text += '<div>Ni tampoco<div>';
                }
            }

            // Content
            cf.eval.forEach(ev => {
                const colfield = this.options.columns.find(item => item.field === ev.field);
                let textContent = `<span>${cf.prefix}</span> <span>${colfield.title}</span> <strong>${ev.operator}</strong> ${formatedValue(ev.value1, colfield.type)}${ev.value2?.length > 0 ? (' y ' + formatedValue(ev.value2, colfield.type)) : ''}`.toLowerCase();
                textContent = textContent.charAt(0).toUpperCase() + textContent.slice(1);

                text += `<span class="SnTag SnMr-2 SnMb-2 jsFilterDescriptionTag${this.options.entity}">${textContent}<span class="SnBtn radio icon SnMl-2 jsFilterDescriptionRemove${this.options.entity}" title="Quitar filtro" data-parentid="${cf.id}" data-id="${ev.id}"><i>${SnIcon.close}</i></span></span>`
            });

        });

        if (text.length > 0) {
            text = 'Filtro: ' + text;
        }

        filterDescription.innerHTML = text;

        // Filter description remove
        let jsFilterDescriptionRemove = document.querySelectorAll(`.jsFilterDescriptionRemove${this.options.entity}`);
        jsFilterDescriptionRemove.forEach(item => {
            const itemDataset = item.dataset;
            const parentid = itemDataset.parentid;
            const id = itemDataset.id;

            item.addEventListener('click', e => {
                e.preventDefault();
                e.stopPropagation();

                this.filter.removeFilter(id, parentid);
                this.getData();

                // Only in filter head
                if (parentid == '0') {
                    this._renderTableHead();
                }
            });
        });

        // Show modal
        let jsFilterDescriptionTag = document.querySelectorAll(`.jsFilterDescriptionTag${this.options.entity}`);
        jsFilterDescriptionTag.forEach(item => {
            item.addEventListener('click', e => {
                e.preventDefault();
                SnModal.open(`${this.options.entity}ModalFilter`);
            });
        });
    }

    //  ========================================================================================
    //  S H O W     A N D     H I D E     C O L U M N S
    _reRenderColumnFilter(hasChange, search = '') {
        const listCols = document.getElementById(`${this.options.entity}ListCols`);
        for (const item of listCols.children) {

            // Get elements
            const checkbox = item.querySelector('input');
            const colItem = this.options.columns.find(item => item.id === checkbox.dataset.key);

            if (colItem) {
                // cheked elments
                checkbox.checked = colItem.visible === true;

                // Hide and show columns
                if (search.length > 0) {
                    item.classList.toggle('hidden', !colItem.title.toLocaleLowerCase().includes(search.toLocaleLowerCase()));
                } else {
                    item.classList.remove('hidden');
                }
            }
        }

        if (hasChange) {
            this._renderTableHead();
            this._renderTableBody();
        }
    }
}

export default SnTable;

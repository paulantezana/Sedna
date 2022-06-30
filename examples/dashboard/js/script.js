SnMenu({
    menuId: 'HeaderMenu',
    toggleButtonID: 'HeaderMenu-toggle',
    toggleClass: 'HeaderMenu-is-show',
    contextId: 'AdminLayout',
    parentClose: true,
    menuCloseID: 'HeaderMenu-wrapper',
});

SnMenu({
    menuId: 'AsideMenu',
    toggleButtonID: 'AsideMenu-toggle',
    toggleClass: 'AsideMenu-is-show',
    contextId: 'AdminLayout',
    parentClose: true,
    menuCloseID: 'AsideMenu-wrapper',
});

function userSubmit(){
    event.preventDefault();
    SnModal.close('userModalForm');
}

function userDelete(userId, content = ''){
    SnModal.confirm({
        title: '¿Estás seguro de eliminar este registro?',
        content: content,
        okText: 'Si',
        okType: 'danger',
        cancelText: 'No',
        onOk() {
        }
    });
}

function userShowModalCreate(){
    SnModal.open('userModalForm');
}

function userShowModalUpdate(userId){
    SnModal.open('userModalForm');
}

function userToExcel(){
    let dataTable = document.getElementById('userTable');
    if(dataTable){
        window.open('data:application/vnd.ms-excel,' + encodeURIComponent(dataTable.outerHTML));
    }
}

function userToPrint(){
    
}
export  function SnInput() {
    let togglePassword = document.querySelectorAll('.togglePassword');
    if (togglePassword){
        togglePassword.forEach(item=>{
            let state = 0;
            item.addEventListener('click',e=>{
                item.previousElementSibling.type = state === 0 ? 'text' : 'password';
                state = state === 0 ? 1 : 0;
            })
        });
    }
};
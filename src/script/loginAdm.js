function showPassword(){
    var passwordInput = document.getElementById('senha')
    var buttonShowPassword = document.getElementById('btn-show')

    if(passwordInput.type === 'password'){
        passwordInput.setAttribute('type', 'text')
        buttonShowPassword.classList.replace('fa-eye-slash', 'fa-eye')
    } else {
        passwordInput.setAttribute('type', 'password')
        buttonShowPassword.classList.replace('fa-eye', 'fa-eye-slash')
    }
}

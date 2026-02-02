const facebookProvider = new firebase.auth.FacebookAuthProvider();

function loginWithFacebook() {
    showLoading();
    firebase.auth().signInWithPopup(facebookProvider)
        .then(() => {
            window.location.href = "pages/home/home.html";
        })
        .catch((error) => {
            hidenLoading();
            alert("Erro: " + error.message);
        });
}

//função chamada quando o campo de email e senha sofre alteração

function onChangeEmail(){
   toggleButtonsDisable();
   toggleEmailErrors();
}

function onChangePassword(){
    toggleButtonsDisable();
    togglePasswordErrors();
}


//verifica se o email digitado é valido
function isEmailValid(){
    const email = form.email().value;
    if (!email){
        return false;
    }
    return validateEmail(email);
}

//verifica se a senha foi preenchida
function isPasswordValid(){
    const password = form.password().value;
    
    if(!password){
        return false;
    }
    return true;
}


//funções para desabilitar ou habilitar botoes 
function toggleButtonsDisable(){
    const emailValid = isEmailValid();
    form.forgotPassword().disabled = !emailValid;

    const passwordValid = isPasswordValid()
    form.login().disabled = !emailValid || !passwordValid;
}

//mostra ou oculta erros de validação do usuario no email
function toggleEmailErrors(){
    const email = form.email().value;
    
    form.emailRequiredError().style.display = !email ? "block" : "none";
    form.email().style.border = !email ? "solid 2px #7a1250" : "solid 2px #160038";
    
    form.emailRequiredError().style.display = validateEmail(email) ? "none" : "block"
    form.email().style.border = validateEmail(email) ? "solid 2px #160038" : "solid 2px #7a1250"
    

}

//mostra ou oculta erros de validação da senha
function togglePasswordErrors(){
    const password = form.password().value;
    if(!password){
        form.passwordRequiredError().style.display='block';
        form.password().style.border = "solid 2px #7a1250"
    } else {
        form.passwordRequiredError().style.display = 'none';
        form.password().style.border = "solid 2px #160038"
    }
}

function recoverPassword(){
    showLoading();
    firebase.auth().sendPasswordResetEmail(form.email().value).then(()=>{
        hidenLoading()
        alert("Se este email estiver cadastrado, você receberá um link para redefinir sua senha.")
    }).catch(error => {
        hidenLoading();
        alert(getErrorMessage(error));
    });
}


//verifica se o campo de email esta digitado corretamente
function validateEmail(email){
    return /\S+@\S+\.\S+/.test(email);
}

//mapeamento dos elementos para facilitar usabilidade 
const form = {
   email: () => document.getElementById('email'),
   password: () => document.getElementById('password'),
   passwordRequiredError: () => document.getElementById('password-required-error'),
   emailRequiredError: ()=> document.getElementById('email-invalid-error'),
   login: ()=> document.getElementById("login"),
   forgotPassword: ()=> document.getElementById('forgot-password')
}

//função responsável por reconhecer se o email e senha digitado pelo usuário estão corretos, e caso contrário
//alertar o usuário de que sua credenciais estão incorretas

function loginUser(){
    showLoading()
    firebase.auth().signInWithEmailAndPassword(
        form.email().value, form.password().value
    ).then(response =>{
        hidenLoading()
       window.location.href = "pages/home/home.html"
    }).catch(error =>{
        hidenLoading()
        alert(getErrorMessage(error))
    })

}

//função com as informações de alerta de senha ou email incorretas
function getErrorMessage(error){
    if(error.code == "auth/invalid-credential"){
        return "Usuário ou senha estão incorretas";
    }
    if(error.code == "auth/wrong-password"){
        return "Senha Invalida"
    }
    return error.message
}

function registerUser(){
    showLoading()
     window.location.href = "pages/register/register.html"
}
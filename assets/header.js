
var header = document.querySelector(".header");
var headerOpened = "header_open";

var login = document.querySelector('.login');
var logged = false;
var loginActive = "login_active"
var loginOpened = "login_open"

if (localStorage.getItem('token')){
    logged = true;
    login.classList.add(loginActive);
    login.querySelector(".login_text").innerHTML = "Konto";
}

login.addEventListener('click', () => {
    if (logged){
        var classes = login.classList;
        if (classes.contains(loginOpened)){
            classes.remove(loginOpened);
        }else{
            classes.add(loginOpened);
        }
    }else{
        header.classList.remove(headerOpened);
        location.href = '/login'
    }
})

document.querySelector(".hamburger").addEventListener('click', () => {
    header.classList.add(headerOpened);
});

document.querySelector(".header_opacity").addEventListener('click', () => {
    closeHeader();
});

document.querySelector(".x").addEventListener('click', () => {
    closeHeader();
});

function closeHeader(){
    header.classList.remove(headerOpened);
}


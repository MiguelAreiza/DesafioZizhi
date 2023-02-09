'use strict';
function Redirect() {

    this.Facebook = () => {
        window.open('https://www.facebook.com/natalia.areizavalencia/');
    }

    this.Instagram = () => {
        window.open('https://www.instagram.com/natyareiza85/');
    }

    this.WhatsApp = () => {
        window.open('https://api.whatsapp.com/send?phone=573147207849&text=');        
    }
    
}

function Toastr() {

    this.Info = (mesagge, title) => { 
        newMesagge(mesagge, title, 'toast-info');
    }

    this.Success = (mesagge, title) => {
        newMesagge(mesagge, title, 'toast-success');
    }

    this.Error = (mesagge, title) => {
        newMesagge(mesagge, title, 'toast-error');
    }

    this.Warning = (mesagge, title) => {
        newMesagge(mesagge, title, 'toast-warning');
    }
    
    function newMesagge(mesagge, title, type, id = newId()) {
        
        let data = $('#notifications :last-child').html() || '';

        if (!data.includes(mesagge)) {
            
            title ? title = `<b class="title">${title}</b>`: title = '';

            $('#notifications').append(`<div class="toast ${type}" id="${id}">${title}${mesagge}</div>`);
    
            $(`#${id}`).click(()=>{
                $(`#${id}`).remove();
            })
        
            setTimeout(() => {
                $(`#${id}`).remove();
            }, 10000);

        }

    }   

}

function GoLocation() {

    this.ChangeView = (urlView) => {

        fetch(urlView).then(async (response) => {
            $('body').html(await response.text());
        }).catch(() => {
            toastr.Error('Error en la transaccion');
        });

    }

}

function newId() {

    let Codigo = '';

    for (let i = 0; i < 3; i++) {   

        let str1, str2, str3, str4;
        /*Generar numeros random de acuerdo al codigo ASCII y convertirlos*/
        str1 = String.fromCharCode(Math.round((Math.random() * (57 - 48)) + 48));
        str2 = String.fromCharCode(Math.round((Math.random() * (90 - 65)) + 65));
        str3 = String.fromCharCode(Math.round((Math.random() * (122 - 97)) + 97));
        str4 = String.fromCharCode(Math.round((Math.random() * (57 - 48)) + 48));    

        /*Integrarlo al codigo*/
        Codigo += `${str1}${str2}${str3}${str4}`;

        if (i != 2) {
            Codigo += `-`;
        }

    }

    return Codigo;

}

function ExecSp(spName) {
    return new Promise((resolve, reject) => {
        if (!spName) {
            return reject('Error en los para metros');
        }
        fetch('https://www.appescolar.somee.com/api/Procedures/ExecProcedure', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "procedure": spName
            }),
            redirect: 'follow'
        }).then(async (response) => {        
            let data = (await response.json());
            resolve(data);        
        }).catch((error) => {    
            reject(error);    
        });
    });
}

function GetUser() {
    
    this.Id = (sessionStorage.AppUser) ? JSON.parse(sessionStorage.AppUser).Id : '';

    this.RoleId = (sessionStorage.AppUser) ? JSON.parse(sessionStorage.AppUser).RoleFk : '';

    this.TeamId = (sessionStorage.AppUser) ? JSON.parse(sessionStorage.AppUser).TeamFk : '';

    this.StrImg = (sessionStorage.AppUser) ? (JSON.parse(sessionStorage.AppUser).StrImage != null ? JSON.parse(sessionStorage.AppUser).StrImage : 'setting.png') : '';

}

var redirect = new Redirect();
var toastr = new Toastr();
var goLocation = new GoLocation();
var getUser = new GetUser();
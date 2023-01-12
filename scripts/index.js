'use strict';
$(document).ready(()=>{
        
    sessionStorage.removeItem('AppUser');
    toastr.Success('Bienvenido');
        
    $('#btnLogin').click(()=>{
        
        history.pushState(null, "", "./views/login/");        
        goLocation.ChangeView('./');

    });

    $('.facebook').click(()=>{
        redirect.Facebook();
    });

    $('.instagram').click(()=>{
        redirect.Instagram();
    });

    $('.whatsApp').click(()=>{
        redirect.WhatsApp();
    });
    
})
'use strict';

if (sessionStorage.AppUser) {
    ExecSp(`sp_ValidateUserById '${getUser.Id}';`).then((data) => {
        if (data[0].rpta) {
            throw 'bad request';
        }
        sessionStorage.setItem('AppUser', JSON.stringify(data[0]));
        $('#nameUser').html(data[0].StrName);
    }).catch((error) => {
        history.pushState(null, "", "../../../login/");
        goLocation.ChangeView('../../../login/');
        console.log('Error', error);
    });
} else {
    history.pushState(null, "", "../../../login/");
    goLocation.ChangeView('../../../login/');
}

$(document).ready(()=>{
    
    $('#btnAtras').click(()=>{
        history.pushState(null, "", "../");
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

});
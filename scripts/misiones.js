'use strict';

if (sessionStorage.AppUser) {

    var requestOptions = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "procedure": `sp_ValidateUserById '${JSON.parse(sessionStorage.AppUser).Id}';`
        }),
        redirect: 'follow'
    };
    
    fetch('https://www.appescolar.somee.com/api/Procedures/ExecProcedure', requestOptions).then(async (response) => {
    
        let data = (await response.json())[0];
        
        if (!data.rpta) {
            
            sessionStorage.setItem('AppUser', JSON.stringify(data));
            $('#nameUser').html(data.StrName);
            toastr.Success(`Dale un vistazo a las misiones`);

        } else {

            history.pushState(null, "", "../../login/");
            goLocation.ChangeView('../../views/login/');

        }
    
    }).catch((e) => {

        history.pushState(null, "", "../../login/");
        goLocation.ChangeView('../login/');
        console.log('Error', e);

    });

} else {

    history.pushState(null, "", "../../login/");
    goLocation.ChangeView('../login/');

}

$(document).ready(function() {
    
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
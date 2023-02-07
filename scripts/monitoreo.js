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
            toastr.Success(`Dale un vistazo a tu monitoreo`);

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

    $('.slideThree > input[type=checkbox]').change( (e) => {
        if (e.target.checked) {
            e.target.nextElementSibling.style.left = '43px';            
        } else {
            e.target.nextElementSibling.style.left = '3px';            
        }
    });

    $('#formMonitoreo').submit( (e) => {
        
        e.preventDefault();

        let puntaje = 0;
        
        $('#slider1')[0].checked ? puntaje += 5 : '';
        $('#slider2')[0].checked ? '' : puntaje += 5;
        $('#slider3')[0].checked ? '' : puntaje += 5;
        $('#slider4')[0].checked ? puntaje += 5 : '';
        $('#slider5')[0].checked ? '' : puntaje += 5;
        $('#slider6')[0].checked ? puntaje += 5 : '';
        $('#slider7')[0].checked ? '' : puntaje += 5;
        $('#slider8')[0].checked ? puntaje += 5 : '';
        $('#slider9')[0].checked ? puntaje += 5 : '';
        $('#slider10')[0].checked ? puntaje += 5 : '';
        $('#slider11')[0].checked ? '' : puntaje += 5;
        $('#slider12')[0].checked ? '' : puntaje += 5;
        $('#slider13')[0].checked ? puntaje += 5 : '';
        $('#slider14')[0].checked ? puntaje += 5 : '';

        if (puntaje !== 0) {
            var requestOptions = {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "procedure": `sp_AddPointsTeam '${getUser.TeamId}', ${puntaje}, '${getUser.Id}';`
                }),
                redirect: 'follow'
            };
            
            fetch('https://www.appescolar.somee.com/api/Procedures/ExecProcedure', requestOptions).then(async (response) => {
            
                let data = (await response.json())[0];
                
                if (!data.rpta) {
                    let correctas = puntaje / 5;
                    toastr.Success(`Se sumaron ${puntaje} puntos a tu equipo, correctas ${correctas}/14`);
                    setTimeout(() => {
                        history.pushState(null, "", "../");
                        goLocation.ChangeView('./');
                    }, 5000);
        
                } else {

                    if (data.rpta == -5) {                        
                        toastr.Info('Ya realizaste el monitoreo de esta semana');
                        return;
                    }
                    
                    toastr.Warning('Error al grabar los puntos');
                    setTimeout(() => {
                        history.pushState(null, "", "../");
                        goLocation.ChangeView('./');
                    }, 2000);
        
                }
            
            }).catch((e) => {   
                toastr.Error('Contacta tu administrador');  
            });
        }
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
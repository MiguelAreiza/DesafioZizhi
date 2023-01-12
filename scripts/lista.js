'use strict';

if (sessionStorage.AppUser) {

    let requestOptions = {
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
            toastr.Success(`Compartenos todas tus metas`);

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

    let goalList = [];


    let requestOptions = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "procedure": `sp_GoalByUser '${JSON.parse(sessionStorage.AppUser).Id}';`
        }),
        redirect: 'follow'
    };
    
    fetch('https://www.appescolar.somee.com/api/Procedures/ExecProcedure', requestOptions).then(async (response) => {

        let data = (await response.json());

        if (data.length == 0) {
            
            toastr.Info(`Aún no has creado metas`);

        } else if (!data[0].rpta) {

            goalList = data;
            UpdateGoalList();

        } else {
            toastr.Error('Error en la transacción');
        }            
    
    }).catch( error => console.log('Error', error));

    $('#btnCreate').click(()=>{

        let goal = $('#goal').val();
        let color = $('#color').val();

        if (!goal || !color) {

            toastr.Warning('Diligencia los campos requeridos');
            
        } else{
            
            $('#goal').val('');
            $('#color').val('#cccccc');

            let requestOptions = {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "procedure": `sp_CreateGoal '${JSON.parse(sessionStorage.AppUser).Id}', '${goal}', '${color}';`
                }),
                redirect: 'follow'
            };
            
            fetch('https://www.appescolar.somee.com/api/Procedures/ExecProcedure', requestOptions).then(async (response) => {
    
                let data = (await response.json());
    
                if (!data[0].rpta) {
    
                    goalList = data;
                    toastr.Success('Meta creada correctamente');
                    UpdateGoalList();
    
                } else {
                    toastr.Warning('Ya existe esta meta');
                }            
            
            }).catch( error => console.log('Error', error));            

        }
    
    });

  
    function UpdateGoalList() {

        let html = ``;

        for (let i = 0; i < goalList.length; i++) {

            html += `<div class="goal" id="${goalList[i].Id}" style="background:${goalList[i].StrColor};">
                        <label ${goalList[i].BlStatus ? 'class="complete"':''}>${goalList[i].StrGoal}</label>
                        <button></button>
                    </div>`;

        }

        $('#goalList').html(html);

        for (let i = 0; i < goalList.length; i++) {

            $(`#${goalList[i].Id}`).dblclick(()=>{

                if (!goalList[i].BlStatus) {

                    let requestOptions = {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            "procedure": `sp_ChangeStatus '${goalList[i].Id}', '${JSON.parse(sessionStorage.AppUser).Id}';`
                        }),
                        redirect: 'follow'
                    };
                    
                    fetch('https://www.appescolar.somee.com/api/Procedures/ExecProcedure', requestOptions).then(async (response) => {
            
                        let data = (await response.json());
            
                        if (!data[0].rpta) {
            
                            goalList = data;                            
                            toastr.Info('Meta completada');
                            UpdateGoalList();
            
                        } else {
                            toastr.Error('Error en la transacción');
                        }            
                    
                    }).catch( error => console.log('Error', error));

                }


            });

            $(`#${goalList[i].Id} > button`).click(()=>{
                
                let requestOptions = {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        "procedure": `sp_DeleteGoal '${goalList[i].Id}', '${JSON.parse(sessionStorage.AppUser).Id}';`
                    }),
                    redirect: 'follow'
                };

                fetch('https://www.appescolar.somee.com/api/Procedures/ExecProcedure', requestOptions).then(async (response) => {

                    let data = (await response.json());

                    if (data.length == 0) {

                        $('#goalList').html('');

                    } else if (!data[0].rpta) {

                        goalList = data;                            
                        toastr.Info('Meta eliminada');
                        UpdateGoalList();

                    } else {
                        toastr.Error('Error en la transacción');
                    }

                }).catch( error => console.log('Error', error));
                
            });

        }

    }
    
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
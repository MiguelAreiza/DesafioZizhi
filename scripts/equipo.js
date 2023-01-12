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

    let requestOptions = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "procedure": `sp_TeamByUser '${JSON.parse(sessionStorage.AppUser).Id}';`
        }),
        redirect: 'follow'
    };
    
    fetch('https://www.appescolar.somee.com/api/Procedures/ExecProcedure', requestOptions).then(async (response) => {
    
        let data = (await response.json());
        
        if (!data[0].rpta) {
            
            let html = ``;

            for (let i = 0; i < data.length; i++) {
                html += `<option value="${data[i].Id}">${data[i].StrName}</option>`;
            }

            $('#cboCoordinador').html(`<option value="" selected>Coordinador/a</option>${html}`);
            $('#cboPortavoz').html(`<option value="" selected>Portavoz</option>${html}`);
            $('#cboSecretario').html(`<option value="" selected>Secretario/a</option>${html}`);
            $('#cboSupervisor').html(`<option value="" selected>Supervisor/a</option>${html}`);
            
            let requestOptions = {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "procedure": `sp_CboUsersTeam '${JSON.parse(sessionStorage.AppUser).Id}';`
                }),
                redirect: 'follow'
            };

            fetch('https://www.appescolar.somee.com/api/Procedures/ExecProcedure', requestOptions).then(async (response) => {
        
                let users = (await response.json());
            
                if (!users.rpta) {
                    let html = ``;

                    for (let i = 0; i < users.length; i++) {
                        html += `<option value="${users[i].Id}">${users[i].StrName}</option>`;
                    }

                    $('#cboFriend1').html(`<option value="" selected>Integrante 1</option>${html}`);
                    $('#cboFriend2').html(`<option value="" selected>Integrante 2</option>${html}`);
                    $('#cboFriend3').html(`<option value="" selected>Integrante 3</option>${html}`);
                    $('#cboFriend4').html(`<option value="" selected>Integrante 4</option>${html}`);
                    
                    for (let i = 0; i < data.length; i++) {
                        $(`#cboFriend${i + 1}`).val(data[i].Id);
                        $(`#cboFriend${i + 1}`).prop('disabled', 'true');
                        if (data[i].StrJob == 'Coordinador') {
                            $('#cboCoordinador').html(`<option value="" selected>Coordinador/a</option>
                                                       <option value="${data[i].Id}">${data[i].StrName}</option>`);
                            $('#cboCoordinador').val(data[i].Id);
                        }
                        if (data[i].StrJob == 'Portavoz') {
                            $('#cboPortavoz').html(`<option value="" selected>Portavoz</option>
                                                    <option value="${data[i].Id}">${data[i].StrName}</option>`);
                            $('#cboPortavoz').val(data[i].Id);
                        }
                        if (data[i].StrJob == 'Secretario') {
                            $('#cboSecretario').html(`<option value="" selected>Secretario/a</option>
                                                      <option value="${data[i].Id}">${data[i].StrName}</option>`);
                            $('#cboSecretario').val(data[i].Id);
                        }
                        if (data[i].StrJob == 'Supervisor') {
                            $('#cboSupervisor').html(`<option value="" selected>Supervisor/a</option>
                                                      <option value="${data[i].Id}">${data[i].StrName}</option>`);
                            $('#cboSupervisor').val(data[i].Id);
                        }                            
                    }

                    if (data.length < 4) {
                        $('.usersTeam').hide();
                        $('.readings').hide();
                        $('.rolesTeam').hide();
                        $('.videoTeam').attr('src', 'https://www.youtube.com/embed/1v6JZqNSF0o?controls=0&autoplay=1');
                        setTimeout(() => {
                            $('.usersTeam').show();
                            $('.readings').show();
                            $('.rolesTeam').show();
                        }, 154000);
                    } else {
                        $('#cboFriend1').val(data[0].Id);
                        $('#cboFriend2').val(data[1].Id);
                        $('#cboFriend3').val(data[2].Id);
                        $('#cboFriend4').val(data[3].Id);
                        $('#cboFriend1').prop('disabled', 'true');
                        $('#cboFriend2').prop('disabled', 'true');
                        $('#cboFriend3').prop('disabled', 'true');
                        $('#cboFriend4').prop('disabled', 'true');
                        $('#btnConfirm').hide();
                    }
                    $('#nameTeam').html(data[0].TeamName);
                    toastr.Success('Dale un vistazo a tu equipo');

                } else {
                    toastr.Info('Aun no hay usuarios');
                }
            }).catch((e) => {
                toastr.Error('Contacta tu administrador', 'Error');
                console.log('Error', e);
            });            
            
        } else {
            $('.cardTeam').css('height', '80vh');
            $('#formFriends').css('height', '0');
            $('#formFriends').hide();
            $('#formTeam').show();
            setTimeout(() => {
                $('#formTeam').css('height', '100%');
            }, 100);
            toastr.Info('Es hora de crear tu equipo');
        }

    }).catch((e) => {
        toastr.Error('Contacta tu administrador', 'Error');
        console.log('Error', e);
    });

    $('#btnCreate').click((e) => {
        let name = e.target.form[0].value;
        let meaning = e.target.form[1].value;
        let goals = e.target.form[2].value;

        if (!name || !meaning || !goals) {
            toastr.Warning('Completa los campos primero');
        }
    });

    $('#formTeam').submit((e) => {
        e.preventDefault();

        let name = e.target[0].value;
        let meaning = e.target[1].value;
        let goals = e.target[2].value;

        let requestOptions = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "procedure": `sp_CreateTeam '${JSON.parse(sessionStorage.AppUser).Id}', '${name}', '${meaning}', '${goals}';`
            }),
            redirect: 'follow'
        };
        
        fetch('https://www.appescolar.somee.com/api/Procedures/ExecProcedure', requestOptions).then(async (response) => {
        
            let data = (await response.json())[0];
            
            if (!data.rpta) {
                $('#formTeam').css('height', '0');
                setTimeout(() => {
                    $('#formTeam').hide();
                    $('#formFriends').show();
                    setTimeout(() => {
                        location.reload()
                    }, 100);
                }, 1500);
                toastr.Success('Equipo creado con exito');
            } else {
                toastr.Warning('Ya existe un equipo con este nombre');
            }
            
            $('#formFriends').css('height', '100%');
    
        }).catch((e) => {
            toastr.Error('Contacta tu administrador', 'Error');
            console.log('Error', e);
        });

    });

    $('#cboFriend1').change((e) => {
        let val1 = e.target.value;
        let val2 = $('#cboFriend2').val();
        let val3 = $('#cboFriend3').val();
        let val4 = $('#cboFriend4').val();

        if (val1 == val2 || val1 == val3 || val1 == val4) {
            e.target.value = '';
            toastr.Warning('Ya asignaste este integrante');
        } else {
            let name = ``;
            for (let i = 0; i < e.target.length; i++) {
                if (e.target[i].selected) {
                    name = e.target[i].innerHTML;
                }
            }
            e.target.disabled = true
            $('#cboCoordinador').append(`<option value="${e.target.value}" selected>${name}</option>`).val('');
            $('#cboPortavoz').append(`<option value="${e.target.value}" selected>${name}</option>`).val('');
            $('#cboSecretario').append(`<option value="${e.target.value}" selected>${name}</option>`).val('');
            $('#cboSupervisor').append(`<option value="${e.target.value}" selected>${name}</option>`).val('');
        }
    });

    $('#cboFriend2').change((e) => {
        let val1 = $('#cboFriend1').val();
        let val2 = e.target.value;
        let val3 = $('#cboFriend3').val();
        let val4 = $('#cboFriend4').val();

        if (val2 == val1 || val2 == val3 || val2 == val4) {
            e.target.value = '';
            toastr.Warning('Ya asignaste este integrante');
        } else {
            let name = ``;
            for (let i = 0; i < e.target.length; i++) {
                if (e.target[i].selected) {
                    name = e.target[i].innerHTML;
                }
            }
            e.target.disabled = true
            $('#cboCoordinador').append(`<option value="${e.target.value}" selected>${name}</option>`).val('');
            $('#cboPortavoz').append(`<option value="${e.target.value}" selected>${name}</option>`).val('');
            $('#cboSecretario').append(`<option value="${e.target.value}" selected>${name}</option>`).val('');
            $('#cboSupervisor').append(`<option value="${e.target.value}" selected>${name}</option>`).val('');
        }
    });

    $('#cboFriend3').change((e) => {
        let val1 = $('#cboFriend1').val();
        let val2 = $('#cboFriend2').val();
        let val3 = e.target.value;
        let val4 = $('#cboFriend4').val();

        if (val3 == val1 || val3 == val2 || val3 == val4) {
            e.target.value = '';
            toastr.Warning('Ya asignaste este integrante');
        } else {
            let name = ``;
            for (let i = 0; i < e.target.length; i++) {
                if (e.target[i].selected) {
                    name = e.target[i].innerHTML;
                }
            }
            e.target.disabled = true
            $('#cboCoordinador').append(`<option value="${e.target.value}" selected>${name}</option>`).val('');
            $('#cboPortavoz').append(`<option value="${e.target.value}" selected>${name}</option>`).val('');
            $('#cboSecretario').append(`<option value="${e.target.value}" selected>${name}</option>`).val('');
            $('#cboSupervisor').append(`<option value="${e.target.value}" selected>${name}</option>`).val('');
        }
    });

    $('#cboFriend4').change((e) => {
        let val1 = $('#cboFriend1').val();
        let val2 = $('#cboFriend2').val();
        let val3 = $('#cboFriend3').val();
        let val4 = e.target.value;

        if (val4 == val1 || val4 == val2 || val4 == val3) {
            e.target.value = '';
            toastr.Warning('Ya asignaste este integrante');
        } else {
            let name = ``;
            for (let i = 0; i < e.target.length; i++) {
                if (e.target[i].selected) {
                    name = e.target[i].innerHTML;
                }
            }
            e.target.disabled = true
            $('#cboCoordinador').append(`<option value="${e.target.value}" selected>${name}</option>`).val('');
            $('#cboPortavoz').append(`<option value="${e.target.value}" selected>${name}</option>`).val('');
            $('#cboSecretario').append(`<option value="${e.target.value}" selected>${name}</option>`).val('');
            $('#cboSupervisor').append(`<option value="${e.target.value}" selected>${name}</option>`).val('');
        }
    });

    $('#cboCoordinador').change((e) => {
        let val1 = e.target.value;;
        let val2 = $('#cboPortavoz').val();
        let val3 = $('#cboSecretario').val();
        let val4 = $('#cboSupervisor').val();

        if (val1 == val2 || val1 == val3 || val1 == val4) {
            e.target.value = '';
            toastr.Warning('Ya asignaste este integrante');
        }
    });

    $('#cboPortavoz').change((e) => {
        let val1 = $('#cboCoordinador').val();
        let val2 = e.target.value;
        let val3 = $('#cboSecretario').val();
        let val4 = $('#cboSupervisor').val();

        if (val2 == val1 || val2 == val3 || val2 == val4) {
            e.target.value = '';
            toastr.Warning('Ya asignaste este integrante');
        }
    });

    $('#cboSecretario').change((e) => {
        let val1 = $('#cboCoordinador').val();
        let val2 = $('#cboPortavoz').val();
        let val3 = e.target.value;
        let val4 = $('#cboSupervisor').val();

        if (val3 == val1 || val3 == val2 || val3 == val4) {
            e.target.value = '';
            toastr.Warning('Ya asignaste este integrante');
        }
    });

    $('#cboSupervisor').change((e) => {
        let val1 = $('#cboCoordinador').val();
        let val2 = $('#cboPortavoz').val();
        let val3 = $('#cboSecretario').val();
        let val4 = e.target.value;

        if (val4 == val1 || val4 == val2 || val4 == val3) {
            e.target.value = '';
            toastr.Warning('Ya asignaste este integrante');
        }
    });

    $('#btnConfirm').click((e) => {
        let fri1 = e.target.form[0].value;
        let fri2 = e.target.form[1].value;
        let fri3 = e.target.form[2].value;
        let fri4 = e.target.form[3].value;
        let Coor = e.target.form[4].value;
        let Port = e.target.form[5].value;
        let Secr = e.target.form[6].value;
        let Supe = e.target.form[7].value;
        if (!fri1 || !fri2 || !fri3 || !fri4 || !Coor || !Port || !Secr || !Supe) {
            toastr.Warning('Completa los campos primero');
        }
    });

    $('#formFriends').submit((e) => {
        e.preventDefault();
        
        let Coor = e.target[4].value;
        let Port = e.target[5].value;
        let Secr = e.target[6].value;
        let Supe = e.target[7].value;
        
        fetch('https://www.appescolar.somee.com/api/Procedures/ExecProcedure', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "procedure": `sp_AddTeamUser '${Coor}', '${JSON.parse(sessionStorage.AppUser).Id}', 'Coordinador';`
            }),
            redirect: 'follow'
        }).then(() => {}).catch((e) => { console.log('Error', e)});

        fetch('https://www.appescolar.somee.com/api/Procedures/ExecProcedure', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "procedure": `sp_AddTeamUser '${Port}', '${JSON.parse(sessionStorage.AppUser).Id}', 'Portavoz';`
            }),
            redirect: 'follow'
        }).then(() => {}).catch((e) => {console.log('Error', e)});

        fetch('https://www.appescolar.somee.com/api/Procedures/ExecProcedure', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "procedure": `sp_AddTeamUser '${Secr}', '${JSON.parse(sessionStorage.AppUser).Id}', 'Secretario';`
            }),
            redirect: 'follow'
        }).then(() => {}).catch((e) => {console.log('Error', e)});

        fetch('https://www.appescolar.somee.com/api/Procedures/ExecProcedure', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "procedure": `sp_AddTeamUser '${Supe}', '${JSON.parse(sessionStorage.AppUser).Id}', 'Supervisor';`
            }),
            redirect: 'follow'
        }).then(() => {}).catch((e) => {console.log('Error', e)});

    });
    
    $('.facebook').click(() => {
        redirect.Facebook();
    });

    $('.instagram').click(() => {
        redirect.Instagram();
    });

    $('.whatsApp').click(() => {
        redirect.WhatsApp();
    });

});
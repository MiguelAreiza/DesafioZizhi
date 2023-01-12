'use strict';

if (sessionStorage.AppUser) {
    ExecSp(`sp_ValidateUserById '${getUser.Id}';`).then((data) => {
        if (data[0].rpta) {
            throw 'bad request';
        }
        sessionStorage.setItem('AppUser', JSON.stringify(data[0]));
        $('#nameUser').html(data[0].StrName);
        toastr.Success(`Permítete brillar como una estrella`);
    }).catch((error) => {
        history.pushState(null, "", "../login/");
        goLocation.ChangeView('../login/');
        console.log('Error', error);
    });
} else {
    history.pushState(null, "", "../login/");
    goLocation.ChangeView('../login/');
}

$(document).ready(()=>{
    
    $('#btnLogOut').click(()=>{
        history.pushState(null, "", "../login/");
        goLocation.ChangeView('../login/');
    });

    $('#btnSettings').click(() => {
        if ($('#menu').css('height') == '0px') {
            $('#menu').css('height', 'calc(100% * 4)');
        }  else {
            $('#menu').css('height', '0px');
        }
    });

    $('#btnAvatares').click(() => {

        $('#menu').css('height', '0');
        $('.telon').show();

        if (getUser.RoleId == 'e922ab89-6aa3-4835-ba6a-ce189f0eb74a') {
            if (confirm("¿Deseas editar los avatares?")) {
                $('.modal').show();
                $('#sectionAvatares').show();
                GridAvatars();
                setTimeout(() => {
                    $('.modal').css('opacity','1');
                }, 100);
                $('#sectionAvatares #btnClose').click(() => {
                    $('.modal').css('opacity','0');
                    setTimeout(() => {
                        $('.modal').hide();
                        $('#sectionAvatares').hide();
                        $('.telon').hide();
                    }, 1000);
                });
                return
            }
        }

        ExecSp(`sp_AvatarsByTeam '${getUser.Id}'`).then((data) => {
            
            let html = ``;
            for (let i = 0; i < data.length; i++) {
                html += `<img id="${data[i].Id}" src="../../Images/Avatars/${data[i].StrImage}.png" alt="Personaje ${data[i],StrName}" draggable="false">`
            }

            $('#avatares').html(html);

            for (let i = 0; i < data.length; i++) {
                $(`#${data[i].Id}`).click(() => {    
                    $('.telon').hide();
                    $('.personajes').hide();
                    $('.pageContent > *').show();
                    toastr.Success(`Ahora eres ${data[i].StrName}`,'Magnífica elección');    
                });
            }

            $('.personajes').show();
            $('.pageContent > *').hide();
    
            $('.personajes #btnAtras').click(() => {
                $('.telon').hide();
                $('.personajes').hide();
                $('.pageContent > *').show();
            });

        }).catch((error) => {
            toastr.Error('Contacta tu administrador', 'Error');
        });
        
    });

    $('#btnInsignias').click(() => {
                
        $('#menu').css('height', '0');
        
        $('.telon').show();
        $('.insignias').show();
        $('.pageContent > *').hide();

        $('.insignias #btnAtras').click(() => {
            $('.telon').hide();
            $('.insignias').hide();
            $('.pageContent > *').show();
        });

        $('#insCalidad').click(() => {
            toastr.Info('Crea trabajos de calidad para conseguir una estas', 'Insignia de la calidad');
        });

        $('#insTiempo').click(() => {
            toastr.Info('Utiliza correctamente el tiempo para conseguir una estas', 'Insignia del tiempo');
        });

        $('#insEquipo').click(() => {
            toastr.Info('Trabaja en armonia con tu equipo para conseguir una estas', 'Insignia del trabajo en equipo');
        });
        
    });

    $('#btnPoderes').click(() => {

        $('#menu').css('height', '0');
        $('.telon').show();

        if (getUser.RoleId == 'e922ab89-6aa3-4835-ba6a-ce189f0eb74a') {
            if (confirm("¿Deseas editar los poderes?")) {
                $('.modal').show();
                $('#sectionPoderes').show();
                GridPowers();
                setTimeout(() => {
                    $('.modal').css('opacity','1');
                }, 100);
                $('#sectionPoderes #btnClose').click(() => {
                    $('.modal').css('opacity','0');
                    setTimeout(() => {
                        $('.modal').hide();
                        $('#sectionPoderes').hide();
                        $('.telon').hide();
                    }, 1000);
                });
                return
            }
        }

        ExecSp(`sp_PowersByTeam '${getUser.Id}'`).then((data) => {
            
            let html = ``;

            for (let i = 0; i < data.length; i++) {                
                html += `<div class="poder" >
                            <label class="titulo">${data[i].StrName}</label>
                            <div id="${data[i].Id}">
                                <img src="../../Images/Poderes/${data[i].StrImage}.png" alt="Poder de ${data[i].StrName.toLowerCase()}">
                                <div class="detalles">
                                    <label>Requisitos</label>
                                    <p>
                                        Para desbloquear necesitas: <br>
                                        Insignias de calidad: <b>${data[i].IntQuality}</b> <br>
                                        Insignias de tiempo: <b>${data[i].IntTime}</b> <br>
                                        Insignias de equipo: <b>${data[i].IntTeam}</b> <br>
                                        Puntos: <b>${data[i].IntPoints}</b>
                                    </p> 
                                </div>
                            </div>
                        </div>`;                
            }

            $('#poderes').html(html);

            for (let i = 0; i < data.length; i++) {
                $(`#${data[i].Id} .detalles`).click(() => {
                    if ($(`#${data[i].Id} .detalles`).hasClass('abierto')) {
                        $(`#${data[i].Id} .detalles`).css({'height':'calc(1.2rem + 3vh)','margin':'-1vh auto 0'});
                        $(`#${data[i].Id} .detalles`).removeClass('abierto');
                    } else {
                        $(`#${data[i].Id} .detalles`).css({'height':'calc(7vh + 6.2rem)','margin-top':'calc(-4vh - 5rem)'});
                        $(`#${data[i].Id} .detalles`).addClass('abierto');
                    }
                });
            }

            $('.poderes').show();
            $('.pageContent > *').hide();
            
            $('.poderes #btnAtras').click(() => {
                $('.telon').hide();
                $('.poderes').hide();
                $('.pageContent > *').show();
            });

        }).catch((error) => {
            toastr.Error('Contacta tu administrador', 'Error');
        });
                

        

        

    });

    $('#btnTienda').click(() => {
                
        $('#menu').css('height', '0');

        let productos = [{nombre:'Bombon',imagen:'../../Images/Tienda/Bombon.png',calidad:'2',tiempo:'',equipo:'1',puntos:'1500'},
                       {nombre:'Galletas',imagen:'../../Images/Tienda/Galletas.png',calidad:'2',tiempo:'1',equipo:'1',puntos:'1500'},
                       {nombre:'Chicle',imagen:'../../Images/Tienda/Chicle.png',calidad:'2',tiempo:'5',equipo:'1',puntos:'3000'}];
        
        let html = ``;

        for (let i = 0; i < productos.length; i++) {

            html += `<div class="producto" >
                        <label class="titulo">${productos[i].nombre}</label>
                        <div id="producto${productos[i].nombre}">
                            <img src="${productos[i].imagen}" alt="producto ${productos[i].nombre.toLowerCase()}">
                            <div class="detalles">
                                <label>Requisitos</label>
                                <p>
                                    Para reclamar necesitas: <br>
                                    Insignias de calidad: <b>${productos[i].calidad}</b> <br>
                                    Insignias de equipo: <b>${productos[i].equipo}</b> <br>
                                    Insignias de tiempo: <b>${productos[i].tiempo}</b> <br>
                                    Puntos: <b>${productos[i].puntos}</b>
                                </p> 
                            </div>
                        </div>
                    </div>`;
            
        }

        $('#tienda').html(html);

        for (let i = 0; i < productos.length; i++) {

            $(`#producto${productos[i].nombre} .detalles`).click((e) => {

                if ($(`#producto${productos[i].nombre} .detalles`).hasClass('abierto')) {

                    $(`#producto${productos[i].nombre} .detalles`).css({'height':'calc(1.2rem + 3vh)','margin':'-1vh auto 0'});
                    $(`#producto${productos[i].nombre} .detalles`).removeClass('abierto');

                } else {

                    $(`#producto${productos[i].nombre} .detalles`).css({'height':'calc(7vh + 6.2rem)','margin-top':'calc(-4vh - 5rem)'});
                    $(`#producto${productos[i].nombre} .detalles`).addClass('abierto');

                }

            });

        }

        $('.telon').show();
        $('.tienda').show();
        $('.pageContent > *').hide();
        
        $('.tienda #btnAtras').click(() => {
            $('.telon').hide();
            $('.tienda').hide();
            $('.pageContent > *').show();
        });
        
    });

    $('#btnEquipo').click(() => {
        history.pushState(null, "", "../portal/equipo/");        
        goLocation.ChangeView('./');
    });
    
    $('#btnLista').click(() => {
        history.pushState(null, "", "../portal/lista/");        
        goLocation.ChangeView('./');
    });

    $('#btnMisiones').click(() => {
        history.pushState(null, "", "../portal/misiones/");        
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

    function GridAvatars() {
        ExecSp(`sp_GridAvatars`).then((data) => {
            $("#gridAvatares").kendoGrid({
                language: "es-ES",
                dataSource: data,
                autoSync: true,
                schema: {
                    model: {
                        fields: {
                            Id: { type: "string", editable: false },
                            StrImage: { type: "string", editable: false },
                            StrName: { type: "string", editable: false },
                            IntPoints: { type: "string", editable: false },
                            IntQuality: { type: "string", editable: false },
                            IntTime: { type: "string", editable: false },
                            IntTeam: { type: "string", editable: false }
                        },
                    },
                },
                height: 290,
                scrollable: true,
                sortable: true,
                filterable: true,
                resizable: true,
                editable: false,
                toolbar: ["excel", "pdf", "search"],
                dataBound: function () {
                    for (var i = 0; i < this.columns.length; i++) {
                    this.autoFitColumn(i);
                    }
                },
                columns: [
                    { 
                        command: [
                            { 
                                iconClass: "btnEdit",
                                text: " ",
                                click: EditAvatar
                            }
                        ], 
                        title: "Acciones"
                    },
                    {
                        field: "StrImage",
                        title: "Imagen",
                        template: "<div class='product-photo' style='background-image: url(../../Images/Avatars/#:data.StrImage#.png);'>",
                        width: 300
                    },
                    {
                        field: "StrName",
                        title: "Personaje"
                    },
                    {
                        field: "IntPoints",
                        title: "Puntos"
                    },
                    {
                        field: "IntQuality",
                        title: "Ins. Calidad"
                    },
                    {
                        field: "IntTime",
                        title: "Ins. Tiempo"
                    },
                    {
                        field: "IntTeam",
                        title: "Ins. Equipo"
                    }
                ]
            });

        }).catch((error) => {
            toastr.Error('Contacta tu administrador', 'Error');
        });

        function EditAvatar(e) {
            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
            sessionStorage.setItem('AvatarId', dataItem.Id);
            $('#formAvatares #StrName').val(dataItem.StrName);
            $('#formAvatares #IntPoints').val(dataItem.IntPoints);
            $('#formAvatares #IntQuality').val(dataItem.IntQuality);
            $('#formAvatares #IntTime').val(dataItem.IntTime);
            $('#formAvatares #IntTeam').val(dataItem.IntTeam);
            $('#formAvatares #btnSave').show();
        }

        $('#formAvatares').submit((e) => {
            e.preventDefault();

            let Name = e.target[0].value;
            let Points = e.target[1].value;
            let Quality = e.target[2].value;
            let Time = e.target[3].value;
            let Team = e.target[4].value;

            ExecSp(`sp_UpdateAvatar '${sessionStorage.AvatarId}', '${Name}',${Points},${Quality},${Time},${Team};`).then((data) => {
                if (data[0].rpta) {
                    throw 'bad request';
                }
                sessionStorage.removeItem('AvatarId');

                $('#formAvatares #btnSave').hide();

                $('#formAvatares #StrName').val('');
                $('#formAvatares #IntPoints').val('');
                $('#formAvatares #IntQuality').val('');
                $('#formAvatares #IntTime').val('');
                $('#formAvatares #IntTeam').val('');

                toastr.Success('Registro actualizado');
                GridAvatars();
                
            }).catch((error) => {
                toastr.Error('Contacta tu administrador', 'Error');
            });
        });
    }

    function GridPowers() {
        ExecSp(`sp_GridPowers`).then((data) => {
            $("#gridPoderes").kendoGrid({
                language: "es-ES",
                dataSource: data,
                autoSync: true,
                schema: {
                    model: {
                        fields: {
                            Id: { type: "string", editable: false },
                            StrImage: { type: "string", editable: false },
                            StrName: { type: "string", editable: false },
                            IntPoints: { type: "string", editable: false },
                            IntQuality: { type: "string", editable: false },
                            IntTime: { type: "string", editable: false },
                            IntTeam: { type: "string", editable: false }
                        },
                    },
                },
                height: 290,
                scrollable: true,
                sortable: true,
                filterable: true,
                resizable: true,
                editable: false,
                toolbar: ["excel", "pdf", "search"],
                dataBound: function () {
                    for (var i = 0; i < this.columns.length; i++) {
                    this.autoFitColumn(i);
                    }
                },
                columns: [
                    { 
                        command: [
                            { 
                                iconClass: "btnEdit",
                                text: " ",
                                click: EditPower
                            }
                        ], 
                        title: "Acciones"
                    },
                    {
                        field: "StrImage",
                        title: "Imagen",
                        template: "<div class='product-photo' style='background-image: url(../../Images/Poderes/#:data.StrImage#.png);'>",
                        width: 300
                    },
                    {
                        field: "StrName",
                        title: "Poder"
                    },
                    {
                        field: "IntPoints",
                        title: "Puntos"
                    },
                    {
                        field: "IntQuality",
                        title: "Ins. Calidad"
                    },
                    {
                        field: "IntTime",
                        title: "Ins. Tiempo"
                    },
                    {
                        field: "IntTeam",
                        title: "Ins. Equipo"
                    }
                ]
            });

        }).catch((error) => {
            toastr.Error('Contacta tu administrador', 'Error');
        });

        function EditPower(e) {
            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
            sessionStorage.setItem('PowerId', dataItem.Id);
            $('#formPoderes #StrName').val(dataItem.StrName);
            $('#formPoderes #IntPoints').val(dataItem.IntPoints);
            $('#formPoderes #IntQuality').val(dataItem.IntQuality);
            $('#formPoderes #IntTime').val(dataItem.IntTime);
            $('#formPoderes #IntTeam').val(dataItem.IntTeam);
            $('#formPoderes #btnSave').show();
        }

        $('#formPoderes').submit((e) => {
            e.preventDefault();

            let Name = e.target[0].value;
            let Points = e.target[1].value;
            let Quality = e.target[2].value;
            let Time = e.target[3].value;
            let Team = e.target[4].value;

            ExecSp(`sp_UpdatePower '${sessionStorage.PowerId}', '${Name}',${Points},${Quality},${Time},${Team};`).then((data) => {
                if (data[0].rpta) {
                    throw 'bad request';
                }
                sessionStorage.removeItem('PowerId');

                $('#formPoderes #btnSave').hide();

                $('#formPoderes #StrName').val('');
                $('#formPoderes #IntPoints').val('');
                $('#formPoderes #IntQuality').val('');
                $('#formPoderes #IntTime').val('');
                $('#formPoderes #IntTeam').val('');

                toastr.Success('Registro actualizado');
                GridPowers();
                
            }).catch((error) => {
                toastr.Error('Contacta tu administrador', 'Error');
            });
        });
    }

});
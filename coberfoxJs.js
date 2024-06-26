document.addEventListener("DOMContentLoaded", () =>{
    let user = localStorage.getItem("usuario");
    fetch('apiPrueba.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Netnwork response was ot ok');
                }
                return response.json();
            })
            .then(data => {
                empresa = data.usuarios.find(usuario => usuario.user === user);
                nameEmpresa = empresa.userEm
                
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
            });

    const divInfo = document.getElementById("info");
    const miniMenu = document.getElementById("miniMenu")
    const menuPesa = document.getElementById("pesar");
    const config = document.getElementById("confi");
    const historial = document.getElementById("historial")

    menuPesa.addEventListener("click", () =>{
        menu = `
        <button id="primera">Primer Pesada</button>
        <button id="segunda">Segunda Pesada</button>`
        divInfo.innerHTML = menu

        const primera = document.getElementById("primera")
        const segunda = document.getElementById("segunda")

        primera.addEventListener("click", () =>{
        op = `
        <div id="main" class="columna">
            <div class="opciones">
                <label class="nombres" style="width: 100px;" for="matricula">Matricula</label>
                <input id="matricula" type="text"><br>
            </div>
            <div class="opciones">
                <label class="nombres" for="empresa">empresa</label>
                <input id="empresa" type="text"><br>
            </div>
            <div class="opciones">
                <label class="nombres" for="producto">producto</label>
                <input id="producto" type="text"><br>
            </div>
            <div class="opciones">
                <label class="nombres" for="chofer">chofer</label>
                <input id="chofer" type="text"><br>
            </div>
            <div class="opciones">
                <label class="nombres" for="ejes">Cantidad de ejes</label>
                <input id="ejes" type="number" placeholder="0"><br>
            </div>
            <div class="opciones">
                <label class="nombres" for="observaciones">observaciones</label>
                <input id="observaciones" type="text"><br>
            </div>
        </div>
        <div id="balanza" class="columna">
            <input type="number">kg</input>
            <button>Comenzar Peaje</button>
        </div>
        `
        miniMenu.innerHTML = op
    })

    segunda.addEventListener("click", () =>{
        op = `
        <p>futura pesada</p>
        `
        miniMenu.innerHTML = op
    })
    })

    config.addEventListener("click", ()=>{
        menu = `
        <label for="indicador">Indicador utilizado</label>

        <select name="" id="indicador">
            <option value="">Predeterminado</option>
            <option value="dog">Arduino</option>
        </select>
        <label for="baudios">Baudios</label>
        <input type="text" disabled value="9600">

        <label for="baudios">Nombre De Empresa</label>
        <input type="text" disabled value=${nameEmpresa}>
        `
        divInfo.innerHTML = menu
    })

    historial.addEventListener("click", () =>{
        window.location.href = "historial.html"
    })


})
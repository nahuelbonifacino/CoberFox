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

    const menuPesa = document.getElementById("pesar");
    const config = document.getElementById("confi");
    const historial = document.getElementById("historial")

    menuPesa.addEventListener("click", () =>{
        menu = `
        <button>Primer Pesada</button>
        <button>Segunda Pesada</button>`
        divInfo.innerHTML = menu
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
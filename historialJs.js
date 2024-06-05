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
                datos = empresa.historial

                const menuHistorial = document.getElementById("tabla-datos");

                datos.forEach(datos => {
                    const tr = document.createElement('tr')

                    tr.innerHTML+= `
                
                    <td>${datos.n}</td>
                    <td>${datos.Matricula}</td>
                    <td>${datos.Empresa}</td>
                    <td>${datos.Bruto}</td>
                    <td>${datos.Tara}</td>
                    <td>${datos.Tara_Manual}</td>
                    <td>${datos.Neto}</td>
                    <td>${datos.Pesada_Completa}</td>
                    <td>${datos.Fecha_Primera}</td>
                    <td>${datos.Fecha_Segunda}</td>
                
                `
                menuHistorial.appendChild(tr)
                    
                });
                /* for (const datos of empresa.historial)
                info += `
                
                    <td>${datos.n}</td>
                    <td>${datos.Matricula}</td>
                    <td>${datos.Empresa}</td>
                    <td>${datos.Bruto}</td>
                    <td>${datos.Tara}</td>
                    <td>${datos.Tara_Manual}</td>
                    <td>${datos.Neto}</td>
                    <td>${datos.Pesada_Completa}</td>
                    <td>${datos.Fecha_Primera}</td>
                    <td>${datos.Fecha_Segunda}</td>
                
                `
                menuHistorial.innerHTML = info */
                
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
            });

    
})
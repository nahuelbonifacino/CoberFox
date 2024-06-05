document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("button");

    button.addEventListener("click", () => {
        const user = document.getElementById("user").value;
        const password = document.getElementById("password").value;
        localStorage.setItem("usuario", user)

        fetch('apiPrueba.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Netnwork response was ot ok');
                }
                return response.json();
            })
            .then(data => {
                const usuarioEncontrado = data.usuarios.find(usuario => usuario.user === user);
                if (usuarioEncontrado && usuarioEncontrado.password === password) {
                    alert("Exito");
                    window.location.href = "CoberFox.html"
                } else {
                    alert("Usuario o contraseña incorrectos");
                }
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
            });
    });
});

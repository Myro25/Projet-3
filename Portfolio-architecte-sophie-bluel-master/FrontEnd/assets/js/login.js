document.addEventListener("DOMContentLoaded", function () {
    init();

    //Connexion au site admin
    function fetchinfo(formData) {
        return fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(formData)
        })
            .then((result) => {
                return result;
            })
            .catch((error) => {
                console.log(error)
            })
    }
    function init() {
        document.querySelector("#logadmin").addEventListener("submit", async function (event) {
            event.preventDefault();
            var Emaillog = document.getElementById("Emaillog").value;
            var Motdepasse = document.getElementById("Motdepasse").value;
            let formData = { 'email': Emaillog, 'password': Motdepasse };
            let resultats = await fetchinfo(formData);
            let token = await resultats.json();
            window.localStorage.setItem("token", token.token);
            if (resultats.status == 200) {
                document.getElementById("message").textContent = "Connexion réussie!";
                window.location.href = "./pageadmin.html";
            } else {
                document.getElementById("message").textContent = "Identifiants invalides. Veuillez réessayer.";
            }
        });

        // Mot de passe oublié

        document.getElementById("forgotPassword").addEventListener("click", function (event) {
            event.preventDefault();

            alert("Mot de passe oublié? Veuillez contacter l'administrateur du site.");
        });
    }

});
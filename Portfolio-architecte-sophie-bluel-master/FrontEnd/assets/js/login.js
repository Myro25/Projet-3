document.addEventListener("DOMContentLoaded", function () {

    function init() {

        eventform()
        mdpoublie()

    }

    init();

    function mdpoublie() {

        document.getElementById("forgotPassword").addEventListener("click", function (event) {
            event.preventDefault();

            alert("Mot de passe oublié? Veuillez contacter l'administrateur du site.");
        });
    }

    function eventform() {
        let formlogin = document.querySelector("#logadmin")

        formlogin.addEventListener("submit", async function (event) {
            event.preventDefault();

            let formData = { 'email': document.getElementById("Emaillog").value, 'password': document.getElementById("Motdepasse").value };

            let result = await fetchinfo(formData);

            StockToken(result);

        });
    }

    async function fetchinfo(formData) {
        return fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(formData)
        })
            .then((result) => {
                return result.json();
            })
            .catch((error) => {
                document.getElementById("message").textContent = "Identifiants invalides. Veuillez réessayer.";
            })
    }

    function StockToken(result) {

        document.getElementById("message").textContent = "Connexion réussie!";
        window.localStorage.setItem("token", result.token);

        setTimeout(() => {
            window.location.href = "./pageadmin.html";
        }, "1000");
    }

})
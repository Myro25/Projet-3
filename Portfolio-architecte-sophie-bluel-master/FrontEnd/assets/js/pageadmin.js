async function init() {
    Logout();
    ConnectedOrNotConnected();

    let allinfo = await getallinfo();
    displayallinfo(allinfo);

    let allcategorie = await fetchCategories();
    displayallcategorie(allcategorie);

    listevent();

    btnmodalsend();
}

init();

// Cette fonction gère la déconnexion de l'utilisateur en supprimant le token du stockage local
function Logout() {
    let logout = document.querySelector(".logout");
    logout.addEventListener("click", () => {
        localStorage.clear();
        window.location.href = "./index.html";
    })
}
// Vérifie si l'utilisateur est connecté en vérifiant la présence d'un token dans le stockage local
function ConnectedOrNotConnected() {
    let token = localStorage.getItem("token");
    if (token) {
        console.log("Vous etes connecté")
    } else {
        window.location.href = "./login.html";
    }
}

// Gère les événements liés à l'affichage des modales et à la navigation entre les étapes
function listevent() {
    const modale1 = document.querySelector(".modale")
    const btnmodale = document.getElementById("modale1")
    const btnmodale2 = document.getElementById("modale2")
    const modalback = document.querySelector(".modalback");
    const gostep1 = document.getElementById("retourstep1");
    const gostep2 = document.querySelector(".AddPhoto");
    const btnfermermodale = document.getElementById("fermermodale");
    const step1 = document.querySelector(".step1");
    const step2 = document.querySelector(".step2");

    btnmodale.addEventListener("click", (e) => {
        e.preventDefault();
        modale1.style.display = "block";
        modalback.style.display = "block";
    })
    btnmodale2.addEventListener("click", (e) => {
        e.preventDefault();
        modale1.style.display = "block";
        modalback.style.display = "block";
    })

    modalback.addEventListener("click", function () {
        modale1.style.display = "none";
        modalback.style.display = "none";
        step2.style.display = "none";
        step1.style.display = "block";
    });

    btnfermermodale.addEventListener("click", function () {
        modale1.style.display = "none";
        modalback.style.display = "none";
        step2.style.display = "none";
        step1.style.display = "block";
    });

    gostep2.addEventListener("click", function () {
        step1.style.display = "none";
        step2.style.display = "block";
    });

    gostep1.addEventListener("click", function () {
        step2.style.display = "none";
        step1.style.display = "block";
    });
}
// pour récupérer les informations sur les œuvres
function getallinfo() {
    return fetch('http://localhost:5678/api/works')
        .then((response) => {
            return response.json();
        })
        .catch((error) => {
            console.error('Erreur lors de la récupération des affichages :', error);

        })
}
// pour récupérer les catégories d'œuvres
function fetchCategories() {
    return fetch("http://localhost:5678/api/categories")
        .then((response) => {
            return response.json();
        })
        .catch((error) => {
            console.log(error)
        })
}
// Affiche les catégories récupérées dans un élément
function displayallcategorie(allcategorie) {
    let categorie = document.querySelector(".categorieselect");

    for (const info of allcategorie) {
        categorie.insertAdjacentHTML("beforeend",
            `
                <option value="${info.id}">
                ${info.name}
                </option>
                `
        );
    }
}
// Affiche les informations sur les œuvres récupérées dans des éléments HTML
function displayallinfo(allinfo) {
    let gallery = document.querySelector(".gallery")
    let gallerymodal = document.querySelector(".gallery-modale")
    gallery.innerHTML = "";
    gallerymodal.innerHTML = "";

    for (const work of allinfo) {
        gallery.insertAdjacentHTML("beforeend",
            `
            <figure id="work-${work.id}">
                <img src="${work.imageUrl}" alt="${work.title}">
                <figcaption>${work.title}</figcaption>
            </figure>
            `);

        gallerymodal.insertAdjacentHTML("beforeend",
            `
            <figure id="figure">
                <img src="${work.imageUrl}" alt="${work.title}">
                <i class="trash fa-solid fa-trash-can" onclick="deletework(event, ${work.id})"></i>
                <span class="editer">éditer</span>
            </figure>
            `);

    }
}

function btnmodalsend() {
    let btnsend = document.getElementById("AddWork");

    btnsend.addEventListener("click", async (e) => {
        e.preventDefault();

        let token = window.localStorage.getItem("token");

        if (!this.imagesend || !this.title || !this.categorie) {
            document.getElementById("errormodal").innerText = "mauvaise valeurs dans les inputs";
            return false;
        }

        let formdata = new FormData();
        formdata.append("image", this.imagesend);
        formdata.append("title", this.title);
        formdata.append("category", this.categorie);

        try {
            const response = await fetch("http://localhost:5678/api/works", {
                method: "POST",
                body: formdata,
                headers: {
                    accept: "application/json",
                    Authorization: "Bearer " + token,
                },
            });

            if (response.status === 201) {
                init();
                document.querySelector(".modalback").style.display = "none";
                document.querySelector(".step2").style.display = "none";
                document.querySelector(".step1").style.display = "block";
                document.querySelector(".modale").style.display = "none";
            } else {
                console.error("Erreur lors de l'ajout de l'image");
            }
        } catch (error) {
            console.error("Erreur lors de l'ajout de l'image :", error);
        }
    });
}

const loadFile = function (event) {
    document.querySelector(".uploadImage").classList.add("previewImage");

    document.querySelector("#output").innerHTML = "<img src='" + URL.createObjectURL(event.target.files[0]) + "' alt='image' width='100%'>";
    this.imagesend = event.target.files[0];
};

function btndisabled() {
    var title = document.getElementById("titre").value;
    var categorie = document.getElementById("categorie").value;
    let btnsendmodal = document.getElementById("AddWork");

    this.title = title;
    this.categorie = categorie;
    if (!this.imagesend || !title || !categorie) {
        btnsendmodal.disabled = true
    }
    else {
        btnsendmodal.disabled = false
    }
}

async function deletework(event, id) {
    event.preventDefault();

    try {
        const token = window.localStorage.getItem("token");

        const response = await fetch(`http://localhost:5678/api/works/${id}`, {
            method: "DELETE",
            headers: {
                accept: "application/json",
                Authorization: "Bearer " + token,
            },
        });

        if (response.status === 204) {
            // Réponse réussie, mise à jour de l'affichage
            const allinfo = await getallinfo();
            displayallinfo(allinfo);

            document.querySelector(".modalback").style.display = "none";
            document.querySelector(".modale").style.display = "none";
        } else {
            console.error("Erreur lors de la suppression de l'image");
        }
    } catch (error) {
        console.error("Erreur lors de la suppression de l'image :", error);
    }
}
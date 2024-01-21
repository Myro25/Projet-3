document.addEventListener("DOMContentLoaded", function (event) {

    async function init() {

        let allworks = await fetchAllWork();

        DisplayAllWorks(allworks);

        let allfiltres = await fetchAllfiltres();
        console.log(allworks)
        DisplayAllFiltres(allfiltres);

        filtrearray(allworks);
    }

    init();


    function fetchAllWork() {
        return fetch("http://localhost:5678/api/works")
            .then((response) => {
                return response.json();
            })
            .catch((error) => {
                console.log(error);
            })
    }

    function fetchAllfiltres() {
        return fetch("http://localhost:5678/api/categories")
            .then((response) => {
                return response.json();
            })
            .catch((error) => {
                console.log(error);
            })
    }

    function DisplayAllWorks(allworks) {

        let gallery = document.querySelector(".gallery")
        gallery.innerHTML = " ";
        for (const work of allworks) {
            gallery.insertAdjacentHTML("beforeend",
                `
            <figure id="work-${work.id}">
                <img src="${work.imageUrl}" alt="${work.title}">
                <figcaption>${work.title}</figcaption>
            </figure>
            `);
        }

    }

    function DisplayAllFiltres(allfiltres) {
        let filtres = document.querySelector(".filtres")
        for (const filtre of allfiltres) {
            filtres.insertAdjacentHTML("beforeend",
                `
                <li id="${filtre.id}">${filtre.name}</li>`);
        }
    }

    function filtrearray(allworks) {
        let allfiltres = document.querySelectorAll(".filtres > li");

        allfiltres.forEach((filtre) => {
            filtre.addEventListener("click", (event) => {
                console.log(event)
                let valueclicked = event.target.innerHTML;
                console.log(valueclicked)

                if (valueclicked === "Tous") {
                    DisplayAllWorks(allworks);
                } else {
                    let filterallinfo = allworks.filter(work => work.categoryId == event.target.id);
                    DisplayAllWorks(filterallinfo);
                }



            })
        })
    }





})

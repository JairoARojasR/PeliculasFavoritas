//Constantes 
const apiKey = '30d18aadd5msh252dd25a14ea1aep1a76dbjsnaee0ef455273';
const genreList = document.getElementById("genre-list");
const movieList = document.getElementById("movie-list");
const movieDetails = document.getElementById("movie-details");
const moviesContainer = document.getElementById("movies-container");
const nextPageButton = document.getElementById("next-page");
let currentPage = 1;
let currentGenre = null;
let favorites = [];

function getGenres() {
    fetch("https://moviesdatabase.p.rapidapi.com/titles/utils/genres", {
        method: "GET",
        headers: {
            "X-RapidAPI-Key": apiKey,
            "X-RapidAPI-Host": "moviesdatabase.p.rapidapi.com",
        },
    })
    .then(response => response.json())
    .then(data => {
        const genres = data.results.filter(genre => genre !== null);
        const genreButtons = genres.map(genre => {
            const button = document.createElement("button");
            button.textContent = genre;
            button.addEventListener("click", () => getMoviesByGenre(genre));
            return button;
        });
        genreList.innerHTML = "";
        genreList.append(...genreButtons);

        fetchMoviesByGenre(currentGenre);
    })
    .catch(error => console.log(error));
}

function getMoviesByGenre(genre) {
    currentGenre = genre;
    currentPage = 1;
    fetchMoviesByGenre(genre);
}

function fetchMoviesByGenre(genre) {
    const url = `https://moviesdatabase.p.rapidapi.com/titles?genre=${genre}&page=${currentPage}`;

    fetch(url, {
        method: "GET",
        headers: {
            "X-RapidAPI-Key": apiKey,
            "X-RapidAPI-Host": "moviesdatabase.p.rapidapi.com",
        },
    })
    .then(response => response.json())
    .then(data => {
        const movies = data.results;
        moviesContainer.innerHTML = "";

        movies.forEach(movie => {
            const item = document.createElement("div");
            if (movie.primaryImage && movie.primaryImage.url) {
                item.innerHTML = `
                    <img src="${movie.primaryImage.url}" alt="${movie.originalTitleText.text}">
                    <h2>${movie.originalTitleText.text}</h2>
                    <p>Año de realización: ${movie.releaseYear.year}</p>
                    <button class="add-to-favorites-btn btn btn-secondary" data-id="${movie.id}">Agregar a favoritos</button>
                `;
                const addToFavoritesButton = item.querySelector(".add-to-favorites-btn");
                const movieId = addToFavoritesButton.getAttribute("data-id");
                addToFavoritesButton.addEventListener("click", () => {
                    addToFavorites(movie);
                    addToFavoritesButton.textContent = "Película Agregada";
                });
            } else {
                item.innerHTML = `
                    <img src="error.jpg" alt="Imagen no disponible">
                    <h2>${movie.originalTitleText.text}</h2>
                    <p>Año de realización: ${movie.releaseYear.year}</p>
                    <button class="add-to-favorites-btn btn btn-secondary" data-id="${movie.id}">Agregar a favoritos</button>
                `;
                const addToFavoritesButton = item.querySelector(".add-to-favorites-btn");
                const movieId = addToFavoritesButton.getAttribute("data-id");
                addToFavoritesButton.addEventListener("click", () => {
                    addToFavorites(movie);
                    addToFavoritesButton.textContent = "Película Agregada";
                });
            }
            moviesContainer.appendChild(item);
        });

        if (data.next) {
            nextPageButton.style.display = "block"; 
        } else {
            nextPageButton.style.display = "none";
        }
    })
    .catch(error => console.log(error));
}

nextPageButton.addEventListener("click", () => {
    currentPage++;
    fetchMoviesByGenre(currentGenre);
});

function addToFavorites(movie) {
    const isAlreadyInFavorites = favorites.some(fav => fav.id === movie.id);
    if (!isAlreadyInFavorites) {
        favorites.push(movie);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        disableAddToFavoriteButton(movie.id);
    }
}

function disableAddToFavoriteButton(movieId) {
    const addButton = document.querySelector(`.add-to-favorites-btn[data-id="${movieId}"]`);
    if (addButton) {
        addButton.disabled = true;
        addButton.textContent = "Película Añadida";
    }
}

document.getElementById("show-favorites").addEventListener("click", () => {
    location.href = "favorites.html";
});

if (localStorage.getItem("favorites")) {
    favorites = JSON.parse(localStorage.getItem("favorites"));
}

getGenres();

const favoritesListPage = document.getElementById("favorites-list");

function updateFavoritesListInFavoritesPage() {
    favoritesListPage.innerHTML = "";

    if (localStorage.getItem("favorites")) {
        const favorites = JSON.parse(localStorage.getItem("favorites"));

        favorites.forEach(movie => {
            const item = document.createElement("div");
            const imageUrl = movie.primaryImage ? movie.primaryImage.url : 'error.jpg';
            item.innerHTML = `
                <img src="${imageUrl}" alt="${movie.originalTitleText.text}">
                <h2>${movie.originalTitleText.text}</h2>
                <p>Año de realización: ${movie.releaseYear ? movie.releaseYear.year : 'No disponible'}</p>
                <button class="remove-from-favorites-btn btn btn-danger" data-id="${movie.id}">Borrar Película Favorita</button>
            `;

            const removeFromFavoritesButton = item.querySelector(".remove-from-favorites-btn");
            removeFromFavoritesButton.addEventListener("click", () => {
                removeFromFavorites(movie);
                removeFromFavoritesButton.parentNode.remove(); 
                enableAddToFavoriteButton(movie.id);
            });

            favoritesListPage.appendChild(item);
        });
    }
}


updateFavoritesListInFavoritesPage();

function removeFromFavorites(movie) {
    const favorites = getFavoritesFromStorage();
    const index = favorites.findIndex(fav => fav.id === movie.id);
    if (index !== -1) {
        favorites.splice(index, 1);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        enableAddToFavoriteButton(movie.id);
    }
}

function getFavoritesFromStorage() {
    return JSON.parse(localStorage.getItem("favorites")) || [];
}

function enableAddToFavoriteButton(movieId) {
    const addButton = document.querySelector(`.add-to-favorites-btn[data-id="${movieId}"]`);
    if (addButton) {
        addButton.disabled = false;
    }
}

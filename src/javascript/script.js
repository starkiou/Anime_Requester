let url = 'url';

document.addEventListener('DOMContentLoaded', () => {
  const filter = document.getElementById('filter');
  const query = document.getElementById('query');
  const delButton = document.getElementById('delButton');
  const searchButton = document.getElementById('searchButton');

  delButton.addEventListener('click', () => {
    query.value = "";
  });

  searchButton.addEventListener('click', () => {
    const filterValue = filter.value;
    const queryText = query.value;

    console.log("Filtre :", filterValue);
    console.log("Texte :", queryText);

    fetchAnime(filterValue, queryText);
  });
  loadGenres();
});

// === GESTION DE LA CLÉ API ===
let apiKey = sessionStorage.getItem("apiKey");
if (!apiKey) {
  apiKey = prompt("Veuillez entrer votre clé API :");
  if (apiKey && apiKey.trim() !== "") {
    sessionStorage.setItem("apiKey", apiKey.trim());
  } else {
    alert("Aucune clé API saisie. Rechargez la page pour réessayer.");
  }
}

const options = {
  method: 'GET',
  headers: {
    'x-rapidapi-key': apiKey,
    'x-rapidapi-host': 'anime-db.p.rapidapi.com'
  }
};

// === MODIFIER L'URL SELON LE FILTRE ===
function editURL(filterValue, queryText) {
  switch (filterValue) {
    case 'title':
      url = 'https://anime-db.p.rapidapi.com/anime?page=1&size=20&search=' + encodeURIComponent(queryText.trim()) + '&sortBy=ranking&sortOrder=asc';
      break;
    case 'id':
      url = 'https://anime-db.p.rapidapi.com/anime/by-id/' + parseInt(queryText, 10);
      break;
    case 'rank':
      url = 'https://anime-db.p.rapidapi.com/anime/by-ranking/' + encodeURIComponent(queryText.trim());
      break;
    default:
      url = 'https://anime-db.p.rapidapi.com/anime?page=1&size=20';
  }
}

// === AFFICHER UN ANIME ===
function renderCard(anime, template, container) {
  const clone = template.content.cloneNode(true);
  clone.querySelector("#cardTitle").textContent = anime.title;
  clone.querySelector("#cardSynopsis").textContent = anime.synopsis;
  clone.querySelector("#cardEpisodes").textContent = anime.episodes;
  clone.querySelector("#cardImg").src = anime.image;

  if (anime.hasRanking === true) {
    clone.querySelector("#cardClass").textContent = anime.ranking;
  } else {
    clone.querySelector("#cardClass").textContent = "No ranking";
  }

  clone.querySelector("#cardGenre").textContent = anime.genres.join(", ");
  container.appendChild(clone);
}

// === RÉCUPÉRER LES GENRES SÉLECTIONNÉS ===
function getSelectedGenres() {
  const checkboxes = document.querySelectorAll("#genreCheckboxes input[type='checkbox']:checked");
  return Array.from(checkboxes).map(cb => cb.value);
}

// === CHARGER LES GENRES (1 seule fois) ===
async function loadGenres() {
  let genres = JSON.parse(localStorage.getItem("animeGenres"));

  if (!genres) {
    try {
      const genreUrl = 'https://anime-db.p.rapidapi.com/genre';
      const genreOptions = {
        method: 'GET',
        headers: {
          'x-rapidapi-key': apiKey,
          'x-rapidapi-host': 'anime-db.p.rapidapi.com'
        }
      };

      const response = await fetch(genreUrl, genreOptions);
      genres = await response.json();
      localStorage.setItem("animeGenres", JSON.stringify(genres));
      console.log("Genres chargés depuis l'API");
    } catch (error) {
      console.error("Erreur de chargement des genres :", error);
    }
  } else {
    console.log("Genres chargés depuis localStorage");
  }

  GenreSelect(genres);
}

// === AJOUTER LES GENRES DANS LE SELECT MULTIPLE ===
function GenreSelect(genres) {
  const container = document.getElementById("genreCheckboxes");
  container.innerHTML = "";

  genres.forEach(g => {
    const label = document.createElement("label");
    label.style.display = "block";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = g._id;

    label.appendChild(checkbox);
    label.append(" " + g._id);
    container.appendChild(label);
  });
}

// === FETCH DES ANIMES AVEC FILTRE GENRES MULTIPLES ===
async function fetchAnime(filterValue, queryText) {
  try {
    const container = document.getElementById("cardZone");
    const template = document.getElementById("cardTemplate");
    const selectedGenres = getSelectedGenres();

    Array.from(container.children).forEach(child => {
      if (child.tagName.toLowerCase() !== 'template') {
        child.remove();
      }
    });

    editURL(filterValue, queryText);

    const response = await fetch(url, options);
    const jsonData = await response.json();

    let animeList = [];

    if (jsonData.data && Array.isArray(jsonData.data)) {
      animeList = jsonData.data;
    } else if (jsonData && typeof jsonData === 'object' && jsonData.title) {
      animeList = [jsonData];
    }

    if (selectedGenres.length > 0) {
      animeList = animeList.filter(anime =>
        anime.genres && selectedGenres.every(genre => anime.genres.includes(genre))
      );
    }

    if (animeList.length > 0) {
      animeList.forEach(anime => {
        renderCard(anime, template, container);
      });
    } else {
      const message = document.createElement("p");
      message.textContent = "Aucun anime trouvé pour cette recherche.";
      container.appendChild(message);
    }

  } catch (error) {
    console.error("Erreur lors du fetch :", error);
  }
}

// === DARK MODE ===
const checkbox = document.getElementById("checkbox");
checkbox.addEventListener("change", () => {
  document.body.classList.toggle("dark");
});

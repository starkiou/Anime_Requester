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
  let genres = null;
  try {
    genres = JSON.parse(localStorage.getItem("animeGenres"));
  } catch (error) {
    // valeur illisible en cache : on la recharge
  }

  // Seule une vraie liste est gardée : une réponse d'erreur de l'API mise en
  // cache (clé absente ou refusée) laissait la zone des genres vide pour toujours.
  if (!Array.isArray(genres) || genres.length === 0) {
    genres = [];
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
      const data = await response.json();
      if (!response.ok || !Array.isArray(data)) {
        throw new Error(`réponse inattendue de l'API (${response.status})`);
      }
      genres = data;
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
// Genres réservés aux adultes renvoyés par l'API : ils ne sont pas proposés
const HIDDEN_GENRES = ["Hentai", "Erotica", "Ecchi"];

function GenreSelect(genres) {
  const container = document.getElementById("genreCheckboxes");
  container.innerHTML = "";

  const names = genres
    .map(g => g._id)
    .filter(name => name && !HIDDEN_GENRES.includes(name))
    .sort((a, b) => a.localeCompare(b));

  names.forEach(name => {
    // Une étiquette cliquable par genre ; la case à cocher reste dans la page
    // pour le clavier et les lecteurs d'écran, mais elle est masquée visuellement.
    const label = document.createElement("label");
    label.className = "genre-chip";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = name;
    // Cocher ou décocher un genre filtre aussitôt les résultats déjà affichés
    checkbox.addEventListener("change", renderResults);

    label.appendChild(checkbox);
    label.append(name);
    container.appendChild(label);
  });
}

// === FETCH DES ANIMES AVEC FILTRE GENRES MULTIPLES ===
// Résultats de la dernière recherche, avant filtrage par genre. `null` tant
// qu'aucune recherche n'a été lancée.
let lastAnimeList = null;

function showMessage(text) {
  const container = document.getElementById("cardZone");
  const message = document.createElement("p");
  message.className = "search-message";
  message.textContent = text;
  container.appendChild(message);
}

function clearResults() {
  const container = document.getElementById("cardZone");
  Array.from(container.children).forEach(child => {
    if (child.tagName.toLowerCase() !== 'template') {
      child.remove();
    }
  });
}

// === AFFICHER LES RÉSULTATS, FILTRÉS PAR LES GENRES COCHÉS ===
function renderResults() {
  if (lastAnimeList === null) return;

  const container = document.getElementById("cardZone");
  const template = document.getElementById("cardTemplate");
  const selectedGenres = getSelectedGenres();
  clearResults();

  if (lastAnimeList.length === 0) {
    showMessage("Aucun anime trouvé pour cette recherche.");
    return;
  }

  const filtered = selectedGenres.length > 0
    ? lastAnimeList.filter(anime =>
        anime.genres && selectedGenres.every(genre => anime.genres.includes(genre)))
    : lastAnimeList;

  if (filtered.length === 0) {
    showMessage("Aucun résultat ne correspond à tous les genres cochés.");
    return;
  }

  filtered.forEach(anime => {
    renderCard(anime, template, container);
  });
}

// === FETCH DES ANIMES ===
async function fetchAnime(filterValue, queryText) {
  try {
    clearResults();
    editURL(filterValue, queryText);

    const response = await fetch(url, options);
    if (!response.ok) {
      lastAnimeList = null;
      showMessage(response.status === 401 || response.status === 403
        ? "La clé API a été refusée. Rechargez la page pour en saisir une autre."
        : `La recherche a échoué (erreur ${response.status}).`);
      return;
    }
    const jsonData = await response.json();

    if (jsonData.data && Array.isArray(jsonData.data)) {
      lastAnimeList = jsonData.data;
    } else if (jsonData && typeof jsonData === 'object' && jsonData.title) {
      lastAnimeList = [jsonData];
    } else {
      lastAnimeList = [];
    }

    renderResults();
  } catch (error) {
    console.error("Erreur lors du fetch :", error);
    clearResults();
    showMessage("La recherche a échoué : impossible de joindre l'API.");
  }
}

// === DARK MODE ===
const checkbox = document.getElementById("checkbox");
checkbox.addEventListener("change", () => {
  document.body.classList.toggle("dark");
});

// Récupérer tous les liens 

const links = document.querySelectorAll('a');

// Ajoute d'un gestionnaire d'événements 
links.forEach(link => {
  link.addEventListener('click', event => {
    // Empeche le comportement par défaut 
    event.preventDefault();

    // Vérifier si le lien a la classe 'logo'
    if (link.classList.contains('logo')) {
      // Si la condition est rempli alors on renvoie vers la page index
      window.location.href = '/index.html';
    } else {
      // Récupérer l'ID du photographe à partir de l'élément HTML
      const photographerIdent = link.id;

      // Construire la nouvelle URL avec l'ID du photographe en tant que paramètre de requête
      const newUrl = `https://photographer.html?id=${photographerIdent}`;

      window.location.href = newUrl;
    }
  })




});
async function getPhotographers() {
  const response = await fetch('data/photographers.json');
  if (response.ok) {
    const data = await response.json();

    return data;
  } else {
    console.error('Erreur chargement des photographes');
  }
};


async function displayData(photographers) {
  const photographersSection = document.querySelector(".photographer_section");

  // affiche les photos des photographes
  photographers.forEach((photographer) => {
    const photographerModel = photographerFactory(photographer);
    const userCardDOM = photographerModel.getUserCardDOM();
    photographersSection.appendChild(userCardDOM);

  });

};

async function init() {
  // Récupère les datas des photographes
  const { photographers } = await getPhotographers();
  displayData(photographers);

};

init();










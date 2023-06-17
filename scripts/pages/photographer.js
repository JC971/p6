
const url = window.location.href;
console.log('url de la page est', url);
let photographId = url.split("=")[1];

console.log(photographId);
fetch('data/photographers.json')
  .then(response => response.json())
  .then(data => {
    const media = data['media'];
    const portfolio = [];
    const photographer = data['photographers'];
    let photographCourant;

    // On récupère les photos du photographe
    for (let i = 0; i < media.length; i++) {
      if (media[i].photographerId == photographId) {
        portfolio.push(media[i]);
      }
    }
   

    // On cherche les informations du photographe
    for (let i = 0; i < photographer.length; i++) {
      if (photographer[i].id == photographId && photographer[i].portrait !== undefined) {
        photographCourant = photographer[i];
        break;
      }
    }

    const nameElement = document.createElement('h1');
    nameElement.innerHTML = photographCourant.name;

    const cityCountryElement = document.createElement('h3');
    cityCountryElement.innerHTML = `${photographCourant.city}, ${photographCourant.country}`;

    // Création de l'élément image
    let image = document.createElement("img");

    // Récupérer l'élément contenant l'image
    const photoPortraitElement = document.getElementById('photo-portrait');

    // Définir l'attribut "src" de l'image avec l'URL de l'image du photographe courant
    if (photographCourant.portrait !== undefined && typeof photographCourant.portrait === 'string') {
      image.src = `assets/photographers/${photographCourant.portrait}`;
      image.alt = photographCourant.name;

      // Ajouter l'image au conteneur approprié
      photoPortraitElement.appendChild(image);
    } else {
      // L'URL de l'image du photographe est manquante ou invalide
      console.log("L'URL de l'image du photographe est manquante ou invalide");
    }
    
   
    
    // ajout code

    const portfolioElement = document.getElementById('portfolio-container');
    for (let i = 0; i < portfolio.length; i++){
      //créer un élément pour chaque photo
      let photoElement = document.createElement("img");
      photoElement.src = `assets/images/${photographCourant.name}/${portfolio[i].image}`;
      portfolioElement.appendChild(photoElement);
    }

    // fin ajout de code

    // Ajout des éléments au conteneur
    const container = document.getElementById('photographersContainer');
    container.appendChild(nameElement);
    container.appendChild(cityCountryElement);
  });


// Récupérer tous les liens 
const links = document.querySelectorAll('a');


// Ajoute d'un gestionnaire d'événements 
links.forEach(link => {
link.addEventListener('click', event => {
  // Empêcher le comportement par défaut du lien
  event.preventDefault();
   
  // Récupérer l'ID du photographe à partir de l'élément HTML
  const photographerIdent = link.id;

  // Construire la nouvelle URL avec l'ID du photographe en tant que paramètre de requête
  const newUrl = `https://photographer.html?id=${photographerIdent}`;
 
  window.location.href = newUrl;
});


});

//-------------------------------------------------------------------------


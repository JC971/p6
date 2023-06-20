const url = window.location.href;
console.log('url de la page est', url);
let photographId = url.split("=")[1];

console.log(photographId);
fetch('data/photographers.json')
  .then(response => response.json())
  .then(data => {
    const media = data['media'];
    const portfolio = [];
    //
    const mp4Files = [];
    const photographers = data['photographers'];
    let currentPhotographer;

    // Récupérer les médias du photographe
    for (let i = 0; i < media.length; i++) {
      if (media[i].photographerId == photographId) {
        portfolio.push(media[i]);

        // Récupérer les vidéos du photographe
        if (media[i].video && media[i].video.endsWith('.mp4')) {
          mp4Files.push(media[i])
        }
      }
    }

    // Trouver le portrait du photographe
    for (let i = 0; i < photographers.length; i++) {
      if (photographers[i].id == photographId && photographers[i].portrait !== undefined) {
        currentPhotographer = photographers[i];
        break;
      }
    }


    // Ajouter le nom du photographe 
    const nameElement = document.createElement('h1');
    nameElement.innerHTML = currentPhotographer.name;
    const container = document.getElementById('photographersContainer');
    container.appendChild(nameElement);

    // Ajouter la ville et le pays du photographe 
    const cityCountryElement = document.createElement('h3');
    cityCountryElement.innerHTML = `${currentPhotographer.city}, ${currentPhotographer.country}`;
    container.appendChild(cityCountryElement);

    // Créer et ajouter l'image du photographe au DOM
    const photoPortraitElement = document.getElementById('photo-portrait');
    let image = document.createElement("img");
    if (currentPhotographer.portrait !== undefined && typeof currentPhotographer.portrait === 'string') {
      image.src = `assets/photographers/${currentPhotographer.portrait}`;
      image.alt = currentPhotographer.name;
      photoPortraitElement.appendChild(image);
    } else {
      console.log("L'URL de l'image du photographe est manquante ou invalide");
    }

    // Créer et ajouter les éléments du portfolio au DOM
    const portfolioElement = document.getElementById('portfolio-container');
    for (let i = 0; i < portfolio.length; i++) {
      if (portfolio[i].image && portfolio[i].image.endsWith('.jpg')) {
        let photoElement = document.createElement("img");
        photoElement.src = `assets/images/${currentPhotographer.name}/${portfolio[i].image}`;
        portfolioElement.appendChild(photoElement);
      } else if (portfolio[i].video && portfolio[i].video.endsWith('.mp4')) {
        let videoElement = document.createElement("video");
        videoElement.src = `assets/images/${currentPhotographer.name}/${portfolio[i].video}`;
        videoElement.controls = true;  // Ajouter des contrôles à la vidéo
        portfolioElement.appendChild(videoElement);
      }
    }
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


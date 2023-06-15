
/*


const url = window.location.href;
//console.log('url de la page est', url);
let photographId = url.split("=")[1];

//console.log(photographId)
fetch('data/photographers.json')
.then(response => response.json())
  .then(data => {
  const media = data['media'];
  const portfolio = [];
  const photographer = data['photographers'];
  let photographCourant;
 
    

    

// on récupère les photos du photographe
  for (let i = 0; i < media.length; i++) {
    if (media[i].photographerId==photographId)
    {
      portfolio.push(media[i])


     };


  }

// on cherche les informations du photographe
  for (let i = 0; i < photographer.length; i++)
  {
    if (photographer[i].id == photographId && photographer[i].portrait !==undefined)
    {
      photographCourant=photographer[i]
    }

   console.log(photographer[i].portrait)


  }

  //console.log(photographCourant);
  //console.log(portfolio);
  
  const nameElement = document.createElement('h1');
  nameElement.innerHTML = photographCourant.name;
  const cityCountryElement = document.createElement('h3');
  cityCountryElement.innerHTML = `${photographCourant.city}, ${photographCourant.country}`;
 
  let image=document.createElement("img")

  // Récupérer l'élément contenant l'image
var photoPortraitElement = document.getElementById('photo-portrait');

// Définir l'attribut "src" de l'image avec l'URL de l'image du photographe courant
  //photoPortraitElement.src = photographCourant.portrait;
    image.src = photographer[i].portrait;
  photoPortraitElement.alt =photographer[i].portrait ;

 

  
  // Ajout de l'image au conteneur approprié
  
 

   // ajout de p au container
  
  const container = document.getElementById('photographersContainer');
  container.appendChild(nameElement);
  container.appendChild(cityCountryElement);

    

  if (typeof photographCourant.portrait === 'string') {
    // La propriété 'portrait' contient une URL valide
    //console.log('L\'URL de l\'image du photographe est :', photographCourant.portrait);
  } else {
    // La propriété 'portrait' ne contient pas une URL valide
    //console.log('L\'URL de l\'image du photographe est manquante ou invalide');
  }
  
//console.log(photographCourant.portrait)
  
});
*/


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

    // on récupère les photos du photographe
    for (let i = 0; i < media.length; i++) {
      if (media[i].photographerId == photographId) {
        portfolio.push(media[i]);
      }
    }


    // on cherche les informations du photographe
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

    let image = document.createElement("img");

    // Récupérer l'élément contenant l'image
    const photoPortraitElement = document.getElementById('photo-portrait');

    // Définir l'attribut "src" de l'image avec l'URL de l'image du photographe courant
    if (photographCourant.portrait !== undefined && typeof photographCourant.portrait === 'string') {
      image.src = `assets/photographers/${photographCourant.portrait}`;
      image.alt = photographCourant.name;

      photoPortraitElement.appendChild(image); // Ajouter l'image au conteneur approprié
    } else {
      // L'URL de l'image du photographe est manquante ou invalide
      console.log("L'URL de l'image du photographe est manquante ou invalide");
    }
    console.log(image);
    

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


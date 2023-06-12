/*
function photographerFactory(data) {
  const { name, portrait, city, country, tagline, price, id } = data;

  const picture = `assets/photographers/${portrait}`;

  function getUserCardDOM() {
    
  
    
  }

  return { name, picture, city, country, price, id, getUserCardDOM };

};
*/




const url = window.location.href;
console.log('url de la page est', url);
let photographId = url.split("=")[1];

console.log(photographId)
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
    if (photographer[i].id == photographId)
    {
      photographCourant=photographer[i]
    }
  }

  //console.log(photographCourant);
  console.log(portfolio);
  
  const nameElement = document.createElement('h1');
  nameElement.innerHTML = photographCourant.name;
  const cityCountryElement = document.createElement('h3');
  cityCountryElement.innerHTML = `${photographCourant.city}, ${photographCourant.country}`;
 


  const portraitElement = document.createElement('img');
  portraitElement.src = photographCourant.portrait;
 
  
  // Ajout de l'image au conteneur approprié
  
 

   // ajout de p au container
  
  const container = document.getElementById('photographersContainer');
  container.appendChild(nameElement);
  container.appendChild(cityCountryElement);

  const containerPortrait = document.getElementById('container-portrait');
  containerPortrait.appendChild(portraitElement);
  

  
console.log(photographCourant.portrait)
  
  
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





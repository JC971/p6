
  function photographerFactory(data) {
    const { name, portrait, city, country, tagline, price, id } = data;
  
    const picture = `assets/photographers/${portrait}`;
  
    function getUserCardDOM() {
      
    
      
    }
  
    return { name, picture, city, country, price, id, getUserCardDOM };
  
  };

  
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
    const newUrl = `https://Front-End-Fisheye\photographer.html?id=${photographerIdent}`;
   
    window.location.href = newUrl;
  });

 
});

  
const url = window.location.href;
console.log('url de la page est', url);
let arr = url.split("=")[1];


  fetch('data/photographers.json')
  .then(response => response.json())
  .then(data => {
    const photographers = data['photographers'];

    for (let i = 0; i < photographers.length; i++) {
      const photographerData = photographers[i];
     
   

      // Créer un élément <p> pour afficher le nom du photographe
      const nameElement = document.createElement('p');
      nameElement.innerHTML = photographerData.name;

      // Ajouter l'élément au conteneur approprié dans votre page HTML
      const container = document.getElementById('photographersContainer');
      container.appendChild(nameElement);
    }
  });






const url = window.location.href;
console.log('url de la page est', url);
let photographId = url.split("=")[1];
const container = document.getElementById('photographersContainer');
const portfolioElement = document.getElementById('portfolio-container');
let totalLikesElement=document.getElementById('total-likes');


// je récupère les données
fetch('data/photographers.json')
  .then(response => response.json())
  .then(data => {
    let media = data['media'];
    let photographers = data['photographers'];
    
    let portfolio = [];
    const mp4Files = [];
    let tabLike = [];
    const mediaTitle = [];
    const photoPrice = [];
    
    let currentPhotographer;

    // Récupérer les médias du photographe dans un tableau
    for (let i = 0; i < media.length; i++) {
      if (media[i].photographerId == photographId) {
        portfolio.push(media[i]);
       
        // Récupérer les vidéos du photographe mp4
        if (media[i].video && media[i].video.endsWith('.mp4')) {
          mp4Files.push(media[i])
        }

        // pour récupérer les likes
        if (media[i].likes) {
          tabLike.push(media[i]);
        }

        // pour récupérer le titre de chaque imge
        if (media[i].title){ 
          mediaTitle.push(media[i]);
        }
      }
    };

    // Trouver le portrait du photographe
    for (let i = 0; i < photographers.length; i++) {
      if (photographers[i].id == photographId && photographers[i].portrait !== undefined) {
        currentPhotographer = photographers[i];
        break;
      }
    };

    let photographerPrice;

    for (let i = 0; i < photographers.length; i++){
      if (photographers[i].price) {
        //création du tableau photoPrice
        photoPrice.push(photographers[i]);
      }
    };
    
    for (let i = 0; i < photographers.length; i++) {
      
      if (photographers[i].id == photographId) {
          photographerPrice = photographers[i].price;
          break;
      }

    };

    console.log(photographerPrice)
  
  if (photographerPrice === undefined) {
    console.log("Aucun photographe trouvé avec l'ID ", photographId);
    };

    // Ajouter le nom du photographe 
    const nameElement = document.createElement('h1');
    nameElement.innerHTML = currentPhotographer.name;
    container.appendChild(nameElement);

    // Ajouter la ville et le pays du photographe 
    const cityCountryElement = document.createElement('h3');
    cityCountryElement.innerHTML = `${currentPhotographer.city}, ${currentPhotographer.country}`;
    container.appendChild(cityCountryElement);

    // ajouter la tagline du photographe
    const taglineElement = document.createElement('div');
    taglineElement.classList.add('tagline');
    taglineElement.innerHTML = `${currentPhotographer.tagline}`;
    container.appendChild(taglineElement);


    // je recupère la modale
    let modalHeader = document.querySelector('#contact_modal .modal header');

    // je crée du contenu html pour insérer le nom du photographe dans ma modale
  
    modalHeader.innerHTML = `
  <div class="header-content">

  <h2>Contactez-moi</h2>
  
  <div class="photographerName">${currentPhotographer.name}</div>

  </div>

  <img src="assets/icons/close.svg" onclick="closeModal()" />
`;

    // Créer et ajouter l'image du photographe au DOM
    const photoPortraitElement = document.getElementById('photo-portrait');

    let image = document.createElement("img");

    if (currentPhotographer.portrait !== undefined && typeof currentPhotographer.portrait === 'string') {
      image.src = `assets/photographers/${currentPhotographer.portrait}`;
      image.alt = currentPhotographer.name;
      photoPortraitElement.appendChild(image);
      let likes = document.querySelector('like');
    
    } else {
      console.log("L'URL de l'image du photographe est manquante ou invalide");
    
    };


    //je classe les images par nombre de likes
  portfolio.sort((a, b) => b.likes - a.likes);

  //calcul total likes
    //let totalLikesInnerElement = document.createElement('div');
    //totalLikesElement.classList.add('compteur');
    //totalLikesElement.appendChild(totalLikesInnerElement);
    //le compteur est à zéro
    let total = 0;

// boucle images jpg ou mp4
    for (let i = 0; i < portfolio.length; i++) {

  // si les images du portfolio sont en jpg 
      if (portfolio[i].image && portfolio[i].image.endsWith('.jpg')) {
      
    let photoElement = document.createElement("div");
    photoElement.classList.add("photo-item");

    let imageElement = document.createElement("img");
    imageElement.src = `assets/images/${currentPhotographer.name}/${portfolio[i].image}`;
    photoElement.appendChild(imageElement);

    let titleElement = document.createElement("div");
    titleElement.classList.add("photo-title"); 
    titleElement.innerText = portfolio[i].title;
    photoElement.appendChild(titleElement);

    let likesElement = document.createElement("div");
    likesElement.classList.add("photo-likes"); 
    
    let likesText = document.createTextNode(`${portfolio[i].likes} `);
  
    total += portfolio[i].likes ;
    
    likesElement.appendChild(likesText);

    //je déclare les icones
    let heartIcon = document.createElement("i");
    heartIcon.classList.add("fas");
    heartIcon.classList.add("fa-heart");
      
  // augmenter le nombre de likes à chaque click
      heartIcon.addEventListener("click", function () {
        //pour augmenter de 1 chaque fois le nbre de likes de mes photos
        portfolio[i].likes++;
        //permet de mettre à jour le nbre de likes
        likesText.nodeValue = `${portfolio[i].likes} `;

        total++;
        
        totalLikesCount.innerHTML = `${total}x  ❤️ ❤️xx`;
        

      });
        
      // fin de la fonction qui augmente le nombre de likes au click pour les photos
        
    // création de la div nombre total de likes
    globalElement = document.createElement('div');
        
    //insertion de l'icone coeur
    likesElement.appendChild(heartIcon);

    photoElement.appendChild(likesElement);
    
    portfolioElement.appendChild(photoElement);
        
    
//dans les cas ou le format est en mp4
  } else if (portfolio[i].video && portfolio[i].video.endsWith('.mp4')) {
    let videoElement = document.createElement("div");
    videoElement.classList.add("video-item");

    let actualVideoElement = document.createElement("video");
    actualVideoElement.src = `assets/images/${currentPhotographer.name}/${portfolio[i].video}`;
    actualVideoElement.controls = true; 
    videoElement.appendChild(actualVideoElement);

    let titleElement = document.createElement("div");
    titleElement.classList.add("video-title");
    titleElement.innerText = portfolio[i].title;
    videoElement.appendChild(titleElement);

    let likesElement = document.createElement("div");
    likesElement.classList.add("video-likes");

    let likesText = document.createTextNode(`${portfolio[i].likes} `);
    likesElement.appendChild(likesText);

    let heartIcon = document.createElement("i");
    heartIcon.classList.add("fas");
      heartIcon.classList.add("fa-heart");
      
    // fonction au click
        
      heartIcon.addEventListener("click", function () {
        portfolio[i].likes++;
        // incrémentation des likes des videos
     
        likesText.nodeValue = `${portfolio[i].likes}`;
        
        //pour incrémenter le total défini dans la variable total
        total++;

        //pour mettre à jour le nombre total de click
        totalLikesCount.innerHTML = `${total} ❤️`;

      });
      // fin de la fonction qui augmente le nombre de likes au click
     
    likesElement.appendChild(heartIcon);

    videoElement.appendChild(likesElement);

        portfolioElement.appendChild(videoElement);
      }

      
    }; // fin de la boucle
    
// création du prix du photographe par jour
    let dayPrice = document.createElement("div");
dayPrice.classList.add("rate");
dayPrice.innerHTML = `${photographerPrice} € / jour`;

// creation dinitiale du nombre total de likes
    let totalLikesCount = document.createElement("div");
totalLikesCount.className = 'total-likes__number';
    let emojiElement = document.createElement("span");
emojiElement.id = "emoji";
    emojiElement.innerHTML = "";
    // passer l'emoji en noir
emojiElement.style.filter = "brightness(0)";
totalLikesCount.innerHTML = `${total} `;
totalLikesCount.appendChild(emojiElement);

    
    let rateElement = document.querySelector('.rate');
    totalLikesElement.appendChild(totalLikesCount);
    totalLikesElement.appendChild(dayPrice);
   
    
    let selectedOption = document.getElementById('selectedOption');
    let options = document.getElementById('options');
    let dropdownOptions = Array.from(options.getElementsByClassName('option'));


    selectedOption.addEventListener('click', function () {
      let display = options.style.display;
      options.style.display = display === 'none' ? 'block' : 'none';

    });


    //tri du tableau par likes
    
    let sortedTabLike = tabLike.sort((a, b) => b.likes - a.likes);

   
    dropdownOptions.forEach(option => {
      option.addEventListener('click', function () {
        selectedOption.innerHTML = this.textContent + ' ' + '&#9652;';
        options.style.display = 'none';
      })
    });
    
  });

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


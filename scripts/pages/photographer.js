const url = window.location.href;
console.log('url de la page est', url);
let photographId = url.split("=")[1];
const container = document.getElementById('photographersContainer');
const portfolioElement = document.getElementById('portfolio-container');
let totalLikesElement = document.getElementById('total-likes');

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
    let currentMediaIndex = 0;
    let currentPhotographer;

    // Récupérer les médias du photographe dans un tableau
    for (let i = 0; i < media.length; i++) {
      if (media[i].photographerId == photographId) {
        portfolio.push(media[i]);
       
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

    for (let i = 0; i < photographers.length; i++) {
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

    let tri = 'like';

    
    if (tri == 'titre') {
    portfolio.sort((a, b) => {
        // logique de tri
        if (a.title > b.title) { return 1 }
        if (a.title< b.title) { return -1 }
    })
    };
    

    if (tri == 'like') {
        portfolio.sort((a, b) => {
      // logique de tri
      if (a.likes > b.likes) { return -1 }
      if (a.likes < b.likes) { return 1 }
  })
    };
    
    if (tri == 'date') {
      portfolio.sort((a, b) => {
        if (a.date > b.date) { return 1 }
        if(a.date<b.date){return -1}
  })
}

      
    
   
    
 //initialisation de la variable pour stocker la somme totale des likes init à 0
    let total = 0;
     
    // ouverture de la modale
    function openModale(mediaSrc, type, index) {
      currentMediaIndex = index;
      const modale = document.querySelector('.lightbox-modal .lightbox-image-container');
  
      //j'inscris tous les media dans ma modale (image et video)
      const existingMedia = modale.querySelector('#modale-image, #modale-video');
      if (existingMedia) {
        existingMedia.remove();
      }
      // pour les images
      if (type === 'image') {
        const modalImage = document.createElement('img');
        modalImage.id = "modale-image";
        modalImage.src = mediaSrc;
        modale.insertBefore(modalImage, modale.querySelector('.lightbox-close'));
        // pour ls videos
      } else if (type === 'video') {
        const modalVideo = document.createElement("video");
        modalVideo.id = "modale-video";
        modalVideo.src = mediaSrc;
        modalVideo.controls = true;
        modale.insertBefore(modalVideo, modale.querySelector('.lightbox-close'));
      }
  
      document.querySelector('.lightbox-modal').style.display = 'block';
    }
    
    // fermeture de la modale
    function closeModale() {
      const modale = document.querySelector('.lightbox-modal');
      // je fais disparaitre la modale
      modale.style.display = 'none';
    }
    // fonction qui regroupe les images et les vidéo 
    function displayMediaInLightbox(src, type, index) {
      currentMediaIndex = index || currentMediaIndex; 
  
      const containerLightbox = document.querySelector('.lightbox-image-container');
  
      //remise à zero
      const previousMedia = containerLightbox.querySelector('#modale-image, #modale-video, img, video');
      if (previousMedia) {
          previousMedia.remove();
      }
  
      let newMediaElement;  
      if (type === 'image') {
          newMediaElement = document.createElement('img'); 
          newMediaElement.src = src;  
          newMediaElement.id = "modale-image"; 
      } else if (type === 'video') {
          newMediaElement = document.createElement('video');  
          newMediaElement.src = src;  
          newMediaElement.controls = true;
          newMediaElement.id = "modale-video"; 
      }
  
      if (newMediaElement) {
          containerLightbox.insertBefore(newMediaElement, containerLightbox.querySelector('.lightbox-close'));  // And here
      }
  
      // pour afficher la modale
      const modal = document.querySelector('.lightbox-modal');
      if (modal.style.display !== 'block') {
          modal.style.display = 'block';
      }
  }
  
  
    //fonction pour faire défiler les vidéo à l'aide du bouton suivant
 function nextMedia() {
  if (currentMediaIndex < portfolio.length - 1) {
      currentMediaIndex++;
      const media = portfolio[currentMediaIndex];
      const src = media.image ? `assets/images/${currentPhotographer.name}/${media.image}` : `assets/images/${currentPhotographer.name}/${media.video}`;
      const type = media.image ? 'image' : 'video';
      displayMediaInLightbox(src, type);
   }
   
}

    //fonction pour revenir en arrière
function previousMedia() {
  if (currentMediaIndex > 0) {
    currentMediaIndex--;
    const media = portfolio[currentMediaIndex];
    const src = media.image ? `assets/images/${currentPhotographer.name}/${media.image}` : `assets/images/${currentPhotographer.name}/${media.video}`;
    const type = media.image ? 'image' : 'video';
    displayMediaInLightbox(src, type);
  }
}
 // écoute pour les bouton suivant et précédent
    document.querySelector('.lightbox-next').addEventListener('click', nextMedia);
    
    document.querySelector('.lightbox-previous').addEventListener('click', previousMedia);
  
    // fermeture de la modale au click 
    document.querySelector('.lightbox-close').addEventListener('click', closeModale);
    



      // boucle images et vidéos
      for (let i = 0; i < portfolio.length; i++) {

        // si les images du portfolio sont au format jpg 
        if (portfolio[i].image && portfolio[i].image.endsWith('.jpg')) {
      
          let photoElement = document.createElement("div");
          photoElement.classList.add("photo-item");

          let imageElement = document.createElement("img");
          imageElement.src = `assets/images/${currentPhotographer.name}/${portfolio[i].image}`;

          //ecouteur d'évènement pour ouvrir la modale au click sur une image
          imageElement.addEventListener('click', function () {
            openModale(imageElement.src, 'image', i);
          
          });

          photoElement.appendChild(imageElement);

          let titleElement = document.createElement("div");
          titleElement.classList.add("photo-title");
          titleElement.innerText = portfolio[i].title;
          photoElement.appendChild(titleElement);

          let likesElement = document.createElement("div");
          likesElement.classList.add("photo-likes");
    
          let likesText = document.createTextNode(`${portfolio[i].likes} `);
  
          total += portfolio[i].likes;
    
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
        
            totalLikesCount.innerHTML = `${total} 🖤 `;
        

          });
      
          // fin de la fonction qui augmente le nombre de likes au click pour les photos
        
          // création de la div nombre total de likes
          globalElement = document.createElement('div');
        
          //insertion de l'icone coeur
          likesElement.appendChild(heartIcon);

          photoElement.appendChild(likesElement);
    
          portfolioElement.appendChild(photoElement);
        
    
          //si les images du portfolio sont au format mp4
        } else if (portfolio[i].video && portfolio[i].video.endsWith('.mp4')) {
          let videoElement = document.createElement("div");
          videoElement.classList.add("video-item");
        

          let actualVideoElement = document.createElement("video");
          actualVideoElement.src = `assets/images/${currentPhotographer.name}/${portfolio[i].video}`;
          actualVideoElement.controls = true;
          videoElement.appendChild(actualVideoElement);
        
          //ecouteur pour les vidéos au format mp4
        
          actualVideoElement.addEventListener('click', function () {
            openModale(actualVideoElement.src, 'video',i);
          
          });

        
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

            //pour mettre à jour le nombre total de click mp4
            totalLikesCount.innerHTML = `${total} 🖤 `;

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
      //emojiElement.style.filter = "brightness(0)";
      totalLikesCount.innerHTML = `${total} 🖤`;
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
  ;
  
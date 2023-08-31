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
  <img src="assets/icons/closewhite.svg" onclick="closeModal()" />
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

    //DROPDOWN
    // function
    function sortPortfolioByDate() {
      portfolio.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    function sortPortfolioByPopularity() {
      portfolio.sort((a, b) => b.likes - a.likes);
    }


    function sortPortfolioByTitle() {
      portfolio.sort((a, b) => a.title.localeCompare(b.title));
    }



    // affiche le portfolio d'un photographe

    function displayPortfolio() {
      const portfolioContainer = document.querySelector('#portfolio-container');
      portfolioContainer.innerHTML = '';

      let total = 0;

      for (let i = 0; i < portfolio.length; i++) {
        total += portfolio[i].likes;
        let mediaElement;
        let type;

        // cas d'une image
        if (portfolio[i].image && portfolio[i].image.endsWith('.jpg')) {
          mediaElement = document.createElement("img");
          // thumbnail pour que le site se charge plus rapidement
          let handle = portfolio[i].image;
          let tmp = handle.split('.')
          let extension = tmp.pop()
          let filename = tmp.join('.')

          mediaElement.src = `assets/images/${currentPhotographer.name}/${filename}_thumbnail.${extension}`;
          type = 'image';
        }
        //cas d'une video
        else if (portfolio[i].video && portfolio[i].video.endsWith('.mp4')) {
          mediaElement = document.createElement("video");
          mediaElement.src = `assets/images/${currentPhotographer.name}/${portfolio[i].video}`;
          mediaElement.controls = true;
          type = 'video';
        }
        // constitution d'une card qui contient l'image, le coeur, le nb de like
        if (mediaElement) {
          let containerElement = document.createElement("div");
          containerElement.classList.add(type === 'image' ? "photo-item" : "video-item");

          mediaElement.addEventListener('click', function () {
            openModale(mediaElement.src, type, i);
          });
          containerElement.appendChild(mediaElement);


          let titleElement = document.createElement("div");
          titleElement.classList.add(type + "-title");
          titleElement.innerText = portfolio[i].title;
          containerElement.appendChild(titleElement);

          let likesElement = document.createElement("div");
          likesElement.classList.add(type + "-likes");

          let likesText = document.createTextNode(`${portfolio[i].likes} `);
          likesElement.appendChild(likesText);

          //
          let heartIcon = document.createElement("i");
          heartIcon.classList.add("fa-regular");
          heartIcon.classList.add("fa-heart");



          // click sur coeur de la photo
          heartIcon.addEventListener("click", function (e) {
            // detect en fonction de la class si on a déjà liké ou non
            let lesclasses = heartIcon.className;

            console.log(lesclasses)

            if (lesclasses.includes('fa-regular')) {
              heartIcon.classList.remove('fa-regular')
              heartIcon.classList.add('fa-solid')
              portfolio[i].likes++;
              likesText.nodeValue = `${portfolio[i].likes} `;
              total++;
            } else {
              heartIcon.classList.add('fa-regular')
              heartIcon.classList.remove('fa-solid')
              portfolio[i].likes--;
              likesText.nodeValue = `${portfolio[i].likes} `;
              total--;
            }

            if (totalLikesCount) {
              totalLikesCount.innerHTML = `${total} <span class="fa-heart fa-solid" style="color:black"></span>  ${photographerPrice} € / jour`;
            }
          });



          likesElement.appendChild(heartIcon);
          containerElement.appendChild(likesElement);
          portfolioContainer.appendChild(containerElement);
        }

      }

      // je crée et j'ajoute le nombre total de likes
      let totalLikesCount = document.createElement("div");
      totalLikesCount.id = "total-likes"
      totalLikesCount.innerHTML = `${total} <span class="fa-heart fa-solid" style="color:black"></span> ${photographerPrice} € / jour`;
      portfolioContainer.appendChild(totalLikesCount);


      let dayPrice = document.createElement("div");
      dayPrice.classList.add("rate");
      portfolioContainer.appendChild(dayPrice)
      // j'ajoute day price au portfolio container

      console.log(dayPrice);
      console.log(totalLikesElement)
    }

    // Code de tri par popularité,date,titre
    document.getElementById('date').addEventListener('click', () => {
      sortPortfolioByDate();
      displayPortfolio();
    });

    document.getElementById('pop').addEventListener('click', () => {
      sortPortfolioByPopularity();
      displayPortfolio();
    });

    document.getElementById('titre').addEventListener('click', () => {
      sortPortfolioByTitle();
      displayPortfolio();
    });

    const containerDropdown = document.querySelector('.container-dropdown');
    let secondClick = false;

    // tous les boutons sont cachés à part le premier enfant du dropdown
    for (let child of containerDropdown.children) {
      if (child !== containerDropdown.firstElementChild) {
        child.style.display = 'none';
      }
    }
//
    containerDropdown.addEventListener('click', (e) => {
      //si c'est le prmier click alors
      if (!secondClick) {
        //quand je clique sur un bouton au départ, tous les boutons s'affichent
        for (let child of containerDropdown.children) {
          child.style.display = '';
          child.style.borderTop = "solid white 1px";
         
        }
      } else {
        // au deuxième clic, que le bouton cliqué est visible
        for (let child of containerDropdown.children) {
          child.style.display = 'none';
        }
        e.target.style.display = '';  // Le bouton cliqué est affiché
      }
      secondClick = !secondClick;
    });




    // Initialisation du tri par défaut et affichage du portfolio
    sortPortfolioByDate();
    displayPortfolio();

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


    //let rateElement = document.querySelector('.rate');

  });
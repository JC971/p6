const url = window.location.href;
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
    nameElement.style.fontFamily = "Arial"
    container.appendChild(nameElement);

    // Ajouter la ville et le pays du photographe 
    const cityCountryElement = document.createElement('h2');
    cityCountryElement.innerHTML = `${currentPhotographer.city}, ${currentPhotographer.country}`;
    cityCountryElement.style.fontFamily = "Arial"
    container.appendChild(cityCountryElement);

    // ajouter la tagline du photographe
    const taglineElement = document.createElement('div');
    taglineElement.classList.add('tagline');
    taglineElement.style.fontFamily = "Arial"
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
  <img src="assets/icons/closewhite.svg" onclick="closeModal()" alt='fermer'/>
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

    // functions tri
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
        if (portfolio[i].image && (portfolio[i].image.endsWith('.jpg') || portfolio[i].image.endsWith('.png'))) {
          // la var lemedia est l'objet qui va contenir les informations de l'image
          let lemedia = new MediaFactory(portfolio[i], currentPhotographer)

          mediaElement = document.createElement("img");
          // ajout attribut alt
          mediaElement.setAttribute('alt', lemedia._title)
          // utilisation thumbnail pour que le site se charge plus rapidement
          // prise en charge des miniatures
          // extraction du nom nom de fichier sans l'extension
          let handle = lemedia._image;
          let tmp = handle.split('.')
          let extension = tmp.pop() // on fait sautre l'extension
          let filename = tmp.join('.') // on rassembler les différentes partie pour reconstituer le nom de l'image pour éviter le cas suivant :  nom_imags.jpg.png

          mediaElement.src = `assets/images/${currentPhotographer.name}/${filename}_thumbnail.${extension}`;
          type = 'image';
        }
        //cas d'une video
        // pas besoni de miniature
        else if (portfolio[i].video && portfolio[i].video.endsWith('.mp4')) {
          // utiliser mediaFactory
          let lemedia = new MediaFactory(portfolio[i], currentPhotographer)
          //console.log(lemedia)
          mediaElement = document.createElement("video");

          // ajout attribut alt
          mediaElement.setAttribute('alt', lemedia._title)

          let handle = lemedia._video;
          let tmp = handle.split('.')
          let extension = tmp.pop() // on fait sautre l'extension
          let filename = tmp.join('.') // on rassembler les différentes partie pour reconstituer le nom de l'image pour éviter le cas suivant :  nom_imags.jpg.png



          mediaElement.src = `assets/images/${lemedia._photographerName}/${lemedia._video}`;
          mediaElement.controls = true;
          type = 'video';

        }

        // constitution d'une card qui contient la video, le coeur, le nb de like
        if (mediaElement) {
          let containerElement = document.createElement("article");
          containerElement.classList.add(type === 'image' ? "photo-item" : "video-item");
          // ajout du click pour ouvrir la modale
          mediaElement.addEventListener('click', function (e) {
            openModale(mediaElement.src, type, i);
          });


          // ajout du du tabIndex
          containerElement.setAttribute('tabIndex', 100 + i);


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
          let heartIcon = document.createElement("span");
          heartIcon.classList.add("fa-regular");
          heartIcon.classList.add("fa-heart");



          // click sur coeur de la photo
          heartIcon.addEventListener("click", function (e) {
            // detect en fonction de la class si on a déjà liké ou non
            let lesclasses = heartIcon.className;


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
              totalLikesCount.innerHTML = `${total} <span class="fa-heart fa-solid" style="color:black"></span> `;
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
      totalLikesCount.innerHTML = `${total} <span class="fa-heart fa-solid" style="color:black"></span>`;
      portfolioContainer.appendChild(totalLikesCount);


      let dayPrice = document.createElement("div");
      dayPrice.classList.add("rate");
dayPrice.innerHTML=`${photographerPrice} € / jour`
      portfolioContainer.appendChild(dayPrice)

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

    //dropdown
    
    const containerDropdown = document.querySelector('.container-dropdown');
    let secondClick = false;
    const btnTitre = document.getElementById("titre");
    const btnPop = document.getElementById("pop");
    const chevron = document.querySelector(".chevron-haut");
    
    containerDropdown.addEventListener('click', (e) => {
      // pointer-event:none for video for the time being
      let video = document.querySelector('.video-item');
      video.style.pointerEvents = "none";
    
      if (!secondClick) {
        console.log('click 1')
    
        containerDropdown.style.height = "150px";
        // quand je clique sur un bouton au départ, tous les boutons s'affichent
        for (let child of containerDropdown.children) {
          child.style.display = '';
          // Retirez la classe "active" de tous les boutons
          child.classList.remove('active');
          // Masquer le chevron du bouton btnPop
          if (child === btnPop || child === btnTitre) {
            const chevron = child.querySelector(".chevron-haut");
            if (chevron) {
              chevron.style.display = "none";
            }
          }
        }
      } else {
    
        console.log('click 2')
    
        containerDropdown.style.height = "45px";
    
        // au deuxième clic, que le bouton cliqué est visible
        for (let child of containerDropdown.children) {
          child.style.display = 'none';
        }
        e.target.style.display = '';  // Le bouton cliqué est affiché
        // Ajoutez la classe "active" uniquement au bouton cliqué
        e.target.classList.add('active');
        // Afficher le chevron sur les boutons btnPop et btnTitre quand ils sont cliqués
        if (e.target === btnPop || e.target === btnTitre) {
          const chevron = e.target.querySelector(".chevron-haut");
          if (chevron) {
            chevron.style.display = "inline-block";
          }
        }
        // hack pb avec pointer event pour les éléments vidéo
        video.style.pointerEvents = "auto";
      }
      secondClick = !secondClick;
    });
    


    // Initialisation du tri par défaut et affichage du portfolio
    sortPortfolioByDate();
    displayPortfolio();

    //initialisation de la variable pour stocker la somme totale des likes init à 0
    let total = 0;

    // ouverture de la modale PHOTO/VIDEO
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
        modalImage.alt = "image du portfolio";
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


    // écoute pour les bouton suivant et précédent à al souris
    document.querySelector('.lightbox-next').addEventListener('click', (e) => nextMedia());
    document.querySelector('.lightbox-previous').addEventListener('click', (e) => previousMedia());
    // a clavier
    document.querySelector('body').addEventListener('keydown', (e) => {
      if (e.keyCode == 37)
        previousMedia()
      if (e.keyCode == 39)
        nextMedia()
      if (e.keyCode == 13)
        nextMedia()

    });

    // fermeture de la modale au click 
    document.querySelector('.lightbox-close').addEventListener('click', closeModale);


  });// fin de fetch




// fermeture de la modale
function closeModale() {
  const modale = document.querySelector('.lightbox-modal');
  // je fais disparaitre la modale
  modale.style.display = 'none';
}


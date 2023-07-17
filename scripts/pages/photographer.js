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
    let tabLike = [];

    const mediaTitle = [];


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
        // pour récupérer les likes
        if (media[i].likes) {
          tabLike.push(media[i]);
          
        }

        // pour récupérer le titre de chaque imge
        if (media[i].title){ 
          mediaTitle.push(media[i]);
        }

      }
    }
   console.log(mediaTitle)
   
    
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
      let likes = document.querySelector('like');
     

    } else {
      console.log("L'URL de l'image du photographe est manquante ou invalide");
    }

    // ajouter le titre à l'image du photographe

    
portfolio.sort((a, b) => b.likes - a.likes);
const portfolioElement = document.getElementById('portfolio-container');

for (let i = 0; i < portfolio.length; i++) {
  if (portfolio[i].image && portfolio[i].image.endsWith('.jpg')) {
    let photoElement = document.createElement("div");
    photoElement.classList.add("photo-item");

    //

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
  //

    
    
    likesElement.appendChild(likesText);
//
    console.log('toto');
    console.log(likesText)


    //
    let heartIcon = document.createElement("i");
    heartIcon.classList.add("fas");
    heartIcon.classList.add("fa-heart");

    heartIcon.addEventListener("click", function () {
      //pour augmenter de 1 chaque fois le nbre de likes
      portfolio[i].likes++;
      //permet de mettre à jour le nbre de likes
      likesText.nodeValue = `${portfolio[i].likes} `;
})


    likesElement.appendChild(heartIcon);
    
    photoElement.appendChild(likesElement);
    
    portfolioElement.appendChild(photoElement);
    

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


    
    likesElement.appendChild(heartIcon);

    

    videoElement.appendChild(likesElement);

    portfolioElement.appendChild(videoElement);
  }
}
       

    
    let selectedOption = document.getElementById('selectedOption');
    let options = document.getElementById('options');
    let dropdownOptions = Array.from(options.getElementsByClassName('option'));

    selectedOption.addEventListener('click', function () {
      let display = options.style.display;
      options.style.display = display === 'none' ? 'block' : 'none';


 
    });
    //tri du tableau par likes
    
    let sortedTabLike = tabLike.sort((a, b) => b.likes - a.likes);
    console.log(sortedTabLike)



    dropdownOptions.forEach(option => {
      option.addEventListener('click', function () {
        selectedOption.innerHTML = this.textContent + ' ' + '&#9652;';
        options.style.display = 'none';
        
      });
     
        
    });
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



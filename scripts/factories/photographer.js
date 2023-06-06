

function photographerFactory(data) {
    const { name, portrait, city, country, tagline, price, id } = data;
  
    const picture = `assets/photographers/${portrait}`;
  
    function getUserCardDOM() {
        const article = document.createElement('article');
        
  
      // Création de l'élément <a> avec l'ancre
      const a = document.createElement('a');
       a.setAttribute('href', `http://127.0.0.1:5500/Front-End-Fisheye/photographer.html?id=${id}`);
      
      const img = document.createElement('img');
      img.setAttribute('src', picture);
      img.setAttribute('alt', name);
  
      // Ajout de l'image à l'élément 
      a.appendChild(img);
  
      const h2 = document.createElement('h2');
      const h3 = document.createElement('h3');
      const p = document.createElement('p');
      const h4 = document.createElement('h4');
      const photographerId = document.createElement('span');
      
      h2.textContent = name;
      h3.textContent = `${city}, ${country}`; // Utilisation d'un template string pour la concaténation
      p.textContent = tagline;
      h4.textContent = `${price} €`;
     
      article.appendChild(a);
      article.appendChild(h2);
      article.appendChild(h3);
      article.appendChild(p);
      article.setAttribute('id', id)
      article.appendChild(h4);
      
    
      
        
      return article;
    }
  
    return { name, picture, city, country, price, id, getUserCardDOM };
  
};




fetch('data/photographers.json')
.then(response => response.json())
    .then(data => {
      
        return data
        
        

})
    .catch(error => console.error(error));





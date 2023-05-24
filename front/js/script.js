fetch(" http://localhost:3000/api/products")

.then(function(response){
    return response.json()  
})
  // Boucle for qui itére à travers les données reçu et injecte les différents éléments dans le template //
  .then(function(data){
      for(product of data){
          document.querySelector("#items").innerHTML += `<a href="./product.html?id=${product._id}">
          <article>
            <img src="${product.imageUrl}" alt="${product.altTxt}">
            <h3 class="productName">${product.name}</h3>
            <p class="productDescription">${product.description}.</p>
          </article>
        </a>`;
      }
    
  })



.catch(function(err) {
    // Une erreur est survenue
    console.log("probléme " + err)
  });

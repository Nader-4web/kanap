
let id = new URL(location.href).searchParams.get("id")

if(!id){
  document.querySelector("main").remove()
    alert("Nous sommes désolé, il semblerait que la page rencontre un problème. Vous allez être rediriger vers la page d'accueil")
    location.href = "index.html"
}
fetch(` http://localhost:3000/api/products/${id}`)

.then((response)=> response.json())

.then(function(product){
    
    displayProduct(product)
    chooseColor(product)
    addToCart()
    
    
  })
  
  .catch(function(err) {
    document.querySelector("main").remove()
    alert("Désolé, il semblerait que ce produit n'éxiste pas ou plus dans notre base de donnée")
    location.href = "index.html"
    console.log(err)
  });


  // Fonction qui affiche le produit (image,alt, description, nom, prix) //
  function displayProduct(product){

      let img = document.querySelector(".item__img");
      img.innerHTML =`<img src="${product.imageUrl}" alt="${product.altTxt}">`
      document.querySelector("#title").innerHTML = product.name;
      document.querySelector("#price").innerHTML = formatPrice(product.price);
      document.querySelector("#description").innerHTML = product.description;
  }
  
  // Fonction permettant de choisir la couleur du produit // 
  function chooseColor(product){
    
    let colorsArray = product.colors;
    for(color of colorsArray){
      document.querySelector("#colors").innerHTML += ` <option value="${color}">${color}</option> `
    }
  }
  
  
  // Fonction qui ajoute le produit au panier (LocalStorage)
  function addToCart(){
    
    let cartButton = document.querySelector("#addToCart");
    
    cartButton.addEventListener("click",()=>{
      
      let color = document.getElementById("colors").value;
      let quantity = Number (document.getElementById("quantity").value);
      let cart;
      
      if(!color){
        alert("Veillez sélectionner une couleur")
        return;
      }
      
      if(quantity < 1 || quantity > 100){
        alert("Veuillez sélectionner une quantité entre 1 et 100")
        return;
      }

      if(localStorage.getItem("cart")){
        cart = JSON.parse(localStorage.getItem("cart"))
      }else{
        cart = [];
      }

      let article = {"id": id, "color": color, "quantity": quantity};
      let findProduct = cart.find(p => p.id == article.id && p.color == article.color)
      if(findProduct != undefined){

        findProduct.quantity += article.quantity;
        alert("Article ajouté au panier")
  
      }else{
    
        cart.push(article)
        alert("Article ajouté au panier")
    
      }
  
        localStorage.setItem("cart", JSON.stringify(cart));
  })
  
}
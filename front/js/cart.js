

let cart = JSON.parse(localStorage.getItem("cart"));


if (cart =="" || !cart) {
  document.querySelector("h1").innerHTML = "PANIER VIDE";
  document.querySelector(".cart").remove();
} else {

  fetch(" http://localhost:3000/api/products")

    .then((response) => response.json())

    .then(function (products) {

      const productsInCart = JSON.parse(localStorage.getItem("cart"));
      productsInCart.forEach(el => {

        const product = products.find(p => p._id === el.id);
        displayArticle(product, el);
        
      })
      
      deleteItem()
      updateQuantity();
      displayTotalQuantity()
      displayTotalPrice(cart, products)
      listenFormInputs()
      disableForm()

    })

}



  // Function permettant de supprimer un article //
function deleteItem() {

  let deleteItem = document.querySelectorAll(".deleteItem")
  deleteItem.forEach(input => {
    input.addEventListener("click", (e) => {
      let data = e.target.closest(".cart__item")
      let id = data.dataset.id;
      let color = data.dataset.color;
      let cart = JSON.parse(localStorage.getItem("cart"));
      const index = cart.findIndex(p => p.id === id && p.color == color);
      cart.splice(index, 1)
      localStorage.setItem("cart", JSON.stringify(cart));
      location.reload();
    })

  })

}

// Fonction permettant d'afficher le produit du panier// 
function displayArticle(product, el) {

  let priceArticles = el.quantity * product.price;
  document.querySelector("#cart__items").innerHTML +=

    `<article class="cart__item" data-id="${el.id}" data-color="${el.color}">
                <div class="cart__item__img">
                    <img src="${product.imageUrl}" alt="${product.altTxt}">
                </div>
                <div class="cart__item__content">
                    <div class="cart__item__content__description">
                      <h2>${product.name}</h2>
                      <p>${el.color}</p>
                      <p>${formatPrice(priceArticles)}</p>
                    </div>
                    <div class="cart__item__content__settings">
                      <div class="cart__item__content__settings__quantity">
                        <p>Qté : </p>
                        <input type="number" class="totalQuantity" name="totalQuantity" min="1" max="100" value="${el.quantity}">
                      </div>
                      <div class="cart__item__content__settings__delete">
                        <p class="deleteItem">Supprimer</p>
                      </div>
                    </div>
                  </div>
          </article> `

}



// Fonction permettant d'afficher la quantité total des produits situé dans le panier //
function displayTotalQuantity() {

  let totalQuantity = document.querySelector("#totalQuantity");
  let total = 0;
  for (let i = 0; i < cart.length; i++) {
    total += Number(cart[i].quantity)
    totalQuantity.innerHTML = total;
  }
};


// Fonction permettant de mettre à jour la quantité du produit dans le LS //
function updateQuantity() {

  let inputQuantity = document.querySelectorAll(".totalQuantity");
  inputQuantity.forEach(input => {
    input.addEventListener("input", (e) => {
      let data = e.target.closest(".cart__item")
      let id = data.dataset.id;
      let color = data.dataset.color;
      let qty = e.target.value;
      if (qty < 1 || qty > 100) {
        alert("Veuillez sélectionner une quantité entre 1 et 100")
        return;
      }
      let cart = JSON.parse(localStorage.getItem("cart"));
      findProduct = cart.find(p => p.id == id && p.color == color);
      findProduct.quantity = qty;
      localStorage.setItem("cart", JSON.stringify(cart));
      location.reload()

    })

  })

};




// Fonction permettant d'afficher le prix total des produits du panier //
function displayTotalPrice(cart, products) {

    let totalPrice = document.querySelector("#totalPrice");
    let total = 0;
    cart.forEach(item => {
      const product = (products.find(p => p._id === item.id));
      const price = product.price;
      total += price * Number(item.quantity);
      totalPrice.innerHTML = formatPrice(total);

    });

};






// Fonction qui écoute le form et le valide ou pas en fonction de ce que renseigne l'utilisateur 
function listenFormInputs() {
  
  let form = document.querySelector(".cart__order__form")
  form.addEventListener("input", (e)=>{

    const firstName = document.getElementById("firstName").value
    const lastName = document.getElementById("lastName").value
    const address = document.getElementById("address").value
    const city = document.getElementById("city").value
    const email = document.getElementById("email").value
    
    let firstNameRegExp = new RegExp('^[a-zA-Zéèàçù -]{2,}$', 'g');
    let lastNameRegExp = new RegExp('^[a-zA-Zéèàçù -]{2,}$', 'g');
    let emailRegExp = new RegExp('^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$', 'g');
    let addressRegExp = new RegExp('^[a-zA-Z0-9éèàçù,. +-]+$', 'g');
    let cityRegExp = new RegExp('^[a-zA-Z0-9éèàçù,. -]+$', 'g');
    let testFirstName = firstNameRegExp.test(firstName.trim(" "))
    let testLastName = lastNameRegExp.test(lastName.trim(" "))
    let testAddress = addressRegExp.test(address.trim(" "))
    let testCity = cityRegExp.test(city.trim(" "))
    let testEmail = emailRegExp.test(email.trim(" "))


      if (!testFirstName) {
            document.getElementById("firstNameErrorMsg").innerHTML = "Format non valide"
      } else {
            firstNameErrorMsg.innerHTML = ""
      }

      if (!testLastName) {
            document.getElementById("lastNameErrorMsg").innerHTML = "Format non valide"
      } else {
            lastNameErrorMsg.innerHTML = ""
      }
      if (!testAddress) {
            document.getElementById("addressErrorMsg").innerHTML = "Format non valide"
      } else {
            addressErrorMsg.innerHTML = ""
      }

      if (!testCity) {
            document.getElementById("cityErrorMsg").innerHTML = "Format non valide"
      } else {
            cityErrorMsg.innerHTML = ""
      }

      if (!testEmail) {
            document.getElementById("emailErrorMsg").innerHTML = "Format non valide"
      } else {
            emailErrorMsg.innerHTML = ""
      }

      if(!testFirstName || !testLastName || !testAddress || !testCity || !testEmail){
            disableForm()
          }else {
            enableForm()
            submitForm()
      }

  })

}


// Fonction qui désactive le bouton "commander" //
function disableForm(){
    document.getElementById("order").disabled = true;
    document.getElementById("order").style.cursor = "not-allowed"
    document.getElementById("order").style.opacity = 0.3
}


// Fonction qui active le bouton "commander" //
function enableForm(){
    document.getElementById("order").disabled = false;
    document.getElementById("order").style.cursor = "pointer"
    document.getElementById("order").style.opacity = 1
}

// Fonction qui envoi le form, retourne un orderId, et efface tout le contenu du LS //
function submitForm() {
  
  let form = document.querySelector(".cart__order__form")
  form.addEventListener("submit", (e) => {
    e.preventDefault()
      const firstNameValue = firstName.value;
      const lastNameValue = lastName.value;
      const addressValue = address.value;
      const cityValue = city.value;
      const emailValue = email.value;
      const products = [];
      for (let i = 0; i < cart.length; i++) {
        products.push(cart[i].id)
      }
      const body = {
        contact: {
          firstName: firstNameValue,
          lastName: lastNameValue,
          address: addressValue,
          city: cityValue,
          email: emailValue,
        },
        
        products: products,
      }
      
    fetch("http://localhost:3000/api/products/order", {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then((res) => res.json())
      .then((data) => {
        const orderId = data.orderId
        window.location.href = 'confirmation.html' + '?orderId=' + orderId;
        localStorage.clear()
        console.log(data)
    })

  })

}


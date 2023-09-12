
// const productContainer = document.querySelector(".shopItemsData");
// productContainer.classList.add("shopItemsData");
// const shoppingCartAction = document.querySelector(".cart-action-container");

// function generateshopItemsData() {
//   shopItemsData.forEach((productData) => {
//     const productDiv = document.createElement("div");
//     productDiv.className = "display-shopItemsData";

//     // Create an image element
//     const productImage = document.createElement("img");
//     productImage.className = "product-image";
//     productImage.src = productData.img;
//     productImage.alt = `Image of ${productData.name}`;
//     productImage.height = 200;
//     // productImage.width = 150
//     productImage.className = "product-image";

//     // Create product name and price elements
//     const productName = document.createElement("h3");
//     productName.textContent = productData.name;

//     const productPrice = document.createElement("p");
//     productPrice.textContent = `Price: ${productData.price}`;

//     // Create "Add to Cart" button
//     const addToCartButton = document.createElement("button");
//     addToCartButton.className = "add-to-cart-button";
//     addToCartButton.textContent = "Add to Cart";

//     // Add event listener to the "Add to Cart" button
//     addToCartButton.addEventListener("click", () => {
//       // You can add your cart logic here
//       alert(`Added ${productData.name} to cart!`);
//     });

//     // Append elements to the product div
//     productDiv.appendChild(productImage);
//     productDiv.appendChild(productName);
//     productDiv.appendChild(productPrice);
//     productDiv.appendChild(addToCartButton);

//     // Append the product div to the container
//     productContainer.appendChild(productDiv);
//   });
// }

// function generateCartActionCards() {
//   shopItemsData.forEach((product) => {
//     const cartActionDiv = document.createElement("div");
//     cartActionDiv.className = "cart-action-div";

//     const title = document.createElement("h4");
//     title.textContent = product.name;
//     const price = document.createElement("p");
//     price.textContent = `Price: ${product.price}`;
//     const qty = document.createElement("p");
//     qty.textContent = `Quantity: 4`;
//     const total = document.createElement("p");
//     total.textContent = `Total: $4`;
//     //   action button container
//     const buttonDiv = document.createElement("div");
//     buttonDiv.className = "buttons-div";
//     const minus = document.createElement("button");
//     minus.textContent = "-";
//     minus.className = "action-buttons";
//     const plus = document.createElement("button");
//     plus.textContent = "+";
//     plus.className = "action-buttons";
//     const remove = document.createElement("button");
//     remove.textContent = "REMOVE";
//     remove.className = "action-buttons";
//     buttonDiv.appendChild(minus);
//     buttonDiv.appendChild(plus);
//     buttonDiv.appendChild(remove);

//     cartActionDiv.appendChild(title);
//     cartActionDiv.appendChild(price);
//     cartActionDiv.appendChild(qty);
//     cartActionDiv.appendChild(total);
//     cartActionDiv.appendChild(buttonDiv);

//     shoppingCartAction.appendChild(cartActionDiv);
//   });
// }

// generateshopItemsData();
// generateCartActionCards();
let currencySymbol = "$";


// Draws product list
function drawshopItemsData() {
  let productList = document.querySelector(".shopItemsData");
  let productItems = '';
  shopItemsData.forEach((element) => {
    productItems += `
            <div data-productId='${element.productId}'>
                <img src='${element.image}'>
                <h3>${element.name}</h3>
                <p>price: ${currencySymbol}${element.price}</p>
                <button class="add-to-cart">Add to Cart</button>
            </div>
        `;
  });
  // use innerHTML so that shopItemsData only drawn once
  productList.innerHTML = productItems;
}

//Draws cart
function drawCart() {
  let cartList = document.querySelector(".cart");
  // clear cart before drawing
  let cartItems = "";
  cart.forEach((element) => {
    let itemTotal = element.price * element.quantity;

    cartItems += `
            <div data-productId='${element.productId}'>
                <h3>${element.name}</h3>
                <p>price: ${currencySymbol}${element.price}</p>
                <p>quantity: ${element.quantity}</p>
                <p>total: ${currencySymbol}${itemTotal}</p>
                <button class="qup">+</button>
                <button class="qdown">-</button>
                <button class="remove">remove</button>
            </div>
        `;
  });
  // use innerHTML so that cart shopItemsData only drawn once
  cart.length 
    ? (cartList.innerHTML = cartItems) 
    : (cartList.innerHTML = "Cart Empty");
}

//Draws checkout
function drawCheckout() {
  let checkout = document.querySelector(".cart-total");
  checkout.innerHTML = "";

  // run cartTotal() from script.js
  let cartSum = cartTotal();

  let div = document.createElement("div");
  div.innerHTML = `<p>Cart Total: ${currencySymbol}${cartSum}`;
  checkout.append(div);
}

//Initialize store with shopItemsData, cart, and checkout
drawshopItemsData();
drawCart();
drawCheckout();

document.querySelector(".shopItemsData").addEventListener("click", (e) => {
  let productId = e.target.parentNode.getAttribute("data-productId");
  productId *= 1;
  addProductToCart(productId);
  drawCart();
  drawCheckout();
});

// Event delegation used to support dynamically added cart items
document.querySelector(".cart").addEventListener("click", (e) => {
  // Helper nested higher order function to use below
  // Must be nested to have access to the event target
  // Takes in a cart function as an agrument
  function runCartFunction(fn) {
    let productId = e.target.parentNode.getAttribute("data-productId");
    productId *= 1;
    for (let i = cart.length - 1; i > -1; i--) {
      if (cart[i].productId === productId) {
        let productId = cart[i].productId;
        fn(productId);
      }
    }
    // force cart and checkout redraw after cart function completes
    drawCart();
    drawCheckout();
  }

  // check the target's class and run function based on class
  if (e.target.classList.contains("remove")) {
    // run removeProductFromCart() from script.js
    runCartFunction(removeProductFromCart);
  } else if (e.target.classList.contains("qup")) {
    // run increaseQuantity() from script.js
    runCartFunction(increaseQuantity);
  } else if (e.target.classList.contains("qdown")) {
    // run decreaseQuantity() from script.js
    runCartFunction(decreaseQuantity);
  }
});

document.querySelector(".pay").addEventListener("click", (e) => {
  e.preventDefault();

  // Get input cash received field value, set to number
  let amount = document.querySelector(".received").value;
  amount *= 1;

  // Set cashReturn to return value of pay()
  let cashReturn = pay(amount);

  let paymentSummary = document.querySelector(".pay-summary");
  let div = document.createElement("div");

  // If total cash received is greater than cart total thank customer
  // Else request additional funds
  if (cashReturn >= 0) {
    div.innerHTML = `
            <p>Cash Received: ${currencySymbol}${amount}</p>
            <p>Cash Returned: ${currencySymbol}${cashReturn}</p>
            <p>Thank you!</p>
        `;
  } else {
    // reset cash field for next entry
    document.querySelector(".received").value = "";
    div.innerHTML = `
            <p>Cash Received: ${currencySymbol}${amount}</p>
            <p>Remaining Balance: ${cashReturn}$</p>
            <p>Please pay additional amount.</p>
            <hr/>
        `;
  }

  paymentSummary.append(div);
});

/* End all items from cart */
const currencySelector = document.getElementById("currency-selector");
currencySelector.addEventListener("change", () => {
  const selectedCurrency = currencySelector.value;
  updatePrices(selectedCurrency);
});

/* Begin currency converter */
function currencyBuilder(){
    let currencyPicker = document.querySelector('.currency-selector');
    let select = document.createElement("select");
    select.classList.add("currency-select");
    select.innerHTML = `<option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="YEN">YEN</option>`;
    currencyPicker.append(select);
}
currencyBuilder();
// function formatPrice(price, currency) {
//   if (currency === "USD") {
//     return `$${price.toFixed(2)}`;
//   } else if (currency === "EUR") {
//     return `€${price.toFixed(2)}`;
//   } else if (currency === "YEN") {
//     return `¥${price.toFixed(0)}`;
//   }
// }
document.querySelector('.currency-select').addEventListener('change', function handleChange(event) {
    switch(event.target.value){
        case 'EUR':
            currencySymbol = '€';
            break;
        case 'YEN':
            currencySymbol = '¥';
            break;
        default:
            currencySymbol = '$';
            break;
     }

    currency(event.target.value);
    drawshopItemsData();
    drawCart();
    drawCheckout();
});
/* End currency converter */
/* Standout suggestions */
/* Begin remove all items from cart */
function dropCart(){
    let shoppingCart = document.querySelector('.empty-btn');
    let div = document.createElement("button");
    div.classList.add("empty");
    div.innerHTML =`Empty Cart`;
    shoppingCart.append(div);
}
dropCart();
document.querySelector('.empty-btn').addEventListener('click', (e) => {
    if (e.target.classList.contains('empty')){
        emptyCart();
        drawCart();
        drawCheckout();
    }
})
/* End standout suggestions */

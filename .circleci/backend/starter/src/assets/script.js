/* Create an array named products which you will use to add all of your product object literals that you create in the next step. */
const shopItemsData = [
  {
    name: "cherry",
    price: 45,
    quantity: 0,
    productId: 101,
    image: "images/cherry.jpg"
  },
  {
    name: "Orange",
    price: 25,
    quantity: 0,
    productId: 102,
    image: "images/orange.jpg"
  },
  {
    name: "Strawberry",
    price: 5,
    quantity: 0,
    productId: 103,
    image: "images/strawberry.jpg"
  },
  {
    name: "GDG_Shirt",
    price: 10,
    quantity: 0,
    productId: 104,
    image: "images/gdg.jpeg"
  },
];
/* Create 3 or more product objects using object literal notation 
   Each product should include five properties
   - name: name of product (string)
   - price: price of product (number)
   - quantity: quantity in cart should start at zero (number)
   - productId: unique id for the product (number)
   - image: picture of product (url string)
*/

/* Images provided in /images folder. All images from Unsplash.com
   - cherry.jpg by Mae Mu
   - orange.jpg by Mae Mu
   - strawberry.jpg by Allec Gomes
*/

/* Declare an empty array named cart to hold the items in the cart */
let cart = [];
/* Create a function named addProductToCart that takes in the product productId as an argument
  - addProductToCart should get the correct product based on the productId
  - addProductToCart should then increase the product's quantity
  - if the product is not already in the cart, add it to the cart
*/
function productID(id, list) {
  return list.find(function(product) {
    return product.productId === id;
  })
}

function addProductToCart(productId) {
  let productToAdd = shopItemsData.find((product) => product.productId === productId);
  if (productToAdd) {
    let existingCartItem = cart.find((item) => item.productId === productId);
    if (existingCartItem) {
      existingCartItem.quantity++;
    } else {
      cart.push({
        productId: productToAdd.productId,
        name: productToAdd.name,
        price: productToAdd.price,
        quantity: 1,
      });
    }
    alert(`Added ${productToAdd.name} to the cart!`);
  }
}

/* Create a function named increaseQuantity that takes in the productId as an argument
  - increaseQuantity should get the correct product based on the productId
  - increaseQuantity should then increase the product's quantity
*/
function increaseQuantity(productId) {
  let productToIncrease = cart.find((item) => item.productId === productId);
  if (productToIncrease) {
    productToIncrease.quantity++;
  }
}

/* Create a function named decreaseQuantity that takes in the productId as an argument
  - decreaseQuantity should get the correct product based on the productId
  - decreaseQuantity should decrease the quantity of the product
  - if the function decreases the quantity to 0, the product is removed from the cart
*/
function decreaseQuantity(productId) {
  let productToDecrease = cart.find((item) => item.productId === productId);
  if (productToDecrease) {
    productToDecrease.quantity--;
    if (productToDecrease.quantity === 0) {
      let productIndex = cart.findIndex((item) => item.productId === productId);
      if (productIndex !== -1) {
        cart.splice(productIndex, 1);
      }
    }
  }
}

/* Create a function named removeProductFromCart that takes in the productId as an argument
  - removeProductFromCart should get the correct product based on the productId
  - removeProductFromCart should update the product quantity to 0
  - removeProductFromCart should remove the product from the cart
*/
function removeProductFromCart(productId) {
  // Find the product in the cart based on the productId
  let productToRemove = cart.find((item) => item.productId === productId);

  if (productToRemove) {
    productToRemove.quantity = 0;
    let productIndex = cart.findIndex((item) => item.productId === productId);
    if (productIndex !== -1) {
      cart.splice(productIndex, 1);
    }
  }
}

/* Create a function named cartTotal that has no parameters
  - cartTotal should iterate through the cart to get the total of all products
  - cartTotal should return the sum of the products in the cart
*/
let totalAmnt = 0;
function cartTotal() {
  let total = 0;
 cart.forEach(function(item) {
   total += item.price * item.quantity;
 })
 return total
}

/* Create a function called emptyCart that empties the products from the cart */
// Create a function called emptyCart that empties the products from the cart
function emptyCart() {
  cart.forEach(function(product) {
    removeProductFromCart(product.id);
  })
}

// Create a function named pay that takes in an amount as an argument
/* Create a function named pay that takes in an amount as an argument
  - pay will return a negative number if there is a remaining balance
  - pay will return a positive number if money should be returned to customer
*/
function pay(amount) {
  totalAmnt += amount
  let change = totalAmnt - cartTotal();
  if (change >= 0) {
    totalAmnt = 0;
    emptyCart();
  }
  return change;
}

/* Place stand out suggestions here (stand out suggestions can be found at the bottom of the project rubric.)*/
/* The following is for running unit tests. 
   To fully complete this project, it is expected that all tests pass.
   Run the following command in terminal to run tests
   npm run test
*/
function updatePrices(currency) {
  let productPrices = document.querySelectorAll(".product-price");
  productPrices.forEach((priceElement) => {
    let productPrice = parseFloat(priceElement.dataset.price);
    priceElement.textContent = formatPrice(productPrice, currency);
  });
}

module.exports = {
  shopItemsData,
  cart,
  addProductToCart,
  increaseQuantity,
  decreaseQuantity,
  removeProductFromCart,
  cartTotal,
  pay,
  emptyCart,
  currency
};

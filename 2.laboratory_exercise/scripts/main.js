let getCart = function () {
    let cart = localStorage.getItem("cart");

    if (cart === null) {
        return {};
    } else {
        return JSON.parse(cart);
    }
};

let setCart = function (cart) {
   
    for (let id in cart) {
        if (cart[id] === 0) {
            delete cart[id];
        }
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartText();
};

let updateCartText = function () {
    let cartItemsElement = document.querySelector("#cart-items");
    let cart = getCart();

    let number = 0;
    for (let id in cart) {
        number += cart[id];
    }
    
    cartItemsElement.textContent = number;
};

let cartUpdate = function (event) {
    let id = event.target.dataset.productId

    cart = getCart();
    if (!(id in cart)) {
        cart[id] = 0;
    }

    cart[id]++;

    setCart(cart);
};


updateCartText();
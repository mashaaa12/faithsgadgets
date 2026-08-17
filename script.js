// =========================================
// FAITH'S GADGETS CART
// =========================================


// =========================================
// LOAD CART
// =========================================

let cart = JSON.parse(localStorage.getItem("cart")) || [];


// =========================================
// ADD TO CART
// =========================================

const addButtons = document.querySelectorAll(".add-to-cart");

addButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const product =
            button.closest(".product-card");

        if (!product) {
            return;
        }


        const nameElement =
            product.querySelector("h3");

        const priceElement =
            product.querySelector("strong");

        const imageElement =
            product.querySelector("img");


        if (!nameElement) {
            return;
        }


        const name =
            nameElement.textContent.trim();


        // =====================================
        // GET PRICE
        // =====================================

        let price = 0;

        if (priceElement) {

            const priceText =
                priceElement.textContent
                    .replace("₦", "")
                    .replace(/,/g, "")
                    .trim();


            const convertedPrice =
                Number(priceText);


            if (!isNaN(convertedPrice)) {

                price =
                    convertedPrice;

            }

        }


        // =====================================
        // GET IMAGE
        // =====================================

        const image =
            imageElement
                ? imageElement.src
                : "";


        // =====================================
        // CHECK EXISTING PRODUCT
        // =====================================

        const existingProduct =
            cart.find(function (item) {

                return item.name === name;

            });


        if (existingProduct) {

            existingProduct.quantity++;

        }

        else {

            cart.push({

                name: name,

                price: price,

                image: image,

                quantity: 1

            });

        }


        // =====================================
        // SAVE CART
        // =====================================

        saveCart();


        // =====================================
        // UPDATE CART
        // =====================================

        updateCartCount();

        displayCart();


        // =====================================
        // CONFIRMATION
        // =====================================

        alert(
            name + " added to cart!"
        );

    });

});


// =========================================
// UPDATE CART NUMBER
// =========================================

function updateCartCount() {

    const cartCount =
        document.getElementById(
            "cart-count"
        );


    if (!cartCount) {
        return;
    }


    let total = 0;


    cart.forEach(function (item) {

        total +=
            Number(item.quantity) || 0;

    });


    cartCount.textContent =
        total;

}


// =========================================
// DISPLAY CART
// =========================================

function displayCart() {

    const cartItems =
        document.getElementById(
            "cart-items"
        );


    if (!cartItems) {
        return;
    }


    // =====================================
    // EMPTY CART
    // =====================================

    if (cart.length === 0) {

        cartItems.innerHTML = `
            
            <div class="empty-cart">

                <h2>
                    Your cart is empty
                </h2>

                <p>
                    Add some products to your cart.
                </p>

            </div>

        `;


        updateCartTotal();

        return;

    }


    // =====================================
    // CLEAR CART
    // =====================================

    cartItems.innerHTML = "";


    // =====================================
    // DISPLAY PRODUCTS
    // =====================================

    cart.forEach(function (item, index) {

        const cartItem =
            document.createElement("div");


        cartItem.className =
            "cart-item";


        // =================================
        // IMAGE
        // =================================

        const image =
            document.createElement("img");


        image.src =
            item.image || "";


        image.alt =
            item.name || "Product";


        // =================================
        // PRODUCT INFO
        // =================================

        const info =
            document.createElement("div");


        info.className =
            "cart-item-info";


        const name =
            document.createElement("h3");


        name.textContent =
            item.name || "Product";


        const price =
            document.createElement("p");


        const numericPrice =
            Number(item.price) || 0;


        if (numericPrice > 0) {

            price.textContent =
                "₦" +
                numericPrice.toLocaleString();

        }

        else {

            price.textContent =
                "Price not set";

        }


        info.appendChild(name);

        info.appendChild(price);


        // =================================
        // QUANTITY CONTROLS
        // =================================

        const quantityControls =
            document.createElement("div");


        quantityControls.className =
            "quantity-controls";


        const minus =
            document.createElement("button");


        minus.type =
            "button";


        minus.textContent =
            "−";


        const quantity =
            document.createElement("span");


        quantity.textContent =
            Number(item.quantity) || 1;


        const plus =
            document.createElement("button");


        plus.type =
            "button";


        plus.textContent =
            "+";


        // =================================
        // MINUS BUTTON
        // =================================

        minus.addEventListener(
            "click",
            function () {

                changeQuantity(
                    index,
                    -1
                );

            }
        );


        // =================================
        // PLUS BUTTON
        // =================================

        plus.addEventListener(
            "click",
            function () {

                changeQuantity(
                    index,
                    1
                );

            }
        );


        quantityControls.appendChild(
            minus
        );


        quantityControls.appendChild(
            quantity
        );


        quantityControls.appendChild(
            plus
        );


        // =================================
        // PRODUCT TOTAL
        // =================================

        const itemTotal =
            document.createElement("div");


        itemTotal.className =
            "cart-item-price";


        const totalPrice =
            numericPrice *
            (Number(item.quantity) || 1);


        if (numericPrice > 0) {

            itemTotal.textContent =
                "₦" +
                totalPrice.toLocaleString();

        }

        else {

            itemTotal.textContent =
                "Price not set";

        }


        // =================================
        // REMOVE BUTTON
        // =================================

        const removeButton =
            document.createElement("button");


        removeButton.type =
            "button";


        removeButton.className =
            "remove-item";


        removeButton.textContent =
            "🗑";


        removeButton.addEventListener(
            "click",
            function () {

                removeItem(index);

            }
        );


        // =================================
        // PUT EVERYTHING TOGETHER
        // =================================

        cartItem.appendChild(
            image
        );


        cartItem.appendChild(
            info
        );


        cartItem.appendChild(
            quantityControls
        );


        cartItem.appendChild(
            itemTotal
        );


        cartItem.appendChild(
            removeButton
        );


        cartItems.appendChild(
            cartItem
        );

    });


    // =====================================
    // UPDATE TOTAL
    // =====================================

    updateCartTotal();

}


// =========================================
// CHANGE QUANTITY
// =========================================

function changeQuantity(index, amount) {

    if (!cart[index]) {
        return;
    }


    const currentQuantity =
        Number(cart[index].quantity) || 1;


    cart[index].quantity =
        currentQuantity + amount;


    // =====================================
    // REMOVE WHEN QUANTITY REACHES ZERO
    // =====================================

    if (cart[index].quantity <= 0) {

        cart.splice(
            index,
            1
        );

    }


    // =====================================
    // SAVE
    // =====================================

    saveCart();


    // =====================================
    // REFRESH
    // =====================================

    displayCart();

    updateCartCount();

}


// =========================================
// REMOVE ITEM
// =========================================

function removeItem(index) {

    if (!cart[index]) {
        return;
    }


    cart.splice(
        index,
        1
    );


    // =====================================
    // SAVE
    // =====================================

    saveCart();


    // =====================================
    // REFRESH
    // =====================================

    displayCart();

    updateCartCount();

}


// =========================================
// SAVE CART
// =========================================

function saveCart() {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

}


// =========================================
// UPDATE CART TOTAL
// =========================================

function updateCartTotal() {

    let total = 0;


    cart.forEach(function (item) {

        const price =
            Number(item.price) || 0;


        const quantity =
            Number(item.quantity) || 1;


        total +=
            price * quantity;

    });


    // =====================================
    // SUBTOTAL
    // =====================================

    const subtotal =
        document.getElementById(
            "cart-subtotal"
        );


    if (subtotal) {

        subtotal.textContent =
            "₦" +
            total.toLocaleString();

    }


    // =====================================
    // CART TOTAL
    // =====================================

    const cartTotal =
        document.getElementById(
            "cart-total"
        );


    if (cartTotal) {

        cartTotal.textContent =
            "₦" +
            total.toLocaleString();

    }

}


// =========================================
// RUN CART
// =========================================

updateCartCount();

displayCart();
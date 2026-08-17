```javascript
// ==========================================
// FAITH'S GADGETS CHECKOUT
// ==========================================

// SUPABASE
const SUPABASE_URL = "https://xlndevzrexpshpkruwho.supabase.co/rest/v1/";
const SUPABASE_KEY = "sb_publishable_K3goJriHOTqkoFXEb839Zw_3ozu3V6F";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// ==========================================
// CART
// ==========================================

const cart =
    JSON.parse(localStorage.getItem("cart")) || [];


// ==========================================
// ELEMENTS
// ==========================================

const checkoutItems =
    document.getElementById("checkout-items");

const subtotalElement =
    document.getElementById("checkout-subtotal");

const deliveryElement =
    document.getElementById("checkout-delivery");

const totalElement =
    document.getElementById("checkout-total");

const placeOrderButton =
    document.getElementById("place-order");


// ==========================================
// DELIVERY FEE
// ==========================================

const DELIVERY_FEE = 0;


// ==========================================
// DISPLAY CART
// ==========================================

function displayCart() {

    if (!checkoutItems) {
        return;
    }


    if (cart.length === 0) {

        checkoutItems.innerHTML =
            "<p>Your cart is empty.</p>";

        subtotalElement.textContent =
            "₦0";

        deliveryElement.textContent =
            "₦0";

        totalElement.textContent =
            "₦0";

        return;
    }


    checkoutItems.innerHTML = "";

    let subtotal = 0;


    cart.forEach(function(item) {

        const name =
            item.name || "Product";

        const price =
            Number(item.price) || 0;

        const quantity =
            Number(item.quantity) || 1;

        const itemTotal =
            price * quantity;


        subtotal =
            subtotal + itemTotal;


        const itemDiv =
            document.createElement("div");

        itemDiv.className =
            "checkout-item";


        const nameElement =
            document.createElement("span");

        nameElement.textContent =
            name + " x " + quantity;


        const priceElement =
            document.createElement("strong");

        priceElement.textContent =
            "₦" + itemTotal.toLocaleString();


        itemDiv.appendChild(nameElement);

        itemDiv.appendChild(priceElement);

        checkoutItems.appendChild(itemDiv);

    });


    const total =
        subtotal + DELIVERY_FEE;


    subtotalElement.textContent =
        "₦" + subtotal.toLocaleString();


    deliveryElement.textContent =
        "₦" + DELIVERY_FEE.toLocaleString();


    totalElement.textContent =
        "₦" + total.toLocaleString();

}


// ==========================================
// CREATE ORDER NUMBER
// ==========================================

function createOrderNumber() {

    const now =
        new Date();

    const randomNumber =
        Math.floor(
            1000 + Math.random() * 9000
        );


    return (
        "FG-" +
        now.getTime() +
        "-" +
        randomNumber
    );

}


// ==========================================
// PLACE ORDER
// ==========================================

if (placeOrderButton) {

    placeOrderButton.addEventListener(
        "click",
        async function() {


            // ================================
            // CHECK CART
            // ================================

            if (cart.length === 0) {

                alert(
                    "Your cart is empty."
                );

                return;
            }


            // ================================
            // CUSTOMER INFORMATION
            // ================================

            const customerName =
                document
                    .getElementById("customer-name")
                    .value
                    .trim();


            const customerPhone =
                document
                    .getElementById("customer-phone")
                    .value
                    .trim();


            const customerEmail =
                document
                    .getElementById("customer-email")
                    .value
                    .trim();


            // ================================
            // DELIVERY INFORMATION
            // ================================

            const state =
                document
                    .getElementById("state")
                    .value
                    .trim();


            const localGovernment =
                document
                    .getElementById("local-government")
                    .value
                    .trim();


            const address =
                document
                    .getElementById("customer-address")
                    .value
                    .trim();


            // ================================
            // VALIDATION
            // ================================

            if (customerName === "") {

                alert(
                    "Please enter your full name."
                );

                return;
            }


            if (customerPhone === "") {

                alert(
                    "Please enter your phone number."
                );

                return;
            }


            if (customerEmail === "") {

                alert(
                    "Please enter your email address."
                );

                return;
            }


            if (state === "") {

                alert(
                    "Please select your state."
                );

                return;
            }


            if (localGovernment === "") {

                alert(
                    "Please select your Local Government Area."
                );

                return;
            }


            if (address === "") {

                alert(
                    "Please enter your delivery address."
                );

                return;
            }


            // ================================
            // PAYMENT METHOD
            // ================================

            const selectedPayment =
                document.querySelector(
                    'input[name="payment-method"]:checked'
                );


            let paymentMethod =
                "Card";


            if (selectedPayment) {

                paymentMethod =
                    selectedPayment.value;

            }


            // ================================
            // CALCULATE TOTAL
            // ================================

            let subtotal = 0;


            cart.forEach(function(item) {

                const price =
                    Number(item.price) || 0;

                const quantity =
                    Number(item.quantity) || 1;


                subtotal =
                    subtotal +
                    (price * quantity);

            });


            const total =
                subtotal + DELIVERY_FEE;


            // ================================
            // ORDER NUMBER
            // ================================

            const orderNumber =
                createOrderNumber();


            // ================================
            // DELIVERY LOCATION
            // ================================

            const deliveryLocation =
                state +
                ", " +
                localGovernment;


            // ================================
            // DISABLE BUTTON
            // ================================

            placeOrderButton.disabled =
                true;


            placeOrderButton.textContent =
                "Saving Order...";


            // ================================
            // ORDER DATA
            // ================================

            const orderData = {

                order_number:
                    orderNumber,

                customer_name:
                    customerName,

                customer_phone:
                    customerPhone,

                customer_email:
                    customerEmail,

                customer_address:
                    address,

                delivery_location:
                    deliveryLocation,

                delivery_fee:
                    DELIVERY_FEE,

                subtotal:
                    subtotal,

                total:
                    total,

                payment_method:
                    paymentMethod,

                payment_status:
                    "Paid",

                order_status:
                    "Pending",

                items:
                    cart,

                state:
                    state,

                local_government:
                    localGovernment,

                address:
                    address

            };


            // ================================
            // SAVE TO SUPABASE
            // ================================

            console.log(
                "Sending order:",
                orderData
            );


            const result =
                await supabaseClient
                    .from("orders")
                    .insert([orderData]);


            // ================================
            // CHECK ERROR
            // ================================

            if (result.error) {

                console.error(
                    "SUPABASE ERROR:",
                    result.error
                );


                alert(
                    "Order could not be saved.\n\n" +
                    result.error.message
                );


                placeOrderButton.disabled =
                    false;


                placeOrderButton.textContent =
                    "Pay Now";


                return;
            }


            // ================================
            // SUCCESS
            // ================================

            alert(
                "Payment successful!\n\n" +
                "Order " +
                orderNumber +
                " has been recorded successfully."
            );


            // Clear cart

            localStorage.removeItem(
                "cart"
            );


            // Redirect

            window.location.href =
                "index.html";

        }
    );

}


// ==========================================
// START
// ==========================================

displayCart();
```

/* =========================================
   ELAN CLOTHES
   COMPLETE E-COMMERCE JAVASCRIPT
========================================= */


// =========================================
// PRODUCT DATABASE
// =========================================

const products = [

    {
        id: 1,
        name: "Essential Linen Shirt",
        category: "shirts",
        price: 2499,
        badge: "NEW",
        image:
        "https://images.unsplash.com/photo-1603252110481-7ba873bf42ab?auto=format&fit=crop&w=800&q=85"
    },

    {
        id: 2,
        name: "Structured Overshirt",
        category: "jackets",
        price: 3999,
        badge: "BESTSELLER",
        image:
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=85"
    },

    {
        id: 3,
        name: "Minimal Silk Dress",
        category: "dresses",
        price: 4599,
        badge: "NEW",
        image:
        "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=800&q=85"
    },

    {
        id: 4,
        name: "Relaxed Tailored Pants",
        category: "pants",
        price: 3299,
        badge: "",
        image:
        "https://images.unsplash.com/photo-1506629905607-d9e7a8b3a3f7?auto=format&fit=crop&w=800&q=85"
    },

    {
        id: 5,
        name: "Premium Cotton Shirt",
        category: "shirts",
        price: 2799,
        badge: "POPULAR",
        image:
        "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=85"
    },

    {
        id: 6,
        name: "Modern Utility Jacket",
        category: "jackets",
        price: 4999,
        badge: "",
        image:
        "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?auto=format&fit=crop&w=800&q=85"
    },

    {
        id: 7,
        name: "Flow Midi Dress",
        category: "dresses",
        price: 4299,
        badge: "NEW",
        image:
        "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=85"
    },

    {
        id: 8,
        name: "Wide Leg Trousers",
        category: "pants",
        price: 3499,
        badge: "",
        image:
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=85"
    }

];


// =========================================
// CART
// =========================================

let cart = JSON.parse(
    localStorage.getItem("elanCart")
) || [];


// =========================================
// ELEMENTS
// =========================================

const productsGrid =
    document.getElementById("productsGrid");

const bagDrawer =
    document.getElementById("bagDrawer");

const overlay =
    document.getElementById("overlay");

const bagItems =
    document.getElementById("bagItems");

const bagCount =
    document.getElementById("bagCount");

const subtotal =
    document.getElementById("subtotal");

const toast =
    document.getElementById("toast");


// =========================================
// FORMAT MONEY
// =========================================

function formatPrice(price) {

    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }
    ).format(price);

}


// =========================================
// DISPLAY PRODUCTS
// =========================================

function displayProducts(
    category = "all",
    search = ""
) {

    const filteredProducts =
        products.filter(product => {

            const categoryMatch =
                category === "all" ||
                product.category === category;

            const searchMatch =
                product.name
                .toLowerCase()
                .includes(search.toLowerCase());

            return categoryMatch && searchMatch;

        });


    if (!filteredProducts.length) {

        productsGrid.innerHTML = `
            <div style="
                grid-column:1/-1;
                text-align:center;
                padding:80px 20px;
            ">
                <h3>No products found.</h3>
                <p style="color:var(--muted);margin-top:10px;">
                    Try another search.
                </p>
            </div>
        `;

        return;

    }


    productsGrid.innerHTML =
        filteredProducts.map(product => `

        <article class="product-card">

            <div class="product-image">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                    loading="lazy"
                >

                ${
                    product.badge
                    ?
                    `<span class="product-badge">
                        ${product.badge}
                    </span>`
                    :
                    ""
                }

                <button
                    class="wishlist"
                    onclick="toggleWishlist(this)"
                    aria-label="Wishlist"
                >
                    <i class="fa-regular fa-heart"></i>
                </button>

                <button
                    class="quick-add"
                    onclick="addToCart(${product.id})"
                >
                    ADD TO BAG
                    <i class="fa-solid fa-plus"></i>
                </button>

            </div>

            <div class="product-info">

                <h3>
                    ${product.name}
                </h3>

                <p class="product-category">
                    ${product.category}
                </p>

                <p class="product-price">
                    ${formatPrice(product.price)}
                </p>

            </div>

        </article>

    `).join("");

}


// =========================================
// ADD TO CART
// =========================================

function addToCart(productId) {

    const product =
        products.find(
            item => item.id === productId
        );


    if (!product) return;


    const existing =
        cart.find(
            item => item.id === productId
        );


    if (existing) {

        existing.quantity++;

    } else {

        cart.push({
            ...product,
            quantity: 1
        });

    }


    saveCart();

    updateCart();

    showToast(
        `${product.name} added to your bag`
    );

}


// =========================================
// SAVE CART
// =========================================

function saveCart() {

    localStorage.setItem(
        "elanCart",
        JSON.stringify(cart)
    );

}


// =========================================
// UPDATE CART
// =========================================

function updateCart() {

    const totalItems =
        cart.reduce(
            (sum, item) =>
                sum + item.quantity,
            0
        );


    const totalPrice =
        cart.reduce(
            (sum, item) =>
                sum + item.price * item.quantity,
            0
        );


    bagCount.textContent =
        totalItems;


    subtotal.textContent =
        formatPrice(totalPrice);


    renderCart();

}


// =========================================
// RENDER CART
// =========================================

function renderCart() {

    if (!cart.length) {

        bagItems.innerHTML = `

            <div class="empty-bag">

                <i class="fa-solid fa-bag-shopping"></i>

                <h4>
                    Your bag is empty
                </h4>

                <p>
                    Discover something you love.
                </p>

                <button
                    id="startShopping"
                >
                    Start Shopping
                </button>

            </div>

        `;

        document
            .getElementById("startShopping")
            ?.addEventListener(
                "click",
                closeBag
            );

        return;
    }


    bagItems.innerHTML =
        cart.map(item => `

        <div class="bag-item">

            <img
                src="${item.image}"
                alt="${item.name}"
            >

            <div class="bag-item-info">

                <h4>
                    ${item.name}
                </h4>

                <p>
                    ${formatPrice(item.price)}
                </p>

                <div class="qty">

                    <button
                        onclick="changeQuantity(
                            ${item.id},
                            -1
                        )"
                    >
                        −
                    </button>

                    <span>
                        ${item.quantity}
                    </span>

                    <button
                        onclick="changeQuantity(
                            ${item.id},
                            1
                        )"
                    >
                        +
                    </button>

                </div>

            </div>

            <button
                class="remove-item"
                onclick="removeFromCart(${item.id})"
                aria-label="Remove item"
            >
                <i class="fa-solid fa-trash"></i>
            </button>

        </div>

    `).join("");

}


// =========================================
// CHANGE QUANTITY
// =========================================

function changeQuantity(
    productId,
    amount
) {

    const item =
        cart.find(
            product => product.id === productId
        );


    if (!item) return;


    item.quantity += amount;


    if (item.quantity <= 0) {

        cart =
            cart.filter(
                product =>
                    product.id !== productId
            );

    }


    saveCart();

    updateCart();

}


// =========================================
// REMOVE FROM CART
// =========================================

function removeFromCart(productId) {

    cart =
        cart.filter(
            item => item.id !== productId
        );


    saveCart();

    updateCart();

    showToast("Item removed");

}


// =========================================
// BAG OPEN
// =========================================

function openBag() {

    bagDrawer.classList.add("active");

    overlay.classList.add("active");

    document.body.style.overflow =
        "hidden";

}


// =========================================
// BAG CLOSE
// =========================================

function closeBag() {

    bagDrawer.classList.remove("active");

    overlay.classList.remove("active");

    document.body.style.overflow =
        "";

}


// =========================================
// BUTTONS
// =========================================

document
    .getElementById("bagBtn")
    .addEventListener(
        "click",
        openBag
    );


document
    .getElementById("closeBag")
    .addEventListener(
        "click",
        closeBag
    );


overlay.addEventListener(
    "click",
    closeBag
);


// =========================================
// MOBILE MENU
// =========================================

const menuBtn =
    document.getElementById("menuBtn");

const navbar =
    document.querySelector(".navbar");


menuBtn.addEventListener(
    "click",
    () => {

        navbar.classList.toggle("active");

        const icon =
            menuBtn.querySelector("i");

        if (
            navbar.classList.contains(
                "active"
            )
        ) {

            icon.className =
                "fa-solid fa-xmark";

        } else {

            icon.className =
                "fa-solid fa-bars";

        }

    }
);


// Close mobile menu
document
    .querySelectorAll(".navbar a")
    .forEach(link => {

        link.addEventListener(
            "click",
            () => {

                navbar.classList.remove(
                    "active"
                );

                menuBtn
                    .querySelector("i")
                    .className =
                    "fa-solid fa-bars";

            }
        );

    });


// =========================================
// FILTER
// =========================================

document
    .querySelectorAll(".filter")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(".filter")
                    .forEach(btn =>
                        btn.classList.remove(
                            "active"
                        )
                    );


                button.classList.add(
                    "active"
                );


                displayProducts(
                    button.dataset.category
                );

            }
        );

    });


// =========================================
// SEARCH
// =========================================

const searchBtn =
    document.getElementById("searchBtn");

const searchPanel =
    document.getElementById("searchPanel");

const searchInput =
    document.getElementById("searchInput");


searchBtn.addEventListener(
    "click",
    () => {

        searchPanel.classList.toggle(
            "active"
        );

        if (
            searchPanel.classList.contains(
                "active"
            )
        ) {

            searchInput.focus();

        }

    }
);


document
    .getElementById("closeSearch")
    .addEventListener(
        "click",
        () => {

            searchPanel.classList.remove(
                "active"
            );

            searchInput.value = "";

            displayProducts();

        }
    );


searchInput.addEventListener(
    "input",
    () => {

        displayProducts(
            "all",
            searchInput.value
        );

    }
);


// =========================================
// THEME
// =========================================

const themeBtn =
    document.getElementById("themeBtn");


themeBtn.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "dark"
        );


        const icon =
            themeBtn.querySelector("i");


        if (
            document.body.classList.contains(
                "dark"
            )
        ) {

            icon.className =
                "fa-solid fa-sun";

            localStorage.setItem(
                "elanTheme",
                "dark"
            );

        } else {

            icon.className =
                "fa-regular fa-moon";

            localStorage.setItem(
                "elanTheme",
                "light"
            );

        }

    }
);


// Restore theme
if (
    localStorage.getItem(
        "elanTheme"
    ) === "dark"
) {

    document.body.classList.add(
        "dark"
    );

    themeBtn
        .querySelector("i")
        .className =
        "fa-solid fa-sun";

}


// =========================================
// WISHLIST
// =========================================

function toggleWishlist(button) {

    button.classList.toggle(
        "active"
    );


    const icon =
        button.querySelector("i");


    if (
        button.classList.contains(
            "active"
        )
    ) {

        icon.className =
            "fa-solid fa-heart";

        showToast(
            "Added to wishlist"
        );

    } else {

        icon.className =
            "fa-regular fa-heart";

    }

}


// =========================================
// TOAST
// =========================================

let toastTimer;


function showToast(message) {

    toast.querySelector(
        "span"
    ).textContent = message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2500
        );

}


// =========================================
// CHECKOUT
// =========================================

const checkoutModal =
    document.getElementById(
        "checkoutModal"
    );


document
    .getElementById("checkoutBtn")
    .addEventListener(
        "click",
        () => {

            if (!cart.length) {

                showToast(
                    "Your bag is empty"
                );

                return;

            }

            checkoutModal.classList.add(
                "active"
            );

        }
    );


document
    .getElementById("closeCheckout")
    .addEventListener(
        "click",
        () => {

            checkoutModal.classList.remove(
                "active"
            );

        }
    );


// =========================================
// PLACE ORDER
// =========================================

document
    .getElementById("checkoutForm")
    .addEventListener(
        "submit",
        event => {

            event.preventDefault();


            alert(
                "Thank you for shopping with ELAN CLOTHES! Your order has been placed successfully."
            );


            cart = [];

            saveCart();

            updateCart();

            checkoutModal.classList.remove(
                "active"
            );

            closeBag();

            event.target.reset();

        }
    );


// =========================================
// NEWSLETTER
// =========================================

document
    .getElementById("newsletterForm")
    .addEventListener(
        "submit",
        event => {

            event.preventDefault();

            showToast(
                "Welcome to the ELAN community!"
            );

            event.target.reset();

        }
    );


// =========================================
// INITIALIZE
// =========================================

displayProducts();

updateCart();


// =========================================
// 3D MOUSE EFFECT
// =========================================

const fashionCard =
    document.querySelector(
        ".fashion-card"
    );


document
    .querySelector(".hero-visual")
    .addEventListener(
        "mousemove",
        event => {

            const rect =
                event.currentTarget
                    .getBoundingClientRect();


            const x =
                event.clientX -
                rect.left;


            const y =
                event.clientY -
                rect.top;


            const rotateY =
                (x / rect.width - .5) * 12;


            const rotateX =
                (y / rect.height - .5) * -12;


            fashionCard.style.animation =
                "none";


            fashionCard.style.transform =
                `rotateX(${rotateX}deg)
                 rotateY(${rotateY}deg)
                 translateY(-10px)`;

        }
    );


document
    .querySelector(".hero-visual")
    .addEventListener(
        "mouseleave",
        () => {

            fashionCard.style.animation =
                "float 6s ease-in-out infinite";

            fashionCard.style.transform =
                "";

        }
    );

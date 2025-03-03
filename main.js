const productList = document.getElementById('productList');
const cartCount = document.getElementById('cartCount');
const cartItems = document.getElementById('cartItems');
const totalPriceElem = document.getElementById('totalPrice');
const checkoutBtn = document.getElementById('checkoutBtn');

// Promo code elements
const promoCodeInput = document.getElementById('promoCodeInput');
const applyPromoBtn = document.getElementById('applyPromoBtn');
const promoMessage = document.getElementById('promoMessage');

// Promo codes and discount percentages
const promoCodes = {
    'pradip10': 10,
    'pradip5': 5
};

let cart = []; 
let products = []; 
let discount = 0; // Store discount value

// Fetch products from products.json
async function fetchProducts() {
    try {
        const response = await fetch('products.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// Display products in the UI
function displayProducts(products) {
    productList.innerHTML = '';
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('col-md-4');
        productCard.innerHTML = `
            <div class="product-card">
                <img src="${product.image}" alt="${product.title}" class="img-fluid">
                <div class="card-body">
                    <h5 class="card-title">${product.title}</h5>
                    <p class="card-text">${product.description}</p>
                    <h6 class="product-price">BDT ${product.price}</h6>
                    <button class="btn btn-primary" onclick="addToCart (${product.id})">Add to Cart</button>
                </div>
            </div>
        `;
        productList.appendChild(productCard);
    });
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.product.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ product, quantity: 1 });
    }
    updateCart();
}

// Update cart in the UI
function updateCart() {
    cartCount.textContent = cart.length;
    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <strong>${item.product.title}</strong>
            Price: BDT ${item.product.price} x ${item.quantity}
        `;
        cartItems.appendChild(listItem);
        total += item.product.price * item.quantity;
    });

    // Apply discount if any
    const discountAmount = total * (discount / 100);
    const finalTotal = total - discountAmount;

    totalPriceElem.textContent = finalTotal.toFixed(2);
    promoMessage.textContent = discount > 0 ? `Discount applied: ${discount}%` : ''; // Show discount message
}

// Apply promo code function
applyPromoBtn.addEventListener('click', () => {
    const enteredCode = promoCodeInput.value.trim().toLowerCase();
    
    if (promoCodes[enteredCode]) {
        discount = promoCodes[enteredCode];
        promoMessage.textContent = `Promo code applied: ${discount}% discount.`;
        updateCart(); // Recalculate total with discount
    } else {
        discount = 0;
        promoMessage.textContent = 'Invalid promo code.';
        updateCart(); // Recalculate total without discount
    }
});

// Checkout button functionality
checkoutBtn.addEventListener('click', () => {
    alert('Thank you for your purchase!');
    cart = [];
    discount = 0; // Reset discount after checkout
    promoCodeInput.value = ''; // Clear promo code input
    promoMessage.textContent = ''; // Clear promo message
    updateCart();
});

// Initial fetch of products
fetchProducts();

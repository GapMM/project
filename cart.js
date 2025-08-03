document.addEventListener('DOMContentLoaded', function() {
    
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }
    
   
    updateCartCount();
    
    
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });
   
    if (document.getElementById('cart-items')) {
        displayCartItems();
        
        
        const checkoutButton = document.getElementById('checkout-button');
        if (checkoutButton) {
            checkoutButton.addEventListener('click', checkout);
        }
    }
});

function addToCart(event) {
    const button = event.target;
    const product = {
        id: button.getAttribute('data-id'),
        name: button.getAttribute('data-name'),
        price: parseInt(button.getAttribute('data-price')),
        quantity: 1,
        image: button.closest('.product-card').querySelector('img').src
    };
    
    let cart = JSON.parse(localStorage.getItem('cart'));
    
    // Проверяем, есть ли товар уже в корзине
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push(product);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
   
    button.textContent = 'Добавлено!';
    setTimeout(() => {
        button.textContent = 'Добавить в корзину';
    }, 2000);
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart'));
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    
    const cartCountElements = document.querySelectorAll('#cart-count');
    cartCountElements.forEach(element => {
        element.textContent = count;
    });
}

function displayCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart'));
    const cartItemsContainer = document.getElementById('cart-items');
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart-message">
                <p>Ваша корзина пуста.</p>
                <a href="designs.html" class="continue-shopping">Продолжить покупки</a>
            </div>
        `;
        subtotalElement.textContent = '0 ₽';
        totalElement.textContent = '0 ₽';
        return;
    }
    
    let itemsHTML = '';
    let subtotal = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        itemsHTML += `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h4 class="cart-item-name">${item.name}</h4>
                    <p class="cart-item-price">${formatPrice(item.price)} ₽</p>
                    <div class="cart-item-quantity">
                        <button class="quantity-button decrease">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1">
                        <button class="quantity-button increase">+</button>
                    </div>
                    <p class="cart-item-total">${formatPrice(itemTotal)} ₽</p>
                    <p class="remove-item">Удалить</p>
                </div>
            </div>
        `;
    });
    
    cartItemsContainer.innerHTML = itemsHTML;
    subtotalElement.textContent = `${formatPrice(subtotal)} ₽`;
    totalElement.textContent = `${formatPrice(subtotal)} ₽`;
    
    // Обработчики изменения количества
    document.querySelectorAll('.quantity-button').forEach(button => {
        button.addEventListener('click', updateQuantity);
    });
    
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', updateQuantity);
    });
    
    // Обработчики удаления товаров
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', removeItem);
    });
}

function updateQuantity(event) {
    const button = event.target;
    const cartItem = button.closest('.cart-item');
    const id = cartItem.getAttribute('data-id');
    const input = cartItem.querySelector('.quantity-input');
    let quantity = parseInt(input.value);
    
    if (button.classList.contains('decrease')) {
        quantity = Math.max(1, quantity - 1);
    } else if (button.classList.contains('increase')) {
        quantity += 1;
    } else if (button.tagName === 'INPUT') {
        quantity = Math.max(1, quantity);
    }
    
    input.value = quantity;
    
    let cart = JSON.parse(localStorage.getItem('cart'));
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity = quantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCartItems();
        updateCartCount();
    }
}

function removeItem(event) {
    const button = event.target;
    const cartItem = button.closest('.cart-item');
    const id = cartItem.getAttribute('data-id');
    
    let cart = JSON.parse(localStorage.getItem('cart'));
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    
    displayCartItems();
    updateCartCount();
}

function checkout() {
    alert('Спасибо за заказ! Ваш заказ №' + Math.floor(Math.random() * 10000) + ' оформлен.');
    localStorage.setItem('cart', JSON.stringify([]));
    updateCartCount();
    displayCartItems();
}


function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
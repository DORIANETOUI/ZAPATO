
let allProducts = []; 


async function loadAndRenderProducts() 
{
    
    const productListContainer = document.getElementById('product-list'); 

    try {
        // Charger les données de products.json
        const response = await fetch ('./products.json');

        if (!response.ok) 
        {
            // La description d'erreur est correcte
            throw new Error (`Erreur HTTP! statut: ${response.status}: `)
        }


        const products = await response.json();
        allProducts = products; // Stocker tous les produits pour une utilisation ultérieure


        // Parcourir la liste des produits et créer le HTML

        products.forEach(product=>{
            //createElement
            const col = document.createElement('div');
            //className
            col.className = 'col';

            //innerHTML
            col.innerHTML = `
            <div class="card h-100 shadow-sm border-0 rounded-3 overflow-hidden product-card">
                <img src="${product.image_url}" class="card-img-top" alt="Image de ${product.name}" loading="lazy">
                
                <div class="card-body d-flex flex-column text-center">
                    
                    <h5 class="card-title fw-semibold text-truncate mb-1">${product.name}</h5>
                    <p class="fs-5 fw-bold text-primary">${product.price.toFixed(2)} €</p>
                    
                    <button 
                        class="btn btn-sm btn-outline-dark mt-2 quick-view-btn" 
                        data-product-id="${product.id}"
                        data-bs-toggle="modal" 
                        data-bs-target="#quickViewModal">
                        
                        🔍 Aperçu Rapide
                    </button>
                    
                </div>
            </div>
            `;

            // Ajouter la carte au html
            productListContainer.appendChild(col);
        });
    }
    catch (error) {
        console.error("Erreur lors du chargement des produits :", error);
        productListContainer.innerHTML = '<p class="text-danger"> Impossible de charger la collection de SACS. Veuillez réessayer plus tard.</p>';
    }
}

// DOMContentLoaded
document.addEventListener('DOMContentLoaded', loadAndRenderProducts);


// LOGIQUE DE GESTION DE LA MODALE


// 1. Cibler les éléments nécessaires
const quickViewModal = document.getElementById('quickViewModal');
const quickViewBody = document.getElementById('quickViewBody');

// 2. Écouter l'événement 'show.bs.modal' de Bootstrap
// Cet événement se déclenche juste AVANT que la modale ne s'ouvre.
quickViewModal.addEventListener('show.bs.modal', function (event) {
    // Le bouton qui a été cliqué est dans event.relatedTarget
    const button = event.relatedTarget;
    
    // Récupérer l'ID du produit depuis l'attribut data-product-id
    const productId = button.getAttribute('data-product-id');

    // Trouver le produit correspondant dans notre tableau global allProducts
    // (Nous utilisons parseInt car l'ID dans data- est une chaîne de caractères)
    const product = allProducts.find(p => p.id === parseInt(productId));

    // Si le produit est trouvé, construire et injecter le HTML
    if (product) {
        
        // Construction du contenu détaillé (Image à gauche, Détails à droite)
        quickViewBody.innerHTML = `
            <div class="container-fluid">
                <div class="row">
                    
                    <div class="col-md-6 mb-3 mb-md-0">
                        <img src="${product.image_url.replace('w=400', 'w=800')}" 
                             class="img-fluid rounded-3" 
                             alt="Image de ${product.name}">
                    </div>
                    
                    <div class="col-md-6 d-flex flex-column justify-content-center">
                        <h2 class="display-6 fw-bold">${product.name}</h2>
                        
                        <p class="text-muted lead">${product.description}</p>
                        
                        <hr>
                        
                        <div class="d-flex justify-content-between align-items-center mt-3">
                            <p class="fs-2 fw-bolder text-primary mb-0">${product.price.toFixed(2)} €</p>
                            
                            <button class="btn btn-lg btn-dark add-to-cart-btn" data-product-id="${product.id}">
                                Ajouter au panier
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else {
        quickViewBody.innerHTML = '<p class="text-danger text-center p-5">Détails du produit introuvables.</p>';
    }
});


// GESTION DU PANIER (LOCAL STORAGE)

function getCart() {
    // Récupérer le panier depuis le Local Storage, ou un tableau vide s'il n'existe pas
    const cart = localStorage.getItem('zapatoCart');
    return cart ? JSON.parse(cart) : [];
}

// 2. Mettre à jour le Local Storage et les Compteurs (Navbar et Flottant)
function updateCart(cart) {
    // Sauvegarder le panier mis à jour dans le Local Storage
    localStorage.setItem('zapatoCart', JSON.stringify(cart));
    
    const count = cart.length;

    // Mise à jour du compteur dans la Navbar
    const cartCountNavbar = document.getElementById('cart-count');
    if (cartCountNavbar) {
        cartCountNavbar.textContent = count;
    }

    // Mise à jour du compteur sur le bouton Flottant
    const cartCountFloat = document.getElementById('cart-count-float');
    if (cartCountFloat) {
        cartCountFloat.textContent = count;
        
        // Afficher/Cacher le badge si le panier est vide (UX)
        const floatingBadge = document.getElementById('cart-count-mobile');
        if (floatingBadge) {
            floatingBadge.style.display = count > 0 ? 'inline' : 'none';
        }
    }
}
// 3. Fonction d'Ajout au Panier
function addToCart(productId) {
    const cart = getCart();
    
    // Trouver le produit complet (nécessaire pour la description, le prix, etc.)
    const productToAdd = allProducts.find(p => p.id === parseInt(productId));

    if (productToAdd) {
        // Option simple: ajouter l'objet complet au panier (pour l'instant, sans gestion de quantité)
        cart.push(productToAdd); 
        
        updateCart(cart);
        
        // Feedback visuel (important pour l'UX !)
        console.log(`Produit ID ${productId} ajouté au panier.`);
        alert(`${productToAdd.name} a été ajouté à votre panier !`); 
        
        // Optionnel : Fermer la modale après l'ajout
        const modalElement = document.getElementById('quickViewModal');
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
            modalInstance.hide();
        }
    }
}

// 4. Événement pour écouter les clics sur TOUS les boutons "Ajouter au panier"
document.addEventListener('click', function(event) {
    // Vérifie si l'élément cliqué ou son parent le plus proche est un bouton ayant l'ID ciblé
    const targetId = event.target.closest('button')?.id;

    if (targetId === 'cart-button' || targetId === 'floating-cart-button') {
        event.preventDefault(); // Empêche le comportement par défaut (si déjà défini dans HTML)
        
        // 1. Mise à jour du contenu du panier
        renderCart(); 
        
        // 2. Ouverture manuelle de la modale Panier après le rendu
        const modalElement = document.getElementById('cartModal');
        // Nécessite une nouvelle instance si elle n'existe pas, sinon utilise celle existante
        const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
        modalInstance.show();
    }
});
// 5. Appel initial pour charger le compteur du panier au démarrage
document.addEventListener('DOMContentLoaded', updateCart(getCart()));


// LOGIQUE DE GESTION DU PANIER (RENDU)


// 1. Cibler les éléments de la nouvelle modale
const cartModalBody = document.getElementById('cartModalBody');
const cartSummary = document.getElementById('cart-summary');
const cartButtonNavbar = document.getElementById('cart-button');

// 2. Fonction de Rendu du Panier
function renderCart() {
    const cart = getCart(); // Récupère le panier actuel

    if (cart.length === 0) {
        // Panier vide
        cartModalBody.innerHTML = `
            <div class="alert alert-info text-center" role="alert">
                Votre panier est vide. Trouvez le sac parfait !
            </div>
        `;
        cartSummary.innerHTML = '';
        document.getElementById('checkout-button').disabled = true;
        return;
    }

    // Si le panier contient des articles
    let cartHTML = '';
    let totalPrice = 0;

    cart.forEach((product, index) => {
        // Calcul du prix total
        totalPrice += product.price;

        // Template de la ligne de produit
        cartHTML += `
            <div class="d-flex align-items-center mb-3 pb-3 border-bottom">
                
                <img src="${product.image_url.replace('w=400', 'w=100')}" class="rounded me-3" style="width: 60px; height: 60px; object-fit: cover;" alt="${product.name}">
                
                <div class="flex-grow-1">
                    <h6 class="mb-0 fw-semibold">${product.name}</h6>
                </div>
                
                <div class="text-end">
                    <p class="mb-0 fw-bold">${product.price.toFixed(2)} €</p>
                    <button class="btn btn-sm btn-outline-danger mt-1 remove-from-cart-btn" data-index="${index}">
                        Retirer
                    </button>
                </div>
            </div>
        `;
    });

    // 3. Injection du HTML dans la modale
    cartModalBody.innerHTML = cartHTML;
    
    // 4. Affichage du résumé
    cartSummary.innerHTML = `
        <h4 class="fw-bold">Total : ${totalPrice.toFixed(2)} €</h4>
    `;
    
    // 5. Activation du bouton de commande
    document.getElementById('checkout-button').disabled = false;
}

// 6. Gestion du Clic sur le bouton "Panier" de la Navbar
cartButtonNavbar.addEventListener('click', function() {
    renderCart(); // Charger le contenu AVANT l'ouverture
    const modalInstance = new bootstrap.Modal(document.getElementById('cartModal'));
    modalInstance.show();
});

// 7. Fonction pour retirer un article du panier
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('remove-from-cart-btn')) {
        const indexToRemove = event.target.getAttribute('data-index');
        let cart = getCart();
        
        // Retirer l'élément du tableau par son index
        cart.splice(indexToRemove, 1);
        
        // Mettre à jour le Local Storage et le Compteur Navbar
        updateCart(cart);
        
        // Re-rendre le panier immédiatement pour mettre à jour la modale
        renderCart(); 
    }
});


// ====================================
// LOGIQUE DE COMMANDE WHATSAPP
// ====================================

// Votre numéro de téléphone (à remplacer par le vrai numéro ZAPATO)
const WHATSAPP_NUMBER = '2250140258592'

function generateWhatsAppMessage() {
    const cart = getCart();
    let messageBody = "Bonjour ZAPATO, je souhaite commander les articles suivants :\n\n";
    let totalPrice = 0;

    // 1. Liste détaillée des produits
    cart.forEach((product, index) => {
        totalPrice += product.price;
        // Utilisez le nom et le prix pour la clarté
        messageBody += `* ${product.name} - ${product.price.toFixed(2)} €\n`;
    });

    // 2. Ajout du total
    messageBody += "\n---------------------------\n";
    messageBody += `*Total de la commande : ${totalPrice.toFixed(2)} €*\n\n`;
    
    // 3. Appel à l'action pour les détails de livraison
    messageBody += "Merci de confirmer la disponibilité et de m'indiquer les options de livraison/paiement. Je vous communiquerai mes informations (Nom, Adresse) après confirmation.";

    // L'URL doit être encodée pour que les espaces et caractères spéciaux soient interprétés
    const encodedMessage = encodeURIComponent(messageBody);

    // Retourne le lien complet vers l'API WhatsApp
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
}

// 4. Fonction pour gérer le clic sur le bouton de commande
function sendWhatsAppOrder() {
    const cart = getCart();
    
    if (cart.length === 0) {
        alert("Votre panier est vide. Ajoutez des chaussures avant de commander !");
        return;
    }
    
    // Génère le lien et ouvre le nouvel onglet/application
    const whatsappLink = generateWhatsAppMessage();
    window.open(whatsappLink, '_blank');
    
}

// 5. Liaison de la fonction au bouton "Passer la commande"
document.getElementById('checkout-button').addEventListener('click', sendWhatsAppOrder);


// ENREGISTREMENT DU SERVICE WORKER (PWA)

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('ServiceWorker enregistré avec succès. Scope:', registration.scope);
            })
            .catch(error => {
                console.error('Échec de l\'enregistrement du ServiceWorker:', error);
            });
    });
}



/* ═══════════════════════════════════════════════════════════
   INOVANERD — script.js
   Loja de Anime: Camisetas & Bonecos Colecionáveis
   Funcionalidades: Catálogo, Carrinho, Filtros, Checkout
═══════════════════════════════════════════════════════════ */

/* ────────────────────────────────────────────
   1. BANCO DE DADOS DE PRODUTOS
   TODO (back-end): substituir por fetch('/api/products')
   e popular PRODUCTS dinamicamente antes de renderizar.
──────────────────────────────────────────── */
const PRODUCTS = [
  // ── CAMISETAS ──────────────────────────────
  {
    id: 1,
    name: 'Camiseta Samurai of Fire',
    anime: 'Anime Original',
    category: 'camisetas',
    price: 89.90,
    oldPrice: 119.90,
    emoji: '🔥',
    badge: 'new',
    rating: 4.9,
    reviews: 201,
    sizes: ['P','M','G','GG'],
    description: 'O guerreiro das chamas em toda a sua glória! Camiseta preta com estampa épica de samurai envolto em fogo, arte em alta resolução com cores vibrantes. Material premium anti-pilling, cor não desbota.',
    tags: ['samurai','fogo','épico','premium'],
    bestseller: true,
    featured: true,
    image: 'imagens/img-id-01.png',
  },
  {
    id: 2,
    name: 'Camiseta Freedom Wings',
    anime: 'Estilo Streetwear',
    category: 'camisetas',
    price: 79.90,
    oldPrice: null,
    emoji: '🦅',
    badge: 'new',
    rating: 4.9,
    reviews: 201,
    sizes: ['P','M','G','GG'],
    description: 'Espírito indomável em cada fio! Camiseta oversized preta com estampa militar "Freedom Wings — Unyielding Spirit Est. 2023". Design com escudo e asas em tons verde-oliva. Perfeita para quem não cede.',
    tags: ['oversized','streetwear','militar','wings'],
    bestseller: true,
    featured: true,
    image: 'imagens/img-id-02.png',
  },
  {
    id: 3,
    name: 'Camiseta Void Mage',
    anime: 'Anime Original',
    category: 'camisetas',
    price: 94.90,
    oldPrice: 129.90,
    emoji: '💫',
    badge: 'hot',
    rating: 5.0,
    reviews: 487,
    sizes: ['P','M','G','GG','XGG'],
    description: 'O mago do vazio domina as energias do mundo. Estampa neon azul vibrante com personagem vendado conjurando poderes cósmicos. Edição especial VOID WEAR — produção limitada.',
    tags: ['void','mago','neon','limitada'],
    bestseller: true,
    featured: true,
    image: 'imagens/img-id-03.png',
  },
  {
    id: 4,
    name: 'Camiseta Rise of The Shadow',
    anime: 'Ninja Original',
    category: 'camisetas',
    price: 69.90,
    oldPrice: null,
    emoji: '🥷',
    badge: null,
    rating: 4.7,
    reviews: 598,
    sizes: ['PP','P','M','G','GG'],
    description: 'A ascensão das sombras começa aqui! Camiseta preta com arte ninja dinâmica em laranja e preto, kanji japonês e a frase "Rise of The Shadow". Um must-have para fãs de ninja.',
    tags: ['ninja','sombra','kanji','must-have'],
    bestseller: false,
    featured: true,
    image: 'imagens/img-id-04.png',
  },
  {
    id: 5,
    name: 'Camiseta Rubber Hero — Joyful Boom!',
    anime: 'Anime Original',
    category: 'camisetas',
    price: 99.90,
    oldPrice: 129.90,
    emoji: '💥',
    badge: 'hot',
    rating: 4.9,
    reviews: 441,
    sizes: ['P','M','G','GG'],
    description: 'Alegria máxima em cada fibra! Camiseta branca com estampa colorida da super-heroína "Rubber Hero" em plena ação — explosão de cores, sparkles e a grita "Joyful Boom!". Arte vibrante e durabilidade garantida.',
    tags: ['superhero','colorida','joyful','fun'],
    bestseller: true,
    featured: false,
    image: 'imagens/img-id-05.png',
  },
  {
    id: 6,
    name: 'Camiseta Shadow Soldier',
    anime: 'Anime Original',
    category: 'camisetas',
    price: 84.90,
    oldPrice: null,
    emoji: '🎖️',
    badge: 'new',
    rating: 4.8,
    reviews: 267,
    sizes: ['P','M','G','GG','XGG'],
    description: 'O guerreiro silencioso pronto para a missão. Estampa artística de soldado anime com manto verde e rifle de precisão. Design sério e detalhado em preto e verde, ideal para fãs de estética militar.',
    tags: ['soldado','militar','arte','dark'],
    bestseller: false,
    featured: true,
    image: 'imagens/img-id-06.png',
  },
  {
    id: 7,
    name: 'Camiseta Nothing Happened',
    anime: 'Anime Original',
    category: 'camisetas',
    price: 89.90,
    oldPrice: 110.00,
    emoji: '🗡️',
    badge: 'sale',
    rating: 4.6,
    reviews: 183,
    sizes: ['M','G','GG'],
    description: '"Nothing Happened." A icônica frase do ninja das sombras agora em camiseta verde com estampa do guerreiro encapuzado cruzando duas katanas. Corte regular, ótima para o dia a dia ou eventos otaku.',
    tags: ['ninja','katana','iconic','verde'],
    bestseller: false,
    featured: false,
    image: 'imagens/img-id-07.png',
  },
  {
    id: 8,
    name: 'Camiseta Itachi Uchiha — Akatsuki',
    anime: 'Naruto',
    category: 'camisetas',
    price: 74.90,
    oldPrice: null,
    emoji: '🎴',
    badge: null,
    rating: 4.9,
    reviews: 376,
    sizes: ['P','M','G','GG'],
    description: 'Itachi Uchiha — Member of Akatsuki. O Sharingan eterno em sua camiseta. Arte premium do shinobi mais enigmático do universo Naruto, rodeado por corvos e chamas vermelhas. Edição permanente do catálogo INOVANERD.',
    tags: ['sharingan','akatsuki','itachi','uchiha'],
    bestseller: false,
    featured: false,
    image: 'imagens/img-id-08.png',
  },

  // ── BONECOS ────────────────────────────────
  {
    id: 9,
    name: 'Figure Seraphina Battle Maid — 1/7 Scale',
    anime: 'Original Character',
    category: 'bonecos',
    price: 349.90,
    oldPrice: null,
    emoji: '🌸',
    badge: null,
    rating: 4.9,
    reviews: 143,
    sizes: [],
    description: 'Seraphina — Battle Maid. Figure colecionável em escala 1/7 com detalhes impressionantes: vestido de maid azul e branco, cabelos azuis e sua icônica foice "Seraphina\'s Blade". Base decorada com flores brancas e azuis. Peça premium para exibir na estante.',
    tags: ['figure','maid','seraphina','colecionável','1/7'],
    bestseller: false,
    featured: true,
    image: 'imagens/img-id-09.png',
  },
];

/* ────────────────────────────────────────────
   2. ESTADO GLOBAL DA APLICAÇÃO
──────────────────────────────────────────── */
const CART_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 horas

function loadCartFromStorage() {
  try {
    const raw = localStorage.getItem('otakuverse_cart');
    if (!raw) return [];
    const { items, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp > CART_EXPIRY_MS) {
      localStorage.removeItem('otakuverse_cart');
      return [];
    }
    return items || [];
  } catch {
    return [];
  }
}

let cart       = loadCartFromStorage();
let currentPage     = 'home';
let previousPage    = 'home';
let currentProduct  = null;
let currentQty      = 1;
let selectedSize    = null;
let activeAnimes    = [];
let maxPrice        = 500;
let checkoutStep    = 1;
let wishlist        = JSON.parse(localStorage.getItem('otakuverse_wishlist') || '[]');
let heroCarouselIndex = 0;
let heroCarouselTimer = null;
const heroCarouselData = [
  {
    title: 'Camiseta Anime',
    description: 'Estampa premium com visual exclusivo para coleção.',
    price: 'R$ 89,90',
  },
  {
    title: 'Figure Colecionável',
    description: 'Peça detalhada com acabamento premium para sua estante.',
    price: 'R$ 149,90',
  },
];

/* ────────────────────────────────────────────
   3. NAVEGAÇÃO ENTRE PÁGINAS
──────────────────────────────────────────── */
function showPage(page, product = null) {
  // Esconde todas as páginas
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  // Remove active dos links
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

  // Ativa a página correta
  const pageEl = document.getElementById(`page-${page}`);
  if (pageEl) pageEl.classList.add('active');

  // Ativa link do nav correspondente
  const navLink = document.querySelector(`[data-page="${page}"]`);
  if (navLink) navLink.classList.add('active');

  previousPage = currentPage;
  currentPage  = page;

  // Scroll suave ao topo
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Ações específicas por página
  if (page === 'home') {
    renderFeatured();
    renderBestsellers();
    updateHeroCaptions();
    createParticles();
    startHeroCarousel();
  } else if (page === 'catalog') {
    buildAnimeFilters();
    applyFilters();
  } else if (page === 'product' && product) {
    currentProduct = product;
    currentQty = 1;
    selectedSize = product.sizes.length ? null : 'N/A';
    renderProductDetail(product);
    renderRelated(product);
  } else if (page === 'cart') {
    renderCart();
  }
}

// Voltar para página anterior
function goBack() {
  showPage(previousPage === 'product' ? 'catalog' : previousPage);
}

// Filtrar por categoria e ir para catálogo
function filterAndGo(category) {
  showPage('catalog');
  if (category !== 'todos') {
    // Define o radio button
    const radio = document.querySelector(`input[name="cat"][value="${category}"]`);
    if (radio) { radio.checked = true; }
  }
  applyFilters();
}

// Scroll suave para seção na home
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Toggle do menu mobile
function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('open');
}

function updateHeroCarousel() {
  const track = document.getElementById('heroCarouselTrack');
  const dots = document.querySelectorAll('.carousel-dot');
  if (!track) return;

  track.style.transform = `translateX(-${heroCarouselIndex * 100}%)`;
  dots.forEach((dot, index) => dot.classList.toggle('active', index === heroCarouselIndex));
}

function updateHeroCaptions() {
  const captions = document.querySelectorAll('.carousel-caption');
  captions.forEach((caption, index) => {
    const item = heroCarouselData[index];
    if (!item) return;
    caption.innerHTML = `
      <span>${item.title}</span>
      <p>${item.description}</p>
      <strong>${item.price}</strong>
    `;
  });
}

function setHeroCarousel(index) {
  const total = document.querySelectorAll('.carousel-slide').length || heroCarouselData.length;
  heroCarouselIndex = ((index % total) + total) % total;
  updateHeroCarousel();
  startHeroCarousel();
}

function moveHeroCarousel(step) {
  setHeroCarousel(heroCarouselIndex + step);
}

function startHeroCarousel() {
  const total = document.querySelectorAll('.carousel-slide').length || heroCarouselData.length;
  clearInterval(heroCarouselTimer);
  heroCarouselTimer = setInterval(() => {
    heroCarouselIndex = (heroCarouselIndex + 1) % total;
    updateHeroCarousel();
  }, 4500);
  updateHeroCarousel();
}

/* ────────────────────────────────────────────
   4. RENDERIZAÇÃO DOS CARDS DE PRODUTO
──────────────────────────────────────────── */

/**
 * Helper de URL de imagem.
 * TODO (back-end): substitua por sua URL de CDN/storage.
 * Exemplo: return `https://cdn.seudominio.com/${path}`;
 */
function getImageUrl(path) {
  return path;
}
function renderProductCard(product, delay = 0) {
  const inWishlist = wishlist.includes(product.id);
  const badgeMap = { new: 'Novo', sale: 'Oferta', hot: '🔥 Hot' };
  const badgeClassMap = { new: 'badge-new', sale: 'badge-sale', hot: 'badge-hot' };

  return `
    <div class="product-card" style="animation-delay:${delay}s" onclick="openProduct(${product.id})">
      <div class="card-image-wrap">
        ${renderProductMedia(product, 'card')}
        ${product.badge ? `<span class="card-badge ${badgeClassMap[product.badge]}">${badgeMap[product.badge]}</span>` : ''}
        <button class="card-wishlist ${inWishlist ? 'active' : ''}"
          onclick="toggleWishlist(event, ${product.id})"
          title="Favoritar">
          ${inWishlist ? '❤️' : '🤍'}
        </button>
      </div>
      <div class="card-body">
        <div class="card-anime">${product.anime}</div>
        <div class="card-name">${product.name}</div>
        <div class="card-price-row">
          <div>
            <div class="card-price">R$ ${product.price.toFixed(2).replace('.', ',')}</div>
            ${product.oldPrice ? `<div class="card-price-old">R$ ${product.oldPrice.toFixed(2).replace('.', ',')}</div>` : ''}
          </div>
          <button class="card-buy-btn" onclick="quickAddToCart(event, ${product.id})">
            + Carrinho
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderProductMedia(product, context = 'card') {
  const alt = `${product.name} - ${product.anime}`;

  if (product.image) {
    return `<img src="${getImageUrl(product.image)}" alt="${alt}" class="product-media product-media-${context}" loading="lazy" />`;
  }

  return `<div class="product-media product-media-${context} product-media-fallback">${product.emoji}</div>`;
}

/* ────────────────────────────────────────────
   5. HOME: FEATURED & BESTSELLERS
──────────────────────────────────────────── */
function renderFeatured() {
  const featured = PRODUCTS.filter(p => p.featured).slice(0, 4);
  const grid = document.getElementById('featuredGrid');
  if (!grid) return;
  grid.innerHTML = featured.map((p, i) => renderProductCard(p, i * 0.1)).join('');
}

function renderBestsellers() {
  const best = PRODUCTS.filter(p => p.bestseller).slice(0, 4);
  const grid = document.getElementById('bestsellersGrid');
  if (!grid) return;
  grid.innerHTML = best.map((p, i) => renderProductCard(p, i * 0.1)).join('');
}

/* ────────────────────────────────────────────
   6. CATÁLOGO COM FILTROS
──────────────────────────────────────────── */
function buildAnimeFilters() {
  const animes = [...new Set(PRODUCTS.map(p => p.anime))].sort();
  const container = document.getElementById('animeFilterOptions');
  if (!container) return;
  container.innerHTML = animes.map(anime => `
    <label class="filter-opt">
      <input type="checkbox" value="${anime}" onchange="applyFilters()" /> ${anime}
    </label>
  `).join('');
}

function applyFilters() {
  const category = document.querySelector('input[name="cat"]:checked')?.value || 'todos';

  // Reseta checkboxes de anime que não existem na categoria atual
  const animeInputs = document.querySelectorAll('#animeFilterOptions input');
  animeInputs.forEach(input => {
    const animeProducts = PRODUCTS.filter(p => p.anime === input.value);
    const hasInCategory = category === 'todos' || animeProducts.some(p => p.category === category);
    if (!hasInCategory) input.checked = false;
  });

  const checkedAnimes = [...document.querySelectorAll('#animeFilterOptions input:checked')].map(i => i.value);
  const sortValue = document.querySelector('.sort-select')?.value || 'default';
  const maxPriceVal = parseFloat(document.getElementById('priceRange')?.value || 500);

  let filtered = PRODUCTS.filter(p => {
    if (category !== 'todos' && p.category !== category) return false;
    if (checkedAnimes.length && !checkedAnimes.includes(p.anime)) return false;
    if (p.price > maxPriceVal) return false;
    return true;
  });

  // Ordenação
  if (sortValue === 'price-asc')  filtered.sort((a,b) => a.price - b.price);
  if (sortValue === 'price-desc') filtered.sort((a,b) => b.price - a.price);
  if (sortValue === 'name')       filtered.sort((a,b) => a.name.localeCompare(b.name));

  // Renderizar
  const grid = document.getElementById('catalogGrid');
  const empty = document.getElementById('emptyState');
  const count = document.getElementById('resultsCount');

  if (!grid) return;

  count.textContent = `${filtered.length} produto${filtered.length !== 1 ? 's' : ''} encontrado${filtered.length !== 1 ? 's' : ''}`;

  if (filtered.length === 0) {
    grid.style.display = 'none';
    empty.style.display = 'block';
  } else {
    grid.style.display = 'grid';
    empty.style.display = 'none';
    grid.innerHTML = filtered.map((p, i) => renderProductCard(p, i * 0.05)).join('');
  }
}

function updatePriceFilter(val) {
  document.getElementById('priceMax').textContent = `R$ ${val}`;
  maxPrice = parseFloat(val);
  applyFilters();
}

function resetFilters() {
  const radios = document.querySelectorAll('input[name="cat"]');
  if (radios[0]) radios[0].checked = true;
  document.querySelectorAll('#animeFilterOptions input').forEach(i => i.checked = false);
  const range = document.getElementById('priceRange');
  if (range) { range.value = 500; updatePriceFilter(500); }
  else applyFilters();
}

/* ────────────────────────────────────────────
   7. PÁGINA DE PRODUTO INDIVIDUAL
──────────────────────────────────────────── */
function openProduct(id) {
  const product = PRODUCTS.find(p => p.id === id);
  if (product) showPage('product', product);
}

function renderProductDetail(product) {
  const container = document.getElementById('productDetail');
  if (!container) return;

  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : null;
  const stars = '★'.repeat(Math.floor(product.rating)) + (product.rating % 1 >= 0.5 ? '½' : '');

  container.innerHTML = `
    <div class="product-detail-image">
      ${renderProductMedia(product, 'detail')}
    </div>

    <div class="product-detail-info">
      <div class="product-detail-category">${product.category === 'camisetas' ? '👕 Camiseta' : '🏆 Boneco Colecionável'}</div>
      <div class="product-detail-anime">✦ ${product.anime}</div>
      <h1 class="product-detail-name">${product.name}</h1>

      <div class="product-detail-rating">
        <span class="stars">${stars}</span>
        <span style="color:var(--orange);font-weight:700">${product.rating}</span>
        <span class="rating-count">(${product.reviews} avaliações)</span>
      </div>

      <p class="product-detail-desc">${product.description}</p>

      <div class="product-detail-price-row">
        <span class="product-detail-price">R$ ${product.price.toFixed(2).replace('.', ',')}</span>
        ${product.oldPrice ? `<span class="product-detail-price-old">R$ ${product.oldPrice.toFixed(2).replace('.', ',')}</span>` : ''}
        ${discount ? `<span class="product-detail-discount">-${discount}%</span>` : ''}
      </div>

      ${product.sizes.length ? `
        <div class="size-selector">
          <div class="size-label">Tamanho</div>
          <div class="size-options" id="sizeOptions">
            ${product.sizes.map(s => `
              <button class="size-btn" onclick="selectSize('${s}', this)">${s}</button>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <div class="qty-selector">
        <span class="qty-label">Quantidade</span>
        <div class="qty-controls">
          <button class="qty-btn" onclick="changeQty(-1)">−</button>
          <span class="qty-value" id="qtyDisplay">1</span>
          <button class="qty-btn" onclick="changeQty(1)">+</button>
        </div>
      </div>

      <div class="detail-actions">
        <button class="btn btn-primary" onclick="addCurrentToCart()">🛒 Adicionar ao Carrinho</button>
        <button class="btn btn-outline" onclick="showPage('catalog')">← Ver mais</button>
      </div>

      <div class="product-detail-tags">
        ${product.tags.map(t => `<span class="tag">${t}</span>`).join('')}
      </div>
    </div>
  `;
}

function selectSize(size, btn) {
  selectedSize = size;
  document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function changeQty(delta) {
  currentQty = Math.max(1, Math.min(10, currentQty + delta));
  const display = document.getElementById('qtyDisplay');
  if (display) display.textContent = currentQty;
}

function addCurrentToCart() {
  if (!currentProduct) return;

  // Valida se tamanho foi selecionado (só para camisetas)
  if (currentProduct.sizes.length && !selectedSize) {
    showToast('⚠️ Selecione um tamanho primeiro!', 'error');
    // Shake nos botões de tamanho
    document.querySelectorAll('.size-btn').forEach(b => {
      b.style.animation = 'none';
      b.offsetHeight; // reflow
      b.style.animation = 'shake 0.4s ease';
    });
    return;
  }

  addToCart(currentProduct, currentQty, selectedSize);
}

function renderRelated(product) {
  const related = PRODUCTS
    .filter(p => p.id !== product.id && (p.anime === product.anime || p.category === product.category))
    .slice(0, 4);

  const grid = document.getElementById('relatedGrid');
  if (!grid) return;
  grid.innerHTML = related.map((p, i) => renderProductCard(p, i * 0.1)).join('');
}

/* ────────────────────────────────────────────
   8. CARRINHO DE COMPRAS
──────────────────────────────────────────── */

// Desconto de cupom ativo
let activeCoupon = null; // { code: 'OTAKU10', pct: 10 }

// Adiciona item ao carrinho
function addToCart(product, qty = 1, size = null) {
  const key = `${product.id}_${size || 'n'}`;
  const existing = cart.find(i => i.key === key);

  if (existing) {
    existing.qty = Math.min(existing.qty + qty, 10);
  } else {
    cart.push({
      key,
      id: product.id,
      name: product.name,
      anime: product.anime,
      emoji: product.emoji,
      image: product.image || null,
      price: product.price,
      size: size,
      qty,
    });
  }

  saveCart();
  updateCartBadge();
  showToast(`✅ ${product.name} adicionado ao carrinho!`, 'success');
}

// Adiciona rapidamente pelo botão do card
function quickAddToCart(event, id) {
  event.stopPropagation(); // Não abre a página do produto
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;

  // Se tem tamanho, abre a página do produto para escolher
  if (product.sizes.length) {
    showToast('👕 Selecione o tamanho na página do produto!', '');
    openProduct(id);
    return;
  }

  addToCart(product);
}

// Salva carrinho no localStorage com timestamp
function saveCart() {
  localStorage.setItem('otakuverse_cart', JSON.stringify({ items: cart, timestamp: Date.now() }));
}

// Atualiza badge de contagem no ícone do carrinho
function updateCartBadge() {
  const total = cart.reduce((sum, i) => sum + i.qty, 0);
  const badge = document.getElementById('cartBadge');
  if (badge) badge.textContent = total;
}

// Remove item do carrinho
function removeFromCart(key) {
  cart = cart.filter(i => i.key !== key);
  saveCart();
  updateCartBadge();
  renderCart();
  showToast('🗑️ Item removido do carrinho', '');
}

// Atualiza quantidade de um item
function updateCartQty(key, delta) {
  const item = cart.find(i => i.key === key);
  if (!item) return;
  item.qty = Math.max(1, Math.min(10, item.qty + delta));
  if (item.qty === 0) { removeFromCart(key); return; }
  saveCart();
  renderCart();
}

// Calcula totais
function getCartTotals() {
  const subtotalBruto = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const desconto = activeCoupon ? subtotalBruto * (activeCoupon.pct / 100) : 0;
  const subtotal = subtotalBruto - desconto;
  const frete = subtotal >= 199 ? 0 : 19.90;
  const total = subtotal + frete;
  return { subtotalBruto, desconto, subtotal, frete, total };
}

// Renderiza a página do carrinho
function renderCart() {
  const wrap = document.getElementById('cartItemsWrap');
  const summary = document.getElementById('cartSummary');
  if (!wrap || !summary) return;

  if (cart.length === 0) {
    wrap.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🛒</div>
        <h3>Seu carrinho está vazio</h3>
        <p>Explore nosso catálogo e adicione produtos incríveis!</p>
        <button class="btn btn-primary" onclick="showPage('catalog')">Ver Catálogo</button>
      </div>
    `;
    summary.innerHTML = '';
    return;
  }

  // Renderiza itens
  wrap.innerHTML = cart.map(item => `
    <div class="cart-item" id="item-${item.key}">
      <div class="cart-item-img">${renderProductMedia(item, 'cart')}</div>
      <div class="cart-item-info">
        <div class="cart-item-anime">${item.anime}</div>
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-meta">
          ${item.size && item.size !== 'N/A' ? `Tamanho: <strong>${item.size}</strong>` : 'Boneco Colecionável'}
        </div>
      </div>
      <div class="cart-item-controls">
        <button class="cart-remove-btn" onclick="removeFromCart('${item.key}')" title="Remover">🗑️</button>
        <div class="qty-controls" style="display:flex;align-items:center">
          <button class="qty-btn" onclick="updateCartQty('${item.key}', -1)">−</button>
          <span class="qty-value">${item.qty}</span>
          <button class="qty-btn" onclick="updateCartQty('${item.key}', 1)">+</button>
        </div>
        <div class="cart-item-price">R$ ${(item.price * item.qty).toFixed(2).replace('.', ',')}</div>
      </div>
    </div>
  `).join('');

  // Renderiza resumo
  const { subtotalBruto, desconto, subtotal, frete, total } = getCartTotals();
  summary.innerHTML = `
    <div class="summary-title">RESUMO</div>

    <div class="summary-row">
      <span>Subtotal (${cart.reduce((s,i)=>s+i.qty,0)} itens)</span>
      <span>R$ ${subtotalBruto.toFixed(2).replace('.', ',')}</span>
    </div>
    ${desconto > 0 ? `
    <div class="summary-row" style="color:#22C55E">
      <span>Cupom (${activeCoupon.code})</span>
      <span>- R$ ${desconto.toFixed(2).replace('.', ',')}</span>
    </div>` : ''}
    <div class="summary-row">
      <span>Frete</span>
      <span style="color:${frete === 0 ? '#22C55E' : 'inherit'}">${frete === 0 ? 'GRÁTIS 🎉' : `R$ ${frete.toFixed(2).replace('.', ',')}`}</span>
    </div>
    ${frete > 0 ? `<div style="font-size:13px;color:var(--text-muted);margin-bottom:14px">Falta R$ ${(199 - subtotal).toFixed(2).replace('.', ',')} para frete grátis!</div>` : ''}
    <div class="summary-row total">
      <span>Total</span>
      <span>R$ ${total.toFixed(2).replace('.', ',')}</span>
    </div>

    <div class="coupon-wrap">
      <input type="text" class="coupon-input" id="couponInput" placeholder="${activeCoupon ? activeCoupon.code + ' aplicado ✓' : 'Código de cupom'}" ${activeCoupon ? 'disabled' : ''} />
      ${activeCoupon
        ? `<button class="btn btn-outline btn-sm" onclick="removeCoupon()">Remover</button>`
        : `<button class="btn btn-outline btn-sm" onclick="applyCoupon()">Aplicar</button>`
      }
    </div>

    <div class="checkout-btn-wrap">
      <button class="btn btn-primary btn-full" onclick="openCheckout()">
        Finalizar Compra →
      </button>
    </div>
    <p class="summary-info">🔒 Compra 100% segura · Dados criptografados</p>
  `;
}

// Aplica cupom com desconto real
function applyCoupon() {
  const code = document.getElementById('couponInput')?.value?.trim().toUpperCase();
  if (!code) { showToast('⚠️ Digite um código de cupom', 'error'); return; }
  const codes = { 'OTAKU10': 10, 'ANIME20': 20, 'VERSE15': 15 };
  if (codes[code]) {
    activeCoupon = { code, pct: codes[code] };
    showToast(`🎉 Cupom ${code} aplicado! ${codes[code]}% de desconto`, 'success');
    renderCart();
  } else {
    showToast('❌ Cupom inválido ou expirado', 'error');
  }
}

function removeCoupon() {
  activeCoupon = null;
  showToast('🗑️ Cupom removido', '');
  renderCart();
}

/* ────────────────────────────────────────────
   9. CHECKOUT SIMULADO
──────────────────────────────────────────── */

// Utilitários de validação
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function isValidEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
function isValidCPF(v)   { return /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(v) || /^\d{11}$/.test(v.replace(/\D/g,'')); }
function isValidCEP(v)   { return /^\d{5}-?\d{3}$/.test(v); }
function isValidPhone(v) { return v.replace(/\D/g,'').length >= 10; }

function validateCheckoutStep1() {
  const nome  = document.getElementById('checkout-nome')?.value.trim();
  const email = document.getElementById('checkout-email')?.value.trim();
  const cpf   = document.getElementById('checkout-cpf')?.value.trim();
  const tel   = document.getElementById('checkout-tel')?.value.trim();
  const cep   = document.getElementById('checkout-cep')?.value.trim();
  const end   = document.getElementById('checkout-end')?.value.trim();
  const num   = document.getElementById('checkout-num')?.value.trim();
  const cidade= document.getElementById('checkout-cidade')?.value.trim();
  const estado= document.getElementById('checkout-estado')?.value.trim();

  if (!nome || nome.length < 3)         { showToast('⚠️ Informe seu nome completo', 'error'); return false; }
  if (!isValidEmail(email))             { showToast('⚠️ E-mail inválido', 'error'); return false; }
  if (!isValidCPF(cpf))                 { showToast('⚠️ CPF inválido (use 000.000.000-00)', 'error'); return false; }
  if (!isValidPhone(tel))               { showToast('⚠️ Telefone inválido', 'error'); return false; }
  if (!isValidCEP(cep))                 { showToast('⚠️ CEP inválido (use 00000-000)', 'error'); return false; }
  if (!end)                             { showToast('⚠️ Informe o endereço', 'error'); return false; }
  if (!num)                             { showToast('⚠️ Informe o número', 'error'); return false; }
  if (!cidade)                          { showToast('⚠️ Informe a cidade', 'error'); return false; }
  if (!estado || estado.length !== 2)   { showToast('⚠️ Informe o estado (UF)', 'error'); return false; }
  return true;
}

function validateCheckoutStep2() {
  const card  = document.getElementById('checkout-card')?.value.replace(/\s/g,'');
  const valid = document.getElementById('checkout-valid')?.value.trim();
  const cvv   = document.getElementById('checkout-cvv')?.value.trim();
  const nome  = document.getElementById('checkout-nomecartao')?.value.trim();

  // Verifica se selecionou Pix ou Boleto (não precisa validar cartão)
  const selected = document.querySelector('input[name="payment"]:checked');
  const payIdx = selected ? parseInt(selected.value) : 0;
  if (payIdx === 1 || payIdx === 2) return true; // Pix ou Boleto

  if (!card || card.length < 13)          { showToast('⚠️ Número do cartão inválido', 'error'); return false; }
  if (!/^\d{2}\/\d{2}$/.test(valid))     { showToast('⚠️ Validade inválida (MM/AA)', 'error'); return false; }
  if (!cvv || cvv.length < 3)            { showToast('⚠️ CVV inválido', 'error'); return false; }
  if (!nome || nome.length < 3)          { showToast('⚠️ Informe o nome no cartão', 'error'); return false; }
  return true;
}

// Aplica máscaras simples nos inputs do checkout
function applyCheckoutMasks() {
  const cpfEl  = document.getElementById('checkout-cpf');
  const telEl  = document.getElementById('checkout-tel');
  const cepEl  = document.getElementById('checkout-cep');
  const cardEl = document.getElementById('checkout-card');
  const validEl= document.getElementById('checkout-valid');

  if (cpfEl) cpfEl.addEventListener('input', () => {
    let v = cpfEl.value.replace(/\D/g,'').slice(0,11);
    if (v.length > 9) v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/,'$1.$2.$3-$4');
    else if (v.length > 6) v = v.replace(/(\d{3})(\d{3})(\d+)/,'$1.$2.$3');
    else if (v.length > 3) v = v.replace(/(\d{3})(\d+)/,'$1.$2');
    cpfEl.value = v;
  });

  if (telEl) telEl.addEventListener('input', () => {
    let v = telEl.value.replace(/\D/g,'').slice(0,11);
    if (v.length > 10) v = v.replace(/(\d{2})(\d{5})(\d{4})/,'($1) $2-$3');
    else if (v.length > 6) v = v.replace(/(\d{2})(\d{4})(\d+)/,'($1) $2-$3');
    else if (v.length > 2) v = v.replace(/(\d{2})(\d+)/,'($1) $2');
    telEl.value = v;
  });

  if (cepEl) cepEl.addEventListener('input', () => {
    let v = cepEl.value.replace(/\D/g,'').slice(0,8);
    if (v.length > 5) v = v.replace(/(\d{5})(\d+)/,'$1-$2');
    cepEl.value = v;
  });

  if (cardEl) cardEl.addEventListener('input', () => {
    let v = cardEl.value.replace(/\D/g,'').slice(0,16);
    v = v.replace(/(\d{4})(?=\d)/g,'$1 ');
    cardEl.value = v;
  });

  if (validEl) validEl.addEventListener('input', () => {
    let v = validEl.value.replace(/\D/g,'').slice(0,4);
    if (v.length > 2) v = v.replace(/(\d{2})(\d+)/,'$1/$2');
    validEl.value = v;
  });
}
function openCheckout() {
  checkoutStep = 1;
  document.getElementById('checkoutModal').classList.add('open');
  renderCheckoutStep();
}

function closeCheckout() {
  document.getElementById('checkoutModal').classList.remove('open');
  checkoutStep = 1;
}

function closeModal(event) {
  if (event.target === document.getElementById('checkoutModal')) closeCheckout();
}

function renderCheckoutStep() {
  const { subtotalBruto, desconto, subtotal, frete, total } = getCartTotals();
  const container = document.getElementById('checkoutContent');

  if (checkoutStep === 1) {
    container.innerHTML = `
      <div class="checkout-step">
        <div class="checkout-title">IDENTIFICAÇÃO</div>
        <p class="checkout-subtitle">Seus dados de entrega</p>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Nome</label>
            <input type="text" class="form-input" id="checkout-nome" placeholder="Seu nome completo" />
          </div>
          <div class="form-group">
            <label class="form-label">E-mail</label>
            <input type="email" class="form-input" id="checkout-email" placeholder="seu@email.com" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">CPF</label>
            <input type="text" class="form-input" id="checkout-cpf" placeholder="000.000.000-00" maxlength="14" />
          </div>
          <div class="form-group">
            <label class="form-label">Telefone</label>
            <input type="text" class="form-input" id="checkout-tel" placeholder="(00) 00000-0000" />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">CEP</label>
          <input type="text" class="form-input" id="checkout-cep" placeholder="00000-000" maxlength="9" />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Endereço</label>
            <input type="text" class="form-input" id="checkout-end" placeholder="Rua, Av., etc" />
          </div>
          <div class="form-group">
            <label class="form-label">Número</label>
            <input type="text" class="form-input" id="checkout-num" placeholder="Nº" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Cidade</label>
            <input type="text" class="form-input" id="checkout-cidade" placeholder="Sua cidade" />
          </div>
          <div class="form-group">
            <label class="form-label">Estado</label>
            <input type="text" class="form-input" id="checkout-estado" placeholder="UF" maxlength="2" />
          </div>
        </div>
        <button class="btn btn-primary btn-full" style="margin-top:8px" onclick="goToCheckoutStep(2)">
          Continuar para pagamento →
        </button>
      </div>
    `;
    setTimeout(applyCheckoutMasks, 50);
  } else if (checkoutStep === 2) {
    container.innerHTML = `
      <div class="checkout-step">
        <div class="checkout-title">PAGAMENTO</div>
        <p class="checkout-subtitle">Forma de pagamento</p>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:22px">
          ${['💳 Cartão de Crédito','📱 Pix','🏦 Boleto','💳 Débito'].map((m, i) => `
            <label style="cursor:pointer">
              <input type="radio" name="payment" value="${i}" ${i===0?'checked':''} style="display:none" />
              <div class="payment-opt" onclick="selectPayment(this)" style="background:var(--bg-card-2);border:1px solid var(--border);border-radius:var(--radius-md);padding:14px;text-align:center;font-size:14px;font-weight:700;transition:var(--transition);${i===0?'border-color:var(--orange);color:var(--orange)':''}">
                ${m}
              </div>
            </label>
          `).join('')}
        </div>

        <div class="form-group">
          <label class="form-label">Número do Cartão</label>
          <input type="text" class="form-input" id="checkout-card" placeholder="0000 0000 0000 0000" maxlength="19" />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Validade</label>
            <input type="text" class="form-input" id="checkout-valid" placeholder="MM/AA" maxlength="5" />
          </div>
          <div class="form-group">
            <label class="form-label">CVV</label>
            <input type="text" class="form-input" id="checkout-cvv" placeholder="000" maxlength="3" />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Nome no Cartão</label>
          <input type="text" class="form-input" id="checkout-nomecartao" placeholder="Como aparece no cartão" />
        </div>

        <div style="background:var(--bg-card-2);border:1px solid var(--border);border-radius:var(--radius-md);padding:16px;margin:20px 0">
          <div class="summary-row"><span>Subtotal</span><span>R$ ${subtotalBruto.toFixed(2).replace('.', ',')}</span></div>
          ${desconto > 0 ? `<div class="summary-row" style="color:#22C55E"><span>Cupom (${activeCoupon.code})</span><span>- R$ ${desconto.toFixed(2).replace('.', ',')}</span></div>` : ''}
          <div class="summary-row"><span>Frete</span><span style="color:${frete===0?'#22C55E':'inherit'}">${frete===0?'GRÁTIS':'R$ '+frete.toFixed(2).replace('.', ',')}</span></div>
          <div class="summary-row total"><span>Total</span><span>R$ ${total.toFixed(2).replace('.', ',')}</span></div>
        </div>

        <div style="display:flex;gap:12px">
          <button class="btn btn-outline" onclick="goToCheckoutStep(1)">← Voltar</button>
          <button class="btn btn-primary" style="flex:1" onclick="finalizePurchase()">
            🔒 Confirmar Pagamento R$ ${total.toFixed(2).replace('.', ',')}
          </button>
        </div>
      </div>
    `;
    setTimeout(applyCheckoutMasks, 50);
  } else if (checkoutStep === 3) {
    // TODO (back-end): substituir pelo ID real retornado pela API após confirmação do pedido
    const orderNum = 'OV' + Date.now().toString().slice(-6);
    const itemsHtml = cart.map(i => `
      <div class="order-item-mini">
        <span class="order-item-mini-img">${renderProductMedia(i, 'order')}</span>
        <span class="order-item-mini-name">${escapeHtml(i.name)} ${i.size && i.size !== 'N/A' ? `(${escapeHtml(i.size)})` : ''} ×${i.qty}</span>
        <span class="order-item-mini-price">R$ ${(i.price * i.qty).toFixed(2).replace('.', ',')}</span>
      </div>
    `).join('');

    // Limpa o carrinho e o cupom
    cart = [];
    activeCoupon = null;
    saveCart();
    updateCartBadge();

    container.innerHTML = `
      <div class="checkout-step">
        <div class="success-icon">🎉</div>
        <div class="success-title">PEDIDO FEITO!</div>
        <p class="success-subtitle">Seu pedido foi confirmado com sucesso. Prepare-se para receber seus produtos otaku!</p>

        <div class="order-number">
          <span>Número do Pedido</span>
          <strong>#${orderNum}</strong>
        </div>

        <div class="order-items-mini">${itemsHtml}</div>

        <div style="text-align:center;color:var(--text-muted);font-size:14px;margin-bottom:20px">
          📧 Você receberá um e-mail de confirmação em breve<br/>
          🚚 Prazo estimado de entrega: 3 a 7 dias úteis
        </div>

        <button class="btn btn-primary btn-full" onclick="closeCheckout(); showPage('catalog')">
          Continuar Comprando
        </button>
      </div>
    `;
  }
}

function goToCheckoutStep(step) {
  if (step === 2 && !validateCheckoutStep1()) return;
  checkoutStep = step;
  renderCheckoutStep();
  if (step === 1) setTimeout(applyCheckoutMasks, 50);
  if (step === 2) setTimeout(applyCheckoutMasks, 50);
}

function selectPayment(el) {
  document.querySelectorAll('.payment-opt').forEach(e => {
    e.style.borderColor = 'var(--border)';
    e.style.color = 'var(--text-body)';
  });
  el.style.borderColor = 'var(--orange)';
  el.style.color = 'var(--orange)';
}

function finalizePurchase() {
  if (!validateCheckoutStep2()) return;
  /*
   * TODO (back-end): substituir este bloco pelo fetch real à API.
   * Exemplo de payload:
   * const payload = {
   *   items: cart.map(i => ({ product_id: i.id, variant: i.size, qty: i.qty, price: i.price })),
   *   coupon: activeCoupon?.code || null,
   *   totals: getCartTotals(),
   * };
   * const res = await fetch('/api/orders', { method: 'POST', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' } });
   * if (!res.ok) { showToast('❌ Erro ao processar pedido. Tente novamente.', 'error'); return; }
   * const { order_id } = await res.json();
   */
  const btn = document.querySelector('#checkoutContent .btn-primary:last-child');
  if (btn) {
    btn.textContent = '⏳ Processando...';
    btn.disabled = true;
  }
  setTimeout(() => {
    checkoutStep = 3;
    renderCheckoutStep();
  }, 2000);
}

/* ────────────────────────────────────────────
   10. WISHLIST (FAVORITOS)
──────────────────────────────────────────── */
function toggleWishlist(event, id) {
  event.stopPropagation();
  const idx = wishlist.indexOf(id);
  if (idx > -1) {
    wishlist.splice(idx, 1);
    showToast('💔 Removido dos favoritos', '');
  } else {
    wishlist.push(id);
    showToast('❤️ Adicionado aos favoritos!', 'success');
  }
  localStorage.setItem('otakuverse_wishlist', JSON.stringify(wishlist));

  // Atualiza o botão visualmente sem re-renderizar
  const btn = event.currentTarget;
  if (wishlist.includes(id)) {
    btn.textContent = '❤️';
    btn.classList.add('active');
  } else {
    btn.textContent = '🤍';
    btn.classList.remove('active');
  }
}

/* ────────────────────────────────────────────
   11. TOAST NOTIFICATION
──────────────────────────────────────────── */
let toastTimer;
function showToast(message, type = '') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast ${type} show`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.classList.remove('show'); }, 3000);
}

/* ────────────────────────────────────────────
   12. PARTÍCULAS DO HERO
──────────────────────────────────────────── */
function createParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;
  container.innerHTML = '';
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = `${Math.random() * 100}%`;
    p.style.setProperty('--dur',   `${4 + Math.random() * 6}s`);
    p.style.setProperty('--delay', `${Math.random() * 8}s`);
    p.style.width = p.style.height = `${2 + Math.random() * 3}px`;
    // Alterna entre laranja e roxo
    p.style.background = Math.random() > 0.5 ? '#F59E0B' : '#6B42B8';
    container.appendChild(p);
  }
}

/* ────────────────────────────────────────────
   13. NAVBAR SCROLL EFFECT
──────────────────────────────────────────── */
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (window.scrollY > 30) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

/* ────────────────────────────────────────────
   14. INICIALIZAÇÃO
──────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Inicia na home
  showPage('home');
  updateHeroCaptions();
  // Atualiza badge do carrinho com dados salvos
  updateCartBadge();
  // Fecha o menu mobile ao clicar fora
  document.addEventListener('click', (e) => {
    const menu = document.getElementById('navLinks');
    const hamburger = document.getElementById('hamburger');
    if (menu && !menu.contains(e.target) && !hamburger.contains(e.target)) {
      menu.classList.remove('open');
    }
  });
  const DEV = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  if (DEV) {
    console.log('%c⚡ INOVANERD', 'color:#F59E0B;font-size:24px;font-weight:bold;font-family:monospace');
    console.log('%cSeu universo anime começa aqui!', 'color:#4B2E83;font-size:14px');
  }
});

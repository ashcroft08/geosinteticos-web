/**
 * APP.JS - Lógica Principal SPA
 * Portal Geosintéticos
 */

const App = {
    currentPage: 'home',
    currentProduct: null,
    currentProject: null,
    currentFilter: 'Todos',

    // ===== INICIALIZACIÓN =====
    init() {
        this.bindEvents();
        this.handleRoute();
        window.addEventListener('hashchange', () => this.handleRoute());
        console.log('🚀 Portal Geosintéticos iniciado');
    },

    // ===== EVENTOS =====
    bindEvents() {
        // Mobile menu toggle
        document.querySelector('.menu-toggle')?.addEventListener('click', () => this.toggleMobileMenu());
        document.querySelector('.mobile-menu__overlay')?.addEventListener('click', () => this.closeMobileMenu());

        // Cerrar mobile menu al hacer clic en un enlace
        document.querySelectorAll('.mobile-menu__link').forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });

        // Modal de cotización
        document.querySelector('.modal__backdrop')?.addEventListener('click', () => this.closeQuoteModal());
        document.querySelector('.modal__close')?.addEventListener('click', () => this.closeQuoteModal());

        // Formulario de contacto
        document.getElementById('contactForm')?.addEventListener('submit', (e) => this.handleContactSubmit(e));
        document.getElementById('quoteForm')?.addEventListener('submit', (e) => this.handleQuoteSubmit(e));

        // Filtros de productos
        document.querySelectorAll('[data-filter]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                this.filterProducts(filter);
            });
        });
    },

    // ===== ROUTER =====
    handleRoute() {
        const hash = location.hash || '#/';
        const [path, param] = hash.replace('#/', '').split('/').filter(Boolean);

        // Ocultar todas las páginas
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

        // Actualizar navegación
        document.querySelectorAll('.nav__link, .mobile-menu__link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === hash || (hash === '#/' && link.getAttribute('href') === '#/')) {
                link.classList.add('active');
            }
        });

        // Mostrar página correspondiente
        switch (path) {
            case 'productos':
                this.showPage('productos');
                this.renderProducts();
                break;
            case 'producto':
                this.showPage('producto-detalle');
                this.renderProductDetail(param);
                break;
            case 'proyectos':
                this.showPage('proyectos');
                this.renderProjects();
                break;
            case 'proyecto':
                this.showPage('proyecto-detalle');
                this.renderProjectDetail(param);
                break;
            case 'nosotros':
                this.showPage('nosotros');
                break;
            case 'servicios':
                this.showPage('servicios');
                this.renderServices();
                break;
            case 'contacto':
                this.showPage('contacto');
                break;
            default:
                this.showPage('home');
                this.renderHomePage();
        }

        // Scroll al inicio
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    showPage(pageId) {
        const page = document.getElementById(pageId);
        if (page) {
            page.classList.add('active');
            this.currentPage = pageId;
        }
    },

    navigate(hash) {
        location.hash = hash;
    },

    // ===== MOBILE MENU =====
    toggleMobileMenu() {
        document.querySelector('.menu-toggle')?.classList.toggle('active');
        document.querySelector('.mobile-menu')?.classList.toggle('active');
        document.querySelector('.mobile-menu__overlay')?.classList.toggle('active');
        document.body.classList.toggle('modal-open');
    },

    closeMobileMenu() {
        document.querySelector('.menu-toggle')?.classList.remove('active');
        document.querySelector('.mobile-menu')?.classList.remove('active');
        document.querySelector('.mobile-menu__overlay')?.classList.remove('active');
        document.body.classList.remove('modal-open');
    },

    // ===== RENDERIZADO HOME =====
    renderHomePage() {
        // Estadísticas
        const statsContainer = document.getElementById('homeStats');
        if (statsContainer && window.ESTADISTICAS) {
            statsContainer.innerHTML = ESTADISTICAS.map(s => Components.statItem(s)).join('');
        }

        // Proyectos destacados
        const projectsContainer = document.getElementById('featuredProjects');
        if (projectsContainer && window.PROYECTOS) {
            const featured = PROYECTOS.filter(p => p.destacado).slice(0, 3);
            projectsContainer.innerHTML = featured.map(p => Components.projectCard(p)).join('');
        }
    },

    // ===== RENDERIZADO PRODUCTOS =====
    renderProducts(filter = 'Todos') {
        const container = document.getElementById('productsGrid');
        if (!container || !window.PRODUCTOS) return;

        let filtered = PRODUCTOS;
        if (filter !== 'Todos') {
            filtered = PRODUCTOS.filter(p => p.categoria === filter);
        }

        container.innerHTML = filtered.map(p => Components.productCard(p)).join('');

        // Actualizar contador
        const counter = document.getElementById('resultsCount');
        if (counter) {
            counter.textContent = `Mostrando ${filtered.length} de ${PRODUCTOS.length} productos`;
        }
    },

    filterProducts(filter) {
        this.currentFilter = filter;

        // Actualizar botones
        document.querySelectorAll('[data-filter]').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });

        this.renderProducts(filter);
    },

    // ===== RENDERIZADO PRODUCTO DETALLE =====
    renderProductDetail(productId) {
        const product = PRODUCTOS?.find(p => p.id === productId);
        if (!product) {
            this.navigate('#/productos');
            return;
        }

        this.currentProduct = product;
        const container = document.getElementById('productDetailContent');
        if (!container) return;

        const imagenPrincipal = product.imagenes.find(img => img.esPrincipal) || product.imagenes[0];

        container.innerHTML = `
      <div class="product-detail__grid">
        <div class="product-gallery">
          <div class="product-gallery__main">
            <img src="${imagenPrincipal?.url || ''}" alt="${product.nombre}" id="mainProductImage">
          </div>
          <div class="product-gallery__thumbs">
            ${product.imagenes.map((img, i) => `
              <div class="product-gallery__thumb ${i === 0 ? 'active' : ''}" onclick="App.changeProductImage('${img.url}', this)">
                <img src="${img.url}" alt="${img.alt}" loading="lazy">
              </div>
            `).join('')}
          </div>
        </div>
        <div class="product-info">
          <nav class="breadcrumb">
            <span class="breadcrumb__item"><a href="#/">Inicio</a></span>
            <span class="breadcrumb__separator">/</span>
            <span class="breadcrumb__item"><a href="#/productos">Productos</a></span>
            <span class="breadcrumb__separator">/</span>
            <span class="breadcrumb__item">${product.nombre}</span>
          </nav>
          <span class="product-info__category">${product.subcategoria}</span>
          <h1 class="product-info__title">${product.nombre}</h1>
          <p class="product-info__description">${product.descripcionDetallada}</p>
          <div class="product-info__actions">
            <button class="btn btn--primary btn--lg" onclick="App.openQuoteModal('${product.nombre}')">
              ${ICONS.mail} Solicitar Cotización
            </button>
            <button class="btn btn--outline btn--lg" onclick="App.downloadPDF('${product.fichaTecnica?.urlPDF}', '${product.fichaTecnica?.nombreArchivo}')">
              ${ICONS.download} Descargar Ficha
            </button>
          </div>
          <h3>Especificaciones Técnicas</h3>
          ${Components.specsTable(product.especificaciones)}
          <h3>Aplicaciones</h3>
          ${Components.applicationsList(product.aplicaciones)}
        </div>
      </div>
    `;
    },

    changeProductImage(url, thumb) {
        document.getElementById('mainProductImage').src = url;
        document.querySelectorAll('.product-gallery__thumb').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
    },

    // ===== RENDERIZADO PROYECTOS =====
    renderProjects(filter = 'Todos') {
        const container = document.getElementById('projectsGrid');
        if (!container || !window.PROYECTOS) return;

        let filtered = PROYECTOS;
        if (filter !== 'Todos') {
            filtered = PROYECTOS.filter(p => p.tipoDeObra === filter);
        }

        container.innerHTML = filtered.map(p => Components.projectCard(p)).join('');
    },

    // ===== RENDERIZADO PROYECTO DETALLE =====
    renderProjectDetail(projectId) {
        const project = PROYECTOS?.find(p => p.id === projectId);
        if (!project) {
            this.navigate('#/proyectos');
            return;
        }

        this.currentProject = project;
        const container = document.getElementById('projectDetailContent');
        if (!container) return;

        const imagenPrincipal = project.galeria[0];

        container.innerHTML = `
      <div class="container">
        <nav class="breadcrumb">
          <span class="breadcrumb__item"><a href="#/">Inicio</a></span>
          <span class="breadcrumb__separator">/</span>
          <span class="breadcrumb__item"><a href="#/proyectos">Proyectos</a></span>
          <span class="breadcrumb__separator">/</span>
          <span class="breadcrumb__item">${project.titulo}</span>
        </nav>
        
        <div class="product-detail__grid">
          <div class="product-gallery">
            <div class="product-gallery__main">
              <img src="${imagenPrincipal?.url || ''}" alt="${project.titulo}">
            </div>
            <div class="product-gallery__thumbs">
              ${project.galeria.map((img, i) => `
                <div class="product-gallery__thumb ${i === 0 ? 'active' : ''}" onclick="App.changeProjectImage('${img.url}', this)">
                  <img src="${img.url}" alt="${img.descripcion}" loading="lazy">
                </div>
              `).join('')}
            </div>
          </div>
          <div class="product-info">
            <span class="badge badge--accent">${project.tipoDeObra}</span>
            <h1 class="product-info__title">${project.titulo}</h1>
            <p><strong>Ubicación:</strong> ${project.ubicacion.ciudad}, ${project.ubicacion.region}</p>
            <p><strong>Cliente:</strong> ${project.cliente || 'Confidencial'}</p>
            <p><strong>Fecha:</strong> ${project.fecha}</p>
            
            <h3>El Reto</h3>
            <p>${project.reto}</p>
            
            <h3>Nuestra Solución</h3>
            <p>${project.solucion}</p>
            
            <h3>Resultados</h3>
            <div class="stats" style="background: var(--color-gray-50); padding: var(--space-4); border-radius: var(--radius-lg);">
              ${project.metricas.map(m => `
                <div class="stat">
                  <div class="stat__number" style="font-size: var(--text-2xl);">${m.valor}</div>
                  <div class="stat__label">${m.indicador}</div>
                </div>
              `).join('')}
            </div>
            
            <h3 style="margin-top: var(--space-6);">Productos Utilizados</h3>
            <div class="applications-list">
              ${project.productosUtilizados.map(p => `
                <a href="#/producto/${p.idProducto}" class="application-tag">${p.nombreProducto}</a>
              `).join('')}
            </div>
            
            <div style="margin-top: var(--space-8);">
              <button class="btn btn--primary btn--lg" onclick="App.openQuoteModal('Proyecto similar a ${project.titulo}')">
                Consultar Proyecto Similar
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    },

    changeProjectImage(url, thumb) {
        document.querySelector('#proyecto-detalle .product-gallery__main img').src = url;
        document.querySelectorAll('#proyecto-detalle .product-gallery__thumb').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
    },

    // ===== RENDERIZADO SERVICIOS =====
    renderServices() {
        const container = document.getElementById('servicesGrid');
        if (!container || !window.SERVICIOS) return;
        container.innerHTML = SERVICIOS.map(s => Components.serviceCard(s)).join('');
    },

    // ===== MODAL DE COTIZACIÓN =====
    openQuoteModal(productName = '') {
        const modal = document.getElementById('quoteModal');
        const productField = document.getElementById('quoteProduct');
        if (modal) modal.classList.add('active');
        if (productField) productField.value = productName;
        document.body.classList.add('modal-open');
    },

    closeQuoteModal() {
        const modal = document.getElementById('quoteModal');
        if (modal) modal.classList.remove('active');
        document.body.classList.remove('modal-open');
    },

    // ===== FORMULARIOS =====
    handleContactSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);

        // Validación básica
        const requiredFields = ['nombre', 'email', 'telefono', 'tipoProyecto'];
        let valid = true;

        requiredFields.forEach(field => {
            const input = form.querySelector(`[name="${field}"]`);
            if (!input?.value.trim()) {
                input?.classList.add('error');
                valid = false;
            } else {
                input?.classList.remove('error');
            }
        });

        if (!form.querySelector('[name="politica"]')?.checked) {
            Components.toast('Debes aceptar la política de privacidad', 'error');
            return;
        }

        if (!valid) {
            Components.toast('Por favor completa todos los campos requeridos', 'error');
            return;
        }

        // Simular envío
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner"></span> Enviando...';

        setTimeout(() => {
            // Guardar en localStorage (simulación)
            const leads = JSON.parse(localStorage.getItem('leads') || '[]');
            const data = Object.fromEntries(formData.entries());
            data.fecha = new Date().toISOString();
            leads.push(data);
            localStorage.setItem('leads', JSON.stringify(leads));

            Components.toast('¡Mensaje enviado con éxito! Nos comunicaremos pronto.');
            form.reset();
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Enviar Consulta';
        }, 1500);
    },

    handleQuoteSubmit(e) {
        e.preventDefault();
        const form = e.target;

        // Simular envío
        setTimeout(() => {
            Components.toast('¡Solicitud de cotización enviada!');
            this.closeQuoteModal();
            form.reset();
        }, 1000);
    },

    // ===== DESCARGA PDF =====
    downloadPDF(url, filename) {
        if (!url) {
            Components.toast('Ficha técnica no disponible', 'error');
            return;
        }

        Components.toast('Descargando ficha técnica...');

        // Simular descarga (en producción sería un enlace real)
        setTimeout(() => {
            Components.toast(`${filename} descargado correctamente`);
        }, 1500);
    },

    // ===== WHATSAPP =====
    getWhatsAppURL(customMessage = null) {
        const numero = window.CONTACTO?.whatsapp || '51999999999';
        const mensajes = {
            'home': 'Hola, me gustaría recibir más información sobre sus productos.',
            'productos': 'Hola, estoy interesado en sus productos. ¿Podrían enviarme más información?',
            'proyectos': 'Hola, vi su portafolio de proyectos y me gustaría discutir mi proyecto.',
            'contacto': 'Hola, prefiero comunicarme por WhatsApp. ¿Podemos conversar?'
        };

        const mensaje = customMessage || mensajes[this.currentPage] || mensajes.home;
        return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
    }
};

// ===== INICIALIZAR AL CARGAR =====
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Exponer globalmente
window.App = App;

/* ==========================================================================
   THE SEOULFUL - INTERACTIVE SCRIPT
   Core UX, filtering, drawer panels, modal hub, and scroll reveals
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------------------------
     1. Navigation Scroll Effect & Mobile Hamburger
     -------------------------------------------------------------------------- */
  const header = document.getElementById('header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Change header styling on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Toggle mobile menu
  mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close mobile menu when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileToggle.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  /* --------------------------------------------------------------------------
     2. Category Filtering Engine
     -------------------------------------------------------------------------- */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const categorySections = document.querySelectorAll('.category-section');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Remove active class from all buttons
      filterButtons.forEach(b => b.classList.remove('active'));
      // Add active to clicked button
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      categorySections.forEach(section => {
        const cat = section.getAttribute('data-category');
        
        if (filterValue === 'all') {
          section.classList.remove('hidden');
          // Add quick fade in
          section.style.opacity = '0';
          setTimeout(() => { section.style.opacity = '1'; }, 50);
        } else if (cat === filterValue) {
          section.classList.remove('hidden');
          section.style.opacity = '0';
          setTimeout(() => { section.style.opacity = '1'; }, 50);
        } else {
          section.classList.add('hidden');
        }
      });
    });
  });

  /* --------------------------------------------------------------------------
     3. Scroll Reveal Animations (Intersection Observer)
     -------------------------------------------------------------------------- */
  const reveals = document.querySelectorAll('.reveal');
  
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target); // Trigger only once
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(element => {
      revealObserver.observe(element);
    });
  } else {
    // Fallback if IntersectionObserver is not supported
    reveals.forEach(el => el.classList.add('active'));
  }

  /* --------------------------------------------------------------------------
     4. Side Spotlight Drawer (Product Detail panel)
     -------------------------------------------------------------------------- */
  const productCards = document.querySelectorAll('.product-card');
  const productDrawer = document.getElementById('product-drawer');
  const drawerBackdrop = document.getElementById('drawer-backdrop');
  const drawerClose = document.getElementById('drawer-close');
  
  // Drawer Inner Elements
  const dImg = document.getElementById('drawer-product-img');
  const dTitle = document.getElementById('drawer-product-title');
  const dDesc = document.getElementById('drawer-product-desc');
  const dIngredients = document.getElementById('drawer-product-ingredients');
  const dTags = document.getElementById('drawer-product-tags');

  // Open product drawer
  productCards.forEach(card => {
    card.addEventListener('click', () => {
      const titleText = card.querySelector('.product-title').textContent;
      const descText = card.getAttribute('data-desc') || card.querySelector('.product-desc').textContent;
      const tagsString = card.getAttribute('data-tags') || '';
      const ingredientsString = card.getAttribute('data-ingredients') || '';
      const imgSrc = card.getAttribute('data-img') || card.querySelector('img').getAttribute('src');

      // Populate Spotlight drawer details
      dImg.setAttribute('src', imgSrc);
      dImg.setAttribute('alt', titleText);
      dTitle.textContent = titleText;
      dDesc.textContent = descText;

      // Populate tags
      dTags.innerHTML = '';
      if (tagsString) {
        tagsString.split(',').forEach(tag => {
          const span = document.createElement('span');
          span.className = 'drawer-tag tag-default';
          span.textContent = tag.trim();
          dTags.appendChild(span);
        });
      }

      // Populate ingredients list
      dIngredients.innerHTML = '';
      if (ingredientsString) {
        ingredientsString.split(',').forEach(ing => {
          const li = document.createElement('li');
          li.className = 'drawer-list-item';
          li.textContent = ing.trim();
          dIngredients.appendChild(li);
        });
      } else {
        const li = document.createElement('li');
        li.className = 'drawer-list-item';
        li.textContent = "Baked fresh daily in small batches with artisanal flour, butter, and love.";
        dIngredients.appendChild(li);
      }

      // Show drawer
      productDrawer.classList.add('active');
      drawerBackdrop.classList.add('active');
      document.body.style.overflow = 'hidden'; // Lock background scrolling
    });
  });

  // Close drawer helper
  const closeDrawer = () => {
    productDrawer.classList.remove('active');
    drawerBackdrop.classList.remove('active');
    document.body.style.overflow = ''; // Release scroll lock
  };

  drawerClose.addEventListener('click', closeDrawer);
  drawerBackdrop.addEventListener('click', closeDrawer);

  /* --------------------------------------------------------------------------
     5. Online Ordering Integration Hub Modal
     -------------------------------------------------------------------------- */
  const orderModal = document.getElementById('order-modal');
  const orderBackdrop = document.getElementById('order-backdrop');
  const orderClose = document.getElementById('order-modal-close');
  const openOrderButtons = document.querySelectorAll('.open-order-btn');

  const openOrderHub = (e) => {
    // Prevent default anchor jumping or click triggers
    if (e) e.preventDefault();
    
    // Close product drawer if open
    closeDrawer();

    // Open ordering modal
    orderModal.classList.add('active');
    orderBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeOrderHub = () => {
    orderModal.classList.remove('active');
    orderBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  };

  openOrderButtons.forEach(btn => {
    btn.addEventListener('click', openOrderHub);
  });

  orderClose.addEventListener('click', closeOrderHub);
  orderBackdrop.addEventListener('click', closeOrderHub);

  /* --------------------------------------------------------------------------
     6. Instagram Lightbox & Liking Simulator
     -------------------------------------------------------------------------- */
  const instaItems = document.querySelectorAll('.insta-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');

  // Open lightbox
  instaItems.forEach(item => {
    item.addEventListener('click', (e) => {
      // If clicking directly on hearts/comments stats, we trigger a like animation
      if (e.target.classList.contains('likes-count') || e.target.textContent.includes('❤️')) {
        return; 
      }
      
      const imgSrc = item.getAttribute('data-img') || item.querySelector('img').getAttribute('src');
      lightboxImg.setAttribute('src', imgSrc);
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  // Close lightbox
  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Easter Egg: Liking Simulator
  // Double-clicking an Instagram post gives it an animated heart boost!
  instaItems.forEach(item => {
    const likesCountEl = item.querySelector('.likes-count');
    let liked = false;

    item.addEventListener('dblclick', () => {
      if (!liked && likesCountEl) {
        let currentLikes = parseInt(likesCountEl.textContent);
        likesCountEl.textContent = currentLikes + 1;
        
        // Show floating heart effect
        const heart = document.createElement('span');
        heart.innerHTML = '❤️';
        heart.style.position = 'absolute';
        heart.style.left = '50%';
        heart.style.top = '50%';
        heart.style.transform = 'translate(-50%, -50%) scale(0)';
        heart.style.fontSize = '48px';
        heart.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '10';
        
        item.appendChild(heart);
        
        // Animate heart
        setTimeout(() => {
          heart.style.transform = 'translate(-50%, -50%) scale(1.5)';
        }, 10);
        
        setTimeout(() => {
          heart.style.transform = 'translate(-50%, -50%) scale(0)';
          heart.style.opacity = '0';
        }, 600);
        
        setTimeout(() => {
          heart.remove();
        }, 1200);
        
        liked = true;
      }
    });

    // Liking on single click of stats too
    const heartsIcon = item.querySelector('.insta-stat');
    if (heartsIcon) {
      heartsIcon.addEventListener('click', (e) => {
        e.stopPropagation(); // Avoid triggering lightbox
        if (!liked && likesCountEl) {
          let currentLikes = parseInt(likesCountEl.textContent);
          likesCountEl.textContent = currentLikes + 1;
          liked = true;
        }
      });
    }
  });

  /* --------------------------------------------------------------------------
     7. Active Nav Highlighting on Scroll
     -------------------------------------------------------------------------- */
  const sections = document.querySelectorAll('section');
  
  window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(sec => {
      const secTop = sec.offsetTop;
      const secHeight = sec.clientHeight;
      if (window.pageYOffset >= (secTop - varHeaderHeight() - 100)) {
        current = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === '#' && current === 'home') {
        link.classList.add('active');
      } else if (href === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // Calculate dynamic header height
  function varHeaderHeight() {
    return header.clientHeight;
  }
});

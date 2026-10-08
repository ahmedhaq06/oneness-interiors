/**
 * ONENESS INTERIORS — Minimal Architectural Studio Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initPortfolioGrid();
  initLightbox();
  initConsultationForm();
  initDynamicYear();
});

/* --------------------------------------------------------------------------
   Mobile Navigation Toggle
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobileToggle');
  const mainNav = document.getElementById('mainNav');
  const navLinks = mainNav ? mainNav.querySelectorAll('.nav-link, .btn') : [];

  if (!toggleBtn || !mainNav) return;

  const closeMenu = () => {
    mainNav.classList.remove('is-open');
    toggleBtn.classList.remove('is-active');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  const openMenu = () => {
    mainNav.classList.add('is-open');
    toggleBtn.classList.add('is-active');
    toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  toggleBtn.addEventListener('click', () => {
    const isOpen = mainNav.classList.contains('is-open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!mainNav.contains(e.target) && !toggleBtn.contains(e.target) && mainNav.classList.contains('is-open')) {
      closeMenu();
    }
  });
}

/* --------------------------------------------------------------------------
   Portfolio Category Filtering & Expand/Collapse Toggle
   -------------------------------------------------------------------------- */
function initPortfolioGrid() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const expandBtn = document.getElementById('expandPortfolioBtn');
  const expandText = expandBtn ? expandBtn.querySelector('.expand-btn-text') : null;
  const portfolioSection = document.getElementById('portfolio');

  if (!projectCards.length) return;

  let isExpanded = false;
  let currentFilter = 'all';
  const COLLAPSED_LIMIT = 2;

  function updateGrid() {
    const matchingCards = [];
    projectCards.forEach(card => {
      const category = card.getAttribute('data-category');
      let matches = false;

      if (currentFilter === 'all') {
        matches = true;
      } else {
        matches = (category === currentFilter);
      }

      if (matches) {
        matchingCards.push(card);
      } else {
        card.classList.add('is-hidden');
      }
    });

    if (isExpanded) {
      matchingCards.forEach(card => card.classList.remove('is-hidden'));
      if (expandBtn && expandText) {
        expandBtn.style.display = matchingCards.length > COLLAPSED_LIMIT ? 'inline-flex' : 'none';
        expandBtn.setAttribute('aria-expanded', 'true');
        expandText.textContent = 'Show Less';
      }
    } else {
      matchingCards.forEach((card, index) => {
        if (index < COLLAPSED_LIMIT) {
          card.classList.remove('is-hidden');
        } else {
          card.classList.add('is-hidden');
        }
      });
      if (expandBtn && expandText) {
        expandBtn.style.display = matchingCards.length > COLLAPSED_LIMIT ? 'inline-flex' : 'none';
        expandBtn.setAttribute('aria-expanded', 'false');
        expandText.textContent = `View All Projects (${matchingCards.length})`;
      }
    }
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      currentFilter = btn.getAttribute('data-filter') || 'all';
      updateGrid();
    });
  });

  if (expandBtn) {
    expandBtn.addEventListener('click', () => {
      isExpanded = !isExpanded;
      updateGrid();

      if (!isExpanded && portfolioSection) {
        portfolioSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // Initial render: show only 2 projects
  updateGrid();
}

/* --------------------------------------------------------------------------
   Image Lightbox Modal
   -------------------------------------------------------------------------- */
function initLightbox() {
  const modal = document.getElementById('lightboxModal');
  const backdrop = document.getElementById('lightboxBackdrop');
  const closeBtn = document.getElementById('lightboxClose');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const triggers = document.querySelectorAll('.lightbox-trigger');

  if (!modal || !lightboxImg) return;

  const openModal = (imgSrc, title, desc) => {
    lightboxImg.src = imgSrc;
    lightboxImg.alt = title || 'Oneness Interiors Project';
    if (lightboxTitle) lightboxTitle.textContent = title || '';
    if (lightboxDesc) lightboxDesc.textContent = desc || '';

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    lightboxImg.src = '';
    document.body.style.overflow = '';
  };

  triggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const imgSrc = trigger.getAttribute('data-img');
      const title = trigger.getAttribute('data-title');
      const desc = trigger.getAttribute('data-desc');
      if (imgSrc) {
        openModal(imgSrc, title, desc);
      }
    });
  });

  // Allow clicking/tapping the project media image directly
  const projectMedias = document.querySelectorAll('.project-media');
  projectMedias.forEach(media => {
    media.addEventListener('click', (e) => {
      // Avoid double trigger if clicking the button itself
      if (e.target.closest('.lightbox-trigger')) return;
      const trigger = media.querySelector('.lightbox-trigger');
      if (trigger) {
        const imgSrc = trigger.getAttribute('data-img');
        const title = trigger.getAttribute('data-title');
        const desc = trigger.getAttribute('data-desc');
        if (imgSrc) {
          openModal(imgSrc, title, desc);
        }
      }
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* --------------------------------------------------------------------------
   Consultation Form Handler
   -------------------------------------------------------------------------- */
function initConsultationForm() {
  const form = document.getElementById('inquiryForm');
  const toast = document.getElementById('formSuccessToast');
  const submitBtn = document.getElementById('submitBtn');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.clientName.value.trim();
    const phone = form.clientPhone.value.trim();
    const projectType = form.projectType.value;

    if (!name || !phone || !projectType) {
      alert('Please fill out all required fields marked with *');
      return;
    }

    // Visual feedback
    if (submitBtn) {
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Sending Request...</span>`;

      setTimeout(() => {
        form.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;

        if (toast) {
          toast.classList.remove('hidden');
          toast.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          setTimeout(() => {
            toast.classList.add('hidden');
          }, 6000);
        }
      }, 700);
    }
  });
}

/* --------------------------------------------------------------------------
   Dynamic Year
   -------------------------------------------------------------------------- */
function initDynamicYear() {
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

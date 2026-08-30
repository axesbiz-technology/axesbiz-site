/* ==========================================================================
   AxesBiz — Shared Script
   Handles: navbar (sticky shadow + mobile menu), scroll-reveal animations,
   FAQ accordion, feature category tabs, active nav link highlighting.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Navbar: shadow on scroll ---------- */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const toggleNavShadow = () => {
      if (window.scrollY > 8) navbar.classList.add('scrolled');
      else navbar.classList.remove('scrolled');
    };
    toggleNavShadow();
    window.addEventListener('scroll', toggleNavShadow, { passive: true });
  }

  /* ---------- Mobile hamburger menu ---------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });
    // Close menu when a link is tapped (mobile UX)
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- Active nav link based on current page ---------- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a[data-page]').forEach(link => {
    if (link.getAttribute('data-page') === currentPage) {
      link.classList.add('active');
    }
  });

  /* ---------- Scroll-triggered reveal animations ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(el => observer.observe(el));
  } else {
    // Fallback: just show everything
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ---------- FAQ Accordion (pricing.html) ---------- */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close all others for a clean single-open accordion
      faqItems.forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ---------- Feature category tabs (features.html) ---------- */
  const tabButtons = document.querySelectorAll('.feature-tabs button');
  if (tabButtons.length) {
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          const offset = 130;
          const top = targetEl.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });

    // Highlight active tab on scroll
    const categoryBlocks = document.querySelectorAll('.category-block');
    if ('IntersectionObserver' in window && categoryBlocks.length) {
      const tabObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            tabButtons.forEach(b => b.classList.remove('active'));
            const activeBtn = document.querySelector(`.feature-tabs button[data-target="${entry.target.id}"]`);
            if (activeBtn) activeBtn.classList.add('active');
          }
        });
      }, { threshold: 0.35, rootMargin: '-140px 0px -50% 0px' });
      categoryBlocks.forEach(block => tabObserver.observe(block));
    }
  }

});

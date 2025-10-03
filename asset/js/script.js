document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".nav-list a, .accordion-body a");
  const subnavParents = document.querySelectorAll(".has-children");
  const docSections = document.querySelectorAll(".doc-section");
  let isManualScroll = false; // flag to ignore observer during manual scroll

  function scrollToSection(section) {
    const header = document.querySelector('.header-bg');
    const headerHeight = header ? header.offsetHeight : 0;

    // calculate the top position accounting for sticky header
    const sectionTop = section.getBoundingClientRect().top + window.pageYOffset - headerHeight;

    isManualScroll = true; // disable observer effects
    window.scrollTo({ top: sectionTop, behavior: 'smooth' });

    // Re-enable observer after the scroll finishes (~500ms)
    setTimeout(() => {
      isManualScroll = false;
    }, 500);
  }

  // Main links (expand/collapse accordion + scroll)
  subnavParents.forEach(parent => {
    const link = parent.querySelector('a');
    link.addEventListener('click', e => {
      e.preventDefault();

      // Toggle current parent
      parent.classList.toggle('expanded');

      // Close other parents
      subnavParents.forEach(p => {
        if (p !== parent) p.classList.remove('expanded');
      });

      // Scroll to section
      const target = document.querySelector(link.getAttribute('href'));
      if (target) scrollToSection(target);
    });
  });

  // Sub-links (scroll only)
  document.querySelectorAll('.accordion-body a').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) scrollToSection(target);
    });
  });

  // Sidebar animation
  const sidebarObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        sidebarObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.accordion-item').forEach(item => sidebarObserver.observe(item));

  // Section highlighting
  const sectionObserver = new IntersectionObserver(entries => {
    if (isManualScroll) return; // ignore while manual scroll
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');

        // Highlight nav links
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });

        // Expand parent if needed
        const parent = document.querySelector(`.has-children a[href="#${id}"]`)?.closest('.has-children');
        subnavParents.forEach(p => p.classList.remove('expanded'));
        if (parent) parent.classList.add('expanded');
      }
    });
  }, { rootMargin: '0px', threshold: 0.1 });

  docSections.forEach(sec => sectionObserver.observe(sec));

  // Accordion buttons active state
  const accordionButtons = document.querySelectorAll('.accordion-button');
  accordionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      accordionButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
});

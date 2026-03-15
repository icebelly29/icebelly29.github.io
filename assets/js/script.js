'use strict';

// Elements
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");
const navLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// Sidebar Toggle (Mobile)
if(sidebarBtn) {
  sidebarBtn.addEventListener("click", function () {
    sidebar.classList.toggle("active");
    const sidebarMoreInfo = document.querySelector('.sidebar-info_more');
    if(sidebarMoreInfo) {
      sidebarMoreInfo.classList.toggle("active");
    }
  });
}

// Navigation & Tab Switching
for (let i = 0; i < navLinks.length; i++) {
  navLinks[i].addEventListener("click", function () {
    let lowerNavText = this.innerHTML.toLowerCase();
    
    for (let j = 0; j < pages.length; j++) {
      if (lowerNavText === pages[j].dataset.page) {
        pages[j].classList.add("active");
        navLinks[i].classList.add("active");
        window.scrollTo(0, 0); // scroll to top on tab change
      } else {
        pages[j].classList.remove("active");
        // find nav link matching this page and remove active
        navLinks.forEach(link => {
          if(link.innerHTML.toLowerCase() === pages[j].dataset.page) {
            link.classList.remove("active");
          }
        });
      }
    }
    
    // reset intersection observer on new tab content
    setTimeout(initScrollReveal, 50);
  });
}

// Project Filtering
const filterBtns = document.querySelectorAll("[data-filter-btn]");
const filterItems = document.querySelectorAll("[data-filter-item]");

for (let i = 0; i < filterBtns.length; i++) {
  filterBtns[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();

    // Set active button
    filterBtns.forEach(btn => btn.classList.remove("active"));
    this.classList.add("active");

    // Filter items
    for (let j = 0; j < filterItems.length; j++) {
      if (selectedValue === "all" || selectedValue === filterItems[j].dataset.category) {
        filterItems[j].classList.add("active");
      } else {
        filterItems[j].classList.remove("active");
      }
    }
  });
}

// Form Validation
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

if(document.body.contains(form)) {
  for (let i = 0; i < formInputs.length; i++) {
    formInputs[i].addEventListener("input", function () {
      if (form.checkValidity()) {
        formBtn.removeAttribute("disabled");
      } else {
        formBtn.setAttribute("disabled", "");
      }
    });
  }
}

// Scroll Reveal via Intersection Observer
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.scroll-reveal');
  
  const revealCallback = function (entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  };

  const revealOptions = {
    root: null,
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  };

  const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

  revealElements.forEach(el => {
    // remove first to allow re-triggering if needed
    el.classList.remove('visible');
    revealObserver.observe(el);
  });
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
});
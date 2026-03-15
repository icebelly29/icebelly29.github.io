'use strict';

// Elements
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");
const navLinks = document.querySelectorAll("[data-nav-link]");
const sections = document.querySelectorAll(".section-block");

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

// Scroll Spy for Navbar
const observerOptions = {
  root: null,
  rootMargin: "-20% 0px -70% 0px", // Adjust these to trigger earlier/later
  threshold: 0
};

const observerCallback = (entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Find corresponding nav link
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('active');
        }
      });
    }
  });
};

const scrollSpyObserver = new IntersectionObserver(observerCallback, observerOptions);
sections.forEach(section => scrollSpyObserver.observe(section));

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

// Scroll Reveal Arrays
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
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
});
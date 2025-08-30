document.addEventListener("DOMContentLoaded", () => {
  // Fade-in on load
  const transitionEl = document.querySelector(".page-transition");
  if (transitionEl) {
    transitionEl.classList.add("fade-in");
  }

  // Handle internal links only (skip sidebar + no-transition links)
  document.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", e => {
      if (
        link.hostname === window.location.hostname &&
        !link.classList.contains("no-transition") &&
        !link.closest(".sidebar") // ignore sidebar links
      ) {
        e.preventDefault();
        if (transitionEl) {
          transitionEl.classList.remove("fade-in");
          setTimeout(() => {
            window.location.href = link.href;
          }, 500); // match CSS transition duration
        } else {
          window.location.href = link.href;
        }
      }
    });
  });
});

// ===== Slider =====
const slider = document.getElementById("cardSlider");
const cards = document.querySelectorAll(".card");
let currentIndex = 0;

const dotLeft = document.getElementById("dotLeft");
const dotCenter = document.getElementById("dotCenter");
const dotRight = document.getElementById("dotRight");
const dots = document.querySelectorAll(".dot");

function getCardWidth() {
  const style = getComputedStyle(cards[0]);
  const gap = parseInt(getComputedStyle(slider).gap) || 20;
  return cards[0].offsetWidth + gap;
}

let cardWidth = getCardWidth();


function updateSlider() {
  slider.style.transform = `translateX(-${cardWidth * currentIndex}px)`;
}

function setActiveDot(dot) {
  dots.forEach(d => d.classList.remove("active"));
  dot.classList.add("active");
}

dotLeft?.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex--;
    updateSlider();
  }
  setActiveDot(dotLeft);
});

dotRight?.addEventListener("click", () => {
  if (currentIndex < cards.length - 1) {
    currentIndex++;
    updateSlider();
  }
  setActiveDot(dotRight);
});

dotCenter?.addEventListener("click", () => {
  if (dotCenter.classList.contains("active")) return;
  if (currentIndex < cards.length - 1) {
    currentIndex++;
  } else if (currentIndex > 0) {
    currentIndex--;
  }
  updateSlider();
  setActiveDot(dotCenter);
});

// ===== Ring animation =====
const ring = document.querySelector(".dot-ring");

function moveRing(dot) {
  const dotRect = dot.getBoundingClientRect();
  const parentRect = dot.parentElement.getBoundingClientRect();
  const offsetLeft = dotRect.left - parentRect.left + dotRect.width / 2;

  if (!ring.classList.contains("active")) {
    ring.style.transition = "none";
    ring.style.left = `${offsetLeft}px`;
    ring.offsetHeight; // reflow
    ring.classList.add("active");
    ring.style.transition = "all 0.4s ease-in-out";
  } else {
    ring.style.left = `${offsetLeft}px`;
  }
}

dots.forEach(dot => {
  dot.addEventListener("click", () => {
    moveRing(dot);
  });
});

// ===== Resize fix =====
function updateCardWidth() {
  if (window.innerWidth <= 768) {
    const gap = parseInt(getComputedStyle(slider).gap) || 20;
    cardWidth = cards[0].offsetWidth + gap;
  } else {
    const style = getComputedStyle(cards[0]);
    const marginLeft = parseInt(style.marginLeft);
    const marginRight = parseInt(style.marginRight);
    cardWidth = cards[0].offsetWidth + marginLeft + marginRight;
  }
}


window.addEventListener("resize", updateCardWidth);
window.addEventListener("load", updateCardWidth);

// ===== Offcanvas sidebar close on mobile =====
document.addEventListener("DOMContentLoaded", function() {
  const offcanvasElement = document.getElementById("sidebarOffcanvas");
  if (offcanvasElement) {
    const navLinks = offcanvasElement.querySelectorAll(".nav-link");
    navLinks.forEach(link => {
      link.addEventListener("click", function() {
        if (window.innerWidth < 992) {
          const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement);
          if (offcanvas) {
            offcanvas.hide();
          }
        }
      });
    });
  }
});

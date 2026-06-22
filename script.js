const navLinks = document.querySelectorAll(".nav-menu .nav-link");
const menuOpenButton = document.getElementById("menu-open-button");
const menuCloseButton = document.getElementById("menu-close-button");

menuOpenButton.addEventListener("click", () => {
    // Toggle mobile menu visibility
    document.body.classList.toggle("show-mobile-menu");
});

// Close menu when the close button is clicked
menuCloseButton.addEventListener("click", () => {
    menuOpenButton.click();
});

// Close menu when the nav link is clicked
navLinks.forEach(link => {
  link.addEventListener("click", () => menuOpenButton.click());
});

// Initialize Swiper
const swiper = new Swiper('.slider-wrapper', {
  loop: true,
  grabCursor: true,
  spaceBetween: 25,

  // If we need pagination
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
    dynamicBullets: true,
  },

  // Navigation arrows
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },

  // Responsive breakpoints
  breakpoints: {
    0: {
        slidesPerView: 1
    },
    768: {
        slidesPerView: 2
    },
    1024: {
        slidesPerView: 3
    },
  }
});

// Three.js
import * as THREE from 'three';

const heroCanvas = document.querySelector(".hero-canvas");

const heroScene = new THREE.Scene();
const heroCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const heroRenderer = new THREE.WebGLRenderer({
    alpha: true,
    canvas: heroCanvas,
    antialias: true
});
heroRenderer.setAnimationLoop( animate );
heroRenderer.outputColorSpace

const geometry = new THREE.BoxGeometry(1,1,1);
const material = new THREE.MeshBasicMaterial({ color: 0x008800, wireframe: true });
const cube = new THREE.Mesh(geometry, material);
heroScene.add(cube);

heroCamera.position.z = 5;

function animate( time ) {
  cube.rotation.x = time / 2000;
  cube.rotation.y = time / 1000;

  heroRenderer.render(heroScene, heroCamera)
}
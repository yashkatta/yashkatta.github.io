// Three.js
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


const navLinks = document.querySelectorAll(".nav-menu .nav-link")
const menuOpenButton = document.querySelector("#menu-open-button")
const menuCloseButton = document.querySelector("#menu-close-button")
const canvas = document.querySelector(".hero-canvas");


menuOpenButton.addEventListener("click", () => {
	// Toggle mobile menu visibility
	document.body.classList.toggle("show-mobile-menu");
})

// Close menu when the close button is clicked
menuCloseButton.addEventListener("click", () => {
	menuOpenButton.click();
})

// Close menu when the nav link is clicked
navLinks.forEach(link => {
	link.addEventListener("click", () => menuOpenButton.click());
})

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
		}
	}
});

// 3D Rendering
window.addEventListener("load", function () {
	initThreejs();
});

var renderer, scene, camera, constrols, cube;
var canvasWidthRatio = window.getComputedStyle(document.documentElement).getPropertyValue("--site-max-width");

async function initThreejs() {
	canvas.width = 500; canvas.height = 309;
	canvasWidthRatio = 500 / parseInt(canvasWidthRatio.slice(0, -2), 10);
	// Select the existing canvas element
	console.log(canvas.width, canvas.height);

	renderer = new THREE.WebGLRenderer({ alpha: true, canvas: canvas, antialias: true });
	renderer.setSize(canvas.width, canvas.height);
	renderer.setClearColor(0x000000, 0);
	renderer.setAnimationLoop(animate);

	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 0.1, 100);

	const gltfLoader = new GLTFLoader().setPath('images/');

	const geometry = new THREE.BoxGeometry(1, 1, 1);
	const material = new THREE.MeshBasicMaterial({ color: 0xfffafa, wireframe: true });
	cube = new THREE.Mesh(geometry, material);

	scene.add(cube);

	camera.position.z = 2.3;

	window.addEventListener('resize', onWindowResize);

	onWindowResize(); // Once to set hero-section

	console.log("load all.");
}

function animate() {
	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;

	renderer.render(scene, camera);
}

function onWindowResize() {
	if (canvas.width !== canvas.parentElement.clientWidth ||
		canvas.height !== canvas.parentElement.clientHeight &&
		canvas.parentElement.clientHeight < 450) {
		let width = window.innerWidth * canvasWidthRatio;
		width = width < 270 ? 270 : width;
		canvas.width = width >= 270 && width < 500 ? width : 500;
		canvas.height = 0.61803398875 * canvas.width;

		renderer.setSize(canvas.width, canvas.height);
	}
	// console.log(canvas.clientWidth, canvas.clientHeight);
}
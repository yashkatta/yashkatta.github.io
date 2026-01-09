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
//  Globals
var renderer, camera, controls;
var scene, cube, hero;

const siteMaxWidthValue = window.getComputedStyle(document.documentElement).getPropertyValue("--site-max-width");
const whiteColorValue = window.getComputedStyle(document.documentElement).getPropertyValue("--white-color");
const darkColorValue = window.getComputedStyle(document.documentElement).getPropertyValue("--dark-color");

const canvasWidthRatio = 500 / parseInt(siteMaxWidthValue.slice(0, -2), 10);
const whiteColor = parseInt(whiteColorValue.slice(1), 16);
const darkColor = parseInt(darkColorValue.slice(1), 16);

//  Initializations
canvas.width = 500; canvas.height = 309;

window.addEventListener("load", function () {
	initThreejs();
});

async function initThreejs() {
	// WebGLRenderer
	renderer = new THREE.WebGLRenderer({ alpha: true, canvas: canvas, antialias: true });
	renderer.setSize(canvas.width, canvas.height);
	renderer.setClearColor(0, 0);
	// renderer.setAnimationLoop(animate);

	// Set Camera
	camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 0.1, 1000);
	camera.position.set(20, 10, 20);

	// Set OrbitControls
	controls = new OrbitControls(camera, renderer.domElement);
	controls.target.set(0, 0, 0);
	controls.minDistance = 23;
	controls.maxDistance = 90;
	// controls.autoRotate = true;
	// controls.autoRotateSpeed = 8;
	// controls.enableDamping = true;
	controls.addEventListener('change', render);
	controls.update();

	// Scene
	scene = new THREE.Scene();

	// glTF loader
	const gltfLoader = new GLTFLoader().setPath('res/models/');
	[hero] = await Promise.all([gltfLoader.loadAsync('LQFP-128.gltf'),]);
	hero.scene.rotation.x = THREE.MathUtils.degToRad(90);
	hero.scene.scale.set(800, 800, 800);
	hero.scene.traverse(function (o) { if (o.material) { o.material.metalness = 0.1; } });
	scene.add(hero.scene);

	// Lights
	const ambientLight = new THREE.AmbientLight(whiteColor, 1.5);
	scene.add(ambientLight);

	const directionalLight = new THREE.DirectionalLight(whiteColor, 10.0);
	directionalLight.position.set(40, 60, -40);
	directionalLight.target.position.set(0, 0, 0);
	scene.add(directionalLight);

	const hemiLight = new THREE.HemisphereLight(whiteColor, darkColor, 8.0);
	scene.add(hemiLight);

	// WindowResize
	window.addEventListener('resize', onWindowResize);
	onWindowResize();

	render();

	console.log("load all.");
}

function render() {
	renderer.render(scene, camera);
}

function animate() {
	controls.update();
	render();
}

function onWindowResize() {
	if (canvas.width !== canvas.parentElement.clientWidth ||
		canvas.height !== canvas.parentElement.clientHeight &&
		canvas.parentElement.clientHeight < 450) {
		let width = window.innerWidth * canvasWidthRatio;
		width = width < 270 ? 270 : width;
		canvas.width = width >= 270 && width < 500 ? width : 500;
		canvas.height = 0.61803398875 * canvas.width; // Golden Ratio

		renderer.setSize(canvas.width, canvas.height);
		controls.update();
		render();
	}
}
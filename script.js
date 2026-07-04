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
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const heroImage = document.querySelector(".hero-image");
const heroCanvas = document.querySelector(".hero-canvas");
heroCanvas.style.display = "none"
const heroRenderer = new THREE.WebGLRenderer({ alpha: true, canvas: heroCanvas, antialias: true });
// heroRenderer.setSize(500, 293)

const heroCamera = new THREE.PerspectiveCamera(45, 2, 0.1, 100);
heroCamera.position.set(0, 10, 20);

const heroControls = new OrbitControls( heroCamera, heroCanvas );
heroControls.target.set(0, 5, 0);
heroControls.update();

const heroScene = new THREE.Scene();

{
  const light = new THREE.AmbientLight(0xFFFFFF, 0.5);
  heroScene.add(light);
}

{
  const skyColor = 0xB1E1FF; // light blue
  const groundColor = 0xB97A20; // brownish orange
  const intensity = 2;
  const light = new THREE.HemisphereLight( skyColor, groundColor, intensity );
  heroScene.add(light);
}

{
  const color = 0xFFFFFF;
  const intensity = 2.5;
  const light = new THREE.DirectionalLight( color, intensity );
  light.position.set( 6, 3, 1 );
  heroScene.add(light);
  heroScene.add(light.target);
}

function frameArea( sizeToFitOnScreen, boxSize, boxCenter, camera ) {

  const halfSizeToFitOnScreen = sizeToFitOnScreen * 0.5;
  const halfFovY = THREE.MathUtils.degToRad( camera.fov * .5 );
  const distance = halfSizeToFitOnScreen / Math.tan( halfFovY );
  // compute a unit vector that points in the direction the camera is now
  // in the xz plane from the center of the box
  const direction = ( new THREE.Vector3() )
    .subVectors( camera.position, boxCenter )
    .multiply( new THREE.Vector3( 1, 0, 1 ) )
    .normalize();

  // move the camera to a position distance units way from the center
  // in whatever direction the camera was from the center already
  camera.position.copy( direction.multiplyScalar( distance ).add( boxCenter ) );

  // pick some near and far values for the frustum that
  // will contain the box.
  camera.near = boxSize / 100;
  camera.far = boxSize * 100;

  camera.updateProjectionMatrix();

  // point the camera to look at the center of the box
  camera.lookAt( boxCenter.x, boxCenter.y, boxCenter.z );
}

{

  const gltfLoader = new GLTFLoader();
  gltfLoader.load( 'res/hero-3d.gltf', ( gltf ) => {

    const root = gltf.scene;
    root.rotation.x = 90;
    root.rotation.z = 45;
    heroScene.add( root );

    // compute the box that contains all the stuff
    // from root and below
    const box = new THREE.Box3().setFromObject( root );

    const boxSize = box.getSize( new THREE.Vector3() ).length();
    const boxCenter = box.getCenter( new THREE.Vector3() );

    // set the camera to frame the box
    frameArea( boxSize * 0.7, boxSize, boxCenter, heroCamera );

    // update the Trackball controls to handle the new size
    heroControls.maxDistance = boxSize * 10;
    heroControls.target.copy( boxCenter );
    heroControls.update();

    heroImage .style.display = "none"
    heroCanvas.style.display = "block"

    requestAnimationFrame( render );

  } );

}

function resizeRendererToDisplaySize( renderer ) {

  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if ( needResize ) {

    renderer.setSize( width, height, false );

  }

  return needResize;

}

function render() {
  if ( resizeRendererToDisplaySize( heroRenderer ) ) {

    const canvas = heroRenderer.domElement;
    heroCamera.aspect = canvas.clientWidth / canvas.clientHeight;
    heroCamera.updateProjectionMatrix();

  }

  heroRenderer.render( heroScene, heroCamera );

}

window.addEventListener('resize', function(event) {
  requestAnimationFrame(render);
});

heroCanvas.addEventListener('pointermove', function(event) {
  requestAnimationFrame(render);
});

requestAnimationFrame( render );

// Send mail
const contactForm = document.querySelector(".contact-form");

contactForm.addEventListener('submit', function(event) {
  // 1. Prevent the standard form submission/page reload
  event.preventDefault();

  // 2. Extract values from the form inputs
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const subject = encodeURIComponent(document.getElementById("subject").value);
  const message = document.getElementById("message").value;

  // 3. Define your recipient
  const recipient = "yash.katta1@gmail.com"

  // 4. Construct the body (EncodeURIComponent handles spaces and line breaks)
  const bodyText = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
  const body = encodeURIComponent(bodyText);

  // 5. Trigger the system's default mail client
  window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;

});

// Order now Actions
const orderNow = document.querySelector(".order-now");

orderNow.addEventListener("click", () => {
    document.getElementById("subject").value = "Order";
    document.getElementById("message").value = "Order now...";

    setTimeout(() => {
      document.getElementById("name").focus();
    }, 100);
});

import "./style.css";

import * as THREE from "three";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const ren = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

ren.setPixelRatio(window.devicePixelRatio);
ren.setSize(window.innerWidth, window.innerHeight);

camera.position.setZ(30);
ren.render(scene, camera);

// shape
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
// const material = new THREE.MeshBasicMaterial({ color: 0xFF6347, wireframe: true }); //wrapper for shape, no need for light
const material = new THREE.MeshStandardMaterial({ color: 0xff6347 }); //wrapper for shape, needs light
const torus = new THREE.Mesh(geometry, material); // create mesh obj

scene.add(torus);

// Light bulb for Standard material
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5,5,5);

// for whole scene
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// helpers
const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper);

const controls = new OrbitControls(camera, ren.domElement);

function addStar() {
  const shape = new THREE.SphereGeometry(0.25, 24, 24);
  const wrapper = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(shape, wrapper); 

  //random position for star
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x, y, z);

  scene.add(star);
}
Array(200).fill().forEach(addStar);

// add texture to space
const spaceTexture = new THREE.TextureLoader().load('space.jpg'); //could use a callback to notify when loaded
scene.background = spaceTexture;

// texture mapping - creating 3D from 2D images
const jeffTexture = new THREE.TextureLoader().load('jeff.png');
const jeff = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshBasicMaterial({ map: jeffTexture }),
);
scene.add(jeff)

// moon
const moonTexture = new THREE.TextureLoader().load("moon.jpg");
const normalTexture = new THREE.TextureLoader().load("normal.jpg");
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture
  })
);
scene.add(moon);

moon.position.z = 30;
moon.position.setX(-10);


function moveCamera() {
  const t = document.body.getBoundingClientRect().top;

  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  jeff.rotation.y += 0.01;
  jeff.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.position.y = t * -0.0002;
}
document.body.onscroll = moveCamera

function animate() {
  requestAnimationFrame(animate);

  // torus animation
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  // for controls
  controls.update();

  ren.render(scene, camera);
}

animate();

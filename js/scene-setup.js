import * as THREE from "./three.js";
export const scene = new THREE.Scene();
export const camera = new THREE.PerspectiveCamera(
  75,
  innerWidth / innerHeight,
  0.1,
  100
);


export const renderer = new THREE.WebGLRenderer({antialias : true});
export const canvas = renderer.domElement;
export const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: 0x5555ff,
    side: THREE.DoubleSide
  })
);



renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.z = 7;
camera.position.y = 1;

plane.rotateX(Math.PI / 2);
scene.add(plane);

const light = new THREE.PointLight(0xffffff, 1, 1000);
light.position.set(0, 2, 0);
scene.add(light);

const animate = function() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
};

animate();

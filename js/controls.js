import * as THREE from "./three.js";
import { scene, camera, plane, canvas } from "./scene-setup.js";

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const clock = new THREE.Clock();

// idle | pointer-down | look | move
var state = "idle";
canvas.style.cursor = 'pointer'

var moveTarget = new THREE.Vector2();

var [lat, lon] = [0, -Math.PI / 2];

const ring = new THREE.Mesh(
  new THREE.RingBufferGeometry(0.3, 0.36, 64),
  new THREE.MeshBasicMaterial()
);

ring.material.transparent = true;
ring.material.opacity = 0.5;
ring.rotation.x = -Math.PI / 2;
ring.visible = false;
scene.add(ring);

function onMouseDown(event) {
  state = "pointer-down";
}

function onMouseUp(event) {
  
  canvas.style.cursor = 'pointer'
  
  if (state == "pointer-down") {
    state = "move";
    ring.visible = false;
    moveTarget.set(ring.position.x, ring.position.z);
  }

  if (state == "look") {
    state = "idle";
  }
}

function onMouseMove(event) {
  if (state === "pointer-down") {
    state = "look";
    ring.visible = false;
  }
  
  if (state == "look") {
    canvas.style.cursor = 'url("https://cdn.glitch.com/57a4091e-0523-4d9a-b8e2-60e3176cb15e%2Ficons8-hand-rock-25.png?v=1622746546186"), default'
    
    lat += event.movementY * 0.005;
    lon -= event.movementX * 0.005;
    const R = 10;
    const [x, z, y] = [
      R * Math.cos(lat) * Math.cos(lon),
      R * Math.cos(lat) * Math.sin(lon),
      R * Math.sin(lat)
    ];

    camera.lookAt(new THREE.Vector3(x, y, z).add(camera.position));
  }

  if (state === "idle") {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
  }
}

function update() {
  const dt = clock.getDelta();
  requestAnimationFrame(update);

  if (state === "idle") {
    raycaster.setFromCamera(mouse, camera);
    const intersect = raycaster.intersectObject(plane);
    if (intersect.length > 0) {
      const inter = intersect[0];
      ring.visible = true;
      ring.position.set(inter.point.x, 0.05, inter.point.z);
    } else {
      ring.visible = false;
    }
  }

  if (state == "move") {
    const current = new THREE.Vector2(camera.position.x, camera.position.z);
    const speed = 6;

    if (current.distanceTo(moveTarget) < 0.05) {
      state = "idle";
      ring.visible = false;
      return;
    }

    const step = moveTarget
      .clone()
      .sub(current)
      .normalize()
      .multiplyScalar(speed * dt);
    camera.position.add(new THREE.Vector3(step.x, 0, step.y));
  }
}

update();

window.addEventListener("mousedown", onMouseDown);
window.addEventListener("mousemove", onMouseMove);
window.addEventListener("mouseup", onMouseUp);

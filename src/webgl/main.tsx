import * as THREE from 'three';
import { getTemporaryUrl, upload, ImageMimeType, ImageRef } from '@canva/asset';
import * as Composer from './fx/Composer.js';
import { RGBShiftShader } from './fx/shaders/RGBShiftShader.js';

let camera, scene, renderer;
let quadMaterial;
let rgbPass;

let rnd = Math.random();

console.log('THREE', THREE.REVISION);

export async function initGL(canvas) {
  console.log('INITGL', canvas, rnd);
  //threejs world
  renderer = new THREE.WebGLRenderer({ canvas: canvas });
  renderer.setPixelRatio(1);
  renderer.setSize(canvas.width, canvas.height);
  renderer.preserveDrawingBuffer = true;
  camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  scene = new THREE.Scene();

  quadMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  let screenGeom = new THREE.PlaneGeometry(2, 2);
  let screenQuad = new THREE.Mesh(screenGeom, quadMaterial);
  scene.add(screenQuad);

  Composer.init(renderer);
  Composer.addRenderPass(scene, camera);
  rgbPass = Composer.addShaderPass(RGBShiftShader);

  update();
}

//load an image data url into webgl
export async function loadImageURL(imageUrl) {
  console.log('loadImageURL', imageUrl);
  // load the image
  const response = await fetch(imageUrl, { mode: 'cors' });
  const imageBlob = await response.blob();

  // Extract MIME type from the downloaded image
  const mimeType = imageBlob.type;

  // Warning: This doesn't attempt to handle SVG images
  if (!isSupportedMimeType(mimeType)) {
    throw new Error(`Unsupported mime type: ${mimeType}`);
  }

  // Create an object URL for the image
  const objectURL = URL.createObjectURL(imageBlob);

  // Define an image element and load image from the object URL
  const image = new Image();
  image.crossOrigin = 'Anonymous';

  await new Promise((resolve, reject) => {
    image.onload = resolve;
    image.onerror = () => reject(new Error('Image could not be loaded'));
    image.src = objectURL;
  });
  //get dimensions
  console.log('DIMS', image.width, image.height);

  //resizeCanvas(img.width, img.height);
  quadMaterial.map = await new THREE.TextureLoader().loadAsync(objectURL);
  quadMaterial.needsUpdate = true;
  update();

  // Clean up: Revoke the object URL to free up memory?????
  URL.revokeObjectURL(objectURL);
}

export async function getOutputURL(mimeType) {
  console.log('getOutputURL', rnd, renderer);
  update();
  let dataUrl = await renderer.domElement.toDataURL(mimeType);
  return dataUrl;
}

function isSupportedMimeType(
  input: string
): input is 'image/jpeg' | 'image/heic' | 'image/png' | 'image/webp' {
  // This does not include "image/svg+xml"
  const mimeTypes = ['image/jpeg', 'image/heic', 'image/png', 'image/webp'];
  return mimeTypes.includes(input);
}

function resizeCanvas(w: number, h: number) {
  console.log('resizeCanvas', w, h);
  let aspect = w / h;
  let frustumSize = 2; //camera area is 2 by 2 units
  let dpr = 1;

  camera.left = (-frustumSize * aspect) / 2;
  camera.right = (frustumSize * aspect) / 2;
  camera.top = frustumSize / 2;
  camera.bottom = -frustumSize / 2;
  camera.updateProjectionMatrix();

  renderer.setSize(w, h, false);
  renderer.setPixelRatio(dpr);
  Composer.resize(w, h, dpr);
}

function update() {
  //requestAnimationFrame(update);
  //renderer.render(scene, camera);
  Composer.update();
  console.log('update');
}

export function setParams(params) {
  console.log('GL setParams', params);
  rgbPass.uniforms.amount.value = params.amount;
  rgbPass.uniforms.angle.value = params.angle * Math.PI * 2;
  update();
}

export function setAmount(val) {
  console.log('GL set amount', val);
  rgbPass.uniforms.amount.value = val;
  update();
}

export function setAngle(val) {
  rgbPass.uniforms.angle.value = val * Math.PI * 2;
  update();
}

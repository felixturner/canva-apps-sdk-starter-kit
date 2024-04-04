import * as THREE from 'three';
import * as Composer from './fx/Composer.js';
import { RGBShiftShader } from './fx/shaders/RGBShiftShader.js';
import { SolarizeShader } from './fx/shaders/SolarizeShader.js';
import { JitterShader } from './fx/shaders/JitterShader.js';

let camera, scene, renderer;
let quadMaterial;
let rgbPass, solarPass, jitterPass;
let mimeType;
let rnd = Math.random();

console.log('THREE', THREE.REVISION);

export async function initGL(canvas) {
  console.log('INITGL', canvas, rnd);

  //hide canvas until image loaded
  canvas.style.opacity = 0;
  renderer = new THREE.WebGLRenderer({ canvas: canvas });
  renderer.preserveDrawingBuffer = true;
  camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  scene = new THREE.Scene();

  quadMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  let screenGeom = new THREE.PlaneGeometry(2, 2);
  let screenQuad = new THREE.Mesh(screenGeom, quadMaterial);
  scene.add(screenQuad);

  Composer.init(renderer);
  Composer.addRenderPass(scene, camera);
  solarPass = Composer.addShaderPass(SolarizeShader);
  rgbPass = Composer.addShaderPass(RGBShiftShader);
  jitterPass = Composer.addShaderPass(JitterShader);

  update();
}

//load an image data url into webgl
export async function loadImageURL(imageUrl) {
  console.log('loadImageURL', imageUrl);
  // load the image
  const response = await fetch(imageUrl, { mode: 'cors' });
  const imageBlob = await response.blob();
  // Extract MIME type from the downloaded image
  mimeType = imageBlob.type;
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

  resizeCanvas(image.width, image.height);
  quadMaterial.map = await new THREE.TextureLoader().loadAsync(objectURL);
  quadMaterial.needsUpdate = true;
  update();
  // Clean up: Revoke the object URL to free up memory
  URL.revokeObjectURL(objectURL);

  //show canvas after image loaded
  renderer.domElement.style.opacity = 1;
}

export async function getOutput() {
  console.log('getOutputURL', rnd, renderer);
  update();
  let dataUrl = await renderer.domElement.toDataURL(mimeType);
  return { dataUrl, mimeType };
}

function resizeCanvas(w: number, h: number) {
  console.log('resizeCanvas', w, h);
  let dpr = 1;
  renderer.setSize(w, h, false);
  renderer.setPixelRatio(dpr);
  Composer.resize(w, h, dpr);
  update();
}

function update() {
  Composer.update();
}

export function setParams(params) {
  //console.log('GL setParams', params);
  rgbPass.uniforms.amount.value = params.rgbAmount;
  rgbPass.uniforms.angle.value = params.rgbAngle;
  jitterPass.uniforms.amount.value = params.jitterAmount;
  jitterPass.uniforms.seed.value = params.jitterSeed;
  solarPass.uniforms.amount.value = params.solarAmount;
  solarPass.uniforms.brightness.value = params.solarBrightness;
  //solarPass.uniforms.power.value = params.solarPower;

  update();
}

function isSupportedMimeType(
  input: string
): input is 'image/jpeg' | 'image/heic' | 'image/png' | 'image/webp' {
  // This does not include "image/svg+xml"
  const mimeTypes = ['image/jpeg', 'image/heic', 'image/png', 'image/webp'];
  return mimeTypes.includes(input);
}

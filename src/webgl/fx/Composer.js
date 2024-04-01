/*

  PPO module
  handlers applying 2d screen pass PPO effects 
  to final render

  USAGE:
  init:
    Composer.init(renderer, gui);
    let renderPass = new RenderPass(renderer, scene, camera);
    Composer.addPass(renderPass);
    Composer.addGUIShaderPass(RGBShiftShader);

  resize:
    Composer.resize(w, h, dpr);

  update:
    Composer.update();

*/

import { RenderPass } from './RenderPass.js';
import { ShaderPass } from './ShaderPass.js';
import { CopyShader } from './shaders/CopyShader.js';

let renderer;
let passes = [];
let lastOut = null;
let screenPass; //final output pass

export function init(_renderer, parentGui) {
  renderer = _renderer;
  screenPass = new ShaderPass(renderer, CopyShader);
}

export function update() {
  let time = performance.now() / 1000;
  passes.forEach((pass) => {
    if (pass.usesTime) {
      pass.uniforms.time.value = time;
    }
    pass.render();
  });
  screenPass.render(true);
}

export function resize(w, h, dpr) {
  //console.log('post resize', w, h);
  w = w * dpr;
  h = h * dpr;
  screenPass.setSize(w, h);
  passes.forEach((pass) => {
    pass.setSize(w, h);
    if (pass.usesResolution) {
      pass.uniforms.resolution.value = [w, h];
    }
  });
}

export function addShaderPass(shader, name) {
  let pass = addPass(new ShaderPass(renderer, shader, name));
  return pass;
}

export function addRenderPass(scene, camera) {
  let pass = addPass(new RenderPass(renderer, scene, camera));
  return pass;
}

export function addPass(pass) {
  //chain inputs
  if (pass?.uniforms?.tDiffuse && lastOut)
    pass.uniforms.tDiffuse.value = lastOut;
  lastOut = pass.texture;
  passes.push(pass);
  screenPass.uniforms.tDiffuse.value = lastOut;
  return pass;
}

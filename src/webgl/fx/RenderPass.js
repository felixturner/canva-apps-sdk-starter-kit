import * as THREE from 'three';

/*
  Renders a scene to FBO

*/

export class RenderPass {
  constructor(renderer, scene, camera) {
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    let width = 1024;
    let height = 1024;
    this.fbo = new THREE.WebGLRenderTarget(width, height);
    this.texture = this.fbo.texture;
  }

  render(final = false, renderFBO = this.fbo) {
    this.renderer.setRenderTarget(final ? null : renderFBO);
    this.renderer.render(this.scene, this.camera);
  }

  setSize(width, height) {
    this.fbo.setSize(width, height);
  }
}

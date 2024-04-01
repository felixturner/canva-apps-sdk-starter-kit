import * as THREE from 'three';

/*
  minimal custom ShaderPass based off of thespite's wagner

  WARNING: 
    this will capture the renderer if not called with render(true) at some point
    to fix call this in render loop
    renderer.setRenderTarget(null);

*/

export class ShaderPass {
  constructor(renderer, shader, name) {
    this.renderer = renderer;
    this.shader = shader;
    //use passed name or shader name
    this.name = name || shader.name;
    //allow multiple instances of same shader with different uniforms
    this.shader.uniforms = THREE.UniformsUtils.clone(shader.uniforms);
    this.shaderMat = new THREE.RawShaderMaterial(shader);

    //this.shaderMat.premultipliedAlpha = true;

    let width = 1024;
    let height = 1024;

    this.orthoScene = new THREE.Scene();
    this.fbo = new THREE.WebGLRenderTarget(width, height);
    this.orthoCamera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 0.00001, 1000);
    this.orthoQuad = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), this.shaderMat);
    this.orthoQuad.scale.set(width, height, 1);
    this.orthoScene.add(this.orthoQuad);

    //convenience
    this.texture = this.fbo.texture;
    this.uniforms = this.shader.uniforms;

    //allow auto-write to time and resolution
    this.usesTime = 'time' in this.uniforms;
    this.usesResolution = 'resolution' in this.uniforms;
  }

  render(final = false, renderFBO = this.fbo) {
    this.renderer.setRenderTarget(final ? null : renderFBO);
    this.renderer.render(this.orthoScene, this.orthoCamera);
  }

  setSize(width, height) {
    this.fbo.setSize(width, height);
    this.orthoQuad.scale.set(width, height, 1);
    this.orthoCamera.left = -width / 2;
    this.orthoCamera.right = width / 2;
    this.orthoCamera.top = height / 2;
    this.orthoCamera.bottom = -height / 2;
    this.orthoCamera.updateProjectionMatrix();
  }
}

export default ShaderPass;

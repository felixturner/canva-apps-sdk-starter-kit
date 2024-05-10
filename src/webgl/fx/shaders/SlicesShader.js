/*
   
   Slices Shader
   horizontal slices with random offsets
  @author felixturner / http://airtight.cc/

 */

import ortho from './lib/ortho.js';

export const SlicesShader = {
  uniforms: {
    tDiffuse: { type: 't', value: null },
    slices: { type: 'f', value: 10 },
    offset: { type: 'f', value: 0.3 }, //max offset
    speedH: { type: 'f', value: 0.5 },
    speedV: { type: 'f', value: 1.0 },
    position: { type: 'f', value: 0.0 },
  },

  vertexShader: `
    ${ortho}
  `,

  fragmentShader: /* glsl */ `
   precision highp float;

  uniform sampler2D tDiffuse;
  uniform float slices;
  uniform float offset;
  uniform float position;
  uniform float speedV;
  uniform float speedH;
  varying vec2 vUv;

  float steppedVal(float v, float steps){
    return floor(v*steps)/steps;
  }

  //RANDOM 
  //1D
  //returns 0 - 1
  float random1d(float n){
    return fract(sin(n) * 43758.5453);
  }

  //returns 0 - 1
  float noise1d(float p){
    float fl = floor(p);
    float fc = fract(p);
    return mix(random1d(fl), random1d(fl + 1.0), fc);
  }

  const float TWO_PI = 6.283185307179586;

  void main() {
    vec2 uv = vUv;
    //variable width strips
    float n = noise1d(uv.y * slices + position * 6.0);
    float ns = steppedVal(fract(n  ),slices) + 2.0;
    
    float nsr = random1d(ns);
    vec2 uvn = uv;
    uvn.x += nsr * sin(nsr * 20.0) * offset;
    gl_FragColor = texture2D(tDiffuse, uvn);
  }
`,
};

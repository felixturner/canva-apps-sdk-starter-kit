/*
 
  copier

 */

import ortho from './lib/ortho.js';

export const CopyShader = {
  uniforms: {
    tDiffuse: { value: null },
  },

  vertexShader: `
    ${ortho}
  `,

  fragmentShader: /* glsl */ `
    precision highp float;
    uniform sampler2D tDiffuse;
    varying vec2 vUv;
    
    void main() {
      gl_FragColor = texture2D( tDiffuse, vUv );
    }
  `,
};

/**
 * RGB Shift Shader
 * Shifts red and blue channels from center in opposite directions
 * amount: shift distance (1 is width of input)
 * angle: shift angle in radians
 * @author felixturner / http://airtight.cc/
 */

import ortho from './lib/ortho.js';

export const RGBShiftShader = {
  name: 'RGBShift',
  uniforms: {
    tDiffuse: { type: 't' },
    amount: { type: 'f', value: 0.3, min: 0.0, max: 6, step: 0.001, gui: true },
    angle: {
      type: 'f',
      value: 0.0,
      min: 0,
      max: Math.PI * 2,
      step: 0.001,
      gui: true,
    },
  },

  vertexShader: `
    ${ortho}
  `,

  fragmentShader: /* glsl */ `
    precision highp float;

    uniform sampler2D tDiffuse;
    uniform float amount;
    uniform float angle;

    varying vec2 vUv;

    #define TAU 6.283185

    void main() {

      vec4 orig = texture2D(tDiffuse, vUv);

      vec2 offset = amount * 0.1 * vec2( cos(angle * TAU), sin(angle * TAU));
      vec4 r = texture2D(tDiffuse, vUv + offset);
      vec4 g = orig;
      vec4 b = texture2D(tDiffuse, vUv - offset);
      //premult alpha
      r.rgb *=  r.a;
      g.rgb *=  g.a;
      b.rgb *=  b.a;
      vec3 outCol = vec3(r.r,g.g,b.b); 
      
      //use highest alpha so red offsets on transparent don't get lost
      float alpha = max(r.a, max(g.a, b.a));

      gl_FragColor = vec4(outCol, alpha);

    }`,
};

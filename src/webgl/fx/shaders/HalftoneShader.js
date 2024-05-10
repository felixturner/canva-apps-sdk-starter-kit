/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Dot screen shader
 * based on glfx.js sepia shader
 * https://github.com/evanw/glfx.js
 */

import ortho from './lib/ortho.js';

export const HalftoneShader = {
  uniforms: {
    tDiffuse: { value: null },
    tSize: { value: [256, 256] },
    center: { value: [0.5, 0.5] },
    angle: { value: 1.57 },
    scale: { value: 1.0 },
    amount: { type: 'f', value: 1 },
  },

  vertexShader: `
  ${ortho}
  `,

  fragmentShader: /*glsl */ `
    precision highp float;
    uniform vec2 center;
    uniform float angle;
    uniform float scale;
    uniform vec2 tSize;
    uniform float amount;

    uniform sampler2D tDiffuse;
    varying vec2 vUv;

    float pattern() {

      float s = sin( angle ), c = cos( angle );

      vec2 uv = vUv;
      uv -= 0.5;

      vec2 tex = uv * tSize - center;
      vec2 point = vec2( c * tex.x - s * tex.y, s * tex.x + c * tex.y ) * scale;

      return ( sin( point.x ) * sin( point.y ) ) * 4.0;

    }

    void main() {

      vec4 orig = texture2D( tDiffuse, vUv );
      float average = ( orig.r + orig.g + orig.b ) / 3.0;

      vec3 outCol = vec3( average * 10.0 - 5.0 + pattern() );
      outCol = mix(orig.rgb,outCol,amount);

      gl_FragColor = vec4(outCol , orig.a );

    }`,
};

/**

  Rainbow shader
  offset a rainbow gradient with rg channel
  like: https://www.shadertoy.com/view/lljfzm
  @author felixturner / http://airtight.cc/

 */

import ortho from './lib/ortho.js';

export const RainbowShader = {
  uniforms: {
    tDiffuse: { type: 't', value: null },
    amount: { type: 'f', value: 0.5 },
    offset: { type: 'f', value: 0.5 },
  },
  vertexShader: `
  ${ortho}
  `,

  fragmentShader: /*glsl */ `
    precision highp float;

    uniform sampler2D tDiffuse;
    uniform float amount;
    uniform float offset;

    varying vec2 vUv;

    vec3 rainbow2( in float t ){
      vec3 d = vec3(0.0,0.33,0.67);   
      return 0.5 + 0.5*cos( 6.28318*(t+d) );
    }

    void main() {
      vec2 p = vUv;
      vec4 orig = texture2D( tDiffuse, p );
      vec2 off = orig.rg - 0.5;
      p += off * offset;
      vec3 rb = rainbow2( (p.x + p.y) * 0.5);
      rb *= orig.a;
      vec3 col = mix(orig.rgb,rb,amount);
      col = clamp(col,0.,1.);
      gl_FragColor = vec4(col, orig.a);
    }
  `,
};

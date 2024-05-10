/**
 *
 * ported from https://www.clicktorelease.com/code/codevember-2016/22/
 * @author felixturner / http://airtight.cc/
 *
 */

import ortho from './lib/ortho.js';

export const LinocutShader = {
  uniforms: {
    tDiffuse: { type: 't', value: null },
    resolution: { type: 'v2', value: [800, 600] },
    amount: { type: 'f', value: 1 },
    scale: { type: 'f', value: 0.0 },
    angle: { type: 'f', value: 1 },
    centerX: { type: 'f', value: 0.5 },
  },

  vertexShader: `
    ${ortho}
  `,

  fragmentShader: /*glsl*/ `
    precision highp float;
    uniform sampler2D tDiffuse;
    uniform vec2 resolution;
    varying vec2 vUv;
    uniform float scale;
    uniform float amount;
    uniform float angle;
    uniform float centerX;

    #define PI 3.1415926535

    float luma(vec3 color) {
      return dot(color, vec3(0.299, 0.587, 0.114));
    }

    void main() {

      vec2 center = vec2( 0.5 );
      center.x = centerX;
      vec2 uv = vUv;

      //float angle = 0.1;
      float radius = 0.5;
      vec2 d = uv - center;
      float r = length( d * vec2( 1., resolution.y / resolution.x ) ) * scale;
      float a = atan(d.y,d.x) + (radius-r)/radius + angle * PI;
      vec2 uvt = center+r*vec2(cos(a),sin(a));

      vec2 uv2 = vUv;
      float c = ( .75 + .25 * sin( uvt.x * 1000. ) );
      vec4 orig = texture2D( tDiffuse, uv2 );
      float l = luma( orig.rgb );
      float f = smoothstep( .5 * c, c, l );
      f = smoothstep( 0., .5, f );

      vec3 col = vec3(f);
      col = mix(orig.rgb,col,amount);

      gl_FragColor = vec4( col,orig.a);
    }
  `,
};

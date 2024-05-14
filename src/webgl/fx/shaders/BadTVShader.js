/**
 * @author felixturner / http://airtight.cc/
 *
 * Bad TV Shader
 * Simulates a bad TV via horizontal distortion and vertical roll
 * Uses Ashima WebGl Noise: https://github.com/ashima/webgl-noise
 *
 * time: steadily increasing float passed in
 * distortion: amount of thick distortion
 * distortion2: amount of fine grain distortion
 * position: distortion vertical travel position
 * rollSpeed: vertical roll position
 *
 * v0.2
 * Fixed black bars on mobile
 */

import ortho from './lib/ortho.js';
import noise2d from './lib/noise2d.js';

export const BadTVShader = {
  uniforms: {
    tDiffuse: { type: 't', value: null },
    distortion: { type: 'f', value: 3.0 },
    distortion2: { type: 'f', value: 5.0 },
    position: { type: 'f', value: 0.116 },
  },

  vertexShader: `
  ${ortho}
  `,

  fragmentShader: /*glsl*/ `
  precision highp float;

  uniform sampler2D tDiffuse;
  uniform float distortion;
  uniform float distortion2;
  uniform float position;
  varying vec2 vUv;
  
  ${noise2d}

  void main() {

    vec2 p = vUv;
    float ty =position;
    float yt = p.y - ty;

    //thick distortion
    float offset = noise2d(vec2(yt*3.0,0.0))*0.2;
    offset = offset*distortion * offset*distortion * offset * 6.;
    //fine distortion
    offset += noise2d(vec2(yt*50.0,0.0))*distortion2*0.002 * 6.;
    
    //combine distortion on X with roll on Y
    gl_FragColor = texture2D(tDiffuse,  vec2(fract(p.x + offset),fract(p.y ) ));

  }
`,
};

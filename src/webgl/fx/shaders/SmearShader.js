/**
	Smear shader
	based on: https://www.airtightinteractive.com/demos/smear/
	@author felixturner / http://airtight.cc/
 */

import ortho from './lib/ortho.js';

export const SmearShader = {
  uniforms: {
    tDiffuse: { type: 't', value: null },
    amount: { type: 'f', value: 0.5 },
    time: { type: 'f', value: 0.5 },
  },

  vertexShader: `
		${ortho}
	`,

  fragmentShader: /*glsl */ `
	precision highp float;
	const float TWO_PI = 6.283185307179586;

	uniform sampler2D tDiffuse;
	uniform float amount;
	uniform float time;

	varying vec2 vUv;

	vec2 rotate2D(vec2 position, float theta){
		mat2 m = mat2( cos(theta), -sin(theta), sin(theta), cos(theta) );
		return m * position;
	}

	void main() {
		vec2 p = vUv;
		//Displace image by its own rg channel
		vec2 sPos = vUv;
		vec2 off = texture2D( tDiffuse, sPos ).rg - 0.5;

		//rotate
		float ang = time * TWO_PI;
		off = rotate2D(off,ang);
		p += off * amount * 0.15;

		vec4 col = texture2D(tDiffuse,p);
		gl_FragColor = col;
	}
`,
};

/*
 	Noise Displace Shader
 	A nice multi-octave noise pixel displacement.
 	@author Felix Turner / www.airtight.cc / @felixturner
 */

import ortho from './lib/ortho.js';
import noise2d from './lib/noise2d.js';

export const MeltShader = {
  uniforms: {
    tDiffuse: { type: 't', value: null },
    time: { type: 'f', value: 1.0 },
    speed: { type: 'f', value: 0.5 },
    scale: { type: 'f', value: 0.5 },
    amount: { type: 'f', value: 0.5 },
  },

  vertexShader: `
	${ortho}
	`,

  fragmentShader: /*glsl */ `
	precision highp float;

	uniform sampler2D tDiffuse;
	uniform float time;
	uniform float scale;
	uniform float amount;
	uniform float speed;
	varying vec2 vUv;

	${noise2d}

	float getNoise(vec2 uv, float t){
		//generate multi-octave noise based on uv position and time
		//move noise  over time
		//scale noise position relative to center
		uv -= 0.5;
		//octave 1
		float scl = 4.0 * scale;
		float noise = noise2d( vec2(uv.x * scl ,uv.y * scl - t * speed ));
		//octave 2
		scl = 16.0 * scale;
		noise += noise2d( vec2(uv.x * scl + t* speed ,uv.y * scl )) * 0.2 ;
		//octave 3
		scl = 26.0 * scale;
		noise += noise2d( vec2(uv.x * scl + t* speed ,uv.y * scl )) * 0.2 ;
		return noise;
	}

	void main() {
		vec2 uv = vUv;
		float noise = getNoise(uv, time * 24.0);
		vec2 noiseUv = uv + amount * noise * 0.1;
		//wrap
		noiseUv = fract(noiseUv);
		gl_FragColor = texture2D(tDiffuse,noiseUv);
	}
`,
};

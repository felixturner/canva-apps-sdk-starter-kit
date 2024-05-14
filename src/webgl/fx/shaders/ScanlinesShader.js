/**

  Simplified version of THREE.FilmShader
  Seperate out noise and lines

 */

import ortho from './lib/ortho.js';

export const ScanlinesShader = {
  uniforms: {
    tDiffuse: { value: null },
    noiseAmount: { value: 0.5 },
    linesAmount: { value: 0.05 },
    width: { value: 0.5 },
    resolution: { type: 'v2', value: [800.0, 600] },
  },

  vertexShader: `
  ${ortho}
  `,

  fragmentShader: /*glsl*/ `
  precision highp float;

  uniform sampler2D tDiffuse;
  uniform float noiseAmount;
  uniform float linesAmount;
  uniform vec2 resolution;
  uniform float width;

  varying vec2 vUv;

  #define PI 3.14159265359

  highp float rand( const in vec2 uv ) {
    const highp float a = 12.9898, b = 78.233, c = 43758.5453;
    highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
    return fract(sin(sn) * c);
  }

  void main() {

    // sample the source
    vec4 cTextureScreen = texture2D( tDiffuse, vUv );
    
    // add noise
    float dx = rand( vUv  );
    vec3 cResult = cTextureScreen.rgb * dx * noiseAmount;
    
    // add scanlines
    float lineCount = resolution.y * PI/2. * width;

    vec2 sc = vec2( sin( vUv.y * lineCount), cos( vUv.y * lineCount) );
    cResult += cTextureScreen.rgb * vec3( sc.x, sc.y, sc.x ) * linesAmount;

    // interpolate between source and result by intensity
    cResult = cTextureScreen.rgb + ( cResult );

    gl_FragColor =  vec4( cResult, cTextureScreen.a );
  }
`,
};

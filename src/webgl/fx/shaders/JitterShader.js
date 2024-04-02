/**
 * @author felixturner / http://airtight.cc/
 *
 * Jitter Shader
 * webgl version of ImageGlitcher: https://www.airtightinteractive.com/demos/js/imageglitcher/
 */

import ortho from './lib/ortho.js';

export const JitterShader = {
  uniforms: {
    tDiffuse: { type: 't', value: null },
    amount: { type: 'f', value: 0.5 }, //0-1
    speed: { type: 'f', value: 0.5 }, //0-1
    time: { type: 'f', value: 0 }, //ms
  },

  vertexShader: `
  ${ortho}
  `,

  fragmentShader: /* glsl */ `
    precision highp float;
    uniform sampler2D tDiffuse;
    varying vec2 vUv;
    uniform float amount;
    uniform float speed;
    uniform float time;

    float random1d(float n){
      return fract(sin(n) * 43758.5453);
    }

    //2D (returns 0 - 1)
    float random2d(vec2 n) { 
      return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
    }

    float randomRange (in vec2 seed, in float min, in float max) {
      return min + random2d(seed) * (max - min);
    }

    // return 1 if v inside 1d range
    float insideRange(float v, float bottom, float top) {
    return step(bottom, v) - step(top, v);
    }

    float rand(vec2 co){
      return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
    }

    void main() {
      
      vec2 uv = vUv;

      float sTime = floor(time * speed * 6.0 * 24.0);
      vec3 inCol = texture2D(tDiffuse, uv).rgb;
      
      //copy orig
      vec3 outCol = inCol;
      
      //randomly offset slices horizontally
      float maxOffset = amount/2.0;

      vec2 uvOff;
      
      for (float i = 0.0; i < 10.0; i += 1.0) {

        if (i > 10.0 * amount) break;

        float sliceY = random2d(vec2(sTime + amount, 2345.0 + float(i)));
        float sliceH = random2d(vec2(sTime + amount, 9035.0 + float(i))) * 0.25;
        float hOffset = randomRange(vec2(sTime + amount, 9625.0 + float(i)), -maxOffset, maxOffset);
        uvOff = uv;
        uvOff.x += hOffset;
        vec2 uvOff = fract(uvOff);
        if (insideRange(uv.y, sliceY, fract(sliceY+sliceH)) == 1.0 ){
          outCol = texture2D(tDiffuse, uvOff).rgb;
        }
      }
    
      //do color offset - slight shift on one entire channel
      float maxColOffset = amount/6.0;
      vec2 colOffset = vec2(randomRange(vec2(sTime + amount, 3545.0),-maxColOffset,maxColOffset), randomRange(vec2(sTime , 7205.0),-maxColOffset,maxColOffset));

      uvOff = fract(uv + colOffset);
      
      //TODO - use col[1] array access
      float rnd = random2d(vec2(sTime + amount, 9545.0));
      if (rnd < 0.33){
        outCol.r = texture2D(tDiffuse, uvOff).r;
      }else if (rnd < 0.66){
        outCol.g = texture2D(tDiffuse, uvOff).g;
      } else{
        outCol.b = texture2D(tDiffuse, uvOff).b;
      }
      gl_FragColor = vec4(outCol,1.0);
  }
  `,
};

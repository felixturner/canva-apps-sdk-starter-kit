/**
 
    Solarize Shader
    ported from https://www.interactiveshaderformat.com/sketches/390

 */

import ortho from './lib/ortho.js';

export const SolarizeShader = {
  uniforms: {
    tDiffuse: { type: 't', value: null },
    amount: { type: 'f', value: 0 },
    brightness: { type: 'f', value: 0.5 },
    power: { type: 'f', value: 2.0 },
    colorize: { type: 'f', value: 0.5 },
  },

  vertexShader: `
        ${ortho}
    `,

  fragmentShader: /* glsl */ `
    precision highp float;
    uniform sampler2D tDiffuse;
        
    uniform float brightness;
    uniform float power;
    uniform float colorize;
    uniform float amount;

    varying vec2 vUv;
    
    vec3 rgb2hsv(vec3 c)	{
        vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
        vec4 p = c.g < c.b ? vec4(c.bg, K.wz) : vec4(c.gb, K.xy);
        vec4 q = c.r < p.x ? vec4(p.xyw, c.r) : vec4(c.r, p.yzx);
        float d = q.x - min(q.w, q.y);
        float e = 1.0e-10;
        return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
    }

    vec3 hsv2rgb(vec3 c)	{
        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }

    void main() {
        vec3 origCol = texture2D( tDiffuse, vUv ).rgb;

        //	convert to HSV
        vec3 hslColor = rgb2hsv(origCol);
        vec3 outColor = hslColor;
        
        //	adjust the brightness curve
        outColor.b = pow(outColor.b, power);
        outColor.b = (outColor.b < brightness) ? (1.0 - outColor.b / brightness) : (outColor.b - brightness) / brightness;
        outColor.g = outColor.g * hslColor.b * colorize;
        
        //	convert back to rgb
        outColor = hsv2rgb(outColor);

        outColor = mix(origCol, outColor,amount);
        
        gl_FragColor = vec4(outColor, 1.0);
    }
`,
};

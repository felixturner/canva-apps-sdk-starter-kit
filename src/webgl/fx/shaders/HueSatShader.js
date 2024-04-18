import ortho from './lib/ortho.js';

export const HueSatShader = {
  uniforms: {
    tDiffuse: { value: null },
    hue: { value: 0 },
    saturation: { value: 0 },
  },

  vertexShader: `
  ${ortho}
  `,

  fragmentShader: /*glsl */ `
    precision highp float;
    uniform sampler2D tDiffuse;
    uniform float hue;
    uniform float saturation;

    varying vec2 vUv;

    void main() {

      gl_FragColor = texture2D( tDiffuse, vUv );

      // hue
      float angle = hue * 3.14159265;
      float s = sin(angle), c = cos(angle);
      vec3 weights = (vec3(2.0 * c, -sqrt(3.0) * s - c, sqrt(3.0) * s - c) + 1.0) / 3.0;
      float len = length(gl_FragColor.rgb);
      gl_FragColor.rgb = vec3(
        dot(gl_FragColor.rgb, weights.xyz),
        dot(gl_FragColor.rgb, weights.zxy),
        dot(gl_FragColor.rgb, weights.yzx)
      );

      //limit max saturation
      float sat2 = saturation;
      if (saturation > 0.){
        sat2 = saturation * 0.7;
      }
      float average = (gl_FragColor.r + gl_FragColor.g + gl_FragColor.b) / 3.0;
      if (saturation > 0.0) {
        gl_FragColor.rgb += (average - gl_FragColor.rgb) * (1.0 - 1.0 / (1.001 - sat2));
      } else {
        gl_FragColor.rgb += (average - gl_FragColor.rgb) * (-sat2);
      }
    }
    `,
};

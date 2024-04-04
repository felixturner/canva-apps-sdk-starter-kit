import * as React from 'react';
import { appProcess } from '@canva/preview/platform';
import { ObjectPanel } from './object_panel';
import { Overlay } from './overlay';

export type LaunchParams = {
  selectedImageMime: string;
  selectedImageUrl: string;
  rgbAmount: number;
  rgbAngle: number;
  jitterAmount: number;
  jitterSeed: number;
  solarAmount: number;
  solarBrightness: number;
  solarPower: number;
};

export type UIState = {
  rgbAmount: number;
  rgbAngle: number;
  jitterAmount: number;
  jitterSeed: number;
  solarAmount: number;
  solarBrightness: number;
  solarPower: number;
};

export const App = () => {
  const context = appProcess.current.getInfo<LaunchParams>();

  if (context.surface === 'object_panel') {
    return <ObjectPanel />;
  }

  if (context.surface === 'selected_image_overlay') {
    return <Overlay context={context} />;
  }

  throw new Error(`Invalid surface: ${context.surface}`);
};

import * as React from 'react';
import { appProcess } from '@canva/preview/platform';
import { ObjectPanel } from './object_panel';
import { Overlay } from './overlay';

//data going from ObjectPanel -> Overlay
export type LaunchParams = {
  selectedImageMime: string;
  selectedImageUrl: string;
  effectParams: EffectParams;
};

//slider parameters used in effect
export type EffectParams = {
  hueOffset: number;
  saturation: number;
  rainbowAmount: number;
  rainbowOffset: number;
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

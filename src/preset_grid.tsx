import * as React from 'react';
import { Grid } from '@canva/app-ui-kit';
import { Preset } from './preset';
import { UIState } from './app';
import none from 'assets/images/colormix/none.png';
import rainbow from 'assets/images/colormix/rainbow.jpg';
import amethyst from 'assets/images/colormix/amethyst.jpg';
import arctic from 'assets/images/colormix/arctic.jpg';
import marmalade from 'assets/images/colormix/marmalade.jpg';
import parakeet from 'assets/images/colormix/parakeet.jpg';

export const PresetGrid = (props) => {
  const { handlePresetClick } = props;
  const NoneState: UIState = {
    hueOffset: 0,
    saturation: 0,
    rainbowAmount: 0,
    rainbowOffset: 0,
  };
  const RainbowState: UIState = {
    hueOffset: 0,
    saturation: 0,
    rainbowAmount: 0.5,
    rainbowOffset: 0.5,
  };
  const ArcticState: UIState = {
    hueOffset: 1,
    saturation: 0.1,
    rainbowAmount: 0,
    rainbowOffset: 0,
  };
  const AmethystState: UIState = {
    hueOffset: -0.6,
    saturation: 0.2,
    rainbowAmount: 0,
    rainbowOffset: 0,
  };
  const MarmaladeState: UIState = {
    hueOffset: 0.3,
    saturation: 0.6,
    rainbowAmount: 0,
    rainbowOffset: 0,
  };
  const ParakeetState: UIState = {
    hueOffset: 0.8,
    saturation: 0.3,
    rainbowAmount: 0.2,
    rainbowOffset: 0,
  };

  const onPresetClick = (presetState) => {
    handlePresetClick(presetState);
  };

  return (
    <Grid alignX="stretch" alignY="stretch" columns={3} spacing="1u">
      <Preset
        label="None"
        presetState={NoneState}
        onPresetClick={onPresetClick}
        thumb={none}
      />
      <Preset
        label="Rainbow"
        presetState={RainbowState}
        onPresetClick={onPresetClick}
        thumb={rainbow}
      />
      <Preset
        label="Amethyst"
        presetState={AmethystState}
        onPresetClick={onPresetClick}
        thumb={amethyst}
      />
      <Preset
        label="Arctic"
        presetState={ArcticState}
        onPresetClick={onPresetClick}
        thumb={arctic}
      />
      <Preset
        label="Marmalade"
        presetState={MarmaladeState}
        onPresetClick={onPresetClick}
        thumb={marmalade}
      />
      <Preset
        label="Parakeet"
        presetState={ParakeetState}
        onPresetClick={onPresetClick}
        thumb={parakeet}
      />
    </Grid>
  );
};

import * as React from 'react';
import { Grid, Box, Title } from '@canva/app-ui-kit';
import { Preset } from './preset';
import { LaunchParams, UIState } from './app';
import { appProcess } from '@canva/preview/platform';

export const PresetGrid = (props) => {
  const { handlePresetClick } = props;
  const Preset1State: UIState = {
    rgbAmount: 1,
    rgbAngle: 0,
    jitterAmount: 0,
    jitterSeed: 0,
    solarAmount: 1,
    solarBrightness: 0.5,
    solarPower: 2,
  };
  const Preset2State: UIState = {
    rgbAmount: 0,
    rgbAngle: 0,
    jitterAmount: 1,
    jitterSeed: 0,
    solarAmount: 0,
    solarBrightness: 0.5,
    solarPower: 2,
  };

  const onPresetClick = (presetState) => {
    handlePresetClick(presetState);
  };

  return (
    <Grid alignX="stretch" alignY="stretch" columns={4} spacing="1u">
      <Preset
        label="Preset 1"
        presetState={Preset1State}
        onPresetClick={onPresetClick}
      />
      <Preset
        label="Preset 2"
        presetState={Preset2State}
        onPresetClick={onPresetClick}
      />
      <Preset
        label="Preset 3"
        presetState={Preset2State}
        onPresetClick={onPresetClick}
      />
      <Preset
        label="Preset 4"
        presetState={Preset2State}
        onPresetClick={onPresetClick}
      />
      <Preset
        label="Preset 5"
        presetState={Preset2State}
        onPresetClick={onPresetClick}
      />
      <Preset
        label="Preset 6"
        presetState={Preset2State}
        onPresetClick={onPresetClick}
      />
    </Grid>
  );
};

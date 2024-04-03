import * as React from 'react';
import { Grid, Box, Title } from '@canva/app-ui-kit';
import { Preset } from './preset';
import { LaunchParams, UIState } from './app';
import { appProcess } from '@canva/preview/platform';
import cat from 'assets/images/cat.jpg';
import dog from 'assets/images/dog.jpg';
import rabbit from 'assets/images/rabbit.jpg';

export const PresetGrid = (props) => {
  const { handlePresetClick } = props;
  const NoneState: UIState = {
    rgbAmount: 0,
    rgbAngle: 0,
    jitterAmount: 0,
    jitterSeed: 0,
    solarAmount: 0,
    solarBrightness: 0.5,
    solarPower: 2,
  };
  const SplitState: UIState = {
    rgbAmount: 5,
    rgbAngle: 0,
    jitterAmount: 0,
    jitterSeed: 0,
    solarAmount: 0,
    solarBrightness: 0.5,
    solarPower: 2,
  };
  const RadiateState: UIState = {
    rgbAmount: 0.3,
    rgbAngle: 0,
    jitterAmount: 0,
    jitterSeed: 0,
    solarAmount: 0,
    solarBrightness: 0.5,
    solarPower: 2,
  };
  const TraceState: UIState = {
    rgbAmount: 0.3,
    rgbAngle: 0,
    jitterAmount: 0,
    jitterSeed: 0,
    solarAmount: 1,
    solarBrightness: 0.5,
    solarPower: 1,
  };

  const onPresetClick = (presetState) => {
    handlePresetClick(presetState);
  };

  return (
    <Grid alignX="stretch" alignY="stretch" columns={4} spacing="1u">
      <Preset
        label="None"
        presetState={NoneState}
        onPresetClick={onPresetClick}
        thumb={cat}
      />
      <Preset
        label="Split"
        presetState={SplitState}
        onPresetClick={onPresetClick}
        thumb={dog}
      />
      <Preset
        label="Radiate"
        presetState={RadiateState}
        onPresetClick={onPresetClick}
        thumb={rabbit}
      />
      <Preset
        label="Trace"
        presetState={TraceState}
        onPresetClick={onPresetClick}
      />
      <Preset
        label="Opal"
        presetState={RadiateState}
        onPresetClick={onPresetClick}
      />
      <Preset
        label="Flourite"
        presetState={RadiateState}
        onPresetClick={onPresetClick}
      />
      <Preset
        label="MoodStone"
        presetState={RadiateState}
        onPresetClick={onPresetClick}
      />
      <Preset
        label="Mirror"
        presetState={RadiateState}
        onPresetClick={onPresetClick}
      />
    </Grid>
  );
};

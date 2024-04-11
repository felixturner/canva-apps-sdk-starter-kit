import * as React from 'react';
import { Grid, Box, Title } from '@canva/app-ui-kit';
import { Preset } from './preset';
import { LaunchParams, UIState } from './app';
import { appProcess } from '@canva/preview/platform';
import none from 'assets/images/thumbs/trippy/none.png';
import split from 'assets/images/thumbs/trippy/split.png';
import radiate from 'assets/images/thumbs/trippy/radiate.png';
import trace from 'assets/images/thumbs/trippy/trace.png';
import flourite from 'assets/images/thumbs/trippy/flourite.png';
import opal from 'assets/images/thumbs/trippy/opal.jpg';

export const PresetGrid = (props) => {
  const { handlePresetClick } = props;
  const NoneState: UIState = {
    rgbAmount: 0,
    rgbAngle: 0,
    jitterAmount: 0,
    solarAmount: 0,
  };
  const SplitState: UIState = {
    rgbAmount: 1,
    rgbAngle: 0,
    jitterAmount: 0,
    solarAmount: 0,
  };
  const RadiateState: UIState = {
    rgbAmount: 0.1,
    rgbAngle: 0,
    jitterAmount: 0,
    solarAmount: 0,
  };
  const TraceState: UIState = {
    rgbAmount: 0.7,
    rgbAngle: 0,
    jitterAmount: 0,
    solarAmount: 1,
  };
  const FlouriteState: UIState = {
    rgbAmount: 0,
    rgbAngle: 0,
    jitterAmount: 0.37,
    solarAmount: 0,
  };
  const OpalState: UIState = {
    rgbAmount: 0.5,
    rgbAngle: 0.25,
    jitterAmount: 0.61,
    solarAmount: 0.63,
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
        label="Split"
        presetState={SplitState}
        onPresetClick={onPresetClick}
        thumb={split}
      />
      <Preset
        label="Radiate"
        presetState={RadiateState}
        onPresetClick={onPresetClick}
        thumb={radiate}
      />
      <Preset
        label="Flourite"
        presetState={FlouriteState}
        onPresetClick={onPresetClick}
        thumb={flourite}
      />
      <Preset
        label="Trace"
        presetState={TraceState}
        onPresetClick={onPresetClick}
        thumb={trace}
      />
      <Preset
        label="Opal"
        presetState={OpalState}
        onPresetClick={onPresetClick}
        thumb={opal}
      />
    </Grid>
  );
};

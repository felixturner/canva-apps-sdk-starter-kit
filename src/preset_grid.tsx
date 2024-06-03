import * as React from 'react';
import { Grid } from '@canva/app-ui-kit';
import { Preset } from './preset';
import { useSelection } from 'utils/use_selection_hook';

import none from 'assets/images/trippy/none.jpg';
import split from 'assets/images/trippy/split.jpg';
import radiate from 'assets/images/trippy/radiate.jpg';
import trace from 'assets/images/trippy/trace.jpg';
import opal from 'assets/images/trippy/opal.jpg';
import fluorite from 'assets/images/trippy/fluorite.jpg';

export const PresetGrid = (props) => {
  const selection = useSelection('image');
  const {
    handlePresetClick,
    disabled,
    selectedPresetIndex,
    setSelectedPresetIndex,
  } = props;

  const presets = [
    {
      name: 'None',
      thumb: none,
      params: {
        rgbAmount: 0,
        rgbAngle: 0,
        solarizeAmount: 0,
        jitterAmount: 0,
      },
    },
    {
      name: 'Radiate',
      thumb: radiate,
      params: {
        rgbAmount: 0.1,
        rgbAngle: 0,
        solarizeAmount: 0,
        jitterAmount: 0,
      },
    },
    {
      name: 'Split',
      thumb: split,
      params: {
        rgbAmount: 0.8,
        rgbAngle: 0,
        solarizeAmount: 0,
        jitterAmount: 0,
      },
    },
    {
      name: 'Flourite',
      thumb: fluorite,
      params: {
        rgbAmount: 0.4,
        rgbAngle: 0.8,
        solarizeAmount: 0,
        jitterAmount: 0.55,
      },
    },
    {
      name: 'Opal',
      thumb: opal,
      params: {
        rgbAmount: 0.3,
        rgbAngle: 0.25,
        solarizeAmount: 0.5,
        jitterAmount: 0.5,
      },
    },
    {
      name: 'Trace',
      thumb: trace,
      params: {
        rgbAmount: 0.6,
        rgbAngle: 0.2,
        solarizeAmount: 1,
        jitterAmount: 0,
      },
    },
  ];

  const onPresetClick = (index) => {
    setSelectedPresetIndex(index);
    handlePresetClick(presets[index].params);
  };

  React.useEffect(() => {
    //reset to default preset when selection changes
    setSelectedPresetIndex(0);
  }, [selection]);

  // React.useEffect(() => {
  //   return void appProcess.registerOnMessage((_, message) => {
  //     if (!message) {
  //       return;
  //     }
  //     if (message === 'overlay-closed') {
  //       //reset to default preset when overlay closed
  //       setSelectedPresetIndex(0);
  //     }
  //   });
  // }, []);

  return (
    <Grid alignX="stretch" alignY="stretch" columns={3} spacing="1u">
      {presets.map((preset, index) => (
        <Preset
          key={index}
          label={preset.name}
          onPresetClick={() => onPresetClick(index)}
          thumb={preset.thumb}
          selected={selectedPresetIndex === index}
          disabled={disabled}
        />
      ))}
    </Grid>
  );
};

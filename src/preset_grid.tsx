import * as React from 'react';
import { Grid } from '@canva/app-ui-kit';
import { Preset } from './preset';
import { useSelection } from 'utils/use_selection_hook';

import none from 'assets/images/liquify/none.jpg';
import melt from 'assets/images/liquify/melt.jpg';
import wobble from 'assets/images/liquify/wobble.jpg';
import smear from 'assets/images/liquify/smear.jpg';
import smudge from 'assets/images/liquify/smudge.jpg';
import flow from 'assets/images/liquify/flow.jpg';

export const PresetGrid = (props) => {
  const selection = useSelection('image');
  const { handlePresetClick, disabled } = props;

  const presets = [
    {
      name: 'None',
      thumb: none,
      params: {
        meltAmount: 0,
        meltScale: 0.2,
        wobbleAmount: 0,
        wobbleScale: 0.1,
        smear: 0,
      },
    },
    {
      name: 'Melt',
      thumb: melt,
      params: {
        meltAmount: 0.5,
        meltScale: 0.5,
        wobbleAmount: 0.0,
        wobbleScale: 0.1,
        smear: 0,
      },
    },
    {
      name: 'Wobble',
      thumb: wobble,
      params: {
        meltAmount: 0,
        meltScale: 0.2,
        wobbleAmount: 0.5,
        wobbleScale: 0.5,
        smear: 0,
      },
    },
    {
      name: 'Smear',
      thumb: smear,
      params: {
        meltAmount: 0,
        meltScale: 0.2,
        wobbleAmount: 0,
        wobbleScale: 0.1,
        smear: 0.3,
      },
    },
    {
      name: 'Smudge',
      thumb: smudge,
      params: {
        meltAmount: 0.25,
        meltScale: 0.8,
        wobbleAmount: 0,
        wobbleScale: 0.1,
        smear: 0.6,
      },
    },
    {
      name: 'Flow',
      thumb: flow,
      params: {
        meltAmount: 0.7,
        meltScale: 0.3,
        wobbleAmount: 0.6,
        wobbleScale: 0.4,
        smear: 0,
      },
    },
  ];
  const [selectedPresetIndex, setSelectedPresetIndex] = React.useState(0);
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

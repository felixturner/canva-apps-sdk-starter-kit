import * as React from 'react';
import { Grid } from '@canva/app-ui-kit';
import { Preset } from './preset';
import { useSelection } from 'utils/use_selection_hook';

import none from 'assets/images/screen/none.jpg';
import half from 'assets/images/screen/half.jpg';
import semi from 'assets/images/screen/semi.jpg';
import lino from 'assets/images/screen/lino.jpg';
import cord from 'assets/images/screen/cord.jpg';

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
        halftoneAmount: 0,
        halftoneScale: 1,
        linoAmount: 0,
        linoScale: 1,
      },
    },
    {
      name: 'Halftone',
      thumb: half,
      params: {
        halftoneAmount: 1,
        halftoneScale: 1.7,
        linoAmount: 0,
        linoScale: 1,
      },
    },
    {
      name: 'Semitone',
      thumb: semi,
      params: {
        halftoneAmount: 0.16,
        halftoneScale: 1.3,
        linoAmount: 0,
        linoScale: 1,
      },
    },
    {
      name: 'Lino',
      thumb: lino,
      params: {
        halftoneAmount: 0,
        halftoneScale: 1,
        linoAmount: 1,
        linoScale: 0.5,
      },
    },
    {
      name: 'Corduroy',
      thumb: cord,
      params: {
        halftoneAmount: 1,
        halftoneScale: 3,
        linoAmount: 0.5,
        linoScale: 0.5,
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

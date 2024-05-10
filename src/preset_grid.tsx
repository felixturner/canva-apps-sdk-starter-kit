import * as React from 'react';
import { Grid } from '@canva/app-ui-kit';
import { Preset } from './preset';
import { useSelection } from 'utils/use_selection_hook';

import none from 'assets/images/slice/none.jpg';
import chipped from 'assets/images/slice/chipped.jpg';
import sliced from 'assets/images/slice/sliced.jpg';
import minced from 'assets/images/slice/minced.jpg';
import torn from 'assets/images/slice/torn.jpg';

export const PresetGrid = (props) => {
  const selection = useSelection('image');
  const { handlePresetClick, disabled } = props;

  const presets = [
    {
      name: 'None',
      thumb: none,
      params: {
        count: 10,
        offset: 0,
        position: 0,
      },
    },
    {
      name: 'Chipped',
      thumb: chipped,
      params: {
        count: 20,
        offset: 0.01,
        position: 0,
      },
    },
    {
      name: 'Sliced',
      thumb: sliced,
      params: {
        count: 10,
        offset: 0.12,
        position: 0,
      },
    },
    {
      name: 'Minced',
      thumb: minced,
      params: {
        count: 27,
        offset: 0.16,
        position: 0,
      },
    },
    {
      name: 'Torn',
      thumb: torn,
      params: {
        count: 5,
        offset: 0.2,
        position: 0,
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

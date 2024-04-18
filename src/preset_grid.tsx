import * as React from 'react';
import { Grid } from '@canva/app-ui-kit';
import { Preset } from './preset';
import { useSelection } from 'utils/use_selection_hook';

import none from 'assets/images/colormix/none.png';
import rainbow from 'assets/images/colormix/rainbow.jpg';
import amethyst from 'assets/images/colormix/amethyst.jpg';
import arctic from 'assets/images/colormix/arctic.jpg';
import marmalade from 'assets/images/colormix/marmalade.jpg';
import parakeet from 'assets/images/colormix/parakeet.jpg';

export const PresetGrid = (props) => {
  const selection = useSelection('image');
  const { handlePresetClick } = props;

  const presets = [
    {
      name: 'None',
      thumb: none,
      params: {
        hueOffset: 0,
        saturation: 0,
        rainbowAmount: 0,
        rainbowOffset: 0,
      },
    },
    {
      name: 'Rainbow',
      thumb: rainbow,
      params: {
        hueOffset: 0,
        saturation: 0,
        rainbowAmount: 0.5,
        rainbowOffset: 0.5,
      },
    },
    {
      name: 'Arctic',
      thumb: arctic,
      params: {
        hueOffset: 1,
        saturation: 0.1,
        rainbowAmount: 0,
        rainbowOffset: 0,
      },
    },
    {
      name: 'Amethyst',
      thumb: amethyst,
      params: {
        hueOffset: -0.6,
        saturation: 0.2,
        rainbowAmount: 0,
        rainbowOffset: 0,
      },
    },
    {
      name: 'Marmalade',
      thumb: marmalade,
      params: {
        hueOffset: 0.3,
        saturation: 0.6,
        rainbowAmount: 0,
        rainbowOffset: 0,
      },
    },
    {
      name: 'Parakeet',
      thumb: parakeet,
      params: {
        hueOffset: 0.8,
        saturation: 0.3,
        rainbowAmount: 0.2,
        rainbowOffset: 0,
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

  return (
    <Grid alignX="stretch" alignY="stretch" columns={3} spacing="1u">
      {presets.map((preset, index) => (
        <Preset
          key={index}
          label={preset.name}
          onPresetClick={() => onPresetClick(index)}
          thumb={preset.thumb}
          selected={selectedPresetIndex === index}
        />
      ))}
    </Grid>
  );
};

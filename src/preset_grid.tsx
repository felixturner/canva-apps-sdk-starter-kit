import * as React from 'react';
import { Grid } from '@canva/app-ui-kit';
import { Preset } from './preset';
import { useSelection } from 'utils/use_selection_hook';

import none from 'assets/images/badtv/none.jpg';
import retro from 'assets/images/badtv/retro.jpg';
import tube from 'assets/images/badtv/tube.jpg';
import fuzz from 'assets/images/badtv/fuzz.jpg';
import vhs from 'assets/images/badtv/vhs.jpg';
import warp from 'assets/images/badtv/warp.jpg';

export const PresetGrid = (props) => {
  const selection = useSelection('image');
  const { handlePresetClick, disabled } = props;

  const presets = [
    {
      name: 'None',
      thumb: none,
      params: {
        thickDistort: 0,
        fineDistort: 0,
        position: 0,
        linesAmount: 0,
        width: 0.5,
        static: 0,
      },
    },
    {
      name: 'Retro',
      thumb: retro,
      params: {
        thickDistort: 0.7,
        fineDistort: 0.3,
        position: 0,
        linesAmount: 0.4,
        width: 1,
        static: 0.3,
      },
    },
    {
      name: 'Tube',
      thumb: tube,
      params: {
        thickDistort: 1.5,
        fineDistort: 1,
        position: 0.5,
        linesAmount: 0.1,
        width: 0.45,
        static: 0.25,
      },
    },
    {
      name: 'Fuzz',
      thumb: fuzz,
      params: {
        thickDistort: 0,
        fineDistort: 0,
        position: 0,
        linesAmount: 0.25,
        width: 0.5,
        static: 0.8,
      },
    },
    {
      name: 'VHS',
      thumb: vhs,
      params: {
        thickDistort: 1,
        fineDistort: 0.5,
        position: 0,
        linesAmount: 0.4,
        width: 1,
        static: 0,
      },
    },
    {
      name: 'Warp',
      thumb: warp,
      params: {
        thickDistort: 2,
        fineDistort: 0.2,
        position: 0.8,
        linesAmount: 0,
        width: 0.1,
        static: 0,
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

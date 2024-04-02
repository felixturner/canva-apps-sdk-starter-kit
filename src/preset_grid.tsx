import * as React from 'react';
import { Grid, Box, Title } from '@canva/app-ui-kit';
import { Preset } from './preset';

export const PresetGrid = () => {
  return (
    <Grid alignX="stretch" alignY="stretch" columns={3} spacing="1u">
      <Preset label="Preset 1" />
      <Preset label="Preset 2" />
      <Preset label="Preset 3" />
      <Preset label="Preset 4" />
      <Preset label="Preset 5" />
      <Preset label="Preset 6" />
    </Grid>
  );
};

import { Box, Text, ImageCard, Title, Rows } from '@canva/app-ui-kit';
import * as React from 'react';

export const Preset = (props) => {
  const { label, onPresetClick, presetState, thumb } = props;

  const onClick = () => {
    onPresetClick(presetState);
  };

  return (
    <Box borderRadius="none">
      <Rows spacing="0.5u">
        <ImageCard
          alt={label}
          ariaLabel={label}
          borderRadius="standard"
          onClick={onClick}
          thumbnailUrl={thumb}
          thumbnailHeight={100}
        />
        <Text size="small" alignment="center">
          {label}
        </Text>
      </Rows>
    </Box>
  );
};

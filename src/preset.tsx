import { Box, Text, ImageCard, Title, Rows } from '@canva/app-ui-kit';
import * as React from 'react';

export const Preset = (props) => {
  const { label, onPresetClick, thumb, selected } = props;

  return (
    <Box borderRadius="none">
      <Rows spacing="0.5u">
        <ImageCard
          alt={label}
          ariaLabel={label}
          borderRadius="standard"
          onClick={onPresetClick}
          thumbnailUrl={thumb}
          thumbnailHeight={100}
          selectable={true}
          selected={selected}
        />
        <Text size="small" alignment="center">
          {label}
        </Text>
      </Rows>
    </Box>
  );
};

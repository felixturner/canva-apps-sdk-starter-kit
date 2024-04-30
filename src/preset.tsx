import { Box, Text, ImageCard, Title, Rows } from '@canva/app-ui-kit';
import * as React from 'react';

export const Preset = (props) => {
  const { label, onPresetClick, thumb, selected, disabled } = props;

  return (
    <Box borderRadius="none">
      <Rows spacing="0.5u">
        <ImageCard
          alt={label}
          ariaLabel={label}
          borderRadius="standard"
          onClick={!disabled ? onPresetClick : null}
          thumbnailUrl={thumb}
          thumbnailHeight={100}
          selectable={!disabled}
          selected={selected}
        />
        <Text size="small" alignment="center">
          {label}
        </Text>
      </Rows>
    </Box>
  );
};

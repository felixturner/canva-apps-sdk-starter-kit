import { Box, Text, ImageCard, Title, Rows } from '@canva/app-ui-kit';
import * as React from 'react';
import { appProcess } from '@canva/preview/platform';

export const Preset = (props) => {
  const { label, onPresetClick, presetState } = props;

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
          thumbnailUrl="https://www.canva.dev/example-assets/image-import/grass-image-thumbnail.jpg"
          thumbnailHeight={75}
        />
        <Text size="small" alignment="center">
          {label}
        </Text>
      </Rows>
    </Box>
  );
};

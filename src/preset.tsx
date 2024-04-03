import { Box, Text, ImageCard, Title, Rows } from '@canva/app-ui-kit';
import * as React from 'react';
import { appProcess } from '@canva/preview/platform';
import none from 'assets/images/thumbs/trippy/none.png';

export const Preset = (props) => {
  const { label, onPresetClick, presetState, thumb = none } = props;

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
          thumbnailHeight={70}
        />
        <Text size="small" alignment="center">
          {label}
        </Text>
      </Rows>
    </Box>
  );
};

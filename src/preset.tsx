import { Box, Text, ImageCard, Title, Rows } from '@canva/app-ui-kit';
import * as React from 'react';

export const Preset = (props) => {
  const { label } = props;
  return (
    <Box borderRadius="none">
      <Rows spacing="0.5u">
        <ImageCard
          alt="grass image"
          ariaLabel="Add image to design"
          borderRadius="standard"
          onClick={() => {}}
          onDragStart={() => {}}
          thumbnailUrl="https://www.canva.dev/example-assets/image-import/grass-image-thumbnail.jpg"
          thumbnailHeight={100}
        />
        <Text size="small" alignment="center">
          {label}
        </Text>
      </Rows>
    </Box>
  );
};

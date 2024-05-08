import {
  Box,
  Text,
  ImageCard,
  Title,
  Rows,
  SlidersIcon,
} from '@canva/app-ui-kit';
import * as React from 'react';
import { IconButton } from './icon_button';

export const Preset = (props) => {
  const { label, onPresetClick, thumb, selected, disabled } = props;

  return (
    <Box borderRadius="none">
      <Rows spacing="0.5u">
        <div
          style={{
            position: 'relative',
          }}
        >
          {!disabled && selected && <IconButton />}

          <ImageCard
            alt={label}
            ariaLabel={label}
            borderRadius="standard"
            onClick={!disabled ? onPresetClick : null}
            thumbnailUrl={thumb}
            thumbnailHeight={undefined}
            selectable={!disabled}
            selected={selected}
            disabled="true"
          />
        </div>
        <Text size="small" alignment="center">
          {label}
        </Text>
      </Rows>
    </Box>
  );
};

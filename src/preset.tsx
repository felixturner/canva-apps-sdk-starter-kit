import {
  Box,
  Text,
  ImageCard,
  Title,
  Rows,
  SlidersIcon,
} from '@canva/app-ui-kit';
import * as React from 'react';

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
          <div
            style={{
              position: 'absolute',
              width: '100px',
              height: '100px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: '2',
              pointerEvents: 'none',
            }}
          >
            {!disabled && selected && <SlidersIcon />}
          </div>
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
        </div>
        <Text size="small" alignment="center">
          {label}
        </Text>
      </Rows>
    </Box>
  );
};

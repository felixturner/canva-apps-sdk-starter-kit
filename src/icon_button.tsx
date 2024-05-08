import {
  Box,
  Text,
  ImageCard,
  Title,
  Rows,
  SlidersIcon,
} from '@canva/app-ui-kit';
import * as React from 'react';

export const IconButton = () => {
  return (
    <div
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: '2',
        pointerEvents: 'none',
        color: 'var(--ui-kit-color-primary)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: '36px',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          backgroundColor: '#FFF',
          borderRadius: '50%',
        }}
      >
        <SlidersIcon />
      </div>
    </div>
  );
};

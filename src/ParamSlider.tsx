import * as React from 'react';
import { Rows, FormField, Button, Slider, Text } from '@canva/app-ui-kit';
import { appProcess } from '@canva/preview/platform';

export const ParamSlider = (props) => {
  const { label, paramName } = props;
  return (
    <FormField
      label={label}
      value={state.angle}
      control={(props) => (
        <Slider
          {...props}
          defaultValue={initialState.angle}
          min={0}
          max={1}
          step={0.01}
          value={state.angle}
          onChange={(value) => {
            setState((prevState) => {
              return {
                ...prevState,
                angle: value,
              };
            });
            appProcess.broadcastMessage({
              ...state,
              angle: value,
            });
          }}
        />
      )}
    />
  );
};

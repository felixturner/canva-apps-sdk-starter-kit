import * as React from 'react';
import { FormField, Slider, Box } from '@canva/app-ui-kit';

export const ParamSlider = (props) => {
  const { label, paramName, min, max, step, defaultValue, value, onChange } =
    props;

  const handleSliderChange = (value) => {
    onChange(paramName, value);
  };
  return (
    <FormField
      label={label}
      control={() => (
        <Box paddingStart="2u">
          <Slider
            defaultValue={defaultValue}
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={handleSliderChange}
          />
        </Box>
      )}
    />
  );
};

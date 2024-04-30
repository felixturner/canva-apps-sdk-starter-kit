import * as React from 'react';
import { FormField, Slider, Box } from '@canva/app-ui-kit';

export const ParamSlider = (props) => {
  const {
    label,
    paramName,
    min,
    max,
    origin,
    step,
    defaultValue,
    value,
    onChange,
    disabled,
  } = props;

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
            origin={origin}
            disabled={disabled}
            onChange={handleSliderChange}
          />
        </Box>
      )}
    />
  );
};

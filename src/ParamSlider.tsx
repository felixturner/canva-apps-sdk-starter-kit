import * as React from 'react';
import { FormField, Slider } from '@canva/app-ui-kit';

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
        <Slider
          defaultValue={defaultValue}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleSliderChange}
        />
      )}
    />
  );
};

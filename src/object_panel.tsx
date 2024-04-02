import * as React from 'react';
import { Rows, Button, Text } from '@canva/app-ui-kit';
import styles from 'styles/components.css';
import { appProcess } from '@canva/preview/platform';
import { useOverlay } from 'utils/use_overlay_hook';
import { useSelection } from 'utils/use_selection_hook';
import { getTemporaryUrl } from '@canva/asset';
import { LaunchParams, UIState } from './app';
import { PresetGrid } from './preset_grid';
import { ParamSlider } from './ParamSlider';

const initialState: UIState = {
  rgbAmount: 0,
  rgbAngle: 0,
  jitterAmount: 0,
  jitterSeed: 0,
  solarAmount: 0,
  solarBrightness: 0.5,
  solarPower: 2,
};

export const ObjectPanel = () => {
  const {
    canOpen,
    isOpen,
    open,
    close: closeOverlay,
  } = useOverlay('image_selection');
  const selection = useSelection('image');
  const [state, setState] = React.useState<UIState>(initialState);

  const onSliderChange = (paramName, value) => {
    //setCount(count + 1);

    console.log(paramName, value);

    setState((prevState) => {
      return {
        ...prevState,
        [paramName]: value,
      };
    });
    appProcess.broadcastMessage({
      ...state,
      [paramName]: value,
    });
  };

  const openOverlay = async () => {
    const draft = await selection.read();
    if (draft.contents.length !== 1) {
      return;
    }
    const { url } = await getTemporaryUrl({
      type: 'IMAGE',
      ref: draft.contents[0].ref,
    });

    open({
      launchParameters: {
        rgbAmount: state.rgbAmount,
        rgbAngle: state.rgbAngle,
        jitterAmount: state.jitterAmount,
        jitterSeed: state.jitterSeed,
        solarAmount: state.solarAmount,
        solarBrightness: state.solarBrightness,
        solarPower: state.solarPower,
        selectedImageUrl: url,
      } satisfies LaunchParams,
    });
  };

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="1u">
        {isOpen ? (
          <>
            <PresetGrid />
            <ParamSlider
              label="RGB Amount"
              paramName="rgbAmount"
              min="0"
              max="5"
              step="0.01"
              defaultValue={initialState.rgbAmount}
              value={state.rgbAmount}
              onChange={onSliderChange}
            />

            <ParamSlider
              label="RGB Angle"
              paramName="rgbAngle"
              min="0"
              max="1"
              step="0.01"
              defaultValue={initialState.rgbAngle}
              value={state.rgbAngle}
              onChange={onSliderChange}
            />
            <ParamSlider
              label="Jitter Amount"
              paramName="jitterAmount"
              min="0"
              max="1"
              step="0.01"
              defaultValue={initialState.jitterAmount}
              value={state.jitterAmount}
              onChange={onSliderChange}
            />
            <ParamSlider
              label="Solarize Amount"
              paramName="solarAmount"
              min="0"
              max="1"
              step="0.01"
              defaultValue={initialState.solarAmount}
              value={state.solarAmount}
              onChange={onSliderChange}
            />
            <ParamSlider
              label="Solarize Brightness"
              paramName="solarBrightness"
              min="0.2"
              max="0.8"
              step="0.01"
              defaultValue={initialState.solarBrightness}
              value={state.solarBrightness}
              onChange={onSliderChange}
            />

            <Button
              variant="primary"
              onClick={() => {
                closeOverlay({ reason: 'completed' });
              }}
              stretch
            >
              Save
            </Button>
            <Button
              variant="secondary"
              onClick={() => closeOverlay({ reason: 'aborted' })}
              stretch
            >
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Text size="medium">
              Glicth out your image and save to libary. Where's your Head At?
            </Text>
            <Button
              variant="primary"
              onClick={openOverlay}
              disabled={!canOpen}
              stretch
            >
              Edit Image
            </Button>
          </>
        )}
      </Rows>
    </div>
  );
};
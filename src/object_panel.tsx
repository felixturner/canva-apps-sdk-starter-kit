import * as React from 'react';
import { Rows, FormField, Button, Slider, Text } from '@canva/app-ui-kit';
import styles from 'styles/components.css';
import { appProcess } from '@canva/preview/platform';
import { useOverlay } from 'utils/use_overlay_hook';
import { useSelection } from 'utils/use_selection_hook';
import { getTemporaryUrl, upload } from '@canva/asset';
import { LaunchParams, UIState } from './app';
import { PresetGrid } from './preset_grid';

const initialState: UIState = {
  rgbAmount: 0,
  rgbAngle: 0,
  jitterAmount: 0,
  jitterSeed: 0,
  solarAmount: 0,
  solarBrightness: 0.5,
  solarPower: 1,
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
            <FormField
              label="Amount"
              value={state.rgbAmount}
              control={(props) => (
                <Slider
                  {...props}
                  defaultValue={initialState.rgbAmount}
                  min={0}
                  max={5}
                  step={0.01}
                  value={state.rgbAmount}
                  onChange={(value) => {
                    setState((prevState) => {
                      return {
                        ...prevState,
                        rgbAmount: value,
                      };
                    });
                    appProcess.broadcastMessage({
                      ...state,
                      rgbAmount: value,
                    });
                  }}
                />
              )}
            />
            <FormField
              label="Angle"
              value={state.rgbAngle}
              control={(props) => (
                <Slider
                  {...props}
                  defaultValue={initialState.rgbAngle}
                  min={0}
                  max={1}
                  step={0.01}
                  value={state.rgbAngle}
                  onChange={(value) => {
                    setState((prevState) => {
                      return {
                        ...prevState,
                        rgbAngle: value,
                      };
                    });
                    appProcess.broadcastMessage({
                      ...state,
                      rgbAngle: value,
                    });
                  }}
                />
              )}
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

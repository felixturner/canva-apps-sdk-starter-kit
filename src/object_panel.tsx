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
  solarAmount: 0,
};

function isSupportedMimeType(
  input: string
): input is 'image/jpeg' | 'image/heic' | 'image/png' | 'image/webp' {
  // This does not include "image/svg+xml"
  const mimeTypes = ['image/jpeg', 'image/heic', 'image/png', 'image/webp'];
  return mimeTypes.includes(input);
}

export const ObjectPanel = () => {
  const {
    canOpen,
    isOpen,
    open,
    close: closeOverlay,
  } = useOverlay('image_selection');
  const selection = useSelection('image');
  const [state, setState] = React.useState<UIState>(initialState);

  const handlePresetClick = (presetState) => {
    setState(presetState);
    appProcess.broadcastMessage(presetState);
  };

  const onSliderChange = (paramName, value) => {
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

    //download image and check mimeType
    const { url } = await getTemporaryUrl({
      type: 'IMAGE',
      ref: draft.contents[0].ref,
    });
    const response = await fetch(url, { mode: 'cors' });
    const imageBlob = await response.blob();
    const mimeType = imageBlob.type;
    //webGL can't load SVG
    if (!isSupportedMimeType(mimeType)) {
      throw new Error(`Unsupported mime type: ${mimeType}`);
    }

    open({
      launchParameters: {
        selectedImageUrl: url,
        selectedImageMime: mimeType,
        sliderParams: state,
      } satisfies LaunchParams,
    });
  };

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="1u">
        {isOpen ? (
          <>
            <PresetGrid handlePresetClick={handlePresetClick} />
            <ParamSlider
              label="RGB Shift"
              paramName="rgbAmount"
              min="0"
              max="0.1"
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
              label="Jitter"
              paramName="jitterAmount"
              min="0"
              max="0.5"
              step="0.01"
              defaultValue={initialState.jitterAmount}
              value={state.jitterAmount}
              onChange={onSliderChange}
            />
            <ParamSlider
              label="Solarize"
              paramName="solarAmount"
              min="0"
              max="1"
              step="0.01"
              defaultValue={initialState.solarAmount}
              value={state.solarAmount}
              onChange={onSliderChange}
            />
            {/* <ParamSlider
              label="Brightness"
              paramName="solarBrightness"
              min="0.2"
              max="0.8"
              step="0.01"
              defaultValue={initialState.solarBrightness}
              value={state.solarBrightness}
              onChange={onSliderChange}
            /> */}

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
            <Rows spacing="2u">
              <Text size="large">
                Glitch out your image with some psychedelic flavor. Where's your
                head at?
              </Text>
              <Button
                variant="primary"
                onClick={openOverlay}
                disabled={!canOpen}
                stretch
              >
                Edit Image
              </Button>
            </Rows>
          </>
        )}
      </Rows>
    </div>
  );
};

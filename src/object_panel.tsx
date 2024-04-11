import * as React from 'react';
import { ImageCard, Rows, Button, Text } from '@canva/app-ui-kit';
import styles from 'styles/components.css';
import { appProcess } from '@canva/preview/platform';
import { useOverlay } from 'utils/use_overlay_hook';
import { useSelection } from 'utils/use_selection_hook';
import { getTemporaryUrl } from '@canva/asset';
import { LaunchParams, UIState } from './app';
import { PresetGrid } from './preset_grid';
import { ParamSlider } from './ParamSlider';
import featured from 'assets/images/colormix/featured.jpg';

const initialState: UIState = {
  hueOffset: 0,
  saturation: 0,
  rainbowAmount: 0,
  rainbowOffset: 0,
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
              label="Hue Offset"
              paramName="hueOffset"
              min="-1"
              max="1"
              step="0.01"
              defaultValue={initialState.hueOffset}
              value={state.hueOffset}
              onChange={onSliderChange}
            />
            <ParamSlider
              label="Saturation"
              paramName="saturation"
              min="-1"
              max="1"
              step="0.01"
              defaultValue={initialState.saturation}
              value={state.saturation}
              onChange={onSliderChange}
            />
            <ParamSlider
              label="Rainbow Amount"
              paramName="rainbowAmount"
              min="0"
              max="0.8"
              step="0.01"
              defaultValue={initialState.rainbowAmount}
              value={state.rainbowAmount}
              onChange={onSliderChange}
            />
            <ParamSlider
              label="Rainbow Offset"
              paramName="rainbowOffset"
              min="0"
              max="2"
              step="0.01"
              defaultValue={initialState.rainbowOffset}
              value={state.rainbowOffset}
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
            <Rows spacing="2u">
              <ImageCard
                alt="Featured"
                ariaLabel="Featured"
                borderRadius="standard"
                onClick={() => {}}
                thumbnailUrl={featured}
              />
              <Text size="large">
                Look at the world with rainbow-colored lenses. These fun color
                palettes will brighten up any photo in a totally unique way.
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

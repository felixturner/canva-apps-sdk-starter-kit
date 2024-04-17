import * as React from 'react';
import { ImageCard, Rows, Button, Text, Alert } from '@canva/app-ui-kit';
import styles from 'styles/components.css';
import { appProcess } from '@canva/preview/platform';
import { useOverlay } from 'utils/use_overlay_hook';
import { useSelection } from 'utils/use_selection_hook';
import { getTemporaryUrl } from '@canva/asset';
import { LaunchParams, UIState } from './app';
import { PresetGrid } from './preset_grid';
import { ParamSlider } from './ParamSlider';

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
  const [SVGError, setSVGError] = React.useState(false);
  const [multipleSelectionError, setMultipleSelectionError] =
    React.useState(false);

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
      setSVGError(true);
      return;
    }

    open({
      launchParameters: {
        selectedImageUrl: url,
        selectedImageMime: mimeType,
        sliderParams: state,
      } satisfies LaunchParams,
    });
  };

  React.useEffect(() => {
    setSVGError(false);
    setMultipleSelectionError(false);
    async function checkSelection() {
      const draft = await selection.read();
      if (draft.contents.length > 1) {
        setMultipleSelectionError(true);
      }
    }
    checkSelection();
  }, [selection]);

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="1u">
        {isOpen ? (
          <>
            <PresetGrid handlePresetClick={handlePresetClick} />
            <ParamSlider
              label="Hue offset"
              paramName="hueOffset"
              min="-1"
              max="1"
              step="0.01"
              origin="0"
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
              origin="0"
              defaultValue={initialState.saturation}
              value={state.saturation}
              onChange={onSliderChange}
            />
            <ParamSlider
              label="Rainbow amount"
              paramName="rainbowAmount"
              min="0"
              max="0.8"
              step="0.01"
              defaultValue={initialState.rainbowAmount}
              value={state.rainbowAmount}
              onChange={onSliderChange}
            />
            <ParamSlider
              label="Rainbow offset"
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
              <Text size="medium">Select an image to start editing</Text>
              <Button
                variant="primary"
                onClick={openOverlay}
                disabled={!canOpen}
                stretch
              >
                Edit image
              </Button>
              {SVGError && (
                <Alert tone="critical">
                  ColorMix cannot load SVG images. Please load JPG or PNG
                  images.
                </Alert>
              )}
              {multipleSelectionError && (
                <Alert tone="critical">Select a single image to proceed.</Alert>
              )}
            </Rows>
          </>
        )}
      </Rows>
    </div>
  );
};

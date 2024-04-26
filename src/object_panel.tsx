import * as React from 'react';
import { Rows, Button, Text, Alert } from '@canva/app-ui-kit';
import styles from 'styles/components.css';
import { appProcess } from '@canva/preview/platform';
import { useOverlay } from 'utils/use_overlay_hook';
import { useSelection } from 'utils/use_selection_hook';
import { getTemporaryUrl } from '@canva/asset';
import { LaunchParams, EffectParams } from './app';
import { PresetGrid } from './preset_grid';
import { ParamSlider } from './ParamSlider';

const initialParams: EffectParams = {
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
  const [params, setParams] = React.useState<EffectParams>(initialParams);
  const [SVGError, setSVGError] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [imageURL, setImageURL] = React.useState('');
  const [mimeType, setMimeType] = React.useState('');
  const [multipleSelectionError, setMultipleSelectionError] =
    React.useState(false);

  const handlePresetClick = (presetParams) => {
    setParams(presetParams);
    appProcess.broadcastMessage(presetParams);
  };

  const onSliderChange = (paramName, value) => {
    setParams((prevParams) => {
      return {
        ...prevParams,
        [paramName]: value,
      };
    });
    appProcess.broadcastMessage({
      ...params,
      [paramName]: value,
    });
  };

  const openOverlay = async () => {
    setImageLoaded(false);
    const draft = await selection.read();
    if (draft.contents.length !== 1) {
      return;
    }

    //reset params (not immediate!!)
    setParams(initialParams);

    open({
      launchParameters: {
        selectedImageUrl: imageURL,
        selectedImageMime: mimeType,
        effectParams: initialParams, //open with default params
      } satisfies LaunchParams,
    });
  };

  React.useEffect(() => {
    async function checkSelection() {
      setMultipleSelectionError(false);
      setSVGError(false);
      const draft = await selection.read();
      if (draft.contents.length === 0) {
        return;
      }
      //check for single image
      if (draft.contents.length > 1) {
        setMultipleSelectionError(true);
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
      setImageURL(url);
      setMimeType(mimeType);
    }
    checkSelection();
  }, [selection]);

  React.useEffect(() => {
    // listen for if image is loaded in webgl to enable save button
    return void appProcess.registerOnMessage((_, message) => {
      if (!message) {
        return;
      }
      if (message === 'image-loaded') setImageLoaded(true);
    });
  }, []);

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
              defaultValue={initialParams.hueOffset}
              value={params.hueOffset}
              onChange={onSliderChange}
            />
            <ParamSlider
              label="Saturation"
              paramName="saturation"
              min="-1"
              max="1"
              step="0.01"
              origin="0"
              defaultValue={initialParams.saturation}
              value={params.saturation}
              onChange={onSliderChange}
            />
            <ParamSlider
              label="Rainbow amount"
              paramName="rainbowAmount"
              min="0"
              max="0.8"
              step="0.01"
              defaultValue={initialParams.rainbowAmount}
              value={params.rainbowAmount}
              onChange={onSliderChange}
            />
            <ParamSlider
              label="Rainbow offset"
              paramName="rainbowOffset"
              min="0"
              max="2"
              step="0.01"
              defaultValue={initialParams.rainbowOffset}
              value={params.rainbowOffset}
              onChange={onSliderChange}
            />
            <Button
              variant="primary"
              onClick={() => {
                closeOverlay({ reason: 'completed' });
              }}
              stretch
              disabled={!imageLoaded}
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
              {SVGError && (
                <Alert tone="critical">
                  Select a JPG or PNG image to proceed.
                </Alert>
              )}
              {multipleSelectionError && (
                <Alert tone="critical">Select a single image to proceed.</Alert>
              )}
              <Text size="medium">Select an image to start editing</Text>
              <Button
                variant="primary"
                onClick={openOverlay}
                disabled={!canOpen}
                stretch
              >
                Edit image
              </Button>
            </Rows>
          </>
        )}
      </Rows>
    </div>
  );
};

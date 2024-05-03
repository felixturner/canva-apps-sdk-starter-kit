import * as React from 'react';
import { Rows, Button, Alert, LoadingIndicator } from '@canva/app-ui-kit';
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
  const [isSVGSelected, setIsSVGSelected] = React.useState<boolean>(false);
  const [isNothingSelected, setIsNothingSelected] =
    React.useState<boolean>(false);
  const [isMultipleSelected, setIsMultipleSelected] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState<boolean>(false);
  const [isSaving, setIsSaving] = React.useState<boolean>(false);

  const handlePresetClick = (presetParams) => {
    setParams(presetParams);
    appProcess.broadcastMessage(presetParams);
  };

  const handleResetClick = () => {
    setParams(initialParams);
    appProcess.broadcastMessage(initialParams);
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

  React.useEffect(() => {
    async function checkSelection() {
      console.log('CHECK SELECTION');
      const draft = await selection.read();
      setIsSVGSelected(false);
      setIsMultipleSelected(false);
      //check for no selection
      if (draft.contents.length === 0) {
        setIsNothingSelected(true);
        return;
      }
      //check for multiple images
      if (draft.contents.length > 1) {
        setIsMultipleSelected(true);
        setIsNothingSelected(false);
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
        setIsSVGSelected(true);
        setIsNothingSelected(false);
        return;
      }

      if (draft.contents.length === 1) {
        setIsNothingSelected(false);
        //OPEN OVERLAY
        setImageLoaded(false);
        //reset params (not immediate!!)
        setParams(initialParams);
        console.log('OPEN OVERLAY');
        open({
          launchParameters: {
            imageBlob: imageBlob,
            mimeType: mimeType,
            effectParams: initialParams, //open with default params
          } satisfies LaunchParams,
        });

        return;
      }
    }
    checkSelection();
  }, [selection]);

  React.useEffect(() => {
    // listen for if image is loaded in webgl to enable save button
    return void appProcess.registerOnMessage((_, message) => {
      if (!message) {
        return;
      }

      console.log('MESSAGEE', message);
      if (message === 'image-loaded') setImageLoaded(true);
      //FIXME - doesnt work
      if (message === 'saveStart') setIsSaving(true);
      if (message === 'saveEnd') setIsSaving(false);
    });
  }, []);

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="1u">
        <>
          {isNothingSelected && (
            <Alert tone="info">
              Select an image to start mixing its colors.
            </Alert>
          )}
          {isSVGSelected && (
            <Alert tone="critical">Select a JPG or PNG image to proceed.</Alert>
          )}
          {isMultipleSelected && (
            <Alert tone="critical">Select a single image to proceed.</Alert>
          )}
          <PresetGrid
            handlePresetClick={handlePresetClick}
            disabled={!isOpen}
          />
          {!isNothingSelected && !isMultipleSelected && (
            <>
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
                disabled={!isOpen}
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
                disabled={!isOpen}
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
                disabled={!isOpen}
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
                disabled={!isOpen}
              />
              <Button
                variant="primary"
                onClick={() => {
                  closeOverlay({ reason: 'completed' });
                }}
                stretch
                disabled={!imageLoaded || !isOpen}
                loading={isSaving}
              >
                Apply
              </Button>
              <Button
                variant="secondary"
                onClick={handleResetClick}
                stretch
                disabled={!isOpen}
              >
                Reset
              </Button>
            </>
          )}
        </>
      </Rows>
    </div>
  );
};

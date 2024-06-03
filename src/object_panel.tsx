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
  halftoneAmount: 0,
  halftoneScale: 1,
  linoAmount: 0,
  linoScale: 1,
};

export const ObjectPanel = () => {
  const {
    canOpen,
    isOpen,
    open,
    close: closeOverlay,
  } = useOverlay('image_selection');
  const selection = useSelection('image');
  const [selectedPresetIndex, setSelectedPresetIndex] = React.useState(0);
  const [savedPresetIndex, setSavedPresetIndex] = React.useState(0);
  const [params, setParams] = React.useState<EffectParams>(initialParams);
  const [isNothingSelected, setIsNothingSelected] =
    React.useState<boolean>(false);
  const [isMultipleSelected, setIsMultipleSelected] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState<boolean>(false);
  const [isSaving, setIsSaving] = React.useState<boolean>(false);
  const [isValidSelection, setIsValidSelection] =
    React.useState<boolean>(false);
  const [imageBlob, setImageBlob] = React.useState<Blob | undefined>();
  const [mimeType, setMimeType] = React.useState<string>('');

  const handlePresetClick = (presetParams) => {
    if (!isOpen) {
      //OPEN OVERLAY
      setImageLoaded(false);
      open({
        launchParameters: {
          imageBlob: imageBlob,
          mimeType: mimeType,
          effectParams: presetParams, //open with default params
        } satisfies LaunchParams,
      });
    }

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

  const onSave = () => {
    setSavedPresetIndex(selectedPresetIndex);
    closeOverlay({ reason: 'completed' });
  };

  const onCancel = () => {
    setSelectedPresetIndex(savedPresetIndex);
    closeOverlay({ reason: 'aborted' });
  };

  React.useEffect(() => {
    async function checkSelection() {
      const draft = await selection.read();
      setIsMultipleSelected(false);
      setIsValidSelection(false);
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
      setImageBlob(imageBlob);
      setMimeType(mimeType);

      if (draft.contents.length === 1) {
        setIsNothingSelected(false);
        setIsValidSelection(true);
        setSavedPresetIndex(0);
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

      if (message === 'image-loaded') setImageLoaded(true);

      // if (message === 'overlay-closed') {
      //   //overlay was closed reset preset to 'none'
      //   setParams(initialParams);
      // }
    });
  }, []);

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="3u">
        <>
          {isNothingSelected && (
            <Alert tone="info">Select an image to apply an effect.</Alert>
          )}

          {isMultipleSelected && (
            <Alert tone="critical">
              Select a single image to apply an effect.
            </Alert>
          )}
          <PresetGrid
            handlePresetClick={handlePresetClick}
            disabled={!isValidSelection}
            setSelectedPresetIndex={setSelectedPresetIndex}
            selectedPresetIndex={selectedPresetIndex}
          />
          {isOpen && (
            <>
              {selectedPresetIndex !== 0 && (
                <Rows spacing="2u">
                  <ParamSlider
                    label="Halftone amount"
                    paramName="halftoneAmount"
                    min="0"
                    max="1"
                    step="0.01"
                    origin="0"
                    defaultValue={initialParams.halftoneAmount}
                    value={params.halftoneAmount}
                    onChange={onSliderChange}
                    disabled={!isOpen}
                  />
                  <ParamSlider
                    label="Halftone scale"
                    paramName="halftoneScale"
                    min="1"
                    max="3"
                    step="0.01"
                    origin="0"
                    defaultValue={initialParams.halftoneScale}
                    value={params.halftoneScale}
                    onChange={onSliderChange}
                    disabled={!isOpen}
                  />
                  <ParamSlider
                    label="Linocut amount"
                    paramName="linoAmount"
                    min="0"
                    max="1"
                    step="0.01"
                    defaultValue={initialParams.linoAmount}
                    value={params.linoAmount}
                    onChange={onSliderChange}
                    disabled={!isOpen}
                  />
                  <ParamSlider
                    label="Linocut scale"
                    paramName="linoScale"
                    min="0.5"
                    max="1.5"
                    step="0.01"
                    defaultValue={initialParams.linoScale}
                    value={params.linoScale}
                    onChange={onSliderChange}
                    disabled={!isOpen}
                  />
                </Rows>
              )}
              <Rows spacing="1u">
                <Button
                  variant="primary"
                  onClick={() => {
                    onSave();
                  }}
                  stretch
                  disabled={!imageLoaded || !isOpen}
                  loading={isSaving}
                >
                  Save
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    onCancel();
                  }}
                  stretch
                  disabled={!isOpen}
                >
                  Cancel
                </Button>
              </Rows>
            </>
          )}
        </>
      </Rows>
    </div>
  );
};

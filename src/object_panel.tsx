import { Rows, FormField, Button, Slider } from '@canva/app-ui-kit';
import * as React from 'react';
import styles from 'styles/components.css';
import { appProcess } from '@canva/preview/platform';
import { useOverlay } from 'utils/use_overlay_hook';
import { useSelection } from 'utils/use_selection_hook';
import { getTemporaryUrl, upload } from '@canva/asset';
import { LaunchParams } from './app';

import { getOutputURL } from './webgl/main';

type UIState = {
  brushSize: number;
};
const initialState: UIState = {
  brushSize: 0.5,
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
        brushSize: state.brushSize,
        selectedImageUrl: url,
      } satisfies LaunchParams,
    });
  };

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        {isOpen ? (
          <>
            <FormField
              label="Amount"
              value={state.brushSize}
              control={(props) => (
                <Slider
                  {...props}
                  defaultValue={initialState.brushSize}
                  min={0}
                  max={5}
                  step={0.01}
                  value={state.brushSize}
                  onChange={(value) => {
                    setState((prevState) => {
                      return {
                        ...prevState,
                        brushSize: value,
                      };
                    });
                    appProcess.broadcastMessage({
                      ...state,
                      brushSize: value,
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
              variant="primary"
              onClick={() => closeOverlay({ reason: 'aborted' })}
              stretch
            >
              Cancel
            </Button>
          </>
        ) : (
          <>
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

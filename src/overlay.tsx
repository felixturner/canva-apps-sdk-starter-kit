// @ts-nocheck

import * as React from 'react';
import { AppProcessInfo } from 'sdk/preview/platform';
import { LaunchParams, UIState } from './app';
import { upload } from '@canva/asset';
import { useSelection } from 'utils/use_selection_hook';
import { appProcess } from '@canva/preview/platform';
import styles from 'styles/components.css';

import { loadImageURL, initGL, setParams, getOutputURL } from './webgl/main';

type OverlayProps = {
  context: AppProcessInfo<LaunchParams>;
};

export const Overlay = (props: OverlayProps) => {
  console.log('>>>TOP LEVEL OVERLAY COMP');
  const { context: appContext } = props;
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const selection = useSelection('image');

  React.useEffect(() => {
    console.log('>>>IN USE EFFECT');
    if (!appContext.launchParams) {
      return;
    }

    console.log(window.innerWidth, window.innerHeight);
    const { selectedImageUrl, ...uiState } = appContext.launchParams;

    //CREATE WEBGL CANVAS HERE
    const canvas = canvasRef.current;
    if (!canvas) {
      throw new Error('no canvas');
    }
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initGL(canvas);
    loadImageURL(selectedImageUrl);
    //set inital params
    setParams(uiState);

    // set up message handler
    return void appProcess.registerOnMessage((_, message) => {
      if (!message) {
        return;
      }
      //HANDLE SLIDER CHANGES HERE
      setParams(message as UIState);
    });
  }, []);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !selection || selection.count !== 1) {
      return;
    }

    return void appProcess.current.setOnDispose(async ({ reason }) => {
      console.log('setOnDispose', reason);
      if (reason === 'aborted') {
        // console.log('ABORT');
        return;
      } else if (reason === 'completed') {
        //SAVE WEBGL CANVAS HERE
        // console.log('SAVING RESULT!!!', reason);
        // const outputURL = await getOutputURL('image/png'); //  = await loadImageRef(content.ref);
        // console.log('outputURL', outputURL);
        // const draft = await selection.read();
        // console.log('draft', draft);
        // const queueImage = await upload({
        //   type: 'IMAGE',
        //   mimeType: 'image/png',
        //   url: outputURL,
        //   thumbnailUrl: outputURL,
        //   width: canvas.width,
        //   height: canvas.height,
        //   parentRef: draft.contents[0].ref,
        // });
        // draft.contents[0].ref = queueImage.ref;
        // await draft.save();
      }
    });
  }, [selection]);

  return <canvas ref={canvasRef} className={styles.canvas} />;
};

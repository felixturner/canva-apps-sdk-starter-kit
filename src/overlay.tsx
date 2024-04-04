import * as React from 'react';
import { AppProcessInfo } from 'sdk/preview/platform';
import { LaunchParams, UIState } from './app';
import { upload } from '@canva/asset';
import { useSelection } from 'utils/use_selection_hook';
import { appProcess } from '@canva/preview/platform';

import { loadImageURL, initGL, setParams, getOutput } from './webgl/main';

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
    const { selectedImageUrl, ...uiState } = appContext.launchParams;

    //create webgl canvas
    const canvas = canvasRef.current;
    if (!canvas) {
      throw new Error('no canvas');
    }
    //match iframe dimensions
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
      //handle slider changes
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
        return;
      } else if (reason === 'completed') {
        //SAVE WEBGL CANVAS HERE
        console.log('SAVING RESULT!!!', reason);
        const output = await getOutput(); //  = await loadImageRef(content.ref);
        console.log('output', output.dataUrl, output.mimeType);
        const draft = await selection.read();
        console.log('draft', draft);
        const queueImage = await upload({
          type: 'IMAGE',
          mimeType: output.mimeType,
          url: output.dataUrl,
          thumbnailUrl: output.dataUrl,
          width: canvas.width,
          height: canvas.height,
          parentRef: draft.contents[0].ref,
        });
        draft.contents[0].ref = queueImage.ref;
        await draft.save();
      }
    });
  }, [selection]);

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />;
};

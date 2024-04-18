import * as React from 'react';
import { AppProcessInfo } from 'sdk/preview/platform';
import { LaunchParams, EffectParams } from './app';
import { upload } from '@canva/asset';
import { useSelection } from 'utils/use_selection_hook';
import { appProcess } from '@canva/preview/platform';

import { initGL, loadImage, setParams, getOutput } from './webgl/main';

type OverlayProps = {
  context: AppProcessInfo<LaunchParams>;
};

export const Overlay = (props: OverlayProps) => {
  const { context: appContext } = props;
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const selection = useSelection('image');
  //force iframe bkgnd to be transparent
  document.documentElement.style.background = 'transparent';

  React.useEffect(() => {
    if (!appContext.launchParams) {
      return;
    }
    const { selectedImageUrl, selectedImageMime, effectParams } =
      appContext.launchParams;
    //create canvas
    const canvas = canvasRef.current;
    if (!canvas) {
      throw new Error('no canvas');
    }
    //match iframe dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initGL(canvas);
    loadImage(selectedImageUrl, selectedImageMime);
    //set inital params
    setParams(effectParams);

    // set up message handler
    return void appProcess.registerOnMessage((_, message) => {
      if (!message) {
        return;
      }
      //handle slider changes
      setParams(message as EffectParams);
    });
  }, []);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !selection || selection.count !== 1) {
      return;
    }

    return void appProcess.current.setOnDispose(async ({ reason }) => {
      if (reason === 'aborted') {
        return;
      } else if (reason === 'completed') {
        //SAVE WEBGL CANVAS HERE
        const output = await getOutput();
        const draft = await selection.read();
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

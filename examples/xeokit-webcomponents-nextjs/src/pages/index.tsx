import { XeoViewerService, type Viewer, XeoModel, XeoViewer } from '@xeokit/xeokit-webcomponents';

export default function Home() {
  return (
    <>
      <XeoViewer id="viewer-1" transparent="true">
        <XeoModel src="https://sos-ch-gva-2.exo.io/creoox-public/example-no-1.xkt" id="model-1"></XeoModel>
      </XeoViewer>
    </>
  );
}

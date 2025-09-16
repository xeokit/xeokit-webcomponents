import { XeoViewerService, type Viewer, XeoModel, XeoViewer } from '@xeokit/xeokit-webcomponents';

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <XeoViewer id="viewer-1" transparent="true">
          <XeoModel src="https://sos-ch-gva-2.exo.io/creoox-public/example-no-1.xkt" id="model-1"></XeoModel>
        </XeoViewer>
      </main>
    </div >
  );
}

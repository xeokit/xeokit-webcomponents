<script setup lang="ts">
import { onMounted } from 'vue'
import { XeoViewerService, type Viewer }from '@xeokit/xeokit-webcomponents';

let viewer: Viewer = null;

function onModelLoaded(event: any) {
  console.log("Custom Model loaded callback", { event });
  viewer.cameraFlight.flyTo({
    aabb: event.detail.model.aabb,
    fitFOV: 45,
    duration: 1.5
  });
}

onMounted(() => {
  viewer = XeoViewerService.getInstance().getViewer("viewer-1");
});
</script>

<template>
  <div id="viewer-container">
    <xeo-viewer id="viewer-1" transparent="true">
      <xeo-model src="https://sos-ch-gva-2.exo.io/creoox-public/example-no-1.ifc" id="model-1" @model-loaded="onModelLoaded"></xeo-model>
    </xeo-viewer>
  </div>
</template>

<style>
body, html, #app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#viewer-container {
  width: 100vw;
  height: 100vh;
}
</style>

function registerEventListener(tagName: string, attributeName: string) {
  const modelComponents = document.getElementsByTagName(tagName);

  Array.from(modelComponents).forEach((modelComponent) => {
    if (modelComponent.hasAttribute(`@${attributeName}`)) {
      const callbackName = modelComponent.getAttribute(`@${attributeName}`);

      if (callbackName) {
        modelComponent?.addEventListener(attributeName, (event: Event) => {
          if (typeof window[callbackName] === 'function') {
            window[callbackName](event);
          }
        });
      }
    }
  });
}

export { registerEventListener };
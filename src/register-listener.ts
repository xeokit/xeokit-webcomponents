function registerEventListener(tagName: string, attributeName: string) {
  const modelComponents = document.getElementsByTagName(tagName);

  Array.from(modelComponents).forEach((modelComponent) => {
    if (modelComponent.hasAttribute(`@${attributeName}`)) {
      const callbackName: string | null = modelComponent.getAttribute(`@${attributeName}`);

      if (callbackName) {
        modelComponent?.addEventListener(attributeName, (event: Event) => {
          const win = window as Window & { [key: string]: any };
          if (typeof win[callbackName] === 'function') {
            win[callbackName](event);
          }
        });
      }
    }
  });
}

export { registerEventListener };
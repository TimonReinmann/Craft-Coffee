export const componentLoader = ((componentName: string, namespace: string = 'components') => {
  const components: NodeListOf<HTMLElement> = document.querySelectorAll(`.${componentName}`);
  if (components && components.length > 0) {
    import(`../${namespace}/${componentName}`)
      .then(({init}) => components.forEach((rootEl) => init(rootEl, componentName)))
      .catch((err) => console.error('Component: ', componentName, ' could not be loaded.', err));
  }
});

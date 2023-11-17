const waitForDOMStabilityScript = `
  const [selector, timeout, debounceTime] = arguments[0];
  const done = arguments[arguments.length - 1];

  const element = document.querySelector(selector);
  if (!element) {
    return done(new Error('Element not found'));
  }

  let debounceTimer;
  const observer = new MutationObserver(() => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      observer.disconnect();
      done(); // DOM is considered stable after debounceTime with no mutations
    }, debounceTime);
  });

  observer.observe(element, { childList: true, subtree: true, attributes: true });

  setTimeout(() => {
    observer.disconnect();
    clearTimeout(debounceTimer);
    done(new Error('Timeout waiting for DOM stability'));
  }, timeout);
`;

// Usage example
// browser.executeAsync(waitForDOMStabilityScript, [
//   selector,
//   timeout,
//   debounceTime,
// ]);

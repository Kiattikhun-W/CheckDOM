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

// -----

const waitForElementStability = async (
  selector,
  config,
  callback,
  timeout = 10000
) => {
  await browser.executeAsync(
    (selector, config, done) => {
      const targetNode = document.querySelector(selector);
      if (!targetNode) {
        return done("Element not found");
      }

      let lastMutationTime = Date.now();
      const observer = new MutationObserver((mutations) => {
        lastMutationTime = Date.now();
      });

      observer.observe(targetNode, config);

      const checkStability = () => {
        if (Date.now() - lastMutationTime > 500) {
          // 500ms of no mutations
          observer.disconnect();
          done(); // Call the callback if provided
        } else {
          setTimeout(checkStability, 100); // Check again after 100ms
        }
      };

      setTimeout(checkStability, 100);
      setTimeout(() => {
        observer.disconnect();
        done("Timeout waiting for element stability");
      }, timeout);
    },
    selector,
    config
  );
};

// Usage
await waitForElementStability("#elementA", {
  attributes: true,
  childList: true,
  subtree: true,
  characterData: true,
});

import '@testing-library/jest-dom';

// jest-environment-jsdom 30 does not expose TextEncoder/TextDecoder, which
// react-dom/server needs when rendering components to markup in tests.
if (typeof globalThis.TextEncoder === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { TextEncoder, TextDecoder } = require('util');
  globalThis.TextEncoder = TextEncoder;
  globalThis.TextDecoder = TextDecoder;
}

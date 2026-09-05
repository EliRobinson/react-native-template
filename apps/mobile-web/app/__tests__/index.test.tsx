import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react-native';
import type { ReactElement } from 'react';

import { getTrpcClientConfig, trpc } from '../../src/lib/trpc';
import HomeScreen from '../index';

// HomeScreen fires a real tRPC query on mount. There's no API running in
// this test, and letting the request actually hit the network can hang
// the process far longer than a real ECONNREFUSED would take.
beforeEach(() => {
  global.fetch = jest.fn(() => Promise.reject(new Error('network disabled in tests')));
});

function renderWithProviders(ui: ReactElement) {
  // Retries disabled: this render doesn't have a live API to hit, and
  // react-query's retry backoff would otherwise keep Jest's process alive
  // well past the test finishing.
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const trpcClient = trpc.createClient(getTrpcClientConfig());

  return render(
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    </trpc.Provider>,
  );
}

// Component tests run once and pass identically whether this screen
// eventually renders on iOS, Android, or the web build.
// RNTL v14 made `render` and `fireEvent` async — both must be awaited.
describe('HomeScreen', () => {
  it('increments the counter on tap', async () => {
    await renderWithProviders(<HomeScreen />);

    expect(screen.getByText('Count: 0')).toBeTruthy();

    await fireEvent.press(screen.getByTestId('increment-button'));
    expect(screen.getByText('Count: 1')).toBeTruthy();
  });
});

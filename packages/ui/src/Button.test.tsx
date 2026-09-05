import { fireEvent, render, screen } from '@testing-library/react-native';

import { Button } from './Button';

// React Native Testing Library v14 made `render` and every `fireEvent`
// helper async, so each one has to be awaited.
describe('Button', () => {
  it('renders its label and handles press', async () => {
    const onPress = jest.fn();
    await render(<Button onPress={onPress}>Continue</Button>);

    expect(screen.getByText('Continue')).toBeTruthy();

    await fireEvent.press(screen.getByText('Continue'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});

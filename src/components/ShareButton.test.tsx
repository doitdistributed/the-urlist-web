// ShareButton.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ShareButton } from './ShareButton';

describe('ShareButton', () => {
  let writeTextMock: ReturnType<typeof vi.fn>;
  const originalClipboard = global.navigator.clipboard;

  beforeEach(() => {
    writeTextMock = vi.fn();
    // @ts-ignore
    global.navigator.clipboard = { writeText: writeTextMock };
  });

  afterEach(() => {
    // @ts-ignore
    global.navigator.clipboard = originalClipboard;
  });

  it('renders button and copies url to clipboard', async () => {
    render(<ShareButton url="https://test.com" />);
    const button = screen.getByRole('button', { name: /share list/i });
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    await waitFor(() => expect(writeTextMock).toHaveBeenCalledWith('https://test.com'));
    expect(screen.getByText(/copied to clipboard/i)).toBeInTheDocument();
  });
});

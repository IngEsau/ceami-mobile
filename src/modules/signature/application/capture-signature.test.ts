import { captureSignatureFromSource } from './capture-signature';

describe('captureSignatureFromSource', () => {
  it('persists a captured signature through the port', async () => {
    const persist = jest.fn().mockResolvedValue(undefined);
    await expect(captureSignatureFromSource({ capture: jest.fn().mockResolvedValue('base64-signature') }, persist)).resolves.toBe(true);
    expect(persist).toHaveBeenCalledWith('base64-signature');
  });
});

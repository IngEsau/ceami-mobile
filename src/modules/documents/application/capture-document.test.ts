import { captureDocumentFromSource } from './capture-document';

describe('captureDocumentFromSource', () => {
  it('persists a selected URI through the supplied port', async () => {
    const persist = jest.fn().mockResolvedValue(undefined);
    const captured = await captureDocumentFromSource({ selectImage: jest.fn().mockResolvedValue('mock://ine_front') }, 'ine_front', persist);
    expect(captured).toBe(true);
    expect(persist).toHaveBeenCalledWith('ine_front', 'mock://ine_front');
  });

  it('does not persist when the user cancels', async () => {
    const persist = jest.fn();
    const captured = await captureDocumentFromSource({ selectImage: jest.fn().mockResolvedValue(null) }, 'selfie', persist);
    expect(captured).toBe(false);
    expect(persist).not.toHaveBeenCalled();
  });
});

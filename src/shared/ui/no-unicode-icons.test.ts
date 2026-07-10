import { readdirSync, readFileSync } from 'fs';
import { join, resolve } from 'path';

const listSourceFiles = (directory: string): string[] => readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const path = join(directory, entry.name);
  if (entry.isDirectory()) return listSourceFiles(path);
  return entry.isFile() && /\.tsx?$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name) ? [path] : [];
});

describe('visible iconography', () => {
  it('does not use Unicode glyphs as UI icons', () => {
    const uiSourceFiles = listSourceFiles(resolve(__dirname, '../..')).filter((file) => file.includes('/presentation/') || file.includes('/shared/ui/'));
    const unicodeIcon = /[\u2190-\u2BFF\u{1F000}-\u{1FAFF}]/u;
    const violations = uiSourceFiles.flatMap((file) => unicodeIcon.test(readFileSync(file, 'utf8')) ? [file] : []);

    expect(violations).toEqual([]);
  });
});

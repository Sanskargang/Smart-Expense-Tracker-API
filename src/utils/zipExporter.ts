import JSZip from 'jszip';
import { PROJECT_FILES } from '../data/projectFiles';

/**
 * Packs all project files into a downloadable zip archive.
 */
export async function downloadProjectZip(): Promise<void> {
  const zip = new JSZip();

  // Each file in PROJECT_FILES has a path starting with "expense-tracker/"
  for (const file of PROJECT_FILES) {
    zip.file(file.path, file.content);
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'expense-tracker-api.zip';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

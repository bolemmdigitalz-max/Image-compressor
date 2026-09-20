import { computeTargetSize } from '../src/lib/image/resize.ts';
import { buildOutputName, uniquify, splitExtension, mimeToExtension, qualityForPreset } from '../src/utils/files.ts';
import { clamp, formatBytes, formatPercent, safeId } from '../src/utils/format.ts';

let pass = 0, fail = 0;
function eq(name, got, want) {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`);
  if (!ok) {
    console.log('  got:', JSON.stringify(got));
    console.log('  want:', JSON.stringify(want));
  }
  ok ? pass++ : fail++;
}

eq('resize: no constraints = identity', computeTargetSize({ srcWidth: 800, srcHeight: 600, maxWidth: 0, maxHeight: 0, scalePercent: 0, preserveAspectRatio: true, preventUpscaling: true }), { width: 800, height: 600, changed: false });
eq('resize: max width 400 (preserve ratio)', computeTargetSize({ srcWidth: 800, srcHeight: 600, maxWidth: 400, maxHeight: 0, scalePercent: 0, preserveAspectRatio: true, preventUpscaling: true }), { width: 400, height: 300, changed: true });
eq('resize: scale 50%', computeTargetSize({ srcWidth: 1000, srcHeight: 800, maxWidth: 0, maxHeight: 0, scalePercent: 50, preserveAspectRatio: true, preventUpscaling: true }), { width: 500, height: 400, changed: true });
eq('resize: tall image max h', computeTargetSize({ srcWidth: 600, srcHeight: 1200, maxWidth: 0, maxHeight: 400, scalePercent: 0, preserveAspectRatio: true, preventUpscaling: true }), { width: 200, height: 400, changed: true });
eq('resize: prevent upscaling ignores', computeTargetSize({ srcWidth: 100, srcHeight: 100, maxWidth: 5000, maxHeight: 0, scalePercent: 0, preserveAspectRatio: true, preventUpscaling: true }), { width: 100, height: 100, changed: false });

eq('split ext', splitExtension('photo.jpg'), { base: 'photo', ext: '.jpg' });
eq('split ext double', splitExtension('archive.tar.gz'), { base: 'archive.tar', ext: '.gz' });
eq('split ext no ext', splitExtension('README'), { base: 'README', ext: '' });
eq('buildOutputName PNG->JPG', buildOutputName('a.png', 'image/jpeg'), 'a.jpg');
eq('buildOutputName keeps ext', buildOutputName('a.jpg', 'image/jpeg'), 'a.jpg');
eq('mimeToExt png', mimeToExtension('image/png'), 'png');

eq('uniquify first run', uniquify(['a.jpg', 'b.jpg']), ['a.jpg', 'b.jpg']);
eq('uniquify collisions', uniquify(['a.jpg', 'a.jpg', 'a.jpg']), ['a.jpg', 'a-2.jpg', 'a-3.jpg']);
eq('uniquify mixed', uniquify(['a.jpg', 'a.jpg', 'b.jpg']), ['a.jpg', 'a-2.jpg', 'b.jpg']);
eq('uniquify empty', uniquify([]), []);

eq('quality preset low', qualityForPreset('low'), 50);
eq('quality preset high', qualityForPreset('high'), 90);

eq('formatBytes 0', formatBytes(0), '0 B');
eq('formatBytes 1500', formatBytes(1500), '1.46 KB');
eq('formatBytes 100 MB', formatBytes(100 * 1024 * 1024), '100 MB');

eq('formatPercent 33.5', formatPercent(33.5), '34%');

eq('clamp under', clamp(5, 10, 20), 10);
eq('clamp over', clamp(25, 10, 20), 20);
eq('clamp in', clamp(15, 10, 20), 15);

eq('safeId has prefix', safeId('img').startsWith('img_'), true);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
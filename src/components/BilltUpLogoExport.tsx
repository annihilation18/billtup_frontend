import { Download } from 'lucide-react@0.468.0';
import { Button } from './ui/button';
import type { ReactNode } from 'react';
import { BilltUpLogo } from './BilltUpLogo';

/**
 * BilltUpLogoExport (route /logo-export)
 *
 * Shows the BilltUp logo (P4.14, chosen 2026-11-08) and lets you download the master files.
 * The SVGs are exact copies of the app repo masters, served from public/brand/:
 *   billtup-logo-mark.svg        full colour, for white / light backgrounds (brand/logo-mark-2026-11.svg)
 *   billtup-logo-mark-light.svg  light colours, for dark backgrounds (brand/logo-mark-2026-11-light.svg)
 *   billtup-app-icon.svg         light mark on the navy-to-blue square tile (brand/app-icon-2026-11.svg)
 * PNGs are drawn from the same SVGs in the browser at the size you pick (transparent background,
 * except the app icon tile).
 */

interface Variant {
  key: string;
  title: string;
  note: string;
  file: string;
  /** preview background */
  bg: string;
  preview: ReactNode;
}

const VARIANTS: Variant[] = [
  {
    key: 'color',
    title: 'Logo mark: full colour',
    note: 'For white and light backgrounds.',
    file: '/brand/billtup-logo-mark.svg',
    bg: '#F3F5F9',
    preview: <BilltUpLogo size={160} tone="color" />,
  },
  {
    key: 'light',
    title: 'Logo mark: light',
    note: 'For navy, dark and gradient backgrounds.',
    file: '/brand/billtup-logo-mark-light.svg',
    bg: 'linear-gradient(135deg, #0A1A6E, #0B5FC0)',
    preview: <BilltUpLogo size={160} tone="light" />,
  },
  {
    key: 'app-icon',
    title: 'App icon',
    note: 'Square tile (stores and phones round the corners themselves).',
    file: '/brand/billtup-app-icon.svg',
    bg: '#F3F5F9',
    preview: <img src="/brand/billtup-app-icon.svg" width={160} height={160} alt="BilltUp app icon" style={{ borderRadius: 36 }} />,
  },
];

const PNG_SIZES = [64, 128, 256, 512, 1024];

function saveBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function downloadSVG(v: Variant) {
  const res = await fetch(v.file);
  const blob = new Blob([await res.text()], { type: 'image/svg+xml' });
  saveBlob(blob, `billtup-${v.key}.svg`);
}

async function downloadPNG(v: Variant, size: number) {
  const img = new Image();
  img.src = v.file;
  await img.decode();
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.drawImage(img, 0, 0, size, size);
  canvas.toBlob((blob) => blob && saveBlob(blob, `billtup-${v.key}-${size}px.png`), 'image/png');
}

export function BilltUpLogoExport() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-8">
          <h1 className="text-3xl mb-2 text-gray-900">BilltUp Logo Export</h1>
          <p className="text-gray-600 mb-8">
            Download the official BilltUp logo files. SVG is the master (sharp at any size);
            PNG is made from it at the size you choose.
          </p>

          <div className="space-y-10">
            {VARIANTS.map((v, i) => (
              <div key={v.key} className={i < VARIANTS.length - 1 ? "border-b pb-8" : "pb-2"}>
                <h2 className="text-xl mb-1 text-gray-800">{v.title}</h2>
                <p className="text-sm text-gray-500 mb-4">{v.note}</p>
                <div className="flex items-start gap-6 flex-wrap">
                  <div className="p-6 rounded-lg inline-flex items-center justify-center" style={{ background: v.bg }}>
                    {v.preview}
                  </div>
                  <div className="flex flex-col items-start gap-3">
                    <Button onClick={() => downloadSVG(v)} variant="outline" className="gap-2 justify-start">
                      <Download className="w-4 h-4" />
                      Download SVG
                    </Button>
                    <div className="flex flex-wrap gap-2">
                      {PNG_SIZES.map((s) => (
                        <Button key={s} onClick={() => downloadPNG(v, s)} variant="outline" size="sm" className="gap-1">
                          <Download className="w-3 h-3" />
                          PNG {s}px
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import { Download } from 'lucide-react@0.468.0';
import { Button } from './ui/button';
import { BilltUpLogo } from './BilltUpLogo';

/**
 * BilltUpLogoExport Component
 * 
 * Displays the BilltUp logo in various sizes and provides an exportable SVG
 * that can be downloaded as PNG. Right-click on any logo to save as image.
 */

export function BilltUpLogoExport() {
  const downloadSVG = (size: number) => {
    const svg = `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="border-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1E3A8A;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#14B8A6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#F59E0B;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="icon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1E3A8A;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#14B8A6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#F59E0B;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Gradient Border -->
  <rect x="0" y="0" width="${size}" height="${size}" rx="${size * 0.1875}" fill="url(#border-gradient)"/>
  
  <!-- White Background -->
  <rect x="${size * 0.0078}" y="${size * 0.0078}" width="${size * 0.9844}" height="${size * 0.9844}" rx="${size * 0.18}" fill="white"/>
  
  <!-- Icon -->
  <g transform="translate(${size * 0.2}, ${size * 0.2}) scale(${size / 40})">
    <!-- Document outline -->
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" 
          stroke="url(#icon-gradient)" 
          stroke-width="1.5" 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          fill="none"/>
    <!-- Folded corner -->
    <polyline points="14 2 14 8 20 8" 
              stroke="url(#icon-gradient)" 
              stroke-width="1.5" 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              fill="none"/>
    <!-- Invoice lines -->
    <line x1="16" y1="13" x2="8" y2="13" 
          stroke="url(#icon-gradient)" 
          stroke-width="1.5" 
          stroke-linecap="round" 
          stroke-linejoin="round"/>
    <line x1="16" y1="17" x2="8" y2="17" 
          stroke="url(#icon-gradient)" 
          stroke-width="1.5" 
          stroke-linecap="round" 
          stroke-linejoin="round"/>
    <polyline points="10 9 9 9 8 9" 
              stroke="url(#icon-gradient)" 
              stroke-width="1.5" 
              stroke-linecap="round" 
              stroke-linejoin="round"/>
  </g>
</svg>`;

    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `billtup-logo-${size}px.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h1 className="text-3xl mb-2 text-gray-900">BilltUp Logo Export</h1>
          <p className="text-gray-600 mb-8">
            Right-click on any logo to save as image, or use the download buttons to get SVG files.
            You can open SVG files in a browser and take a screenshot, or use online converters to create PNG files.
          </p>

          <div className="space-y-12">
            {/* Small Logo */}
            <div className="border-b pb-8">
              <h2 className="text-xl mb-4 text-gray-800">Small (64px × 64px)</h2>
              <div className="flex items-center gap-6 flex-wrap">
                <div className="bg-gray-100 p-6 rounded-lg inline-block">
                  <BilltUpLogo size={64} />
                </div>
                <Button 
                  onClick={() => downloadSVG(64)}
                  variant="outline"
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download SVG (64px)
                </Button>
              </div>
            </div>

            {/* Medium Logo */}
            <div className="border-b pb-8">
              <h2 className="text-xl mb-4 text-gray-800">Medium (128px × 128px)</h2>
              <div className="flex items-center gap-6 flex-wrap">
                <div className="bg-gray-100 p-6 rounded-lg inline-block">
                  <BilltUpLogo size={128} />
                </div>
                <Button 
                  onClick={() => downloadSVG(128)}
                  variant="outline"
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download SVG (128px)
                </Button>
              </div>
            </div>

            {/* Large Logo */}
            <div className="border-b pb-8">
              <h2 className="text-xl mb-4 text-gray-800">Large (256px × 256px)</h2>
              <div className="flex items-center gap-6 flex-wrap">
                <div className="bg-gray-100 p-8 rounded-lg inline-block">
                  <BilltUpLogo size={256} />
                </div>
                <Button 
                  onClick={() => downloadSVG(256)}
                  variant="outline"
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download SVG (256px)
                </Button>
              </div>
            </div>

            {/* Extra Large Logo */}
            <div className="border-b pb-8">
              <h2 className="text-xl mb-4 text-gray-800">Extra Large (512px × 512px)</h2>
              <div className="flex items-center gap-6 flex-wrap">
                <div className="bg-gray-100 p-8 rounded-lg inline-block">
                  <BilltUpLogo size={512} />
                </div>
                <Button 
                  onClick={() => downloadSVG(512)}
                  variant="outline"
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download SVG (512px)
                </Button>
              </div>
            </div>

            {/* HD Logo */}
            <div className="pb-8">
              <h2 className="text-xl mb-4 text-gray-800">HD (1024px × 1024px)</h2>
              <div className="flex items-start gap-6 flex-wrap">
                <div className="bg-gray-100 p-8 rounded-lg inline-block">
                  <BilltUpLogo size={256} />
                  <p className="text-sm text-gray-500 mt-2 max-w-xs">Preview shown at 256px</p>
                </div>
                <Button 
                  onClick={() => downloadSVG(1024)}
                  variant="outline"
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download SVG (1024px)
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">How to convert SVG to PNG:</h3>
            <ol className="list-decimal list-inside space-y-1 text-blue-800 text-sm">
              <li>Download the SVG file using the buttons above</li>
              <li>Open the SVG file in your web browser (Chrome, Firefox, etc.)</li>
              <li>Right-click on the logo and select "Save image as..." or take a screenshot</li>
              <li>Or use online tools like cloudconvert.com or convertio.co to convert SVG to PNG</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
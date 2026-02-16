import { useEffect, useRef, useState } from "react";

export function IPhone16ProMaxFrame({
  children,
}: {
  children: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const frameWidth = 410; // Max frame width
        const contentWidth = 390; // iPhone screen content width
        
        // Calculate scale based on the actual frame width
        const actualFrameWidth = Math.min(containerWidth, frameWidth);
        const screenPadding = 12; // The p-3 padding on the frame = 12px
        const availableScreenWidth = actualFrameWidth - (screenPadding * 2);
        
        // Reduce scale by 7% to fit better
        const newScale = Math.min(1, availableScreenWidth / contentWidth) * 0.93;
        setScale(newScale);
      }
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  return (
    <div ref={containerRef} className="mx-auto my-6 w-full max-w-[410px] px-4">
      {/* iPhone Frame */}
      <div
        className="relative mx-auto w-full"
        style={{ 
          maxWidth: "410px",
          aspectRatio: "410 / 884"
        }}
      >
        {/* Outer Frame */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900 rounded-[60px] shadow-2xl p-3">
          {/* Screen Bezel */}
          <div className="relative w-full h-full bg-black rounded-[50px] overflow-hidden">
            {/* Dynamic Island */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-black rounded-b-3xl z-50"></div>

            {/* Screen Content - Scaled Container */}
            <div className="w-full h-full overflow-hidden flex items-center justify-center">
              <div 
                style={{
                  width: "390px",
                  height: "844px",
                  transform: `scale(${scale})`,
                  transformOrigin: "center center"
                }}
              >
                {children}
              </div>
            </div>
          </div>
        </div>

        {/* Side Buttons */}
        <div className="absolute -left-1 top-32 w-1 h-12 bg-gray-700 rounded-l-sm"></div>
        <div className="absolute -left-1 top-48 w-1 h-16 bg-gray-700 rounded-l-sm"></div>
        <div className="absolute -right-1 top-36 w-1 h-20 bg-gray-700 rounded-r-sm"></div>
      </div>
    </div>
  );
}
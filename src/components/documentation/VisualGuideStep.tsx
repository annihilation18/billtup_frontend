import { Card } from "../ui/card";
import { ReactNode } from "react";

interface VisualGuideStepProps {
  stepNumber: number;
  title: string;
  description: string;
  screenshot: ReactNode;
  instructions: string[];
  tips?: string[];
}

export function VisualGuideStep({
  stepNumber,
  title,
  description,
  screenshot,
  instructions,
  tips
}: VisualGuideStepProps) {
  return (
    <div className="mb-16">
      {/* Step Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1E3A8A] to-[#14B8A6] flex items-center justify-center">
            <span className="text-white font-bold">{stepNumber}</span>
          </div>
          <h2 className="text-2xl" style={{ fontFamily: 'var(--font-poppins)' }}>{title}</h2>
        </div>
        <p className="text-muted-foreground ml-13">{description}</p>
      </div>

      {/* Content Grid */}
      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Screenshot */}
        <div className="order-2 lg:order-1">
          <Card className="p-2 bg-gradient-to-br from-muted/50 to-muted/20">
            <div className="bg-gray-800 rounded-xl p-2 shadow-2xl">
              <div className="bg-white rounded-lg overflow-hidden">
                {screenshot}
              </div>
            </div>
          </Card>
          <p className="text-xs text-center text-muted-foreground mt-2">
            Screenshot: {title}
          </p>
        </div>

        {/* Instructions */}
        <div className="order-1 lg:order-2">
          <Card className="p-6">
            <h3 className="font-medium mb-4">How to {title}</h3>
            <ol className="space-y-3">
              {instructions.map((instruction, index) => (
                <li key={index} className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <span className="flex-1 pt-0.5">{instruction}</span>
                </li>
              ))}
            </ol>

            {tips && tips.length > 0 && (
              <div className="mt-6 p-4 bg-[#14B8A6]/10 border border-[#14B8A6]/20 rounded-lg">
                <p className="font-medium text-[#14B8A6] mb-2">💡 Pro Tips</p>
                <ul className="space-y-2 text-sm">
                  {tips.map((tip, index) => (
                    <li key={index} className="flex gap-2">
                      <span className="text-[#14B8A6]">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

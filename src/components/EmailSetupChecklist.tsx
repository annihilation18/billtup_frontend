import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { CheckCircle2, Circle, ExternalLink, Copy, Check } from "lucide-react";
import { useState } from "react";

interface EmailSetupChecklistProps {
  onBack?: () => void;
}

export function EmailSetupChecklist({ onBack }: EmailSetupChecklistProps) {
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  const copyToClipboard = (text: string, step: number) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(step);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  const steps = [
    {
      title: "Enable 2-Step Verification on Google",
      description: "Required before you can create app passwords",
      link: "https://myaccount.google.com/security",
      linkText: "Open Google Security Settings",
    },
    {
      title: "Generate Gmail App Password",
      description: "Create a special password for BilltUp",
      link: "https://myaccount.google.com/apppasswords",
      linkText: "Generate App Password",
      note: "Select 'Mail' and 'Other (Custom name)', name it 'BilltUp'",
      copyValue: "",
    },
    {
      title: "Go to AWS Secrets Manager",
      description: "Open the BilltUp secrets in AWS Console",
      link: "https://console.aws.amazon.com/secretsmanager/home?region=us-east-1",
      linkText: "Open AWS Secrets Manager",
    },
    {
      title: "Update Lambda Environment Secrets",
      description: "Edit the BilltUp secret to update EMAIL_USER and EMAIL_PASSWORD",
      note: "This is where you'll update EMAIL_USER and EMAIL_PASSWORD",
    },
    {
      title: "Update EMAIL_USER",
      description: "Set to your full Gmail address",
      copyValue: "your-email@gmail.com",
      note: "⚠️ Replace with YOUR actual email address",
    },
    {
      title: "Update EMAIL_PASSWORD",
      description: "Paste the 16-character app password from Step 2",
      note: "⚠️ Use app password, NOT your regular Gmail password",
    },
    {
      title: "Update EMAIL_FROM (Optional)",
      description: "Recommended to match your EMAIL_USER",
      copyValue: "BilltUp <your-email@gmail.com>",
      note: "⚠️ This is OPTIONAL - you don't need to create it if it doesn't exist! The system uses a default.",
    },
    {
      title: "Redeploy Lambda Function",
      description: "Trigger a new deployment via GitHub Actions or SAM CLI",
      note: "⚠️ IMPORTANT: Changes won't take effect until the Lambda is redeployed!",
    },
    {
      title: "Test Configuration",
      description: "Run the diagnostic tool to verify",
      link: "/?email-test",
      linkText: "Open Diagnostic Tool",
      note: "Look for 'CONNECTED ✅' status",
    },
    {
      title: "Test Password Reset",
      description: "Try the full password reset flow",
      note: "Check your inbox AND spam folder",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E3A8A] via-[#14B8A6] to-[#F59E0B] flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl p-8 max-h-[90vh] overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-2xl mb-2">📧 Email Setup Checklist</h1>
          <p className="text-muted-foreground">
            Follow these steps to fix your email credentials
          </p>
        </div>

        <div className="space-y-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 hover:bg-accent/5 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <Circle className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium mb-1">
                    Step {index + 1}: {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {step.description}
                  </p>

                  {step.note && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-2 text-sm text-blue-900">
                      {step.note}
                    </div>
                  )}

                  {step.copyValue && (
                    <div className="flex items-center gap-2 mb-2">
                      <code className="flex-1 bg-muted px-3 py-2 rounded text-sm">
                        {step.copyValue}
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          copyToClipboard(step.copyValue!, index)
                        }
                      >
                        {copiedStep === index ? (
                          <>
                            <Check className="w-4 h-4 mr-1" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-1" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                  )}

                  {step.link && (
                    <a
                      href={step.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-[#1E3A8A] hover:underline"
                    >
                      <ExternalLink className="w-4 h-4" />
                      {step.linkText}
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-medium text-green-900 mb-2">
            ✅ All Done? Test It!
          </h3>
          <p className="text-sm text-green-800 mb-3">
            After completing all steps above, test your configuration:
          </p>
          <div className="flex gap-2">
            <Button
              asChild
              className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90"
            >
              <a href="/?email-test">Run Diagnostic Test</a>
            </Button>
            <Button asChild variant="outline">
              <a href="/">Go to Login</a>
            </Button>
          </div>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-medium text-yellow-900 mb-2">
            ⚠️ Common Mistakes
          </h3>
          <ul className="text-sm text-yellow-800 space-y-1 list-disc ml-5">
            <li>Using regular Gmail password instead of app password</li>
            <li>Forgetting to enable 2-Step Verification first</li>
            <li>Not including @gmail.com in EMAIL_USER</li>
            <li>Not redeploying Lambda after changes</li>
            <li>EMAIL_FROM doesn't match EMAIL_USER</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
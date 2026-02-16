import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { CheckCircle2, XCircle, RefreshCw } from "lucide-react";
import { API_CONFIG } from "../utils/config";

interface EmailConfigTestProps {
  onBack?: () => void;
}

export function EmailConfigTest({ onBack }: EmailConfigTestProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const checkConfig = async () => {
    setLoading(true);
    try {
      const { getIdToken } = await import("../utils/auth/cognito");
      const token = await getIdToken();
      const response = await fetch(
        `${API_CONFIG.baseUrl}/email/check-config`,
        {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      const data = await response.json();
      setResult(data);
      console.log("Email config check result:", data);
    } catch (error) {
      console.error("Failed to check email config:", error);
      setResult({ error: "Failed to check configuration" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E3A8A] via-[#14B8A6] to-[#F59E0B] flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8">
        <h1 className="text-2xl mb-4">📧 Email Configuration Test</h1>
        <p className="text-muted-foreground mb-6">
          This tool helps you verify your email settings for the password reset
          system.
        </p>

        <Button
          onClick={checkConfig}
          disabled={loading}
          className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 mb-6"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Checking Configuration...
            </>
          ) : (
            "Check Email Configuration"
          )}
        </Button>

        {result && (
          <div className="space-y-4">
            {/* SMTP Status */}
            <div className="border rounded-lg p-4">
              <h2 className="font-medium mb-2">SMTP Connection Status</h2>
              <div className="flex items-center gap-2">
                {result.smtpStatus?.includes("✅") ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <span className="font-mono">{result.smtpStatus}</span>
              </div>
            </div>

            {/* Environment Variables */}
            {result.envVariables && (
              <div className="border rounded-lg p-4">
                <h2 className="font-medium mb-3">Environment Variables</h2>
                <div className="space-y-2 font-mono text-sm">
                  {Object.entries(result.envVariables).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-muted-foreground">{key}:</span>
                      <span>{value as string}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Email Config */}
            {result.emailConfig && (
              <div className="border rounded-lg p-4">
                <h2 className="font-medium mb-3">Email Configuration</h2>
                <div className="space-y-2 font-mono text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Host:</span>
                    <span>{result.emailConfig.host}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Port:</span>
                    <span>{result.emailConfig.port}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Secure:</span>
                    <span>{result.emailConfig.secure ? "Yes" : "No"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">From:</span>
                    <span>{result.emailConfig.from}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">User Set:</span>
                    <span>
                      {result.emailConfig.hasUser ? (
                        <>
                          ✅ {result.emailConfig.userValue}
                        </>
                      ) : (
                        "❌ Not Set"
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Password Set:</span>
                    <span>
                      {result.emailConfig.hasPassword ? "✅ Yes" : "❌ No"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* SMTP Error */}
            {result.smtpError && (
              <div className="border border-red-200 bg-red-50 rounded-lg p-4">
                <h2 className="font-medium mb-2 text-red-900">
                  SMTP Connection Error
                </h2>
                <div className="space-y-1 text-sm text-red-800">
                  <p>
                    <strong>Message:</strong> {result.smtpError.message}
                  </p>
                  {result.smtpError.code && (
                    <p>
                      <strong>Code:</strong> {result.smtpError.code}
                    </p>
                  )}
                  {result.smtpError.command && (
                    <p>
                      <strong>Command:</strong> {result.smtpError.command}
                    </p>
                  )}
                  {result.smtpError.response && (
                    <p>
                      <strong>Response:</strong> {result.smtpError.response}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {result.recommendations && result.recommendations.length > 0 && (
              <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-4">
                <h2 className="font-medium mb-2 text-yellow-900">
                  💡 Recommendations
                </h2>
                <ul className="space-y-1 text-sm text-yellow-800 list-disc ml-5">
                  {result.recommendations.map((rec: string, idx: number) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Success Tips */}
            {result.smtpStatus?.includes("✅") && (
              <div className="border border-green-200 bg-green-50 rounded-lg p-4">
                <h2 className="font-medium mb-2 text-green-900">
                  ✅ Configuration Looks Good!
                </h2>
                <p className="text-sm text-green-800">
                  Your email settings are configured correctly. The password
                  reset system should work. Check the server logs in AWS
                  CloudWatch to see detailed email sending information.
                </p>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm">
          <p className="text-blue-900 mb-2">
            <strong>📝 How to view detailed logs:</strong>
          </p>
          <ol className="text-blue-800 space-y-1 ml-5 list-decimal">
            <li>Go to the AWS CloudWatch Console</li>
            <li>Navigate to Log Groups</li>
            <li>Find the BilltUp Lambda function logs</li>
            <li>Try the password reset and watch the logs in real-time</li>
          </ol>
        </div>

        {onBack && (
          <Button
            onClick={onBack}
            className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 mt-6"
          >
            Back
          </Button>
        )}
      </Card>
    </div>
  );
}
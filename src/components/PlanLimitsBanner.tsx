import React from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Alert, AlertDescription } from "./ui/alert";
import { Sparkles, TrendingUp, AlertTriangle, Zap } from "lucide-react";
import { SubscriptionStatus, PlanLimits, PLANS } from "../utils/subscriptionPlans";

interface PlanLimitsBannerProps {
  subscription: SubscriptionStatus;
  onUpgrade?: () => void;
}

export function PlanLimitsBanner({ subscription, onUpgrade }: PlanLimitsBannerProps) {
  // Don't show for premium users
  if (subscription.planType === 'premium') {
    return null;
  }

  const invoicesRemaining = PlanLimits.getRemainingInvoices(subscription);
  const customersRemaining = PlanLimits.getRemainingCustomers(subscription);
  const invoiceUsage = PlanLimits.getUsagePercentage(subscription, 'invoices');
  const customerUsage = PlanLimits.getUsagePercentage(subscription, 'customers');

  // Trial banner
  if (subscription.isTrial) {
    const daysRemaining = PlanLimits.getDaysUntilTrialEnd(subscription);
    
    return (
      <Alert className="mb-4 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <Sparkles className="h-4 w-4 text-blue-600" />
        <AlertDescription>
          <div className="flex items-center justify-between">
            <div>
              <strong className="text-blue-900">Free Trial Active</strong>
              <p className="text-sm text-blue-800 mt-1">
                {daysRemaining} days remaining • Enjoying unlimited access to all features
              </p>
            </div>
            {onUpgrade && (
              <Button
                size="sm"
                variant="outline"
                className="bg-white"
                onClick={onUpgrade}
              >
                Choose Plan
              </Button>
            )}
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  // Basic plan - show usage
  const showWarning = invoiceUsage >= 80 || customerUsage >= 80;
  const limitReached = invoiceUsage >= 100 || customerUsage >= 100;

  if (!showWarning && !limitReached) {
    return null;
  }

  return (
    <Alert className={`mb-4 ${limitReached ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>
      <AlertTriangle className={`h-4 w-4 ${limitReached ? 'text-red-600' : 'text-amber-600'}`} />
      <AlertDescription>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <strong className={limitReached ? 'text-red-900' : 'text-amber-900'}>
                {limitReached ? 'Plan Limit Reached' : 'Approaching Plan Limit'}
              </strong>
              <p className={`text-sm mt-1 ${limitReached ? 'text-red-800' : 'text-amber-800'}`}>
                {limitReached
                  ? 'Upgrade to Premium to continue creating invoices and adding customers'
                  : 'You\'re using most of your plan allowance this month'}
              </p>
            </div>
            {onUpgrade && (
              <Button
                size="sm"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                onClick={onUpgrade}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Upgrade Now
              </Button>
            )}
          </div>

          {/* Usage bars */}
          {invoiceUsage > 0 && (
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className={limitReached && invoiceUsage >= 100 ? 'text-red-700' : 'text-muted-foreground'}>
                  Invoices this month
                </span>
                <span className="font-medium">
                  {subscription.invoicesThisPeriod} / {PLANS.basic.features.invoicesPerMonth}
                </span>
              </div>
              <Progress 
                value={invoiceUsage} 
                className={`h-2 ${invoiceUsage >= 100 ? 'bg-red-200' : 'bg-amber-200'}`}
              />
            </div>
          )}

          {customerUsage > 0 && (
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className={limitReached && customerUsage >= 100 ? 'text-red-700' : 'text-muted-foreground'}>
                  Total customers
                </span>
                <span className="font-medium">
                  {subscription.customerCount} / {PLANS.basic.features.maxCustomers}
                </span>
              </div>
              <Progress 
                value={customerUsage} 
                className={`h-2 ${customerUsage >= 100 ? 'bg-red-200' : 'bg-amber-200'}`}
              />
            </div>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
}

// Inline upgrade prompt for when limit is reached
interface UpgradePromptProps {
  type: 'invoice' | 'customer' | 'feature';
  featureName?: string;
  onUpgrade: () => void;
  onCancel: () => void;
}

export function UpgradePrompt({ type, featureName, onUpgrade, onCancel }: UpgradePromptProps) {
  const getContent = () => {
    switch (type) {
      case 'invoice':
        return {
          title: "Monthly Invoice Limit Reached",
          description: "You've reached your limit of 50 invoices this month. Upgrade to Premium for unlimited invoices.",
        };
      case 'customer':
        return {
          title: "Customer Limit Reached",
          description: "You've reached your limit of 100 customers. Upgrade to Premium for unlimited customers.",
        };
      case 'feature':
        return {
          title: `${featureName} is a Premium Feature`,
          description: `Upgrade to Premium to unlock ${featureName?.toLowerCase()} and other advanced features.`,
        };
      default:
        return {
          title: "Upgrade to Premium",
          description: "Unlock unlimited access to all features.",
        };
    }
  };

  const content = getContent();

  return (
    <Card className="p-6 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h3 className="mb-2">{content.title}</h3>
        <p className="text-muted-foreground">
          {content.description}
        </p>
      </div>

      <div className="bg-white rounded-lg p-4 mb-6 border border-purple-200">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h4>Premium Plan Benefits</h4>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-purple-600" />
            <span>Unlimited invoices</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-purple-600" />
            <span>Unlimited customers</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-purple-600" />
            <span>Sales analytics</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>Custom branding</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={onCancel}
        >
          Maybe Later
        </Button>
        <Button
          className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          onClick={onUpgrade}
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Upgrade to Premium
        </Button>
      </div>

      <p className="text-center text-xs text-muted-foreground mt-4">
        Only ${PLANS.premium.price}/month • Cancel anytime
      </p>
    </Card>
  );
}
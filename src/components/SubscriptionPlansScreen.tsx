import React, { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { ArrowLeft, Check, Crown, Zap, AlertTriangle, Sparkles } from "lucide-react";
import { PLANS, PlanType, SubscriptionStatus, PlanLimits } from "../utils/subscriptionPlans";
import { subscriptionApi } from "../utils/api";
import { toast } from "sonner@2.0.3";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";

interface SubscriptionPlansScreenProps {
  onBack: () => void;
  currentPlan: PlanType;
  onLogout: () => void;
  onPlanChanged: () => void;
}

export function SubscriptionPlansScreen({ onBack, currentPlan, onLogout, onPlanChanged }: SubscriptionPlansScreenProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      const data = await subscriptionApi.getStatus();
      setSubscription(data);
    } catch (error) {
      // Silently handle error and create fallback subscription object
      // Default to trial with 14 days
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 14);
      
      setSubscription({
        planType: currentPlan,
        isActive: true,
        isTrial: true,
        trialEndsAt: trialEndDate.toISOString(),
        invoicesThisPeriod: 0,
        customerCount: 0,
        periodStart: new Date().toISOString(),
        periodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (newPlan: PlanType) => {
    if (newPlan === currentPlan) {
      toast.info("You're already on this plan");
      return;
    }

    setIsProcessing(true);
    try {
      toast.info("Updating subscription...");
      await subscriptionApi.changePlan(newPlan);
      toast.success(`Successfully switched to ${PLANS[newPlan].name} plan!`);
      onPlanChanged();
    } catch (error) {
      console.error("Error changing plan:", error);
      toast.error("Failed to change plan. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelSubscription = async () => {
    setIsProcessing(true);
    try {
      toast.info("Canceling subscription...");
      const result = await subscriptionApi.cancelSubscription();
      
      // Show appropriate message based on cancellation type
      if (result.immediate) {
        toast.success(result.message || "Subscription cancelled immediately");
      } else {
        toast.success(result.message || "Subscription will be cancelled at end of billing period", {
          duration: 5000
        });
      }
      
      // Refresh subscription status to show updated state
      await loadSubscription();
      
      // Don't log out - let them use until period end
    } catch (error) {
      console.error("Error canceling subscription:", error);
      toast.error("Failed to cancel subscription. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Top App Bar */}
      <div className="bg-primary text-primary-foreground p-4 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-primary-foreground hover:bg-primary-foreground/20 -ml-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl">Subscription Plans</h1>
        </div>
      </div>

      <div className="p-4 max-w-4xl mx-auto space-y-6">
        {/* Trial Notice Banner */}
        {!loading && subscription && subscription.isTrial && (
          <Alert className="border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
            <Sparkles className="h-5 w-5 text-blue-600" />
            <AlertDescription className="text-sm">
              <strong className="text-blue-900 dark:text-blue-100 text-base">Free Trial Active!</strong>
              <p className="text-blue-800 dark:text-blue-200 mt-1">
                You have <strong>{PlanLimits.getDaysUntilTrialEnd(subscription)} days remaining</strong> with unlimited access to all Premium features.
                Choose a plan before <strong>{new Date(subscription.trialEndsAt!).toLocaleDateString()}</strong> to continue.
              </p>
            </AlertDescription>
          </Alert>
        )}

        {/* Current Plan Banner */}
        <Card className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Current Plan</p>
              <p className="font-medium flex items-center gap-2 mt-1">
                {PLANS[currentPlan].name}
                <Badge variant="secondary" className="text-xs">Active</Badge>
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl">
                ${PLANS[currentPlan].price}
                <span className="text-sm text-muted-foreground">/month</span>
              </p>
            </div>
          </div>
        </Card>

        {/* Plan Options */}
        <div className="space-y-4">
          {/* Basic Plan */}
          <Card className={`p-5 ${currentPlan === 'basic' ? 'border-primary border-2' : ''}`}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-600" />
                  <h3 className="font-medium">Basic Plan</h3>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Perfect for small businesses</p>
              </div>
              <div className="text-right">
                <p className="text-2xl">
                  $4.99
                  <span className="text-sm text-muted-foreground">/month</span>
                </p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Up to 50 invoices per month</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Up to 100 customers</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Stripe payment processing</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Email invoicing</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Basic reporting</span>
              </div>
            </div>

            <Button
              onClick={() => handleUpgrade('basic')}
              disabled={currentPlan === 'basic' || isProcessing}
              className="w-full"
              variant={currentPlan === 'basic' ? 'secondary' : 'outline'}
            >
              {currentPlan === 'basic' ? 'Current Plan' : 'Switch to Basic'}
            </Button>
          </Card>

          {/* Premium Plan */}
          <Card className={`p-5 ${currentPlan === 'premium' ? 'border-amber-500 border-2' : 'border-amber-500/30'} relative overflow-hidden`}>
            {/* Premium Badge */}
            <div className="absolute top-3 right-3">
              <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0">
                <Crown className="w-3 h-3 mr-1" />
                Premium
              </Badge>
            </div>

            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-500" />
                  <h3 className="font-medium">Premium Plan</h3>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Everything you need to scale</p>
              </div>
              <div className="text-right">
                <p className="text-2xl">
                  $9.99
                  <span className="text-sm text-muted-foreground">/month</span>
                </p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Unlimited invoices</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Unlimited customers</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Everything in Basic, plus:</span>
              </div>
              <div className="flex items-start gap-2 pl-6">
                <Check className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm font-medium">Custom branding & logo on invoices</span>
              </div>
              <div className="flex items-start gap-2 pl-6">
                <Check className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm font-medium">Domain email configuration</span>
              </div>
              <div className="flex items-start gap-2 pl-6">
                <Check className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm font-medium">Advanced customer analytics</span>
              </div>
              <div className="flex items-start gap-2 pl-6">
                <Check className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm font-medium">Priority support</span>
              </div>
            </div>

            <Button
              onClick={() => handleUpgrade('premium')}
              disabled={currentPlan === 'premium' || isProcessing}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
              variant={currentPlan === 'premium' ? 'secondary' : 'default'}
            >
              {currentPlan === 'premium' ? 'Current Plan' : 'Upgrade to Premium'}
            </Button>
          </Card>
        </div>

        {/* Cancel Subscription */}
        <Card className="p-4 border-destructive/30">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <div>
                <div className="mb-3">
                  <div className="flex items-center gap-2 text-destructive mb-1">
                    <AlertTriangle className="w-4 h-4" />
                    <h4 className="font-medium">Cancel Subscription</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Canceling your subscription will immediately terminate your access to BilltUp. You'll be logged out and won't be able to use the app until you resubscribe.
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  disabled={isProcessing}
                >
                  Cancel Subscription
                </Button>
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="w-5 h-5" />
                  Cancel Subscription?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This will immediately cancel your subscription and log you out.
                </AlertDialogDescription>
              </AlertDialogHeader>
              
              <div className="space-y-3 py-2">
                <p className="text-sm font-medium">What happens when you cancel:</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>You'll be immediately logged out</li>
                  <li>Your subscription will be canceled</li>
                  <li>You won't be able to access the app</li>
                  <li>Your data will be preserved for 30 days</li>
                  <li>You can resubscribe anytime to regain access</li>
                </ul>
                <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-3 mt-4">
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    <strong>Note:</strong> If you want to delete your account and all data permanently, please use the "Delete Account" option in Account settings instead.
                  </p>
                </div>
              </div>
              
              <AlertDialogFooter>
                <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive hover:bg-destructive/90"
                  onClick={handleCancelSubscription}
                >
                  Yes, Cancel Subscription
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Card>

        {/* Trial Info */}
        <Card className="p-4 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>14-Day Free Trial:</strong> New accounts get full access to all Premium features for 14 days. No credit card required to start!
          </p>
        </Card>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Alert, AlertDescription } from "./ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Crown, Sparkles, ChevronRight, Calendar, TrendingUp, Zap, AlertCircle, Check, X } from "lucide-react";
import { PLANS, PlanLimits, SubscriptionStatus, PlanType, getPlanBadgeColor } from "../utils/subscriptionPlans";
import { subscriptionApi } from "../utils/api";
import { toast } from "sonner@2.0.3";

interface SubscriptionManagementSectionProps {
  onUpgrade?: (plan: Exclude<PlanType, 'trial'>) => void;
}

export function SubscriptionManagementSection({ onUpgrade }: SubscriptionManagementSectionProps) {
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [showChangePlanDialog, setShowChangePlanDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Exclude<PlanType, 'trial'>>('basic');
  const [cancelling, setCancelling] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      const data = await subscriptionApi.getStatus();
      setSubscription(data);
    } catch (error) {
      // API not available yet - use mock subscription for development
      // This will be replaced with real data once backend is connected
      setSubscription({
        planType: 'trial',
        isActive: true,
        isTrial: true,
        trialEndsAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
        invoicesThisPeriod: 12,
        customerCount: 34,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePlan = async () => {
    if (!subscription) return;

    setUpdating(true);
    try {
      await subscriptionApi.updatePlan(selectedPlan);
      toast.success(`Successfully upgraded to ${PLANS[selectedPlan].name} plan!`);
      await loadSubscription();
      setShowChangePlanDialog(false);
      
      if (onUpgrade) {
        onUpgrade(selectedPlan);
      }
    } catch (error) {
      console.error("Error updating plan:", error);
      toast.error("Failed to update plan. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelSubscription = async () => {
    setCancelling(true);
    try {
      const result = await subscriptionApi.cancelSubscription();
      
      // Show appropriate message based on cancellation type
      if (result.immediate) {
        toast.success(result.message || "Subscription cancelled immediately");
      } else {
        toast.success(result.message || "Subscription will be cancelled at end of billing period");
      }
      
      await loadSubscription();
      setShowCancelDialog(false);
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      toast.error("Failed to cancel subscription");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Card>
    );
  }

  if (!subscription) {
    return null;
  }

  const plan = PLANS[subscription.planType];
  const daysRemaining = subscription.isTrial ? PlanLimits.getDaysUntilTrialEnd(subscription) : 0;
  const invoiceUsage = PlanLimits.getUsagePercentage(subscription, 'invoices');
  const customerUsage = PlanLimits.getUsagePercentage(subscription, 'customers');
  const invoicesRemaining = PlanLimits.getRemainingInvoices(subscription);
  const customersRemaining = PlanLimits.getRemainingCustomers(subscription);

  return (
    <>
      <Card className="overflow-hidden">
        {/* Header */}
        <div className={`p-4 ${
          subscription.planType === 'premium' 
            ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
            : subscription.planType === 'trial'
            ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
            : 'bg-gradient-to-r from-green-500 to-teal-500'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                {subscription.planType === 'premium' ? (
                  <Crown className="w-5 h-5 text-white" />
                ) : subscription.planType === 'trial' ? (
                  <Sparkles className="w-5 h-5 text-white" />
                ) : (
                  <Zap className="w-5 h-5 text-white" />
                )}
              </div>
              <div>
                <h3 className="text-white">{plan.name} Plan</h3>
                <p className="text-xs text-white/80">
                  {subscription.isTrial 
                    ? `${daysRemaining} days left in trial` 
                    : `$${plan.price}/month`}
                </p>
              </div>
            </div>
            <Badge className="bg-white/20 text-white border-0">
              {subscription.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </div>

        {/* Trial Notice */}
        {subscription.isTrial && (
          <Alert className="m-4 border-blue-200 bg-blue-50">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-sm">
              <strong className="text-blue-900">Free Trial Active!</strong>
              <p className="text-blue-800 mt-1">
                You have {daysRemaining} days remaining with unlimited access to all Premium features.
                Choose a plan before {new Date(subscription.trialEndsAt!).toLocaleDateString()} to continue.
              </p>
            </AlertDescription>
          </Alert>
        )}

        {/* Cancellation Pending Notice */}
        {subscription.cancelAtPeriodEnd && subscription.currentPeriodEnd && (
          <Alert className="m-4 border-amber-200 bg-amber-50">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-sm">
              <strong className="text-amber-900">Subscription Ending Soon</strong>
              <p className="text-amber-800 mt-1">
                Your subscription will be cancelled on {new Date(subscription.currentPeriodEnd).toLocaleDateString()}.
                You'll continue to have access until then. Reactivate anytime before this date to continue.
              </p>
            </AlertDescription>
          </Alert>
        )}

        {/* Usage Stats for Basic Plan */}
        {subscription.planType === 'basic' && (
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Invoices this month</span>
                <span className="font-medium">
                  {subscription.invoicesThisPeriod} / {PLANS.basic.features.invoicesPerMonth}
                </span>
              </div>
              <Progress value={invoiceUsage} className="h-2" />
              {invoicesRemaining !== 'unlimited' && invoicesRemaining <= 10 && (
                <p className="text-xs text-amber-600">
                  ⚠️ Only {invoicesRemaining} invoices remaining this month
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total customers</span>
                <span className="font-medium">
                  {subscription.customerCount} / {PLANS.basic.features.maxCustomers}
                </span>
              </div>
              <Progress value={customerUsage} className="h-2" />
              {customersRemaining !== 'unlimited' && customersRemaining <= 20 && (
                <p className="text-xs text-amber-600">
                  ⚠️ Only {customersRemaining} customer slots remaining
                </p>
              )}
            </div>
          </div>
        )}

        {/* Premium Features List */}
        {subscription.planType === 'premium' && (
          <div className="p-4 bg-gradient-to-br from-purple-50/50 to-pink-50/50">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-600" />
                <span>Unlimited invoices</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-600" />
                <span>Unlimited customers</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-600" />
                <span>Sales analytics</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-600" />
                <span>Custom branding</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-600" />
                <span>Domain email</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-600" />
                <span>Priority support</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="p-4 border-t border-border space-y-3">
          {subscription.planType !== 'premium' && (
            <Button
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              onClick={() => {
                setSelectedPlan('premium');
                setShowChangePlanDialog(true);
              }}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Upgrade to Premium
            </Button>
          )}

          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowChangePlanDialog(true)}
          >
            <ChevronRight className="w-4 h-4 mr-2" />
            {subscription.planType === 'premium' ? 'Change Plan' : 'View All Plans'}
          </Button>

          {!subscription.isTrial && subscription.isActive && (
            <Button
              variant="ghost"
              className="w-full text-destructive hover:text-destructive hover:bg-red-50"
              onClick={() => setShowCancelDialog(true)}
            >
              Cancel Subscription
            </Button>
          )}
        </div>

        {/* Billing Info */}
        {subscription.currentPeriodEnd && !subscription.isTrial && (
          <div className="px-4 pb-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>
                Next billing date: {new Date(subscription.currentPeriodEnd).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </span>
            </div>
          </div>
        )}
      </Card>

      {/* Change Plan Dialog */}
      <Dialog open={showChangePlanDialog} onOpenChange={setShowChangePlanDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Change Your Plan</DialogTitle>
            <DialogDescription>
              Choose the plan that best fits your business needs
            </DialogDescription>
          </DialogHeader>

          <div className="grid md:grid-cols-2 gap-4 py-4">
            {/* Basic Plan Card */}
            <Card
              className={`p-6 cursor-pointer transition-all ${
                selectedPlan === 'basic'
                  ? 'ring-2 ring-primary shadow-lg'
                  : 'hover:shadow-md'
              }`}
              onClick={() => setSelectedPlan('basic')}
            >
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-2">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
                <h3>Basic</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold">${PLANS.basic.price}</span>
                  <span className="text-sm text-muted-foreground">/month</span>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>50 invoices/month</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>100 customers</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Payment processing</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>PDF receipts via email</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Email support</span>
                </div>
              </div>

              {subscription?.planType === 'basic' && (
                <Badge className="w-full mt-4 justify-center bg-green-100 text-green-800">
                  Current Plan
                </Badge>
              )}
            </Card>

            {/* Premium Plan Card */}
            <Card
              className={`p-6 cursor-pointer transition-all relative ${
                selectedPlan === 'premium'
                  ? 'ring-2 ring-purple-500 shadow-lg'
                  : 'hover:shadow-md'
              }`}
              onClick={() => setSelectedPlan('premium')}
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
                  Recommended
                </Badge>
              </div>

              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full mb-2">
                  <Crown className="w-6 h-6 text-purple-600" />
                </div>
                <h3>Premium</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold">${PLANS.premium.price}</span>
                  <span className="text-sm text-muted-foreground">/month</span>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span className="font-medium">Unlimited invoices</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span className="font-medium">Unlimited customers</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span>Payment processing</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span>PDF receipts via email</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span>Sales analytics & reports</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span>Custom branding</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span>Domain email support</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span>Priority support</span>
                </div>
              </div>

              {subscription?.planType === 'premium' && (
                <Badge className="w-full mt-4 justify-center bg-purple-100 text-purple-800">
                  Current Plan
                </Badge>
              )}
            </Card>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowChangePlanDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleChangePlan}
              disabled={updating || subscription?.planType === selectedPlan}
              className={selectedPlan === 'premium' 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                : ''
              }
            >
              {updating ? 'Updating...' : subscription?.planType === selectedPlan ? 'Current Plan' : `Switch to ${PLANS[selectedPlan].name}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Subscription Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Subscription</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your subscription?
            </DialogDescription>
          </DialogHeader>

          <Alert className="border-amber-200 bg-amber-50">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-sm text-amber-900">
              <strong>What happens when you cancel:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>You'll have access until the end of your billing period</li>
                <li>No refunds for partial months</li>
                <li>Your data will be retained for 30 days</li>
                <li>You can reactivate anytime within 30 days</li>
              </ul>
            </AlertDescription>
          </Alert>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              Keep Subscription
            </Button>
            <Button 
              variant="destructive"
              onClick={handleCancelSubscription}
              disabled={cancelling}
            >
              {cancelling ? 'Cancelling...' : 'Yes, Cancel'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
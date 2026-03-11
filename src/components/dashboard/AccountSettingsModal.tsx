import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Crown, Check, Trash2, AlertTriangle, Loader2, Mail, Lock, CheckCircle, XCircle, AlertCircle } from 'lucide-react@0.468.0';
import { API_CONFIG } from '../../utils/config';

interface AccountSettingsModalProps {
  open: boolean;
  onClose: () => void;
  userPlan: 'basic' | 'premium';
  userProfile: any;
  onDataUpdated: () => void;
  onSignOut: () => void;
  onPlanChange?: (newPlan: 'basic' | 'premium') => void;
}

export function AccountSettingsModal({ open, onClose, userPlan, userProfile, onDataUpdated, onSignOut, onPlanChange }: AccountSettingsModalProps) {
  const isPremium = userPlan === 'premium';
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [passwordResetStatus, setPasswordResetStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [passwordResetMessage, setPasswordResetMessage] = useState('');
  const [isChangingPlan, setIsChangingPlan] = useState(false);
  const [showUpgradeConfirm, setShowUpgradeConfirm] = useState(false);
  const [showDowngradeConfirm, setShowDowngradeConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isReactivating, setIsReactivating] = useState(false);
  const [isCancellingDowngrade, setIsCancellingDowngrade] = useState(false);
  const [cancelAtPeriodEnd, setCancelAtPeriodEnd] = useState(false);
  const [currentPeriodEnd, setCurrentPeriodEnd] = useState<string | null>(null);
  const [pendingDowngrade, setPendingDowngrade] = useState<string | null>(null);
  const [downgradeEffectiveDate, setDowngradeEffectiveDate] = useState<string | null>(null);
  const [isTrial, setIsTrial] = useState(false);
  const [trialEndsAt, setTrialEndsAt] = useState<string | null>(null);
  const [trialDaysRemaining, setTrialDaysRemaining] = useState(0);
  const [pendingPlan, setPendingPlan] = useState<'basic' | 'premium'>('basic');

  // Load subscription status to check for pending cancellation
  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        const { getIdToken } = await import('../../utils/auth/cognito');
        const token = await getIdToken();
        if (!token) return;
        const response = await fetch(`${API_CONFIG.baseUrl}/subscription/status`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setCancelAtPeriodEnd(!!data.cancelAtPeriodEnd);
          setCurrentPeriodEnd(data.currentPeriodEnd || null);
          setIsTrial(!!data.isTrial);
          setTrialEndsAt(data.trialEndsAt || null);
          setTrialDaysRemaining(data.daysRemaining || 0);
          setPendingDowngrade(data.pendingDowngrade || null);
          setDowngradeEffectiveDate(data.downgradeEffectiveDate || null);
        }
      } catch {
        // Subscription status not available
      }
    })();
  }, [open]);

  const handleCancelSubscription = async () => {
    setIsCancelling(true);
    try {
      const { cancelSubscription } = await import('../../utils/dashboard-api');
      const result = await cancelSubscription();
      const { toast } = await import('../ui/sonner');
      toast.success(result?.message || 'Subscription will be cancelled at end of billing period');
      setCancelAtPeriodEnd(true);
      setShowCancelConfirm(false);
    } catch (error) {
      const { toast } = await import('../ui/sonner');
      toast.error('Failed to cancel subscription');
    } finally {
      setIsCancelling(false);
    }
  };

  const handleReactivateSubscription = async () => {
    setIsReactivating(true);
    try {
      const { reactivateSubscription } = await import('../../utils/dashboard-api');
      await reactivateSubscription();
      const { toast } = await import('../ui/sonner');
      toast.success('Subscription reactivated!');
      setCancelAtPeriodEnd(false);
    } catch (error) {
      const { toast } = await import('../ui/sonner');
      toast.error('Failed to reactivate subscription');
    } finally {
      setIsReactivating(false);
    }
  };

  const handlePlanChange = async (newPlan: 'basic' | 'premium') => {
    console.log('[Plan Change] Starting plan change to:', newPlan);
    setIsChangingPlan(true);
    try {
      const { updateSubscriptionPlan } = await import('../../utils/dashboard-api');
      const result = await updateSubscriptionPlan(newPlan);

      const { toast } = await import('../ui/sonner');

      if (result.deferred) {
        toast.success(result.message || `Your plan will switch to Basic at the end of your billing period.`);
        setPendingDowngrade(result.subscription?.pendingDowngrade || 'basic');
        setDowngradeEffectiveDate(result.subscription?.downgradeEffectiveDate || null);
        setShowDowngradeConfirm(false);
      } else {
        toast.success(`Successfully ${newPlan === 'premium' ? 'upgraded to' : 'changed to'} ${newPlan} plan!`);
        // Clear pending downgrade if upgrading back
        if (newPlan === 'premium') {
          setPendingDowngrade(null);
          setDowngradeEffectiveDate(null);
        }
        if (onPlanChange) {
          onPlanChange(newPlan);
        }
        if (onDataUpdated) {
          onDataUpdated();
        }
        onClose();
      }

      setIsChangingPlan(false);
    } catch (error) {
      console.error('[Plan Change] Error:', error);
      const { toast } = await import('../ui/sonner');
      toast.error(`Failed to change plan: ${error instanceof Error ? error.message : 'Please try again.'}`);
      setIsChangingPlan(false);
    }
  };

  const handleCancelDowngrade = async () => {
    setIsCancellingDowngrade(true);
    try {
      const { cancelDowngrade } = await import('../../utils/dashboard-api');
      await cancelDowngrade();
      const { toast } = await import('../ui/sonner');
      toast.success("Downgrade cancelled. You'll continue on Premium.");
      setPendingDowngrade(null);
      setDowngradeEffectiveDate(null);
    } catch (error) {
      const { toast } = await import('../ui/sonner');
      toast.error('Failed to cancel downgrade');
    } finally {
      setIsCancellingDowngrade(false);
    }
  };

  const handleResetPassword = async () => {
    if (!userProfile?.email) {
      setPasswordResetStatus('error');
      setPasswordResetMessage('Email address not found');
      return;
    }

    setIsResettingPassword(true);
    setPasswordResetStatus('idle');
    setPasswordResetMessage('');

    try {
      const response = await fetch(`${API_CONFIG.baseUrl}/auth/request-password-reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userProfile.email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send password reset email');
      }

      setPasswordResetStatus('success');
      setPasswordResetMessage('Check your email for a password reset link (expires in 1 hour)');
    } catch (error) {
      console.error('Error sending password reset email:', error);
      setPasswordResetStatus('error');
      setPasswordResetMessage(error instanceof Error ? error.message : 'Failed to send password reset email. Please try again.');
    } finally {
      setIsResettingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      return;
    }

    setIsDeleting(true);
    try {
      const { getIdToken } = await import('../../utils/auth/cognito');
      const token = await getIdToken() || '';

      const response = await fetch(`${API_CONFIG.baseUrl}/user/account`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete account');
      }

      // Close modal and sign out
      onClose();
      onSignOut();
    } catch (error) {
      console.error('Error deleting account:', error);
      alert(`Failed to delete account: ${error instanceof Error ? error.message : 'Please try again.'}`);
      setIsDeleting(false);
      setShowDeleteConfirm(false);
      setDeleteConfirmText('');
    }
  };

  const plans = [
    {
      name: 'Basic',
      price: '$4.99',
      features: [
        'Up to 10 invoices per month',
        'Up to 10 customers',
        'Stripe & Square payment processing',
        'Automatic PDF receipts via email',
        'Estimates & quotes',
        'Payment links',
        'Basic customer management',
        'Mobile & web access',
        'Email support',
      ],
    },
    {
      name: 'Premium',
      price: '$9.99',
      features: [
        'Unlimited invoices',
        'Unlimited customers',
        'Stripe & Square payment processing',
        'Automatic PDF receipts via email',
        'Estimates & quotes',
        'Payment links',
        'Advanced customer management',
        'Sales analytics & reports',
        'Custom branding & invoice templates',
        'Mobile & web access',
        'Priority email support',
      ],
    },
  ];

  return (
    <>
      <Dialog open={open && !showDeleteConfirm} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              <span style={{ fontFamily: 'Poppins, sans-serif' }}>Account & Subscription</span>
            </DialogTitle>
            <DialogDescription>
              Manage your subscription plan and account details
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Current Plan */}
            <div className="bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] p-6 rounded-lg text-white">
              <div className="flex items-center gap-2 mb-2">
                {isPremium && <Crown className="w-5 h-5 text-[#F59E0B]" />}
                <h3 className="text-xl" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {isPremium ? 'Premium' : 'Basic'} Plan
                </h3>
              </div>
              <p className="text-white/80">
                {isPremium ? 'You have access to all premium features' : 'Upgrade to unlock all features'}
              </p>
            </div>

            {/* Plan Comparison */}
            <div className="grid md:grid-cols-2 gap-4">
              {plans.map((plan) => {
                const isCurrentPlan = (isPremium && plan.name === 'Premium') || (!isPremium && plan.name === 'Basic');
                return (
                  <Card key={plan.name} className={`p-6 ${isCurrentPlan ? 'border-[#1E3A8A] border-2' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {plan.name}
                      </h3>
                      {isCurrentPlan && (
                        <span className="px-2 py-1 bg-[#14B8A6] text-white text-xs rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                    <div className="text-3xl text-[#1E3A8A] mb-4" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                      {plan.price}
                      <span className="text-sm text-gray-600">/month</span>
                    </div>
                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                          <Check className="w-4 h-4 text-[#14B8A6] flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    {!isCurrentPlan && (
                      <Button 
                        className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white"
                        onClick={() => {
                          setPendingPlan(plan.name.toLowerCase() as 'basic' | 'premium');
                          if (plan.name === 'Premium') {
                            setShowUpgradeConfirm(true);
                          } else {
                            setShowDowngradeConfirm(true);
                          }
                        }}
                        disabled={isChangingPlan}
                      >
                        {isChangingPlan ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          plan.name === 'Premium' ? 'Upgrade Now' : 'Downgrade'
                        )}
                      </Button>
                    )}
                  </Card>
                );
              })}
            </div>

            {/* Account Info */}
            <Card className="p-6 border-gray-200">
              <h3 className="text-lg mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Account Information
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Email</span>
                  <span className="text-gray-900">{userProfile?.email || 'Not set'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Account Created</span>
                  <span className="text-gray-900">
                    {userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                {isTrial && trialEndsAt && (
                  <>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">Trial Ends</span>
                      <span className="text-amber-600">
                        {new Date(trialEndsAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        {trialDaysRemaining > 0 && ` (${trialDaysRemaining} day${trialDaysRemaining !== 1 ? 's' : ''} left)`}
                      </span>
                    </div>
                    {trialDaysRemaining <= 1 && (
                      <div className="py-2 px-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                        <strong>Last day of your free trial!</strong> Choose a plan to keep your Premium features.
                      </div>
                    )}
                  </>
                )}
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">{cancelAtPeriodEnd ? 'Access Until' : isTrial ? 'First Billing Date' : 'Next Billing Date'}</span>
                  <span className={cancelAtPeriodEnd ? 'text-amber-600' : 'text-gray-900'}>
                    {isTrial && trialEndsAt
                      ? new Date(trialEndsAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                      : currentPeriodEnd
                        ? new Date(currentPeriodEnd).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                        : 'Monthly'}
                  </span>
                </div>
              </div>
            </Card>

            {/* Security Settings */}
            <Card className="p-6 border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <Lock className="w-5 h-5 text-[#1E3A8A]" />
                <h3 className="text-lg" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Security
                </h3>
              </div>
              <div className="space-y-4">
                {/* Password Reset */}
                <div className="flex items-start justify-between py-4 border-b border-gray-200 last:border-0">
                  <div className="flex-1">
                    <h4 className="text-sm text-gray-900 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Password
                    </h4>
                    <p className="text-xs text-gray-600">
                      For security, password changes require email verification. We'll send you a secure link to reset your password.
                    </p>
                  </div>
                  <Button 
                    onClick={handleResetPassword}
                    disabled={isResettingPassword}
                    variant="outline"
                    className="ml-4 border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white"
                  >
                    {isResettingPassword ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4 mr-2" />
                        Reset Password
                      </>
                    )}
                  </Button>
                </div>
                {passwordResetStatus !== 'idle' && (
                  <div className="flex items-center gap-2">
                    {passwordResetStatus === 'success' ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    <p className={`text-sm ${passwordResetStatus === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                      {passwordResetMessage}
                    </p>
                  </div>
                )}
              </div>
            </Card>

            {/* Subscription Management */}
            {isPremium && (
              <Card className="p-6 border-gray-200">
                <h3 className="text-lg mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Subscription
                </h3>

                {cancelAtPeriodEnd && currentPeriodEnd ? (
                  <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-amber-900 font-medium">Subscription Ending Soon</p>
                      <p className="text-sm text-amber-800 mt-1">
                        Your subscription will be cancelled on {new Date(currentPeriodEnd).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.
                        You'll continue to have access until then.
                      </p>
                      <Button
                        size="sm"
                        className="mt-3 bg-amber-600 hover:bg-amber-700 text-white"
                        onClick={handleReactivateSubscription}
                        disabled={isReactivating}
                      >
                        {isReactivating ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Reactivating...
                          </>
                        ) : 'Reactivate Subscription'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">
                        Cancel your subscription. You'll keep access until the end of your current billing period.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className="ml-4 border-red-300 text-red-600 hover:bg-red-50"
                      onClick={() => setShowCancelConfirm(true)}
                    >
                      Cancel Subscription
                    </Button>
                  </div>
                )}

                {/* Pending Downgrade Notice */}
                {pendingDowngrade && downgradeEffectiveDate && (
                  <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg mt-4">
                    <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-amber-900 font-medium">Downgrade Scheduled</p>
                      <p className="text-sm text-amber-800 mt-1">
                        Your plan will switch to Basic on {new Date(downgradeEffectiveDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.
                        You'll keep all Premium features until then.
                      </p>
                      <Button
                        size="sm"
                        className="mt-3 bg-amber-600 hover:bg-amber-700 text-white"
                        onClick={handleCancelDowngrade}
                        disabled={isCancellingDowngrade}
                      >
                        {isCancellingDowngrade ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Cancelling...
                          </>
                        ) : 'Keep Premium'}
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            )}

            {/* Danger Zone */}
            <Card className="p-6 border-red-200 bg-red-50/50">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-gray-900 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Danger Zone
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  <Button 
                    onClick={() => setShowDeleteConfirm(true)}
                    variant="outline"
                    className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <DialogTitle className="text-xl" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Delete Account
              </DialogTitle>
            </div>
            <DialogDescription className="text-base pt-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              This action is permanent and cannot be undone. All of your data will be permanently deleted, including:
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <ul className="space-y-2 text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
                All invoices and customer records
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
                Business profile and settings
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
                Payment history and analytics
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
                Your subscription and billing information
              </li>
            </ul>

            <div className="pt-4 border-t border-gray-200">
              <Label htmlFor="delete-confirm" className="text-sm text-gray-700 mb-2 block">
                To confirm, type <span className="font-mono font-semibold text-red-600">DELETE</span> below:
              </Label>
              <Input
                id="delete-confirm"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Type DELETE to confirm"
                className="font-mono"
                disabled={isDeleting}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteConfirm(false);
                setDeleteConfirmText('');
              }}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={deleteConfirmText !== 'DELETE' || isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account Permanently
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upgrade Confirmation Dialog */}
      <Dialog open={showUpgradeConfirm} onOpenChange={setShowUpgradeConfirm}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <DialogTitle className="text-xl" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Upgrade to Premium
              </DialogTitle>
            </div>
            <DialogDescription className="text-base pt-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              Upgrade to the Premium plan to unlock advanced features and support.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <ul className="space-y-2 text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
                Unlimited invoices & customers
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
                Sales analytics & reports
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
                Custom branding & invoice templates
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
                Priority email support
              </li>
            </ul>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowUpgradeConfirm(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handlePlanChange(pendingPlan)}
              className="bg-green-600 hover:bg-green-700"
            >
              {isChangingPlan ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Upgrade to Premium
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Downgrade Confirmation Dialog */}
      <Dialog open={showDowngradeConfirm} onOpenChange={setShowDowngradeConfirm}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <DialogTitle className="text-xl" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Downgrade to Basic
              </DialogTitle>
            </div>
            <DialogDescription className="text-base pt-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              Downgrading to the Basic plan will remove access to advanced features and support.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <ul className="space-y-2 text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
                Limited to 10 invoices/month
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
                Basic customer management
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
                Email support
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
                PDF invoice generation
              </li>
            </ul>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDowngradeConfirm(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handlePlanChange(pendingPlan)}
              className="bg-red-600 hover:bg-red-700"
            >
              {isChangingPlan ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Downgrade to Basic
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Subscription Confirmation Dialog */}
      <Dialog open={showCancelConfirm} onOpenChange={setShowCancelConfirm}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-amber-600" />
              </div>
              <DialogTitle className="text-xl" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Cancel Subscription
              </DialogTitle>
            </div>
            <DialogDescription className="text-base pt-2">
              Are you sure you want to cancel your subscription?
            </DialogDescription>
          </DialogHeader>

          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm font-medium text-amber-900 mb-2">What happens when you cancel:</p>
            <ul className="space-y-1.5 text-sm text-amber-800">
              {isTrial ? (
                <>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 flex-shrink-0" />
                    You'll have full access until the end of your 14-day trial
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 flex-shrink-0" />
                    No charges will be made
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 flex-shrink-0" />
                    You'll have access until the end of your current billing period
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 flex-shrink-0" />
                    No refunds for partial months
                  </li>
                </>
              )}
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 flex-shrink-0" />
                Your data will be retained for 30 days
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 flex-shrink-0" />
                You can reactivate anytime before your access ends
              </li>
            </ul>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelConfirm(false)}>
              Keep Subscription
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelSubscription}
              disabled={isCancelling}
            >
              {isCancelling ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Cancelling...
                </>
              ) : 'Yes, Cancel'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
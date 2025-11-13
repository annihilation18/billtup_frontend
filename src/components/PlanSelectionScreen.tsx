import React, { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { BilltUpLogo } from "./BilltUpLogo";
import { Check, Sparkles, Zap } from "lucide-react";
import { PLANS, PlanType, formatPlanPrice } from "../utils/subscriptionPlans";

interface PlanSelectionScreenProps {
  onSelectPlan: (planType: Exclude<PlanType, 'trial'>) => void;
  onBack?: () => void;
}

export function PlanSelectionScreen({ onSelectPlan, onBack }: PlanSelectionScreenProps) {
  const [selectedPlan, setSelectedPlan] = useState<Exclude<PlanType, 'trial'>>('basic');

  const handleContinue = () => {
    onSelectPlan(selectedPlan);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] to-[#1E3A8A] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
              <BilltUpLogo variant="white" size="lg" />
            </div>
          </div>
          <h1 className="text-white mb-2">Choose Your Plan</h1>
          <p className="text-white/80 text-lg">
            Start with a 14-day free trial • No credit card required • Cancel anytime
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Basic Plan */}
          <Card
            className={`p-8 cursor-pointer transition-all ${
              selectedPlan === 'basic'
                ? 'ring-4 ring-[#14B8A6] shadow-2xl scale-105'
                : 'hover:shadow-xl hover:scale-102'
            }`}
            onClick={() => setSelectedPlan('basic')}
          >
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="mb-2">{PLANS.basic.name}</h2>
              <div className="mb-4">
                <span className="text-4xl font-bold">${PLANS.basic.price}</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Perfect for small businesses getting started
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <FeatureItem text="Up to 50 invoices per month" />
              <FeatureItem text="Up to 100 customers" />
              <FeatureItem text="Payment processing (3.5% + $0.50)" />
              <FeatureItem text="Automatic PDF receipts via email" />
              <FeatureItem text="Basic customer management" />
              <FeatureItem text="Mobile & web access" />
              <FeatureItem text="Email support" />
            </div>

            <Button
              className={`w-full ${
                selectedPlan === 'basic'
                  ? 'bg-[#14B8A6] hover:bg-[#14B8A6]/90'
                  : 'bg-primary hover:bg-primary/90'
              }`}
              onClick={() => setSelectedPlan('basic')}
            >
              {selectedPlan === 'basic' ? 'Selected' : 'Select Basic'}
            </Button>
          </Card>

          {/* Premium Plan */}
          <Card
            className={`p-8 cursor-pointer transition-all relative ${
              selectedPlan === 'premium'
                ? 'ring-4 ring-[#14B8A6] shadow-2xl scale-105'
                : 'hover:shadow-xl hover:scale-102'
            }`}
            onClick={() => setSelectedPlan('premium')}
          >
            {/* Popular Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 px-4 py-1">
                <Sparkles className="w-3 h-3 mr-1" />
                Most Popular
              </Badge>
            </div>

            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full mb-3">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="mb-2">{PLANS.premium.name}</h2>
              <div className="mb-4">
                <span className="text-4xl font-bold">${PLANS.premium.price}</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Everything in Basic, plus unlimited growth
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <FeatureItem text="Unlimited invoices" premium />
              <FeatureItem text="Unlimited customers" premium />
              <FeatureItem text="Payment processing (3.5% + $0.50)" premium />
              <FeatureItem text="Automatic PDF receipts via email" premium />
              <FeatureItem text="Advanced customer management" premium />
              <FeatureItem text="Sales analytics & reports" premium />
              <FeatureItem text="Custom branding & logo colors" premium />
              <FeatureItem text="Use your own domain email" premium />
              <FeatureItem text="Mobile & web access" premium />
              <FeatureItem text="Priority email support" premium />
            </div>

            <Button
              className={`w-full ${
                selectedPlan === 'premium'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
              }`}
              onClick={() => setSelectedPlan('premium')}
            >
              {selectedPlan === 'premium' ? 'Selected' : 'Select Premium'}
            </Button>
          </Card>
        </div>

        {/* Trial Info */}
        <Card className="p-6 bg-blue-50 border-blue-200 mb-6">
          <div className="text-center">
            <h3 className="text-blue-900 mb-2">🎉 Start Your Free Trial</h3>
            <p className="text-sm text-blue-800">
              All plans include a <strong>14-day free trial</strong> with unlimited invoices and full premium features.
              After the trial, your selected plan will begin. No credit card required to start!
            </p>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          {onBack && (
            <Button
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={onBack}
            >
              Back
            </Button>
          )}
          <Button
            size="lg"
            className="bg-[#14B8A6] hover:bg-[#14B8A6]/90 px-12"
            onClick={handleContinue}
          >
            Continue with {PLANS[selectedPlan].name}
          </Button>
        </div>

        {/* FAQ Link */}
        <div className="text-center mt-8">
          <p className="text-white/60 text-sm">
            Questions? View our{" "}
            <a href="#" className="text-[#14B8A6] hover:underline">
              FAQ
            </a>{" "}
            or{" "}
            <a href="#" className="text-[#14B8A6] hover:underline">
              contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ text, premium = false }: { text: string; premium?: boolean }) {
  return (
    <div className="flex items-start gap-3">
      <div
        className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
          premium
            ? 'bg-gradient-to-br from-purple-100 to-pink-100'
            : 'bg-green-100'
        }`}
      >
        <Check
          className={`w-3 h-3 ${
            premium ? 'text-purple-600' : 'text-green-600'
          }`}
        />
      </div>
      <span className="text-sm">{text}</span>
    </div>
  );
}

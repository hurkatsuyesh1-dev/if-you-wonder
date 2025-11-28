import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSpends } from '@/context/SpendContext';
import { SpendForm } from '@/components/SpendForm';
import { FutureValueDisplay } from '@/components/FutureValueDisplay';
import { RegretMeter } from '@/components/RegretMeter';
import { NeedWantImpulse } from '@/components/NeedWantImpulse';
import { InterestRateSlider } from '@/components/InterestRateSlider';
import { AlternativeSuggestion } from '@/components/AlternativeSuggestion';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { useFutureValue } from '@/hooks/useFutureValue';
import { useRegretScore } from '@/hooks/useRegretScore';
import { getRandomAlternative } from '@/lib/alternatives';
import { Spend, SpendType } from '@/types/spend';
import { ArrowLeft, Check, RotateCcw } from 'lucide-react';

type Step = 'form' | 'classify' | 'result';

export default function LogSpend() {
  const navigate = useNavigate();
  const { addSpend, updateSpendType, interestRate, setInterestRate } = useSpends();
  
  const [step, setStep] = useState<Step>('form');
  const [currentSpend, setCurrentSpend] = useState<Spend | null>(null);
  const [selectedType, setSelectedType] = useState<SpendType | undefined>();
  
  const amount = currentSpend?.amount || 0;
  const futureValue = useFutureValue(amount, interestRate);
  const regretScore = useRegretScore(amount, interestRate, selectedType);
  const alternative = currentSpend ? getRandomAlternative(currentSpend.category) : null;

  const handleFormSubmit = async (spendData: Omit<Spend, 'id' | 'createdAt' | 'type'>) => {
    try {
      const spend = await addSpend(spendData);
      setCurrentSpend(spend);
      setStep('classify');
    } catch (error) {
      // Error already handled in context
    }
  };

  const handleTypeSelect = async (type: SpendType) => {
    setSelectedType(type);
    if (currentSpend) {
      await updateSpendType(currentSpend.id, type);
    }
    setStep('result');
  };

  const handleReset = () => {
    setStep('form');
    setCurrentSpend(null);
    setSelectedType(undefined);
  };

  const handleDone = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="container max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => step === 'form' ? navigate('/') : handleReset()}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold">
                {step === 'form' ? 'Log Spend' : 
                 step === 'classify' ? 'Classify It' : 
                 'Your Regret Report'}
              </h1>
              <p className="text-xs text-muted-foreground">
                {step === 'form' ? 'Quick and honest' :
                 step === 'classify' ? 'Be real with yourself' :
                 'The truth hurts (but helps!)'}
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container max-w-lg mx-auto px-4 py-6">
        {/* Step 1: Form */}
        {step === 'form' && (
          <div className="animate-fade-in">
            <SpendForm onSubmit={handleFormSubmit} />
          </div>
        )}

        {/* Step 2: Classify */}
        {step === 'classify' && currentSpend && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center p-4 rounded-xl bg-card border border-border">
              <p className="text-sm text-muted-foreground mb-1">You spent</p>
              <p className="text-4xl font-bold text-foreground">
                ₹{currentSpend.amount.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground mt-1 capitalize">
                on {currentSpend.category}
              </p>
            </div>

            <NeedWantImpulse 
              selected={selectedType}
              onSelect={handleTypeSelect}
            />

            <p className="text-center text-sm text-muted-foreground">
              Tap one to see how this affects your future 👆
            </p>
          </div>
        )}

        {/* Step 3: Result */}
        {step === 'result' && currentSpend && (
          <div className="space-y-6 animate-fade-in">
            {/* Regret Meter - Hero */}
            <div className="flex justify-center">
              <RegretMeter 
                score={regretScore.score} 
                size="lg"
                showLabel
              />
            </div>

            {/* Interest Rate Slider */}
            <InterestRateSlider 
              value={interestRate}
              onChange={setInterestRate}
            />

            {/* Future Value Calculator */}
            <FutureValueDisplay 
              amount={currentSpend.amount}
              futureValue={futureValue}
            />

            {/* Alternative Suggestion */}
            {alternative && selectedType !== 'need' && (
              <AlternativeSuggestion alternative={alternative} />
            )}

            {/* Playful Copy */}
            <div className="text-center p-4 rounded-xl bg-muted/50">
              {regretScore.level === 'low' && (
                <p className="text-sm text-muted-foreground">
                  ✨ Not bad! This seems like a reasonable spend. Keep it up!
                </p>
              )}
              {regretScore.level === 'medium' && (
                <p className="text-sm text-muted-foreground">
                  🤔 Hmm, future you might raise an eyebrow at this one...
                </p>
              )}
              {regretScore.level === 'high' && (
                <p className="text-sm text-muted-foreground">
                  😬 Ouch! This one's gonna sting when you look back. But hey, awareness is the first step!
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={handleReset}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Log Another
              </Button>
              <Button 
                className="flex-1"
                onClick={handleDone}
              >
                <Check className="w-4 h-4 mr-2" />
                Done
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Wallet,
  CreditCard,
  Loader2,
  CheckCircle,
  ExternalLink,
  AlertCircle,
  Shield,
  Zap,
  Leaf,
  Award,
} from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    name: string;
    provider: string;
    pricePerTon: number;
    certification: string;
    type: string;
  };
  offsetAmount: number;
  totalCost: number;
  onPayWithCrypto: (amount: number) => Promise<void>;
  onPayWithPayPal: (amount: number) => void;
  isProcessing: boolean;
  isWalletConnected: boolean;
}

export function PaymentModal({
  isOpen,
  onClose,
  project,
  offsetAmount: initialOffsetAmount,
  totalCost: initialTotalCost,
  onPayWithCrypto,
  onPayWithPayPal,
  isProcessing,
  isWalletConnected,
}: PaymentModalProps): JSX.Element {
  const [selectedMethod, setSelectedMethod] = useState<'crypto' | 'paypal' | null>(null);
  const [offsetAmount, setOffsetAmount] = useState<number>(initialOffsetAmount);
  const [inputValue, setInputValue] = useState<string>(initialOffsetAmount.toString());

  // Preset amounts in kg (1 tonne = 1000 kg)
  const presetAmounts = [
    { label: '1 Tonne', value: 1000 },
    { label: '5 Tonnes', value: 5000 },
    { label: '10 Tonnes', value: 10000 },
    { label: '50 Tonnes', value: 50000 },
  ];

  // Calculate total cost based on offset amount
  const calculateTotalCost = (amountInKg: number): number => {
    const tonnes = amountInKg / 1000;
    return tonnes * project.pricePerTon;
  };

  const totalCost = calculateTotalCost(offsetAmount);

  // Update input value when offset amount changes
  useEffect(() => {
    setInputValue(offsetAmount.toString());
  }, [offsetAmount]);

  const handlePaymentMethodSelect = (method: 'crypto' | 'paypal'): void => {
    setSelectedMethod(method);
  };

  const handleConfirmPayment = async (): Promise<void> => {
    if (selectedMethod === 'crypto') {
      await onPayWithCrypto(offsetAmount);
    } else if (selectedMethod === 'paypal') {
      onPayWithPayPal(offsetAmount);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setInputValue(value);
    
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 100 && numValue <= 1000000) {
      setOffsetAmount(numValue);
    }
  };

  const handleSliderChange = (value: number[]): void => {
    setOffsetAmount(value[0]);
  };

  const handlePresetClick = (amount: number): void => {
    setOffsetAmount(amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Complete Your Carbon Offset Purchase</DialogTitle>
          <DialogDescription>
            Choose the amount you want to offset and your preferred payment method
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* NFT Certificate Reward Badge */}
          <Alert className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-300 dark:border-purple-700">
            <Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <AlertDescription className="text-purple-900 dark:text-purple-100 text-sm">
              <strong>🎁 You will receive an NFT Certificate!</strong> Every purchase includes a blockchain-verified NFT as permanent proof of your carbon offset contribution.
            </AlertDescription>
          </Alert>
          {/* Offset Amount Selector */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
              <Leaf className="h-5 w-5" />
              Select Offset Amount
            </h3>

            {/* Preset Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
              {presetAmounts.map((preset) => (
                <Button
                  key={preset.value}
                  onClick={() => handlePresetClick(preset.value)}
                  variant={offsetAmount === preset.value ? 'default' : 'outline'}
                  className={`${
                    offsetAmount === preset.value
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'hover:bg-blue-100 dark:hover:bg-blue-900'
                  }`}
                >
                  {preset.label}
                </Button>
              ))}
            </div>

            {/* Manual Input */}
            <div className="space-y-3">
              <div>
                <Label htmlFor="offset-amount" className="text-sm text-gray-700 dark:text-gray-300">
                  Custom Amount (kg CO₂)
                </Label>
                <div className="flex gap-2 items-center mt-1">
                  <Input
                    id="offset-amount"
                    type="number"
                    min="100"
                    max="1000000"
                    step="100"
                    value={inputValue}
                    onChange={handleInputChange}
                    className="flex-1"
                  />
                  <Badge variant="outline" className="whitespace-nowrap">
                    {(offsetAmount / 1000).toFixed(2)} tonnes
                  </Badge>
                </div>
              </div>

              {/* Slider */}
              <div>
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-2">
                  <span>100 kg</span>
                  <span>50,000 kg (50 tonnes)</span>
                </div>
                <Slider
                  value={[offsetAmount]}
                  onValueChange={handleSliderChange}
                  min={100}
                  max={50000}
                  step={100}
                  className="w-full"
                />
              </div>
            </div>

            {/* Dynamic Price Preview */}
            <div className="mt-4 p-3 bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Estimated Cost</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {(offsetAmount / 1000).toFixed(2)} tonnes × ${project.pricePerTon.toFixed(2)}/tonne
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    ${totalCost.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Purchase Summary */}
          <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <h3 className="font-semibold text-green-900 dark:text-green-100 mb-3">
              Purchase Summary
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-700 dark:text-gray-300">Project:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {project.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700 dark:text-gray-300">Provider:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {project.provider}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700 dark:text-gray-300">Certification:</span>
                <Badge variant="secondary" className="text-xs">
                  {project.certification}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700 dark:text-gray-300">Offset Amount:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {offsetAmount.toFixed(0)} kg CO₂ ({(offsetAmount / 1000).toFixed(3)} tonnes)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700 dark:text-gray-300">Price per tonne:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  ${project.pricePerTon.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-green-300 dark:border-green-700">
                <span className="font-semibold text-green-900 dark:text-green-100">
                  Total Cost:
                </span>
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                  ${totalCost.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              Select Payment Method
            </h3>

            {/* Crypto Wallet Payment */}
            <button
              onClick={() => handlePaymentMethodSelect('crypto')}
              disabled={isProcessing || !isWalletConnected}
              className={`w-full p-4 border-2 rounded-lg transition-all text-left ${
                selectedMethod === 'crypto'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
              } ${!isWalletConnected ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <Wallet className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                        Pay with Crypto Wallet
                      </h4>
                      <Badge variant="outline" className="text-xs">
                        <Zap className="h-3 w-3 mr-1" />
                        Instant
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Pay with ETH and receive NFT certificate immediately
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        <Shield className="h-3 w-3 mr-1" />
                        Blockchain Verified
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Auto NFT Mint
                      </Badge>
                    </div>
                    {!isWalletConnected && (
                      <Alert className="mt-3">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-xs">
                          Please connect your wallet first to use this payment method
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
                {selectedMethod === 'crypto' && (
                  <CheckCircle className="h-6 w-6 text-blue-600" />
                )}
              </div>
            </button>

            {/* PayPal Payment */}
            <button
              onClick={() => handlePaymentMethodSelect('paypal')}
              disabled={isProcessing}
              className={`w-full p-4 border-2 rounded-lg transition-all text-left cursor-pointer ${
                selectedMethod === 'paypal'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <CreditCard className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                        Pay with PayPal
                      </h4>
                      <Badge variant="outline" className="text-xs">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Redirect
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Pay via PayPal - NFT will be minted after payment confirmation
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        Credit Card
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        Debit Card
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        PayPal Balance
                      </Badge>
                    </div>
                  </div>
                </div>
                {selectedMethod === 'paypal' && (
                  <CheckCircle className="h-6 w-6 text-blue-600" />
                )}
              </div>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              onClick={onClose}
              variant="outline"
              disabled={isProcessing}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmPayment}
              disabled={!selectedMethod || isProcessing || offsetAmount < 100}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {selectedMethod === 'crypto' && <Wallet className="h-4 w-4 mr-2" />}
                  {selectedMethod === 'paypal' && <CreditCard className="h-4 w-4 mr-2" />}
                  {selectedMethod ? `Pay $${totalCost.toFixed(2)}` : 'Select Payment Method'}
                </>
              )}
            </Button>
          </div>

          {/* Security Note */}
          <div className="p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-start gap-2">
              <Shield className="h-4 w-4 text-gray-600 dark:text-gray-400 mt-0.5" />
              <div className="text-xs text-gray-600 dark:text-gray-400">
                <strong>Secure Payment:</strong> All transactions are encrypted and verified on
                blockchain. Your offset certificate will be permanently stored on IPFS with
                immutable proof of purchase.
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

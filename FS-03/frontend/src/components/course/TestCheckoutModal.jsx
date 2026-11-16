import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  X, 
  Clock, 
  BookOpen, 
  Award,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const TestCheckoutModal = ({ 
  isOpen, 
  onClose, 
  course, 
  user, 
  onConfirmPurchase 
}) => {
  const [paymentMethod, setPaymentMethod] = useState('sandbox_oneclick'); // 'sandbox_oneclick' | 'mock_card'
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvc, setCvc] = useState('888');
  const [cardHolder, setCardHolder] = useState(user?.name || 'Diane Nguyen');
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  useEffect(() => {
    if (user?.name) {
      setCardHolder(user.name);
    }
  }, [user]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isProcessing) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isProcessing, onClose]);

  if (!isOpen || !course) return null;

  const originalPrice = course.price || 49.99;
  const finalPrice = course.discountPrice !== null && course.discountPrice !== undefined
    ? course.discountPrice 
    : originalPrice;
  const discountAmount = Math.max(0, originalPrice - finalPrice);

  const handlePay = async () => {
    setIsProcessing(true);

    // Simulate realistic 800ms payment gateway roundtrip
    await new Promise((r) => setTimeout(r, 800));

    try {
      await onConfirmPurchase(course._id);
      setIsProcessing(false);
      setPurchaseSuccess(true);

      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Auto close after showing success animation
      setTimeout(() => {
        setPurchaseSuccess(false);
        onClose();
      }, 1600);
    } catch (err) {
      setIsProcessing(false);
      alert('Checkout error: ' + (err.message || 'Payment simulation failed.'));
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isProcessing) onClose();
      }}
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-scale-up relative"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header Badge */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-white/20 rounded-lg">
              <Zap className="w-4 h-4 text-yellow-300" />
            </span>
            <div>
              <h3 className="text-sm font-extrabold tracking-tight">Course Checkout</h3>
              <p className="text-[10px] text-blue-100 flex items-center gap-1 font-mono">
                <Sparkles className="w-3 h-3 text-yellow-300" />
                TEST MODE ACTIVATED — Zero Real Charges
              </p>
            </div>
          </div>

          {!isProcessing && (
            <button
              onClick={onClose}
              className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Success View */}
        {purchaseSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xl font-black text-slate-900">Payment Successful!</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                You have officially enrolled in <span className="font-bold text-slate-700">{course.title}</span>.
                All curriculum modules and videos are unlocked!
              </p>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full">
              <Award className="w-4 h-4" />
              Verified Certificate Track Active
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            {/* Course Summary Card */}
            <div className="flex gap-4 p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl">
              <img 
                src={course.thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&auto=format&fit=crop&q=80'} 
                alt={course.title}
                className="w-20 h-20 rounded-xl object-cover shrink-0 border border-slate-200 shadow-sm"
              />
              <div className="space-y-1 min-w-0 flex-1">
                <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-wider">
                  {course.category}
                </span>
                <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{course.title}</h4>
                <p className="text-[11px] text-slate-500 truncate">Instructor: {course.instructorName || 'Jenny Wilson'}</p>
                
                <div className="flex items-center gap-3 text-[10px] text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3 text-slate-400" />
                    {course.totalLessons || 6} Lessons
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {course.totalDurationMinutes || 120} mins
                  </span>
                </div>
              </div>
            </div>

            {/* Price Calculation Box */}
            <div className="p-3.5 bg-blue-50/50 border border-blue-100 rounded-2xl space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Standard Tuition</span>
                <span className={discountAmount > 0 ? 'line-through text-slate-400' : 'font-semibold text-slate-700'}>
                  ${originalPrice.toFixed(2)}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Student Grant / Discount</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="pt-2 border-t border-blue-200/60 flex justify-between items-center text-sm font-extrabold text-slate-900">
                <span>Total Amount Due</span>
                <span className="text-lg text-blue-600">${finalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Test Payment Simulation Method Tabs */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Select Test Payment Method</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('sandbox_oneclick')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    paymentMethod === 'sandbox_oneclick'
                      ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/20'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Zap className={`w-4 h-4 ${paymentMethod === 'sandbox_oneclick' ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span className="text-xs font-bold text-slate-800">1-Click Sandbox</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Instant simulated checkout</p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('mock_card')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    paymentMethod === 'mock_card'
                      ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/20'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <CreditCard className={`w-4 h-4 ${paymentMethod === 'mock_card' ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span className="text-xs font-bold text-slate-800">Mock Card</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Pre-filled test numbers</p>
                </button>
              </div>
            </div>

            {/* Mock Card Form Details if Mock Card chosen */}
            {paymentMethod === 'mock_card' && (
              <div className="space-y-2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs animate-fade-in">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Test Card Number</label>
                  <input
                    type="text"
                    readOnly
                    value={cardNumber}
                    className="w-full mt-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-mono text-slate-700 text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Expires</label>
                    <input
                      type="text"
                      readOnly
                      value={expiry}
                      className="w-full mt-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-mono text-slate-700 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Security Code</label>
                    <input
                      type="text"
                      readOnly
                      value={cvc}
                      className="w-full mt-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-mono text-slate-700 text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Security Guarantee Notice */}
            <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Simulated Payment Sandbox. Enrolls student and clears instructor earnings instantly.</span>
            </div>

            {/* Pay Button */}
            <button
              type="button"
              onClick={handlePay}
              disabled={isProcessing}
              className="w-full py-3 px-4 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing Test Payment...</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Pay ${finalPrice.toFixed(2)} & Enroll (Test Mode)</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

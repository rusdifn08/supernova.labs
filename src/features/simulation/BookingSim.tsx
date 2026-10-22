import { useState } from 'preact/hooks';
import { Check } from 'lucide-preact';
import { BOOKING_STEP_LABELS, BOOKING_PACKAGES } from './constants';
import type { BookingPackage, BookingStudio } from './types';
import { BookingStudioStep } from './booking/BookingStudioStep';
import { BookingCalendarStep } from './booking/BookingCalendarStep';
import { BookingCheckoutModal } from './booking/BookingCheckoutModal';
import { BookingSyncStep } from './booking/BookingSyncStep';

export function BookingSim() {
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [studio, setStudio] = useState<BookingStudio | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [pkg, setPkg] = useState<BookingPackage | null>(null);
  const [paying, setPaying] = useState(false);

  const total = (studio?.from ?? 0) + (pkg?.add ?? 0);

  const handleSelectStudio = (s: BookingStudio) => {
    setStudio(s);
    setSlot('14:00');
    setPkg(BOOKING_PACKAGES[0]);
    setStep(1);
  };

  const handlePay = () => {
    setPaying(true);
    setTimeout(() => {
      setPaying(false);
      setStep(3);
    }, 1200);
  };

  const handleReset = () => {
    setStep(0);
    setStudio(null);
    setSlot(null);
    setPkg(null);
  };

  return (
    <div className="sim-glass-card">
      {/* Top Brand Decorative Gradient Bar */}
      <div className="sim-card-accent-bar" />

      {/* 4-Step Stepper Header */}
      <div className="mb-8 flex items-center justify-between">
        {BOOKING_STEP_LABELS.map((label, i) => (
          <div key={label} className="flex flex-1 items-center">
            <div className="sim-stepper-item">
              <span
                className={`sim-stepper-circle ${
                  step === i
                    ? 'is-active'
                    : step > i
                    ? 'is-completed'
                    : ''
                }`}
              >
                {step > i ? <Check className="h-4 w-4" /> : i + 1}
              </span>
              <span
                className={`sim-stepper-label hidden sm:block ${
                  step >= i ? 'is-active' : ''
                }`}
              >
                {label}
              </span>
            </div>
            {i < BOOKING_STEP_LABELS.length - 1 && (
              <div className="sim-stepper-line">
                <div
                  className="sim-stepper-line-fill"
                  style={{ width: step > i ? '100%' : '0%' }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Step Components */}
      {step === 0 && (
        <BookingStudioStep onSelectStudio={handleSelectStudio} />
      )}

      {step === 1 && studio && (
        <BookingCalendarStep
          studio={studio}
          slot={slot}
          pkg={pkg}
          onSetSlot={(s) => setSlot(s)}
          onSetPkg={(p) => setPkg(p)}
          onBack={() => setStep(0)}
          onNext={() => setStep(2)}
        />
      )}

      {step === 2 && studio && slot && pkg && (
        <BookingCheckoutModal
          studio={studio}
          slot={slot}
          pkg={pkg}
          total={total}
          paying={paying}
          onPay={handlePay}
          onCancel={() => setStep(1)}
        />
      )}

      {step === 3 && studio && slot && (
        <BookingSyncStep
          studio={studio}
          slot={slot}
          onReset={handleReset}
        />
      )}
    </div>
  );
}

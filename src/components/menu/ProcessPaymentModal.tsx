"use client";

import { useState, useEffect } from "react";
import { X, Wallet, CreditCard, Calculator } from "lucide-react";

const formatRs = (n: number) =>
  `Rs.${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

type Step = "method" | "cash" | "success";

type ProcessPaymentModalProps = {
  customerName: string;
  total: number;
  onClose: () => void;
  onComplete: () => void;
};

export default function ProcessPaymentModal({
  customerName,
  total,
  onClose,
  onComplete,
}: ProcessPaymentModalProps) {
  const [step, setStep] = useState<Step>("method");
  const [amountGiven, setAmountGiven] = useState("");
  const [changeReturned, setChangeReturned] = useState(0);

  const amountNum = parseFloat(amountGiven.replace(/[^0-9.]/g, "")) || 0;
  const change = step === "cash" ? Math.max(0, amountNum - total) : changeReturned;

  const handleCompletePayment = () => {
    if (step === "cash") {
      if (amountNum < total) return;
      setChangeReturned(change);
      setStep("success");
    }
  };

  const handleSuccessClose = () => {
    onComplete();
    onClose();
  };

  // auto-close success after 5.5s so cashier can move to next customer; click-outside also closes
  useEffect(() => {
    if (step !== "success") return;
    const t = setTimeout(() => {
      onComplete();
      onClose();
    }, 5500);
    return () => clearTimeout(t);
  }, [step, onComplete, onClose]);

  const header = (
    <div className="border-b border-[#E2E8F0] pb-3">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-['Inter'] text-2xl font-bold leading-8 text-[#1D293D]">
            Process Payment
          </h2>
          <p className="mt-1 font-['Inter'] text-sm font-normal leading-5 text-[#62748E]">
            {customerName} • Total: {formatRs(total)}
          </p>
        </div>
        <button
          type="button"
          onClick={step === "success" ? handleSuccessClose : onClose}
          className="rounded-full p-1.5 text-[#90A1B9] hover:bg-[#F1F5F9] hover:text-[#45556C]"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
      onClick={step === "success" ? handleSuccessClose : onClose}
    >
      <div
        className="w-full max-w-[min(100%-2rem,28rem)] min-[1000px]:max-w-[32rem] min-[1200px]:max-w-[42rem] rounded-[32px] border border-[#FFFFFF33] bg-white p-4 shadow-[0px_25px_50px_-12px_#00000040] sm:p-6 min-[1000px]:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {header}

        {step === "method" && (
          <>
            <p className="mt-6 text-center font-['Inter'] text-lg font-bold leading-7 text-[#314158]">
              Select Payment Method
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 min-[1200px]:gap-6">
              <button
                type="button"
                onClick={() => {
                  setAmountGiven("");
                  setStep("cash");
                }}
                className="flex flex-col items-center justify-center rounded-[24px] border-2 border-[#A4F4CF] mb-2 p-4 transition-all duration-300 ease-out hover:opacity-95 sm:p-5 min-[1200px]:p-6"
                style={{
                  background: "linear-gradient(135deg, #ECFDF5 0%, rgba(208, 250, 229, 0.5) 100%)",
                }}
              >
                <span
                  className="flex h-16 w-16 min-h-[80px] min-w-[80px] items-center justify-center rounded-[16px] bg-[#00BC7D] text-white shadow-[0px_4px_6px_-4px_#A4F4CF,0px_10px_15px_-3px_#A4F4CF] sm:h-20 sm:w-20 mt-3"
                  aria-hidden
                >
                  <Wallet className="h-7 w-7 sm:h-8 sm:w-8" />
                </span>
                <span className="text-center mt-3 font-['Inter'] text-xl font-bold leading-7 text-[#1D293D]">
                  Cash
                </span>
                <span className="text-center font-['Inter'] text-sm font-medium leading-5 text-[#62748E] mb-3">
                  Pay with cash
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setChangeReturned(0);
                  setStep("success");
                }}
                className="flex flex-col items-center justify-center rounded-[24px] border-2 border-[#BEDBFF] mb-2 p-4 transition-all duration-300 ease-out hover:opacity-95 sm:p-5 min-[1200px]:p-6"
                style={{
                  background: "linear-gradient(135deg, #EFF6FF 0%, rgba(219, 234, 254, 0.5) 100%)",
                }}
              >
                <span
                  className="flex h-16 w-16 min-h-[80px] min-w-[80px] items-center justify-center rounded-[16px] bg-[#2B7FFF] text-white shadow-[0px_4px_6px_-4px_#BEDBFF,0px_10px_15px_-3px_#BEDBFF] sm:h-20 sm:w-20 mt-3"
                  aria-hidden
                >
                  <CreditCard className="h-7 w-7 sm:h-8 sm:w-8" />
                </span>
                <span className="text-center mt-3 font-['Inter'] text-xl font-bold leading-7 text-[#1D293D]">
                  Card
                </span>
                <span className="text-center font-['Inter'] text-sm font-medium leading-5 text-[#62748E] mb-3">
                  Pay with card
                </span>
              </button>
            </div>
          </>
        )}

        {step === "cash" && (
          <>
            <div className="mt-4 flex w-full items-center justify-between rounded-[16px] border border-[#E2E8F0] bg-[#F8FAFC] px-6 py-4 sm:px-[25px]">
              <span className="font-['Inter'] text-sm font-bold uppercase leading-5 tracking-[0.7px] text-[#62748E]">
                Order Total
              </span>
              <span className="font-['Inter'] text-2xl font-bold leading-9 text-[#1D293D] sm:text-[30px] sm:leading-[36px]">
                {formatRs(total)}
              </span>
            </div>
            <div className="mt-4">
              <label className="mb-2 flex items-center gap-2 font-['Inter'] text-sm font-bold leading-5 text-[#314158]">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0" aria-hidden>
                  <path d="M15 4.5H3C2.17157 4.5 1.5 5.17157 1.5 6V12C1.5 12.8284 2.17157 13.5 3 13.5H15C15.8284 13.5 16.5 12.8284 16.5 12V6C16.5 5.17157 15.8284 4.5 15 4.5Z" stroke="#009966" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 10.5C9.82843 10.5 10.5 9.82843 10.5 9C10.5 8.17157 9.82843 7.5 9 7.5C8.17157 7.5 7.5 8.17157 7.5 9C7.5 9.82843 8.17157 10.5 9 10.5Z" stroke="#009966" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4.5 9H4.5075M13.5 9H13.5075" stroke="#009966" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Amount Given by Customer
              </label>
              <input
                type="text"
                value={amountGiven}
                onChange={(e) => setAmountGiven(e.target.value)}
                placeholder="Rs.0.00"
                className="w-full min-h-[80px] rounded-[16px] border-2 border-[#E2E8F0] bg-white py-4 pl-[27px] pr-6 font-['Inter'] text-2xl font-bold leading-[100%] text-[#1D293D] placeholder:text-[#90A1B9] focus:border-[#22C55E] focus:outline-none focus:ring-2 focus:ring-[#22C55E]/20"
              />
            </div>
            <div
              className="mt-4 flex w-full flex-row items-center gap-4 rounded-[16px] border-2 border-[#A4F4CF] px-6 pb-6 pt-[26px] sm:px-[26px]"
              style={{
                background: "linear-gradient(135deg, #ECFDF5 0%, rgba(208, 250, 229, 0.5) 100%)",
              }}
            >
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-[#00BC7D] text-white shadow-[0px_4px_6px_-4px_#A4F4CF,0px_10px_15px_-3px_#A4F4CF]"
                aria-hidden
              >
                <Calculator className="h-6 w-6 text-white" stroke="#FFFFFF" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="font-['Inter'] text-xs font-bold uppercase leading-4 tracking-[0.6px] text-[#007A55]">
                  Change to Return
                </span>
                <span className="font-['Inter'] text-2xl font-bold leading-9 text-[#007A55] sm:text-[30px] sm:leading-[36px]">
                  {formatRs(change)}
                </span>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setStep("method")}
                className="flex-1 rounded-[16px] bg-[#E2E8F0] py-3.5 font-['Inter'] text-base font-bold leading-6 text-[#314158] transition-all duration-300 ease-out hover:opacity-90 min-[400px]:min-h-[56px]"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleCompletePayment}
                disabled={amountNum < total}
                className="flex flex-1 items-center justify-center gap-2 rounded-[16px] bg-[#00BC7D] py-3.5 font-['Inter'] text-base font-bold leading-6 text-white shadow-[0px_4px_6px_-4px_#0000001A,0px_10px_15px_-3px_#0000001A] transition-all duration-300 ease-out hover:bg-[#00A66D] disabled:opacity-50 disabled:pointer-events-none min-[400px]:min-h-[56px]"
              >
                Complete Payment
                <span className="inline-block h-5 w-5 shrink-0">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                    <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                  </svg>
                </span>
              </button>
            </div>
          </>
        )}

        {step === "success" && (
          <div className="flex flex-col items-center py-6">
            <span className="flex h-[104px] w-[104px] items-center justify-center rounded-full bg-[#00BC7D] text-white shadow-[0px_25px_50px_-12px_#A4F4CF]">
              <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0" aria-hidden>
                <path d="M25.8513 47.3939C37.7489 47.3939 47.3939 37.7489 47.3939 25.8512C47.3939 13.9535 37.7489 4.30856 25.8513 4.30856C13.9536 4.30856 4.30859 13.9535 4.30859 25.8512C4.30859 37.7489 13.9536 47.3939 25.8513 47.3939Z" stroke="white" strokeWidth="6.4628" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19.3884 25.8512L23.697 30.1598L32.314 21.5427" stroke="white" strokeWidth="6.4628" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <p className="mt-4 text-center font-['Inter'] text-2xl font-bold leading-8 text-[#1D293D]">
              Payment Successful!
            </p>
            {changeReturned > 0 && (
              <p className="mt-2 text-center font-['Inter'] text-base font-normal leading-6 text-[#62748E]">
                Change returned: {formatRs(changeReturned)}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { X, Wallet, CreditCard, Gift, Star, Trash2, ScanLine, Check } from "lucide-react";
import { toast } from "sonner";
import { fetchOrderStateForPaymentCreate } from "@/services/paymentService";
import {
  buildCreatePaymentDraftFromOrder,
  ORDER_MONEY_EPS,
} from "@/domains/orders/orderCollectionAmount";

const formatRs = (n: number) =>
  `Rs.${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

type PaymentMethod = "cash" | "card" | "voucher" | "loyalty";

type CardPaymentRow = {
  id: string;
  cardType: string;
  last4: string;
  amount: number;
};

type VoucherRedemptionRow = {
  id: string;
  code: string;
  amount: number;
};

type ProcessPaymentModalProps = {
  customerName: string;
  customerMobile?: string;
  amountDue: number;
  orderId?: number;
  onClose: () => void;
  onComplete: () => void;
};

export default function ProcessPaymentModal({
  customerName,
  customerMobile,
  amountDue,
  orderId,
  onClose,
  onComplete,
}: ProcessPaymentModalProps) {
  const [activeMethod, setActiveMethod] = useState<PaymentMethod>("cash");
  const [cashAmount, setCashAmount] = useState("");
  const [cards, setCards] = useState<CardPaymentRow[]>([]);
  const [cardType, setCardType] = useState("visa");
  const [cardLast4, setCardLast4] = useState("");
  const [cardAmount, setCardAmount] = useState("");
  const [voucherMode, setVoucherMode] = useState<"promo" | "scan">("promo");
  const [voucherCode, setVoucherCode] = useState("");
  const [vouchers, setVouchers] = useState<VoucherRedemptionRow[]>([]);
  const [pointsToUse, setPointsToUse] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const cashApplied = Number.parseFloat(cashAmount || "0") || 0;
  const cardApplied = cards.reduce((sum, c) => sum + c.amount, 0);
  const voucherApplied = vouchers.reduce((sum, v) => sum + v.amount, 0);
  const hasCustomerForPoints = customerName.trim().length > 0;
  const availablePoints = hasCustomerForPoints ? 5000 : 0;
  const pointsRate = 1;
  const pointsNumRaw = Number.parseInt(pointsToUse || "0", 10) || 0;
  const pointsNum = Math.max(0, Math.min(pointsNumRaw, availablePoints));
  const pointsApplied = pointsNum * pointsRate;
  const totalPaid = cashApplied + cardApplied + voucherApplied + pointsApplied;
  const remaining = amountDue - totalPaid;
  const canConfirm = remaining <= ORDER_MONEY_EPS;
  const fullyPaid = remaining <= ORDER_MONEY_EPS;
  const cardCountText = `${cards.length}/5 cards`;

  const voucherCodeMap = useMemo(
    () => ({
      "GV25-ABCD-1234": 5000,
      "BX25-ABCD-1234": 8000,
      GV25: 5000,
      BX25: 8000,
    }),
    []
  );

  const getCloseAction = () => {
    if (isSubmitting) return;
    onClose();
  };

  const resetCardInputs = () => {
    setCardType("visa");
    setCardLast4("");
    setCardAmount("");
  };

  const handleAddCard = () => {
    if (cards.length >= 5) {
      toast.error("Maximum 5 cards allowed for split card payment.");
      return;
    }
    const amount = Number.parseFloat(cardAmount || "0") || 0;
    const digits = cardLast4.replace(/\D/g, "");
    if (!cardType.trim()) return toast.error("Select card type.");
    if (digits.length !== 4) return toast.error("Enter the last 4 digits.");
    if (amount <= 0) return toast.error("Enter a valid card amount.");
    const row: CardPaymentRow = {
      id: crypto.randomUUID(),
      cardType,
      last4: digits,
      amount,
    };
    setCards((prev) => [...prev, row]);
    resetCardInputs();
  };

  const handleRedeemVoucher = () => {
    const code = voucherCode.trim().toUpperCase();
    if (!code) return toast.error("Enter voucher/promo code.");
    if (vouchers.some((v) => v.code === code)) return toast.error("Voucher already applied.");
    const amount = voucherCodeMap[code as keyof typeof voucherCodeMap] ?? 0;
    if (amount <= 0) return toast.error("Invalid voucher code.");
    setVouchers((prev) => [...prev, { id: crypto.randomUUID(), code, amount }]);
    setVoucherCode("");
  };

  const handleConfirmPayment = async () => {
    if (!canConfirm || isSubmitting) return;
    setIsSubmitting(true);
    try {
      if (orderId) {
        try {
          const fresh = await fetchOrderStateForPaymentCreate(orderId);
          const draft = buildCreatePaymentDraftFromOrder(fresh);
          if (draft.amount <= ORDER_MONEY_EPS) {
            toast.message(
              "This order is already fully paid on the server. Clearing checkout so you can start a new order."
            );
            onComplete();
            onClose();
            return;
          }
        } catch {
          toast.error("Could not reload latest order state.");
          return;
        }
      }
      // Split payment API is not ready; we keep this as frontend flow.
      setIsSuccess(true);
      setTimeout(() => {
        onComplete();
        onClose();
      }, 1400);
    } finally {
      setIsSubmitting(false);
    }
  };

  const header = (
    <div className=" pb-3">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-['Inter'] text-2xl font-bold leading-8 text-[#1D293D]">
            Split Payment
          </h2>
          <p className="mt-1 font-['Inter'] text-sm font-normal leading-5 text-[#62748E]">
            {customerMobile ? `${customerName} • ${customerMobile}` : customerName}
          </p>
        </div>
        <button
          type="button"
          onClick={getCloseAction}
          disabled={isSubmitting}
          className="rounded-full p-1.5 text-[#90A1B9] hover:bg-[#F1F5F9] hover:text-[#45556C] disabled:pointer-events-none disabled:opacity-50"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );

  const requestBackdropClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4"
      onClick={requestBackdropClose}
    >
      <div
        className="flex h-[calc(100dvh-2rem)] w-full max-w-[1100px] flex-col overflow-hidden rounded-[24px] border border-[#FFFFFF33] bg-white p-6 shadow-[0px_25px_50px_-12px_#00000040]"
        onClick={(e) => e.stopPropagation()}
      >
        {header}
        <div className="grid grid-cols-4 gap-3 pb-3">
          <div className="flex flex-col gap-1 rounded-[14px] bg-[#F8FAFC] p-4">
            <p className="text-xs font-normal leading-4 tracking-normal text-[#62748E]">Order Total</p>
            <p className="text-2xl font-bold leading-8 tracking-normal text-[#1D293D]">{formatRs(amountDue)}</p>
          </div>
          <div className="flex flex-col gap-1 rounded-[14px] bg-[#ECFDF5] p-4">
            <p className="text-xs font-normal leading-4 tracking-normal text-[#009966]">Total Paid</p>
            <p className="text-2xl font-bold leading-8 tracking-normal text-[#007A55]">{formatRs(totalPaid)}</p>
          </div>
          <div className={`flex flex-col gap-1 rounded-[14px] p-4 ${fullyPaid ? "bg-[#ECFDF5]" : "bg-[#FFF7ED]"}`}>
            <p className={`text-xs font-normal leading-4 tracking-normal ${fullyPaid ? "text-[#10B981]" : "text-[#F54900]"}`}>Remaining</p>
            <p className={`text-2xl font-bold leading-8 tracking-normal ${fullyPaid ? "text-[#047857]" : "text-[#CA3500]"}`}>
              {formatRs(Math.max(remaining, 0))}
            </p>
          </div>
          <div className="flex items-center justify-center gap-1 rounded-[14px] bg-[#F8FAFC] p-4">
            <p className={`text-xl font-bold ${fullyPaid ? "text-[#009966]" : "text-[#90A1B9]"}`}>
              {fullyPaid ? (
                <span className="inline-flex items-center gap-1 text-base font-bold leading-6 tracking-normal"><Check className="h-5 w-5" /> Fully Paid</span>
              ) : (
                <span className="text-xs font-normal leading-4 tracking-normal">Payment Pending</span>
              )}
            </p>
          </div>
        </div>
        <div className="-mx-6 border-b border-[#E2E8F0]" />

        <div className="mt-4 flex-1 overflow-y-auto pr-1 [scrollbar-width:thin] [scrollbar-color:#CBD5E1_#F1F5F9] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-[#F1F5F9] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#CBD5E1] hover:[&::-webkit-scrollbar-thumb]:bg-[#94A3B8]">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-4 border-r border-[#E2E8F0] pr-4">
            <p className="text-sm font-bold uppercase leading-5 tracking-normal text-[#314158]">Payment Methods</p>
            <div className="mt-3 space-y-2">
              {[
                { id: "cash", label: "Cash", icon: Wallet, sub: formatRs(cashApplied) },
                { id: "card", label: "Card", icon: CreditCard, sub: `${cardCountText} • ${formatRs(cardApplied)}` },
                { id: "voucher", label: "Voucher", icon: Gift, sub: `${vouchers.length} vouchers • ${formatRs(voucherApplied)}` },
                { id: "loyalty", label: "Loyalty Points", icon: Star, sub: `${pointsNum} pts • ${formatRs(pointsApplied)}` },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setActiveMethod(m.id as PaymentMethod)}
                  className={`w-full rounded-[14px] border p-3 text-left ${activeMethod === m.id ? "border-[#EA580C] bg-[#FFF7ED]" : "border-[#E2E8F0] bg-white"}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="rounded-[10px] bg-[#F1F5F9] p-2"><m.icon className="h-4 w-4 text-[#64748B]" /></span>
                    <div>
                      <p className="font-bold text-[#1D293D]">{m.label}</p>
                      <p className="text-sm text-[#62748E]">{m.sub}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-4 border-t border-[#E2E8F0] pt-3">
              <p className="text-xs font-bold uppercase tracking-wide text-[#334155]">Applied Payments</p>
              <div className="mt-2 space-y-1.5 text-sm">
                {cashApplied > 0 && (
                  <div className="flex justify-between rounded border border-[#A7F3D0] bg-[#ECFDF5] px-2 py-1 text-[#065F46]">
                    <span className="font-medium">Cash</span>
                    <span className="font-bold">{formatRs(cashApplied)}</span>
                  </div>
                )}
                {cards.map((c) => (
                  <div key={c.id} className="flex justify-between rounded border border-[#BFDBFE] bg-[#EFF6FF] px-2 py-1 text-[#1E3A8A]">
                    <span className="font-medium">{c.cardType.toUpperCase()} •••• {c.last4}</span>
                    <span className="font-bold">{formatRs(c.amount)}</span>
                  </div>
                ))}
                {vouchers.map((v) => (
                  <div key={v.id} className="flex justify-between rounded border border-[#DDD6FE] bg-[#F5F3FF] px-2 py-1 text-[#6B21A8]">
                    <span className="font-medium">{v.code}</span>
                    <span className="font-bold">{formatRs(v.amount)}</span>
                  </div>
                ))}
                {pointsApplied > 0 && (
                  <div className="flex justify-between rounded border border-[#FDE68A] bg-[#FEF9C3] px-2 py-1 text-[#854D0E]">
                    <span className="font-medium">Loyalty Points ({pointsNum})</span>
                    <span className="font-bold">{formatRs(pointsApplied)}</span>
                  </div>
                )}
                {cashApplied + cards.length + vouchers.length + (pointsApplied > 0 ? 1 : 0) === 0 && (
                  <p className="py-4 text-center text-[#94A3B8]">No payments applied yet</p>
                )}
              </div>
            </div>
          </div>

          <div className="col-span-8">
            {activeMethod === "cash" && (
              <div className="rounded-[14px] border border-[#A7F3D0] bg-[#ECFDF5] p-4">
                <p className="mb-2 font-bold text-[#065F46]">Cash Payment</p>
                <label className="text-sm text-[#065F46]">Cash Amount ($)</label>
                <input value={cashAmount} onChange={(e) => setCashAmount(e.target.value)} placeholder="0.00" className="mt-1 w-full rounded-[12px] border border-[#6EE7B7] bg-white px-3 py-3 text-2xl font-bold text-[#1D293D]" />
                <button type="button" className="mt-3 w-full rounded-[12px] bg-[#059669] py-3 font-bold text-white">
                  Save Cash Balance ({formatRs(Math.max(amountDue - (cardApplied + voucherApplied + pointsApplied), 0))})
                </button>
              </div>
            )}

            {activeMethod === "card" && (
              <div className="rounded-[14px] border border-[#BFDBFE] bg-[#EFF6FF] p-4">
                <div className="mb-2 flex items-center justify-between">
                  <p className="font-bold text-[#1E3A8A]">Card Payment</p>
                  <p className="text-sm text-[#64748B]">{cardCountText}</p>
                </div>
                <p className="mb-3 text-sm text-[#3B82F6]">Record card payment details. Actual payment is processed on the card machine.</p>
                <label className="text-sm font-medium text-[#334155]">Card Type</label>
                <select value={cardType} onChange={(e) => setCardType(e.target.value)} className="mt-1 w-full rounded-[12px] border border-[#DBEAFE] bg-white px-3 py-2.5 text-[#1D293D]">
                  <option value="visa">Visa</option>
                  <option value="master">MasterCard</option>
                  <option value="amex">Amex</option>
                </select>
                <label className="mt-3 block text-sm font-medium text-[#334155]">Last 4 Digits</label>
                <input
                  type="password"
                  inputMode="numeric"
                  autoComplete="off"
                  value={cardLast4}
                  onChange={(e) => {
                    const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 4);
                    setCardLast4(digitsOnly);
                  }}
                  maxLength={4}
                  placeholder="••••"
                  className="mt-1 w-full rounded-[12px] border border-[#DBEAFE] bg-white px-3 py-2.5 text-[#1D293D] placeholder:text-[#94A3B8]"
                />
                <label className="mt-3 block text-sm font-medium text-[#334155]">Amount (Rs.)</label>
                <input value={cardAmount} onChange={(e) => setCardAmount(e.target.value)} placeholder="0.00" className="mt-1 w-full rounded-[12px] border border-[#DBEAFE] bg-white px-3 py-2.5 text-[#1D293D] placeholder:text-[#94A3B8]" />
                <button type="button" onClick={handleAddCard} className="mt-3 w-full rounded-[12px] bg-[#2563EB] py-3 font-bold text-white">+ Add Card Payment</button>

                {cards.length > 0 && (
                  <div className="mt-4 border-t border-[#BFDBFE] pt-3">
                    <p className="mb-2 text-sm font-bold uppercase text-[#64748B]">Added Cards</p>
                    <div className="space-y-2">
                      {cards.map((c) => (
                        <div key={c.id} className="flex items-center justify-between rounded-[12px] border border-[#DBEAFE] bg-white px-3 py-2.5">
                          <div>
                            <p className="font-bold text-[#1D293D]">{c.cardType.toUpperCase()}</p>
                            <p className="text-sm text-[#64748B]">•••• {c.last4}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <p className="font-bold text-[#1E40AF]">{formatRs(c.amount)}</p>
                            <button type="button" onClick={() => setCards((prev) => prev.filter((x) => x.id !== c.id))} className="text-[#EF4444]">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeMethod === "voucher" && (
              <div className="rounded-[14px] border border-[#E9D5FF] bg-[#FAF5FF] p-4">
                <p className="mb-3 font-bold text-[#6B21A8]">Gift Voucher</p>
                <p className="mb-2 text-sm font-medium text-[#7C3AED]">Redemption Method</p>
                <div className="mb-3 grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => setVoucherMode("promo")} className={`rounded-[12px] border px-3 py-3 font-medium ${voucherMode === "promo" ? "border-[#A855F7] bg-white text-[#7C3AED]" : "border-[#E9D5FF] bg-white text-[#64748B]"}`}>Promo Code</button>
                  <button type="button" onClick={() => setVoucherMode("scan")} className={`rounded-[12px] border px-3 py-3 font-medium ${voucherMode === "scan" ? "border-[#A855F7] bg-white text-[#7C3AED]" : "border-[#E9D5FF] bg-white text-[#64748B]"}`}>
                    <span className="inline-flex items-center gap-1"><ScanLine className="h-4 w-4" /> Scan Barcode</span>
                  </button>
                </div>
                <label className="text-sm font-medium text-[#334155]">{voucherMode === "promo" ? "Promo Code" : "Scanned Code"}</label>
                <input value={voucherCode} onChange={(e) => setVoucherCode(e.target.value)} placeholder="GV25-ABCD-1234" className="mt-1 w-full rounded-[12px] border border-[#E9D5FF] bg-white px-3 py-2.5 text-[#1D293D] placeholder:text-[#94A3B8]" />
                <button type="button" onClick={handleRedeemVoucher} className="mt-3 w-full rounded-[12px] bg-[#A21CAF] py-3 font-bold text-white">Redeem Voucher</button>
                <p className="mt-3 rounded-[10px] bg-[#F3E8FF] px-3 py-2 text-xs text-[#7C3AED]">Code Format: GV25-ABCD-1234 (Rs.5000), BX25-ABCD-1234 (Rs.8000)</p>
              </div>
            )}

            {activeMethod === "loyalty" && (
              <div className="rounded-[14px] border border-[#FEF08A] bg-[#FEFCE8] p-4">
                <p className="mb-3 font-bold text-[#854D0E]">Loyalty Points</p>
                {!hasCustomerForPoints ? (
                  <p className="rounded-[10px] bg-white px-3 py-3 text-sm text-[#92400E]">
                    No registered customer found for this order. Loyalty points can be used only for registered customers.
                  </p>
                ) : (
                  <>
                    <div className="rounded-[12px] bg-white px-3 py-2.5">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-[#64748B]">Available Points</p>
                          <p className="text-5xl font-bold text-[#D97706]">{availablePoints.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-[#64748B]">Points Value</p>
                          <p className="text-4xl font-bold text-[#92400E]">{formatRs(availablePoints * pointsRate)}</p>
                        </div>
                      </div>
                    </div>
                    <p className="mt-2 rounded bg-[#FEF3C7] px-3 py-1.5 text-center text-xs text-[#A16207]">1 point = Rs.1.00</p>
                    <label className="mt-3 block text-sm font-medium text-[#334155]">Points to Use</label>
                    <input value={pointsToUse} onChange={(e) => setPointsToUse(e.target.value)} placeholder="Enter points" className="mt-1 w-full rounded-[12px] border border-[#FDE68A] bg-white px-3 py-2.5" />
                    <button type="button" className="mt-3 w-full rounded-[12px] bg-[#D97706] py-3 font-bold text-white">Apply Points</button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        </div>

        <div className="mt-5 flex items-center gap-3 border-t border-[#E2E8F0] pt-4">
          <button type="button" onClick={onClose} disabled={isSubmitting} className="rounded-[12px] border border-[#E2E8F0] bg-white px-8 py-3 font-bold text-[#475569]">
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void handleConfirmPayment()}
            disabled={!canConfirm || isSubmitting}
            className={`flex-1 rounded-[12px] py-3 font-bold text-white ${canConfirm ? "bg-[#EA580C]" : "bg-[#94A3B8]"} disabled:opacity-70`}
          >
            {isSuccess ? "Payment Confirmed" : canConfirm ? "Confirm Payment" : `${formatRs(Math.max(remaining, 0))} Remaining`}
          </button>
        </div>
      </div>
    </div>
  );
}

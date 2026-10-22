import { useState } from 'preact/hooks';
import { QR_MENU } from './constants';
import type { OrderStatus, QrPhase } from './types';
import { QrScanScreen } from './qr/QrScanScreen';
import { QrMenuScreen } from './qr/QrMenuScreen';
import { QrStatusScreen } from './qr/QrStatusScreen';
import { QrDisplayScreens } from './qr/QrDisplayScreens';

interface PlacedOrder {
  items: { name: string; emoji: string; price: number; qty: number }[];
  total: number;
}

export function QrOrderSim() {
  const [phase, setPhase] = useState<QrPhase>('scan');
  const [scanOk, setScanOk] = useState(false);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [order, setOrder] = useState<PlacedOrder | null>(null);
  const [status, setStatus] = useState<OrderStatus>('new');
  const [cashierAck, setCashierAck] = useState(false);

  const totalQty = Object.values(cart).reduce((sum, q) => sum + q, 0);
  const cartTotal = QR_MENU.reduce((sum, m) => sum + (cart[m.id] ?? 0) * m.price, 0);

  const handleScanTable = () => {
    if (phase !== 'scan') return;
    setPhase('scanning');
    setTimeout(() => setScanOk(true), 1500);
    setTimeout(() => {
      setPhase('menu');
      setCart({ fries: 1, burger: 1 });
    }, 2200);
  };

  const handleAddItem = (id: string) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
  };

  const handleRemoveItem = (id: string) => {
    setCart((prev) => {
      const next = { ...prev };
      const q = (next[id] ?? 0) - 1;
      if (q <= 0) delete next[id];
      else next[id] = q;
      return next;
    });
  };

  const handlePlaceOrder = () => {
    if (totalQty === 0) return;
    const items = QR_MENU.filter((m) => cart[m.id]).map((m) => ({
      name: m.name,
      emoji: m.emoji,
      price: m.price,
      qty: cart[m.id],
    }));
    setOrder({ items, total: cartTotal });
    setStatus('new');
    setCashierAck(false);
    setPhase('status');
  };

  const handleReset = () => {
    setPhase('scan');
    setScanOk(false);
    setCart({});
    setOrder(null);
    setStatus('new');
    setCashierAck(false);
  };

  const handleAdvanceKds = () => {
    if (status === 'new') setStatus('accepted');
    else if (status === 'accepted') setStatus('cooking');
    else if (status === 'cooking') setStatus('ready');
  };

  return (
    <div className="sim-resto-grid">
      {/* 1. Customer Smartphone Mockup */}
      <div className="sim-phone-frame">
        {/* Dynamic Island / Notch */}
        <div className="sim-phone-notch" />

        {phase === 'scan' || phase === 'scanning' ? (
          <QrScanScreen
            scanning={phase === 'scanning'}
            scanOk={scanOk}
            onScan={handleScanTable}
          />
        ) : phase === 'menu' ? (
          <QrMenuScreen
            cart={cart}
            totalQty={totalQty}
            cartTotal={cartTotal}
            onAddItem={handleAddItem}
            onRemoveItem={handleRemoveItem}
            onPlaceOrder={handlePlaceOrder}
          />
        ) : (
          order && (
            <QrStatusScreen
              order={order}
              status={status}
              onReset={handleReset}
            />
          )
        )}
      </div>

      {/* 2. Dual Monitors: KDS & Cashier Display */}
      <QrDisplayScreens
        order={order}
        status={status}
        cashierAck={cashierAck}
        onAdvanceKds={handleAdvanceKds}
        onAckCashier={() => setCashierAck(true)}
      />
    </div>
  );
}

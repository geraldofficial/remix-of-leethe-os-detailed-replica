import { useState } from 'react';

export default function CalculatorApp() {
  const [display, setDisplay] = useState('0');
  const [prev, setPrev] = useState<number | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [reset, setReset] = useState(false);

  const input = (d: string) => {
    if (display === '0' || reset) { setDisplay(d); setReset(false); }
    else if (display.length < 12) setDisplay(display + d);
  };
  const dot = () => { if (reset) { setDisplay('0.'); setReset(false); return; } if (!display.includes('.')) setDisplay(display + '.'); };
  const clear = () => { setDisplay('0'); setPrev(null); setOp(null); setReset(false); };
  const sign = () => setDisplay(d => d.startsWith('-') ? d.slice(1) : d === '0' ? d : '-' + d);
  const pct = () => setDisplay(d => String(parseFloat(d) / 100));
  const compute = (a: number, b: number, o: string) => {
    switch (o) { case '+': return a + b; case '−': return a - b; case '×': return a * b; case '÷': return b === 0 ? NaN : a / b; } return b;
  };
  const setOperator = (o: string) => {
    const cur = parseFloat(display);
    if (prev !== null && op && !reset) {
      const r = compute(prev, cur, op);
      setDisplay(String(+r.toFixed(10))); setPrev(r);
    } else setPrev(cur);
    setOp(o); setReset(true);
  };
  const equals = () => {
    if (prev === null || op === null) return;
    const r = compute(prev, parseFloat(display), op);
    setDisplay(String(+r.toFixed(10))); setPrev(null); setOp(null); setReset(true);
  };

  const Btn = ({ label, onClick, variant = 'num', span = 1 }: { label: string; onClick: () => void; variant?: 'num' | 'fn' | 'op'; span?: number }) => {
    const colors = {
      num: { bg: 'hsl(var(--secondary))', fg: 'hsl(var(--foreground))' },
      fn: { bg: 'hsl(var(--muted))', fg: 'hsl(var(--foreground))' },
      op: { bg: 'hsl(var(--accent))', fg: '#fff' },
    }[variant];
    return (
      <button onClick={onClick}
        className="rounded-xl text-base font-medium hover:brightness-95 active:scale-95 transition-transform"
        style={{ background: colors.bg, color: colors.fg, gridColumn: `span ${span}`, padding: '14px 0' }}>
        {label}
      </button>
    );
  };

  return (
    <div className="flex flex-col h-full p-4 gap-3" style={{ background: 'hsl(var(--card))' }}>
      <div className="flex-1 rounded-lg flex items-end justify-end px-4 py-3 text-3xl font-light tabular-nums overflow-hidden"
        style={{ background: 'hsl(var(--muted))' }}>
        {display}
      </div>
      <div className="grid grid-cols-4 gap-2">
        <Btn label="AC" variant="fn" onClick={clear} />
        <Btn label="±" variant="fn" onClick={sign} />
        <Btn label="%" variant="fn" onClick={pct} />
        <Btn label="÷" variant="op" onClick={() => setOperator('÷')} />
        <Btn label="7" onClick={() => input('7')} />
        <Btn label="8" onClick={() => input('8')} />
        <Btn label="9" onClick={() => input('9')} />
        <Btn label="×" variant="op" onClick={() => setOperator('×')} />
        <Btn label="4" onClick={() => input('4')} />
        <Btn label="5" onClick={() => input('5')} />
        <Btn label="6" onClick={() => input('6')} />
        <Btn label="−" variant="op" onClick={() => setOperator('−')} />
        <Btn label="1" onClick={() => input('1')} />
        <Btn label="2" onClick={() => input('2')} />
        <Btn label="3" onClick={() => input('3')} />
        <Btn label="+" variant="op" onClick={() => setOperator('+')} />
        <Btn label="0" span={2} onClick={() => input('0')} />
        <Btn label="." onClick={dot} />
        <Btn label="=" variant="op" onClick={equals} />
      </div>
    </div>
  );
}

'use client';

import { useState, useCallback } from 'react';
import { Delete, RotateCcw, History, X } from 'lucide-react';

type Operation = '+' | '-' | '×' | '÷' | '%' | '^' | null;

interface HistoryEntry {
  expression: string;
  result: string;
  timestamp: Date;
}

export function CalculatorApp() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<Operation>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [expression, setExpression] = useState('');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [mode, setMode] = useState<'basic' | 'scientific'>('basic');
  const [memory, setMemory] = useState<number>(0);
  const [angleMode, setAngleMode] = useState<'deg' | 'rad'>('deg');

  const clearAll = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
    setExpression('');
  };

  const clearEntry = () => {
    setDisplay('0');
    setWaitingForOperand(false);
  };

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const toggleSign = () => {
    const value = parseFloat(display);
    setDisplay(String(-value));
  };

  const performOperation = (nextOperation: Operation) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
      setExpression(`${inputValue} ${nextOperation}`);
    } else if (operation) {
      const result = calculate(previousValue, inputValue, operation);
      setDisplay(String(result));
      setPreviousValue(result);
      setExpression(`${result} ${nextOperation}`);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (left: number, right: number, op: Operation): number => {
    switch (op) {
      case '+': return left + right;
      case '-': return left - right;
      case '×': return left * right;
      case '÷': return right !== 0 ? left / right : NaN;
      case '%': return left % right;
      case '^': return Math.pow(left, right);
      default: return right;
    }
  };

  const equals = () => {
    if (operation === null || previousValue === null) return;

    const inputValue = parseFloat(display);
    const result = calculate(previousValue, inputValue, operation);
    const fullExpression = `${expression} ${inputValue}`;
    
    setHistory(prev => [{
      expression: fullExpression,
      result: String(result),
      timestamp: new Date()
    }, ...prev.slice(0, 49)]);

    setDisplay(String(result));
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(true);
    setExpression('');
  };

  const percentage = () => {
    const value = parseFloat(display);
    setDisplay(String(value / 100));
  };

  const sqrt = () => {
    const value = parseFloat(display);
    setDisplay(String(Math.sqrt(value)));
    setWaitingForOperand(true);
  };

  const square = () => {
    const value = parseFloat(display);
    setDisplay(String(value * value));
    setWaitingForOperand(true);
  };

  const reciprocal = () => {
    const value = parseFloat(display);
    setDisplay(String(1 / value));
    setWaitingForOperand(true);
  };

  // Scientific functions
  const toRadians = (deg: number) => (deg * Math.PI) / 180;
  const toDegrees = (rad: number) => (rad * 180) / Math.PI;

  const sin = () => {
    const value = parseFloat(display);
    const result = angleMode === 'deg' ? Math.sin(toRadians(value)) : Math.sin(value);
    setDisplay(String(result));
    setWaitingForOperand(true);
  };

  const cos = () => {
    const value = parseFloat(display);
    const result = angleMode === 'deg' ? Math.cos(toRadians(value)) : Math.cos(value);
    setDisplay(String(result));
    setWaitingForOperand(true);
  };

  const tan = () => {
    const value = parseFloat(display);
    const result = angleMode === 'deg' ? Math.tan(toRadians(value)) : Math.tan(value);
    setDisplay(String(result));
    setWaitingForOperand(true);
  };

  const log = () => {
    const value = parseFloat(display);
    setDisplay(String(Math.log10(value)));
    setWaitingForOperand(true);
  };

  const ln = () => {
    const value = parseFloat(display);
    setDisplay(String(Math.log(value)));
    setWaitingForOperand(true);
  };

  const exp = () => {
    const value = parseFloat(display);
    setDisplay(String(Math.exp(value)));
    setWaitingForOperand(true);
  };

  const factorial = () => {
    const value = parseInt(display);
    if (value < 0) return;
    let result = 1;
    for (let i = 2; i <= value; i++) result *= i;
    setDisplay(String(result));
    setWaitingForOperand(true);
  };

  const pi = () => {
    setDisplay(String(Math.PI));
    setWaitingForOperand(true);
  };

  const e = () => {
    setDisplay(String(Math.E));
    setWaitingForOperand(true);
  };

  // Memory functions
  const memoryClear = () => setMemory(0);
  const memoryRecall = () => {
    setDisplay(String(memory));
    setWaitingForOperand(true);
  };
  const memoryAdd = () => setMemory(memory + parseFloat(display));
  const memorySubtract = () => setMemory(memory - parseFloat(display));

  const Button = ({ 
    children, 
    onClick, 
    className = '',
    variant = 'default'
  }: { 
    children: React.ReactNode; 
    onClick: () => void;
    className?: string;
    variant?: 'default' | 'operator' | 'function' | 'equals' | 'memory';
  }) => {
    const variants = {
      default: 'bg-zinc-700 hover:bg-zinc-600 active:bg-zinc-500',
      operator: 'bg-orange-500 hover:bg-orange-400 active:bg-orange-600 text-white',
      function: 'bg-zinc-600 hover:bg-zinc-500 active:bg-zinc-400',
      equals: 'bg-blue-500 hover:bg-blue-400 active:bg-blue-600 text-white',
      memory: 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs'
    };

    return (
      <button
        onClick={onClick}
        className={`rounded-lg font-medium text-lg transition-colors ${variants[variant]} ${className}`}
      >
        {children}
      </button>
    );
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900 text-white select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-zinc-800 border-b border-zinc-700">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode(mode === 'basic' ? 'scientific' : 'basic')}
            className={`px-3 py-1 rounded text-sm ${mode === 'scientific' ? 'bg-blue-500' : 'bg-zinc-700'}`}
          >
            {mode === 'basic' ? 'Basic' : 'Scientific'}
          </button>
          {mode === 'scientific' && (
            <button
              onClick={() => setAngleMode(angleMode === 'deg' ? 'rad' : 'deg')}
              className="px-2 py-1 rounded text-xs bg-zinc-700"
            >
              {angleMode.toUpperCase()}
            </button>
          )}
        </div>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="p-2 hover:bg-zinc-700 rounded"
        >
          <History size={18} />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* History Panel */}
        {showHistory && (
          <div className="w-48 bg-zinc-800 border-r border-zinc-700 flex flex-col">
            <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-700">
              <span className="text-sm font-medium">History</span>
              <button onClick={() => setHistory([])} className="text-xs text-zinc-400 hover:text-white">
                Clear
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {history.map((entry, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setDisplay(entry.result);
                    setWaitingForOperand(true);
                  }}
                  className="px-3 py-2 hover:bg-zinc-700 cursor-pointer border-b border-zinc-700/50"
                >
                  <div className="text-xs text-zinc-400 truncate">{entry.expression}</div>
                  <div className="text-sm font-medium">{entry.result}</div>
                </div>
              ))}
              {history.length === 0 && (
                <div className="text-center text-zinc-500 text-sm py-4">No history</div>
              )}
            </div>
          </div>
        )}

        {/* Calculator */}
        <div className="flex-1 flex flex-col p-3">
          {/* Display */}
          <div className="bg-zinc-800 rounded-lg p-4 mb-3">
            <div className="text-zinc-400 text-sm h-5 text-right truncate">
              {expression}
            </div>
            <div className="text-3xl font-light text-right truncate">
              {display}
            </div>
            {memory !== 0 && (
              <div className="text-xs text-blue-400 text-right mt-1">M = {memory}</div>
            )}
          </div>

          {/* Memory buttons */}
          <div className="grid grid-cols-5 gap-1 mb-2">
            <Button variant="memory" onClick={memoryClear}>MC</Button>
            <Button variant="memory" onClick={memoryRecall}>MR</Button>
            <Button variant="memory" onClick={memoryAdd}>M+</Button>
            <Button variant="memory" onClick={memorySubtract}>M-</Button>
            <Button variant="memory" onClick={() => setMemory(parseFloat(display))}>MS</Button>
          </div>

          {/* Scientific buttons */}
          {mode === 'scientific' && (
            <div className="grid grid-cols-5 gap-1 mb-2">
              <Button variant="function" onClick={sin}>sin</Button>
              <Button variant="function" onClick={cos}>cos</Button>
              <Button variant="function" onClick={tan}>tan</Button>
              <Button variant="function" onClick={log}>log</Button>
              <Button variant="function" onClick={ln}>ln</Button>
              <Button variant="function" onClick={pi}>π</Button>
              <Button variant="function" onClick={e}>e</Button>
              <Button variant="function" onClick={() => performOperation('^')}>x^y</Button>
              <Button variant="function" onClick={exp}>e^x</Button>
              <Button variant="function" onClick={factorial}>n!</Button>
            </div>
          )}

          {/* Main buttons */}
          <div className="grid grid-cols-4 gap-2 flex-1">
            <Button variant="function" onClick={clearAll} className="h-full">AC</Button>
            <Button variant="function" onClick={clearEntry} className="h-full">CE</Button>
            <Button variant="function" onClick={percentage} className="h-full">%</Button>
            <Button variant="operator" onClick={() => performOperation('÷')} className="h-full">÷</Button>

            <Button onClick={() => inputDigit('7')} className="h-full">7</Button>
            <Button onClick={() => inputDigit('8')} className="h-full">8</Button>
            <Button onClick={() => inputDigit('9')} className="h-full">9</Button>
            <Button variant="operator" onClick={() => performOperation('×')} className="h-full">×</Button>

            <Button onClick={() => inputDigit('4')} className="h-full">4</Button>
            <Button onClick={() => inputDigit('5')} className="h-full">5</Button>
            <Button onClick={() => inputDigit('6')} className="h-full">6</Button>
            <Button variant="operator" onClick={() => performOperation('-')} className="h-full">−</Button>

            <Button onClick={() => inputDigit('1')} className="h-full">1</Button>
            <Button onClick={() => inputDigit('2')} className="h-full">2</Button>
            <Button onClick={() => inputDigit('3')} className="h-full">3</Button>
            <Button variant="operator" onClick={() => performOperation('+')} className="h-full">+</Button>

            <Button onClick={toggleSign} className="h-full">±</Button>
            <Button onClick={() => inputDigit('0')} className="h-full">0</Button>
            <Button onClick={inputDecimal} className="h-full">.</Button>
            <Button variant="equals" onClick={equals} className="h-full">=</Button>
          </div>

          {/* Additional row for basic mode */}
          {mode === 'basic' && (
            <div className="grid grid-cols-4 gap-2 mt-2">
              <Button variant="function" onClick={sqrt} className="py-2">√</Button>
              <Button variant="function" onClick={square} className="py-2">x²</Button>
              <Button variant="function" onClick={reciprocal} className="py-2">1/x</Button>
              <Button variant="function" onClick={() => setDisplay(display.slice(0, -1) || '0')} className="py-2">
                <Delete size={18} className="mx-auto" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

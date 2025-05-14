import { useRef } from 'react';
import confetti from 'canvas-confetti';

export function ThemeToggle() {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleConfetti = () => {
    // Fire confetti from the button position
    const rect = buttonRef.current?.getBoundingClientRect();
    const x = rect ? (rect.left + rect.width / 2) / window.innerWidth : 0.5;
    const y = rect ? (rect.top + rect.height / 2) / window.innerHeight : 0.5;
    confetti({
      particleCount: 800,
      spread: 70,
      origin: { x, y },
      colors: ['#15BFAE', '#03A678', '#FFD700', '#FF69B4', '#fff']
    });
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleConfetti}
      aria-label="Celebrate!"
      className="px-4 py-2 rounded-xl bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition flex items-center gap-2 text-[#15BFAE] focus:outline-none focus:ring-2 focus:ring-[#15BFAE]/30"
      type="button"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 7.165 6 9.388 6 12v2.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
      <span className="font-medium">Confetti</span>
    </button>
  );
}

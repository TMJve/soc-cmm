// src/app/_components/WelcomeScreen.tsx
import React from "react";

type WelcomeProps = {
  onStart: () => void;
};

export default function WelcomeScreen({ onStart }: WelcomeProps) {
  return (
    <section className="flex flex-col items-center justify-center gap-6 py-20">
      <header className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold">
          SOC‑CMM Capability Maturity Assessment
        </h1>
        <p className="max-w-xl text-gray-600">
          Quickly measure your SOC’s maturity without wrestling an Excel
          spreadsheet. Answer a few questions per domain and get an immediate
          snapshot of where you stand.
        </p>
      </header>

      <button
        onClick={onStart}
        className="rounded-lg bg-blue-600 px-8 py-3 text-white text-lg font-semibold hover:bg-blue-700 transition-colors"
      >
        Start Assessment
      </button>
    </section>
  );
}

import { FormEvent, useEffect, useState } from "react";
import ErrorFallback from "../components/ErrorFallback";
import LoadingState from "../components/LoadingState";
import StrategyResultCard from "../components/StrategyResultCard";
import { fallbackDriverStandings } from "../lib/fallbackData";
import { getDriverStandings } from "../lib/f1Api";
import { simulateStrategy } from "../lib/strategyEngine";
import type { ApiResponse, DriverStanding, StrategyInput, StrategyResult } from "../lib/types";

export default function StrategyLab() {
  const [drivers, setDrivers] = useState<ApiResponse<DriverStanding[]> | null>(null);
  const [form, setForm] = useState<StrategyInput>({
    driverName: fallbackDriverStandings[0].driverName,
    startingPosition: 4,
    startingTyre: "Medium",
    weather: "Dry",
    safetyCarChance: "Medium",
    pitLap: 22,
  });
  const [result, setResult] = useState<StrategyResult | null>(null);

  useEffect(() => {
    void getDriverStandings().then((data) => {
      setDrivers(data);
      setForm((current) => ({ ...current, driverName: data.data[0]?.driverName ?? current.driverName }));
    });
  }, []);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResult(simulateStrategy(form));
  }

  const driverOptions = drivers?.data ?? fallbackDriverStandings;

  return (
    <div className="space-y-10 py-10">
      <section>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-racing">Rule-based simulator</p>
        <h1 className="mt-3 text-4xl font-black text-white sm:text-6xl">Strategy Lab</h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-400">
          Test basic tyre, pit window, weather, and safety car assumptions without machine learning or live telemetry.
        </p>
      </section>

      {!drivers ? <LoadingState label="Loading driver list" /> : null}
      {drivers?.source === "fallback" ? <ErrorFallback message={drivers.error} /> : null}

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <form className="panel grid gap-5 p-6" onSubmit={submit}>
          <label className="grid gap-2 text-sm font-bold text-slate-300">
            Driver
            <select
              className="border border-white/10 bg-carbon px-4 py-3 text-white"
              value={form.driverName}
              onChange={(event) => setForm({ ...form, driverName: event.target.value })}
            >
              {driverOptions.map((driver) => (
                <option key={driver.driverId} value={driver.driverName}>
                  {driver.driverName}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-300">
            Starting position
            <input
              className="border border-white/10 bg-carbon px-4 py-3 text-white"
              min={1}
              max={20}
              type="number"
              value={form.startingPosition}
              onChange={(event) => setForm({ ...form, startingPosition: Number(event.target.value) })}
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold text-slate-300">
              Starting tyre
              <select
                className="border border-white/10 bg-carbon px-4 py-3 text-white"
                value={form.startingTyre}
                onChange={(event) => setForm({ ...form, startingTyre: event.target.value as StrategyInput["startingTyre"] })}
              >
                <option>Soft</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-bold text-slate-300">
              Weather
              <select
                className="border border-white/10 bg-carbon px-4 py-3 text-white"
                value={form.weather}
                onChange={(event) => setForm({ ...form, weather: event.target.value as StrategyInput["weather"] })}
              >
                <option>Dry</option>
                <option>Mixed</option>
                <option>Wet</option>
              </select>
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold text-slate-300">
              Safety car chance
              <select
                className="border border-white/10 bg-carbon px-4 py-3 text-white"
                value={form.safetyCarChance}
                onChange={(event) => setForm({ ...form, safetyCarChance: event.target.value as StrategyInput["safetyCarChance"] })}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-bold text-slate-300">
              Pit lap
              <input
                className="border border-white/10 bg-carbon px-4 py-3 text-white"
                min={5}
                max={55}
                type="number"
                value={form.pitLap}
                onChange={(event) => setForm({ ...form, pitLap: Number(event.target.value) })}
              />
            </label>
          </div>
          <button className="mt-2 bg-racing px-5 py-3 text-sm font-black text-white shadow-glow" type="submit">
            Simulate Strategy
          </button>
        </form>

        <div className="space-y-5">
          {result ? (
            <StrategyResultCard result={result} />
          ) : (
            <div className="panel p-6">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-racing">Ready on the pit wall</p>
              <h2 className="mt-3 text-2xl font-black text-white">Choose a race scenario.</h2>
              <p className="mt-4 leading-7 text-slate-400">
                The v0.1 engine compares tyre choice, starting position, weather risk, safety car chance, and pit timing to produce a simple strategy readout.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

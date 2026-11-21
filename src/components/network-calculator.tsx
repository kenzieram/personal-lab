"use client";

import { useState } from "react";
import { calculateSubnet, type SubnetResult } from "@/lib/network";

export function NetworkCalculator() {
  const [ip, setIp] = useState("");
  const [cidr, setCidr] = useState("");
  const [result, setResult] = useState<SubnetResult | null>(null);
  const [error, setError] = useState("");

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setResult(calculateSubnet(ip, Number(cidr)));
      setError("");
    } catch (cause) {
      setResult(null);
      setError(cause instanceof Error ? cause.message : "Could not calculate this network.");
    }
  }

  return (
    <div className="grid items-start gap-10 lg:grid-cols-[minmax(280px,.75fr)_minmax(0,1.25fr)]">
      <form onSubmit={submit} className="surface p-5 sm:p-6">
        <h2 className="section-title">Subnet calculator</h2>
        <label className="mt-5 block text-sm font-medium text-[var(--lab-secondary)]">
          IPv4 address
          <input
            value={ip}
            required
            onChange={(event) => setIp(event.target.value)}
            className="field mono mt-2 min-h-11 px-3 text-sm"
            placeholder="192.168.1.10"
            autoComplete="off"
            spellCheck={false}
          />
        </label>
        <label className="mt-4 block text-sm font-medium text-[var(--lab-secondary)]">
          CIDR prefix
          <input
            value={cidr}
            required
            onChange={(event) => setCidr(event.target.value)}
            type="number"
            min="0"
            max="32"
            className="field mono mt-2 min-h-11 px-3 text-sm"
            placeholder="24"
          />
        </label>
        <button className="button-primary mt-5 w-full" type="submit">Calculate</button>
        {error && <p role="alert" className="mt-4 mb-0 text-sm error-message">{error}</p>}
      </form>

      <section aria-labelledby="network-details-heading">
        <h2 id="network-details-heading" className="section-title">Network details</h2>
        {result ? (
          <>
            <p className="mono mt-2 mb-0 text-sm text-[var(--lab-secondary)]">{result.ip}/{result.cidr}</p>
            <dl className="mt-5 divide-y divide-[var(--lab-border)] border-y border-[var(--lab-border)]">
              {[
                { label: "Network address", value: result.network },
                { label: "Broadcast address", value: result.broadcast },
                { label: "Subnet mask", value: result.mask },
                { label: "Total addresses", value: result.total.toLocaleString() },
                { label: "Usable hosts", value: result.usable.toLocaleString() },
                { label: "First usable", value: result.first },
                { label: "Last usable", value: result.last },
              ].map(({ label, value }) => (
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-3" key={label}>
                  <dt className="text-sm text-[var(--lab-secondary)]">{label}</dt>
                  <dd className="mono m-0 text-sm tabular-nums">{value}</dd>
                </div>
              ))}
            </dl>
          </>
        ) : (
          <p className="mt-4 mb-0 border-y border-[var(--lab-border)] py-6 text-sm leading-6 muted">Enter an IPv4 address and CIDR prefix to see the network details.</p>
        )}
        <p className="mt-4 mb-0 max-w-2xl text-xs leading-5 quiet">Usable host counts follow the common IPv4 convention. A /31 has two point-to-point addresses, and a /32 represents one host.</p>
      </section>
    </div>
  );
}

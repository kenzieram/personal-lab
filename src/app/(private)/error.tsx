"use client";

export default function WorkspaceError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="max-w-xl py-12" aria-labelledby="workspace-error-heading">
      <h1 id="workspace-error-heading" className="text-2xl font-medium tracking-tight">This page could not load</h1>
      <p className="mt-3 mb-0 text-sm leading-6 muted">Try loading it again. If the problem continues, check the database connection and access policies.</p>
      <button className="button-primary mt-6" type="button" onClick={() => reset()}>Try again</button>
    </section>
  );
}

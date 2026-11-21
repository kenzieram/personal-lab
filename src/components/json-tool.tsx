"use client";

import { useState } from "react";

export function JsonTool() {
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("");
  const [invalid, setInvalid] = useState(false);

  function format() {
    try {
      setValue(JSON.stringify(JSON.parse(value), null, 2));
      setMessage("JSON is valid and formatted.");
      setInvalid(false);
    } catch {
      setMessage("JSON is invalid. Check the syntax and try again.");
      setInvalid(true);
    }
  }

  async function copy() {
    if (!value) {
      setMessage("There is no JSON to copy.");
      setInvalid(false);
      return;
    }
    try {
      await navigator.clipboard.writeText(value);
      setMessage("Copied to clipboard.");
      setInvalid(false);
    } catch {
      setMessage("Clipboard access failed. Select and copy the text instead.");
      setInvalid(true);
    }
  }

  function clear() {
    setValue("");
    setMessage("");
    setInvalid(false);
  }

  return (
    <section aria-labelledby="json-heading">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="json-heading" className="section-title">JSON formatter</h2>
          <p className="mt-1 mb-0 text-sm muted">Formatting runs in this browser. Avoid pasting secrets.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={clear} className="button-secondary">Clear</button>
          <button type="button" onClick={copy} className="button-secondary">Copy</button>
          <button type="button" onClick={format} className="button-primary">Format JSON</button>
        </div>
      </div>
      <label className="sr-only" htmlFor="json-input">JSON to format</label>
      <textarea
        id="json-input"
        spellCheck={false}
        value={value}
        onChange={(event) => { setValue(event.target.value); setMessage(""); setInvalid(false); }}
        aria-invalid={invalid}
        aria-describedby={message ? "json-status" : undefined}
        placeholder={'Paste JSON here, for example: { "enabled": true }'}
        className="field mono min-h-[320px] resize-y p-4 text-sm leading-6"
      />
      {message && <p id="json-status" role={invalid ? "alert" : "status"} className={`mt-3 mb-0 text-sm ${invalid ? "error-message" : "success-message"}`}>{message}</p>}
    </section>
  );
}

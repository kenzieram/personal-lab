"use client";

import { useEffect, useRef, useState } from "react";
import { portfolioData } from "@/data/portfolio";
import {
  TERMINAL_QUICK_COMMANDS,
  autocompleteTerminalInput,
  executeTerminalCommand,
  type TerminalLineTone,
  type TerminalOutputLine,
} from "@/lib/terminal";

type HistoryEntry = {
  id: number;
  command: string;
  lines: TerminalOutputLine[];
};

const TONE_CLASS: Record<TerminalLineTone, string> = {
  command: "text-[#71B7F5]",
  output: "text-white",
  success: "text-[#A6D9B0]",
  highlight: "text-[#F9E2AF]",
  muted: "text-[#AFC3D9]",
  error: "text-[#FCA5A5]",
};

const INITIAL_ENTRIES: HistoryEntry[] = [
  {
    id: 1,
    command: "whoami",
    lines: executeTerminalCommand("whoami").lines,
  },
];

export function PortfolioTerminal() {
  const [entries, setEntries] = useState<HistoryEntry[]>(INITIAL_ENTRIES);
  const [input, setInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>(["whoami"]);
  const [historyCursor, setHistoryCursor] = useState<number | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [cursorBlinking, setCursorBlinking] = useState(true);
  const [caretIndex, setCaretIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const nextIdRef = useRef(2);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (viewport) {
      viewport.scrollTop = viewport.scrollHeight;
    }
  }, [entries]);

  function runCommand(rawCommand: string) {
    const trimmed = rawCommand.trim();
    const result = executeTerminalCommand(rawCommand);

    if (trimmed) {
      setCommandHistory((prev) => [...prev, trimmed]);
    }
    setHistoryCursor(null);
    setInput("");
    setCaretIndex(0);

    if (result.action?.type === "clear") {
      setEntries([]);
      return;
    }

    const entryId = nextIdRef.current++;
    setEntries((prev) => [
      ...prev,
      { id: entryId, command: rawCommand, lines: result.lines },
    ]);

    if (result.action?.type === "scroll") {
      const target = document.getElementById(result.action.targetId);
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    runCommand(input);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIndex =
        historyCursor === null ? commandHistory.length - 1 : Math.max(0, historyCursor - 1);
      setHistoryCursor(nextIndex);
      const nextValue = commandHistory[nextIndex] ?? "";
      setInput(nextValue);
      setCaretIndex(nextValue.length);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (historyCursor === null) return;
      if (historyCursor >= commandHistory.length - 1) {
        setHistoryCursor(null);
        setInput("");
        setCaretIndex(0);
      } else {
        const nextIndex = historyCursor + 1;
        setHistoryCursor(nextIndex);
        const nextValue = commandHistory[nextIndex] ?? "";
        setInput(nextValue);
        setCaretIndex(nextValue.length);
      }
      return;
    }

    if (event.key === "Tab") {
      event.preventDefault();
      setInput((current) => {
        const completed = autocompleteTerminalInput(current);
        setCaretIndex(completed.length);
        return completed;
      });
    }
  }

  return (
    <section
      id="terminal"
      aria-labelledby="terminal-heading"
      className="scroll-mt-6 bg-[var(--pf-blue)] py-16 text-white sm:py-24"
    >
      <div className="pf-container">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(250px,0.72fr)_minmax(0,1.28fr)] lg:gap-12">
          <div>
            <p className="m-0 border-b border-[rgb(255_201_40_/_55%)] pb-4 text-sm font-semibold tracking-[-0.01em] text-[var(--pf-yellow)]">
              02 / Interactive Shell
            </p>
            <h2
              id="terminal-heading"
              className="mt-6 mb-0 text-[clamp(2rem,3.6vw,2.875rem)] font-extrabold leading-[1.06] tracking-[-0.025em] text-[var(--pf-yellow)]"
            >
              Browse via Zsh.
            </h2>
            <p className="mt-4 mb-0 max-w-[36ch] text-base leading-7 text-[var(--pf-blue-tint)]">
              A safe, client-side command interpreter for reading my bio, technical focus, and project notes.
            </p>
            <p className="mt-3 mb-0 text-sm leading-6 text-[var(--pf-blue-tint)]/90">
              Try <code className="font-mono text-[var(--pf-yellow)]">help</code>,{" "}
              <code className="font-mono text-[var(--pf-yellow)]">ls</code>,{" "}
              <code className="font-mono text-[var(--pf-yellow)]">cat skills.md</code>, or{" "}
              <code className="font-mono text-[var(--pf-yellow)]">neofetch</code>. Press Tab to autocomplete.
            </p>
          </div>

          <div className="pf-terminal-shell overflow-hidden">
            <div className="flex min-h-11 flex-wrap items-center justify-between gap-3 border-b border-[var(--pf-term-border)] bg-[var(--pf-term-surface)] px-4 py-2">
              <div className="flex items-center gap-2" aria-hidden="true">
                <span className="h-3 w-3 rounded-full bg-[#e06c75]/75" />
                <span className="h-3 w-3 rounded-full bg-[#F9E2AF]/75" />
                <span className="h-3 w-3 rounded-full bg-[#A6D9B0]/75" />
              </div>

              <span className="text-xs font-medium text-[var(--pf-term-muted)]">
                {portfolioData.terminal.promptUser}: ~/portfolio (zsh)
              </span>

              <button
                type="button"
                onClick={() => setCursorBlinking((prev) => !prev)}
                aria-pressed={!cursorBlinking}
                className="min-h-11 border border-[var(--pf-term-border)] px-3 text-xs text-[var(--pf-term-muted)] hover:border-[var(--pf-term-prompt)] hover:text-white"
              >
                {cursorBlinking ? "Pause cursor" : "Resume cursor"}
              </button>
            </div>

            <div
              ref={viewportRef}
              onClick={() => inputRef.current?.focus()}
              role="log"
              aria-live="polite"
              aria-label="Portfolio terminal output"
              className="max-h-[360px] min-h-[260px] overflow-y-auto px-4 py-4 text-[13.5px] leading-relaxed sm:px-5 sm:py-5"
            >
              <p className="mt-0 mb-4 text-xs text-[var(--pf-term-muted)]">
                Portfolio interpreter ready. Type <span className="text-[#F9E2AF]">help</span> for available commands.
              </p>

              {entries.map((entry) => (
                <div key={entry.id} className="mb-4 last:mb-2">
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <span className="text-[#71B7F5]">
                      {portfolioData.terminal.promptUser} {portfolioData.terminal.promptDir} %
                    </span>
                    <span className="break-all text-white">{entry.command}</span>
                  </div>
                  {entry.lines.length > 0 && (
                    <div className="mt-1.5 space-y-0.5">
                      {entry.lines.map((line, idx) => (
                        <div
                          key={`${entry.id}-${idx}`}
                          className={`whitespace-pre-wrap break-words ${TONE_CLASS[line.tone]}`}
                        >
                          {line.text}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <form onSubmit={handleSubmit} className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
                <label htmlFor="portfolio-terminal-input" className="text-[#71B7F5]">
                  {portfolioData.terminal.promptUser} {portfolioData.terminal.promptDir} %
                </label>

                <div className="relative flex min-w-[180px] flex-1 items-center">
                  <input
                    ref={inputRef}
                    id="portfolio-terminal-input"
                    type="text"
                    value={input}
                    onChange={(event) => {
                      setInput(event.target.value);
                      setCaretIndex(event.target.selectionStart ?? event.target.value.length);
                    }}
                    onSelect={(event) => {
                      const target = event.currentTarget;
                      setCaretIndex(target.selectionStart ?? target.value.length);
                    }}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    autoComplete="off"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    aria-label="Portfolio terminal command input"
                    placeholder="Type a command..."
                    className="min-h-11 w-full rounded-none border-0 bg-transparent p-0 font-mono text-[13.5px] text-white caret-transparent shadow-none placeholder:text-[#AFC3D9]/55"
                  />
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute top-1/2 -translate-y-1/2 ${isFocused && cursorBlinking ? "pf-terminal-cursor is-blinking" : "pf-terminal-cursor opacity-65"}`}
                    style={{ left: `min(${caretIndex}ch, calc(100% - 0.6em))` }}
                  />
                </div>
              </form>
            </div>

            <div className="border-t border-[var(--pf-term-border)] bg-[var(--pf-term-surface)] px-4 py-3 sm:px-5">
              <div className="flex flex-wrap items-center gap-2" aria-label="Quick terminal commands">
                {TERMINAL_QUICK_COMMANDS.map((cmd) => (
                  <button
                    key={cmd}
                    type="button"
                    onClick={() => {
                      runCommand(cmd);
                      inputRef.current?.focus();
                    }}
                    className="min-h-11 border border-[var(--pf-term-border)] bg-[var(--pf-term-bg)] px-3 text-xs text-[var(--pf-term-muted)] transition-colors hover:border-[#71B7F5] hover:text-white"
                  >
                    {cmd}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

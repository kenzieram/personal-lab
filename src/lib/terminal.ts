import { portfolioData } from "../data/portfolio.ts";

export type TerminalLineTone = "command" | "output" | "success" | "highlight" | "muted" | "error";

export type TerminalOutputLine = {
  text: string;
  tone: TerminalLineTone;
};

export type TerminalAction =
  | { type: "clear" }
  | { type: "scroll"; targetId: string };

export type TerminalResult = {
  lines: TerminalOutputLine[];
  action?: TerminalAction;
};

const OPEN_TARGETS: Record<string, string> = {
  focus: "focus",
  skills: "focus",
  terminal: "terminal",
  about: "about",
  work: "work",
  projects: "work",
  creative: "creative",
  contact: "contact",
  lab: "lab-access",
};

export const TERMINAL_COMMANDS = [
  "help",
  "whoami",
  "pwd",
  "ls",
  "cat",
  "neofetch",
  "open",
  "clear",
] as const;

export const TERMINAL_QUICK_COMMANDS = [
  "help",
  "whoami",
  "ls",
  "cat about.md",
  "cat projects.md",
  "neofetch",
  "clear",
] as const;

/** Evaluate one predefined browser-terminal command without shell or network execution. */
export function executeTerminalCommand(rawInput: string): TerminalResult {
  const trimmed = rawInput.trim();
  if (!trimmed) {
    return { lines: [] };
  }

  const parts = trimmed.split(/\s+/);
  const command = parts[0].toLowerCase();
  const arg = parts[1];

  switch (command) {
    case "help":
      return {
        lines: [
          { text: "Available portfolio commands:", tone: "highlight" },
          { text: "  whoami            Short introduction", tone: "output" },
          { text: "  pwd               Current portfolio path", tone: "output" },
          { text: "  ls                List readable portfolio files", tone: "output" },
          { text: "  cat <file>        Read about.md, skills.md, projects.md, or interests.md", tone: "output" },
          { text: "  neofetch          Portfolio summary", tone: "output" },
          { text: "  open <section>    Jump to about, work, projects, focus, contact, or lab", tone: "output" },
          { text: "  clear             Clear terminal output", tone: "output" },
        ],
      };

    case "whoami":
      return {
        lines: [
          { text: "kenzie", tone: "success" },
          { text: "Student developer interested in software engineering, infrastructure, cloud, and creative technology.", tone: "output" },
        ],
      };

    case "pwd":
      return {
        lines: [{ text: portfolioData.terminal.cwd, tone: "output" }],
      };

    case "ls":
      return {
        lines: [
          {
            text: portfolioData.terminal.files.map((file) => file.name).join("  "),
            tone: "highlight",
          },
        ],
      };

    case "cat": {
      if (!arg) {
        return {
          lines: [
            {
              text: `usage: cat <file> (${portfolioData.terminal.files.map((f) => f.name).join(", ")})`,
              tone: "muted",
            },
          ],
        };
      }
      const file = portfolioData.terminal.files.find((entry) => entry.name === arg);
      if (!file) {
        return {
          lines: [{ text: `cat: ${arg}: No such file or directory`, tone: "error" }],
        };
      }
      return {
        lines: file.lines.map((line, index) => ({
          text: line,
          tone: index === 0 ? "highlight" : "output",
        })),
      };
    }

    case "neofetch":
      return {
        lines: [
          { text: "kenzie@portfolio", tone: "highlight" },
          { text: "----------------", tone: "muted" },
          ...portfolioData.terminal.neofetch.map((entry) => ({
            text: `${entry.key.padEnd(13, " ")}: ${entry.value}`,
            tone: (entry.key === "Primary" ? "success" : "output") as TerminalLineTone,
          })),
        ],
      };

    case "open": {
      if (!arg) {
        return {
          lines: [{ text: "usage: open <about|work|projects|focus|contact|lab>", tone: "muted" }],
        };
      }
      const targetId = OPEN_TARGETS[arg.toLowerCase()];
      if (!targetId) {
        return {
          lines: [{ text: `open: unknown section "${arg}"`, tone: "error" }],
        };
      }
      return {
        lines: [{ text: `Scrolling to #${targetId}...`, tone: "success" }],
        action: { type: "scroll", targetId },
      };
    }

    case "clear":
      return {
        lines: [],
        action: { type: "clear" },
      };

    default:
      return {
        lines: [{ text: `zsh: command not found: ${parts[0]}`, tone: "error" }],
      };
  }
}

/** Suggest a single unambiguous completion for Tab autocomplete. */
export function autocompleteTerminalInput(rawInput: string): string {
  const hasTrailingSpace = /\s$/.test(rawInput);
  const trimmedLeft = rawInput.trimStart();
  const tokens = trimmedLeft.split(/\s+/);

  if (tokens.length === 1 && !hasTrailingSpace) {
    const match = TERMINAL_COMMANDS.find((cmd) => cmd.startsWith(tokens[0].toLowerCase()));
    if (!match) return rawInput;
    return match === "cat" || match === "open" ? `${match} ` : match;
  }

  const command = tokens[0].toLowerCase();
  const partial = hasTrailingSpace ? "" : (tokens[1] ?? "").toLowerCase();

  if (command === "cat") {
    const fileMatch = portfolioData.terminal.files.find((file) =>
      file.name.toLowerCase().startsWith(partial),
    );
    return fileMatch ? `cat ${fileMatch.name}` : rawInput;
  }

  if (command === "open") {
    const sectionMatch = Object.keys(OPEN_TARGETS).find((key) => key.startsWith(partial));
    return sectionMatch ? `open ${sectionMatch}` : rawInput;
  }

  return rawInput;
}

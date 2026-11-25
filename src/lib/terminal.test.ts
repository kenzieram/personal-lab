import { test } from "node:test";
import assert from "node:assert/strict";
import { autocompleteTerminalInput, executeTerminalCommand } from "./terminal.ts";

test("executes supported predefined portfolio commands safely", () => {
  assert.equal(executeTerminalCommand("pwd").lines[0]?.text, "/home/kenzie/portfolio");
  assert.match(executeTerminalCommand("whoami").lines[0]?.text ?? "", /kenzie/);
  assert.match(executeTerminalCommand("ls").lines[0]?.text ?? "", /about\.md/);

  const about = executeTerminalCommand("cat about.md");
  assert.equal(about.lines[0]?.text, "# Kenzie");

  const neofetch = executeTerminalCommand("neofetch");
  assert.ok(neofetch.lines.some((line) => line.text.includes("Student Developer")));
  assert.ok(neofetch.lines.some((line) => line.text.includes("kenzie.ram@proton.me")));

  const skills = executeTerminalCommand("cat skills.md");
  assert.ok(skills.lines.some((line) => line.text.includes("MTCNA: In Progress")));
  assert.ok(skills.lines.some((line) => line.text.includes("AWS (EC2, S3, IAM, VPC, Security Groups, RDS)")));

  const openProjects = executeTerminalCommand("open projects");
  assert.deepEqual(openProjects.action, { type: "scroll", targetId: "work" });

  assert.deepEqual(executeTerminalCommand("clear").action, { type: "clear" });
});

test("returns safe zsh errors for unknown commands and missing files", () => {
  const unknown = executeTerminalCommand("rm -rf /");
  assert.equal(unknown.lines[0]?.text, "zsh: command not found: rm");
  assert.equal(unknown.lines[0]?.tone, "error");

  const missingFile = executeTerminalCommand("cat secrets.env");
  assert.equal(missingFile.lines[0]?.text, "cat: secrets.env: No such file or directory");
});

test("autocompletes commands and portfolio filenames", () => {
  assert.equal(autocompleteTerminalInput("neo"), "neofetch");
  assert.equal(autocompleteTerminalInput("cat ab"), "cat about.md");
  assert.equal(autocompleteTerminalInput("open pro"), "open projects");
});

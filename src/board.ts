#!/usr/bin/env bun
// Entry point for `just board`. The actual app lives in src/tui/ — this just picks
// interactive vs. plain-text output and hands off. Falls back to a plain listing
// (--list, or automatically off a non-tty) since raw-mode terminal control needs a real
// terminal; that's also what this script's own smoke tests run against.

import { load, printPlain, repoRoot } from "./tui/data.ts";
import { runInteractive } from "./tui/app.ts";

function main(argv: string[]): void {
  const root = repoRoot();
  const listRequested = argv.includes("--list");
  if (listRequested || !process.stdout.isTTY) {
    if (!process.stdout.isTTY && !listRequested) {
      console.error(
        "(not a tty — showing a plain listing; run this in a real terminal for the interactive board)\n",
      );
    }
    printPlain(load(root).opps);
    return;
  }
  runInteractive(root);
}

main(process.argv.slice(2));

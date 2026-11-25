// Monday Morning Punchlines — entry program.
// Writes one joke about Monday mornings to /output/entry.txt.
// The grader runs this with no arguments and no environment:
//   env -i /usr/bin/node main.ts
// Output directory: MAKEFUN_OUTPUT_DIR, then OUTPUT_DIR, then /output.
// The program never deletes or moves /output; it only creates entry.txt inside it.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "I told Monday I'd be five minutes late. It told my boss first.";

const MAX_CHARS = 200;

function outputDir() {
  const fromEnv =
    process.env.MAKEFUN_OUTPUT_DIR || process.env.OUTPUT_DIR || "";
  return fromEnv.trim() !== "" ? fromEnv : "/output";
}

function main() {
  const chars = [...ENTRY].length;
  if (chars < 1 || chars > MAX_CHARS) {
    throw new Error(`entry is ${chars} characters, gate needs 1-${MAX_CHARS}`);
  }
  if (ENTRY.trim() === "") {
    throw new Error("entry must not be only white space");
  }

  const dir = outputDir();
  mkdirSync(dir, { recursive: true });
  const target = join(dir, "entry.txt");
  writeFileSync(target, ENTRY, "utf8");

  // Read the file back and confirm it holds exactly the entry text.
  const written = readFileSync(target, "utf8");
  if (written !== ENTRY) {
    throw new Error("entry.txt does not match the entry text");
  }
  const bytes = Buffer.byteLength(written, "utf8");
  if (bytes !== Buffer.byteLength(ENTRY, "utf8")) {
    throw new Error("entry.txt byte length does not match the entry text");
  }
  // The brief's first criterion: the joke must really be about Monday mornings.
  if (!/monday/i.test(written)) {
    throw new Error("entry text must mention Monday");
  }
  console.log(`wrote ${target} (${chars} characters, ${bytes} bytes)`);
}

main();

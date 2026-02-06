// Jison exports a `parser` object
// eslint-disable-next-line @typescript-eslint/no-var-requires
const parser = require("../dist/parser.js").parser;

export function calculate(input: string): number {
  return parser.parse(input);
}
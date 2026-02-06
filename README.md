# Minimal example using Jison and TypeScript

The problem with using Jison with TypeScript is that Jison predates TypeScript and generates JavaScript parsers, so you need to set up a TypeScript project that can work with the generated JavaScript parser.

This repository illustrates a way to use Jison with TypeScript by generating the parser in JavaScript and then importing it into a TypeScript wrapper. The example is a simple [calculator](src/calculator.jison) that can evaluate expressions with `+` and `-`.

You can start from scratch and read this tutorial and use the repository to check your code or 
instead you can clone this repo and run it directly:

```bash
npm install
npm start
``` 

Alternatively, after you install the dependencies, you can run the `start` script in the `package.json` which will run the parser generation, compile the TypeScript code, and execute the resulting JavaScript:

```bash
@crguezl ➜ /workspaces/hello-jison-ts (main) $ npm i
added 1 package, and audited 26 packages in 2s
2 packages are looking for funding

@crguezl ➜ /workspaces/hello-jison-ts (main) $ npm start

> hello@1.0.0 start
> npm run parser && npm run build && node dist/index.js


> hello@1.0.0 parser
> jison src/calculator.jison -o dist/parser.js

> hello@1.0.0 build
> npx tsc

3
9
1
```

The incoming sections explain how to build this project from scratch.

## Suggested Project structure

Create the `package.json` with `npm init -y`. 

The final structure of your project sshould look like this:

```
➜  hello git:(main) ✗ tree  -I 'node_modules|.git' -a
.
├── .gitignore
├── dist
│   ├── .gitignore
│   ├── ...
│   └── parser.js
├── package-lock.json
├── package.json
├── README.chatgpt.md
├── src
│   ├── calculator.jison
│   ├── calculator.ts
│   └── index.ts
└── tsconfig.json
```

To simplify, the `package.json` file in the example repo contains some scripts:

`➜  hello git:(main) ✗ jq '.scripts' package.json`
```json
➜  hello git:(main) ✗ jq '.scripts' package.json
{
  "parser": "jison src/calculator.jison -o dist/parser.js",
  "build": "npx tsc",
  "start": "npm run parser && npm run build && node dist/index.js",
  "clean": "rm -rf dist/*"
}
```
## Install dependencies including Jison

```bash
npm install jison
npm install --save-dev typescript
npm install --save-dev @types/node
npm install --save-dev typescript
```

Here are the contents of the dependencies fields in `package.json`:

`➜  hello-jison-ts git:(main) jq '[.dependencies, .devDependencies]' package.json`
```json
[
  {
    "jison": "^0.4.18"
  },
  {
    "@types/node": "^25.2.1",
    "tsx": "^4.21.0",
    "typescript": "^5.9.3"
  }
]
```


## Jison grammar (`src/calculator.jison`)

This grammar recognizes numbers, `+`, and `-`, and evaluates the result directly.

```jison
%{

%}

/* Lexer */
%lex
%%
\s+                   /* skip whitespace */
[0-9]+(\.[0-9]+)?     return 'NUMBER';
\+                    return '+';
\-                    return '-';
<<EOF>>               return 'EOF';
.                     return 'INVALID';
/lex

/* Parser */
%start expressions
%token NUMBER
%%

expressions
    : expression EOF
        { return $1; }
    ;

expression
    : expression '+' term
        { $$ = $1 + $3; }
    | expression '-' term
        { $$ = $1 - $3; }
    | term
        { $$ = $1; }
    ;

term
    : NUMBER
        { $$ = Number(yytext); }
    ;
```

This grammar:

* Tokenizes numbers, `+`, and `-`
* Evaluates expressions while parsing
* Returns a `number`

## tsconfig.json

Use a standard TypeScript config, but make sure 

- to set `moduleResolution` to `node` so that it can find the generated parser. 
- We also set `allowJs` to `true` to allow importing the generated JS parser.
- The `types` field includes `node` to get type definitions for Node.js, which is necessary for the generated parser.
- `skipLibCheck` is set to `true` to avoid type checking issues with the generated parser's dependencies.
- `module` is set to `commonjs` since Jison by default generates CommonJS modules although you can change this with the `--module-type` option when generating the parser.

   ```console
   ➜  hello-jison-ts git:(main) npx jison --help

        Usage: jison [file] [lexfile] [options]

        file        file containing a grammar
        lexfile     file containing a lexical grammar

        Options:
        -j, --json                    force jison to expect a grammar in JSON format
        -o FILE, --outfile FILE       Filename and base module name of the generated parser
        -t, --debug                   Debug mode
        -m TYPE, --module-type TYPE   The type of module to generate (commonjs, amd, js)
        -p TYPE, --parser-type TYPE   The type of algorithm to use for the parser (lr0, slr,lalr, lr)
        -V, --version                 print version and exit
   ```
- The `esModuleInterop` flag is set to `true` to allow default imports from CommonJS modules, which can simplify importing the generated parser.
- The `rootDir` is set to `src` and `outDir` to `dist` to keep source and compiled files organized.
- The `target` is set to `es2024` to allow using modern JavaScript features in the generated parser, but you can adjust this based on your needs.
- The `include` field specifies that all TypeScript files in the `src` directory should be included in the compilation process.

```json
{
  "compilerOptions": {
    "target": "ES2019",
    "module": "commonjs",
    "moduleResolution": "node",
    "rootDir": "src",
    "outDir": "dist",
    "strict": true,
    "esModuleInterop": true,
    "allowJs": true,
    "types": ["node"],
    "skipLibCheck": true
  },
  "include": [
    "src/**/*"
  ]
}
```

## Generate the parser

```bash
npx jison src/calculator.jison -o dist/parser.js
```

This produces a **JavaScript parser** (`dist/parser.js`).

Jison predates to TS and generates JS, not TS.


## TypeScript wrapper (`src/calculator.ts`)

Now we use the generated parser from TypeScript.

```ts
// Jison exports a `parser` object
// eslint-disable-next-line @typescript-eslint/no-var-requires
const parser = require("../dist/parser.js").parser;

export function calculate(input: string): number {
  return parser.parse(input);
}
```

## Example usage (`index.ts`)

This is the entry point of the application, which imports the `calculate` function and tests it with some expressions:

```ts
import { calculate } from "./calculator";

console.log(calculate("1 + 2"));        // 3
console.log(calculate("10 - 4 + 3"));   // 9
console.log(calculate("7 - 5 - 1"));    // 1
```

## Compile & run

The command:

```bash
npx tsc
```
will compile the TypeScript files in `src` to JavaScript files in `dist`. The generated parser is already in `dist/parser.js`, so it will be available for import.

Finally, you can run the compiled code with:

```bash
node dist/index.js
```

Which should output:

```
➜  hello-jison-ts git:(main) node dist/index.js 
3
9
1
```

## Branch `tests`

[The `tests` branch of this repository](https://github.com/ULL-ESIT-PL/hello-jison-ts/tree/tests?tab=readme-ov-file) contains some [tests](https://github.com/ULL-ESIT-PL/hello-jison-ts/tree/tests/tests) for the calculator. You can run them with:

```bash
npm test
``` 
and see the output in the terminal. The tests use [Jest](https://jestjs.io/) and are located in 
[`tests/*.test.ts`](https://github.com/ULL-ESIT-PL/hello-jison-ts/tree/tests/tests). 

You can also generate a coverage report with:

```bash
npm run test:coverage
``` 

The branch also includes a GitHub Actions workflow that runs the tests on every push and pull request on that branch. You can see the workflow file in `.github/workflows/tests.yml`.
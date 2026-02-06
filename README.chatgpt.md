# Minimal example using Jison and TypeScript

## Suggested Project structure

Create the `package.json` with `npm init -y`. The final structure should look like this:

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

```

```bash
npm install jison
npm install --save-dev typescript
npm install --save-dev @types/node
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

Use a standard TypeScript config, but make sure to set `moduleResolution` to `node` so that it can find the generated parser.

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

Jison generates JS, not TS.


## 4. TypeScript wrapper (`src/calculator.ts`)

Now we use the generated parser from TypeScript.

```ts
// Jison exports a `parser` object
// eslint-disable-next-line @typescript-eslint/no-var-requires
const parser = require("../dist/parser.js").parser;

export function calculate(input: string): number {
  return parser.parse(input);
}
```

## 5. Example usage (`index.ts`)

```ts
import { calculate } from "./calculator";

console.log(calculate("1 + 2"));        // 3
console.log(calculate("10 - 4 + 3"));   // 9
console.log(calculate("7 - 5 - 1"));    // 1
```

## 6. Compile & run

```bash
npx tsc
node dist/index.js
```

## How it works (quick intuition)

* **Lexer** turns `"10 - 4 + 3"` into tokens:

  ```
  NUMBER(10) '-' NUMBER(4) '+' NUMBER(3)
  ```
* **Parser rules** define how expressions combine
* Semantic actions (`{ $$ = $1 + $3; }`) compute results on the fly
* `parser.parse()` returns the final number



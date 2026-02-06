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
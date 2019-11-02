// Generated automatically by nearley, version 2.19.0
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "main$ebnf$1$subexpression$1", "symbols": ["statement"]},
    {"name": "main$ebnf$1", "symbols": ["main$ebnf$1$subexpression$1"]},
    {"name": "main$ebnf$1$subexpression$2", "symbols": ["statement"]},
    {"name": "main$ebnf$1", "symbols": ["main$ebnf$1", "main$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "main", "symbols": ["main$ebnf$1"]},
    {"name": "statement", "symbols": ["string11", "english2cypher1number", "string12"], "postprocess": 
        function(data) {
        	return {
        		statementNo: 1,
        		english2cypher1number: data[1]
        	};
        }
        },
    {"name": "string11", "symbols": [/[Tt]/, /[Oo]/, /[Pp]/, /[ ]/]},
    {"name": "string12", "symbols": [/[ ]/, /[Aa]/, /[Nn]/, /[Oo]/, /[Mm]/, /[Aa]/, /[Ll]/, /[Oo]/, /[Uu]/, /[Ss]/, /[ ]/, /[Nn]/, /[Oo]/, /[Dd]/, /[Ee]/, /[Ss]/, /[ ]/, /[Ii]/, /[Nn]/, /[ ]/, /[Tt]/, /[Hh]/, /[Ee]/, /[ ]/, /[Nn]/, /[Ee]/, /[Tt]/, /[Ww]/, /[Oo]/, /[Rr]/, /[Kk]/]},
    {"name": "english2cypher1number$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "english2cypher1number$ebnf$1", "symbols": ["english2cypher1number$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "english2cypher1number", "symbols": ["english2cypher1number$ebnf$1"]},
    {"name": "statement", "symbols": ["string21", "english2cypher2nodeName"], "postprocess": 
        function(data) {
        	return {
        		statementNo: 2,
        		english2cypher2nodeName: data[1]
        	};
        }
        },
    {"name": "string21", "symbols": [/[Ss]/, /[Ee]/, /[Aa]/, /[Rr]/, /[Cc]/, /[Hh]/, /[ ]/, /[Nn]/, /[Oo]/, /[Dd]/, /[Ee]/, /[ ]/]},
    {"name": "english2cypher2nodeName$ebnf$1", "symbols": [/[a-zA-Z0-9 -.,]/]},
    {"name": "english2cypher2nodeName$ebnf$1", "symbols": ["english2cypher2nodeName$ebnf$1", /[a-zA-Z0-9 -.,]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "english2cypher2nodeName", "symbols": ["english2cypher2nodeName$ebnf$1"]},
    {"name": "statement", "symbols": ["string31", "english2cypher3number"], "postprocess": 
        function(data) {
        	return {
        		statementNo: 3,
        		english2cypher3number: data[1]
        	};
        }
        },
    {"name": "string31", "symbols": [/[Aa]/, /[Ll]/, /[Ll]/, /[ ]/, /[Nn]/, /[Oo]/, /[Dd]/, /[Ee]/, /[Ss]/, /[ ]/, /[Ll]/, /[Ii]/, /[Mm]/, /[Ii]/, /[Tt]/, /[ ]/, /[Tt]/, /[Oo]/, /[ ]/]},
    {"name": "english2cypher3number$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "english2cypher3number$ebnf$1", "symbols": ["english2cypher3number$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "english2cypher3number", "symbols": ["english2cypher3number$ebnf$1"]},
    {"name": "statement", "symbols": ["string41"], "postprocess": 
        function(data) {
        	return {
        		statementNo: 4,
        	};
        }
        },
    {"name": "string41", "symbols": [/[Aa]/, /[Ll]/, /[Ll]/, /[ ]/, /[Tt]/, /[Hh]/, /[Ee]/, /[ ]/, /[Nn]/, /[Oo]/, /[Dd]/, /[Ee]/, /[Ss]/, /[ ]/, /[Ii]/, /[Nn]/, /[ ]/, /[Tt]/, /[Hh]/, /[Ee]/, /[ ]/, /[Dd]/, /[Aa]/, /[Tt]/, /[Aa]/, /[Bb]/, /[Aa]/, /[Ss]/, /[Ee]/]}
]
  , ParserStart: "main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();

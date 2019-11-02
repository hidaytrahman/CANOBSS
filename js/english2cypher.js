function englishParser(searchTextBoxId, codeMirrorEditor){
	const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
	var text = document.getElementById(searchTextBoxId).value;
	parser.feed(text);
	var text = document.getElementById(searchTextBoxId).value;
	var code = "";
	var result = parser.results[0][0][0][0];
if(result.statementNo==1){
		code += 'MATCH (n)\n\
RETURN n LIMIT '+result.english2cypher1number[0].join("")+'\n\
';
}

if(result.statementNo==2){
		code += 'MATCH (n)-[t:time]->(d)-[r:SendTo]->(m) \n\
WHERE n.IpAddress = "'+result.english2cypher2nodeName[0].join("")+'" RETURN *\n\
';
}

if(result.statementNo==3){
		code += 'MATCH p= ()-[t:time]->(d)-[r:SendTo]->() \n\
RETURN p LIMIT '+result.english2cypher3number[0].join("")+'\n\
';
}

if(result.statementNo==4){
		code += 'MATCH p = ()-[t:time]->(d)-[r:SendTo]->() \n\
RETURN p\n\
';
}

	//codeMirrorEditor.setValue(code);
    return code;
};
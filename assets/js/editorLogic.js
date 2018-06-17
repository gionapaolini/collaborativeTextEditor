var textStructure = new TextStructure(connection);

var JSeditor = CodeMirror(document.getElementById("htmlSection"), {
  mode: "javascript",
  lineNumbers: true,
  theme: "idea"
});

JSeditor.on("change",function(instance, object) {
  if(object.origin!="setValue"){
    transformToSequence(object);
  }

})

function transformToSequence(input) {

  let len = 0;
  for (var i = 0; i < input.removed.length; i++) {
    len+=input.removed[i].length;
  }
  len+=input.removed.length-1;

  let start = JSeditor.getRange({'line':0, 'ch':0},input.from).length;
  for (var i = 0; i < len; i++) {
      let char = textStructure.getCharAtIndex(start);
      textStructure.localDeletion(start);
      textStructure.remoteDeletion(char);
  }

  for (var i = 0; i < input.text.length; i++) {
    for (var j = 0; j < input.text[i].length; j++) {
      textStructure.localInsertion(start,input.text[i][j]);
      textStructure.remoteInsertion(textStructure.getCharAtIndex(start))
      start++;
    }
    if(i<input.text.length-1){
      textStructure.localInsertion(start,"\n");
      textStructure.remoteInsertion(textStructure.getCharAtIndex(start))
      start++;
    }
  }
}

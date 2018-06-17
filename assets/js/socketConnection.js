
// if user is running mozilla then use it's built-in WebSocket
window.WebSocket = window.WebSocket || window.MozWebSocket;
var HOST = location.origin.replace(/^http/, 'ws');
var connection = new WebSocket(HOST);

var idClient;
connection.onopen = function () {

};

connection.onerror = function (error) {
  // an error occurred when sending/receiving data
};

connection.onmessage = function (message) {
  // try to decode json (I assume that each message
  // from server is json)
  let json;
  try {
    json = JSON.parse(message.data);
  } catch (e) {
    console.log('This doesn\'t look like a valid JSON: ', message.data);
    return;
  }
  if(json.type==='startMessage'){

  }else if(json.type==='insertion'){
      let index = textStructure.insertChar(json.charObj);
      updateTextAndCursor(index,json.charObj,"insertion");

  }else if(json.type==='deletion'){
      let index = textStructure.deleteChar(json.charObj);
      updateTextAndCursor(index,json.charObj,"deletion");

  }else {
    console.log("Something is wrong");
  }
};


function updateTextAndCursor(index,char, type){

  let currentPositionCursor =JSeditor.getCursor();
  let indexCursor = JSeditor.getRange({'line':0, 'ch':0},currentPositionCursor).length;

  JSeditor.setValue(textStructure.getText());
  JSeditor.setCursor({'line':0, 'ch':0});
  if(index>indexCursor){

    for (var i = 0; i < indexCursor; i++) {
      JSeditor.moveH(1,"char");
    }
  }else {
    if(type === "deletion"){
      for (var i = 0; i < indexCursor-1; i++) {
        JSeditor.moveH(1,"char");
      }
    }else {
      for (var i = 0; i < indexCursor+1; i++) {
        JSeditor.moveH(1,"char");
      }
    }
  }



}

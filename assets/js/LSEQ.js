

class Character{

  constructor(value, id, level){
    this.value = value;
    this.id = id;
    this.level = level;
  }


}

class TextStructure{
  constructor(connection){
    this.text = [new Character("START",0,0)];
    this.inizialiseIncrements();
    this.connection = connection;
  }

  localInsertion(index, value) {
    index+=1
    let char = this.makeCharacter(index,value);
    this.text.splice(index,0,char);
  }

  makeCharacter(index,value) {
    //if there is space at index in the level 0
    if(this.text[index]==undefined){ // use == so it checks also for null values
      return new Character(value,index,0);
    }else {
      const before = this.text[index-1];
      const after = this.text[index];
      let level = Math.max(before.level,after.level);
      let newID;
      if(this.boundaryPlusVar){
        newID = before.id + this.increment[level];
      }else {
        newID = after.id - this.increment[level];
      }

      if(newID === after.id || newID === before.id ){
        //if there is no more space in the current level
        return this.newLevel(value,before,level);
      }else {
        return new Character(value,newID,level);
      }
    }
  }


  newLevel(value, before,level){

    if(Math.random()<0.5){
      this.boundaryPlusVar = true;
      return this.boundaryPlus(value, before,level);
    }else {
      this.boundaryPlusVar = false;
      return this.boundaryMinus(value, before,level);
    }

  }

  boundaryPlus(value, before,level) {

    let boundary = 10;
    let randomPosition = Math.floor(Math.random() * boundary) + 1;

    let newID = before.id + (this.increment[level+1]*randomPosition);

    return new Character(value,newID,level+1);
  }

  boundaryMinus(value, before,level) {

    let boundary = 10;
    let randomPosition = Math.floor(Math.random() * boundary) + (this.lvlSize[level+1] - boundary);

    let newID = before.id + (this.increment[level+1]*randomPosition);
    return new Character(value,newID,level+1);
  }

  insertChar(char){
    let validIndex = this.findIndexWithID(char.id);
    this.text.splice(validIndex,0,char);
    return validIndex;
  }

  localDeletion(index){
    index+=1;
    this.text.splice(index,1);
  }


  findIndexWithID(id){

    let index;
    if(id > this.text[this.text.length-1].id){
      index = this.text.length;
    }else {
      index = this.binarySearchIndex(id, 1,this.text.length-1);
    }
    return index;


  }
  binarySearchIndex(id,min,max){


    if(this.text[min-1].id< id && this.text[min].id > id )
       return min;
    if(this.text[max-1].id< id && this.text[max].id > id )
       return max;

    let middle = Math.floor(min+(max-min)/2);

    if(this.text[middle-1].id < id && this.text[middle].id > id )
       return middle;

    if(this.text[middle].id > id){
      return this.binarySearchIndex(id,min,middle-1);
    }else {
      return this.binarySearchIndex(id,middle+1,max);
    }


  }

  getCharAtIndex(index){
    return this.text[index+1];
  }

  deleteChar(char){

    let index = this.binarySearch(char.id, 1,this.text.length-1);
    if(index>-1){
      this.text.splice(index,1);
    }else {
      console.log("Char not found");
    }
    return index;

  }

  binarySearch(id,min,max){

    if(min>max ||
      id<this.text[min].id ||
      id>this.text[max].id)
      return -1;

    let middle = Math.floor(min+(max-min)/2);

    if(this.text[middle].id === id){
      return middle;
    }

    if(this.text[middle].id > id){
      return this.binarySearch(id,min,middle-1);
    }else {
      return this.binarySearch(id,middle+1,max);
    }


  }


  inizialiseIncrements(){
    this.increment = [1];
    this.lvlSize = [Number.POSITIVE_INFINITY];
    for (var i = 1; i < 43; i++) {
      this.increment[i] = this.increment[i-1]/Math.pow(2,3+i);
      this.lvlSize[i] = Math.pow(2,3+i);
    }

  }

  printText(){
    let text = "";
    for (var i = 1; i < this.text.length; i++) {
      text += this.text[i].value;
    }
    console.log(text);
  }

  getText(){
    let text = "";
    for (var i = 1; i < this.text.length; i++) {
      text += this.text[i].value;
    }
    return text;
  }
  printTextID(){
    let text = "";
    for (var i = 1; i < this.text.length; i++) {
      text += this.text[i].id+" ";
    }
    console.log(text);
  }


  remoteInsertion(char){
    let data = {
      type: "insertion",
      charObj: char
    }
    connection.send(JSON.stringify(data));

  }
  remoteDeletion(char){
    let data = {
      type: "deletion",
      charObj: char
    }
    connection.send(JSON.stringify(data));
  }

}
/*
var textStructure = new TextStructure();
// lcfjksdfsdjghbffdsjkgvfgdsfgdf

textStructure.insertCharacter(0, "C");
textStructure.insertCharacter(1, "i");
textStructure.insertCharacter(2, "a");
textStructure.insertCharacter(3, "o");
textStructure.insertCharacter(4, "G");
textStructure.insertCharacter(5, "i");
textStructure.insertCharacter(6, "o");
textStructure.insertCharacter(7, "n");
textStructure.insertCharacter(8, "a");
textStructure.printText();
textStructure.printTextID();
textStructure.insertCharacter(4, "s");
textStructure.insertCharacter(5, "o");
textStructure.insertCharacter(6, "n");
textStructure.insertCharacter(7, "o");
textStructure.printText();
textStructure.printTextID();

textStructure.insertCharacter(0, "c");
textStructure.printText();
textStructure.printTextID();

textStructure.insertCharacter(0, "x");
textStructure.printText();
textStructure.printTextID();

textStructure.insertCharacter(0, "l");
textStructure.printText();
textStructure.printTextID();
textStructure.insertCharacter(0, "i");
textStructure.printText();
textStructure.printTextID();

console.log(textStructure.text[5].id);
textStructure.removeCharWithID(textStructure.text[5].id);
textStructure.removeCharWithID(textStructure.text[5].id);

textStructure.printText();
textStructure.printTextID();
textStructure.insertCharacter(4, "i");

textStructure.printText();
textStructure.printTextID();
textStructure.insertCharacter(5, "i");

textStructure.printText();
textStructure.printTextID();
*/

//Init editor
const initialCode = `function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(200);
}`;
const editor = ace.edit("editor");
const editorOptions = {
  fontSize: 16,
  tabSize: 2,
  mode: "ace/mode/javascript",
  enableLiveAutocompletion: true
};

editor.setOptions(editorOptions);
editor.setValue(initialCode);
editor.$blockScrolling = Infinity;

export { editor };

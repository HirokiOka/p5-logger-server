let editor = CodeMirror.fromTextArea(document.getElementById('editor'), {
  mode: "javascript",
  lineNumbers: true,
  indentUnit: 2,
  fontSize: 16,
});

const initCode = `function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(200);
}`;

editor.setSize(600, 400);
editor.setValue(initCode);

const webConsole = document.getElementById('console-message');
const log = console.log;
console.log = (...args) => {
  log(...args);
  webConsole.innerText = args[0];
};

let canvas;
function setup() {
  canvas = createCanvas(400, 400);
  canvas.parent('canvas');
  background(0);
}

document.getElementById("run").addEventListener('click', () => {
  webConsole.innerText = '';
  const code = editor.getValue();
  if (code.match(/createCanvas/g)) {
    const createCanvas = (...args) => {
      canvas = createCanvas(...args);
      canvas.parent('canvas');
    };
  }
  eval(code);
  eval(setup());
  eval(draw());
});

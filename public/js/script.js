//Init CodeMirror
let editor = CodeMirror.fromTextArea(document.getElementById('editor'), {
  mode: "javascript",
  lineNumbers: true,
  indentUnit: 2,
  fontSize: 16,
});
const initCode = `function setup() {
  createCanvas(400, 400);
  background(200);
}

function draw() {
  //ellipse(random(width), random(height), 200);
}`;
editor.setSize(600, 400);
editor.setValue(initCode);


//Init userId
if (sessionStorage.id === undefined) {
  const userId = Math.floor(new Date().getTime() % 10**7);
  sessionStorage.setItem('id', userId);
}


//show console content in page
const webConsole = document.getElementById('console-message');
const log = console.log;
console.log = (...args) => {
  log(...args);
  webConsole.innerText = args[0];
};


//Init canvas
let canvas;
function setup() {
  canvas = createCanvas(400, 400);
  canvas.parent('canvas');
  background(200);
}


//Post codeContent to Server via fetch function
function postCodeContent(codeContent, timestamp) {
  const serverURL = 'https://p5-logger.herokuapp.com/data';
  //const dummyId = Math.floor(Math.random() * 100);
  const id = sessionStorage.id;
  const postData = {
    userId: id,
    timestamp: currentTimestamp,
    code: codeContent
  };
  //console.log(postData);
  const options = {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData),
    method: 'POST',
  };
  try {
    fetch(serverURL, options).then(res => res.json());
  } catch(e) {
    const index = localStorage.length + 1;
    localStorage.setItem(index, JSON.stringify(postData));
  }
}

//Events
document.getElementById("run").addEventListener('click', () => {
  if (!(isLooping())) window.loop(); 
  webConsole.innerText = '';
  const code = editor.getValue();
  const currentTimestamp = new Date().toLocaleString();

  window.eval(code);
  if (code.match(/setup/g)) window.setup();
  canvas.parent('canvas');

  postCodeContent(code, currentTimestamp);
  if (document.getElementById("toggle").checked) {
    const fileName = currentTimestamp + '.png';
    window.save(canvas, fileName);
  }
});

document.getElementById("stop").addEventListener('click', () => {
  window.noLoop();
});

document.getElementById("dl-storage").addEventListener('click', () => {
  window.save(localStorage, 'localStorage.json', true);

});

document.getElementById("canvas").addEventListener('click', () =>{ 
  const fileName = new Date().toLocaleString().substr(10, 12) + '.png';
  window.save(canvas, fileName);
});


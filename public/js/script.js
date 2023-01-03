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


//Init userId
/*
if (sessionStorage.id === undefined) {
  const userId = Math.floor(new Date().getTime() % 10**7);
  sessionStorage.setItem('id', userId);
}
*/
if (sessionStorage.userName === undefined) {
  const userName = 'AnonymousUser';
  sessionStorage.setItem('userName', userName);
}

//show console content in page
const webConsole = document.getElementById('console-message');
const log = console.log;
console.log = (...args) => {
  log(...args);
  webConsole.innerText += args + '\n';
};


//Init canvas
let canvas;
function setup() {
  canvas = createCanvas(400, 400);
  canvas.parent('canvas');
}
function draw() {
  background(200);
}

//Post codeContent to Server via fetch function
async function postCodeContent(codeContent, timestamp) {
  const serverURL = 'https://p5-logger.onrender.com/data';
  //const serverURL = 'http://localhost:3000/data';
  const userName = sessionStorage.userName;
  const postData = {
    userName: userName,
    executedAt: timestamp,
    code: codeContent,
  };
  const options = {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData),
    method: 'POST',
  };
  fetch(serverURL, options).then(res => res.json())
    .catch(err => {
      const index = localStorage.length + 1;
      localStorage.setItem(index, JSON.stringify(postData));
      console.log(err);
    });
}

function resetCanvasVariables() {
  window.stroke(0);
  window.fill(255);
}


//Events
document.getElementById("run").addEventListener('click', async () => {
  resetCanvasVariables();
  if (!(isLooping())) window.loop(); 
  webConsole.innerText = '';
  const code = editor.getValue();
  const currentTimestamp = new Date().toLocaleString();
  try {
    window.eval(code);
    if (code.match(/setup/g)) window.setup();
  } catch (e) {
    console.log(e);
    window.noLoop();
  }
  canvas.parent('canvas');
  postCodeContent(code, currentTimestamp);
});

document.getElementById("stop").addEventListener('click', () => {
  window.noLoop();
  webConsole.innerText = '';
});

document.getElementById("canvas").addEventListener('click', () => { 
  const fileName = new Date().toLocaleString().substr(10, 12) + '.png';
  window.save(canvas, fileName);
});

document.getElementById("user-name").addEventListener('click', () => {
  const userName = window.prompt('User Name:'); 
  document.getElementById("user-name").innerText = userName;
  sessionStorage.setItem('userName', userName);
});

window.addEventListener("beforeunload", (e) => {
    e.returnValue = "ページを離れます．よろしいですか？"
});

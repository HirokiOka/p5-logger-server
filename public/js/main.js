import { editor } from './initEditor.js';
import * as p5 from './p5.min.js';

//Init userId
if (sessionStorage.id === undefined) {
  const userId = Math.floor(new Date().getTime() % 10**7);
  sessionStorage.setItem('id', userId);
}
//Init canvas
let canvas;
function setup() {
  canvas = p5.createCanvas(400, 400);
  canvas.parent('canvas');
}
function draw() {
  p5.background(200);
}

function resetCanvasVariables() {
  p5.stroke(0);
  p5.fill(255);
  if (!(isLooping())) window.loop(); 
}

//Post codeContent to DB
function postCodeContent(codeContent, timestamp) {
  //const serverURL = 'https://p5-logger.herokuapp.com/data';
  const serverURL = 'http://localhost:3000/data';
  //const dummyId = Math.floor(Math.random() * 100);
  const id = sessionStorage.id;
  const postData = {
    userId: id,
    executedAt: timestamp,
    code: codeContent
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
    });
}

const webConsole = document.getElementById('console-message');
//show console content in page
/*
const log = console.log;
console.log = (...args) => {
  log(...args);
  webConsole.innerText += args + '\n';
};
*/
//run code and post data to DB
document.getElementById("run").addEventListener('click', () => {
  resetCanvasVariables();
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
  if (document.getElementById("toggle").checked) {
    const fileName = currentTimestamp + '.png';
    setTimeout(() => {
      window.save(canvas, fileName)
    }, 1000);
  }
});

//Save Canvas as an Image
document.getElementById("canvas").addEventListener('click', () =>{ 
  const fileName = new Date().toLocaleString().substr(10, 12) + '.png';
  window.save(canvas, fileName);
});

//EventListener 
document.getElementById("stop").addEventListener('click', () => {
  window.noLoop();
  webConsole.innerText = '';
});

document.getElementById("dl-storage").addEventListener('click', () => {
  window.save(localStorage, 'localStorage.json', true);
});

/*
window.addEventListener("beforeunload", (e) => {
    e.returnValue = "ページを離れます．よろしいですか？"
});
*/

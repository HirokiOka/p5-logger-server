const initCode = `function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(200);
}`;
let editor  =ace.edit("editor");
editor.setOptions({
  fontSize: 16,
  tabSize: 2,
  mode: "ace/mode/javascript",
  enableLiveAutocompletion: true
});

editor.setValue(initCode);
editor.$blockScrolling = Infinity;


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
function postCodeContent(codeContent, timestamp) {
  const serverURL = 'https://p5-logger.herokuapp.com/data';
  //const dummyId = Math.floor(Math.random() * 100);
  const id = sessionStorage.id;
  const postData = {
    userId: id,
    timestamp: timestamp,
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
  fetch(serverURL, options).then(res => res.json())
    .catch(err => {
      const index = localStorage.length + 1;
      localStorage.setItem(index, JSON.stringify(postData));
    });
}

function resetCanvasVariables() {
  window.stroke(0);
  window.fill(255);
}


//Events
document.getElementById("run").addEventListener('click', () => {
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
  if (document.getElementById("toggle").checked) {
    const fileName = currentTimestamp + '.png';
    setTimeout(() => {
      window.save(canvas, fileName)
    }, 1000);
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

window.addEventListener("beforeunload", (e) => {
    e.returnValue = "ページを離れます．よろしいですか？"
});

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');
var socket = io();
var mouse_down = false;
var current;
var past;
var eraser = false;


canvas.addEventListener('mousedown', function(event) {
  mouse_down = true;
});
canvas.addEventListener('mouseup', function(event) {
  mouse_down = false;
  past = null;
});
canvas.addEventListener('mousemove', function(event) {
  let color = document.getElementById("color-picker").value;
  let thick = document.getElementById("thickness").value;
  if (mouse_down) {
    current = [event.offsetX, event.offsetY];
    if (eraser) {
      let eraser_size = document.getElementById("eraser-size").value;
      erase(current, eraser_size);
      socket.emit('erase', [current, eraser_size]);
    }
    else {
      if (past) {
        draw(past, current, color, thick);
        socket.emit("draw", [past, current, color, thick]);
      }
      past = [event.offsetX, event.offsetY];
    }
    // let image = document.getElementById("canvas");
    // socket.emit('save', image);
    // console.log(image);
  }
});

socket.on('draw', function(data) {
  let past = data[0];
  let current = data[1];
  draw(past, current, data[2], data[3]);
});

socket.on('erase', function(data) {
  erase(data[0], data[1]);
});

// socket.on("restore" ,function(data){
//   if (data) {
//   ctx.drawImage(data, 0, 0);
//   console.log("received data");
//   }
// });

function draw(past, current, strokeColor, thickness) {
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = thickness;
  ctx.beginPath();
  ctx.moveTo(past[0], past[1]);
  ctx.quadraticCurveTo(past[0], past[1], current[0], current[1]);
  ctx.stroke();
  ctx.closePath();
}

function erase(current, size) {
  ctx.strokeStyle = "white";
  ctx.fillStyle = "white";
  ctx.fillRect(current[0], current[1], size, size);
}
document.getElementById("eraser").onclick = function() {
  if (eraser) {
    eraser = false;
    this.style = "background-color: #ddd; color: black;";
  }
  else {
    eraser = true;
    this.style = "background-color: red; color: white;";
  }
};
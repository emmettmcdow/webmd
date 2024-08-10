let p_char_sz = {
  width: 0,
  height: 0,
};

let caret_index = {
  x: 0,
  y: 0,
};

let buffer = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  "Sed semper orci sit amet efficitur malesuada.",
  "Sed ut massa eleifend, semper est lacinia, posuere leo.",
  "Sed aliquam tortor ac lectus varius rhoncus.",
  "Duis eu enim eros.",
  "Quisque placerat tellus in arcu lobortis commodo.",
  "Integer ultrices quam convallis ex pellentesque ultrices. ",
  "Vivamus molestie efficitur sem id tempor.",
  "Integer ultricies in turpis quis volutpat.",
  "Etiam cursus nulla nec vestibulum elementum.",
  "Vestibulum pharetra, lectus id finibus commodo, lacus tortor vehicula leo, sed porttitor ligula lorem sed nulla.",
  "Nam tellus mauris, blandit vitae nisl non, porttitor consequat est.",
];

//***************************************************************************** Rendering functions
const caret_probe = '<span id="probe"></span>';
function render_markdown(text) {
  /* Supports:
   * - Newlines
   */
  let output = "";
  text.forEach((line, y) => {
    if (y == caret_index.y) {
      line =
        line.substring(0, caret_index.x) +
        caret_probe +
        line.substring(caret_index.x);
    }
    output += line + "<br>";
  });
  return output;
}

function move_caret() {
  const caret = document.querySelector("#caret");
  const probe = document.querySelector("#probe");
  var offsets = probe.getBoundingClientRect();
  caret.x1.baseVal.value = offsets.left;
  caret.y1.baseVal.value = offsets.top;
  caret.x2.baseVal.value = offsets.left;
  caret.y2.baseVal.value = offsets.top + p_char_sz.height;
}

//****************************************************************************************** Events
window.onload = function () {
  const psize_elem = document.querySelector("#p-char");
  const anim_box = document.querySelector("#anim-box");
  const display = document.querySelector("#target");

  display.innerHTML = render_markdown(buffer);

  p_char_sz.width = psize_elem.offsetWidth;
  p_char_sz.height = psize_elem.offsetHeight;

  anim_box.width = window.screen.width;
  anim_box.height = window.screen.height;

  move_caret();
};

onkeydown = function (event) {
  event.preventDefault();
};

// TODO: handle newlines etc
// TODO: handle overflow in all directions
// TODO: handle holddowns
onkeyup = function (event) {
  const display = document.querySelector("#target");
  event.preventDefault();
  if (event.keyCode === 8) {
    // Backspace
    buffer[caret_index.y] =
      buffer[caret_index.y].slice(0, caret_index.x - 1) +
      buffer[caret_index.y].slice(caret_index.x);
    caret_index.x -= 1;
  } else if (event.key == "ArrowLeft") {
    // Left
    caret_index.x -= 1;
  } else if (event.key == "ArrowRight") {
    // Right
    caret_index.x += 1;
  } else if (event.key == "ArrowUp") {
    // Up
    caret_index.y -= 1;
  } else if (event.key == "ArrowDown") {
    // Down
    caret_index.y += 1;
  } else if (
    (event.keyCode >= 65 && event.keyCode <= 90) ||
    (event.keyCode >= 48 && event.keyCode <= 57) ||
    (event.keyCode >= 186 && event.keyCode <= 192) ||
    (event.keyCode >= 219 && event.keyCode <= 222)
  ) {
    // Normal Characters
    buffer[caret_index.y] =
      buffer[caret_index.y].slice(0, caret_index.x) +
      event.key +
      buffer[caret_index.y].slice(caret_index.x);
    caret_index.x += 1;
  }
  display.innerHTML = render_markdown(buffer);
  move_caret();
};

//***************************************************************************************** Utility
// function coord_to_index(x, y) {
//   let index = {};

//   index.x = Math.floor(x / p_char_sz.width);
//   index.y = Math.floor(y / p_char_sz.height);
//   return index;
// }

// function index_to_offset(index, source_text) {
//   let offset = 0;

//   for (let i = 0; i < index.y; i++) {
//     offset += source_text[i].length;
//   }

//   return offset + index.x;
// }

//*************************************************************************** Not Important for now
// onmouseup = function(event) {
//   const textarea = document.querySelector("#textbox");
//   let x = event.clientX;
//   let y = event.clientY;

//   let index = coord_to_index(x, y);
//   caret_index = index;
//   render_caret();

//   let offset = index_to_offset(index, buffer);
// }
// onmousemove = function(event) {
//   let x = event.clientX;
//   let y = event.clientY;
//   let index = coord_to_index(x, y)
//   document.getElementById("X").value = x;
//   document.getElementById("Y").value = y;
//   document.getElementById("X-in").value = index.x;
//   document.getElementById("Y-in").value = index.y;

// }

let p_char_sz = {
  width: 0,
  height: 0,
};

let caret_index = {
  x: 0,
  y: 0,
};

// let buffer = [
//   "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
//   "Sed semper orci sit amet efficitur malesuada.",
//   "Sed ut massa eleifend, semper est lacinia, posuere leo.",
//   "Sed aliquam tortor ac lectus varius rhoncus.",
//   "Duis eu enim eros.",
//   "Quisque placerat tellus in arcu lobortis commodo.",
//   "Integer ultrices quam convallis ex pellentesque ultrices. ",
//   "Vivamus molestie efficitur sem id tempor.",
//   "Integer ultricies in turpis quis volutpat.",
//   "Etiam cursus nulla nec vestibulum elementum.",
//   "Vestibulum pharetra, lectus id finibus commodo, lacus tortor vehicula leo, sed porttitor ligula lorem sed nulla.",
//   "Nam tellus mauris, blandit vitae nisl non, porttitor consequat est.",
// ];

let buffer = [""];

const MAX_QUOTES = 6;
const MAX_HEADERS = 6;

//***************************************************************************** Rendering functions
const caret_probe = '<span id="probe"></span>';
function render_markdown(text) {
  /* Supports:
   * - Newlines
   */
  let output = "";
  text.forEach((line, y) => {
    let modline = line;
    let selected = y == caret_index.y;
    // Place caret probe
    if (selected) {
      modline =
        line.substring(0, caret_index.x) +
        caret_probe +
        line.substring(caret_index.x);
    }
    // Headers
    // We want to count #'s in the 'line' variable, but actually render using the 'modline' variable
    let n_pounds = 0;
    for (n_pounds = 0; n_pounds < line.length; n_pounds++) {
      if (line[n_pounds] != "#") {
        break;
      }
    }
    if (n_pounds > 0 && n_pounds <= MAX_HEADERS) {
      modline = render_h_line(modline, n_pounds, selected);
    }

    // Quotes
    // We want to count >'s in the 'line' variable, but actually render using the 'modline' variable
    let n_quotes = 0;
    for (n_quotes = 0; n_quotes < line.length; n_quotes++) {
      if (line[n_quotes] != ">") {
        break;
      }
    }
    if (n_quotes > 0 && n_quotes <= MAX_QUOTES) {
      modline = render_quote(modline, n_quotes, selected);
    }
    output += modline;
    if (n_quotes == 0 && n_pounds == 0) {
      output += "<br>";
    }
  });
  return output;
}

function render_quote(line, n_quotes, selected) {
  if (!selected) {
    line = line.substring(n_quotes);
  }
  // Only support one level quote for now
  line = `<div class="quote">${line}</div>`;
  return line;
}

function render_h_line(line, n_pounds, selected) {
  if (!selected) {
    line = line.substring(n_pounds);
  }
  line = `<h${n_pounds}>${line}</h${n_pounds}>`;
  return line;
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
  const display = document.querySelector("#target");
  event.preventDefault();
  if (event.keyCode === 8) {
    // Backspace
    if (caret_index.x == 0) {
      if (caret_index.y != 0) {
        caret_index.y -= 1;
        caret_index.x = buffer[caret_index.y].length;
        buffer[caret_index.y] += buffer[caret_index.y + 1];
        buffer.splice(caret_index.y + 1, 1);
      }
    } else {
      buffer[caret_index.y] =
        buffer[caret_index.y].slice(0, caret_index.x - 1) +
        buffer[caret_index.y].slice(caret_index.x);
      caret_index.x -= 1;
    }
  } else if (event.key == "ArrowLeft") {
    // Left
    if (caret_index.x == 0) {
      if (caret_index.y != 0) {
        caret_index.y -= 1;
        caret_index.x = buffer[caret_index.y].length;
      }
    } else {
      caret_index.x -= 1;
    }
  } else if (event.key == "ArrowRight") {
    // Right
    if (caret_index.x == buffer[caret_index.y].length) {
      if (caret_index.y != buffer.length - 1) {
        caret_index.y += 1;
        caret_index.x = 0;
      }
    } else {
      caret_index.x += 1;
    }
  } else if (event.key == "ArrowUp") {
    // Up
    if (caret_index.y != 0) {
      caret_index.y -= 1;
    }
    if (caret_index.x > buffer[caret_index.y].length) {
      caret_index.x = buffer[caret_index.y].length;
    }
  } else if (event.key == "ArrowDown") {
    // Down
    if (caret_index.y < buffer.length - 1) {
      caret_index.y += 1;
    }
    if (caret_index.x > buffer[caret_index.y].length) {
      caret_index.x = buffer[caret_index.y].length;
    }
  } else if (event.key == "Enter") {
    let remaining_string = "";
    let extra_offset = 0;
    // Carry over the quote if we are quoted
    if (buffer[caret_index.y][0] == ">") {
      // TODO: handle multiple '>'s
      // But only if there is non-'>' content
      if (buffer[caret_index.y].length > 1) {
        remaining_string = ">";
        extra_offset += 1;
      } else {
        // TODO: make this block un-fugly
        buffer[caret_index.y] = "";
        display.innerHTML = render_markdown(buffer);
        move_caret();
        return;
      }
    }
    remaining_string += buffer[caret_index.y].substring(caret_index.x);
    buffer[caret_index.y] = buffer[caret_index.y].substring(0, caret_index.x);
    buffer.splice(caret_index.y + 1, 0, remaining_string);
    caret_index.y += 1;
    caret_index.x = extra_offset;
  } else if (
    (event.keyCode >= 65 && event.keyCode <= 90) ||
    (event.keyCode >= 48 && event.keyCode <= 57) ||
    (event.keyCode >= 186 && event.keyCode <= 192) ||
    (event.keyCode >= 219 && event.keyCode <= 222) ||
    event.keyCode == 32
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

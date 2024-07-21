let p_char_sz = {
  width: 0,
  height: 0,
}

let caret_index = {
  x: 0,
  y: 0,
}

function coord_to_index(x, y) {
  let index = {};
  
  index.x = Math.floor(x / p_char_sz.width);
  index.y = Math.floor(y / p_char_sz.height);
  return index;
}

function index_to_offset(index, source_text) {
  let i = index.x;
  let j = index.y;
  let out = 0;
  let currChar = "";

  while (j > 0) {
    currChar = source_text.charAt(out);
    if (currChar === '\n') {
      j -= 1;
    }
    out += 1;
  }
  return out + i;
}

function render_markdown(text) {
  /* Supports:
   * - Newlines
   */
  let output = text.replaceAll("\n", "<br>");
  return output

}

function render_caret(index) {
  const caret = document.querySelector("#caret");
  caret.x1.baseVal.value = (index.x+1) * p_char_sz.width;
  caret.y1.baseVal.value = (index.y+0.5) * p_char_sz.height;
  caret.x2.baseVal.value = (index.x+1) * p_char_sz.width;
  caret.y2.baseVal.value = (index.y+1.5) * p_char_sz.height;
}

window.onload = function() { 
  const textarea = document.querySelector("#textbox");
  const display = document.querySelector("#target");
  const psize_elem = document.querySelector("#p-char");
  const anim_box = document.querySelector("#anim-box");
  
  display.innerHTML = render_markdown(textarea.value);
  
  if (textarea.addEventListener) {
    textarea.addEventListener('input', function() {
      display.innerHTML = render_markdown(textarea.value);
    }, false);
  }

  p_char_sz.width = psize_elem.offsetWidth;
  p_char_sz.height = psize_elem.offsetHeight;

  anim_box.width = window.screen.width;
  anim_box.height = window.screen.height;
}

onmousemove = function(event) {
  let x = event.clientX;
  let y = event.clientY;
  let index = coord_to_index(x, y)
  document.getElementById("X").value = x;
  document.getElementById("Y").value = y;
  document.getElementById("X-in").value = index.x;
  document.getElementById("Y-in").value = index.y;
  
}

// TODO: handle newlines etc
onkeyup = function(event) {
  if (event.code === 8) {
    // Backspace
    // move x backwards
    caret_index.x -= 1;
  } else {
    // move x forwards
    caret_index.x += 1;
  }
  render_caret(caret_index);
}

onmouseup = function(event) {
  const textarea = document.querySelector("#textbox");
  let x = event.clientX;
  let y = event.clientY;
  let source_markdown = textarea.value;


  let index = coord_to_index(x, y);
  caret_index = index;
  render_caret(index);

  let offset = index_to_offset(index, source_markdown);

  textarea.setSelectionRange(offset, offset);
}

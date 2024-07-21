let p_char_sz = {
  width: 0,
  height: 0,
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

window.onload = function() { 
  const textarea = document.querySelector("#textbox");
  const display = document.querySelector("#target");
  const psize_elem = document.querySelector("#p-char");
  
  display.innerHTML = render_markdown(textarea.value);
  
  if (textarea.addEventListener) {
    textarea.addEventListener('input', function() {
      display.innerHTML = render_markdown(textarea.value);
    }, false);
  }

  p_char_sz.width = psize_elem.offsetWidth
  p_char_sz.height = psize_elem.offsetHeight
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

onmouseup = function(event) {
  const textarea = document.querySelector("#textbox");
  let x = event.clientX;
  let y = event.clientY;
  let source_markdown = textarea.value
  console.log("Here")

  let index = coord_to_index(x, y)
  console.log("Here2")
  let offset = index_to_offset(index, source_markdown)
  console.log("Here3")

  textarea.setSelectionRange(offset, offset)
}

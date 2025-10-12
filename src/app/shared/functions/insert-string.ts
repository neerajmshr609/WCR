export function insertString(data: string) {
  const texts = data.split(/\r\n|\r|\n/);

  texts.forEach((text) => {
    insertTextOrBreak('text', text);

    if (texts.length !== 1) {
      insertTextOrBreak('break');
    }
  });
}

function insertTextOrBreak(type: 'text' | 'break', content?: string) {
  const range = document.getSelection().getRangeAt(0);
  range.deleteContents();

  const node =
    type === 'text'
      ? document.createTextNode(content)
      : document.createElement('br');
  range.insertNode(node);

  if (type === 'text') {
    range.selectNodeContents(node);
  } else {
    range.setEndAfter(node);
  }

  range.collapse(false);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
}

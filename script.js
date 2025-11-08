document.addEventListener('DOMContentLoaded', () => {
    const editor = document.getElementById('editor');
    const fontFamily = document.getElementById('font-family');
    const fontSize = document.getElementById('font-size');
    const bold = document.getElementById('bold');
    const italic = document.getElementById('italic');
    const underline = document.getElementById('underline');
    const alignLeft = document.getElementById('align-left');
    const alignCenter = document.getElementById('align-center');
    const alignRight = document.getElementById('align-right');
    const listUl = document.getElementById('list-ul');
    const listOl = document.getElementById('list-ol');
    const save = document.getElementById('save');

    fontFamily.addEventListener('change', () => {
        document.execCommand('fontName', false, fontFamily.value);
    });

    fontSize.addEventListener('change', () => {
        document.execCommand('fontSize', false, fontSize.value);
    });

    bold.addEventListener('click', () => {
        document.execCommand('bold');
    });

    italic.addEventListener('click', () => {
        document.execCommand('italic');
    });

    underline.addEventListener('click', () => {
        document.execCommand('underline');
    });

    alignLeft.addEventListener('click', () => {
        document.execCommand('justifyLeft');
    });

    alignCenter.addEventListener('click', () => {
        document.execCommand('justifyCenter');
    });

    alignRight.addEventListener('click', () => {
        document.execCommand('justifyRight');
    });

    listUl.addEventListener('click', () => {
        document.execCommand('insertUnorderedList');
    });

    listOl.addEventListener('click', () => {
        document.execCommand('insertOrderedList');
    });

    save.addEventListener('click', () => {
        const noteContent = editor.innerHTML;
        const blob = new Blob([noteContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'note.html';
        a.click();
        URL.revokeObjectURL(url);
    });
});

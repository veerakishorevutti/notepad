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
    const saveDoc = document.getElementById('save-doc');
    const saveTxt = document.getElementById('save-txt');

    let fileHandles = {}; // Store handles for different file types (doc, txt)

    // --- Rich Text Editor Commands ---
    fontFamily.addEventListener('change', () => document.execCommand('fontName', false, fontFamily.value));
    fontSize.addEventListener('change', () => document.execCommand('fontSize', false, fontSize.value));
    bold.addEventListener('click', () => document.execCommand('bold'));
    italic.addEventListener('click', () => document.execCommand('italic'));
    underline.addEventListener('click', () => document.execCommand('underline'));
    alignLeft.addEventListener('click', () => document.execCommand('justifyLeft'));
    alignCenter.addEventListener('click', () => document.execCommand('justifyCenter'));
    alignRight.addEventListener('click', () => document.execCommand('justifyRight'));
    listUl.addEventListener('click', () => document.execCommand('insertUnorderedList'));
    listOl.addEventListener('click', () => document.execCommand('insertOrderedList'));

    // --- Generic Save Functionality ---
    const saveFile = async (fileType) => {
        let content, blobType, pickerOptions, defaultExtension;

        if (fileType === 'doc') {
            content = editor.innerHTML;
            blobType = 'application/msword';
            defaultExtension = 'doc';
            pickerOptions = {
                types: [{
                    description: 'Word Document',
                    accept: { 'application/msword': ['.doc'] },
                }],
            };
        } else if (fileType === 'txt') {
            content = editor.innerText;
            blobType = 'text/plain';
            defaultExtension = 'txt';
            pickerOptions = {
                types: [{
                    description: 'Text Files',
                    accept: { 'text/plain': ['.txt'] },
                }],
            };
        } else {
            console.error("Unsupported file type");
            return;
        }

        const blob = new Blob([content], { type: blobType });

        // Use the File System Access API if available
        if ('showSaveFilePicker' in window) {
            try {
                if (!fileHandles[fileType]) {
                    fileHandles[fileType] = await window.showSaveFilePicker(pickerOptions);
                }

                const writable = await fileHandles[fileType].createWritable();
                await writable.write(blob);
                await writable.close();

                alert(`Note saved successfully as a .${defaultExtension} file!`);

            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error('Could not save the file:', err);
                    alert('Error saving file.');
                }
            }
        } else {
            // Fallback for older browsers
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `note.${defaultExtension}`;
            a.click();
            URL.revokeObjectURL(url);
        }
    };

    saveDoc.addEventListener('click', () => saveFile('doc'));
    saveTxt.addEventListener('click', () => saveFile('txt'));
});

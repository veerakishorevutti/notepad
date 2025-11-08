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

    let fileHandle; // This will store the handle to the file

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

    // --- Save Functionality ---
    const saveFile = async () => {
        const noteContent = editor.innerHTML;
        const blob = new Blob([noteContent], { type: 'text/html' });

        // Use the File System Access API if available
        if ('showSaveFilePicker' in window) {
            try {
                // If we don't have a file handle yet, show the save dialog
                if (!fileHandle) {
                    fileHandle = await window.showSaveFilePicker({
                        types: [{
                            description: 'HTML Files',
                            accept: { 'text/html': ['.html', '.htm'] },
                        }],
                    });
                }

                // Create a writable stream to the file
                const writable = await fileHandle.createWritable();
                // Write the blob to the file
                await writable.write(blob);
                // Close the file and write the contents to disk
                await writable.close();

                alert('Note saved successfully!');

            } catch (err) {
                // Handle user cancellation or other errors
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
            a.download = 'note.html';
            a.click();
            URL.revokeObjectURL(url);
        }
    };

    save.addEventListener('click', saveFile);
});

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
    const saveButton = document.getElementById('save');
    const saveDoc = document.getElementById('save-doc');
    const saveTxt = document.getElementById('save-txt');
    const openFolder = document.getElementById('open-folder');
    const newFile = document.getElementById('new-file');
    const fileList = document.getElementById('file-list');
    const fileExplorer = document.getElementById('file-explorer');
    const mainActionBtn = document.getElementById('main-action-btn');
    const actionsMenu = document.querySelector('.actions-menu');
    const closeExplorerBtn = document.getElementById('close-explorer-btn');

    let directoryHandle; // Store the handle for the opened directory
    let currentFileHandle; // Store the handle for the currently opened file

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

    // --- UI Interactions ---
    mainActionBtn.addEventListener('click', () => {
        actionsMenu.classList.toggle('visible');
    });

    closeExplorerBtn.addEventListener('click', () => {
        fileExplorer.classList.add('hidden');
    });

    // --- Folder and File Handling ---
    const createNewFile = () => {
        editor.innerHTML = '';
        currentFileHandle = null;
        saveButton.disabled = false;
    };

    const openDirectory = async () => {
        try {
            directoryHandle = await window.showDirectoryPicker();
            if (directoryHandle) {
                await listFiles(directoryHandle);
            }
        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error('Error opening directory:', err);
                alert('Could not open directory.');
            }
        }
    };

    const listFiles = async (dirHandle) => {
        fileList.innerHTML = ''; // Clear the list
        for await (const entry of dirHandle.values()) {
            if (entry.kind === 'file') {
                const li = document.createElement('li');
                li.textContent = entry.name;
                li.dataset.fileName = entry.name;
                fileList.appendChild(li);
            }
        }
        fileExplorer.classList.remove('hidden');
    };

    const saveFile = async () => {
        if (!currentFileHandle) {
            saveAs('txt');
            return;
        }

        try {
            const writable = await currentFileHandle.createWritable();
            let content;
            if (currentFileHandle.name.endsWith('.txt')) {
                content = editor.innerText;
            } else {
                content = editor.innerHTML;
            }
            const blob = new Blob([content], { type: 'text/plain' });
            await writable.write(blob);
            await writable.close();
            alert("File saved successfully!");
        } catch (err) {
            console.error('Error saving file:', err);
            alert('Could not save the file.');
        }
    };

    // --- "Save As..." Functionality ---
    const saveAs = async (fileType) => {
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

        if ('showSaveFilePicker' in window) {
            try {
                const handle = await window.showSaveFilePicker(pickerOptions);
                const writable = await handle.createWritable();
                await writable.write(blob);
                await writable.close();
                alert(`Note saved successfully as a .${defaultExtension} file!`);
                currentFileHandle = handle;
                saveButton.disabled = false;
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error('Could not save the file:', err);
                    alert('Error saving file.');
                }
            }
        } else {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `note.${defaultExtension}`;
            a.click();
            URL.revokeObjectURL(url);
        }
    };

    const loadFile = async (fileName) => {
        if (!directoryHandle) return;

        try {
            currentFileHandle = await directoryHandle.getFileHandle(fileName);
            const file = await currentFileHandle.getFile();
            const contents = await file.text();

            if (fileName.endsWith('.txt')) {
                editor.innerText = contents;
            } else {
                editor.innerHTML = contents;
            }
            saveButton.disabled = false;
        } catch (err) {
            console.error('Error loading file:', err);
            alert('Could not load the selected file.');
        }
    };

    fileList.addEventListener('click', (event) => {
        if (event.target.tagName === 'LI') {
            const fileName = event.target.dataset.fileName;
            loadFile(fileName);
        }
    });

    newFile.addEventListener('click', createNewFile);
    saveButton.addEventListener('click', saveFile);
    saveDoc.addEventListener('click', () => saveAs('doc'));
    saveTxt.addEventListener('click', () => saveAs('txt'));
    openFolder.addEventListener('click', openDirectory);
});

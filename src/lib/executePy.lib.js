const { PythonShell } = window.require('python-shell');

export function executePython(filePath) {
    const pyShell = new PythonShell(localStorage.getItem('script-py'));
    pyShell.send(filePath);
    pyShell.on('message', (message) => {
        console.log(message);
    });
    pyShell.end((err) => {
        if (err) throw err;
    });
}

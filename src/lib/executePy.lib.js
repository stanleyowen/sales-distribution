const { PythonShell } = window.require('python-shell');

export function executePython() {
    console.log('hi');
    const pyShell = new PythonShell('E:/tax/src/lib/script.py');
    pyShell.on('message', (message) => {
        console.log(message);
    });
}

const { PythonShell } = window.require('python-shell');

export function executePython() {
    console.log('hi');
    const pyShell = new PythonShell(localStorage.getItem('script-py'));
    pyShell.on('message', (message) => {
        console.log(message);
    });
    pyShell.end((err) => {
        if (err) throw err;
    });
}

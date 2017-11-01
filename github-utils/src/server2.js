const {fork} = require('child_process');

for(let i=0; i<5; i++) {
    const cloneFork = fork('./Worker.js');
}

(() => {
    console.log("External page script 'Test.js' executed!");
    const p = document.createElement('p');
    p.innerHTML = 'This is from external script src, please check your console log.';
    document.querySelector('#app').appendChild(p); /* Imporant info: append=>root(auto cleanup), else (manual cleanup) */
})();
{
    console.log('ready!');
    const socket = new WebSocket('ws://localhost:3000', 'echo-protocol');
    const openBtn = document.getElementById('openBtn');
    const messageIn = document.getElementById('messageIn');
    const out = document.getElementById('out');
    openBtn.addEventListener('click', (ev) => {
        let msg = messageIn.value;
        socket.send(msg);
    });
    socket.addEventListener('open', function(ev) {
        console.log('open!');
    });
    socket.addEventListener('message', function(ev) {
        console.log('Message from server: ', ev.data);
        const li = document.createElement('li');
        li.innerText = ev.data;
        out.insertBefore(li, out.firstChild);
    });
}
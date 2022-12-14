const video = document.getElementById('arjs-video');
const button = document.getElementById('button');
const select = document.getElementById('select');
let currentStream;

function stopMediaTracks(stream) {
    stream.getTracks().forEach(track => {
        track.stop();
    });
}

function gotDevices(mediaDevices) {
    select.innerHTML = '';
    const changeOption = document.createElement('option');
    changeOption.disabled = true;
    changeOption.appendChild(document.createTextNode("Change camera"));
    select.appendChild(document.createElement('option'));
    let count = 1;
    mediaDevices.forEach(mediaDevice => {
        if (mediaDevice.kind === 'videoinput') {
            const option = document.createElement('option');
            option.value = mediaDevice.deviceId;
            const label = mediaDevice.label || `Camera ${count++}`;
            const textNode = document.createTextNode(label);
            option.appendChild(textNode);
            select.appendChild(option);
        }
    });
}

select.addEventListener('change', event => {
    if (typeof currentStream !== 'undefined') {
        stopMediaTracks(currentStream);
    }
    const videoConstraints = {};
    if (select.value === '') {
        videoConstraints.facingMode = 'environment';
    } else {
        videoConstraints.deviceId = { exact: select.value };
    }
    const constraints = {
        video: videoConstraints,
        audio: false
    };

    navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
            currentStream = stream;

            document.getElementById('arjs-video').srcObject = stream;
            var event = new CustomEvent("camera-init", { stream: stream });
            window.dispatchEvent(event);

            document.body.addEventListener("click", function () {
                document.getElementById('arjs-video').play();
            });
            return navigator.mediaDevices.enumerateDevices();
        })
        .then(gotDevices)
        .catch((error) => {
            console.error(error);
        });
});

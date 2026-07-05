import * as THREE from 'three';

const cameraSelect = document.getElementById('cameraSelect');
let currentStream;

// 1. Initialize Camera List
async function initCameras() {
    try {
        // Must request permission first to get labels
        await navigator.mediaDevices.getUserMedia({ video: true });
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(d => d.kind === 'videoinput');

        cameraSelect.innerHTML = '<option value="">Select Camera</option>';
        videoDevices.forEach(device => {
            const option = document.createElement('option');
            option.value = device.deviceId;
            option.text = device.label || `Camera ${cameraSelect.length}`;
            cameraSelect.appendChild(option);
        });
    } catch (err) { console.error("Permission denied:", err); }
}

// 2. Start Selected Camera
async function startCamera(deviceId) {
    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
    }

    const constraints = { video: { deviceId: deviceId ? { exact: deviceId } : undefined } };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    currentStream = stream;
    
    // Update your AR background texture here
    setupVideoTexture(stream);
}

function setupVideoTexture(stream) {
    const video = document.createElement('video');
    video.srcObject = stream;
    video.play();
    console.log("Camera stream active!");
    // Logic to map 'video' to your 3D Scene background goes here
}

cameraSelect.addEventListener('change', (e) => { if(e.target.value) startCamera(e.target.value); });
initCameras();
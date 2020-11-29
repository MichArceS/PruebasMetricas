const video = document.getElementById("video")

function startVideo() {
    navigator.getUserMedia = (navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);
        navigator.getUserMedia(
            {video: {} },
            stream => video.srcObject = stream,
            err => console.log(err)
        ) 
}
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
    faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
    faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
    faceapi.nets.faceExpressionNet.loadFromUri("/models") 
]).then(startVideo)

video.addEventListener("play", async () => {
    const canvas = faceapi.createCanvasFromMedia(video)
    document.body.append(canvas)
    const displaySize = {width: video.width, height: 560}
    faceapi.matchDimensions(canvas, displaySize)
    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()
        ).withFaceLandmarks().withFaceExpressions()
        const resizeD = faceapi.resizeResults(detections, displaySize)
        canvas.getContext("2d").clearRect(0,0, canvas.width, canvas.height)
        
        faceapi.draw.drawDetections(canvas, resizeD)
        faceapi.draw.drawFaceLandmarks(canvas, resizeD)
        faceapi.draw.drawFaceExpressions(canvas, resizeD)

        console.log(canvas.textContent)
    }, 100);
})
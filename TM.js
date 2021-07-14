// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

// the link to your model provided by Teachable Machine export panel
// 모델이 업로드돼있는 URL
//const URL = "https://teachablemachine.withgoogle.com/models/uihKvlGFe/";
const URL = "./tm-my-image-model/";
let model, webcam, labelContainer, maxPredictions;

let cnt = 0;

// Load the image model and setup the webcam
async function init() {
    // TTS 객체 초기화
    TTSinit();
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // or files from your local hard drive
    // Note: the pose library adds "tmImage" object to your window (window.tmImage)
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Convenience function to setup a webcam
    const flip = false; // whether to flip the webcam (좌우반전 여부)
    webcam = new tmImage.Webcam(640, 360, flip); // width, height, flip

    // 후면카메라 작동을 위해 facingMode의 exact속성을 environment로 준다
    await webcam.setup({ facingMode: { exact: "environment" }}); // request access to the webcam
    await webcam.play();
    SpeakTTS("상품 인식을 시작합니다.");
    window.requestAnimationFrame(loop);

    // append elements to the DOM
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    // labelContainer = document.getElementById("label-container");
    // for (let i = 0; i < maxPredictions; i++) { // and class labels
    //     labelContainer.appendChild(document.createElement("div"));
    // }

}

async function loop() {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
}

function SpeakTTS(txt) {
    window.AppTTS.Speak(txt);
}

function TTSinit() {
    window.AppTTS.initTTS();
}
    

$(document).ready(function(){
    init();
});


// run the webcam image through the image model
async function predict() {
    // predict can take in an image, video or canvas html element
    const prediction = await model.predict(webcam.canvas);
    if (cnt > 20) {
        cnt = 0;
        if (prediction[0].probability > 0.8) {
            console.log(prediction[0].className);
            SpeakTTS(prediction[0].className);
        } else if (prediction[1].probability > 0.8) {
            console.log(prediction[1].className);
            SpeakTTS(prediction[1].className);
        } else if (prediction[2].probability > 0.8) {
            console.log(prediction[2].className);
            SpeakTTS(prediction[2].className);
        } else if (prediction[3].probability > 0.8){
            console.log(prediction[3].className);
            SpeakTTS(prediction[3].className);
        } else if (prediction[4].probability > 0.8){
            console.log(prediction[4].className);
            SpeakTTS(prediction[4].className);
        } else if (prediction[5].probability > 0.8){
            console.log(prediction[5].className);
            SpeakTTS(prediction[5].className);
        } else if (prediction[6].probability > 0.8){
            console.log(prediction[6].className);
            SpeakTTS(prediction[6].className);
        } else if (prediction[7].probability > 0.8){
            console.log(prediction[7].className);
            SpeakTTS(prediction[7].className);
        } else if (prediction[8].probability > 0.8){
            console.log(prediction[8].className);
            SpeakTTS(prediction[8].className);
        } else if (prediction[9].probability > 0.8){
            console.log(prediction[9].className);
            SpeakTTS(prediction[9].className);
        } else if (prediction[10].probability > 0.8){
            console.log(prediction[10].className);
            SpeakTTS(prediction[10].className);
        } else {
            SpeakTTS("상품 인식에 실패했습니다.");
        }
    } else {
        cnt++;
    }
//   for (let i = 0; i < maxPredictions; i++) {
//       const classPrediction =
//           prediction[i].className + ": " + prediction[i].probability.toFixed(2);
//       labelContainer.childNodes[i].innerHTML = classPrediction;
//   }
}

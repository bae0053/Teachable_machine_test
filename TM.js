// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

// the link to your model provided by Teachable Machine export panel
// 모델이 업로드돼있는 URL
//const URL = "https://teachablemachine.withgoogle.com/models/uihKvlGFe/";
const URL = "./tm-my-image-model/";
import { getAudioUrl } from './node_modules/google-tts-api';

let model, webcam, labelContainer, maxPredictions;

let cnt = 0;

// Load the image model and setup the webcam
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // or files from your local hard drive
    // Note: the pose library adds "tmImage" object to your window (window.tmImage)
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Convenience function to setup a webcam
    const flip = false; // whether to flip the webcam
    webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip

    // 안드로이드 웹뷰에서 후면카메라를 사용해야하기 때문에
    // video의 facingMode를 environment로 설정해서 후면카메라를 작동한다.
    await webcam.setup({ facingMode: { exact: "environment" }}); // request access to the webcam
    await webcam.play();

    
    window.requestAnimationFrame(loop);

    // append elements to the DOM
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) { // and class labels
        labelContainer.appendChild(document.createElement("div"));
    }
}

async function loop() {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
}


$(document).ready(function(){
    let voices = [];

    setVoiceList();

    if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = setVoiceList;
    }


});

function setVoiceList() {
    voices = window.speechSynthesis.getVoices();
}

function speech(txt) {
if(!window.speechSynthesis) {
    alert("음성 재생을 지원하지 않는 브라우저입니다. 크롬, 파이어폭스 등의 최신 브라우저를 이용하세요");
return;
}
let lang = 'ko-KR';
let utterThis = new SpeechSynthesisUtterance(txt);
let voiceFound = false;
for(let i = 0; i < voices.length ; i++) {
    if(voices[i].lang.indexOf(lang) >= 0 || voices[i].lang.indexOf(lang.replace('-', '_')) >= 0) {
    utterThis.voice = voices[i];
    voiceFound = true;
    }
}
if(!voiceFound) {
alert('voice not found');
return;
}
utterThis.lang = lang;
utterThis.pitch = 1;
utterThis.rate = 1; //속도
window.speechSynthesis.speak(utterThis);
}


function googleSpeech(txt) {
    // get audio URL
    const speechUrl = getAudioUrl(txt, {
    lang: 'ko-KR',
    slow: false,
    host: 'https://translate.google.com',
    });
    console.log(speechUrl);
}

// run the webcam image through the image model
async function predict() {
    // predict can take in an image, video or canvas html element
    const prediction = await model.predict(webcam.canvas);
    console.log(prediction);
    if (cnt > 100) {
        cnt = 0;
        if (prediction[0].probability > 0.5) {
            console.log(prediction[0].className);
            googleSpeech(prediction[0].className);
            //speech(prediction[0].className);
        } else if (prediction[1].probability > 0.5) {
            console.log(prediction[1].className);
            speech(prediction[1].className);
        } else if (prediction[2].probability > 0.5) {
            console.log(prediction[2].className);
            speech(prediction[2].className);
        } else if (prediction[3].probability > 0.5){
            console.log(prediction[3].className);
            speech(prediction[3].className);
        } else if (prediction[4].probability > 0.5){
            console.log(prediction[4].className);
            speech(prediction[4].className);
        } else if (prediction[5].probability > 0.5){
            console.log(prediction[5].className);
            speech(prediction[5].className);
        } else if (prediction[6].probability > 0.5){
            console.log(prediction[6].className);
            speech(prediction[6].className);
        } else if (prediction[7].probability > 0.5){
            console.log(prediction[7].className);
            speech(prediction[7].className);
        } else if (prediction[8].probability > 0.5){
            console.log(prediction[8].className);
            speech(prediction[8].className);
        } else{
            console.log(prediction[9].className);
            speech(prediction[9].className);
        }
    } else {
        cnt++;
    }
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        labelContainer.childNodes[i].innerHTML = classPrediction;
    }
}
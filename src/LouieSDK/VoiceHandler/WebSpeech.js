import CryptoJS from "crypto-js";
//import axios from "axios";
import startMicSound from "../sound/start_rec.mp3";
import micCloseSound from "../sound/mic_close.mp3";
const TAG = "ReactNativeSpeech";
const voicecallback = require('./VoiceEventProcessor');
const CustomUtils = require('../utils/CustomUtils');
export let isListening = false;
let threshold = 0.0;
let sampleData = [];
let currSampleData = [];
let micDetectionTime = Date.now();
let silenceDetection = Date.now();
let mediaRecorder = null;
let recordingChunks = [];
let audioUrl = null;
let decryptedAudio = null;
let encryptedAudio = null;

export const setIsListening = (isListeningTemp) => {
  isListening = isListeningTemp;
}

export function startListening() {
  console.log("startRecording function called");
  const audio = new Audio(startMicSound);
  audio.play()
  .then(() => console.log("Microphone start sound played"))
  .catch((error) => console.error("Error playing start mic sound:", error));

  isListening = true;
  micDetectionTime = Date.now();
  threshold = 0.0;
  sampleData = [];
  currSampleData = [];
  silenceDetection = Date.now();

  recordingChunks = [];
  //console.log("Recording started, micDetectionTime:", micDetectionTime);

  navigator.mediaDevices.getUserMedia({ audio: true })
    .then((stream) => {
      console.log("Microphone access granted.");

      const options = { mimeType: 'audio/webm; codecs=opus' };
      mediaRecorder = new MediaRecorder(stream, options);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          //console.log("Data available:", event.data);
          recordingChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        if (recordingChunks.length > 0) {
          console.log("Recording stopped, processing audio...");
          const blob = new Blob(recordingChunks, { type: 'audio/webm' });
          console.log("Blob created successfully:", blob);

          handleAudioProcessing(blob)
            .catch((error) => console.error('Error in handleAudioProcessing:', error));
        } else {
          console.warn("No audio data available to process.");
        }
        recordingChunks = [];
      };

      mediaRecorder.onerror = (event) => {
        console.error("Recorder error:", event.error);
      };

      mediaRecorder.start();
      console.log("MediaRecorder started");
    })
    .catch((error) => {
      console.error('Error accessing microphone:', error);
    });
}

function checkAudio(amp) {
  const now = Date.now();
  //console.log(`Current amplitude: ${amp}`, `Time since last mic detection: ${now - micDetectionTime} ms`, `Threshold is: ${threshold}`);
  if (now - micDetectionTime < 3000) {
    //console.log(`Time since last microphone detection: ${now - micDetectionTime} ms`);
    sampleData.push(amp);
    silenceDetection = now;
  } else {
    currSampleData.push(amp);
    if (threshold === 0) {
      // sampleData.push(amp);
      let data = [...sampleData, amp];

      if (data.length >= 4) {
        //console.log("Before sorting:", data);
        data.sort((a, b) => a - b);
        //console.log("After sorting:", data);
        // console.log("Sorted Sample data:", sampleData);

        const lastThree = data.slice(-3);
        const maxValue = lastThree.reduce((acc, val) => acc + val, 0) / lastThree.length;

        // threshold = maxValue;
        const newThreshold = (maxValue < 1 ? 1 : maxValue);
        threshold = newThreshold;
        //console.log(`New threshold set to ${newThreshold}`);
      }
    }
    if (amp < threshold) {
      if (now - silenceDetection > 1500) {
        console.log("Silence detected. Stopping recording...");
        stopListening();
      } else {
        console.log(`Silence detection time: ${now - silenceDetection} ms`);
      }
    } else {
      silenceDetection = now;
      console.log("Amplitude > threshold");
    }
  }
}

export function stopListening() {
  if (mediaRecorder && mediaRecorder.state === 'recording') {
    console.log("Stopping recording...");
    mediaRecorder.stop();
    mediaRecorder.stream.getTracks().forEach(track => track.stop());
    isListening = false;
    console.log("Recording stopped.");
    const audio = new Audio(micCloseSound);
    audio.play()
    .then(() => console.log("Microphone stop sound played"))
    .catch((error) => console.error("Error playing stop mic sound:", error));
  } else {
    console.warn('No recording in progress or no data available.');
  }
}

setInterval(() => {
  if (isListening) {
    const amp = Math.random() * 10;  // Simulate audio amplitude
    checkAudio(amp);
  }
}, 500);

async function handleAudioProcessing(blob) {
  try {
    const arrayBuffer = await blob.arrayBuffer();
    const byteArray = new Uint8Array(arrayBuffer);
    //console.log('Byte array saved:', byteArray);

    const secret = generateRandomString(32);
    const iv = generateRandomString(16);
    const encrypted = encryptByteArray(byteArray, secret, iv);
    encryptedAudio = encrypted;
    //console.log('Encrypted data:', encrypted);
  } catch (error) {
    console.error('Error processing audio:', error);
  }
}

function encryptByteArray(byteArray, secret, ivStr) {
  const wordArray = CryptoJS.lib.WordArray.create(byteArray);
  const key = CryptoJS.enc.Utf8.parse(secret);
  const iv = CryptoJS.enc.Utf8.parse(ivStr);

  try {
    const encrypted = CryptoJS.AES.encrypt(wordArray, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    const encryptedBase64 = CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
    //console.log("Encrypted Base64 data:", encryptedBase64);

    const formData = new FormData();
    formData.append('audio', encryptedBase64);
    formData.append('key', secret);
    formData.append('iv', ivStr);
    formData.append('isByteArray', "True");
    formData.append('lang', 'en');

    fetch('https://gabbar-dev-apigw.dev.louieapis.net/transcribe', {
      method: 'POST',
      body: formData,
      headers: {
        'x-api-key': 'qnqaHajoo14ZETQrIzqOr8FnxxiG4mqm9UYEMtD5'
      }
    })
    .then(response => response.json())
    .then(data => {
      //console.log('Server response:', data);
      decrypt(data.text, secret, ivStr);
    })
    .catch(error => console.error('Error sending data to server:', error));

    return encryptedBase64;
  } catch (error) {
    console.error('Error encrypting data:', error);
    return null;
  }
}


function decrypt(cipherText, secret, iv) {
  try {
    const key = CryptoJS.enc.Utf8.parse(secret);
    const ivParsed = CryptoJS.enc.Utf8.parse(iv);

    const decrypted = CryptoJS.AES.decrypt(cipherText, key, {
      iv: ivParsed,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
    if (decryptedText) {
      console.log("Decrypted text:", decryptedText);
       decryptedAudio = decryptedText;
       var newresponse = decryptedText;
      if (!newresponse || newresponse.toLowerCase().includes("thanks for watching")) {
        var isRecognitionActive = false;
        if (voicecallback) {
            voicecallback.onVoiceError(2);
        }
      } else {
        var newText = CustomUtils.removeExtraWordsFromApiResponse(newresponse);
        if (newText === null) {
            voicecallback.onVoiceError(newText);
        } else {
            var formattedResult = newText?.toLowerCase();
            voicecallback.setRawVoiceResult(newresponse);
        //    console.log("formatted result 1 =",formattedResult);
            // if (formattedResult.includes(".")) {
            //     formattedResult = formattedResult.replaceAll(".","");
            //     console.log("formatted result 2 =",formattedResult);
            // }
            if (formattedResult?.includes("-")) {
                // formattedResult = formattedResult.replaceAll("-"," ");
                formattedResult = formattedResult.split("-").join(" ");
            //    console.log("formatted result 3 =",formattedResult);
            }
            if ((formattedResult?.trim(0).endsWith(".") || (newText?.trim(0).endsWith("!")))) {
                console.log("testing-1","testing");
                formattedResult = formattedResult.slice(0,-1);
            //    console.log("formatted result 4 =",formattedResult);
                voicecallback.onVoiceEvent(formattedResult);
            } else {
                console.log("testing-2","testing");
             //   console.log("formatted result 5 =",formattedResult);
                voicecallback.onVoiceEvent(formattedResult?.trim(0).toLowerCase());
            }
            console.log("Final result",formattedResult);
        }
      }
      // const decryptedTextElement = document.getElementById('decryptedText');
      //  document.getElementById('decryptedAudio').textContent = decryptedText;
    } else {
      console.error("Decryption returned empty result.");
    }
  } catch (error) {
    console.error("Error decrypting text:", error);
  }
}




function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }
  return randomString;
}
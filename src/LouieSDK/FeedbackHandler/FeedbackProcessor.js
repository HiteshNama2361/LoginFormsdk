import { isListening, startListening, stopListening } from '../VoiceHandler/WebSpeech';
import { setIsVoiceSessionActive } from '../LouieSDK';
const AppConstants = require('../AppConstants');
const VoiceEventProcessor = require('../VoiceHandler/VoiceEventProcessor');
//const utterance = new SpeechSynthesisUtterance();
let isSpeaking = false;
let selectedVoice = '';
var lastFeedback = "";
const TAG = "FeedbackProcessor";

export const selectDefaultVoice = () => {
  console.log("inside selectDefaultVoice","selectDefaultVoice");
  if ('speechSynthesis' in window) {
    const availableVoices = window.speechSynthesis.getVoices();
    let defaultVoice = availableVoices[0]?.name || ''; 
    const userAgent = navigator.userAgent;

    if (/android/i.test(userAgent)) {
      defaultVoice = availableVoices.find(voice => voice.name.includes('Google'))?.name || defaultVoice;
    } else if (/windows/i.test(userAgent)) {
      defaultVoice = availableVoices.find(voice => voice.name.includes('Microsoft'))?.name || defaultVoice;
    } else if (/macintosh|mac os x/i.test(userAgent)) {
      defaultVoice = availableVoices.find(voice => voice.name.includes('Daniel'))?.name || defaultVoice;
    } else if (/iphone|ipad|ipod/i.test(userAgent)) {
      defaultVoice = availableVoices.find(voice => voice.name.includes('Daniel') || voice.name.includes('Samantha'))?.name || defaultVoice;
    }

    selectedVoice = defaultVoice;
    console.log("Default voice selected based on OS:", selectedVoice);
  } else {
    console.warn("SpeechSynthesis API not supported in this browser.");
  }
};

// selectDefaultVoice();

export const setSelectedVoice = (voiceName) => {
  selectedVoice = voiceName;
  console.log("Selected voice updated to:", selectedVoice);
};

export const speakToUser = (message, utteranceId, saveLastFeedback) => {
  const utterance = new SpeechSynthesisUtterance();
  console.log("TTS is initialized");
  try {
    if (saveLastFeedback) {
      lastFeedback = message?.toString();
      VoiceEventProcessor.setLastFeedback(lastFeedback);
    }
    if (utteranceId === AppConstants.VOICE_END) {
      setIsVoiceSessionActive(false);
      if (isListening) {
        stopListening();
      }
    }
    console.log("TTS successfully spoken: ", message);
    console.log("With Utterance ID: ", utteranceId);

    // if (isSpeaking) {
    //   console.log("Already speaking.");
    //   return;
    // }
    const availableVoices = window.speechSynthesis.getVoices();
    const selectedVoiceObject = availableVoices.find(voice => voice.name === selectedVoice);
    if (selectedVoiceObject) {
      utterance.voice = selectedVoiceObject;
    }
    utterance.text = message;

    // Set pitch, rate, and volume if needed
    utterance.pitch = 1;
    utterance.rate = 1.2;
    utterance.volume = 1;

    utterance.onstart = () => {
      console.log("Speech started:", utterance.text);
      isSpeaking = true;
    };

    utterance.onend = () => {
      console.log("Speech ended", utterance.text);
      isSpeaking = false;
      // remove following code later once utterance id issue is resolved
      VoiceEventProcessor.onDone(utteranceId);
    };

    utterance.onerror = (event) => {
      console.error("Speech error", event.error);
      isSpeaking = false;
    };

    // Start speaking the message
    window.speechSynthesis.speak(utterance);

    //console.log(window.speechSynthesis);
  } catch (err) {
    console.log("catch block-FeedbackProcessor", err);
  }
};

export function stopSpeaking() {
  window.speechSynthesis.cancel();
  isSpeaking = false;
}

export const getLastFeedback = () => {
  return lastFeedback;
};

export const setLastFeedback = (feedback) => {
  console.log("clear last feedback","cleared");
  lastFeedback = feedback;
};

export const flushSpeechOfFeedbackProcessor = (utterenceId, message) => {
  console.log("flushSpeechOfFeedbackProcessor", "35");
  try {
    console.log("flushSpeechOfFeedbackProcessor", "36");
    speakToUser(message , utterenceId, false);
  } catch (err) {
    console.log(TAG + "exception occured while flusing Speech", err);
  }
};

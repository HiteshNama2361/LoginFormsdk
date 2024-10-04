
import { VOICE_END, VOICE_NONE, VOICE_REINPUT } from '../AppConstants';
//import {TextToSpeechEngine, setSpeechRateAsyncStorage, getSpeechRateAsyncStorage, AsyncStorageGlobal,currentVoice} from '../LouieSdk';
import constantString from '../res/ConstantString';
const LouieSdk = require('../LouieSDK');
const FeedbackProcessor = require('../FeedbackHandler/FeedbackProcessor');
const ContextFinder = require('../utils/ContextFinder');
const VoiceEventProcessor = require('../VoiceHandler/VoiceEventProcessor');
const TAG = "ResourseUtils";

export const increaseSpeechRate = async () => {
    console.log("inside increaseSpeechRate-1", "increaseSpeechRate");
    // var speechRate = await getSpeechRateAsyncStorage();
    // console.log("current speech rate before increasing ", typeof speechRate);
    // if (speechRate < 0.7) {
    //     speechRate += 0.05;
    //     TextToSpeechEngine.setDefaultRate(speechRate);
    //     console.log("inside increaseSpeechRate-2", speechRate);
    //     console.log("inside increaseSpeechRate-2.1", typeof speechRate);
    //     var jsonValueSpeechRate = speechRate.toFixed(2);
    //     console.log("inside increaseSpeechRate-3", jsonValueSpeechRate);
    //     console.log("inside increaseSpeechRate-3", typeof jsonValueSpeechRate);
    //     setSpeechRateAsyncStorage(jsonValueSpeechRate);
    //     if (jsonValueSpeechRate === "1.0") {
    //         console.log("inside increaseSpeechRate-4", typeof jsonValueSpeechRate);
    //          jsonValueSpeechRate = "1";
    //      }
    //     FeedbackProcessor.speakToUser(constantString.speech_rate_set + jsonValueSpeechRate, VOICE_NONE, false);
    //     console.log("current speech rate After increasing ", jsonValueSpeechRate);
    // } else {
    //   FeedbackProcessor.speakToUser(constantString.speech_rate_set_maximum, VOICE_NONE, false);
    // } 
}

export const decreaseSpeechRate = async () => {
    console.log("inside decreaseSpeechRate-1", "decreaseSpeechRate");
    // var speechRate = await getSpeechRateAsyncStorage();
    // console.log("current speech rate before decreasing ", speechRate);
    // if (speechRate > 0.5) {
    //     speechRate -= 0.05;
    //     TextToSpeechEngine.setDefaultRate(speechRate);
    //     console.log("inside decreaseSpeechRate-2", speechRate);
    //     var jsonValueSpeechRate = speechRate.toFixed(2);
    //     console.log("inside decreaseSpeechRate-3", jsonValueSpeechRate);
    //     setSpeechRateAsyncStorage(jsonValueSpeechRate);
    //     FeedbackProcessor.speakToUser(constantString.speech_rate_set + jsonValueSpeechRate, VOICE_NONE, false);
    //     console.log("current speech rate After decreasing ", speechRate);
    // } else {
    //     FeedbackProcessor.speakToUser(constantString.speech_rate_set_minimum, VOICE_NONE, false);
    // }
}

export const matchTTS = () => {
    if (VoiceEventProcessor.voiceResultContainsAnyKey("google_tts")) {
        return "com.google.android.tts";
    } else if (VoiceEventProcessor.voiceResultContainsAnyKey("auto")) {
        return "com.vnspeak.ttsengine.autotts";
    } else if (VoiceEventProcessor.voiceResultContainsAnyKey("eloquence")) {
        return "es.codefactory.eloquencetts";
    } else if (VoiceEventProcessor.voiceResultContainsAnyKey("vocalizer")) {
        return "es.codefactory.vocalizertts";
    } else if (VoiceEventProcessor.voiceResultContainsAnyKey("samsung")) {
        return "com.samsung.SMT";
    } else if (VoiceEventProcessor.voiceResultContainsAnyKey("acapela")) {
        return "acapela";
    } else {
        return "error";
    }
}

export const changeTTS = async () => {
    //get installed tts engine list from your device
    console.log("inside this TTS check 2");
    // var enginesList =  await LouieSdk.getAvailableEngines();
    // console.log("TTS engline list ", enginesList.length);  
    // //currently set TTS engine
    // var defaultEngine = await AsyncStorageGlobal.getItem('TTS_ENGINE_PREFERENCE');
    // // no api for getting default tts engine
    // console.log(TAG, " default engine of my app " + defaultEngine);
    // var defaultTTSEngineName = "";
    // var name2 = ""; 
    // for (let i = 0; i < enginesList.length; i++) {
    //   if (JSON.stringify(enginesList[i].name) !== defaultEngine.toString()) {
    //     console.log("1111 ", JSON.stringify(enginesList[i].name));
    //     name2 += enginesList[i].label + ", ";
    //   } else {
    //     console.log("2222 ", enginesList[i].label);
    //     defaultTTSEngineName = enginesList[i].label.toString();
    //   }
    // }
    // //console.log("7777", defaultTTSEngineName);
    // //console.log(TAG, "another available tts on device without including defaultTTS " + name2);

    // if (enginesList.length === 1) {
    //     console.log("When TTs engine list is 1", "1");
    //     await changeVoice();
    //     var engineName = "";
    //     if (enginesList[0].name.toLowerCase().includes("google") ) {
    //        engineName = "Google TTS ";
    //     }
    //     FeedbackProcessor.speakToUser(constantString.voice_has_been_changed, VOICE_NONE, false);
    //     if (VoiceEventProcessor.currentProcess != null) {
    //         VoiceEventProcessor.handleCommandByCommandId(VoiceEventProcessor.currentProcess);
    //     } else {
    //         VoiceEventProcessor.handleCommandByCommandId(ContextFinder.getScreenDetails().primary_command);
    //     }
    // } else if (enginesList.length === 2) {
    //     console.log("When TTs engine list is 2", "2");
    //     await changeVoice();
    //     var engineName = "";
    //     if (enginesList[1].name.toLowerCase().includes("google") || enginesList[0].name.toLowerCase().includes("google")) {
    //        engineName = "Google TTS ";
    //     }
    //     FeedbackProcessor.speakToUser(constantString.voice_has_been_changed, VOICE_NONE, false);
    //     if (VoiceEventProcessor.currentProcess != null) {
    //         VoiceEventProcessor.handleCommandByCommandId(VoiceEventProcessor.currentProcess);
    //     } else {
    //         VoiceEventProcessor.handleCommandByCommandId(ContextFinder.getScreenDetails().primary_command);
    //     }
    // } else {
    //     console.log("inside else TTS check :")
    //     VoiceEventProcessor.changeTTSCommand = true;
    //     FeedbackProcessor.speakToUser(constantString.want_to_switch_voice_manually + defaultTTSEngineName + constantString.choose_from + name2, VOICE_REINPUT, false);
    // }
}

export const changeVoice = async () => {
    //console.log(TAG, "SDK_IN_CHANGE_VOICE-change voice " );
    // no api for getting current voice used by TTS engine
    // TODO
    // var currentVoice = await LouieSdk.getCurrentVoiceAsyncStorage();
    // currentVoice = currentVoice.replace(/"/g, "");
    // console.log("Current voice used by TTS ", currentVoice);
    // // get only english voice for current TTS
    // var voiceList = await LouieSdk.getEnglishVoices();
    // console.log("20", voiceList);
    // if (voiceList.length === 0) {
    //     console.log("21", voiceList.length);
    //     voiceList = await LouieSdk.getEnglishVoices();
    // }
    // if (voiceList.length === 0) {
    //     console.log("22","22");
    //    FeedbackProcessor.speakToUser(constantString.no_other_voice_available,VOICE_NONE, false);
    // } else {
       
    //     var index = 0;
    //     const count = voiceList.length;
    //     for (let i = 0; i < count; i++) {
    //         console.log("23 ", currentVoice);
    //         console.log("24 ", voiceList[i].id);
    //         if (voiceList[i].id === currentVoice) {
    //             console.log("25 ", i);
    //             index = i;
    //             break;
    //         }
    //     }
    //     let oldIndex = index;
    //     if (index >= count-1) {
    //         console.log("27 ", index);
    //         index = 0;
    //     } else {
    //         index = index + 1;
    //         console.log("28 ", index);
    //     }
    //     console.log("current voice :", voiceList[index].id);
    //     let currentNewVoice = "en-in-x-ene-local";
    //     if(voiceList[oldIndex].id === "en-in-x-ene-local") {
    //         currentNewVoice = "en-in-x-ena-local";
    //     } else {
    //         currentNewVoice = voiceList[index].id;
    //     }
    //     LouieSdk.setCurrentVoiceAsyncStorage(currentNewVoice);
    //     //let valC = await LouieSdk.getCurrentVoiceAsyncStorage();
    //     //console.log("inside of checking voice 1234", valC);
    //      TextToSpeechEngine.setDefaultVoice(currentNewVoice);
    //     console.log("Current voice is ", currentNewVoice);
    //     //ToastAndroid.show(currentNewVoice, ToastAndroid.SHORT);
    // }  
}

export const noInternetError = () => {
  var utteranceId = VOICE_REINPUT;
  var errorFeedback;
  //console.log("inside noInternetError","noInternetError " + VoiceEventProcessor.errorCount);
  switch (VoiceEventProcessor.errorCount) {
    case 1:
      errorFeedback = constantString.slow_internet;
      break;
    case 2:
      errorFeedback = constantString.unstable_internet;
      break;
    default:
      utteranceId = VOICE_END;
      errorFeedback = constantString.slow_internet_going_silent;
      break;
  }
  FeedbackProcessor.speakToUser(errorFeedback, utteranceId, false);
}
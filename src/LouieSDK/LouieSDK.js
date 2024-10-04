import {initializeRecognizer, isListening, startListining, stopListening} from './VoiceHandler/WebSpeech';
import { selectDefaultVoice } from './FeedbackHandler/FeedbackProcessor';
const FeedbackProcessor = require('./FeedbackHandler/FeedbackProcessor');
const ContextFinder = require('./utils/ContextFinder');
//const CreateVoiceData = require( "./res/CreateVoiceData");
const ConstantString = require('./res/ConstantString');
const AppConstants = require('./AppConstants');
const VoiceEventProcessor = require('./VoiceHandler/VoiceEventProcessor');

export var isVoiceSessionActive = false;
var defaultLanguage = "eng";
var initDefaultLanguage = "eng";
export var currentScreenContext = null;
export var listContext = null;
export var ListViewType = null;
var screenType = "";
var currentScreenLouieSdk = "";
var previousScreen = "";
var screenChanged = false;
export var retryCountForFetchingData = 0;
export var retryCountForNoScreenFound = 0;
var isVoiceSessionActive = false; 

const checkPermissionAndStartVoiceSession = async (document) => {
  console.log("checkPermissionAndStartVoiceSession","1");
  try {
    if (!isVoiceSessionActive) {
      // Check for microphone permission
      if (await checkMicPermission()) {
        currentScreenContext = document;
        console.log("checkPermissionAndStartVoiceSession","2");
        setTimeout(() => {
          var screenName = getScreenName(document);
          console.log("### screenName 1234567890", screenName);
          setCurrentScreen(screenName);
          ContextFinder.checkPermissionAndStartPrimaryCommand();
        },500);
      } else {
        console.log("checkPermissionAndStartVoiceSession","3");
        alert("This feature requires microphone permission to function. Please enable it in your device settings.");
      }
    } else {
      console.log("17", "17");
      flushFeedback();
    }
  } catch (err) {
    console.log("18", "18");
    FeedbackProcessor.speakToUser(ConstantString.going_silent, AppConstants.VOICE_END, false);
  }
};

export const checkMicPermission = async () => {
  console.log("14", "14");
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    return stream;
  } catch (error) {
    console.error('Microphone permission denied:', error);
    return null;
  }
}

export const setCurrentScreen = (screen) => {
  console.log("setCurrentScreen", screen);
  previousScreen = currentScreenLouieSdk;
  currentScreenLouieSdk = screen;
  console.log("current screen :", currentScreenLouieSdk, "previous screen :",previousScreen);
}

export const getPreviousScreen = () => {
  console.log("check previous screen :", previousScreen);
  return previousScreen;
}

export const getCurrentScreen = () => {
  console.log("getCurrentScreen", currentScreenLouieSdk);
  return currentScreenLouieSdk;
}

export const getCurrentActivity = () => {
  return currentScreenContext;
}

// Never make this function private as it will be called in client's app
export const setCurrentScreenDetails = (document, currView, navigation) => {
  console.log("inside setCurrentScreenDetails","setCurrentScreenDetails");
  // uncomment later when required
  //globalnavigation = navigation;
  //rootWindowGlobal = document;
  if (isVoiceSessionActive) {
    console.log("inside if setCurrentScreenDetails","setCurrentScreenDetails");
    try {
      if (document) {
        console.log("Welcome","dom available");
        if (currView != null) {
          screenType = currView;
        } else{
          screenType = "Scrollview";
        }
        // uncomment later when required
        // if (currView !== null) {
        //   screenType = "FlatList";
        // } else {
        //   screenType = "Scrollview";
        // }
        // uncomment later when required
        ListViewType = screenType;
        //globalnavigation = navigation;
        //console.log("22222", navigation);
        var scrName = getScreenName(document);
        console.log("inside setCurrentScreenDetails", "currentScreenName " +scrName);
        setCurrentScreen(scrName);
        setCurrentActivity(document);
      } else {
        console.log("error occured in louiesdk", "context null");
        FeedbackProcessor.speakToUser(ConstantString.encounter_problem_going_silent, AppConstants.VOICE_END, false);
      }
    } catch (err) {
      console.log("error occured in louiesdk", "context null");
      FeedbackProcessor.speakToUser(ConstantString.encounter_problem_going_silent, AppConstants.VOICE_END, false);
    }
  } 
}

export const initializeWebSDK =  async(document, language, enableLogs) => {
  console.log("initializeWebSDK", document);
  try {
    if (!isVoiceSessionActive) {
      setSessionCount();
      console.log("Voice session new", "initializeLouieSDK");
      // console.log("here is ur doc ",document);
      defaultLanguage = language;
      initializeTTS();
      //initializeRecognizer();
      setTimeout(async () => {
        checkPermissionAndStartVoiceSession(document);
      }, 200);
    } else {
      console.log("Voice session already active", "initializeLouieSDK");
      checkPermissionAndStartVoiceSession(document);
    }
  } catch (err) {
    console.log("Exception occured while initializing TTS ", err);
    FeedbackProcessor.speakToUser(ConstantString.encounter_problem_going_silent, AppConstants.VOICE_END, false);
  }
}


//  const getCurrentScreenDetails = (document) => {
//   console.log("getCurrentScreenDetails-0",CreateVoiceData);
//   let currentScreen = ContextFinder.getScreenDetailsId();
//   console.log("getCurrentScreenDetails-1",currentScreen);
//   let currentScreenDetails = null;
//   if (currentScreen) {
//      //currentScreenDetails = data.screens[currentScreen];
//     currentScreenDetails = CreateVoiceData.screenMap.get(currentScreen);
//     console.log( "getCurrentScreenDetails-2" ,currentScreenDetails);
//     return currentScreenDetails;
//   } else {
//     console.log("getCurrentScreenDetails-3", "current screen name = No screen found");
//     return CreateVoiceData.screenMap.get("NoScreenFound");
//   }
// }

const getScreenName = (document) => {
   let srcName = "";
   const screen = ContextFinder.getScreenDetailsId(document);
   console.log("getScreenName", screen);
   if (screen !== null) {
    srcName = screen;
   } else {
    srcName = "NoScreenFound";
   }
   return srcName;
};


const setCurrentActivity = (document) => {
  currentScreenContext = document;
  console.log("111111", "111111 ");
  if (isVoiceSessionActive) {
    console.log("setCurrentActivity","1");
    flushSpeech();
    ContextFinder.startScreenCommand();
  }
}


const initializeTTS = () => {
if (!('speechSynthesis' in window)) {
  alert('Text-to-Speech is not supported in this browser.');
  return;
}
window.speechSynthesis.onvoiceschanged = () => {
  selectDefaultVoice(); 
};

if (window.speechSynthesis.getVoices().length > 0) {
  selectDefaultVoice();
};

// const speakText = (text) => {
//   const utterance = new SpeechSynthesisUtterance(text);
//   utterance.lang = 'en-US'; // Set language, e.g., 'en-US' for English
//   window.speechSynthesis.speak(utterance);

//   utterance.pitch = 1;
//   utterance.rate = 1.2;
//   utterance.volume = 1;
//   utterance.onstart = () => {
//   console.log("Speech started");
 
// };

// utterance.onend = () => {
//  // console.log("Speech ended", utterance.text);
//  console.log("Speech ended");

// };

// utterance.onerror = (event) => {
//   console.error("Speech error", event.error);
//   };
// }
}

export const setIsVoiceSessionActive = (isVoiceSession) => {
  console.log("8888 ",  isVoiceSession);
  isVoiceSessionActive = isVoiceSession;
}

export const flushSpeech = () => {
  console.log("inside flushSpeech()", "flushSpeech()");
  if (isVoiceSessionActive) {
    FeedbackProcessor.stopSpeaking();
    FeedbackProcessor.flushSpeechOfFeedbackProcessor(AppConstants.VOICE_NONE, "");
  }
}

const flushFeedback = () => {
  console.log("31", "31");
  if (isVoiceSessionActive && !isListening) {
    //console.log("32", "32 " + VoiceEventProcessor.getCurrentProcess().on_interrupt_next);
    if (VoiceEventProcessor.getCurrentProcess().on_interrupt_next !== null) {
      console.log("33", "Interrupted feedback");
      //FeedbackProcessor.stopSound();
      FeedbackProcessor.stopSpeaking();
      VoiceEventProcessor.handleCommandByCommandId(VoiceEventProcessor.getCurrentProcess().on_interrupt_next);
    } else {
      console.log("34", "Interrupted feedback");
      //FeedbackProcessor.stopSound();
      const screenDetails = ContextFinder.getScreenDetails();
      var screenNumber = "";
      if (screenDetails && screenDetails.screen_number) {
        screenNumber = screenDetails.screen_number;
        console.log("screen name", screenNumber);
      }
      FeedbackProcessor.stopSpeaking();
      FeedbackProcessor.flushSpeechOfFeedbackProcessor(AppConstants.VOICE_REINPUT, "");
    }
  }
}

export const setRetryCountForNoScreenFound = (retryCount) => {
  retryCountForNoScreenFound = retryCount;
}

export const setScreenChanged = (screenChange) => {
  screenChanged = screenChange;
}

export const updateDocument = (document) => {
  console.log("updated document called");
  currentScreenContext = document;
}

export const getUpdatedDocument = () => {
  return currentScreenContext;
}

export const setRetryCountForFetchingData = (retryCountData) => {
  retryCountForFetchingData = retryCountData;
}

export const executeNextProcess = (action) => {
  ContextFinder.executeNext(action);
}

export const executeErrorNextProcess = (action) => {
  ContextFinder.executeErrorNext(action);
}

export const updateCurrentScreen = (document, action) => {
  console.log("data is as :", "data ");
  if (isVoiceSessionActive) {
    if (document) {
      currentScreenContext = document;
      executeNextProcess(action);
    } 
  }
}

export const stopVoiceSession = () => {
  if (isVoiceSessionActive) {
    //added recently for fast stop TTS
    stopListening();
    FeedbackProcessor.stopSpeaking();
    isVoiceSessionActive = false;
    FeedbackProcessor.speakToUser(ConstantString.going_silent, AppConstants.VOICE_END, false);
  }
}

export const setSessionCount = () => {
  var count = sessionStorage.getItem(ConstantString.session_count);
  count = count !== null ? Number(count) : -1;
  console.log("setSessionCount", count++);
  // Save data to Session Storage
  sessionStorage.setItem(ConstantString.session_count, count++);
}

export const getSessionCount = () => {
  // Retrieve data from Session Storage
  var savedCount = sessionStorage.getItem(ConstantString.session_count);
  console.log("getSessionCount", savedCount);
  return savedCount !== null ? Number(savedCount) : 0;
}

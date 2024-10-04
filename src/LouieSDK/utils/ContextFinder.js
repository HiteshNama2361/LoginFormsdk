import {isVoiceSessionActive, setIsVoiceSessionActive, flushSpeech, getCurrentScreen, checkMicPermission } from '../LouieSDK';
const CreateVoiceData = require("../res/CreateVoiceData");
const VoiceEventProcessor = require('../VoiceHandler/VoiceEventProcessor');
const AppConstants = require('../AppConstants');
const FeedbackProcessor = require('../FeedbackHandler/FeedbackProcessor');
const ConstantString = require('../res/ConstantString');

let isIdFound = false;
let uniqueId = "";

export const getScreenDetailsId = (document) => {
  if (!document || typeof document.querySelector !== 'function') {
    console.error('Invalid document object');
    return null;
  }

  let uniqueId = null;
  console.log("screenmap", CreateVoiceData.screenMap);
  console.log("document", document);
  // Iterate through each screen in the JSON data
  // for (let key in CreateVoiceData.screenMap.keys()) {
  //   console.log('Checking screen:', key);
  //   const keysArray = key.split(",").map(k => k.trim());
  //   const id = CreateVoiceData.screenMap.get(key);
  //   let allKeysFound = true;

  //    keysArray.forEach((singleKey, index) => {
  //     let idNew = id[index];
  //     let selector = "";

    
  //     switch (idNew) {
  //       case "id":
  //         selector = `#${singleKey}`;
  //         break;
  //       case "class":
  //         selector = `.${singleKey}`;
  //         break;
  //       case "button":
  //         selector = `button:contains("${singleKey}")`;
  //         break;
  //       case "text":
  //         selector = `input[type="text"][value="${singleKey}"]`;
  //         break;
  //       case "element":
  //         selector = singleKey;
  //         break;
  //       default:
  //         selector = `#${singleKey}`;
  //     }

  //     let element = document.querySelector(selector);
  //     console.log(`Trying selector: ${selector}`, element);
  //     if (!element) {
  //       allKeysFound = false;
  //     }
  //   });

    
  //   if (allKeysFound) {
  //     uniqueId = key;
  //     console.log("Matched Screen ID:", uniqueId);
  //     break;
  //   }
  // }
  // CreateVoiceData.screenMap.forEach((screenData, key) => {
  //   // Compare with IDs in the document
  //   const element = document.getElementById(key);
  //   console.log("element-1",element);
  //   if (element) {
  //     console.log("element-2",element);
  //     //return key;
  //     uniqueId = key;
  //     return uniqueId;
  //   } 
  // });
  // Compare with IDs in the document
  for (const [key, screenData] of CreateVoiceData.screenMap) {
    const element = document.getElementById(key);
    console.log("element-1",element);
    if (element) {
      console.log("element-2",element);
      // Perform further actions if needed
      uniqueId = key;
      break; // Exit the loop once an element is found
    }
  }
  return uniqueId;
};

export const getStringFromResource = (document) => {
  let idFound = getScreenDetailsId(document);
  console.log("ID found:", idFound);

  let text;
  if (idFound) {
    const screenDetails = CreateVoiceData.screenMap.get(idFound);
    console.log("Screen Details:", screenDetails);

    // Ensure primary_command exists in the screenDetails
    if (screenDetails && screenDetails.primary_command) {
      text = `Welcome to ${screenDetails.primary_command}`;
    } else {
      text = "Welcome to the screen";
    }
  } else {
    text = "No screen found, going silent";
  }
  return text;
};
export const checkPermissionAndStartPrimaryCommand = () => {
  console.log("checkPermissionAndStartPrimaryCommand","1");
  try {
    console.log("checkPermissionAndStartPrimaryCommand","2");
    startPrimaryCommand();
  } catch (err) {
    console.log("checkPermissionAndStartPrimaryCommand","3");
    FeedbackProcessor.speakToUser(ConstantString.encounter_problem_going_silent, AppConstants.VOICE_END, false);
  }
};

const startPrimaryCommand = () => {
  if (!isVoiceSessionActive) {
    const screenDetails = getScreenDetails();
    console.log("11.1", "Screen details" );

    const primaryCommand = screenDetails?.primary_command;
    console.log("18-1", primaryCommand);

    setIsVoiceSessionActive(true);
    // KeepAwake.activate();
    // if (screenDetails && screenDetails.screen_number !== 34) {
    //   LouieSdk.setNBMRValueEmpty();
    // }
    flushSpeech();
    VoiceEventProcessor.handleCommandWithDelay(primaryCommand, 600);
    
  }
};

export const getScreenDetails = () => {
  console.log("10", "10 " + getCurrentScreen());
  var currentScreen = CreateVoiceData.screenMap.get(getCurrentScreen());
  console.log("11", "11 " + currentScreen);
   if (currentScreen !== null && currentScreen !== undefined) {
    console.log("getScreenDetails()-1", "current screen name " + currentScreen.name);
      return currentScreen;
  } else {
    console.log("getScreenDetails()-2", "current screen name = No screen found");
      return CreateVoiceData.screenMap.get("NoScreenFound");
  }
}

export const startScreenCommand = () => {
  if (checkMicPermission()) {
    //console.log(TAG, "startScreenCommand()-> this function is called");
    if(isVoiceSessionActive) {
      //console.log(TAG, "isVoiceSessionActive = true");
      const currentProcess = CreateVoiceData?.processMap?.get(VoiceEventProcessor.tempProcess);
      // clearInterval(intervalForMoreThenFiveFundFeedback);
      //if (isListening) {
        console.log('ravindra testing-1', "isListening = true");
        //stopListening();
        //newcontroller.abort();
      //}
      //LouieSDK.flushSpeech();
      //FeedbackProcessor.stopSound(); 
      const screenDetails = getScreenDetails();
      //LouieSDK.screenType = screenDetails.screen_type;
      //console.log(TAG, "screenType " + screenDetails.screen_type);
      //LouieSDK.setScreenChanged(true);
      // CustomActionProcessor.clearScreenVariables();
      VoiceEventProcessor.setLastFeedback("");
      const primaryCommand = screenDetails?.primary_command;
      if (currentProcess && currentProcess.process_for_next_screen !== null) {
        console.log("11111111111","11");
        VoiceEventProcessor.handleCommandByCommandId(currentProcess.process_for_next_screen);
      } else {
        console.log("222222222","22");
        VoiceEventProcessor.handleCommandWithDelay(primaryCommand,100);
      }
    }
  } else {
    FeedbackProcessor.speakToUser(ConstantString.please_provide_micro_permission_manually, AppConstants.VOICE_END, false);
  }
}

export const isMatchWithCommand = (key, userInput) => {
  const userData = userInput.replace(",", "").replace("-", " ").toLowerCase().split(" ");
  //console.log("userDAta", userData);
  var commands = key.split(",");
  return commands.every(word => userData.includes(word));
  // console.log(key);
  // console.log(userInput);
  // console.log("inside isMatchWithCommand");
  //     let isFound = true;
  //     const userData = userInput.replace(/,/g, "").replace(/-/g, " ").toLowerCase().split(/\s+/); 
  //     console.log(userData);
  //     const commands = key.split(",");
  //     console.log(commands);
  //   for (let command of commands) {
  //         if (!userData.includes(command)) {
  //             isFound = false;
  //             break;
  //         }
  //   }

  //   return isFound;
};

export const getIntentFromUserInput = (results, keys) => {
  console.log("inside getIntentFromUserInput");
  var commandId = null;
  var isMatchFound = true;
  for (const key of keys) {
      if (!isMatchWithCommand(key, results)) {
        isMatchFound = false;
      } else {
        console.log("inside else getIntentFromUserInput");
        isMatchFound = true;
        if (isMatchFound) {
          console.log("inside getIntentFromUserInput",  + key);
          // commandId = getCommandFromKey(key);
          break;
        }
      }
  }
  //LogUtils.log("inside getIntentFromUserInput", "6 " + commandId);
  return commandId;
}



export const removeDuplicatesExactMatch = (inputList) => {
    const uniqueSet = new Set(inputList);
    return Array.from(uniqueSet)
}
export const voiceResultContainsKey3 = (results, key) => {
    let matched = false
    for (let result of results) {
        if (isMatchWithCommand(key, result)) {
            matched = true
            break
        }
    }
    return matched
}

export const findIntentFromAnswerMap = (voiceResult, answerMap) => {
   let commandId = null;
   // const answerKeys = Array.from(answerMap.keys());
    console.log("6", answerMap.keys());
      for (const key of answerMap.keys()) {
        //console.log("5", "key");
        //console.log("6", voiceResult);
  
        if(isMatchWithCommand(key,voiceResult)){
          commandId = answerMap.get(key).toString();
          break;
        }
      }
    //console.log("5678", commandId);
    return commandId;
}

export const executeNext = (action) => {
  var process = CreateVoiceData.processMap.get(action);
  console.log("action is :", action);
  if (process !== null && process !== undefined) {
    console.log("inside executeNext", "executeNext", process.next);
     VoiceEventProcessor.handleCommandByCommandId(process.next);
  }
}

export const executeErrorNext = (action) => {
  var process = CreateVoiceData.processMap.get(action);
  if (process !== null) {
    console.log("inside executeErrorNext", "executeErrorNext");
    VoiceEventProcessor.handleCommandByCommandId(process.error_next);
  }
}

export const executeSecondErrorNext = (action) => {
  var process = CreateVoiceData.processMap.get(action);
  if (process !== null) {
    VoiceEventProcessor.handleCommandByCommandId(process.second_error_next);
  }
}

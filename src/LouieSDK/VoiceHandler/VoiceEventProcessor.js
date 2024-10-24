import { VOICE_NONE, VOICE_REINPUT, VOICE_END, MAX_VOICE_ERROR_RETRY, MAX_RETRY_FOR_NO_SCREEN_FOUND, PAYEE_LIST_QUICK_READING} from '../AppConstants';
import { isListening } from "../VoiceHandler/WebSpeech";
import matchWordsJson from '../raw/app.json';
import ConstantString from "../res/ConstantString";
import {executeHandlerForPaste} from '../Interfaces/Callbacks'
const CustomActionProcessor = require('../VoiceHandler/CustomActionProcessor');
const LouieSDK = require('../LouieSDK');
const CustomVoiceFlags = require('../VoiceHandler/CustomVoiceFlags');
const ContextFinder = require('../utils/ContextFinder');
const GlobalCommandProcessor = require('../VoiceHandler/GlobalCommandProcessor');
const CreateVoiceData = require("../res/CreateVoiceData");
const WebSpeech = require('../VoiceHandler/WebSpeech');
const ResourseUtils = require('../utils/ResourceUtils');
const FeedbackProcessor = require('../FeedbackHandler/FeedbackProcessor');
const ViewParser = require('../Dataclasses/ViewParser');
const CustomUtils = require('../utils/CustomUtils');

let currentCommandId = null;
let previousCommandId = null;
let secondPreviousCommandId = null;
let thirdPreviousCommandId = null;
export let currentProcess = null;
export var tempProcess =  null;
export let previousProcess = null;
var process_flag = -1;
// let voiceResult = [];


export var voiceResult = "";
export var rawVoiceResult = "";
export var bankVoiceResult = "";
export var errorCount = 0;
export var lastFeedback = "";
export var secondLastFeedback = "";
export var thirdLastFeedback = "";
export let tempErrorCount = 0;
const TAG = "VoiceEventProcessor";

const monthMap = {
    "Jan": 1,
    "jan": 1,
    "john": 1,
    "January": 1,
    "january": 1,
    "1": 1,
    "Feb": 2,
    "feb": 2,
    "February": 2,
    "february": 2,
    "2": 2,
    "Mar": 3,
    "mar": 3,
    "March": 3,
    "march": 3,
    "3": 3,
    "Apr": 4,
    "apr": 4,
    "April": 4,
    "april": 4,
    "4": 4,
    "May": 5,
    "may": 5,
    "Mein": 5,
    "mein": 5,
    "main": 5,
    "Main": 5,
    "5": 5,
    "jun": 6,
    "Jun": 6,
    "june": 6,
    "June": 6,
    "6": 6,
    "jul": 7,
    "Jul": 7,
    "july": 7,
    "July": 7,
    "7": 7,
    "aug": 8,
    "Aug": 8,
    "august": 8,
    "August": 8,
    "8": 8,
    "sep": 9,
    "Sep": 9,
    "september": 9,
    "September": 9,
    "9": 9,
    "oct": 10,
    "Oct": 10,
    "october": 10,
    "October": 10,
    "10": 10,
    "nov": 11,
    "Nov": 11,
    "november": 11,
    "November": 11,
    "11": 11,
    "dec": 12,
    "Dec": 12,
    "december": 12,
    "December": 12,
    "12": 12
};

export const dayMap = {
    "first": 1,
    "first one": 1,
    "First": 1,
    "one": 1,
    "1": 1,
    "1st": 1,
    "select first": 1,
    "select first one": 1,
    "select First": 1,
    "select one": 1,
    "select 1": 1,
    "select 1st": 1,
    "select second": 2,
    "select secondly": 2,
    "select second one": 2,
    "select Second":2,
    "select two":2,
    "select do":2,
    "select 2nd":2,
    "select 2":2,
    "second": 2,
    "secondly": 2,
    "second one": 2,
    "Second":2,
    "two":2,
    "do":2,
    "2nd":2,
    "2":2,
    "third": 3,
    "third one": 3,
    "three":3,
    "3rd":3,
    "3":3,
    "Third":3,
    "select third": 3,
    "select third one": 3,
    "select three":3,
    "select 3rd":3,
    "select 3":3,
    "select Third":3,
    "fourth": 4,
    "fourth one": 4,
    "four":4,
    "for":4,
    "4":4,
    "Fourth":4,
    "4th":4,
    "fifth": 5,
    "fifth one": 5,
    "5th":5,
    "5":5,
    "five":5,
    "sixth": 6,
    "sixth one": 6,
    "6th":6,
    "6":6,
    "six":6,
    "seventh": 7,
    "7th":7,
    "7":7,
    "seven":7,
    "eighth": 8,
    "8th":8,
    "8":8,
    "eight":8,
    "ninth": 9,
    "9th":9,
    "9":9,
    "nine":9,
    "tenth": 10,
    "10th":10,
    "10":10,
    "ten":10,
    "eleventh": 11,
    "eleven": 11,
    "11th":11,
    "11":11,
    "twelth": 12,
    "12th":12,
    "12":12,
    "thirteenth": 13,
    "13th":13,
    "13":13,
    "fourteenth": 14,
    "14th":14,
    "14":14,
    "fifteenth": 15,
    "15th":15,
    "15":15,
    "sixteenth": 16,
    "16th":16,
    "16":16,
    "seventeenth": 17,
    "17th":17,
    "17":17,
    "eighteenth": 18,
    "18th":18,
    "18":18,
    "nineteenth": 19,
    "19th":19,
    "19":19,
    "twentieth": 20,
    "20th":20,
    "20":20,
    "twenty-first": 21,
    "21st":21,
    "21":21,
    "twenty-second": 22,
    "22nd":22,
    "22":22,
    "twenty-third": 23,
    "23rd":23,
    "23th":23,
    "23":23,
    "twenty-fourth": 24,
    "24th":24,
    "24":24,
    "twenty-fifth": 25,
    "25th":25,
    "25":25,
    "twenty-sixth": 26,
    "26th":26,
    "26":26,
    "twenty-seventh": 27,
    "27th":27,
    "27":27,
    "twenty-eighth": 28,
    "28th":28,
    "28":28,
    "twenty-ninth": 29,
    "29th":29,
    "29":29,
    "thirtieth": 30,
    "30th":30,
    "30":30,
    "thirty-first": 31,
    "31st":31,
    "31":31
};

export const dropdowns = {
    city: [
      'mumbai', 'delhi', 'bangalore', 'hyderabad', 'ahmedabad', 'chennai', 
      'kolkata', 'surat', 'pune', 'jaipur', 'lucknow', 'kanpur', 'nagpur', 
      'indore', 'thane', 'bhopal', 'visakhapatnam', 'pimpri-chinchwad', 
      'patna', 'vadodara', 'ghaziabad', 'ludhiana', 'agra', 'nashik', 
      'faridabad', 'meerut', 'rajkot', 'kalyan-dombivli', 'vijayawada', 
      'aurangabad', 'madurai', 'mysore', 'jammu', 'amritsar', 
      'jabalpur', 'kota', 'dehradun', 'rourkela', 'cuttack', 'trichy', 
      'salem', 'durgapur', 'siliguri', 'ranchi'
    ],
    state: [
      'andhra pradesh', 'arunachal pradesh', 'assam', 'bihar', 'chhattisgarh', 
      'goa', 'gujarat', 'haryana', 'himachal pradesh', 'jharkhand', 'karnataka', 
      'kerala', 'madhya pradesh', 'maharashtra', 'manipur', 'meghalaya', 
      'mizoram', 'nagaland', 'odisha', 'punjab', 'rajasthan', 'sikkim', 
      'tamil nadu', 'telangana', 'tripura', 'uttar pradesh', 'uttarakhand', 
      'west bengal'
    ],
    country: [
      'india', 'usa', 'uk', 'canada', 'australia', 'germany', 'france', 
      'italy', 'spain', 'china', 'japan', 'south korea', 'brazil', 
      'mexico', 'south africa', 'nigeria', 'argentina', 'colombia', 
      'chile', 'peru', 'sweden', 'norway', 'denmark', 'netherlands', 
      'belgium', 'switzerland', 'austria', 'new zealand', 'singapore', 
      'malaysia', 'thailand', 'philippines', 'indonesia', 'pakistan', 
      'bangladesh', 'nepal', 'sri lanka', 'uae', 'saudi arabia', 'qatar', 
      'kuwait', 'oman', 'bahrain'
    ]
};

export const onVoiceEvent = async (results) => {
    WebSpeech.setIsListening(false);
    console.log("onVoiceEvent -1", isListening);
    try {
       voiceResult = results;
       bankVoiceResult = voiceResult;
       const screenDetails = ContextFinder.getScreenDetails();
       if (voiceResult != null && voiceResult.length > 0) {
            tempErrorCount = errorCount;
            // errorCount = 0;
            // console.log("onVoiceEvent -2", "voiceResult before parsing " +voiceResult);
            // TODO - uncomment later
            // const newResult = ViewParser.parseUserInput(voiceResult, false) 
            //     console.log(TAG, "voiceResult after parsing = $newResult");
            //         if (newResult) {
            //             voiceResult.clear();
            //             for (let i = 0; i < newResult.indices.length;i++) {
            //                 voiceResult.add(newResult[i]);
            //             }
            //             //voiceResult.add(newResult)
            //         }
            if (voiceResultContainsAnyKey("shut_up")) {
                console.log("onVoiceEvent -3", "SDK_SILENT_FLOW-Going Silent");
                FeedbackProcessor.speakToUser(ConstantString.okay_going_silent,VOICE_END, false);
            } else if (voiceResultContainsAnyKey("go_to_home")) {
                const screenDetails = ContextFinder.getScreenDetails();
                console.log("inside go to home screen_num -  ",screenDetails.screen_number);
                window.location.replace('/');
            } else if (voiceResultContainsAnyKey("go_back")) {
                console.log("onVoiceEvent -4", "SDK_GO_BACK_FLOW- Going back");
                window.history.back();
            } else if (voiceResultContainsAnyKey("talk_fast")) {
                console.log("onVoiceEvent -5", "SDK_IN_TALK_FAST_FLOW-talk fast");
                //await ResourseUtils.increaseSpeechRate();
                voiceResult = "";
                console.log("Current Process", currentProcess);
                handleCommandByCommandId(currentProcess);
            } else if (voiceResultContainsAnyKey("talk_slow")) {
                console.log("onVoiceEvent -6", "SDK_IN_TALK_SLOW_FLOW-talk slow");
                //await ResourseUtils.decreaseSpeechRate();
                voiceResult = "";
                console.log("Current Process", currentProcess);
                handleCommandByCommandId(currentProcess);
            } else if (voiceResultContainsAnyKey("change_voice")) {
                //var currentVoice = await LouieSdk.getCurrentVoiceAsyncStorage();
                //console.log("Current voice used by TTS 1234###12", currentVoice);
                console.log("onVoiceEvent -7", "SDK_IN_CHANGE_VOICE-change voice");
                //ResourseUtils.changeTTS();
            } else if (voiceResultContainsAnyKey("increase_pitch")) {
                //  not required
                console.log("onVoiceEvent -8", "SDK_IN_INCREASE_PITCH");
                FeedbackProcessor.speakToUser(ConstantString.this_feature_is_not_available_going_silent, VOICE_END, false);
            } else if (voiceResultContainsAnyKey("decrease_pitch")) {
                //  not required
                console.log("onVoiceEvent -9", "SDK_IN_DECREASE_PITCH");
                FeedbackProcessor.speakToUser(ConstantString.this_feature_is_not_available_going_silent, VOICE_END, false);
            } else if (voiceResultContainsAnyKey("change_tts")) {
                //ResourseUtils.changeTTS();
                // TODO- add handleCommandByCommandByID 
            } else if (voiceResultContainsAnyKey("change_speed")) {
                FeedbackProcessor.speakToUser(ConstantString.please_confirm_talk_fast_or_slow, VOICE_REINPUT, false );
            } else if (voiceResultContainsAnyKey("help_commands")) {
                const screenDetails = ContextFinder.getScreenDetails();
                FeedbackProcessor.speakToUser(screenDetails.help_commands,VOICE_REINPUT,true);
            } else if (voiceResultContainsAnyKey("repeat")) {
                var feedback = FeedbackProcessor.getLastFeedback();
                console.log("last feedback on repeat command --",feedback);
                FeedbackProcessor.speakToUser(feedback, VOICE_REINPUT, false);
            }
             else {
                console.log("onVoiceEvent- 11", "11");
                // if (getCurrentProcess() !== null && getCurrentProcess().is_question === true) {
                //    console.log("onVoiceEvent- 12", "12");
                //    handleQuestionAnswer(voiceResult);
                // }
                // } else {
                //    console.log("onVoiceEvent- 13", "13");
                //    handleCommandByPhrase(voiceResult);
                // }
                GlobalCommandProcessor.handleProcess(voiceResult);
            }
        } else {
            console.log("onVoiceEvent", "No input given or voiceResult is null/empty");
            // console.log("yha kyu fata",voiceResult,voiceResult.length);
            handleVoiceError();
        }
    } catch (err) {
        console.log("inside catch block of onVoiceEvent", err);
        FeedbackProcessor.speakToUser(ConstantString.encounter_problem_going_silent, VOICE_END, false);
    }
}
  
export const onVoiceError = (errorFeedback) => {
    console.log(TAG, errorFeedback + "  " + typeof errorFeedback);
    WebSpeech.setIsListening(false);
    //  if (stopSpeechRecognizer) {
    //    stopSpeechRecognizer = false;
    //    return;
    //  }
    handleVoiceError(errorFeedback);
}
 
export const onStart = (utteranceID) => {
   if (utteranceID != null) {
        console.log(TAG,utteranceID);
   }
}

export const onError = (utteranceID) => {
    if (utteranceID !== null) {
        console.log(TAG, "onError() " + utteranceID);
    }
  
}
  
const onStop = (utteranceID) => {
    if (utteranceID !== null) {
        console.log("inside onStop ", utteranceID);
    }
}

export const onDone = (utteranceID) => {
    var utteranceIdentifier = utteranceID;
    try {
      console.log("OnDone ", utteranceIdentifier);
      if (utteranceIdentifier === VOICE_REINPUT) {
        WebSpeech.startListening();
        console.log("OnDone ", "1");
      } else if (utteranceIdentifier === VOICE_END) {
        console.log("OnDone ", "2");
        // if (timeoutId !== null) {
        //   clearTimeout(timeoutId);
        // }
        setTimeout(notifyVoiceProcessingDone, 10);
      } else if (utteranceIdentifier === PAYEE_LIST_QUICK_READING) {
        // if (timeoutId !== null) {
        //     clearTimeout(timeoutId);
        //   }
          setTimeout(() => {
            handleCommandByCommandId(currentProcess.toString());
          }, 500);
      }
     } catch (err) {
      console.log("OnDone Exception ",err);
      FeedbackProcessor.speakToUser(ConstantString.encounter_problem_going_silent, VOICE_END, false);
    }
}

//   export const voiceResultContainsAnyKey = (matchWord) => {
//     if (JsonData.matchWords.get(matchWord) != null ) {
//       const matchWordsKeys = JsonData.matchWords.get(matchWord);
//       for ( let i = 0; i < matchWordsKeys.length; i++) {
//         if (ContextFinder.isMatchWithCommand(matchWordsKeys[i], voiceResult)) {
//           return true;
//         }
//       }
//     }
//     return false;
//   }

export const handleCommandByCommandId = (commandId) => {
    console.log("inside handleCommandByCommandId-1", commandId);
    if (!LouieSDK.isVoiceSessionActive) {
        console.log("inside handleCommandByCommandId-2", commandId);
        return;
    } else if (WebSpeech.isListening) {
        console.log("inside handleCommandByCommandId-3", commandId);
        return;
    } else {
        errorCount = 0;
        try {
            console.log("inside handleCommandByCommandId-4", commandId);
            const process = CreateVoiceData?.processMap?.get(commandId);
            if (process) {
                console.log(process);
                previousProcess = currentProcess;
                currentProcess = commandId;
                tempProcess = commandId;
                if (process.process_flag !== null && process.process_flag !== undefined && process.process_flag > -1) {
                    console.log("inside handleCommandByCommandId", "5");
                    process_flag = process.process_flag;
                }
                if (process && process.allow_fast_command) {
                    console.log("inside allow_fast_command","5.1");
                    //uncomment later
                    //setFastCommandFundDetails(true);
                }
                if (process.reset_flag) {
                    console.log("inside handleCommandByCommandId", "6");
                    process_flag = -1;
                }
                if (process.is_custom_action) {
                    console.log("inside handleCommandByCommandId", "7");
                    if (process.spoken_feedback) {
                        console.log("inside handleCommandByCommandId", "8");
                        FeedbackProcessor.speakToUser(process.spoken_feedback,VOICE_NONE, true);
                    }
                    console.log("inside else check to call handleCommandByCommandID", "9");
                    CustomActionProcessor.handleProcess(process, commandId, LouieSDK.currentScreenContext);
                } else if (process.is_question) {
                    if (process.custom_feedback) {
                        console.log("Speak to user = process.custom_feedback");
                        FeedbackProcessor.speakToUser(getCustomFeedback(),VOICE_REINPUT, true);
                    } else if (process.spoken_feedback) {
                        const previousScreen = LouieSDK.getPreviousScreen();
                        console.log("previous screen", previousScreen);
                        if (previousScreen && previousScreen === "account-card" && process.action_intent ===  "process_dashboard_bank_transfer_check_balance") {
                            console.log("screen-1", "1");
                            var welcomeFeedback = ConstantString.what_would_u_like_to_do_transfer_money_or_check_account_balance;
                            FeedbackProcessor.speakToUser(welcomeFeedback, VOICE_REINPUT, false);
                        } else if (previousScreen === "" && process.action_intent ===  "process_dashboard_bank_transfer_check_balance") {
                            console.log("screen-1", "2");
                            var sessionCount = LouieSDK.getSessionCount();
                            console.log("session count", sessionCount);
                            var welcomeFeedback = "";
                            if (sessionCount < 7) {
                                welcomeFeedback = ConstantString.welcome_feedbacks[sessionCount];
                            } else {
                                welcomeFeedback = ConstantString.welcome_feedbacks[6];
                            }
                            FeedbackProcessor.speakToUser(welcomeFeedback, VOICE_REINPUT, false);
                        } else {
                            console.log("Speak to user = process.spoken_feedback");
                            FeedbackProcessor.speakToUser(process.spoken_feedback, VOICE_REINPUT, false);
                        }
                    }
                    return;
                }else if (process.action_id === CustomVoiceFlags.PROCESS_HANDLE_DROPDOWN_FIELD ) {
                    console.log("inside handleCommandByCommandId", "19 ");
                    // const dropdownBtn = document.getElementById('cityDropdownBtn');
                    // if (dropdownBtn) {
                    //     dropdownBtn.click();  // Trigger the custom dropdown click event
                    // }
                    FeedbackProcessor.speakToUser(process.spoken_feedback, VOICE_NONE, false);
                    return;
                }else if (process.action_id === CustomVoiceFlags.PROCESS_SET_FIELDS_EMPTY ) {
                    console.log("inside handleCommandByCommandId", "1919 ");
                    executeHandlerForPaste(process.action_intent, "submit", "submit").then((feedback) => {
                        console.log("123", feedback); // This will log "Event successfully fired"
                        //handleCommandByCommandId(process.next);
                    })
                    .catch((errorMessage) => {
                        //  console.log("33.3", errorMessage); 
                        handleCommandByCommandId(process.error_next); // This will log any error message
                    });
                    FeedbackProcessor.speakToUser(process.spoken_feedback, VOICE_END, false);
                }else if (process.action_id === CustomVoiceFlags.ENCOUNTERED_PROBLEM_GOING_SILENT ) {
                    console.log("inside handleCommandByCommandId", "19 ");
                    FeedbackProcessor.speakToUser(ConstantString.encounter_problem_going_silent, VOICE_END, false);
                } else if (process.action_id === CustomVoiceFlags.PERFORM_GO_BACK ) {
                    console.log("inside handleCommandByCommandId", "20 ");
                    window.close();
                } else if (process.action_id === CustomVoiceFlags.PERFORM_GO_BACK_HOME) {
                    console.log("inside handleCommandByCommandId", "22 " + process);
                    window.location.replace('/');
                    return;
                } else if (process.action_id === CustomVoiceFlags.PROCESS_NO_SCREEN_FOUND) {
                    console.log("inside handleCommandByCommandId", "23 " + process);
                    FeedbackProcessor.speakToUser(ConstantString.no_screen_found_going_silent,VOICE_END, false);
                    return;
                } else if (process.action_id === CustomVoiceFlags.PROCESS_CHECK_FOR__NO_SCREEN_FOUND) {
                    console.log("inside handleCommandByCommandId", "24 " + process);
                    if (LouieSDK.retryCountForNoScreenFound < MAX_RETRY_FOR_NO_SCREEN_FOUND) {
                        console.log("inside handleCommandByCommandId", "25 " + process);
                        setTimeout(() => {
                        LouieSDK.setRetryCountForNoScreenFound(LouieSDK.retryCountForNoScreenFound + 1);
                        LouieSDK.setCurrentScreenDetails(LouieSDK.getCurrentActivity(), LouieSDK.listContext, null);
                      }, 500);
                    } else {
                        // LogUtils.log("inside handleCommandByCommandId", "26 " + process);
                        LouieSDK.setRetryCountForNoScreenFound(0);
                        handleCommandByCommandId(process.next);
                    }
                    return;
                } else if (process.action_id === CustomVoiceFlags.PROCESS_GOING_SILENT) {
                    console.log("inside handleCommandByCommandId", "27 " + process);
                    FeedbackProcessor.speakToUser(ConstantString.going_silent_for_now,VOICE_END, false);
                    return;
                } else if (process.action_id === CustomVoiceFlags.PROCESS_START_PRIMARY_COMMAND) {
                    console.log("inside handleCommandByCommandId", "28 " + process);
                    var primaryCommandId = ContextFinder.getScreenDetails()?.primary_command;
                    handleCommandByCommandId(primaryCommandId.toString());
                } else if (process.action_id === CustomVoiceFlags.PROCESS_SPEAK_SPOKEN_FEEDBACK_AND_SHUT_DOWN) {
                    console.log("inside handleCommandByCommandId", "29 " + process);
                    FeedbackProcessor.speakToUser(process.spoken_feedback,VOICE_END, false);
                    return;
                } else if (process.action_id === CustomVoiceFlags.PROCESS_SPEAK_SPOKEN_FEEDBACK_AND_RUN_NEXT) {
                    console.log("inside handleCommandByCommandId", "29.1 ");
                    FeedbackProcessor.speakToUser(process.spoken_feedback, VOICE_NONE, false);
                    handleCommandWithDelay(process.next, process.delay_to_next);
                    return;
                } else if (process.action_id === CustomVoiceFlags.PROCESS_SELECT_RADIO_BUTTON) {
                    executeHandlerForPaste(process.action_intent, process.node_to_process,process.node_to_process).then((feedback) => {
                        console.log("123", feedback); // This will log "Event successfully fired"
                        //handleCommandByCommandId(process.next);
                    })
                    .catch((errorMessage) => {
                        //  console.log("33.3", errorMessage); 
                        handleCommandByCommandId(process.error_next); // This will log any error message
                    }); 
                    if (process.next !== null) {
                        console.log("inside VEP 34");
                        handleCommandByCommandId(process.next); 
                    }
                } else if (process.action_id === CustomVoiceFlags.PROCESS_CHECK_CHECKBOX) {
                    
                } else if (process.action_id === CustomVoiceFlags.PROCESS_CLICK_BUTTON) {
                    let context = LouieSDK.getCurrentActivity();
                    console.log("inside handleCommandByCommandId-30", context);
                    if (context && process.node_to_process !== null && process.node_value_type === 'id') {
                        console.log("inside handleCommandByCommandId", "31 " + process.node_to_process);
                        let clickableNode = null;
                        try {
                            clickableNode = context.getElementById(process.node_to_process);                   
                            if (clickableNode && clickableNode.onclick !== null) {
                                console.log("inside VEP 32", clickableNode);
                                clickableNode.click();
                                if (process.spoken_feedback !== null) {
                                    console.log("inside VEP 33", clickableNode);
                                    FeedbackProcessor.speakToUser(process.spoken_feedback, VOICE_NONE, false);
                                }
                                if (process.next !== null) {
                                    console.log("inside VEP 34", clickableNode);
                                    handleCommandWithDelay(process.next, process.delay_to_next); 
                                }
                            } else {
                                FeedbackProcessor.speakToUser(ConstantString.encounter_problem_going_silent, VOICE_END, false);
                            }
                        } catch (err) {
                            console.log("Exception while click ", err);
                        }
                        //FeedbackProcessor.flushSpeechOfFeedbackProcessor(VOICE_NONE," ");
                        console.log("inside VEP handleCommandByCommandId 35", "35");
                    } else {
                        console.log("inside handleCommandByCommandId", "32 " + process);
                        if (process.error_next !== null) {
                            console.log("inside handleCommandByCommandId", "33 " + process);
                            handleCommandByCommandId(process.error_next);
                        } else {
                            console.log(TAG, "node_to_process is null and error_next is also null");
                            FeedbackProcessor.speakToUser(ConstantString.encounter_problem_going_silent, VOICE_END, false);
                        }
                    }
                    return;
                }
                if (process.spoken_feedback) {
                    if (process.next) {
                        FeedbackProcessor.speakToUser(process.spoken_feedback);
                        handleCommandByCommandId(process.next);
                    } else if (process.stop_voice) {
                        FeedbackProcessor.speakToUser(process.spoken_feedback);
                    } else {
                        FeedbackProcessor.speakToUser(process.spoken_feedback);
                    }
                }      
            }
        } catch (err) {
            console.error(`Error handling command ID = ${err}`);
            FeedbackProcessor.speakToUser("Encountered a problem.");
        }
    }
};

export const handleCommandWithDelay = (process,delay) => {
    setTimeout(() => {
      handleCommandByCommandId(process);
    }, delay);
}

// need to add body code later when required
export const voiceResultContainsAnyKey = (matchWord) => {
    if (CreateVoiceData.matchWords.get(matchWord) != null ) {
      const matchWordsKeys = CreateVoiceData.matchWords.get(matchWord);
      //console.log("go back", matchWordsKeys);
      for ( let i = 0; i < matchWordsKeys.length; i++) {
        if (ContextFinder.isMatchWithCommand(matchWordsKeys[i], voiceResult)) {
          return true;
        }
      }
    }
    return false;
}

function removeRupees(input) {
    // Check if the input contains "rupees"
    // if (input.includes("rupees")) {
    //   // Remove "rupees" and any surrounding whitespace
    //   input = input.replace("rupees", "").trim();
    // }
    if (input.includes(",")) {
      input = input.replace(",","").trim();
    }
    // if (input.includes("minus")) {
    //   input = input.replace("minus","").trim();
    // }
    if (voiceResultContainsAnyKey("rupees")) {
      // console.log("499", input);
      const pattern = /\b(rupees?|thousand?|plus?|minus?|rupee?|lac?|amount?|rs|is)\b/gi;
      input = input.replace(pattern,'').trim();
    }
    return input;
}
  
export const isNumber = (variable) => {
    return typeof variable === 'number' && !isNaN(variable);
}
  
export const handleVoiceError = (feedback) => {
    console.log(TAG, "voice error in handleVoiceError " + errorCount, "process check", currentProcess); 
    console.log("inside this check :", MAX_VOICE_ERROR_RETRY);
    if (LouieSDK.isVoiceSessionActive) { 
       errorCount++;
       console.log("10","10 " + errorCount);
       if (errorCount < MAX_VOICE_ERROR_RETRY) {
            console.log("11","11");
            const process = CreateVoiceData.processMap.get(currentProcess);
            console.log("11","currentProcess");
            // TODO add if condition later here
            if (feedback && feedback.toString() !== null && (feedback.toString() === ConstantString.axios_error_code_504 || feedback.toString() === "Network Error" || feedback.toString() === "cancel axios post request after 3 seconds" || feedback.toString() === "canceled" || feedback.toString() === "Request failed with status code 502" || feedback.toString() === "timeout of 3000ms exceeded" || feedback.toString() === "Request failed with status code 504")) {
               ResourseUtils.noInternetError();
            } else if (errorCount >= 1 && errorCount <= 2) {
                if(process.is_question){
                    if (process !== null && process.help_command !== null && (errorCount === 1)) {
                        FeedbackProcessor.speakToUser(process.help_command,VOICE_REINPUT,false);
                    } else {
                        FeedbackProcessor.speakToUser(process.help_command_alternate,VOICE_REINPUT,false);
                    }
                } else{
                    if (process !== null && process.help_command !== null && (errorCount === 1)) {
                        FeedbackProcessor.speakToUser(process.help_command,VOICE_NONE,false);
                    } else {
                        FeedbackProcessor.speakToUser(process.help_command_alternate,VOICE_NONE,false);
                    }
                }
            } else {   
                console.log("13","13");
                FeedbackProcessor.speakToUser(ConstantString.sorry_i_did_not_get_you_going_silent, VOICE_END, false);
            }
            console.log("19","19");   
        } else {
            console.log("20","20");
            FeedbackProcessor.speakToUser(ConstantString.sorry_i_did_not_get_you_going_silent, VOICE_END, false);
        }
    }
}

const getCustomFeedback = (feedback) => {
    return ((feedback.length > 1) ?
      feedback[((Math.random() * ((feedback.length - 1) - 0 + 1) + 0).toInt())] : feedback[0]);
}

export const getCurrentProcess = () => {
    return CreateVoiceData?.processMap.get(currentProcess);
}
  
export const getPreviousProcess = () => {
    return CreateVoiceData?.processMap.get(previousProcess);
}

export const setCurrentProcess = (process) => {
    currentProcess = process;
}

export const setPreviousProcess = (process) => {
    previousProcess = process;
}

export const setErrorCount = (count) => {
    errorCount = count;
}
  
export const getErrorCount = () => {
    console.log("inside getErrorCount", errorCount);
    return errorCount;
}
  
export const setLastFeedback = (feedback) => {
    lastFeedback = feedback;
}
  
export const setSecondLastFeedback = (feedback) => {
    secondLastFeedback = feedback;
}
  
export const getSecondLastFeedback = () => {
   return secondLastFeedback;
}
  
export const setThirdLastFeedback = (feedback) => {
    thirdLastFeedback = feedback;
}
  
export const getThirdLastFeedback = () => {
   return thirdLastFeedback;
}


export const setRawVoiceResult = (result) => {
    rawVoiceResult = result;
}

const notifyVoiceProcessingDone = () => {
    // add code as per client app in this function
    console.log("inside notifyVoiceProcessingDone", " make louie silent");
    if (isListening) {
      WebSpeech.stopListening();
    }
    setCurrentProcess(null);
    setPreviousProcess(null);
    WebSpeech.setIsListening(false);
    errorCount = 0;
    // add here tts stop code
    //TextToSpeechEngine.stop();
    FeedbackProcessor.setLastFeedback("");
    setSecondLastFeedback("");
    setThirdLastFeedback("");
    setLastFeedback("");
    LouieSDK.setIsVoiceSessionActive(false);
    // setRecordings(null);
    voiceResult = "";
    rawVoiceResult = "";
    setErrorCount(0);
    FeedbackProcessor.stopSpeaking();
    LouieSDK.setRetryCountForNoScreenFound(0);
    LouieSDK.setCurrentScreen("");
    // executeHandlerForSilent().then((feedback) => {
    //  // console.log("33.2", feedback); // This will log "Event successfully fired"
    // });    
}
  
export const handleQuestionAnswer = (voiceResult) => {
    console.log("inside handleQuestionAnswer_1");
    var process = CreateVoiceData.processMap.get(currentProcess);
    let answerArray;
    const answerMap = new Map();
    if (process.answers) {
      answerArray = process.answers;
      answerArray.forEach(pair => {
      const [key, value] = pair.split("-");
      answerMap.set(key, value);
      });
    }

    if (voiceResult !== undefined && voiceResult !== null) {
        if (voiceResultContainsAnyKey("negative_words")) {
           //  colsole.log(TAG, "previous process=");
            handleCommandByCommandId("process_negative_word_confirmation");
            return;
        }
    }
    const actionIntent = ContextFinder.findIntentFromAnswerMap(voiceResult, answerMap);

    if (actionIntent) {
        console.log(`SDK_ANSWER_FOUND = ${actionIntent}`);
        handleCommandByCommandId(actionIntent);
    } else if (currentProcess?.exact_key_match === false) {
        console.log("SDK_HANDLE_PHRASE in HQA")
        handleCommandByPhrase(voiceResult);
    }
    else {
        console.log("No matching intent found");
        handleCommandByPhrase(voiceResult);
    }
};

export const setFieldVoiceResults = async (field,value,flag) => {
      console.log("inside set field voice resuls");
      const process = CreateVoiceData.processMap.get(currentProcess);
      var result=value;
      result=result.toLowerCase();
      var flag1=false;
      if(field === 'name'){
        result = result.toLowerCase();
        result = result?.replace(/,/g,' ');
        result = result?.replace(/-/g,' ');
        result = result.charAt(0).toUpperCase() + result.slice(1);
        FeedbackProcessor.speakToUser("okay "+result, VOICE_NONE, false);
      }else if(field === 'phone'){
        const phoneRegex = /^(\+\d{1,3}[- ]?)?\d{10}$/;
        // let result = "one two double two triple five";
        // Define replacements for numbers and patterns
        const replacements = {
        "\\bone\\b": "1",
        "\\btwo\\b": "2",
        "\\bthree\\b": "3",
        "\\bfour\\b": "4",
        "\\bfive\\b": "5",
        "\\bsix\\b": "6",
        "\\bseven\\b": "7",
        "\\beight\\b": "8",
        "\\bnine\\b": "9",
        "\\bzero\\b": "0",
        "\\bdouble (\\w+)\\b": (match, p1) => p1 + p1, // Matches "double <number word>"
        "\\btriple (\\w+)\\b": (match, p1) => p1 + p1 + p1 // Matches "triple <number word>"
        };
        // Apply each replacement using regular expressions
        console.log("before replacement of one with 1 etc",result);
        for (const [pattern, replacement] of Object.entries(replacements)) {
        result = result.replace(new RegExp(pattern, "gi"), replacement);
        }
        result = result?.replace(/ /g, '');
        result = result?.replace(/-/g,'');
        console.log("after replacement of one with 1 etc",result); // Outputs: "1 2 22 555"
        if(phoneRegex.test(result) === false){
            flag1=true;
        }else{
            var phone = result;
            phone = phone.split("").join(" ");
            FeedbackProcessor.speakToUser("Got it "+ phone, VOICE_NONE, false);
        }
      }else if(field === 'pin_code'){
        const pinRegex = /^(\+\d{1,3}[- ]?)?\d{6}$/;
        // let result = "one two double two triple five";
        // Define replacements for numbers and patterns
        const replacements = {
        "\\bone\\b": "1",
        "\\btwo\\b": "2",
        "\\bthree\\b": "3",
        "\\bfour\\b": "4",
        "\\bfive\\b": "5",
        "\\bsix\\b": "6",
        "\\bseven\\b": "7",
        "\\beight\\b": "8",
        "\\bnine\\b": "9",
        "\\bzero\\b": "0",
        "\\bdouble (\\w+)\\b": (match, p1) => p1 + p1, // Matches "double <number word>"
        "\\btriple (\\w+)\\b": (match, p1) => p1 + p1 + p1 // Matches "triple <number word>"
        };
        // Apply each replacement using regular expressions
        console.log("before replacement of one with 1 etc",result);
        for (const [pattern, replacement] of Object.entries(replacements)) {
        result = result.replace(new RegExp(pattern, "gi"), replacement);
        }
        result = result?.replace(/ /g, '');
        console.log("after replacement of one with 1 etc",result); // Outputs: "1 2 22 555"
        if(pinRegex.test(result) === false){
           flag1=true;
        }else{
            var pin = result;
            pin = pin.split("").join(" ");
            FeedbackProcessor.speakToUser("Alright "+ pin, VOICE_NONE, false);
        }
      }else if(field === 'email'){
        result = CustomUtils.getEmailIdFromVoiceResult(result);
        if(!result){
            flag1=true;
        }else{
            result = result?.replace(/ /g, '');
            var email = result;
            FeedbackProcessor.speakToUser("your email id is "+ email, VOICE_NONE, false);
        }
      }else if(field === 'date_of_birth'){
        console.log("handling date of birth format");
        console.log("date of birth in dob filter raw dob",result);
        // console.log("view ", view);
        var dateString = result;
        result='-';
        const dateFormats = [
            /^\d{1,2}[-/]\d{1,2}[-/]\d{4}$/,           // e.g., 23/06/2001 or 23-06-2001
            /^\d{1,2}(st|nd|rd|th)? \w+ \d{4}$/,       // e.g., 23rd June 2001 or 23 June 2001
            /^\w+ \d{1,2}(st|nd|rd|th)? \d{4}$/,       // e.g., June 23rd 2001 or June 23 2001
            /^\w+ of \w+ \d{4}$/,                      // e.g., "first of June 2023" or "second of May 2002"
            /^\d{1,2} \d{1,2} \d{4}$/                  // e.g., "2 12 2002"
        ];
        const monthsMap = {
            "Jan": "January",
            "jan": "January",
            "gen": "January",
            "john": "January",
            "January": "January",
            "january": "January",
            "Feb": "February",
            "feb": "February",
            "February": "February",
            "february": "February",
            "Mar": "March",
            "mar": "March",
            "March": "March",
            "march": "March",
            "Apr": "April",
            "apr": "April",
            "April": "April",
            "april": "April",
            "May": "May",
            "may": "May",
            "Mein": "May",
            "mein": "May",
            "main": "May",
            "Main": "May",
            "Jun": "June",
            "jun": "June",
            "June": "June",
            "june": "June",
            "Jul": "July",
            "jul": "July",
            "July": "July",
            "july": "July",
            "Aug": "August",
            "aug": "August",
            "August": "August",
            "august": "August",
            "Sep": "September",
            "sep": "September",
            "September": "September",
            "september": "September",
            "Oct": "October",
            "oct": "October",
            "October": "October",
            "october": "October",
            "Nov": "November",
            "nov": "November",
            "November": "November",
            "november": "November",
            "Dec": "December",
            "dec": "December",
            "December": "December",
            "december": "December"
        };
        
        const ordinalToNumber = {
            first: '1', second: '2', third: '3', fourth: '4', fifth: '5',
            sixth: '6', seventh: '7', eighth: '8', ninth: '9', tenth: '10',
            eleventh: '11', twelfth: '12', thirteenth: '13', fourteenth: '14',
            fifteenth: '15', sixteenth: '16', seventeenth: '17', eighteenth: '18',
            nineteenth: '19', twentieth: '20', 'twenty-first': '21', 'twenty-second': '22',
            'twenty-third': '23', 'twenty-fourth': '24', 'twenty-fifth': '25',
            'twenty-sixth': '26', 'twenty-seventh': '27', 'twenty-eighth': '28',
            'twenty-ninth': '29', thirtieth: '30', 'thirty-first': '31'
        };
        function replaceWithMap(dateString, map) {
            const regex = new RegExp(`\\b(${Object.keys(map).join('|')})\\b`, 'gi');
            return dateString.replace(regex, (match) => map[match]);
        }
        dateString = replaceWithMap(dateString, dayMap);
        dateString = replaceWithMap(dateString, monthsMap);
        console.log("date after daymap",dateString);
        // // Replace month names with numbers
        // cleanedDateString = replaceWithMap(cleanedDateString, monthMap);
        // dateString = cleanedDateString;
        // Parse date in various formats
        for (const format of dateFormats) {
            if (format.test(dateString)) {
                let date;
                // Handle dd-mm-yyyy or dd/mm/yyyy formats
                if (dateString.includes('-') || dateString.includes('/')) {
                    const [day, month, year] = dateString.split(/[-/]/);
                    date = new Date(`${year}-${month}-${day.replace(/(st|nd|rd|th)$/i, '')}`);
                } else {
                    // Replace ordinal words with numbers (e.g., "first" -> "1")
                    let cleanedDateString = dateString
                        .replace(/\b(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth|eleventh|twelfth|thirteenth|fourteenth|fifteenth|sixteenth|seventeenth|eighteenth|nineteenth|twentieth|twenty-first|twenty-second|twenty-third|twenty-fourth|twenty-fifth|twenty-sixth|twenty-seventh|twenty-eighth|twenty-ninth|thirtieth|thirty-first)\b/gi, 
                            match => ordinalToNumber[match])
                        .replace(/(\d{1,2})(st|nd|rd|th)/gi, '$1') // Remove suffixes
                        .replace(/of /g, '')                      // Remove "of"
                        .replace(/\s+/g, ' ')                     // Normalize spaces
                        .trim();
                    cleanedDateString = cleanedDateString.replace(/\b\w+/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

                        // Add comma between day and year for correct parsing
                    cleanedDateString = cleanedDateString.replace(/(\d{1,2}) (\d{4})/, '$1, $2');
                    date = new Date(cleanedDateString);
                }
                
                if (!isNaN(date)) {
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    result = `${year}-${month}-${day}`;
                    break;
                }
            }
        }
        if(result==='-'){
            flag1=true;
            // FeedbackProcessor.speakToUser(ConstantString.encounter_problem_going_silent, VOICE_END, false);
        }else{
            var dob = result;
            FeedbackProcessor.speakToUser("Understood! "+ dob, VOICE_NONE, false);
        }
        console.log("result ", result);
      }else if(field === 'gender'){
        result = result?.replace(/ /g, '');
        result = result?.replace(/,/g,'');
        result = result?.replace(/-/g,'');
        let gender = "unknown";  // Default value
        // Check for "female"
        for (let femaleWord of matchWordsJson.match_words.female) {
            if (result.includes(femaleWord)) {
            gender = "female";
            break;
            }
        }
        if (gender === "unknown") {
            for (let maleWord of matchWordsJson.match_words.male) {
                if (result.includes(maleWord)) {
                    gender = "male";
                    break;
                }
            }
        }
        // If neither "male" nor "female" found, check for "other"
        if (gender === "unknown") {
            for (let other of matchWordsJson.match_words.other) {
                if (result.includes(other)) {
                    gender = "other";
                    break;
                }
            }
        }
        if(gender === "unknown"){
            flag1=true;
        }else{
            result = gender;
        }
      }else if(field === 'city'){
        result = result?.replace(/ /g, '');
        if(!dropdowns.city.includes(result)){
           flag1=true; 
        }
      }else if(field === 'education'){
        const resultArray = [];
        // Normalize the input string (convert to lowercase and replace special characters)
        const normalizedStr = result.toLowerCase().replace(/[,/&]/g, ' ');
        const matchWords = matchWordsJson.match_words.education;
        // First, check for multi-word matches (like "post graduate")
        for (const key in matchWords) {
            const wordVariants = matchWords[key];
            // Detect multi-word match in `normalizedStr`
            const multiWordMatch = wordVariants.some(variant => normalizedStr.includes(variant) && variant.includes(" "));
            if (multiWordMatch) {
                if (!resultArray.includes(key)) {
                    resultArray.push(key);
                }
            }
        }
        // Now check for single-word matches
        const words = normalizedStr.split(/\s+/); // Split by spaces
        for (const key in matchWords) {
            const wordVariants = matchWords[key];
            for (let i = 0; i < words.length; i++) {
                let word = words[i];
                // Check for "Graduate" without "Post" immediately before it
                if (key === "Graduate" && word === "graduate") {
                    if (i > 0 && words[i - 1] === "post") {
                        continue; // Skip if "graduate" is preceded by "post"
                    }
                }
                // Add to resultArray if there's a match and it's not already included
                if (wordVariants.includes(word) && !resultArray.includes(key)) {
                    resultArray.push(key);
                }
            }
        }
        console.log(resultArray);
        if(resultArray.length!==0){
            result=resultArray;
            FeedbackProcessor.speakToUser("okay! ", VOICE_NONE, false);
        }else{
            flag1 = true;
        }
      }
    console.log("result ", result);
    
    if(flag1){
        if(flag){
            handleCommandByCommandId(process.change_field[field]);
        }else{
            handleVoiceError();
        }
    }else{
        if (flag === false) {
            executeHandlerForPaste(process.action_intent, result, field).then((feedback) => {
                console.log("123", feedback); // This will log "Event successfully fired"
                // handleCommandByCommandId(process.next);
            })
            .catch((errorMessage) => {
                //  console.log("33.3", errorMessage); 
                console.log("unsuccessfully set 2",field);
                handleCommandByCommandId(process.error_next); // This will log any error message
            });  
        } else {
            console.log(`inside going to set change ${field} to ${result}`);
            console.log("the process gonna be execute is ",process.change_field);
            console.log("the process gonna be execute is ",process.change_field[field] );
            executeHandlerForPaste(process.change_field[field], result, field).then((feedback) => {
                console.log("123", feedback);
                console.log("successfully set",field); // This will log "Event successfully fired"
                // handleCommandByCommandId(process.next);
            })
            .catch((errorMessage) => {
                //  console.log("33.3", errorMessage); 
                console.log("unsuccessfully set 1",field);
                handleCommandByCommandId(process.error_next); // This will log any error message
            }); 
        }
    }
}

export const handleCommandByPhrase = async (result) => {
    console.log("inside handleCommandByPhrase");
    const screenDetails = ContextFinder.getScreenDetails();
    const commandId = screenDetails.commands;
    console.log("handleCommandByPhrase Id", commandId);
    const keys = Object.keys(commandId);
    console.log("handleCommandByPhrase Key ", keys);
    const actionIntent = ContextFinder.getIntentFromUserInput(result, keys);
    console.log( "actionIntent_1 " + typeof(actionIntent));
    console.log("actionIntent_2 " + actionIntent);
    const process = CreateVoiceData.processMap.get(currentProcess);
    
    if (actionIntent !== null) {
        if (CreateVoiceData.processMap.containsKey(actionIntent)) {
            console.log(`SDK_PHRASE_NON_ACTIONABLE =  ${actionIntent}`);
            handleCommandByCommandId(actionIntent);
            return;
        } else {
             console.log(`SDK_PHRASE_FOUND_&_RETURN =  ${actionIntent}`);
            errorCount = 0;
            // LouieSdk.getActionIntentListener().onLouieIntentListener(result, actionIntent)
        }
    } else if (process.global_command) {
      console.log("inside_global_command ", process.global_command);
      if (process.next !== null && process.next !== undefined) {
        handleCommandByCommandId(process.next);
      }
        return;
    } else if (process.direct_search_command !== null) {    
        console.log("inside handleCommandByCommandId"," direct_search_command");
        handleCommandByCommandId(process.direct_search_command);
    } else if (process.action_id == CustomVoiceFlags.PROCESS_SET_TEXT) {
        const view = ViewParser.getViewById(LouieSDK.currentScreenContext, process.node_to_process);
        console.log("view ", view);
        var result = voiceResult;
        result.replace(/,/g,'');
        const inputStr = result.toLowerCase();
        // Regular expression for capturing action (change, modify, edit)
        // const actionRegex = /\b(change|modify|edit)\b/;
        // // Regular expression for capturing the field (name, email, etc.)
        // const fieldRegex = /\b(name|email|dateofbirth|etc)\b/;
        // // Regular expression for capturing the value after 'to'
        // const valueRegex = /\bto\s+(.+)/;

        // let actionMatch = inputStr.match(actionRegex);
        // let fieldMatch = inputStr.match(fieldRegex);
        // let valueMatch = inputStr.match(valueRegex);

        // let action = actionMatch ? actionMatch[0] : null; // Contains 'change', 'modify', or 'edit'
        // let field = fieldMatch ? fieldMatch[0] : null; // Contains 'name', 'email', 'dateofbirth', etc.
        // let value = valueMatch ? valueMatch[1] : null; // Contains value after 'to', e.g., 'xyz'

        // // Output results
        // // action='change';
        // // field='name';
        // // value='hitesh';
        // console.log("Action: ", action);  // e.g., 'change'
        // console.log("Field: ", field);    // e.g., 'name'
        // console.log("Value: ", value);    // e.g., 'xyz'
        const actionRegex = /\b(change|modify|edit)\b/;
        const valueRegex = /(?:is|to)\s+(.+)$/;  // Captures value after 'is' or 'to'

        // Find the action
        let actionMatch = inputStr.match(actionRegex);
        let action = actionMatch ? actionMatch[0] : null; // Contains 'change', 'modify', or 'edit'

        // Helper function to find the field from id_info JSON and value immediately after
        const findFieldAndValueFromInput = (input, id_info) => {
        for (let key in id_info) {
            for (let synonym of id_info[key]) {
            const fieldRegex = new RegExp(`\\b${synonym}\\b`, 'i');  // Look for field synonym
            const match = input.match(fieldRegex);
            if (match) {
                let remainingStr = input.slice(match.index + match[0].length).trim();
                // First try to extract value after 'is' or 'to'
                const valueAfterToIsMatch = remainingStr.match(valueRegex);
                if (valueAfterToIsMatch) {
                return { field: key, value: valueAfterToIsMatch[1].trim() }; // Return value after 'is' or 'to'
                }
                // Otherwise, treat remaining part after field as the value
                return { field: key, value: remainingStr }; 
            }
            }
        }
        return { field: null, value: null }; // Return null if no match is found
        };

        // Find the field and value directly after the field
        let { field, value } = findFieldAndValueFromInput(inputStr, matchWordsJson.match_words.id_info);

        // If no value found directly after the field, check for value after "is" or "to"
        if (!value) {
           let valueMatch = inputStr.match(valueRegex);
           value = valueMatch ? valueMatch[1].trim() : null; // Contains the value after 'is' or 'to'
        }

        // If action is not found, we check for patterns like "my name is X" or "my dob X" where 'is' or 'to' is missing
        // if (!action && field && value) {
        //    action = "update";  // Default action when only field and value are found
        // }

        console.log("Action:", action);
        console.log("Field:", field);
        console.log("Value:", value);
        if(!action&&!value){
            value=result;
        }
        if(action){
           if(field){
            if(value){   
                setFieldVoiceResults(field,value,true);
            }else{
                handleCommandByCommandId(process.change_field[field]);
            }
           }else{
            handleCommandByCommandId("process_ask_field_to_modify");
           }
        }else{
            setFieldVoiceResults(process.node_to_process,value,false);  
        }
    }else if (process.action_id == CustomVoiceFlags.PROCESS_SET_DATE_OF_BIRTH) {
        const view = ViewParser.getViewById(LouieSDK.currentScreenContext, process.node_to_process);
        console.log("view ", view);
        var dateString = voiceResult;
        var result='-';
        const dateFormats = [
            /^\d{1,2}[-/]\d{1,2}[-/]\d{4}$/,           // e.g., 23/06/2001 or 23-06-2001
            /^\d{1,2}(st|nd|rd|th)? \w+ \d{4}$/,       // e.g., 23rd June 2001 or 23 June 2001
            /^\w+ \d{1,2}(st|nd|rd|th)? \d{4}$/,       // e.g., June 23rd 2001 or June 23 2001
            /^\w+ of \w+ \d{4}$/,                      // e.g., "first of June 2023" or "second of May 2002"
            /^\d{1,2} \d{1,2} \d{4}$/                  // e.g., "2 12 2002"
        ];
        
        const ordinalToNumber = {
            first: '1', second: '2', third: '3', fourth: '4', fifth: '5',
            sixth: '6', seventh: '7', eighth: '8', ninth: '9', tenth: '10',
            eleventh: '11', twelfth: '12', thirteenth: '13', fourteenth: '14',
            fifteenth: '15', sixteenth: '16', seventeenth: '17', eighteenth: '18',
            nineteenth: '19', twentieth: '20', 'twenty-first': '21', 'twenty-second': '22',
            'twenty-third': '23', 'twenty-fourth': '24', 'twenty-fifth': '25',
            'twenty-sixth': '26', 'twenty-seventh': '27', 'twenty-eighth': '28',
            'twenty-ninth': '29', thirtieth: '30', 'thirty-first': '31'
        };
        
        // Parse date in various formats
        for (const format of dateFormats) {
            if (format.test(dateString)) {
                let date;
                
                // Handle dd-mm-yyyy or dd/mm/yyyy formats
                if (dateString.includes('-') || dateString.includes('/')) {
                    const [day, month, year] = dateString.split(/[-/]/);
                    date = new Date(`${year}-${month}-${day.replace(/(st|nd|rd|th)$/i, '')}`);
                } else {
                    // Replace ordinal words with numbers (e.g., "first" -> "1")
                    let cleanedDateString = dateString.toLowerCase()
                        .replace(/\b(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth|eleventh|twelfth|thirteenth|fourteenth|fifteenth|sixteenth|seventeenth|eighteenth|nineteenth|twentieth|twenty-first|twenty-second|twenty-third|twenty-fourth|twenty-fifth|twenty-sixth|twenty-seventh|twenty-eighth|twenty-ninth|thirtieth|thirty-first)\b/gi, 
                            match => ordinalToNumber[match])
                        .replace(/(\d{1,2})(st|nd|rd|th)/gi, '$1') // Remove suffixes
                        .replace(/of /g, '')                      // Remove "of"
                        .replace(/\s+/g, ' ')                     // Normalize spaces
                        .trim();
        
                    date = new Date(cleanedDateString);
                }
                
                if (!isNaN(date)) {
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    result = `${year}-${month}-${day}`;
                    break;
                }
            }
        }
        
        if (view !== null && result !=='-') {
            executeHandlerForPaste(process.action_intent, result,process.node_to_process).then((feedback) => {
                console.log("123", feedback); // This will log "Event successfully fired"
                //handleCommandByCommandId(process.next);
            })
            .catch((errorMessage) => {
                //  console.log("33.3", errorMessage); 
                handleCommandByCommandId(process.error_next); // This will log any error message
            });   
        } else {
            handleVoiceError();
            // FeedbackProcessor.speakToUser(ConstantString.encounter_problem_going_silent, VOICE_END, false);
        }
        console.log("result ", result);
    } else if (process.action_id === CustomVoiceFlags.PROCESS_SET_AMOUNT) {
        const view = ViewParser.getViewById(LouieSDK.currentScreenContext, process.node_to_process);
        console.log("view ", view);
        var result = voiceResult;
        if (CustomUtils.isAmountInDoller()) {
            FeedbackProcessor.speakToUser(ConstantString.please_speak_the_amount_in_indian_rupees, VOICE_REINPUT, true);
        } else {
            const alphabetRegex = /[a-zA-Z]/;
            let formattedResult = voiceResult;
            if(!alphabetRegex.test(voiceResult))formattedResult = voiceResult?.replace(/[,\s\-_]/g, '');
            console.log("amount is as :", voiceResult, formattedResult);
            var amount = CustomUtils.getAmountFromVoiceResult(formattedResult);
            console.log("VEP FINAL AMOUNT = ",amount, typeof amount);
            amount = parseInt(amount); 
            if (view !== null && isNumber(amount)) {
                // Set the value of the result element
                window.handleAmountChangeFromVoice(amount);
                console.log("Set the value of the result element");
                view.value = amount;
                console.log("Set the value", view.value);
                handleCommandByCommandId(process.next);
            } else {
                FeedbackProcessor.speakToUser(ConstantString.encounter_problem_going_silent, VOICE_END, false);
            }
        }
    } else {
        errorCount = tempErrorCount;
        handleVoiceError();
    }
}

export function rawVoiceResultContainsAnyKey(matchWord) {
    if (CreateVoiceData.matchWords.get(matchWord) !== null ) {
        const matchWordsKeys = CreateVoiceData.matchWords.get(matchWord);
        for (let key of matchWordsKeys) {
            for (let result of rawVoiceResult) {
                if (ContextFinder.isMatchWithCommand(key, result)) {
                    return true;
                }
            }
        }
    }
    return false;
}


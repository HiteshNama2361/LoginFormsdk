// const JsonData = require('../utils/CreateVoiceData');
// const ContextFinder = require('../utils/ContextFinder');
import { isListening, setIsListening, stopListening } from "../VoiceHandler/WebSpeech";
import { VOICE_NONE, VOICE_REINPUT, VOICE_END, MAX_RETRY_FOR_FETCHING_DATA, PAYEE_LIST_QUICK_READING } from "../AppConstants";

//import { isVoiceSessionActive } from "../LouieSDK";
import ConstantString from "../res/ConstantString";
const FeedbackProcessor = require('../FeedbackHandler/FeedbackProcessor');
const CustomVoiceFlags = require('./CustomVoiceFlags');
const VoiceEventProcessor = require('../VoiceHandler/VoiceEventProcessor');
const ViewParser = require('../Dataclasses/ViewParser');
const LouieSDK = require('../LouieSDK');
const TAG = "CustomActionProcessor";
// const ViewParser = require('../dataclasses/ViewParser');
// const GlobalCommandProcessor = require('../voiceHandler/GlobalCommandProcessor');
const CustomUtils = require('../utils/CustomUtils');
var currentProcessTemp = null;
// export var input_filter = false;
// export var isViewCartCommandGivenFromHomeScreen = false;
var currentCommandID = null;
// //var currentScreen = null;
// let timeoutId;
export var generalPayeeList = null;
export var isReverseMode = false;
export var listIndex = -1;
// const { executeHandlerForDownloadGlobal,executeHandlerForMultipleOptions, executeHandlerForTouchableOpacityWithIndex, executeHandlerForSelectFund, executeHandlerForRemoveFund,executeHandlerForSelectFundCategoryFromPicker,executeHandlerForTextInput,executeHandlerForRadioButton, executeHandlerForCheckBox, executeHandlerForTouchableOpacity, executeHandlerForCheckBoxWithIndex, executeHandlerForGoBack } = require('../interfaces/EventEmittingModule');
export var listCount = 0;
var tempListIndex = 0;
export var checkFlowForHelpCommand = false;
var clearListReadingVariable = true;
// var counter = 0;
export const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export var startingListIndex = -1;
var totalListIndex = -1
var readMoreMaxCount = -1;
var totalReadItemsCount = 0;
export var readMoreCount = 0;
var readMoreCountNext = 0;
// export var customeSchemeIndex = 0;
// export var schemesArray = [];
var readMoreCountPrevious = 0;
var totalReadTransactions = 0;
var tempReadListCount = 0;
var readMoreTransactionsDone = false;
var readMoreDone = false;
// export var generalPickerList = null;
// let hasStatementExecuted = false;
// export var isDownloadPdfAvailable = false;
export const ones = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
// export let intervalForMoreThenFiveFundFeedback;



export const handleProcess =  (process, commandId, context) => {
  console.log("222222", "2222");
    if (!LouieSDK.isVoiceSessionActive) {
      console.log("inside handleProcess", "8 " + commandId);
      return;
    } else if (isListening) {
      console.log("inside handleProcess", "9 " + commandId);
      return;
    } else {
      try {
        //currentScreen = ContextFinder.getScreenDetails().name;
        console.log("inside handleProcess", "10 ");
        currentProcessTemp = process; 
        currentCommandID = commandId;
        if (process !== null ) {
          console.log("inside this check process");
          if (process.action_id === CustomVoiceFlags.PROCESS_READ_BALANCE) {
            console.log("inside custom process 11", context);
            var document =  context;
            if (document) {
              var feebackToSpeak = ViewParser.getNodeText(document, process.node_to_process);
              feebackToSpeak = CustomUtils.convertAmountIntoWords(feebackToSpeak, false);
              console.log("inside custom process 12", feebackToSpeak);
              FeedbackProcessor.speakToUser(ConstantString.your_available_balance_is + "  " +feebackToSpeak, VOICE_NONE, true);
              VoiceEventProcessor.handleCommandByCommandId(process.next);
            } else {
              FeedbackProcessor.speakToUser(ConstantString.encounter_problem_going_silent, VOICE_END, false);
            }
          } else if (process.action_id === CustomVoiceFlags.PROCESS_CHECK_PAYEE_NAME_GLOBALLY_FOUND) {
            console.log("202.1","1");
            let previousProcess = null;
            previousProcess = VoiceEventProcessor.getPreviousProcess();
            const previousScreen = LouieSDK.getPreviousScreen();
            console.log("202.2",previousScreen);
            console.log("202.3",previousProcess);
            if (previousScreen && previousScreen === "home_bank" && previousProcess !== null && (previousProcess?.action_intent && previousProcess.action_intent === 'go_to_switch_bank_transfer')) {
              VoiceEventProcessor.handleCommandByCommandId(process.next);
            } else {
              VoiceEventProcessor.handleCommandByCommandId(process.error_next);
            }
            // var payeeFound = true;
            // if (payeeFound) {
            //   console.log("102","2");
            //   FeedbackProcessor.speakToUser(ConstantString.got_it, VOICE_NONE, false);
            //   VoiceEventProcessor.handleCommandByCommandId(process.next);
            // } else {
            //   console.log("102","3");
            //   VoiceEventProcessor.handleCommandByCommandId(process.error_next);
            // }
          } else if (process.action_id === CustomVoiceFlags.PROCESS_FETCH_PAYEE_LIST) {
            console.log("102","1");
            var document = context;
            console.log("102",document);
            if (clearListReadingVariable) {
              clearListReadingVariables();
            } else {
              clearListReadingVariable = true;
            }
            fetchPayeeList(document, process);
          } else if (process.action_id === CustomVoiceFlags.PROCESS_READ_PAYEE_LIST) {
            var document = context;
            if (process.start_command !== null) {
              listCount = generalPayeeList?.length;
              if (process.start_command === "next") {
               console.log("inside custom process 12", "11 " + readMoreCount);
               readMoreMaxCount = process.read_more_max_count ? process.read_more_max_count : -1;
               console.log("##","1 " + readMoreMaxCount);
              if (readMoreMaxCount !== -1 && readMoreCount !== -1 && readMoreCount === readMoreMaxCount && !readMoreDone && (process.action_id !== CustomVoiceFlags.PROCESS_READ_PAYEE_LIST)) {
                console.log("##","2");
                tempReadListCount = 0;
                readMoreCount = 0;
                readMoreTransactionsDone = true;
                readMoreDone = true;
                VoiceEventProcessor.handleCommandByCommandId(process.error_next);
                return;
              } else {
                console.log("##","3");
                readMoreTransactionsDone = false;
                readMoreDone = false;
              }
              isReverseMode = false;
              listIndex++;
              console.log("inside custom process 13", "11 " +listIndex);
              chooseListItem(process,commandId);
              } else if (process.start_command === "previous") {
                isReverseMode = true;
                listIndex--;
                console.log("inside custom process 14", "11 " +listIndex);
                chooseListItem(process,commandId);
              } else if (process.start_command === "select") {
                if (listIndex === -1) {
                  listIndex = 0;
                }
                try {
                  const ulElement = document.getElementById(process.node_to_process);
                  // Check if the <ul> element exists
                  if (!ulElement) {
                    console.error('UL element not found.');
                    return;
                  }  
                  // Get all <li> elements within the <ul>
                  const listItems = ulElement.getElementsByClassName(process.second_node_to_process);
                  // Select the list item based on index
                  const itemToClick = listItems[listIndex];
                  // Simulate a click event on the third item
                  console.log("inside custom process", itemToClick);
                  if (itemToClick && itemToClick.onclick !== null) {
                    itemToClick.click();
                    FeedbackProcessor.speakToUser(ConstantString.selected + " , " + generalPayeeList[listIndex], VOICE_NONE, false);
                  } else {
                    FeedbackProcessor.speakToUser(ConstantString.encounter_problem_going_silent, VOICE_END, false);
                  }
                } catch (error) {
                  console.log("Exception passing data to event emitter ", error);
                }
              } 
            }
          } else if (process.action_id === CustomVoiceFlags.PROCESS_CHECK_FOR_NUMBER_SELECT_COMMAND_FOR_PAYEE) {
            var index = -1;
            console.log("Mutual fund list length ", generalPayeeList?.length);
            let strArray;
            strArray = VoiceEventProcessor.bankVoiceResult.split(' ');
            for (let str of strArray) {
              console.log("voice result 2", str);
              let finalStr = ViewParser.removeUnwantedPrefixAndSuffixChar(str);
              console.log("voice result 3", finalStr);
              if (CustomUtils.textContainsAnyMatchWord("last", finalStr)) {
                console.log("voice result 4", finalStr);
                index = generalPayeeList?.length - 1;
                break;
              } else if (VoiceEventProcessor.dayMap.hasOwnProperty(finalStr.toLowerCase())) {
                console.log("voice result 4", finalStr);
                index = VoiceEventProcessor.dayMap[finalStr.toLowerCase()] - 1;
                break;
               }
            }
            console.log("voice result 1", strArray);
            console.log("index for selecting item-1", index);
            if (index !== -1) {
              if (index < listCount) {
                listIndex = index;
                console.log("index for selecting item-2", listIndex);
                VoiceEventProcessor.handleCommandByCommandId(process.next);
              } else {
                const tempProcess = VoiceEventProcessor.currentProcess;
                console.log("index for selecting item-3", tempProcess);
                VoiceEventProcessor.setCurrentProcess(VoiceEventProcessor.previousProcess);
               // console.log("index for selecting item-4", VoiceEventProcessor.currentProcess);
                VoiceEventProcessor.setPreviousProcess(tempProcess);
              //  console.log("index for selecting item-5", VoiceEventProcessor.previousProcess);
                VoiceEventProcessor.setErrorCount(VoiceEventProcessor.tempErrorCount);
               // console.log("index for selecting item-6", VoiceEventProcessor.errorCount);
                checkFlowForHelpCommand = true;
                VoiceEventProcessor.handleVoiceError();
              }
            } else {
              if (process.action_id === CustomVoiceFlags.PROCESS_CHECK_FOR_NUMBER_SELECT_COMMAND_FOR_PAYEE) {
                // add following 
                var index = -1;
                if (index !== -1 && index < listCount) {
                    listIndex = index;
                    console.log("index for selecting item-4", listIndex);
                    VoiceEventProcessor.handleCommandByCommandId(process.next);
                } else if (VoiceEventProcessor.voiceResultContainsAnyKey("select")) { 
                    console.log("index for selecting item-5", listIndex);
                    VoiceEventProcessor.handleCommandByCommandId(process.next);
                } else if (index === -1) {
                  console.log("index for selecting item-8", listIndex);
                  const tempProcess = VoiceEventProcessor.currentProcess;
                  console.log("index for selecting item-9", tempProcess);
                  VoiceEventProcessor.setCurrentProcess(VoiceEventProcessor.previousProcess);
                  console.log("index for selecting item-10", VoiceEventProcessor.currentProcess);
                  VoiceEventProcessor.setPreviousProcess(tempProcess);
                  console.log("index for selecting item-11", VoiceEventProcessor.previousProcess);
                  VoiceEventProcessor.setErrorCount(VoiceEventProcessor.tempErrorCount);
                  console.log("index for selecting item-12", VoiceEventProcessor.errorCount);
                  checkFlowForHelpCommand = true;
                  VoiceEventProcessor.handleVoiceError();
                } else {
                  FeedbackProcessor.speakToUser(ConstantString.encounter_problem_going_silent, VOICE_END, false);
                } 
              }
            }
          } else if(process.action_id === CustomVoiceFlags.PROCESS_READ_TRANSFER_DETAILS) {
            console.log("inside transfer", "1", context);
            if (context !== undefined && context !== null) {
              var nodeToRead = process.nodes_to_read;
              console.log("nodeToRead", nodeToRead);
              var dataArray = ViewParser.getTextContentByIds(context, nodeToRead);
              console.log("data read in it", dataArray);
              var transferAmount = dataArray[0];
              console.log("transfer amount", transferAmount);
              var transferPayee = dataArray[1];
              var transferType = dataArray.find((value, index) => index >= 2 && value !== null);
              console.log("transfer type", transferType);
              var amountInWords = CustomUtils.convertAmountIntoWords(transferAmount, false);
              console.log("Amount in words", amountInWords);
              var speakableText = ConstantString.you_are_transferring + " " + amountInWords + " " + ConstantString.to + " " + transferPayee + " " + ConstantString.transfer_type + " " + transferType;
              console.log("speakableText", speakableText);
              FeedbackProcessor.speakToUser(speakableText, VOICE_NONE, true);
              VoiceEventProcessor.handleCommandByCommandId(process.next);
            }
            } else if (process.action_id === CustomVoiceFlags.PROCESS_SPEAK_PAYEE_ITEM_DETAILS) {
            console.log("104","1");
            if (context !== undefined && context !== null) {
              var nodeToRead = process.nodes_to_read;
              console.log("nodeToRead", nodeToRead);
              var dataArray = ViewParser.getTextContentByIds(context, nodeToRead);
              console.log("data read in it", dataArray);
              var nameOfuser = dataArray[0];
              console.log("nameOfuser ", nameOfuser);
              var dob = dataArray[1];
              var phone = dataArray[2];
              // accountNo = accountNo.toString().slice('-4');
              // accountNo = CustomUtils.getDigitTextInReadableForm(accountNo);
              // console.log("a", accountNo);
              var speakableText = "user details are as follows, name of the user  " + nameOfuser + " " + " contact number " + phone + " "+ "date of birth of the user" + " " + dob ;
              console.log("speakableText", speakableText);
              FeedbackProcessor.speakToUser(speakableText, VOICE_NONE, true);
              VoiceEventProcessor.handleCommandByCommandId(process.next);
            } else {
              FeedbackProcessor.speakToUser(ConstantString.encounter_problem_going_silent, VOICE_END, false);
            }
          } 
        } 
      } catch (err) {
        console.log("catch block", err);
        FeedbackProcessor.speakToUser(ConstantString.encounter_problem_going_silent, VOICE_END, false);
    }
  }
}

const getPayeesListData = (document, nodeID, itemID) => {
  if (!document) return [];
  // Get the ul element by its id
  const ulElement = document.getElementById(nodeID);
  
  if (ulElement) {
    // Get all li elements within the ul
    const liElements = ulElement.getElementsByClassName(itemID);
    console.log("list class:", liElements);
    if (liElements.length === 0) return [];
    // Extract data from each li element
    var payeesData = Array.from(liElements).map(li => {
      return {
        name: li.querySelector('.payee-name').textContent,
        bank: li.querySelector('.payee-bank').textContent,
        // accountNumber: li.querySelector('.payee-account').textContent
      };
    });
    console.log("****12",payeesData);
    payeesData = extractNamesAndBanks(payeesData);
    console.log("****34",payeesData);
    return payeesData;
  }
  return [];
};

// Function to extract names and banks from a list of payee objects
function extractNamesAndBanks(payees) {
   // Map over the array of payees and concatenate name and bank
   return payees.map((payee, index) => `${index + 1}\t${payee.name}\t${payee.bank}`);
}

const chooseListItem = (process, commandID) => {
  console.log("inside chooseListItem", "chooseListItem");
  try {
  var listSize = Object.keys(generalPayeeList).length;
  console.log("size of list ", listSize);
  console.log("index of list ", listIndex);
  if (listIndex >= listSize) {
    console.log("inside line 2161");
    listIndex--;
    FeedbackProcessor.speakToUser(ConstantString.no_more_results_please_select, VOICE_REINPUT, false);
  } else if (listIndex < 0) {
    console.log("inside line 2176");
    listIndex++;
    FeedbackProcessor.speakToUser(ConstantString.no_more_results_please_select, VOICE_REINPUT, false);
  } else {
    console.log("inside line 2192");
    if (process.start_command != null) {
      if (process.start_command === "next") {
          totalListIndex++;
          totalReadItemsCount++;
          // listCount++;
          tempReadListCount++;
          totalReadTransactions++;
          isReverseMode = false;
          readMoreCountPrevious = 0;
          readMoreCountNext++;
      } else if (process.start_command === "previous") {
          tempReadListCount = 0;
          totalReadTransactions--;
          isReverseMode = true;
          totalListIndex--;
          // listCount--;
          readMoreCountNext = 0;
          readMoreCountPrevious++;
      }
      readMoreCount++;
      readMoreDone = false;
    }
     console.log("readMoreCount  ", readMoreCount);
     console.log("readMoreMaxCount ", readMoreMaxCount);
     console.log("listIndex ", listIndex);
     console.log("listCount ", listCount);
    var text = "";
    if (process.action_id === CustomVoiceFlags.PROCESS_READ_PAYEE_LIST && listCount > 3) {
      console.log("listCount-1 if", "1");
      var payName = generalPayeeList[listIndex];
      // console.log("list data", fundName);
      // if (fundName) {
      //   fundName = fundName.replace("NIPPON INDIA","");
      // }
      var result = "";
        if (VoiceEventProcessor.errorCount === 1) {
          console.log("listCount-2 ", "2");
          result =  result + " ";
        } else {
          console.log("listCount-3 ", "3");
          result =  payName;
        }
       if (readMoreCount === 1) {
        console.log("listCount-4 ", "4");
         text = result;
       } else {
        console.log("listCount-5 ", "5");
         text = result + " ";
       }
    } 
    else {
      console.log("listCount-1 else", "1");
      var payName = generalPayeeList[listIndex];
      // if (fundName) {
      //   fundName = fundName?.replace("NIPPON INDIA","");
      //  }
      var result = "";
      if (VoiceEventProcessor.errorCount === 1 || VoiceEventProcessor.errorCount === 2) {
        console.log("listCount-2 ", "2");
        // if (commandID === "process_fetch_cart_list_next") {
        //   console.log("listCount-3 ", "3");
        //   result = "";
        // } else if (commandID === "process_remove_fund_list_next") {
        //   console.log("listCount-4 ", "4");
        //   result = "";
        // } else {
          console.log("listCount-5 ", "5");
          result = result + (listIndex + 1) + "  ";
        //}
        // result =  result + (listIndex + 1) + "  ";
      } else {
        console.log("listCount-6 ", "6");
        result =  payName;
      }
      if (readMoreCount === 1) {
        console.log("listCount-7 ", "7");
         text = result;
       } else {
        console.log("listCount-8 ", "8");
        if (VoiceEventProcessor.errorCount >= 1 && VoiceEventProcessor.errorCount <= 4) {
          console.log("listCount-9 ", "9");
          // if (commandID === "process_fetch_cart_list_next") {
          //   console.log("listCount-10 ", "10");
          //   text = result;
          // } else {
            console.log("listCount-12 ", "12");
            text = ConstantString.or + result;
          //}
          // text = " or " + result;
        } else {
          console.log("listCount-13 ", "13");
         text = result + " ";
        }
       }
  }
  if (process.action_id === CustomVoiceFlags.PROCESS_READ_PAYEE_LIST) {
    console.log("11","1");
    if (readMoreCount === 1) {
      console.log("12","1");
      startingListIndex = listIndex;
    }
    const position = listIndex;
    if (position === listCount - 1) {
      console.log("13","1");
      if (VoiceEventProcessor.errorCount >= 1 && VoiceEventProcessor.errorCount <= 4) {
        FeedbackProcessor.speakToUser(text ,VOICE_REINPUT,false);
      } else {
        console.log("13.1","1");
        // if (commandID === "process_remove_fund_list_next") {
        //   FeedbackProcessor.speakToUser(text + " " + constantString.add_more_or_proceed, VOICE_REINPUT, false);
        // } else{
          console.log("13.2","1");
          if (listCount <= 3) {
            console.log("13.3","1");
            // FeedbackProcessor.speakToUser(text + " " + constantString.please_select ,VOICE_REINPUT,true);
            // if (commandID === "process_read_portfolio_selected_fund_list") {
            //   FeedbackProcessor.speakToUser(text + " " + constantString.or_add_scheme_to_cart ,VOICE_REINPUT,true);
            // } else if (commandID === "process_read_portfolio_selected_fund_list_for_add_to_cart") {
            //   FeedbackProcessor.speakToUser(text ,VOICE_REINPUT,true);
            // } else {
              FeedbackProcessor.speakToUser(text + " " + ConstantString.please_select ,VOICE_REINPUT,true);
            //}
          } else {
            console.log("13.4","1");
            FeedbackProcessor.speakToUser(text + " " + ConstantString.please_select ,VOICE_REINPUT,true);
          }
        //} 
      }
    } else if (readMoreCount === readMoreMaxCount) {
      console.log("14","1");
      readMoreCount = 0;
      // if (commandID === "process_read_mutual_fund_list_next_for_cart_reading") {
      //   console.log("14.4","1");
      //   FeedbackProcessor.speakToUser(text + " " + constantString.please_select_a_fund_or_ask_me_to_read_more, VOICE_REINPUT, true);
      // } else{
        FeedbackProcessor.speakToUser(text + " " + ConstantString.please_select_or_read_more, VOICE_REINPUT,true);
      //}    
    } else {
      console.log("15","1");
      executeChooseListItem(process,commandID,text);
    }
    } else {
      executeChooseListItem(process, commandID, text);
    }
  }
  } catch (err) {
    console.log("inside catch of chooseListItem", err);
  }
}

const executeChooseListItem =  (process, commandID, text) => {
  console.log("inside executeChooseListItem", "executeChooseListItem " + text);
  FeedbackProcessor.speakToUser(text, PAYEE_LIST_QUICK_READING, true);
}


// export const readFundNameListIfReadMoreCountIsZero = () => {
//   const position = listIndex;
//   if (position == listCount - 1) {
//       listIndex = -1;
//   } else if (!isReverseMode) {
//       listIndex = startingListIndex - 1;
//   } else {
//       listIndex = startingListIndex + 1;
//   }
//  // console.log("1234" , listIndex);
//  // console.log("5678" , VoiceEventProcessor.currentProcess);
//   VoiceEventProcessor.handleCommandByCommandId(VoiceEventProcessor.currentProcess);
// }

// export const clearScreenVariables = () => {
//   console.log("2","2");
//   listIndex = -1;
//   listCount = 0;
//   isReverseMode = false;
//   clearMutualFundList();
//   stopListening();
//   totalListIndex = -1;
//   totalReadItemsCount = 0;
//   readMoreCount = 0;
//   tempReadListCount = 0;
//   hasStatementExecuted = false;
//   dateSelectManualHandleError = false;
// }

// export const clearVariables = () => {
//   clearListReadingVariables();
// }

function getDayOrdinalSuffix(day) {
  if (day >= 11 && day <= 13) {
    return 'th';
  }
  const lastDigit = day % 10;
  switch (lastDigit) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}

const fetchPayeeList =  (context, currentProcess) => {
  console.log("fetchPayeeList-1 currentProcess = ", currentCommandID);
  generalPayeeList =  null;
  var listNode = currentProcess.node_to_process;
  var listItemNode = currentProcess.second_node_to_process;

  generalPayeeList = getPayeesListData(context, listNode, listItemNode);
  console.log("fetchPayeeList-3 ", generalPayeeList);

  listCount = generalPayeeList?.length;
  if (generalPayeeList !== null && listCount > 0) {
    console.log("fetchPayeeList-4", listCount);
    // if (listCount === 1) {
    //   listIndex = 0;
    //   VoiceEventProcessor.handleCommandByCommandId("process_only_one_scheme_available");
    // } else
     if (!isReverseMode) {
    //  console.log("currentProcess.read_more_max_count = ", currentProcess.read_more_max_count);
      var partionValue = currentProcess.read_more_max_count ? currentProcess.read_more_max_count : -1;
    //  console.log("partion value=",partionValue);
      console.log("fetchPayeeList-5", "1");
      var feebackToSpeak = "";
      if (listCount === 1) {
        feebackToSpeak = ConstantString.found_result;
      } else {
        feebackToSpeak = ConstantString.found_results;
      }
      console.log("fetchPayeeList-6","2");
      feebackToSpeak = replaceDynamicPlaceholder(feebackToSpeak, listCount);
      console.log("fetchPayeeList-7","3");
      FeedbackProcessor.speakToUser(feebackToSpeak, VOICE_NONE, true);
      VoiceEventProcessor.handleCommandByCommandId(currentProcess.next); 
    } else {
      console.log("fetchPayeeList-6", "1");
      VoiceEventProcessor.handleCommandByCommandId(currentProcess.error_next);
    }
  } else if (generalPayeeList === null && LouieSDK.retryCountForFetchingData < MAX_RETRY_FOR_FETCHING_DATA) {
    console.log("fetchPayeeList-7", "1");
    LouieSDK.setRetryCountForFetchingData(LouieSDK.retryCountForFetchingData++);
    VoiceEventProcessor.handleCommandByCommandId(VoiceEventProcessor.currentProcess);
  } else {
    console.log("fetchPayeeList-8", "1");
    LouieSDK.setRetryCountForFetchingData(0);
    FeedbackProcessor.speakToUser(ConstantString.encounter_problem_going_silent, VOICE_END, false);
  }
}

// // const FindConfirmAndPayById = (context, targetId) => {
     
// // }
// const chooseListItem = (process, commandID) => {
//   console.log("inside chooseListItem", "chooseListItem");
//   try {
//   var listSize = Object.keys(generalMutualFundList).length;
//   console.log("size of list ", listSize);
//   console.log("index of list ", listIndex);
//   if (listIndex >= listSize) {
//     console.log("inside line 2161");
//     listIndex--;
//     if(commandID === "process_read_invested_fund_list_next" || commandID === "process_read_invested_fund_list_previous"){ 
//       FeedbackProcessor.speakToUser(constantString.invest_more_in_this_fund_or_make, VOICE_REINPUT,true);
//     } else if (commandID === "process_remove_fund_list_next") {
//       FeedbackProcessor.speakToUser(constantString.add_more_or_proceed, VOICE_REINPUT, true);
//     } else if (commandID === "process_fetch_cart_list_next") {
//       FeedbackProcessor.speakToUser(constantString.would_u_like_to_add_more_or_proceed_or_delete_funds, VOICE_REINPUT, true);
//     } else{
//       if (LouieSdk.filterType === "All") {
//         FeedbackProcessor.speakToUser(constantString.no_more_funds_available_please_select_or_filter_schemes, VOICE_REINPUT, false);
//       } else {
//         FeedbackProcessor.speakToUser(constantString.no_more_funds_available_in_this_category_please_select_or_filter_schemes, VOICE_REINPUT, false);
//       }
//     }
    
//   } else if (listIndex < 0) {
//     console.log("inside line 2176");
//     listIndex++;
//     //TODO- add sound code
//     //FeedbackProcessor.playSound(R.raw.list_end);
//     if(commandID === "process_read_invested_fund_list_next" || commandID === "process_read_invested_fund_list_previous"){
//       FeedbackProcessor.speakToUser(constantString.invest_more_in_this_fund_or_make, VOICE_REINPUT,true);
//     } else if (commandID === "process_remove_fund_list_next") {
//       FeedbackProcessor.speakToUser(constantString.add_more_or_proceed, VOICE_REINPUT, true);
//     } else{
//       if (LouieSdk.filterType === "All") {
//         FeedbackProcessor.speakToUser(constantString.no_more_funds_available_please_select_or_filter_schemes, VOICE_REINPUT, false);
//       } else {
//         FeedbackProcessor.speakToUser(constantString.no_more_funds_available_in_this_category_please_select_or_filter_schemes, VOICE_REINPUT, false);
//       }
//     }
//   } else {
//     console.log("inside line 2192");
//     if (process.start_command != null) {
//       if (process.start_command === "next") {
//           totalListIndex++;
//           totalReadItemsCount++;
//           // listCount++;
//           tempReadListCount++;
//           totalReadTransactions++;
//           isReverseMode = false;
//           readMoreCountPrevious = 0;
//           readMoreCountNext++;
//       } else if (process.start_command === "previous") {
//           tempReadListCount = 0;
//           totalReadTransactions--;
//           isReverseMode = true;
//           totalListIndex--;
//           // listCount--;
//           readMoreCountNext = 0;
//           readMoreCountPrevious++;
//       }
//       readMoreCount++;
//       readMoreDone = false;
//     }
//      console.log("readMoreCount  ", readMoreCount);
//      console.log("readMoreMaxCount ", readMoreMaxCount);
//      console.log("listIndex ", listIndex);
//      console.log("listCount ", listCount);
//      if (listIndex == "3" && commandID === "process_read_invested_fund_list_next") {
//       executeHandlerForCheckBox(process.action_intent).then((feedback) => {
//         console.log("33.5", feedback); // This will log "Event successfully fired"
//           //handleCommandWithDelay(process.next, 5000);
//         })
//         .catch((errorMessage) => {
//           console.log("error in opening the funds dropdown list", errorMessage); 
//           // VoiceEventProcessor.handleCommandByCommandId(process.error_next); // This will log any error message
//         });
//      }
//     var text = "";
//     if (process.action_id === CustomVoiceFlags.PROCESS_READ_MUTUAL_FUND_LIST && listCount > 3) {
//       console.log("listCount-1 if", "1");
//       var fundName = generalMutualFundList[listIndex];
//       // console.log("list data", fundName);
//       if (fundName) {
//         fundName = fundName.replace("NIPPON INDIA","");
//       }
//       var result = "";
//         if (VoiceEventProcessor.errorCount === 1) {
//           console.log("listCount-2 ", "2");
//           result =  result + " ";
//         } else {
//           console.log("listCount-3 ", "3");
//           result =  fundName;
//         }
//        if (readMoreCount === 1) {
//         console.log("listCount-4 ", "4");
//          text = result;
//        } else {
//         console.log("listCount-5 ", "5");
//          text = result + " ";
//        }
//     } 
//     else {
//       console.log("listCount-1 else", "1");
//       var fundName = generalMutualFundList[listIndex];
//       if (fundName) {
//         fundName = fundName.replace("NIPPON INDIA","");
//        }
//       var result = "";
//       if (VoiceEventProcessor.errorCount === 1 || VoiceEventProcessor.errorCount === 2) {
//         console.log("listCount-2 ", "2");
//         if (commandID === "process_fetch_cart_list_next") {
//           console.log("listCount-3 ", "3");
//           result = "";
//         } else if (commandID === "process_remove_fund_list_next") {
//           console.log("listCount-4 ", "4");
//           result = "";
//         } else {
//           console.log("listCount-5 ", "5");
//           result = result + (listIndex + 1) + "  ";
//         }
//         // result =  result + (listIndex + 1) + "  ";
//       } else {
//         console.log("listCount-6 ", "6");
//         result =  fundName;
//       }
//       if (readMoreCount === 1) {
//         console.log("listCount-7 ", "7");
//          text = result;
//        } else {
//         console.log("listCount-8 ", "8");
//         if (VoiceEventProcessor.errorCount >= 1 && VoiceEventProcessor.errorCount <= 4) {
//           console.log("listCount-9 ", "9");
//           if (commandID === "process_fetch_cart_list_next") {
//             console.log("listCount-10 ", "10");
//             text = result;
//           } else if (commandID === "process_remove_fund_list_next") {
//             console.log("listCount-11 ", "11");
//             text = result;
//           } else {
//             console.log("listCount-12 ", "12");
//             text = " or " + result;
//           }
//           // text = " or " + result;
//         } else {
//           console.log("listCount-13 ", "13");
//          text = result + " ";
//         }
//        }
//   }
//  // console.log("listCount-1 text ", text);
//   if (commandID === "process_remove_fund_list_next") {
//     if (listCount === 1) {
//       text = text.slice(1, text.indexOf('\n', 2)) + '\n';
//      // console.log("only one item", text);
//     } else {
//       text = text.slice(0, text.indexOf('\n', 2)) + '\n';
//     }
//     // text = text.slice(0, text.indexOf('\n', 2)) + '\n';
//   }
//   if (commandID === "process_fetch_cart_list_next") {
//     if (listCount === 1) {
//       text = text.slice(text.indexOf('\n') + 1) + '\n';
//     //  console.log("only one item", text);
//     }
//   }
//   if (process.action_id === CustomVoiceFlags.PROCESS_READ_MUTUAL_FUND_LIST) {
//     console.log("11","1");
//     if (readMoreCount === 1) {
//       console.log("12","1");
//       startingListIndex = listIndex;
//     }
//     const position = listIndex;
//     if (position === listCount - 1) {
//       console.log("13","1");
//       if (VoiceEventProcessor.errorCount >= 1 && VoiceEventProcessor.errorCount <= 4) {
//         FeedbackProcessor.speakToUser(text ,VOICE_REINPUT,false);
//       } else {
//         console.log("13.1","1");
//         if(commandID === "process_read_invested_fund_list_next"){
//           text=text.replace("false","");
//           text=text.replace("true","");
//           FeedbackProcessor.speakToUser(text + " " + constantString.invest_more_in_this_fund_or_make ,VOICE_REINPUT,true);
//         } else if (commandID === "process_fetch_cart_list_next") {
//           console.log("13.1","1");
//          // if (readMoreCount === readMoreMaxCount) {
//          //   FeedbackProcessor.speakToUser(text + " " + constantString.proceed_to_invest_or_delete_fund, VOICE_REINPUT, false);
//          // } else {
//           if (listCount < 5) {
//             console.log("13.1","2");
//             FeedbackProcessor.speakToUser(text + " " + constantString.would_u_like_to_add_more_or_proceed_or_delete_funds ,VOICE_REINPUT,true);
//           } else {
//             console.log("13.1","3");
//             FeedbackProcessor.speakToUser(text , VOICE_NONE, false);
//             VoiceEventProcessor.handleCommandByCommandId("process_proceed_to_invest_cart_list_yes_or_no");
//           }  
//          // }
//         } else if (commandID === "process_remove_fund_list_next") {
//           FeedbackProcessor.speakToUser(text + " " + constantString.add_more_or_proceed, VOICE_REINPUT, false);
//         } else{
//           console.log("13.2","1");
//           if (listCount <= 3) {
//             console.log("13.3","1");
//             FeedbackProcessor.speakToUser(text + " " + constantString.please_select ,VOICE_REINPUT,true);
//           } else {
//             console.log("13.4","1");
//             FeedbackProcessor.speakToUser(text + " " + constantString.please_select_or_filter_schemes ,VOICE_REINPUT,true);
//           }
//         }
        
//       }
//     } else if (readMoreCount === readMoreMaxCount) {
//       console.log("14","1");
//       readMoreCount = 0;
//       if(commandID === "process_read_invested_fund_list_next"){
//         if (LouieSdk.getCurrentScreen() === "personal_view") {
//           var list=text.split(',');
//           var absoReturnBoolean=list[list.length-1].trim();
//           text=text.replace(absoReturnBoolean,"");
//           FeedbackProcessor.speakToUser(text + " " + constantString.invest_more_or_read_next, VOICE_REINPUT,true);
//         } else {
//           executeChooseListItem(process,commandID,text);
//         }
//         // executeChooseListItem(process,commandID,text);
//       } else if (commandID === "process_fetch_cart_list_next") {
//         console.log("14.2","1");
//         FeedbackProcessor.speakToUser(text , VOICE_NONE, false);
//         VoiceEventProcessor.handleCommandByCommandId("process_read_more_cart_list_yes_or_no");
//       } else if (commandID === "process_remove_fund_list_next") {
//         console.log("14.3","1");
//         FeedbackProcessor.speakToUser(text + " " + constantString.add_more_or_proceed, VOICE_REINPUT, false);
//       } else{
//         FeedbackProcessor.speakToUser(text + " " + constantString.please_select_or_read_more_options_or_filter_schemes, VOICE_REINPUT,true);
//       }
      
//     } else {
//       console.log("15","1");
//       executeChooseListItem(process,commandID,text);
//     }
//     } else {
//       executeChooseListItem(process, commandID, text);
//     }
//   }
//   } catch (err) {
//     console.log("inside catch of chooseListItem", err);
//   }
// }

// const executeChooseListItem =  (process, commandID, text) => {
//   //console.log("inside executeChooseListItem", "executeChooseListItem " + text);
// //  console.log("currentCOmmandID = ",commandID);
//   if(commandID === "process_read_invested_fund_list_next" || commandID === "process_read_invested_fund_list_previous"){
//     var list=text.split(',');
//   //  console.log("list of text =", list);
//     var absoReturnBoolean=list[list.length-1].trim();
//   //  console.log("last index of list =", absoReturnBoolean);
    
//     if(absoReturnBoolean === "true"){
//       text=text.replace(absoReturnBoolean,"");
//     //  console.log("text = ",text);
//       FeedbackProcessor.speakToUser(text,VOICE_NONE,false);
//       VoiceEventProcessor.handleCommandByCommandId("process_absoulute_return_greater_25_cmd");
//     }else{
//       text=text.replace(absoReturnBoolean,"");
//     //  console.log("text = ",text);
//       FeedbackProcessor.speakToUser(text, NIPPON_LIST_QUICK_READING, true);
//     }
//   }else{
//     FeedbackProcessor.speakToUser(text, NIPPON_LIST_QUICK_READING, true);
//   }
  
  
// }

// const readFlatList = (contextList, currentProcess, nodeList) => {
//   var FlatListUpdatedArray = [];
//   for (let i = 0; i < contextList.length; i++) {
//     // console.log("context inside flatlist is newer :", contextList[i], i+1);
//     const text = readFlat(contextList[i], nodeList);
//    // console.log("text of Flatlist is :", text);
//     FlatListUpdatedArray.push(text);
//   }
//   return FlatListUpdatedArray;
// };

// const readFlat = (context, nodeList) => {
//   var res = "";
//   for (let j = 0; j < nodeList.length; j++) {
//     // console.log("context", context, "listnode", nodeList[j]);
//     for (let k = 0; k < context.length; k++) {
//       const text = traverse(context[k], nodeList[j]);
//       // console.log("text value is here ",text);
//       res += text + " ";
//       // console.log("text value is res ", res);
//     }
//   }
//   return res;
// }

// const traverse = (node, targetId) => {
//   if (node?.props?.id === targetId) {
//     return node.props.children;
//   }
//   // console.log("node inside :", node);
//   if (node?.props?.children) {
//     if (Array.isArray(node.props.children)) {
//       for (const child of node.props.children) {
//         const result = traverse(child, targetId);
//         if (result) {
//           return result;
//         }
//       }
//     } else {
//       return traverse(node.props.children, targetId);
//     }
//   }
//   return "";
// }

// // Function to check if "SIP" is present in any string of the array
// const isSIPPresent = (array) => {
//   for (let i = 0; i < array.length; i++) {
//     if (array[i].includes(constantString.sip)) {
//       return true;
//     }
//   }
//   return false;
// }

// // Function to replace 'SIP' with 'S.I.P.'
// function replaceSIP(input) {
//   // Check if the input is not null or undefined and is a string
//   if (input && typeof input === 'string') {
//       return input.replace(/SIP/g, "S.I.P.");
//   }
//   // Return the original input if it's null, undefined, or not a string
//   return input;
// }

// const removeMinimumAmount = (dataArray) => {
//   for (var i = 0; i < dataArray.length; i++) {
//     console.log("fund details","1");
//     // Check if the element contains "Minimum Amount: ₹ 100"
//     if (dataArray[i].includes("100")) {
//       console.log("fund details","2");
//       // Remove the element from the array
//       dataArray.splice(i, 1);
//       break; // Stop iterating after the first occurrence is removed
//     }
//   }
//   console.log("fund details","3");
//   return dataArray;
// }

const clearListReadingVariables = () => {
  generalPayeeList = null;
  listIndex = -1;
  totalListIndex = -1;
  totalReadTransactions = 0;
  readMoreTransactionsDone = false;
  isReverseMode = false;
  totalReadItemsCount = 0;
  listCount = 0;
  readMoreCount = 0;
  tempReadListCount = 0;
  // ViewParser.currentlySelectedRowView = null;
  //planAmountList.clear();
}

export const setReadMoreCount = (rMoreCount) => {
  readMoreCount = rMoreCount;
}

export const setListIndex = (index) => {
  listIndex = index;
}

export const clearMutualFundList = () => {
  generalPayeeList = null;
}

export const setCheckFlowHelpCommand = (checkFlag) => {
  checkFlowForHelpCommand = checkFlag;
}

export const isStringHasOnlyNumber = (myString)=>{
  const isNumeric = !isNaN(Number(myString));
  return isNumeric;
}

// export const setInputFilter = (value) => {
//   input_filter = value;
// }
// required for direct fund selection using name, uncomment that time
// export function findIndexByFundName(data, input) {
//   console.log("inside findIndexByFundName", input);
  
//   let extractedData="";
//   let separatedTexts="";
//   extractedData = data.map(extractDataOnlySchemeName);
//   separatedTexts = extractedData.map((item, index) => {
//     let modifiedString = item.scheme.replace(/-/g, "").replace(/&/g, "and").replace(/:/g, "").replace("SMALLCAP", "small cap").replace("MIDCAP", "mid cap").replace("FLEXICAP", "flexi cap").replace(/[()]/g, '').replace(/(FUND)(FOF)/g, '$1 $2').replace(/nippon india\s*/gi, "");
//     modifiedString = modifiedString.replace(/\s\s+/g, ' ');
//     return `${modifiedString}`;
//     // return `${item.scheme}`;
//   });

//   // console.log("scheme data", separatedTexts);

//   var matchWords = ["select", "choose", "proceed", "continue", "invest", "in", "the"];
//   // Join match words into a regular expression pattern for splitting
//   var regexPattern = new RegExp("(" + matchWords.join("|") + ")", "i");

//   // Split the input string to get the fund name part
//   var splitInput = input.replace(/&/g, "and").replace(/jr\.?/gi, "junior").replace(/[,.]/g, "").replace(/guilt|guild|jilt|jild|jint/gi, "gilt").replace(/nippon india\s*/gi, "");
//   splitInput = splitInput.split(regexPattern);
//   console.log("split input:", splitInput);

//    // Extract the fund name part
//   var fundName = splitInput[splitInput.length - 1].trim();
//   console.log("fund name", fundName);
//   for (var i = 0; i < separatedTexts.length; i++) {
//     //console.log("before matched", separatedTexts[i].toLowerCase());
//     //console.log("before matched", fundName);
//     //console.log("before matched", typeof separatedTexts[i].toLowerCase());
//     //console.log("before matched", typeof fundName);
//     var schemeName = separatedTexts[i];
//       // Check if the current string contains the input fund name
//       if (schemeName.toLowerCase() === fundName) {
//         console.log("exact matched", separatedTexts[i]);
//           return i; // Return the index if found
//       }
//   }
//   return -1; // Return -1 if the fund is not found
// }

// export function findIndexByFundName(data, input) {
//   console.log("inside findIndexByFundName", input);

//   // Helper functions
//   function removeSpecialCharacters(input) {
//       return input.replace(/[^a-zA-Z0-9 ]/g, " ");
//   }

//   function removeDoubleSpaces(input) {
//       return input.replace(/\s+/g, " ");
//   }

//   function getFilteredTextForFundList(input) {
//       let result = input;
//       const stopWords = ["select", "choose", "proceed", "continue", "invest", "in", "the", "delete", "remove"];
//       stopWords.forEach(word => {
//           result = result.replace(new RegExp("\\b" + word + "\\b", "gi"), "");
//       });
//       return result;
//   }

//   function findTitleWithHighestPercentage(list) {
//       let maxTitle = null;
//       // let maxPercentage = 0.0;
//       let maxPercentage = 59;

//       list.forEach(([title, percentage]) => {
//           if (percentage > maxPercentage) {
//               maxPercentage = percentage;
//               maxTitle = title;
//           }
//       });

//       return maxTitle;
//   }

//   // Extract and clean data
//   let myData = filterList(listIndex, data);
//   // let extractedData = data.map(extractDataOnlySchemeName);
//   let extractedData = myData.map(extractDataOnlySchemeName);
//   let separatedTexts;
//   if (ContextFinder.getScreenDetails().screen_number === 21) {
//     separatedTexts = extractedData.map(item => {
//       let modifiedString = item.schemeName.replace(/-/g, "")
//           .replace(/&/g, "and")
//           .replace(/:/g, "")
//           .replace("SMALLCAP", "small cap")
//           .replace("MIDCAP", "mid cap")
//           .replace("FLEXICAP", "flexi cap")
//           .replace(/[()]/g, '')
//           .replace(/(FUND)(FOF)/g, '$1 $2')
//           .replace(/nippon india\s*/gi, "");

//       modifiedString = removeSpecialCharacters(modifiedString);
//       modifiedString = removeDoubleSpaces(modifiedString);
//       modifiedString = modifiedString.trim();
//       console.log("modifiedString is: ", modifiedString);
//       return modifiedString;
//   });
//   } else {
//     separatedTexts = extractedData.map(item => {
//       let modifiedString = item.scheme.replace(/-/g, "")
//           .replace(/&/g, "and")
//           .replace(/:/g, "")
//           .replace("SMALLCAP", "small cap")
//           .replace("MIDCAP", "mid cap")
//           .replace("FLEXICAP", "flexi cap")
//           .replace(/[()]/g, '')
//           .replace(/(FUND)(FOF)/g, '$1 $2')
//           .replace(/nippon india\s*/gi, "");

//       modifiedString = removeSpecialCharacters(modifiedString);
//       modifiedString = removeDoubleSpaces(modifiedString);
//       modifiedString = modifiedString.trim();
//       console.log("modifiedString is: ", modifiedString);
//       return modifiedString;
//   });
//   }
//   // let separatedTexts = extractedData.map(item => {
//   //     let modifiedString = item.scheme.replace(/-/g, "")
//   //         .replace(/&/g, "and")
//   //         .replace(/:/g, "")
//   //         .replace("SMALLCAP", "small cap")
//   //         .replace("MIDCAP", "mid cap")
//   //         .replace("FLEXICAP", "flexi cap")
//   //         .replace(/[()]/g, '')
//   //         .replace(/(FUND)(FOF)/g, '$1 $2')
//   //         .replace(/nippon india\s*/gi, "");

//   //     modifiedString = removeSpecialCharacters(modifiedString);
//   //     modifiedString = removeDoubleSpaces(modifiedString);
//   //     modifiedString = modifiedString.trim();
//   //     console.log("modifiedString is: ", modifiedString);
//   //     return modifiedString;
//   // });

//   // Clean and process input
//   let processedInput = input.replace(/&/g, "and")
//       .replace(/jr\.?/gi, "junior")
//       .replace(/[,.]/g, "")
//       .replace(/guilt|guild|jilt|jild|jint/gi, "gilt")
//       .replace(/nippon india\s*/gi, "");
  
//   processedInput = processedInput.split(/\s+/).map(word => word.toLowerCase()).join(" ");
//   processedInput = getFilteredTextForFundList(processedInput);
//   processedInput = removeDoubleSpaces(processedInput).trim();

//   const percentages = separatedTexts.map(schemeName => {
//       const words = schemeName.split(/\s+/);
//       const foundCount = words.filter(word => processedInput.includes(word.toLowerCase())).length;
//       const percentage = (foundCount / words.length) * 100;
//       return [schemeName, percentage];
//   });

//   const highestPercentageTitle = findTitleWithHighestPercentage(percentages);

//   if (highestPercentageTitle !== null) {
//       const index = separatedTexts.indexOf(highestPercentageTitle);
//       if (index !== -1) {
//           console.log("Title with the highest percentage:", highestPercentageTitle);
//           return index;
//       }
//   }

//   console.log("No titles found.");
//   return -1; // Return -1 if the fund is not found
// }

// function filterList(number, list) {
//   let filteredList = [];
//   let limit = Math.ceil((number + 1) / 3) * 3;
//   console.log("limit is: ", limit);
//   for (let i = 0; i < Math.min(limit, list.length); i++) {
//       filteredList.push(list[i]);
//   }

//   return filteredList;
// }

// export const extractDataOnlySchemeName = (fund) =>  {
//   if (ContextFinder.getScreenDetails().screen_number === 21) {
//     const { schemeName } = fund;
//     return { schemeName };
//   } else {
//     const { scheme } = fund;
//     return { scheme };
//   }
//   // const { scheme } = fund;
//   // return { scheme };
// }

// export const setIsViewCartCommandGivenFromHomeScreen = (value) => {
//   isViewCartCommandGivenFromHomeScreen = value;
// }

// export const getIsViewCartCommandGivenFromHomeScreen = () => {
//   return isViewCartCommandGivenFromHomeScreen;
// }

// Function to replace '%' with a dynamic string
export const replaceDynamicPlaceholder = (originalString, dynamicPart) => {
  // Replace the '%' symbol with the dynamic string
  return originalString?.replace('%', dynamicPart);
}

 // sample code for reading text of multiple component using their ids
              // else if (process.action_id === CustomVoiceFlags.PROCESS_CHECK_TESTING) {
              //   var nodeToRead = process.nodes_to_read;
              //   var dataArray = ViewParser.getTextContentByIds(context, nodeToRead);
              //   console.log("data to read", dataArray);
              // }


const ContextFinder = require('../utils/ContextFinder');
const VoiceEventProcessor = require('../VoiceHandler/VoiceEventProcessor');
const CustomUtils = require('../utils/CustomUtils');
const ViewParser = require('../Dataclasses/ViewParser');
export var isGlobalAmountForInvestment = false;
export var globalAmountForInvestment = 0;
export var transactionType = "";
export var isTransactionTypeFound = false;
const transactionTypeMap  = {
    "imps": "IMPS",
    "instant": "IMPS",
    "immediate": "IMPS",
    "rtgs": "RTGS",
    "neft": "NEFT",
    "eft": "NEFT",
    "nft": "NEFT"
};

export const handleProcess = (voiceResult) => {
    console.log(`voiceResult, ${voiceResult}`);
    const screenDetails = ContextFinder.getScreenDetails();
    const currentScreen = screenDetails.screen_number;
    console.log(`currentScreen, ${currentScreen}`);
    const currentProcess = VoiceEventProcessor.getCurrentProcess();
    if (currentScreen === 1 && currentProcess && currentProcess.action_intent === "process_dashboard_bank_transfer_check_balance") {
        storeGlobalCommon(voiceResult);
    }
    console.log('Current Process:', currentProcess);
    if (currentProcess && currentProcess.is_question) {
        console.log(`process_take, ${voiceResult}`);
        VoiceEventProcessor.handleQuestionAnswer(voiceResult);
    } else {
        console.log("onVoiceEvent- 13", "13");
        VoiceEventProcessor.handleCommandByPhrase(voiceResult);
    }
};

const storeGlobalCommon = (voiceResult) => {
    var tempResult = voiceResult;
    let tempTransactionType = "";
    var tempAmount = CustomUtils.getAmountFromVoiceResult(tempResult);
    console.log("GCP-amount from voice result", tempAmount);
    if (tempAmount > 0) {
        isGlobalAmountForInvestment = true;
        globalAmountForInvestment = tempAmount;
    }
    const strArray = tempResult.split(' ');
    for (let str of strArray) {
        console.log("voice result 6", str);
        let finalStr = ViewParser.removeUnwantedPrefixAndSuffixChar(str);
        console.log("voice result 7", finalStr);
        if (transactionTypeMap.hasOwnProperty(finalStr.toLowerCase())) {
            console.log("voice result 8", finalStr);
            tempTransactionType = transactionTypeMap[finalStr.toLowerCase()];
            console.log("voice result 9", tempTransactionType);
            break;
        }
    }
    if (tempTransactionType) {
        transactionType = tempTransactionType;
        isTransactionTypeFound = true;
    }
    console.log("GCP-Transaction type voice result", transactionType);
}

import {getFilteredText, isSpelling, containsSpelling, replaceSpacesIfPronouncedAsSpelling } from '../PatternHelper/PatternHelper';
const TAG = "ViewParser";
export var absoulteReturnGreaterThan25 = false;

export const parseUserInput = (result, replaceStopWords) => {
    const output = new Array();
    for (let i = 0; i < result.indices.length; i++) {
        var input = result[i];
        if (isSpelling(input)) {   
            //LogUtils.log(TAG, "isSpelling = true");
            //LogUtils.log(TAG, "before spelling check = $input");
            input = input.replace(/ /g, "");            
            //LogUtils.log(TAG, "after spelling check = $input");
        }
        if (containsSpelling(input)) {  
            //LogUtils.log(TAG, "contains spelling = true");
            //LogUtils.log(TAG, "before spelling check = $input");
            input = replaceSpacesIfPronouncedAsSpelling(input);  
            //LogUtils.log(TAG, "after spelling check = $input");
        }
        input = input.replace(/-/g, " ");        
        input = input.replace(/'/g, " ");  
        if (replaceStopWords) {
            //LogUtils.log(TAG, "replace stop words = true");
            //LogUtils.log(TAG, "before replace stop words = $input");
            input = getFilteredText(input);  
            //LogUtils.log(TAG, "after replace stop words = $input");
        }
        output.push(input);
    }
    return output;
}

export const removeUnwantedPrefixAndSuffixChar = (text) => {
  let result = text;
  result = result.trim();
  result = result.replace(/^www\./, "");
  result = result.replace(/\.com$/, "");
    
  if (result.length > 0 && !result.charAt(result.length - 1).match(/[a-zA-Z0-9]/)) {
    result = result.substring(0, result.length - 1);
  }

  // Remove non-alphanumeric character from the beginning
  if (result.length > 0 && !result.charAt(0).match(/[a-zA-Z0-9]/)) {
    result = result.substring(1);
  }

  result = result.trim();
  return result;
}

export const removeUnwantedSuffixChar = (text) => {
  let result = text;
  result = result.trim().toLowerCase();
  result = result.replace(/^www\./, '');
  result = result.replace(/\.com$/, '');
  result = result.replace("rs.", "rs ");
  result = result.replace(/-/g, ''); // Use the 'g' flag for global replacement

  if (result.length > 0 && !result[result.length - 1].match(/[a-zA-Z0-9]/)) {
    result = result.substring(0, result.length - 1);
  }
  result = result.trim();
  return result;
}


// get text of component based on document and its id
export const getNodeText = (context, nodeID) => {
  console.log("getNodeText-1", context);
  console.log("getNodeText-2", nodeID);
  if (!context || !nodeID) {
    console.error('Invalid context or nodeID');
    return "";
  }
  const element = context.getElementById(nodeID);
  console.log("element", element);

  if (element) {
    const nodeText = element.textContent;
    console.log("nodeText", nodeText);
    return nodeText;
  } else {
    console.warn(`Element with ID ${nodeID} not found.`);
    return "";
  }
}

// get component based on document and its id
export const getViewById = (context, nodeID) => {
  var node = "";
  if (context) {
    const element = context.getElementById(nodeID);
    node =  element;
  } 
  console.log("node", node);
  return node;
}

// get text of multiple components based on document and their ids
export const getTextContentByIds = (document, ids) => {
  console.log("getTextContentByIds");
  return ids.map(id => {
    const element = document.getElementById(id);
    console.log("element", element);
    if (element && element.tagName.toLowerCase() === 'button') {
      if (element.classList.contains('active')) {
        return element.textContent; 
      }
    }
    if (element && element.tagName.toLowerCase() === 'input') {
      return element.value;
    }
    return element ? element.textContent : null;
  });
}


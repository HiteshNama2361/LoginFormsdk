const SPELLING = /(\s|^)([\w\d]\s([\w\d][\s])*[\w\d])(\s|$)/;
const NUMBER_ONLY = /\d+/;

export const replaceSpacesIfPronouncedAsSpelling = (input) => {
 var input = input;
    const matcher = SPELLING.exec(input);  
        while (matcher) {
            const text = matcher[0];  
            const replacement = " " + text.replace(/\s/g, "") + " ";
            input = input.replace(text, replacement);
        }
        return input;
}
export const containsSpelling = (text) => {
    return SPELLING.exec(text);
}
export const isSpelling = (text) => {
    return SPELLING.test(text); 
}
export const getFilteredText = (fullText) =>{
    // const stopWords = LouieSdk.applicationContext?.resources?.getStringArray(R.array.stopWords); // TO CHECK
    // const fullTextArray = fullText.split(" ");
    // const linkedHashSet = [...new Set(fullTextArray)];
    // const result = new array(hashSet);  // 
    //     if (fullText.toLowerCase() !== "delete chat") {
    //         if (stopWords !== null) {
    //             for (const lineElement in stopWords) {
    //                 if (result.includes(lineElement)) {
    //                   const index = result.indexOf(lineElement);
    //                   result.splice(index, 1);
    //                 }
    //             }
    //         }
    //     }
    // return result.toString().replace(/,/g, "").replace(/\[/g, "").replace(/\]/g, "");
}

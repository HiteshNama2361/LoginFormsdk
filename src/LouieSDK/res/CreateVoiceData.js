// const processMap = require('../models/Process');
// const screenMap = require('../models/ScreenDetails');
import { processMap } from '../models/Process';
import { screenMap } from '../models/ScreenDetails';

// import { myJSONData } from '../LouieSdk';

//var myJSONData = require('../models/modelDC');

const myJSONData = require('../raw/app.json');
//import {myJSONData} from '../raw/app.json';

export const data = myJSONData;
console.log("data", data);


// const myRawDate = data.match_words.expire_date;
// const expireDate = new Date(myRawDate);

const ids = new Map();
const matchWords = new Map();
for (const key in data.ids) {
    //console.log(key,screens[key]);
    ids.set(key,data.ids[key]);
}
    
for (const key in data.match_words) {
    //console.log(key,screens[key]);
    matchWords.set(key,data.match_words[key]); 
}

console.log("11111111", processMap);
console.log("11111111", screenMap)
//console.log(typeof(processMap.get("process_start_primary_command")));
export {ids, matchWords, processMap, screenMap} ;

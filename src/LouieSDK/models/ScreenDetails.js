import data from "../raw/app.json";
const jsonData = data;
class ScreenDetails {
  constructor(data) {
    this.name = data.name || "";
    this.screen_number = data.screen_number || -1;
    this.details = data.details || null;
    this.id_types = data.id_types || null;
    this.commands = data.commands || [];
    this.supported_command_speakable = data.supported_command_speakable || [];
    this.primary_command = data.primary_command || "";
    this.direct_search_command = data.direct_search_command || null;
    this.verbosity_set_next = data.verbosity_set_next || "";
    this.help_commands = data.help_commands || "";
    this.help_commands_more = data.help_commands_more || "";
    this.restricted_words = data.restricted_words || null;
    this.screen_type = data.screen_type || "";
  }
}

//const myObject = new ScreenDetails(jsondata);

const screenMap = new Map();
for (const key in jsonData.screens) {
  const myObject = new ScreenDetails(jsonData.screens[key]);
  screenMap.set(key, myObject);
  //console.log(`${key} has ${myObject.name}`);
}
// screenMap.forEach((value,key)=>{
//       console.log(key+ " has " +value.name);
//   });
console.log("****456",screenMap);
// export default {screenMap};
export{screenMap};



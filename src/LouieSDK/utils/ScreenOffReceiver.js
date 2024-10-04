//import { stopListening } from '../VoiceHandler/WebSpeech';
import { stopVoiceSession } from '../LouieSDK';

const handleVisibilityChange = () => {
  if (document.visibilityState === 'hidden') {
    stopVoiceSession();
    console.log('Page is hidden, stopping voice session.');
  } else {
    console.log('Page is visible.');
  }
};

// const handleFocusChange = () => {
//   if (document.hasFocus()) {
//     console.log('Page has focus.');
//   } else {
//     console.log('Page lost focus.');
//     stopListening();
//     stopVoiceSession();
//   }
// };

export const addScreenOffReceiver = () => {
  console.log("add EventListener");
  document.addEventListener('visibilitychange', handleVisibilityChange);
  //window.addEventListener('focus', handleFocusChange);
  //window.addEventListener('blur', handleFocusChange);

}

export const removeScreenOffReceiver = () => {
  document.removeEventListener('visibilitychange', handleVisibilityChange);
  //window.removeEventListener('focus', handleFocusChange);
  //window.removeEventListener('blur', handleFocusChange);
}
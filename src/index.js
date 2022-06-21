import '../vendors/materialize.min.css';
import '../vendors/materialize.min.js';

import { getDocumentCookies, pressedKeyIsEnter } from './utils';
import getBrowserFingerPrint, { setClientFingerPrint } from './fingerprint';
import BankBuddyWebSocket from './ws';
import formatOutgoingMessage from './socketMessages';
import { startAudioRecording, stopAudioRecording } from './audioVideo';

// GLOBAL VARIABLES
const TEXT_INPUT = document.getElementById(process.env.INPUT_ID); // Text input element
const SEND_BUTTON = document.getElementById(process.env.SEND_BUTTON_ID); // Send button element
const MIC_ICON = document.getElementById(process.env.MIC_ICON_ID);
window.RECORDING = false; // A variable indicating if the user is currently recording a message
window.RECORDER = null; // A reference to the media recorder that is used to record audio and video
let GLOBAL_WEBSOCKET; // Global websocket variable

async function init() {
  // STEP 1: SET CLIENT FINGER PRINT

  let clientFP; // clientFP stands for Client Fingerprint. It is collected from Fingerprint.js

  const cookies = getDocumentCookies();

  clientFP =
    cookies !== {} &&
    cookies['sender'] != undefined &&
    cookies['sender'].length > 0
      ? cookies['sender']
      : (await getBrowserFingerPrint()).visitorId;

  console.log('1. Browser Fp Sent');

  setClientFingerPrint(clientFP);

  // STEP 2: CREATE WEBSOCKET
  window.GLOBAL_WEBSOCKET = new BankBuddyWebSocket(process.env.WEBSOCKET_URL);

  window.GLOBAL_WEBSOCKET.addEventListener('open', () => {
    console.log('WebSocket connected');
    window.GLOBAL_WEBSOCKET.sendJSONMessage(
      formatOutgoingMessage('', {
        getConfig: true,
      }),
    );
  });

  window.GLOBAL_WEBSOCKET.addEventListener('error', (errorEvent) => {
    console.log(errorEvent);
  });

  // STEP 3: SETUP EVENT LISTENERS ON TEXT INPUT AND SEND BUTTON
  // TODO: STEP 3
  TEXT_INPUT.addEventListener('keypress', function (keyBoardEvent) {
    if (pressedKeyIsEnter(keyBoardEvent)) {
      let message = TEXT_INPUT.value;
      GLOBAL_WEBSOCKET.sendMessage(formatOutgoingMessage(message));
    }
  });

  MIC_ICON.addEventListener('click', async (clickEvent) => {
    if (!window.RECORDING) startAudioRecording();
    else {
      let audio = await stopAudioRecording();
      GLOBAL_WEBSOCKET.sendAudioMessage(audio);
    }
  });
}

document.addEventListener('DOMContentLoaded', init);

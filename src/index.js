import '../vendors/materialize.min.css';
import '../vendors/materialize.min.js';

import { getDocumentCookies, pressedKeyIsEnter } from './utils';
import getBrowserFingerPrint, { setClientFingerPrint } from './fingerprint';
import BankBuddyWebSocket from './ws';
import formatOutgoingMessage from './socketMessages';

// GLOBAL VARIABLES
const TEXT_INPUT = document.getElementById('textinput'); // Text input element
const SEND_BUTTON = document.getElementById('sendbutton'); // Send button element
const MEDIA_RECORDING = false; // A variable indicating if the user is currently recording a message
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
      : await getBrowserFingerPrint().visitorId;

  console.log('1. Browser Fp Sent');

  setClientFingerPrint(clientFP);

  // STEP 2: CREATE WEBSOCKET
  GLOBAL_WEBSOCKET = new BankBuddyWebSocket(process.env.WEBSOCKET_URL);

  GLOBAL_WEBSOCKET.addEventListener('open', () => {
    console.log('WebSocket connected');
    GLOBAL_WEBSOCKET.sendJSONMessage(
      formatOutgoingMessage('', {
        getConfig: true,
      }),
    );
  });

  GLOBAL_WEBSOCKET.addEventListener('error', (errorEvent) => {
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
}

document.addEventListener('DOMContentLoaded', init);

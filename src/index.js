/**
 * NOTE: JUMP TO THE LAST LINE TO TRACE THE ORDER OF EXECUTION. THE LAST LINE IS THE FIRST FUNCTION TO BE PUSHED TO THE
 *       EXECUTION STACK.
 *
 * Entry point for the chatbot application. All the functions, classes in other modules
 * are used here.
 *
 * This script attaches the event listeners to all the necessary objects
 */
import './style.css';

import {
  pressedKeyIsEnter,
  getInputValueAndClearInput,
  makeChangesToChatbotAccordingToConfiguration,
} from './utils';

import {
  scrollToBottom,
  displayBotMessage,
  displayUserMessage,
  clearQuickReplies,
  menuToggler,
} from './dom';

import { initializeFingerPrint } from './fingerprint';

import BankBuddyWebSocket from './ws';

import formatOutgoingMessage, { defaultMessageParser } from './socketMessages';

import { startAudioRecording, stopAudioRecording } from './audioVideo';

// GLOBAL VARIABLES
const TEXT_INPUT = document.getElementById(process.env.INPUT_ID); // Text input element
const SEND_BUTTON = document.getElementById(process.env.SEND_BUTTON_ID); // Send button element
const MIC_ICON = document.getElementById(process.env.MIC_ICON_ID); // MIC ICON for recording audio
const MESSAGES_CONTAINER = document.getElementById(
  process.env.MESSAGES_CONTAINER,
); // Container for messages and their containers

// WINDOW VARIABLES FOR GLOBAL REFERENCES
window.RECORDING = false; // A variable indicating if the user is currently recording a message
window.RECORDER = null; // A reference to the media recorder that is used to record audio and video

function initializeWebSocket() {
  window.GLOBAL_WEBSOCKET = new BankBuddyWebSocket(process.env.WEBSOCKET_URL);

  // Open a websocket and send first message to get chatbot config
  window.GLOBAL_WEBSOCKET.addEventListener('open', () => {
    console.log('WebSocket connected');
    window.GLOBAL_WEBSOCKET.sendJSONMessage(
      formatOutgoingMessage('', {
        getConfig: true,
      }),
    );
  });

  // Display the bot message when the bot replies.
  window.GLOBAL_WEBSOCKET.addEventListener(
    'message',
    async function (messageEvent) {
      let responseObject = await window.GLOBAL_WEBSOCKET.parseIncomingMessage(
        messageEvent.data,
        defaultMessageParser,
      );

      if (responseObject.isConfMessage)
        makeChangesToChatbotAccordingToConfiguration(responseObject); // Used only once when socket is initialised

      if (!responseObject.isConfMessage) displayBotMessage(responseObject);

      scrollToBottom(MESSAGES_CONTAINER);
    },
  );

  // Log the error when the websocket throws an error
  window.GLOBAL_WEBSOCKET.addEventListener('error', (errorEvent) => {
    console.log(errorEvent);
  });
}

function initializeEventListeners() {
  // Add event listener: input, send the message in the input when enter is pressed while still in input
  TEXT_INPUT.addEventListener('keypress', function (keyBoardEvent) {
    if (pressedKeyIsEnter(keyBoardEvent)) {
      let message = getInputValueAndClearInput(TEXT_INPUT);
      if (message) {
        window.GLOBAL_WEBSOCKET.sendJSONMessage(formatOutgoingMessage(message));
        displayUserMessage(message);
        scrollToBottom(MESSAGES_CONTAINER);
        clearQuickReplies();
      }
    }
  });

  // Add event listener: send_button, send the message in the input when paperplane button is clicked
  SEND_BUTTON.addEventListener('click', function (clickEvent) {
    let message = getInputValueAndClearInput(TEXT_INPUT);
    if (message) {
      window.GLOBAL_WEBSOCKET.sendJSONMessage(formatOutgoingMessage(message));
      displayUserMessage(message);
      scrollToBottom(MESSAGES_CONTAINER);
      clearQuickReplies();
    }
  });

  // Send the audio recording when audio is recorded by clicking the mic icon
  MIC_ICON.addEventListener('click', async (clickEvent) => {
    if (!window.RECORDING) startAudioRecording();
    else {
      let audioBlob = await stopAudioRecording();
      await window.GLOBAL_WEBSOCKET.sendAudioMessage(audioBlob);
    }
  });

  // Remove the menu tray when de-focused
  document
    .querySelector('#dropdownButton')
    .addEventListener('click', menuToggler);
}

function init() {
  initializeFingerPrint();
  initializeWebSocket();
  initializeEventListeners();

  scrollToBottom(MESSAGES_CONTAINER);
}

// JavaScript execution starts from here after HTML,CSS and JS files are parsed
document.addEventListener('DOMContentLoaded', init);

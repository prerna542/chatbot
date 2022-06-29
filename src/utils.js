/**
 * @module Utilities
 * @description Utility functions like getting cookies, setting cookies, changing arrayBuffer to base64 string etc
 */

import { createWidgetButton } from './dom';
/**
 * A function to get the documents cookies as a JS object
 * @returns {Object} The documents cookies as a JS object
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie
 * @example
 * const cookies = getDocumentCookies();
 * console.log(cookies);
 * // {
 * //   "sender": "123456789",
 * //   "receiver": "987654321"
 * }
 */
export function getDocumentCookies() {
  return document.cookie === ''
    ? {}
    : document.cookie
        .split('; ')
        .map((cookieKeyValueString) => {
          const SEPERATOR_INDEX = cookieKeyValueString.indexOf('=');
          return [
            cookieKeyValueString.slice(0, SEPERATOR_INDEX).trim(),
            cookieKeyValueString.slice(SEPERATOR_INDEX + 1),
          ];
        })
        .reduce(
          (cookieObject, cookieKeyValueArray) => ({
            ...cookieObject,
            [cookieKeyValueArray[0]]: cookieKeyValueArray[1],
          }),
          {},
        );
}

/**
 * A function to set a cookie in the browser
 * @param {string} key The key of the cookie to be set
 * @param {string} value The value of the cookie to be set
 * @returns {void} Sets a cookie in the browser
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie
 * @example
 * setDocumentCookie('sender', '123456789');
 * setDocumentCookie('receiver', '987654321');
 * console.log(getDocumentCookies());
 * // {
 * //   "sender": "123456789",
 * //   "receiver": "987654321"
 * // }
 */
export function setDocumentCookie(key, value) {
  document.cookie = `${document.cookie}; ${key}=${value}`;
}

/**
 * A utiltiy function to check if pressed key is enter key.
 * @param {KeyboardEvent} keyBoardEvent
 * @returns {boolean} true if pressed key is enter key.
 * @example
 * const isEnterKey = isEnterKeyPressed(event);
 * console.log(isEnterKey);
 * // true
 */
export function pressedKeyIsEnter(keyBoardEvent) {
  return keyBoardEvent.code === 'Enter';
}

/**
 * Clears the given input and returns its value
 * @param {HTMLInputElement} inputElement
 * @returns {string} The value contained in the input element
 */
export function getInputValueAndClearInput(inputElement) {
  let typedValue = inputElement.value; // Get value of input element
  inputElement.value = ''; // Clear the input display value
  return typedValue; // Return the value contained in the input
}

/**
 * Converts an array buffer to base64 string
 * @param {ArrayBuffer} arrayBuffer The ArrayBuffer to convert to base64
 * @returns {Promise<string>}
 * @async
 */
export function arrayBufferToBase64(arrayBuffer) {
  return Promise.resolve(
    window.btoa(
      new Uint8Array(arrayBuffer).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        '',
      ),
    ),
  );
}

export function makeChangesToChatbotAccordingToConfiguration(responseObject) {
  const { widgets, title, subtitle, logo } = responseObject.conf;
  // Step 1: Add title,subtitle logo
  document.getElementById(process.env.BOT_IMAGE).src = logo;
  document.getElementById(process.env.BOT_HEADING).innerText = title;
  document.getElementById(process.env.BOT_SUBHEADING).innerText = subtitle;

  // Step 2: Add icons
  const { accessCamera, attachFiles, attachImage, location, microphone } =
    widgets;
  const WIDGETS_CONTAINER = document.getElementById(
    process.env.WIDGETS_LIST_UL,
  );
  if (accessCamera) WIDGETS_CONTAINER.append(createWidgetButton('camera'));
  if (attachFiles) WIDGETS_CONTAINER.append(createWidgetButton('paperclip'));
  if (attachImage) WIDGETS_CONTAINER.append(createWidgetButton('image'));
  if (location) WIDGETS_CONTAINER.append(createWidgetButton('location-pin'));

  if (!microphone) MIC_ICON.parentNode.removeChild(MIC_ICON);

  const ELLIPSIS_SHOULD_BE_REMOVED = [
    accessCamera,
    attachFiles,
    attachImage,
    location,
    microphone,
  ].every((value) => value == false);

  // Remove Ellipsis button if no buttons are needed in the tray
  if (ELLIPSIS_SHOULD_BE_REMOVED) {
    document
      .getElementById(process.env.DROPDOWN_BUTTON)
      .parentNode.removeChild(
        document.getElementById(process.env.DROPDOWN_BUTTON),
      );
  }
}

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

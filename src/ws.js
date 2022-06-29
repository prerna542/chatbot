/**
 * @module BankBuddyWebSocket
 * @description Custom Classes and functions to work with WebSockets. Tailored specific to BankBuddy Chatbots
 */
import formatOutgoingMessage from './socketMessages';
import { arrayBufferToBase64 } from './utils';

/**
 * Subclass of WebSocket with some more methods to help sending different types of messages easy
 */
class BankBuddyWebSocket extends WebSocket {
  /**
   * Create a BankBuddyWebSocket connection to the specified parameter
   * @param {string} url The url of the WebSocket server to connect. It should always start with `wss://` or `ws://`
   * @param {string[]} protocols The protocols needed to support the websocket. `Default []`.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/WebSocket
   */
  constructor(url, protocols = []) {
    super(url, protocols);
  }

  /**
   * Message to send plain JSON object through the WebSocket
   * @param {Object} message the message to send. use `socketMessages.formatOutgoingMessage(message)` as `message`
   * @example
   * let socket= new BankBuddyWebSocket(URL)
   * socket.sendJSONMessage(socketMessages.formatOutgoingMessage(message))
   */
  sendJSONMessage(message) {
    super.send(JSON.stringify(message));
  }

  /**
   * Send a file to the server. **The `ArrayBuffer` will be converted to `base64` string before being sent to the server
   * @param {ArrayBuffer} file The file to be sent to the server
   * @async
   */
  async sendFileMessage(file) {
    let base64FileBlob = await arrayBufferToBase64(file);
    super.send(formatOutgoingMessage(base64FileBlob, { messageType: 'file' }));
  }

  /**
   * Send an audio file to the server. **The `ArrayBuffer` will be converted to `base64` string before being sent to the server
   * @param {ArrayBuffer} audio The audio to be sent to the server
   * @async
   */
  async sendAudioMessage(audio) {
    let base64AudioBlob = await arrayBufferToBase64(audio);

    super.send(
      JSON.stringify(
        formatOutgoingMessage(base64AudioBlob, { messageType: 'audio' }),
      ),
    );
  }

  /**
   * Parse the incoming socket message
   * @param {string} message The message to be parsed
   * @param {function} parserFunc The function to be used for parsing. Default is `JSON.parse`. The function should accept a single parameter and return the parsed response
   * @returns {Promise<Object>} The parsed object
   * @static
   * @async
   * @example
   * BankBuddyWebSocket.parseIncomingMessage(message, message =>{
   * let parsedMessage=JSON.parse(message)
   * return doSomeObjectModification(parsedMessage)
   * })
   */
  parseIncomingMessage(message, parserFunc = JSON.parse) {
    if (!parserFunc) return message;
    return Promise.resolve(parserFunc(message));
  }
}

export default BankBuddyWebSocket;

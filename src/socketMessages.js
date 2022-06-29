/**
 * @module Socket Message Formatter
 * @description Functions required to format the messages that should be sent through `BankBuddyWebSocket`
 */
import { getClientFingerPrint } from './fingerprint';
// Outgoing Message
// ------------------------------------------------------------
/**
 * Returns a JSON object with following keys `{get_config,tenant,sender}` that are to be sent to WebSocket server of `BankBuddyWebSocket`
 * @param {string|ArrayBuffer} message The message to be sent.
 * @param {object} config The configuration object to be used for creating the returned object. The keys and their default values are:
 *
 * - messageType: string  -> `"text"`
 * - getConfig  : boolean -> `false`
 * - sender     : string  -> `getClientFingerPrint()`
 * - tenant     : string  -> `process.env.TENANT_ID`
 * @returns {object} Returns a JSON object with following keys `{get_config,tenant,sender}`
 */
function formatOutgoingMessage(
  message,
  { messageType, getConfig, sender, tenant } = {},
) {
  /*
    The message to be sent to the server should be an object which should be
    stringified. The keys of the object are:
    1. tenant: string      -> The tenant id of the bot or the user. Usually taken
                              from the URL
    2. sender: string      -> The id of the sender. It is stored in the cookies
                              by the server. Front end has to retrieve it.
    3. get_config: boolean -> This indicated if the message is a reply from
                              user or sent by frontend to get frontend config.
                              It is false if the user is sending a message
    4. text: string        -> The message to be sent. This key should be present
                              only if the message is text
    5. audio_b64: string   -> If the message being sent is an audio, its Blob
                              content should be encoded in base_64.
    6. file_b64: string    -> Same as the audio message but a different file format.

    Only one of the three message types should be present in the object
  */
  getConfig = getConfig || false;

  messageType = messageType || 'text';

  sender = sender || getClientFingerPrint();

  tenant =
    tenant ||
    new URL(window.location.href).searchParams.get('tenant') ||
    process.env.TENANT_ID;

  let messageObject = { tenant, sender, get_config: getConfig };

  if (!message || message === null || message === undefined)
    return messageObject;

  switch (messageType) {
    case 'text':
      messageObject.message = message;
      break;
    case 'audio':
      messageObject.audio_b64 = message;
      break;
    case 'file':
      messageObject.file_b64 = message;
      break;
  }

  return messageObject;
}

function defaultMessageParser(message) {
  let parsedMessage = JSON.parse(message),
    objectToReturn = {};
  objectToReturn['isConfMessage'] = 'conf' in parsedMessage;
  objectToReturn['conf'] = parsedMessage['conf'];
  objectToReturn['displayAsCarousel'] =
    'data' in parsedMessage && parsedMessage.data.length > 1;
  objectToReturn['quickReplies'] = parsedMessage['quick_replies'];
  objectToReturn['data'] = parsedMessage.data;

  return objectToReturn;
}

export default formatOutgoingMessage;
export { defaultMessageParser };

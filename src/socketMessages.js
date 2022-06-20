import { getClientFingerPrint } from './fingerprint';
// Outgoing Message
// ------------------------------------------------------------
function formatOutgoingMessage(
  message,
  { messageType, getConfig, sender, tenant },
) {
  getConfig = getConfig || false;

  messageType = messageType || 'text';

  sender = sender || getClientFingerPrint();

  tenant =
    tenant ||
    new URL(window.location.href).searchParams.get('tenant') ||
    '12345';

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

export default formatOutgoingMessage;

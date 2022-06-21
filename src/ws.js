import formatOutgoingMessage from './socketMessages'

class BankBuddyWebSocket extends WebSocket {
  constructor(url, protocols = []) {
    super(url, protocols);
  }

  sendJSONMessage(message) {
    super.send(JSON.stringify(formatOutgoingMessage(message)));
  }

  sendFileMessage(file) {
    super.send(formatOutgoingMessage(file, { messageType: 'file' }));
  }

  sendAudioMessage(audio) {
    super.send(formatOutgoingMessage(audio, { messageType: 'audio' }));
  }
}

export default BankBuddyWebSocket;

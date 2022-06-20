class BankBuddyWebSocket extends WebSocket {
  constructor(url, protocols = []) {
    super(url, protocols);
  }

  sendJSONMessage(message) {
    console.warn('2. Socket Message Sent');
    super.send(JSON.stringify(message));
  }

  sendFileMessage(file) {
    return null;
  }

  sendAudioMessage(audio) {
    return null;
  }
}

export default BankBuddyWebSocket;

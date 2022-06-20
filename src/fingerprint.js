import FingerprintJS from '@fingerprintjs/fingerprintjs';

export default async function getBrowserFingerPrint() {
  const FingerPrintAgent = await FingerprintJS.load();
  const fingerprint = await FingerPrintAgent.get();

  return fingerprint;
}

export function setClientFingerPrint(fingerPrintValue) {
  window.browserFP = fingerPrintValue;
}

export function getClientFingerPrint() {
  return window.browserFP;
}
/**
 * @module Fingerprint
 * @description Functions related with working with FingerprintJS
 */
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { getDocumentCookies } from './utils';

/**
 * Uses fingerprintJS to get client print and returns the data
 * @returns {FingerprintJS.GetResult} An object that contains the results of the fingerprint
 */
export default async function getBrowserFingerPrint() {
  const FingerPrintAgent = await FingerprintJS.load();
  const fingerprint = await FingerPrintAgent.get();

  return fingerprint;
}

/**
 * Assigns the given value of variable to `window.browserFP` so it can be accessed globally
 * @param {string|number} fingerPrintValue The value of the fingerprint to be set
 */
export function setClientFingerPrint(fingerPrintValue) {
  window.browserFP = fingerPrintValue;
}

/**
 * Gets the clients Fingerprint value set by the variable `window.browserFP`
 * @returns {string|number}
 */
export function getClientFingerPrint() {
  return window.browserFP;
}

/**
 * Main funtion that uses all the defined methods in this module to get a fingerprint
 */
export async function initializeFingerPrint() {
  // STEP 1: SET CLIENT FINGER PRINT
  let clientFP; // clientFP stands for Client Fingerprint. It is collected from Fingerprint.js
  const cookies = getDocumentCookies();

  clientFP =
    cookies !== {} &&
    cookies['sender'] != undefined &&
    cookies['sender'].length > 0
      ? cookies['sender']
      : (await getBrowserFingerPrint()).visitorId;

  setClientFingerPrint(clientFP);
}

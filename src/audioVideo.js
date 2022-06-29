/**
 * @module Audio Video IO
 * @description Functions that gain access to recording devices, start and stop recording etc
 */
import { RecordRTCPromisesHandler } from 'recordrtc';

/**
 * A function that gives access to the camera and microphone of the user device.
 * By Default
 * - audio: true
 * - video: false
 * @param {boolean} audio true to enable audio, false to disable audio. Default: true
 * @param {boolean} video true to enable video, false to disable video. Default: false
 * @returns {Promise<MediaStream>} the media stream
 */
export function getDeviceAccess(audio = true, video = false) {
  return navigator.mediaDevices.getUserMedia({ audio, video });
}

/**
 * Starts recording Audio from microphone and other sources(if available)
 */
export async function startAudioRecording() {
  const stream = await getDeviceAccess(true, false);
  const recorder = new RecordRTCPromisesHandler(stream, {
    mimeType: 'audio/webm',
  });
  window.RECORDER = recorder;
  window.RECORDING = true;
  recorder.startRecording();
}

/**
 * Stops the current audio recording and returns the recorded data as an ArrayBuffer
 * @returns {ArrayBuffer}
 */
export async function stopAudioRecording() {
  await window.RECORDER.stopRecording();
  window.RECORDING = false;
  return await (await window.RECORDER.getBlob()).arrayBuffer();
}

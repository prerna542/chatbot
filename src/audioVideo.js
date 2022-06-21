import {RecordRTCPromisesHandler} from 'recordrtc'

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

export async function startAudioRecording(){
    const stream = await getDeviceAccess(true, false);
    const recorder = new RecordRTCPromisesHandler(stream,{mimeType: 'audio/webm'});
    window.RECORDER=recorder;
    window.RECORDING=true
    recorder.start();
}

export async function stopAudioRecording(){
    await window.RECORDER.stopRecording();
    window.RECORDING=false
    return await window.RECORDER.getBlob();
}
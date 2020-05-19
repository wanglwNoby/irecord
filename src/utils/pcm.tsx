

const getWebPcm2WavArrayBuffer = (bytes: any, type: number): any => (
    addWavHeader(bytes, 8000, 8, 1, type) // 这里是当前业务需求，特定的参数，采样率16000，采样位数16，声道数1
)

/**
 *
 * @param {ArrayBuffer 二进制数据}samples
 * @param {采样率}sampleRateTmp
 * @param {每样本数据位数} sampleBits
 * @param {通道数} channelCount
 * @param {格式类别} audioFormat
 */
const addWavHeader = (samples: any, sampleRateTmp: any, sampleBits: any, channelCount: any, audioFormat: any): any => {
    const dataLength = samples.byteLength

    /* 新的buffer类，预留 44 bytes的heaer 空间 */
    const buffer = new ArrayBuffer(44 + dataLength)
    /* 转为 Dataview, 利用 API 来填充字节 */
    const view = new DataView(buffer)

    let offset = 0

    /* 定义一个内部函数，以 big end 数据格式填充字符串至 DataView */
    function writeString(v: any, off: any, string: any): any {
        for (let i = 0; i < string.length; i++) {
            v.setUint8(off + i, string.charCodeAt(i))
        }
    }

    /* ChunkID, 4 bytes,  资源交换文件标识符 */
    writeString(view, offset, 'RIFF'); offset += 4
    /* ChunkSize, 4 bytes, 下个地址开始到文件尾总字节数,即文件大小-8 */
    view.setUint32(offset, /* 32 */ 36 + dataLength, true); offset += 4
    /* Format, 4 bytes, WAV文件标志 */
    writeString(view, offset, 'WAVE'); offset += 4
    /* Subchunk1 ID, 4 bytes, 波形格式标志 */
    writeString(view, offset, 'fmt '); offset += 4
    /* Subchunk1 Size, 4 bytes, 过滤字节,一般为 0x10 = 16 */
    view.setUint32(offset, 16, true); offset += 4
    /* Audio Format, 2 bytes, 格式类别 (PCM形式采样数据) */
    view.setUint16(offset, audioFormat, true); offset += 2
    /* Num Channels, 2 bytes,  通道数 */
    view.setUint16(offset, channelCount, true); offset += 2
    /* SampleRate, 4 bytes, 采样率,每秒样本数,表示每个通道的播放速度 */
    view.setUint32(offset, sampleRateTmp, true); offset += 4
    /* ByteRate, 4 bytes, 波形数据传输率 (每秒平均字节数) 通道数×每秒数据位数×每样本数据位/8 */
    view.setUint32(offset, sampleRateTmp * channelCount * (sampleBits / 8), true); offset += 4
    /* BlockAlign, 2 bytes, 快数据调整数 采样一次占用字节数 通道数×每样本的数据位数/8 */
    view.setUint16(offset, channelCount * (sampleBits / 8), true); offset += 2
    /* BitsPerSample, 2 bytes, 每样本数据位数 */
    view.setUint16(offset, sampleBits, true); offset += 2
    /* Subchunk2 ID, 4 bytes, 数据标识符 */
    writeString(view, offset, 'data'); offset += 4
    /* Subchunk2 Size, 4 bytes, 采样数据总数,即数据总大小-44 */
    view.setUint32(offset, dataLength, true); offset += 4

    /* 数据流需要以大端的方式存储，定义不同采样比特的 API */
    function floatTo32BitPCM(output: any, off: any, input: any): any {
        const newInput = new Int32Array(input)
        let o = off
        for (let i = 0; i < newInput.length; i += 1, o += 4) {
            output.setInt32(o, newInput[i], true)
        }
    }
    function floatTo16BitPCM(output: any, off: any, input: any): any {
        const newInput = new Int16Array(input)
        let o = off
        for (let i = 0; i < newInput.length; i += 1, o += 2) {
            output.setInt16(o, newInput[i], true)
        }
    }
    function floatTo8BitPCM(output: any, off: any, input: any): any {
        const newInput = new Int8Array(input)
        let o = off
        for (let i = 0; i < newInput.length; i += 1, o += 1) {
            output.setInt8(o, newInput[i], true)
        }
    }
    if (sampleBits === 16) {
        floatTo16BitPCM(view, 44, samples)
    } else if (sampleBits === 8) {
        floatTo8BitPCM(view, 44, samples)
    } else {
        floatTo32BitPCM(view, 44, samples)
    }
    return view.buffer
}

// const getWebPcm2WavBase64 = (bytes: any): any => {
//     const bytesFull = getWebPcm2WavArrayBuffer(bytes)
//     console.log('bytesFull', bytesFull)
//     return `data:audio/wav;base64,${btoa(new Uint8Array(bytesFull).reduce((data, byte): any => (
//         data + String.fromCharCode(byte)
//     ), ''))}`
// }

const scheduleBuffers = (context, audioBuffer, time): any => {
    const currentTime = context.currentTime
    const source = context.createBufferSource()

    source.buffer = audioBuffer
    source.connect(context.destination)
    const duration = source.buffer.duration

    if (currentTime > time.nextTime) {
        time.nextTime = currentTime
    }
    source.start(time.nextTime)
    // source.stop(time.nextTime + duration)
    time.nextTime += duration
}

export { getWebPcm2WavArrayBuffer, scheduleBuffers }
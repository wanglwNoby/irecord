import { AxiosResponse } from 'axios'
import axios from '../../utils/axios'

// 添加录音通道
export function _addChannel(params: IChannel): Promise<AxiosResponse<any>> {
    return axios.post('/record_config/record_channel', params, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

// 删除录音通道
export function _deleteChannel(params: IDeleteChannel): Promise<AxiosResponse<any>> {
    return axios.get('/record_config/delete_record_channel', params)
}

// 获取录音通道信息
export function _getChannel(params: IGetChannel): Promise<AxiosResponse<any>> {
    return axios.get('/record_config/get_record_channel', params)
}

// 添加归档
export function _addRecordFile(params: IRecordFile): Promise<AxiosResponse<any>> {
    return axios.post('/record_config/record_file', params, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

// 获取归档
export function _getRecordFile(params: IGetRecordFile): Promise<AxiosResponse<any>> {
    return axios.get('/record_config/get_record_file', params)
}

// 删除归档
export function _deleteRecordFile(params: IDeleteRecordFile): Promise<AxiosResponse<any>> {
    return axios.get('/record_config/delete_record_file', params)
}

// 添加下载
export function _addDownload(params: IDownload): Promise<AxiosResponse<any>> {
    return axios.post('/record_config/record_download_config', params, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

// 获取下载
export function _getDownload(params: IGetDownload): Promise<AxiosResponse<any>> {
    return axios.get('/record_config/get_record_download', params)
}

// 删除下载
export function _deleteDownload(params: IDeleteDownload): Promise<AxiosResponse<any>> {
    return axios.get('/record_config/delete_record_download', params)
}

// 编辑回删
export function _addDelete(params: IDelete): Promise<AxiosResponse<any>> {
    return axios.post('/record_config/record_delete', params, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

// 获取回删
export function _getDelete(params: IGetDelete): Promise<AxiosResponse<any>> {
    return axios.get('/record_config/get_record_delete', params)
}
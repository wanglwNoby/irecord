import { AxiosResponse } from 'axios'
import axios from '../../utils/axios'

// 添加许可服务
export function _addLicence(params: ILicence): Promise<AxiosResponse<any>> {
    return axios.post('/record_config/licence_service', params, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

// 添加录音服务
export function _addRecord(params: IRecord): Promise<AxiosResponse<any>> {
    return axios.post('/record_config/record_service', params, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

// 添加监控服务
export function _addMonitor(params: IMonitor): Promise<AxiosResponse<any>> {
    return axios.post('/record_config/monitor_service', params, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

// 添加归档回删服务
export function _addFileDelete(params: IFileDelete): Promise<AxiosResponse<any>> {
    return axios.post('/record_config/file_delete_service', params, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

// 获取master服务器
export function _getMasterServer(params: IMasterServer): Promise<AxiosResponse<any>> {
    return axios.get('/record_config/get_master_server', params)
}
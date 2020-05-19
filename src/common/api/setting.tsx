import { AxiosResponse } from 'axios'
import axios from '../../utils/axios'

// 添加录音通道
export function _getServerService(params: IServerService): Promise<AxiosResponse<any>> {
    return axios.get('/check_config/get_server_service', params)
}

// 通知本机有参数更新
export function _setNoticeParamUpdate(params: INoticeParamUpdate): Promise<AxiosResponse<any>> {
    return axios.get('/check_config/notice_param_update', params)
}

// 设置重启时间
export function _setServerRestart(params: IServerRestart): Promise<AxiosResponse<any>> {
    return axios.post('/check_config/set_server_restart', params, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}
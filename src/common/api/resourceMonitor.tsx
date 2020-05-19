import { AxiosResponse } from 'axios'
import axios from '../../utils/axios'

// 获取右侧操作按钮
export function _getRightOperation(params: IRightOperation): Promise<AxiosResponse<any>> {
    return axios.get('/options', params)
}

// 获取表头
export function _getColumns(params: IGetColumns): Promise<AxiosResponse<any>> {
    return axios.get('/view_columns/get_columns', params)
}

// 查询
export function _queryMessage(params: IQueryMessage): Promise<AxiosResponse<any>> {
    return axios.post('/resource_monitor/query_message', params, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

// 分页查询
export function _queryMessage2(params: IQueryMessage2): Promise<AxiosResponse<any>> {
    return axios.get('/resource_monitor/query_message2', params)
}

// 导出
export function _exportMessage(params: IExportMessage): Promise<AxiosResponse<any>> {
    return axios.get('/resource_monitor/export_message', {
        params,
        headers: { 'Content-Type': 'application/json,charset=utf-8' },
        responseType: 'arraybuffer'
    })
}

// 获取服务器
export function _serverList(): Promise<AxiosResponse<any>> {
    return axios.get('/server/server_list')
}

// 通过设备获取ws地址
export function _getWebsocketUrl(params: IGetWebsocketUrl): Promise<AxiosResponse<any>> {
    return axios.get('/record_config/get_websocket_url', params)
}

// 通过分机获取ws地址
export function _getExtensionWSUrl(params: IGetWebsocketUrl): Promise<AxiosResponse<any>> {
    return axios.get('/record_config/get_server_addr', params)
}

// 获取分机树
export function _getExtensionList(): Promise<AxiosResponse<any>> {
    return axios.get('/recording/extension_tree')
}
import { AxiosResponse } from 'axios'
import axios from '../../utils/axios'

// 添加DBBridge
export function _addDBBridge(params: IDBBridge): Promise<AxiosResponse<any>> {
    return axios.post('/record_config/db_bridge', params, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

// 添加数据库
export function _addDBBridgeDatabase(params: IDBBridgeDatabase): Promise<AxiosResponse<any>> {
    return axios.post('/record_config/db_bridge_database', params, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

// 获取要添加的数据库列表
export function _getDataBaseList(params: IDataBaseList): Promise<AxiosResponse<any>> {
    return axios.get('/record_config/choose_database', params)
}
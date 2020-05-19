import { AxiosResponse } from 'axios'
import axios from '../../utils/axios'

// 添加站点
export function _addLocalMachine(params: ILocalMachine): Promise<AxiosResponse<any>> {
    return axios.post('/record_config/local_machine', params, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

// 添加服务器
export function _addServerDevice(params: IServerDevice): Promise<AxiosResponse<any>> {
    return axios.post('/record_config/server_device', params, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

// 添加数据库
export function _addDatabase(params: IDatabase): Promise<AxiosResponse<any>> {
    return axios.post('/record_config/database', params, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

// 添加存储设备
export function _addStorage(params: IStorage): Promise<AxiosResponse<any>> {
    return axios.post('/record_config/storage_device', params, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

// 获取站点信息
export function _getLocalMachine(params: ILocalMachineInfo): Promise<AxiosResponse<any>> {
    return axios.get('/record_config/get_local_machine', params)
}

// 获取站点下的所有服务器作为传给存储设备所在服务器的数据
export function _getRecordConfig(params: IRecordConfigInfo): Promise<AxiosResponse<any>> {
    return axios.get('/record_config/get_record_config', params)
}

// 获取右侧操作按钮
export function _getrightOperation(params: IRightOperation): Promise<AxiosResponse<any>> {
    return axios.get('/options', params)
}

// 获取顶级机构
export function _getOrg(): Promise<AxiosResponse<any>> {
    return axios.get('/view_columns/get_org')
}

// 获取别名
export function _getMachineName(params: IMachineName): Promise<AxiosResponse<any>> {
    return axios.get('/check_config/get_machine_name', params)
}

// 获取唯一资源码
export function _getServerUid(params: IServerUid): Promise<AxiosResponse<any>> {
    return axios.get('/check_config/get_server_uid', params)
}

// 删除录音配置信息
export function _deleteConfig(params: IDeleteRecordConfig): Promise<AxiosResponse<any>> {
    return axios.get('/record_config/delete_record_config', params)
}

// 设置Restful端口
export function _setServerPort(params: IServerPort): Promise<AxiosResponse<any>> {
    return axios.post('/check_config/set_server_port', params)
}

// 设置日志存放目录
export function _setLogDirectory(params: ILogDirectory): Promise<AxiosResponse<any>> {
    return axios.post('/check_config/set_log_directory', params)
}

// 设置日志记录的等级
export function _setLogGrade(params: ILogGrade): Promise<AxiosResponse<any>> {
    return axios.post('/check_config/set_log_grade', params)
}

// 获取本机盘符根目录
export function _getDriver(params: IDriver): Promise<AxiosResponse<any>> {
    return axios.get('/check_config/get_driver', params)
}

// 获取目录的子目录
export function _getDirectory(params: IDirectory): Promise<AxiosResponse<any>> {
    return axios.get('/check_config/get_directory', params)
}
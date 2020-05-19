import { AxiosResponse } from 'axios'
import axios from '../../utils/axios'

// 获取右侧操作按钮
export function _getrightOperation(params: IRightOperation): Promise<AxiosResponse<any>> {
    return axios.get('/options', params)
}

// 获取用户坐席工号数据树菜单
export function _extensionTree(): Promise<AxiosResponse<any>> {
    return axios.get('/recording/extension_tree')
}

// 获取查询录音的表头
export function _getColumns(params: IGetColumns): Promise<AxiosResponse<any>> {
    return axios.get('/view_columns/get_columns', params)
}

// 获取报表数据
export function _getDailyCallForm(params: IGetDailyCallForm): Promise<AxiosResponse<any>> {
    return axios.post('/record_report/index', params, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

// 分页查询
export function _getDailyCallForm2(params: IGetDailyCallForm2): Promise<AxiosResponse<any>> {
    return axios.get('/record_report/index2', params)
}

// 获取用户父级
export function _getOrg(): Promise<AxiosResponse<any>> {
    return axios.get('/view_columns/get_org')
}

// 根据父级获取用户列表
export function _queryOrg(params: IQueryOrg): Promise<AxiosResponse<any>> {
    return axios.get('/view_columns/query_ou', params)
}

// 导出分机呼入呼出报表
export function _exportDaily(params: IExportExtensionCall): Promise<AxiosResponse<any>> {
    return axios.post('/record_report/export_daily', params, {
        /*   headers: { 'Content-Type': 'application/json,charset=utf-8' }, */
        responseType: 'arraybuffer'
    })
}

// 导出分机呼入呼出报表
export function _exportExtensionCall(params: IExportExtensionCall): Promise<AxiosResponse<any>> {
    return axios.post('/record_report/export_extension_call', params, {
        /*   headers: { 'Content-Type': 'application/json,charset=utf-8' }, */
        responseType: 'arraybuffer'
    })
}

// 导出回放报表
export function _exportPlayback(params: IExportPlayback): Promise<AxiosResponse<any>> {
    return axios.post('/record_report/export_playback', params, {
        /*   headers: { 'Content-Type': 'application/json,charset=utf-8' }, */
        responseType: 'arraybuffer'
    })
}

// 导出下载报表
export function _exportDownload(params: IExportDownload): Promise<AxiosResponse<any>> {
    return axios.post('/record_report/export_download', params, {
        /*   headers: { 'Content-Type': 'application/json,charset=utf-8' }, */
        responseType: 'arraybuffer'
    })
}

// 获取部门
export function _queryDepart(params: IQueryDepart): Promise<AxiosResponse<any>> {
    return axios.get('/view_columns/query_depart', params)
}

// 获取用户
export function _queryOrgUserTree(): Promise<AxiosResponse<any>> {
    return axios.get('/view_columns/queryOrgUserTree')
}

// 获取操作事件
export function _newRoleFo(params: INewRoleFo): Promise<AxiosResponse<any>> {
    return axios.get('/view_columns/new_role_fo', params)
}

// 查询操作日志
export function _getOperationLog(params: IGetOperationLog): Promise<AxiosResponse<any>> {
    return axios.post('/resource_monitor/operation_log', params, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

// 分页查询操作日志
export function _getOperationLog2(params: IGetOperationLog2): Promise<AxiosResponse<any>> {
    return axios.get('/resource_monitor/operation_log2', params)
}
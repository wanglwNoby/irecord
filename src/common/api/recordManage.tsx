import { AxiosResponse } from 'axios'
import axios from '../../utils/axios'

// 获取查询录音的表头
export function _getColumns(params: IGetColumns): Promise<AxiosResponse<any>> {
    return axios.get('/view_columns/get_columns', params)
}

// 设置自定义列
export function _saveSetting(params: ISaveSetting): Promise<AxiosResponse<any>> {
    return axios.post('/view_columns/save_setting', params.save_setting, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

// 获取右侧操作按钮
export function _getrightOperation(params: IRightOperation): Promise<AxiosResponse<any>> {
    return axios.get('/options', params)
}

// 获取查询录音的数据
export function _queryRecord(params: IQueryRecord): Promise<AxiosResponse<any>> {
    return axios.post('/recording/query_record', params, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

// 分页查询录音数据
export function _queryRecord2(params: IQueryRecord2): Promise<AxiosResponse<any>> {
    return axios.get('/recording/query_record2', params)
}

// 获取用户坐席工号数据树菜单
export function _extensionTree(): Promise<AxiosResponse<any>> {
    return axios.get('/recording/extension_tree')
}

// 导出录音
export function _exportRecord(params: IExportRecord): Promise<AxiosResponse<any>> {
    return axios.get(`/recording/export_record?ids=${params.ids}`, {
        headers: { 'Content-Type': 'application/json,charset=utf-8' },
        responseType: 'arraybuffer'
    })
}

// 播放录音接口
export function _play(params: IPlay): Promise<AxiosResponse<any>> {
    return axios.get(`/recording/play?system_id=${params.system_id}`)
}

// 导出表中数据
export function _export(params: IExport): Promise<AxiosResponse<any>> {
    return axios.get(`/recording/export?query_id=${params.query_id}&page_index=${params.page_index}&page_size=${params.page_size}`, {
        headers: { 'Content-Type': 'application/json,charset=utf-8' },
        responseType: 'arraybuffer'
    })
}

// 更新标记
export function _recordKeyword(params: IRecordKeyword): Promise<AxiosResponse<any>> {
    return axios.post('/keyword/record_keyword', params)
}

// 删除标记
export function _deleteRecordKeyword(params: IDeleteRecordKeyword): Promise<AxiosResponse<any>> {
    return axios.post('/keyword/delete_record_keyword', params)
}

// 获取关键词数据
export function _selectKeywordsKeyterm(): Promise<AxiosResponse<any>> {
    return axios.get('/keyword/select_keywords_keyterm')
}


// 获取录音标记数据
export function _mark(params: IMark): Promise<AxiosResponse<any>> {
    return axios.post('/recording/mark', params, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

// 录音回放下载明细
export function _downloadPlay(params: IDownloadPlay): Promise<AxiosResponse<any>> {
    return axios.post('/recording/download_play', params, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}
import * as React from 'react'
import { connect } from 'react-redux'
import { Table, Radio, message, Icon, Row, Col, Input, Pagination } from 'antd'
import intl from 'react-intl-universal'
import moment from 'moment'
import DraggableModal from '../../components/cores/draggableModal/draggableModal'
import RightOperation from '../../components/containers/right-operation/rightOperation'
import AudioPlayer from './audioPlayer/audioPlayer'
import MakeSign from './MakeSign/MakeSign'
import ColumsConfig from './columnsConfig/columnsConfig'
import QueryForm from './queryCondition/queryCondition'
import { _getColumns, _export, _play, _queryRecord2, _exportRecord, _queryRecord, _getrightOperation, _saveSetting, _mark, _downloadPlay } from '../../common/api/recordManage'
import styles from './recordManage.module.less'

interface IState {
    tableHeight: number; // table滚动高度
    mediaColumns: any[]; // 媒体数据表头
    dataSource: any[]; // 媒体列表数据
    checkedRows: any[];// 选择的行
    rightOperationData: any[]; // 右侧按钮
    columnsVisible: boolean; // 控制自定义列
    showQueryModal: boolean; // 控制查询条件列弹框
    showExportModal: boolean; // 控制导出数据的弹框
    showMakeSignModal: boolean; // 控制标记的弹框
    showEvaluateModal: boolean; // 控制考评的弹框
    columnConfigData: any[]; // 自定义列数据
    conditionRowId: string; // 查询条件详情时需要的id
    formType: number;
    exportValue: number; // 导出选择的值
    queryFormData: any; // 查询模态框数据
    showMediaPlayer: boolean; // 是否在本页显示播放器
    audioimg: string;
    audiosrc: string;
    query_id: string;
    pageCount: number;
    pageSize: number;
    pageIndex: number;
    content_remark: string;
    content: string;
    evaluation: number;
    playSerial: string[];
    startTime: number;
    endTime: number;
    rowId: string;
    selectedRowKeys: string[];
    /* Functionid: string; */
}

class RecordManage extends React.Component<any, IState> {
    constructor(props: any) {
        super(props)
        this.state = {
            tableHeight: 0,
            mediaColumns: [], // 媒体数据表头
            dataSource: [], // 媒体列表数据
            checkedRows: [], // 选择的行
            selectedRowKeys: [], // 选择的行key值
            rightOperationData: [], // 右侧按钮
            columnsVisible: false, // 控制自定义列弹框
            showQueryModal: false, // 控制查询条件列弹框
            showMediaPlayer: false, // 控制回放的弹框
            showExportModal: false, // 控制导出数据的弹框
            showMakeSignModal: false, // 控制标记的弹框
            showEvaluateModal: false, // 控制考评的弹框
            columnConfigData: [], // 自定义列数据
            conditionRowId: '', // 查询条件详情时需要的id
            formType: 1,
            exportValue: 1, // 导出选择的值
            queryFormData: {}, // 查询模态框数据
            audioimg: '',
            audiosrc: '',
            query_id: '', // 查询出的数据流水号
            pageCount: 0, // 录音总共条数
            pageSize: 50,
            pageIndex: 1, //
            content_remark: '', // 评语内容
            content: '', // 评语标题
            evaluation: 1, // 判断考评新增还是修改
            playSerial: [], // 播放时的流水号
            startTime: 0, // 记录播放开始时间
            endTime: 0, // 记录播放结束时间
            rowId: '' // 选中ID
            /*  Functionid: '' // 选中操作按钮ID */
        }
    }

    public componentDidMount(): void {
        const monitor = document.querySelectorAll('#recordManage')[0]
        this.setState({
            tableHeight: monitor.getBoundingClientRect().height - 102
        })
        this.getColumns()
        this.getRightOperation()
    }

    // 获取右侧菜单
    public getRightOperation = async (): Promise<void> => {
        const res: any = await _getrightOperation({
            params: {
                parent_id: '1022610110100000000',
                resource_id: this.state.dataSource.length > 0 ? '261' : '000'
            }
        })
        if (res && res.result) {
            const rightOperation = res.data[0].P004
            this.setState({
                rightOperationData: rightOperation
            })
        }
    }

    public rightIdData = (data: any): void => {
        /* this.setState({
            Functionid: data.P005
        }) */
        if (data.P003 === 'OP102261011010500') {
            this.setState({
                columnsVisible: true
            })
        } else if (data.P003 === 'OP102261011010100') {
            this.setState({
                showQueryModal: true
            })
        } else if (data.P003 === 'OP102261011010200') {
            // 回放
            if (this.state.checkedRows.length !== 1) {
                message.warning(`${intl.get('M26P102261011010000PM001').d('请选择一条媒体数据')}`)
            } else {
                this.handlePlayBackQuery(2, '')
            }
        } else if (data.P003 === 'OP102261011010300') {
            if (this.state.query_id === '') {
                message.warning(`${intl.get('M26P102261011010000PM002').d('请先查询出数据')}`)
                return
            }
            this.setState({
                showExportModal: true
            })
        } else if (data.P003 === 'OP102261011010400') {
            if (this.state.checkedRows.length === 0) {
                message.warning(`${intl.get('M26P102261011010000PM001').d('请选择一条媒体数据')}`)
            } else {
                this.handleSoundQuery()
            }
        } else if (data.P003 === 'OP102261011010600') {
            if (this.state.checkedRows.length !== 1) {
                message.warning(`${intl.get('M26P102261011010000PM001').d('请选择一条媒体数据')}`)
            } else {
                this.setState({ showMakeSignModal: true })
                this.play()
            }
        } else if (data.P003 === 'OP102261011010700') {
            console.log(this.state.checkedRows)
            if (this.state.checkedRows.length !== 1) {
                message.warning(`${intl.get('M26P102261011010000PM001').d('请选择一条媒体数据')}`)
            } else {
                this.setState({ showEvaluateModal: true })
                this.getMark()
            }
        }
    }

    // 获取表头数据
    public getColumns = async (): Promise<void> => {
        const res: any = await _getColumns({
            params: {
                view_id: '9112636110100000000',
                type: '0'
            }
        })
        if (res && res.result) {
            const data = []
            res.data.map((item: any): any => {
                if (item.col_name === 'StartTime' || item.col_name === 'StopTime') {
                    data.push({
                        key: item.col_name,
                        title: item.display,
                        dataIndex: item.col_name,
                        width: item.view_width,
                        ellipsis: true,
                        render: (text: any): any => {
                            if (text === null) {
                                return null
                            }
                            const time = moment.utc(text, 'YYYYMMDDHHmmss').local().format('YYYY-MM-DD HH:mm:ss')
                            return <span title={time}>{time}</span>
                        }
                    })
                } else if (item.col_name === 'OrderID') {
                    data.push({
                        key: item.col_name,
                        title: item.display,
                        dataIndex: item.col_name,
                        width: item.view_width,
                        ellipsis: true,
                        render: (text: any): any => (
                            <Icon style={{ fontSize: '24px' }} type="caret-right" onClick={(): void => { this.handlePlayBackQuery(1, text)/* this.handlePlay(text) */ }} />
                        )
                    })
                } else if (item.col_name === 'Direction') {
                    data.push({
                        key: item.col_name,
                        title: item.display,
                        dataIndex: item.col_name,
                        width: item.view_width,
                        ellipsis: true,
                        render: (text): any => {
                            switch (text) {
                                case '73':
                                    return <span>{intl.get('COM001007001V73').d('呼入')}</span>
                                case '79':
                                    return <span>{intl.get('COM001007001V79').d('呼出')}</span>
                                default:
                                    return ''
                            }
                        }
                    })
                } else if (item.col_name === 'IsDeleted') {
                    data.push({
                        key: item.col_name,
                        title: item.display,
                        dataIndex: item.col_name,
                        width: item.view_width,
                        ellipsis: true,
                        render: (text): any => {
                            switch (text) {
                                case '0':
                                    return <span>{intl.get('M26P102261011010000PS001').d('未删除')}</span>
                                case '1':
                                    return <span>{intl.get('M26P102261011010000PS002').d('已删除')}</span>
                                default:
                                    return ''
                            }
                        }
                    })
                } else {
                    data.push({
                        key: item.col_name,
                        title: item.display,
                        dataIndex: item.col_name,
                        width: item.view_width,
                        ellipsis: true,
                        render: (text): any => <span title={text}>{text}</span>
                    })
                }
                return null
            })
            this.setState({
                mediaColumns: data
            })
        }
    }

    // 自定义列接口
    public handleColumnsDevice = async (): Promise<void> => {
        console.log(this.state.columnConfigData)
        const data = this.state.columnConfigData.map((item: any): any => (
            {
                id: item.col_id,
                name: item.display,
                show: item.view_on_page,
                order: item.order_id,
                width: item.view_width,
                state: false
            }
        ))
        const saveSetting = [{
            param_id: 'view_id',
            param_value: '9112636110100000000'
        }, {
            param_id: 'columns',
            param_value: data
        }]
        const res: any = await _saveSetting({
            save_setting: JSON.stringify(saveSetting)
        })
        if (res && res.result) {
            this.getColumns()
            this.setState({ columnsVisible: false })
        }
    }

    // 获取表格数据的接口
    public getTableData = async (): Promise<void> => {
        console.log(this.state.queryFormData.meeting)
        const res: any = await _queryRecord({
            begin: this.state.queryFormData.rangeTime ? moment(this.state.queryFormData.rangeTime[0]).utc().format('YYYYMMDDHHmmss') : '',
            end: this.state.queryFormData.rangeTime ? (moment().startOf() < moment(this.state.queryFormData.rangeTime[1]) ? moment().startOf().utc().format('YYYYMMDDHHmmss') : moment(this.state.queryFormData.rangeTime[1]).utc().format('YYYYMMDDHHmmss')) : '',
            min_time: Number(this.state.queryFormData.min_time) < 0 ? 0 : Number(this.state.queryFormData.min_time),
            max_time: Number(this.state.queryFormData.max_time) < 0 ? 0 : Number(this.state.queryFormData.max_time) === 0 ? 9999 : Number(this.state.queryFormData.max_time),
            agent: this.state.queryFormData.agent ? this.state.queryFormData.agent : '',
            extension: this.state.queryFormData.extension || '' ? this.state.queryFormData.extension : null,
            channel: this.state.queryFormData.channel ? this.state.queryFormData.channel.toString() : '',
            caller: this.state.queryFormData.caller ? this.state.queryFormData.caller.toString() : '',
            called: this.state.queryFormData.called ? this.state.queryFormData.called.toString() : '',
            call_direction: typeof (this.state.queryFormData.call_direction) === 'undefined' ? 0 : this.state.queryFormData.call_direction.length === 2 ? 0 : this.state.queryFormData.call_direction.toString(),
            page_size: this.state.pageSize,
            page_index: this.state.pageIndex,
            invalid_records: this.state.queryFormData.invalidRecords.length > 0 ? this.state.queryFormData.invalidRecords[0] : 1,
            dtmf: this.state.queryFormData.meeting ? this.state.queryFormData.meeting.toString() : ''
            /* function_id: this.state.Functionid */
        })
        if (res.result && res.data !== null) {
            const data = JSON.parse(res.data)
            data.forEach((item: any): void => {
                item.key = item.OrderID
            })
            this.setState({
                query_id: res.msg,
                dataSource: data,
                pageCount: res.code
            }, (): Promise<void> => this.getRightOperation())
        } else {
            this.setState({
                dataSource: [],
                pageCount: res.code
            }, (): Promise<void> => this.getRightOperation())
        }
    }

    // 查询
    public handleQuery = (): void => {
        this.setState({
            showQueryModal: false,
            checkedRows: [],
            selectedRowKeys: [],
            rowId: ''
        }, (): void => { this.getTableData() })
    }

    // 播放录音
    public handlePlay = async (text: string): Promise<void> => {
        const res: any = await _play({
            system_id: text
        })
        if (res.result) {
            if (res.data.png === '') {
                message.warning(`${intl.get('M26P102261011010000PM003').d('波形图下载失败')}`)
            }
            this.setState({
                audioimg: `/temp/${res.data.png}`,
                audiosrc: `/temp/${res.data.wave}`
            }, (): void => {
                if (!this.state.showMediaPlayer) {
                    this.setState({
                        showMediaPlayer: true,
                        playSerial: [text]

                    })
                }
            })
        } else {
            message.warning(`${intl.get('M26P102261011010000PM004').d('播放下载失败')}`)
        }
    }

    // 记录回放记录明细
    public PlayDetails = async (value: string[]): Promise<void> => {
        const res: any = await _downloadPlay({
            record_id: this.state.playSerial,
            type: 80,
            last_time: Math.ceil((this.state.endTime - this.state.startTime) / 1000)
        })
        if (res.result) {
            this.setState({
                startTime: new Date().getTime(),
                playSerial: value
            })
        }
    }

    // 回放接口
    public handlePlayBackQuery = async (type: number, id: string): Promise<void> => {
        console.log(type, id)
        let SerialID
        if (type === 1) {
            SerialID = id
        } else if (type === 2) {
            SerialID = this.state.checkedRows[0].SerialID
        }
        this.setState({
            showMediaPlayer: true
        })
        const res: any = await _play({
            system_id: SerialID
        })
        if (res.result) {
            if (res.data.png === '') {
                message.warning(`${intl.get('M26P102261011010000PM003').d('波形图下载失败')}`)
            }
            if (SerialID === this.state.playSerial[0] || this.state.playSerial.length === 0) {
                console.log(SerialID)
                this.setState({
                    startTime: new Date().getTime(),
                    playSerial: [SerialID]
                })
            } else if (SerialID !== this.state.playSerial[0]) {
                this.setState({
                    endTime: new Date().getTime()
                }, (): void => {
                    this.PlayDetails([SerialID])
                })
            }
            const audioPng = `/temp/${res.data.png}`
            const audioWave = `/temp/${res.data.wave}`
            this.setState({
                audioimg: audioPng,
                audiosrc: audioWave
            })
        } else {
            message.warning(`${intl.get('M26P102261011010000PM004').d('播放下载失败')}`)
        }
    }

    // 回放接口
    public play = async (): Promise<void> => {
        const SerialID = this.state.checkedRows[0].SerialID
        this.setState({
            audioimg: '',
            audiosrc: '',
            showMediaPlayer: false
        })
        const res: any = await _play({
            system_id: SerialID
        })
        if (res.result) {
            if (res.data.png === '') {
                message.warning(`${intl.get('M26P102261011010000PM003').d('波形图下载失败')}`)
            }
            const audioPng = `/temp/${res.data.png}`
            const audioWave = `/temp/${res.data.wave}`
            this.setState({
                audioimg: audioPng,
                audiosrc: audioWave
            })
        } else {
            message.warning(`${intl.get('M26P102261011010000PM004').d('播放下载失败')}`)
        }
    }

    // 导出数据接口
    public handleExportQuery = async (): Promise<void> => {
        if (this.state.exportValue === 1) {
            const res: any = await _export({
                query_id: this.state.query_id,
                page_size: this.state.pageSize,
                page_index: this.state.pageIndex
            })
            if (res !== '') {
                if (window.navigator.msSaveOrOpenBlob) {
                    // 兼容ie11
                    try {
                        const blob = new Blob([res], { type: 'application/vnd.ms-excel,charset=utf-8' })
                        window.navigator.msSaveOrOpenBlob(blob, `${intl.get('M26P102261011010000P003').d('录音数据.xlsx')}`)
                        this.setState({
                            showExportModal: false
                        })
                        message.success(`${intl.get('M26P102261011010000PM005').d('导出成功')}`)
                        return
                    } catch (e) {
                        console.log(e)
                    }
                } else {
                    // 这里res.data是返回的blob对象
                    const blob = new Blob([res], { type: 'application/vnd.ms-excel,charset=utf-8' })
                    const url = window.URL.createObjectURL(blob)
                    const link = document.createElement('a')
                    link.download = `${intl.get('M26P102261011010000P003').d('录音数据.xlsx')}`
                    link.href = url
                    link.click()
                    this.setState({
                        showExportModal: false
                    })
                    message.success(`${intl.get('M26P102261011010000PM005').d('导出成功')}`)
                    return
                }
            }
            message.success(`${intl.get('M26P102261011010000PM006').d('导出失败')}`)
        } else if (this.state.exportValue === 2) {
            const res: any = await _export({
                query_id: this.state.query_id,
                page_size: this.state.pageCount,
                page_index: 1
            })
            if (res !== '') {
                if (window.navigator.msSaveOrOpenBlob) {
                    // 兼容ie11
                    try {
                        const blob = new Blob([res], { type: 'application/vnd.ms-excel,charset=utf-8' })
                        window.navigator.msSaveOrOpenBlob(blob, `${intl.get('M26P102261011010000P003').d('录音数据.xlsx')}`)
                        this.setState({
                            showExportModal: false
                        })
                    } catch (e) {
                        console.log(e)
                    }
                } else {
                    // 这里res.data是返回的blob对象
                    const blob = new Blob([res], { type: 'application/vnd.ms-excel,charset=utf-8' })
                    const url = window.URL.createObjectURL(blob)
                    const link = document.createElement('a')
                    link.download = `${intl.get('M26P102261011010000P003').d('录音数据.xlsx')}`
                    link.href = url
                    link.click()
                    this.setState({
                        showExportModal: false
                    })
                    message.success(`${intl.get('M26P102261011010000PM005').d('导出成功')}`)
                    return
                }
            }
            message.success(`${intl.get('M26P102261011010000PM006').d('导出失败')}`)
        }
    }

    // 导出录音接口
    public handleSoundQuery = async (): Promise<void> => {
        const time = (new Date()).getTime()
        const ids = []
        const checkedRows = this.state.checkedRows
        checkedRows.forEach((item): void => {
            ids.push(item.SerialID)
        })
        const mediaIds = ids.join(',').split(',')
        const res: any = await _exportRecord({
            ids: mediaIds
        })
        if (res !== '') {
            if (window.navigator.msSaveOrOpenBlob) {
                // 兼容ie11
                try {
                    const blob = new Blob([res], { type: 'application/zip,charset=utf-8' })
                    window.navigator.msSaveOrOpenBlob(blob, `${intl.get('M26P102261011010000P004').d('录音.zip')}`)
                    this.setState({
                        showExportModal: false
                    })
                    message.success(`${intl.get('M26P102261011010000PM005').d('导出成功')}`)
                    const downloadTime = Math.round(((new Date()).getTime() - time) / 1000)
                    const data = {
                        record_id: mediaIds,
                        type: 68,
                        last_time: downloadTime,
                        savePath: ''
                    }
                    _downloadPlay(data)
                } catch (e) {
                    console.log(e)
                }
            } else {
                // 这里res.data是返回的blob对象
                const blob = new Blob([res], { type: 'application/zip,charset=utf-8' })
                const url = window.URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.download = `${intl.get('M26P102261011010000P004').d('录音.zip')}`
                link.href = url
                link.click()
                this.setState({
                    showExportModal: false
                })
                message.success(`${intl.get('M26P102261011010000PM005').d('导出成功')}`)
                const downloadTime = Math.round(((new Date()).getTime() - time) / 1000)
                const data = {
                    record_id: mediaIds,
                    type: 68,
                    last_time: downloadTime,
                    savePath: ''
                }
                _downloadPlay(data)
            }
        }
    }

    // 标注接口
    public handleMakeSignQuery = async (): Promise<void> => {
        console.log('导出录音接口')
    }

    // 获取考评的接口
    public getMark = async (): Promise<void> => {
        this.setState({
            content: '',
            content_remark: ''
        })
        const SerialID = this.state.checkedRows[0].SerialID
        const res: any = await _mark({
            record_id: SerialID,
            type: 1,
            title: this.state.content,
            content: this.state.content_remark,
            operation_type: 3
        })
        if (res && res.result && res.data !== 'null' && res.data !== '[]') {
            const data = JSON.parse(res.data)
            this.setState({
                content: data[0].title,
                content_remark: data[0].content,
                evaluation: 2
            })
        } else {
            this.setState({ evaluation: 1 })
        }
    }

    // 标注确定按钮
    public Tagging = (): void => {
        this.setState({
            showMakeSignModal: false,
            audiosrc: '',
            audioimg: '',
            checkedRows: [],
            selectedRowKeys: [],
            rowId: ''
        }, (): Promise<void> => this.getTableData())
    }

    // 考评接口
    public handleEvaluateQuery = async (): Promise<void> => {
        const SerialID = this.state.checkedRows[0].SerialID
        const res: any = await _mark({
            record_id: SerialID,
            type: 1,
            title: this.state.content,
            content: this.state.content_remark,
            operation_type: this.state.evaluation
        })
        if (res && res.result) {
            this.setState({
                showEvaluateModal: false,
                checkedRows: [],
                selectedRowKeys: [],
                rowId: ''
            }, (): Promise<void> => this.getTableData())
            message.success(`${intl.get('M26P102261011010000PM007').d('添加成功')}`)
            return
        }
        message.error(`${intl.get('M26P102261011010000PM008').d('添加失败')}`)
    }

    // 分页改变
    public pageChange = (page: number): void => {
        this.setState({
            pageIndex: page
        }, (): Promise<void> => this.pageQuickJumper())
    }

    // 分页每页条数改变
    public onShowSizeChange = (current: number, pageSize: number): void => {
        console.log(current, pageSize)
        this.setState({
            pageIndex: current,
            pageSize
        }, (): Promise<void> => this.pageQuickJumper())
    }

    // 分页改变
    public pageQuickJumper = async (): Promise<void> => {
        const res: any = await _queryRecord2({
            params: {
                query_id: this.state.query_id,
                page_size: this.state.pageSize,
                page_index: this.state.pageIndex
            }
        })
        if (res.result) {
            const data = JSON.parse(res.data)
            data.forEach((item: any): void => {
                item.key = item.SerialID
            })
            this.setState({
                dataSource: data
            })
        }
    }

    // 关闭播放
    public closePlayer = async (): Promise<void> => {
        this.setState({
            audioimg: '',
            audiosrc: '',
            showMediaPlayer: false,
            endTime: new Date().getTime(),
            checkedRows: [],
            selectedRowKeys: [],
            rowId: ''
        }, (): any => {
            this.PlayDetails([])
            this.getTableData()
        })
    }

    // 点击一行获取数据
    public onClickRow = (settingData): any => ({
        onClick: (): void => {
            this.setState({
                rowId: settingData.SerialID
            })
        }
    })

    // 点击一行改变背景色
    public setRowClassName = (settingData): any => {
        if (settingData.SerialID === this.state.rowId) {
            if (this.props.theme === 'light') {
                return 'lightClickRow'
            }
            if (this.props.theme === 'dark') {
                return 'darkClickRow'
            }
        }
        return ''
    }

    public render(): React.ReactElement {
        const rowSelection = {
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: (selectedRowKey: any, selectedRows: any): void => {
                this.setState({
                    checkedRows: selectedRows,
                    selectedRowKeys: selectedRowKey
                })
            }
        }

        return (
            <div className={styles.main}>
                <div id="recordManage" className={styles.contentLeft}>
                    {
                        this.state.showMediaPlayer &&
                        <div style={{ overflow: 'hidden', position: 'relative' }}>
                            <span onClick={this.closePlayer} style={{ position: 'absolute', top: 0, right: '10px', cursor: 'pointer' }}>X</span>
                            <AudioPlayer
                                style={{ margin: '10px', position: 'relative' }}
                                audioimg={this.state.audioimg}
                                audiosrc={this.state.audiosrc}
                            />
                        </div>
                    }
                    <Table
                        style={{ height: this.state.showMediaPlayer ? ('ActiveXObject' in window ? 'calc(100% - 240px)' : 'calc(100% - 300px)') : 'calc(100% - 48px)' }}
                        scroll={{ x: true, y: this.state.showMediaPlayer ? ('ActiveXObject' in window ? this.state.tableHeight - 202 : this.state.tableHeight - 252) : this.state.tableHeight }}
                        rowSelection={rowSelection}
                        columns={this.state.mediaColumns}
                        dataSource={this.state.dataSource}
                        rowClassName={this.setRowClassName}
                        onRow={this.onClickRow}
                        pagination={false}
                    />
                    <Pagination
                        total={this.state.pageCount}
                        showSizeChanger={this.state.pageCount > 0}
                        hideOnSinglePage={this.state.pageCount === 0}
                        pageSize={this.state.pageSize}
                        pageSizeOptions={['50', '100', '200', '500']}
                        onShowSizeChange={this.onShowSizeChange}
                        onChange={this.pageChange}
                    />
                </div>
                <RightOperation rightOperationData={this.state.rightOperationData} operateCallBack={(data): void => this.rightIdData(data)} />
                <DraggableModal
                    title={intl.get('M26P102261011010000MT001').d('查询条件')}
                    visible={this.state.showQueryModal}
                    onCancel={(): void => { this.setState({ showQueryModal: false }) }}
                    width={600}
                    onOk={(): void => { this.handleQuery() }}
                >
                    <QueryForm
                        pageType={0}
                        type={this.state.formType}
                        rowId={this.state.conditionRowId}
                        changeFromData={(data: any): void => { this.setState({ queryFormData: data }) }}
                    />
                </DraggableModal>
                <DraggableModal
                    title={intl.get('FO1022610110103000000').d('导出-数据')}
                    visible={this.state.showExportModal}
                    onCancel={(): void => { this.setState({ showExportModal: false }) }}
                    width={400}
                    onOk={(): void => { this.handleExportQuery() }}
                >
                    <Radio.Group onChange={(e): void => { this.setState({ exportValue: e.target.value }) }} value={this.state.exportValue}>
                        <Radio value={1}>{intl.get('M26P102261011010000ML012').d('当前页')}</Radio>
                        <Radio value={2}>{intl.get('M26P102261011010000ML013').d('全部页')}</Radio>
                    </Radio.Group>
                </DraggableModal>
                <DraggableModal
                    title={intl.get('FO1022610110106000000').d('标注')}
                    visible={this.state.showMakeSignModal}
                    width={1100}
                    onCancel={(): void => { this.setState({ showMakeSignModal: false, audiosrc: '', audioimg: '' }) }}
                    onOk={(): void => { this.Tagging() }}
                >
                    <MakeSign
                        media_id={this.state.checkedRows[0] && this.state.checkedRows[0].SerialID}
                        audioimg={this.state.audioimg}
                        audiosrc={this.state.audiosrc}
                    />
                </DraggableModal>
                <DraggableModal
                    title={intl.get('FO1022610110107000000').d('考评')}
                    visible={this.state.showEvaluateModal}
                    onCancel={(): void => { this.setState({ showEvaluateModal: false }) }}
                    width={600}
                    onOk={(): void => { this.handleEvaluateQuery() }}
                >
                    <Row style={{ marginTop: '8px' }}>
                        <Col span={6}>{intl.get('M26P102261011010000ML014').d('标题')}</Col>
                        <Col span={18}>
                            <Input onChange={(e): void => { this.setState({ content: e.target.value }) }} value={this.state.content} />
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '8px' }}>
                        <Col span={6}>{intl.get('M26P102261011010000ML015').d('内容')}</Col>
                        <Col span={18}>
                            <Input.TextArea
                                rows={3}
                                value={this.state.content_remark}
                                onChange={(e): void => { this.setState({ content_remark: e.target.value }) }}
                            />
                        </Col>
                    </Row>
                </DraggableModal>
                <DraggableModal
                    visible={this.state.columnsVisible}
                    title={intl.get('FO1022610110105000000').d('显示列')}
                    width={700}
                    onOk={(): void => { this.handleColumnsDevice() }}
                    onCancel={(): void => { this.setState({ columnsVisible: false }) }}
                >
                    <ColumsConfig saveCols={(data: any): void => { this.setState({ columnConfigData: data }) }} pageId="9112636110100000000" pageType="1" />
                </DraggableModal>
            </div>
        )
    }
}

const mapStateToProps = (state: any): IMapStateToProps => ({
    theme: state.themeReducer.theme
})

export default connect(mapStateToProps, null)(RecordManage)
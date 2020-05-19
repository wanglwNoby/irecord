import * as React from 'react'
import moment from 'moment'
import intl from 'react-intl-universal'
import { Table, Row, Col, TreeSelect, message, Descriptions, Card, Checkbox, Radio, Avatar, Input, Select, Pagination } from 'antd'
import { getWebPcm2WavArrayBuffer, scheduleBuffers } from '../../../utils/pcm'
import { formatColumns } from '../../../utils/tableUtil'
import { formatTreeData } from '../../../utils/treeUtil'
import DraggableModal from '../../../components/cores/draggableModal/draggableModal'
import RightOperation from '../../../components/containers/right-operation/rightOperation'
import { _getRightOperation, _getColumns, _getExtensionList, _getExtensionWSUrl } from '../../../common/api/resourceMonitor'
import styles from './monitoring.module.less'

import playImg from '../../../assets/images/play.png'
import stopImg from '../../../assets/images/stop.png'
import forbiddenImg from '../../../assets/images/forbidden.png'
import relax from '../../../assets/images/1.png'
import phoning from '../../../assets/images/2.png'
import ring from '../../../assets/images/3.png'
import broken from '../../../assets/images/4.png'
import unknown from '../../../assets/images/5.png'
import callIn from '../../../assets/images/call-in.png'
import callOut from '../../../assets/images/call-out.png'

interface IColumns {
    key: string;
    title: string;
    dataIndex: string;
    width: number;
    ellipsis?: boolean;
    render?: (text: any, record?: any) => React.ReactElement | string;
}

interface IState {
    tableHeight: number; // table滚动高度
    viewType: number; // 查看模式0表格1视图
    searchType: number; // 搜索0分机号1工号
    current: number; // 当前页
    pageSize: number; // 每页条数
    rightOperationData: any[]; // 右侧按钮
    columns: IColumns[]; // 表头
    visible: boolean; // modal开关
    extensionList: any[]; // 分机列表
    extensionID: string[]; // 临时选中的分机
    selectedExtensionID: string[]; // 当前选中的分机
    tableData: any[]; // ws返回的数据
    isRightAgain: boolean; // 是否再次请求右侧菜单
    selectedRows: any[]; // 选中的行
    durations: any; // 持续时长
    isMonitoringID: string | number; // 是否正在播放
}

let url: string
let ws: WebSocket
const timers = {} // 定时器
let context: any // web audio api

class Monitoring extends React.Component<any, IState> {
    constructor(props: any) {
        super(props)
        this.state = {
            tableHeight: 0,
            viewType: 0,
            searchType: 0,
            current: 1,
            pageSize: 100,
            rightOperationData: [],
            columns: [],
            visible: false,
            extensionList: [],
            extensionID: [],
            selectedExtensionID: [],
            tableData: [],
            isRightAgain: false,
            selectedRows: [],
            durations: {},
            isMonitoringID: ''
        }
    }

    public componentDidMount(): void {
        const monitor = document.querySelectorAll('#monitor')[0]
        this.setState({
            tableHeight: monitor.getBoundingClientRect().height - 142
        })
        this.getRightOperation('')
        this.getColumns()
        this.getExtensionList()
    }

    public componentWillUnmount(): void {
        if (url) {
            ws.close()
        }
        Object.keys(timers).forEach((key: string): void => {
            clearInterval(timers[key])
            delete timers[key]
            this.setState({
                durations: {}
            })
        })
    }

    // 获取右侧菜单
    public getRightOperation = async (soucerID: string): Promise<void> => {
        const res: any = await _getRightOperation({
            params: {
                parent_id: '1022610110301000000',
                resource_id: soucerID
            }
        })
        if (res && res.result) {
            let rightOperation = []
            res.data.forEach((item: any): void => {
                if (rightOperation.length === 0) {
                    rightOperation = item.P004
                } else {
                    rightOperation.push(...item.P004)
                }
            })
            this.setState({
                rightOperationData: rightOperation
            })
        }
    }

    // 获取分机列表
    public getExtensionList = async (): Promise<void> => {
        const res: any = await _getExtensionList()
        if (res && res.result) {
            this.setState({
                extensionList: formatTreeData(res.data)
            })
        }
    }

    // 获取表头数据
    public getColumns = async (): Promise<void> => {
        const res: any = await _getColumns({
            params: {
                view_id: '9112611110100000000',
                type: '0'
            }
        })
        if (res && res.result) {
            const columns = formatColumns(res.data)
            columns.forEach((item: any): void => {
                if (item.key === 'StartTime') {
                    item.render = (text: any): any => (
                        text === '' ? text : moment.utc(text, 'YYYY-MM-DD HH:mm:ss').local().format('YYYY-MM-DD HH:mm:ss')
                    )
                }
                if (item.key === 'Operate') {
                    item.render = (_text: any, record: any): React.ReactElement => {
                        if (record.Status === '1' || record.Status === '5' || record.Status === '101') {
                            return (
                                this.state.isMonitoringID === record.key ?
                                    <div className="playStop">
                                        <img src={stopImg} alt="stop" onClick={this.endMonitoring} />
                                    </div> :
                                    <div className="playStop">
                                        <img src={playImg} alt="play" onClick={this.startMonitoring.bind(this, record.key)} />
                                    </div>
                            )
                        }
                        return (
                            <div className="playStop">
                                <img src={forbiddenImg} alt="forbidden" />
                            </div>
                        )
                    }
                }
                if (item.key === 'Duration') {
                    item.render = (text: string, record: any): string => {
                        if (record.Status === '5') {
                            console.log(text, this.state.durations[record.key])
                            if (!timers[record.key]) {
                                this.setTimer(record.key, parseInt(text, 10))
                            }
                            return this.state.durations[record.key]
                        }
                        if (Object.keys(timers).includes(record.key)) {
                            clearInterval(timers[record.key])
                            delete timers[record.key]
                            const newDurations = (durations: any): any => {
                                delete durations[record.key]
                                return durations
                            }
                            this.setState((prevState: any): any => ({
                                durations: newDurations(prevState.durations)
                            }))
                        }
                        return ''
                    }
                }
            })
            this.setState({ columns })
        }
    }

    // 秒数转时间
    public second2Time = (second: number): string => {
        const hours = moment.duration(second, 'seconds').get('hours')
        const minutes = moment.duration(second, 'seconds').get('minutes')
        const seconds = moment.duration(second, 'seconds').get('seconds')
        const h = hours < 10 ? `0${hours}` : `${hours}`
        const m = minutes < 10 ? `0${minutes}` : `${minutes}`
        const s = seconds < 10 ? `0${seconds}` : `${seconds}`
        return `${h}:${m}:${s}`
    }

    // 时间转秒数
    public time2Second = (time: string): number => {
        const times = time.split(':')
        const second = parseInt(times[0], 10) * 3600 + parseInt(times[1], 10) * 60 + parseInt(times[2], 10)
        return second
    }

    // 设置定时器
    public setTimer = (key: string, duration: number): any => {
        timers[key] = setInterval((): any => {
            if (!this.state.durations.hasOwnProperty(key)) {
                this.setState((prevState: any): any => ({
                    durations: { ...prevState.durations, [key]: this.second2Time(duration) }
                }))
            } else {
                this.setState((prevState: any): any => ({
                    durations: { ...prevState.durations, [key]: this.second2Time(this.time2Second(prevState.durations[key]) + 1) }
                }))
            }
        }, 1000)
    }

    // 右侧菜单操作
    public rightIdData = (data: any): void => {
        switch (data.P003) {
            case 'OP102261011030101':
                this.setState({ visible: true })
                break
            case 'OP102261011030106':
                this.removeExtension()
                break
            case 'OP102261011030107':
                this.startMonitoring()
                break
            case 'OP102261011030108':
                this.endMonitoring()
                break
            default:
                break
        }
    }

    // 移除分机
    public removeExtension = (): void => {
        if (this.state.selectedRows.length === 0) {
            message.warning(intl.get('M26P102261011010000PM013'))
            return
        }
        const sendMsg = {
            code: '1103202',
            data: this.state.selectedRows.join('|'),
            msg: 'S3',
            result: true
        }
        ws.send(JSON.stringify(sendMsg))
    }

    // 开始监听
    public startMonitoring = (key?: string): void => {
        if (!key) {
            if (this.state.selectedRows.length !== 1) {
                message.warning(intl.get('M26P1022610110301000MSG002'))
                return
            }
        }
        if (this.state.isMonitoringID !== '') {
            this.endMonitoring()
        }
        this.setState((prevState: any): any => ({
            isMonitoringID: key || prevState.selectedRows[0]
        }))
        context = new AudioContext()
        const sendMsg = {
            code: '1103203',
            data: key || this.state.selectedRows[0],
            msg: 'S2',
            result: true
        }
        ws.send(JSON.stringify(sendMsg))
    }

    // 结束监听
    public endMonitoring = (): void => {
        const sendMsg = {
            code: '1103203',
            data: this.state.isMonitoringID,
            msg: 'S3',
            result: true
        }
        ws.send(JSON.stringify(sendMsg))
        this.setState({
            isMonitoringID: ''
        })
    }

    // 分机改变，重新发送WS
    public extensionChange = (): void => {
        if (!url) { // 第一次进来
            _getExtensionWSUrl({
                params: { server_id: this.state.selectedExtensionID[0] }
            }).then((response: any): void => {
                if (response && response.result) {
                    url = `ws://${JSON.parse(response.data)[0].ip}:${JSON.parse(response.data)[0].port}/G1103100`
                    ws = new WebSocket(url)
                    this.openWebSocket()
                }
            })
        } else {
            Object.keys(timers).forEach((key: string): void => {
                clearInterval(timers[key])
                delete timers[key]
            })
            this.setState({
                tableData: [],
                durations: {}
            }, (): void => {
                ws.close()
                setTimeout((): void => {
                    this.openWebSocket()
                }, 500)
            })
        }
    }

    // 与ws建立连接
    public openWebSocket = (): void => {
        if (ws.readyState === 0) {
            ws.onopen = (): void => {
                this.openWebSocket()
            }
        } else if (ws.readyState === 1) {
            const start: number = this.state.pageSize * (this.state.current - 1)
            const end: number = this.state.pageSize * this.state.current
            const sendMsg = {
                code: '1103202',
                data: this.state.selectedExtensionID.slice(start, end).join('|'),
                msg: 'S2',
                result: true
            }
            ws.send(JSON.stringify(sendMsg))
        } else if (ws.readyState === 2 || ws.readyState === 3) {
            ws = new WebSocket(url)
            this.openWebSocket()
        }
        ws.onmessage = (e: any): void => {
            console.log(JSON.parse(e.data))
            if (JSON.parse(e.data).code === 1103202 && JSON.parse(e.data).msg === 'R3') { // 移除时
                this.afterRemoveExtension()
            }
            if (JSON.parse(e.data).code === 1103202 && JSON.parse(e.data).msg === 'RN') { // 选择分机
                const data = JSON.parse(JSON.parse(e.data).data)
                console.log(data)
                this.renderTableData(data)
            }
            if (JSON.parse(e.data).code === 1103203 && JSON.parse(e.data).msg === 'RN') { // 开始监听
                const data = JSON.parse(JSON.parse(e.data).data)
                this.afterGetMonitoring(data)
            }
        }
        ws.onclose = (): void => {
            console.log('is closed...')
        }
    }

    // 移除分机接受到WS后操作
    public afterRemoveExtension = (): void => {
        const monitIndex = this.state.selectedRows.findIndex((item: any): boolean => item === this.state.isMonitoringID)
        if (monitIndex > -1) {
            this.endMonitoring()
        }
        const newDurations = (durations: any): any => {
            this.state.selectedRows.forEach((item: any): void => {
                if (durations.hasOwnProperty(item)) {
                    clearInterval(timers[item])
                    delete timers[item]
                    delete durations[item]
                }
            })
            return durations
        }
        const newTableData = (tableData: any): any => {
            this.state.selectedRows.forEach((sItem: any): void => {
                const index = tableData.findIndex((tItem: any): boolean => (
                    tItem.key === sItem
                ))
                tableData.splice(index, 1)
            })
            return tableData
        }
        this.setState((prevState: any): any => ({
            tableData: newTableData(prevState.tableData),
            durations: newDurations(prevState.durations),
            selectedRows: []
        }), (): void => console.log(this.state))
    }

    // 根据WS返回的数据，设置表数据
    public renderTableData = (data: any): void => {
        let dataSource: any
        if (!data.ReturnInfo.Calls) {
            dataSource = {
                key: data.ReturnInfo['@P04'],
                Extension: data.ReturnInfo['@P06'],
                Status: '1',
                Operate: '',
                Called: '',
                Direction: '',
                StartTime: '',
                Duration: '',
                Channel: '',
                AgentNo: ''
            }
        } else if (data.ReturnInfo.Calls[0]) {
            dataSource = {
                key: data.ReturnInfo['@P04'],
                Extension: data.ReturnInfo['@P06'],
                Status: data.ReturnInfo.Calls[0]['@P08'],
                Operate: data.ReturnInfo.Calls[0]['@P06'],
                Called: data.ReturnInfo.Calls[0]['@P03'],
                Direction: data.ReturnInfo.Calls[0]['@P02'],
                StartTime: data.ReturnInfo.Calls[0]['@P04'],
                Duration: data.ReturnInfo.Calls[0]['@P05'],
                Channel: data.ReturnInfo['@P03'],
                AgentNo: data.ReturnInfo['@P07']
            }
        } else {
            dataSource = {
                key: data.ReturnInfo['@P04'],
                Extension: data.ReturnInfo['@P06'],
                Status: data.ReturnInfo.Calls['@P08'],
                Operate: data.ReturnInfo.Calls['@P06'],
                Called: data.ReturnInfo.Calls['@P03'],
                Direction: data.ReturnInfo.Calls['@P02'],
                StartTime: data.ReturnInfo.Calls['@P04'],
                Duration: data.ReturnInfo.Calls['@P05'],
                Channel: data.ReturnInfo['@P03'],
                AgentNo: data.ReturnInfo['@P07']
            }
        }
        const index = this.state.tableData.findIndex((item: any): boolean => (
            item.key === dataSource.key
        ))
        if (index < 0) {
            this.setState((prevState: any): any => ({
                tableData: [...prevState.tableData, dataSource]
            }))
        } else {
            const newTableData = (tableData: any): any => {
                tableData.splice(index, 1, dataSource)
                return tableData
            }
            this.setState((prevState: any): any => ({
                tableData: newTableData(prevState.tableData)
            }))
        }
        console.log(this.state.tableData)
    }

    // 监听WS获取后操作
    public afterGetMonitoring = (data: any): void => {
        console.log(data)
        const hexStr = data.ReturnInfo.CallStream['@P03']
        const typedArray = new Uint8Array(hexStr.match(/[\da-f]{2}/gi).map((h: any): any => parseInt(h, 16)))
        let audioData: any
        if (data.ReturnInfo.CallStream['@P02'] === '1') { // alaw
            audioData = getWebPcm2WavArrayBuffer(typedArray, 6)
        } else if (data.ReturnInfo.CallStream['@P02'] === '2') { // ulaw
            audioData = getWebPcm2WavArrayBuffer(typedArray, 7)
        } else {
            return
        }
        context.decodeAudioData(audioData).then((audioBuffer: any): any => {
            scheduleBuffers(context, audioBuffer, { nextTime: 0 })
        })
    }

    // 选中分机后 确认
    public handleConfirm = (): void => {
        if (this.state.extensionID.length === 0) {
            this.setState({ visible: false })
            return
        }
        if (this.state.extensionID.filter((item: string): boolean => item.slice(0, 3) === '267').length === 0) {
            this.setState({ visible: false }, (): void => { message.warning(intl.get('M26P102261011010000PM013')) })
            return
        }
        this.setState((prevState: any): any => ({
            selectedExtensionID: prevState.extensionID.filter((item: string): boolean => item.slice(0, 3) === '267').sort(),
            current: 1,
            visible: false
        }), (): void => this.extensionChange())
    }

    // 搜索分机或者工号
    public searchNum = (value: string): void => {
        let result: any
        if (this.state.searchType === 0) {
            result = this.state.tableData.find((item: any): boolean => (
                item.Extension === value
            ))
        } else {
            result = this.state.tableData.find((item: any): boolean => (
                item.AgentNo === value
            ))
        }
        if (!result) {
            message.error(intl.get('M26P1022610110301000MSG003'))
            return
        }
        this.setState({
            selectedExtensionID: [result.key]
        }, (): void => this.extensionChange())
    }

    // 页码改变
    public onPageChange = (page: number): void => {
        this.setState({
            current: page
        }, (): void => this.extensionChange())
    }

    // 分页每页条数改变
    public onShowSizeChange = (current: number, pageSize: number): void => {
        this.setState({
            current, pageSize
        }, (): void => this.extensionChange())
    }

    public render(): React.ReactElement {
        const rowSelection = {
            selectedRowKeys: this.state.selectedRows,
            onChange: (selectedRowKeys: string[] | number[]): void => {
                if (!this.state.isRightAgain) {
                    this.getRightOperation('267')
                    this.setState({
                        isRightAgain: true
                    })
                }
                this.setState({
                    selectedRows: selectedRowKeys
                })
            }
        }

        // 监听按钮
        const renderMonitor = (status: string, key: string): React.ReactElement => (
            status === '5' && (this.state.isMonitoringID === key ?
                <img src={stopImg} alt="stop" className="playImg" onClick={this.endMonitoring} /> :
                <img src={playImg} alt="play" className="playImg" onClick={this.startMonitoring.bind(this, key)} />)
        )

        // 状态颜色
        const renderStatus = (text: string): any => {
            switch (text) {
                case '1':
                    return relax
                case '5':
                    return phoning
                case '101':
                    return ring
                case '901':
                    return broken
                case '902':
                    return unknown
                default:
                    return text
            }
        }

        // 持续时间
        const renderDuration = (text: string, record: any): string => {
            if (record.Status === '5') {
                console.log(text, this.state.durations[record.key])
                if (!timers[record.key]) {
                    this.setTimer(record.key, parseInt(text, 10))
                }
                return this.state.durations[record.key]
            }
            if (Object.keys(timers).includes(record.key)) {
                clearInterval(timers[record.key])
                delete timers[record.key]
                const newDurations = (durations: any): any => {
                    delete durations[record.key]
                    return durations
                }
                this.setState((prevState: any): any => ({
                    durations: newDurations(prevState.durations)
                }))
            }
            return ''
        }

        // 呼叫方向
        const renderDirection = (text: string): React.ReactElement => {
            switch (text) {
                case '73':
                    return <img src={callIn} alt="callIn" />
                case '79':
                    return <img src={callOut} alt="callOut" />
                default:
                    return <span>text</span>
            }
        }

        const onCheckChange = (key: string, e: any): void => {
            if (!this.state.isRightAgain) {
                this.getRightOperation('267')
                this.setState({
                    isRightAgain: true
                })
            }
            if (e.target.checked) {
                this.setState((prevState: any): any => ({
                    selectedRows: [...prevState.selectedRows, key]
                }))
            } else {
                const newSelectedRows = (selectedRows: string[] | number[]): string[] | number[] => {
                    const index = selectedRows.findIndex((item: string | number): boolean => item === key)
                    selectedRows.splice(index, 1)
                    return selectedRows
                }
                this.setState((prevState: any): any => ({
                    selectedRows: newSelectedRows(prevState.selectedRows)
                }))
            }
        }

        return (
            <div className={styles.main}>
                <div id="monitor" className={styles.wrapper}>
                    <Radio.Group style={{ lineHeight: '40px', padding: '0 20px' }} onChange={(e: any): void => this.setState({ viewType: e.target.value })} value={this.state.viewType}>
                        <Radio value={0}>{intl.get('M26P1022610110301000R001').d('列表模式')}</Radio>
                        <Radio value={1}>{intl.get('M26P1022610110301000R002').d('视图模式')}</Radio>
                    </Radio.Group>
                    <Select value={this.state.searchType} style={{ width: 120 }} onChange={(value: number): void => this.setState({ searchType: value })}>
                        <Select.Option value={0}>{intl.get('M26P102261011010000ML006').d('分机')}</Select.Option>
                        <Select.Option value={1}>{intl.get('M26P102261011010000ML007').d('坐席')}</Select.Option>
                    </Select>
                    :
                    <Input.Search
                        style={{ width: 200, marginLeft: 12 }}
                        onSearch={this.searchNum}
                    />
                    {
                        this.state.viewType === 0 ?
                            <Table
                                className={styles.tableWrapper}
                                columns={this.state.columns}
                                dataSource={this.state.tableData}
                                scroll={{ x: true, y: this.state.tableHeight }}
                                rowSelection={rowSelection}
                                pagination={false}
                            /> :
                            <div className={styles.listWrapper}>
                                {
                                    this.state.tableData.map((item: any): React.ReactElement => (
                                        <Card
                                            key={item.key}
                                            className={styles.card}
                                            title={[
                                                <img key="img" src={renderStatus(item.Status)} alt="state" />,
                                                <span key="exttension">{item.Extension}</span>
                                            ]}
                                            extra={<Checkbox checked={this.state.selectedRows.includes(item.key)} onChange={onCheckChange.bind(this, item.key)} />}
                                        >
                                            <Card.Meta
                                                avatar={
                                                    <React.Fragment>
                                                        <Avatar size="large" icon="user" />
                                                        {renderMonitor(item.Status, item.key)}
                                                    </React.Fragment>
                                                }
                                                description={
                                                    <Descriptions
                                                        column={1}
                                                        size="small"
                                                    >
                                                        <Descriptions.Item label={intl.get('M26P102261011010000ML007').d('坐席')}>
                                                            {item.AgentNo}
                                                        </Descriptions.Item>
                                                        <Descriptions.Item label={intl.get('M26P102261011091100ML001').d('通道号')}>
                                                            {item.Channel}
                                                        </Descriptions.Item>
                                                        <Descriptions.Item label={intl.get('M26P1022610110301000L003').d('对方号码')}>
                                                            {item.Status === '5' && renderDirection(item.Direction)}
                                                            {item.Called}
                                                        </Descriptions.Item>
                                                        <Descriptions.Item label={intl.get('VP9122636110400000001').d('开始时间')}>
                                                            {
                                                                item.StartTime === '' ? '' : moment.utc(item.StartTime, 'YYYY-MM-DD HH:mm:ss').local().format('HH:mm:ss')
                                                            }
                                                        </Descriptions.Item>
                                                        <Descriptions.Item label={intl.get('VP9122611110100000007').d('持续时间')}>
                                                            {renderDuration(item.Duration, item)}
                                                        </Descriptions.Item>
                                                    </Descriptions>
                                                }
                                            />
                                        </Card>
                                    ))
                                }
                            </div>
                    }
                    <Pagination
                        total={this.state.selectedExtensionID.length}
                        showSizeChanger={this.state.selectedExtensionID.length > 0}
                        pageSize={this.state.pageSize}
                        pageSizeOptions={['50', '100', '200', '500']}
                        onShowSizeChange={this.onShowSizeChange}
                        onChange={this.onPageChange}
                    />
                </div>

                <RightOperation rightOperationData={this.state.rightOperationData} operateCallBack={(data): void => this.rightIdData(data)} />

                <DraggableModal
                    title={intl.get('M26P1022610110301000M001').d('选择分机')}
                    width={600}
                    visible={this.state.visible}
                    onCancel={(): void => this.setState({ visible: false })}
                    onOk={(): void => this.handleConfirm()}
                >
                    <Row className={styles.row}>
                        <Col span={6}>{intl.get('M26P102261011010000ML006').d('分机')}</Col>
                        <Col span={18}>
                            <TreeSelect
                                style={{ width: '100%' }}
                                maxTagCount={3}
                                treeCheckable="true"
                                showCheckedStrategy={TreeSelect.SHOW_CHILD}
                                treeData={this.state.extensionList}
                                value={this.state.extensionID}
                                onChange={(value: string[]): void => this.setState({ extensionID: value })}
                            />
                        </Col>
                    </Row>
                </DraggableModal>
            </div>
        )
    }
}

export default Monitoring
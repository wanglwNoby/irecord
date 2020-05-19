import * as React from 'react'
import { Collapse, Row, Col, Select, Button, Table, Radio, message, DatePicker } from 'antd'
import intl from 'react-intl-universal'
import moment from 'moment'
import RightOperation from '../../components/containers/right-operation/rightOperation'
import DraggableModal from '../../components/cores/draggableModal/draggableModal'
import { _getrightOperation, _getLocalMachine, _getRecordConfig } from '../../common/api/siteManage'
import { _getServerService, _setNoticeParamUpdate, _setServerRestart } from '../../common/api/setting'
import styles from './index.module.less'

class Setting extends React.Component<any, any> {
    constructor(props: any) {
        super(props)
        this.state = {
            rightOperationData: [],
            value: '',
            localMachineInfo: {
                params: {
                    system_id: 270
                }
            },
            localMachineData: [],
            serverData: [],
            columns: [
                {
                    title: `${intl.get('M26P102261011099800P002').d('服务别名')}`,
                    dataIndex: 'service_alias',
                    key: 'service_alias'
                },
                {
                    title: `${intl.get('M26P102261011099800P003').d('服务ID')}`,
                    dataIndex: 'service_id',
                    key: 'service_id'
                },
                {
                    title: `${intl.get('M26P102261011099800P004').d('服务类别')}`,
                    dataIndex: 'service_type',
                    key: 'service_type'
                },
                {
                    title: `${intl.get('M26P102261011090100P001').d('状态')}`,
                    dataIndex: 'status',
                    key: 'status'
                },
                {
                    title: `${intl.get('M26P102261011090100ML019').d('restful端口')}`,
                    dataIndex: 'restful_port',
                    key: 'restful_port'
                },
                {
                    title: `${intl.get('M26P102261011090100ML005').d('websocket端口')}`,
                    dataIndex: 'websocket_port',
                    key: 'websocket_port'
                }
            ],
            dataSource: [],
            activeRow: {},
            ip: '',
            port: '',
            fastVisible: false,
            waitVisible: false,
            operation: 'R',
            time: moment(),
            rowData: [], // 选中一行的数据
            type: 1
        }
    }

    public componentDidMount(): void {
        this.getRightOperation()
        this.getLocalMachine()
    }

    // 获取站点列表
    public getLocalMachine = async (): Promise<void> => {
        _getLocalMachine(this.state.localMachineInfo).then((res: any): void => {
            if (res && res.result && res.data !== 'null') {
                const localMachine = JSON.parse(res.data)
                this.setState({
                    localMachineData: localMachine
                })
            }
        })
    }

    // 获取站点下的服务器
    public getServiceData = (): void => {
        this.getService()
    }

    // 获取服务器列表
    public getService = async (): Promise<void> => {
        const data = {
            params: {
                system_id: 289,
                site_id: this.state.value
            }
        }
        _getRecordConfig(data).then((res: any): void => {
            if (res && res.result && res.data !== 'null') {
                const serverdata = JSON.parse(res.data)
                this.setState({
                    serverData: serverdata
                })
            }
        })
    }

    // 获取右侧菜单
    public getRightOperation = async (): Promise<void> => {
        const res: any = await _getrightOperation({
            params: {
                parent_id: '1022610110998000000',
                resource_id: ''
            }
        })
        if (res && res.result) {
            const rightOperation = res.data[0].P004
            this.setState({
                rightOperationData: rightOperation
            })
        }
    }

    // 右侧操作
    public rightIdData = (data: any): void => {
        if (data.P003 === 'OP102261011099801') {
            console.log('这是立即生效')
            if (this.state.rowData.length === 0) {
                message.warning(`${intl.get('M26P102261011099800PM001').d('请选择一行数据')}`)
            } else {
                this.setState({
                    fastVisible: true,
                    type: 1
                })
            }
        } else if (data.P003 === 'OP102261011099809') {
            console.log('这是稍后生效')
            if (this.state.rowData.length === 0) {
                message.warning(`${intl.get('M26P102261011099800PM001').d('请选择一行数据')}`)
            } else {
                this.setState({
                    waitVisible: true,
                    type: 2
                })
            }
        }
    }

    public _handleChange = (e: any): void => {
        console.log(e)
        this.setState((): any => ({
            operation: e.target.value
        }))
    }

    public _handleChangeOthers = (e: any): void => {
        console.log(e)
        this.setState((): any => ({
            value: e
        }))
    }

    public _handleChangeTime = (e: any): void => {
        console.log(e)
        this.setState((): any => ({
            time: e
        }))
    }

    // 通知本机有参数更新
    public setNoticeParamUpdate = async (): Promise<void> => {
        const res: any = await _setNoticeParamUpdate({
            params: {
                server_ip: this.state.ip,
                server_port: this.state.port
            }
        })
        if (res && res.result) {
            console.log(res)
            this.setServerRestart()
        }
    }

    // 立即生效
    public setServerRestart = async (): Promise<void> => {
        const serverRestartList = []
        if (this.state.type === 1) {
            for (const item of this.state.rowData) {
                if (item.service_type === `${intl.get('M26P102261011090500MT002').d('录音服务')}`) {
                    item.service_type = '271'
                } else if (item.service_type === `${intl.get('M26P102261011090500MT001').d('许可服务')}`) {
                    item.service_type = '284'
                } else if (item.service_type === `${intl.get('M26P102261011090500MT003').d('监视监听服务')}`) {
                    item.service_type = '276'
                } else if (item.service_type === `${intl.get('M26P102261011090500MT004').d('归档回删服务')}`) {
                    item.service_type = '282'
                } else if (item.service_type === `${intl.get('M26P102261011090500ML026').d('DBbridge')}`) {
                    item.service_type = '273'
                }
                serverRestartList.push({ service_type: item.service_type, operation: this.state.operation, op_time: '0' })
            }
            console.log(serverRestartList)
            const data = {
                ip: this.state.ip,
                port: this.state.port,
                server_restart_list: serverRestartList
            }
            const res: any = await _setServerRestart(data)
            if (res && res.result) {
                console.log(res)
                this.setState({
                    fastVisible: false
                })
            }
        } else {
            for (const item of this.state.rowData) {
                serverRestartList.push({ service_type: item.service_type, operation: this.state.operation, op_time: moment(this.state.time).utc().format('YYYY-MM-DD HH:mm:ss') })
            }
            console.log(serverRestartList)
            const data = {
                ip: this.state.ip,
                port: this.state.port,
                server_restart_list: serverRestartList
            }
            const res: any = await _setServerRestart(data)
            if (res && res.result) {
                console.log(res)
                this.setState({
                    waitVisible: false
                })
            }
        }
    }

    public renderService = (data: any): any => (
        data.map((item): any => {
            const rowSelection = {
                onChange: (selectedRowKeys: any, selectedRows: any): any => {
                    this.setState({
                        rowData: selectedRows
                    }, (): void => {
                        console.log(this.state.rowData)
                    })
                    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
                }
            }
            return (
                <Collapse.Panel
                    header={
                        <div>
                            {item.ipaddress}
                        </div>
                    }
                    // onClick={(): void => this.getServerList(item)}
                    key={item.deviceid}
                >
                    <Table
                        rowSelection={rowSelection}
                        onRow={this.clickRow}
                        rowClassName={this.setRowClassName}
                        dataSource={this.state.dataSource}
                        columns={this.state.columns}
                        pagination={false}
                    />
                </Collapse.Panel>
            )
        })
    )

    public clickRow = (record): any => ({
        onClick: (): any => {
            console.log(record)
            this.setState({ activeRow: record })
        }
    })

    public setRowClassName = (record): any => (record.key === this.state.activeRow.key ? 'clickRow' : '')

    public getServerList = (data): void => {
        if (data !== undefined) {
            const server = JSON.parse(JSON.stringify(this.state.serverData))
            console.log(server)
            if (server.length > 1) {
                const serverCurrent = server[data - 1]
                console.log(serverCurrent)
                this.setState((): any => ({
                    ip: serverCurrent[0].ipaddress,
                    port: serverCurrent[0].port
                }))
                const serverdata = {
                    params: {
                        server_ip: serverCurrent[0].ipaddress,
                        server_port: serverCurrent[0].port
                    }
                }
                _getServerService(serverdata).then((res: any): void => {
                    if (res && res.result) {
                        const datasource = []
                        if (res.data !== null) {
                            for (const item of res.data) {
                                item.key = `${item.service_type}${Math.floor(Math.random() * 10000000)}`
                                if (item.status === '1') {
                                    item.status = `${intl.get('COM001002002V1').d('启用')}`
                                } else {
                                    item.status = `${intl.get('COM001002002V0').d('禁用')}`
                                }
                                if (item.service_type === '271') {
                                    item.service_type = `${intl.get('M26P102261011090500MT002').d('录音服务')}`
                                } else if (item.service_type === '284') {
                                    item.service_type = `${intl.get('M26P102261011090500MT001').d('许可服务')}`
                                } else if (item.service_type === '276') {
                                    item.service_type = `${intl.get('M26P102261011090500MT003').d('监视监听服务')}`
                                } else if (item.service_type === '282') {
                                    item.service_type = `${intl.get('M26P102261011090500MT004').d('归档回删服务')}`
                                } else if (item.service_type === '273') {
                                    item.service_type = `${intl.get('M26P102261011090500ML026').d('DBbridge')}`
                                }
                                datasource.push(item)
                            }
                            this.setState({
                                dataSource: datasource
                            })
                        } else if (res.data === null) {
                            this.setState({
                                dataSource: []
                            })
                        }
                    }
                })
            } else if (server.length === 1) {
                this.setState((): any => ({
                    ip: server[0].ipaddress,
                    port: server[0].port
                }))
                const serverdata = {
                    params: {
                        server_ip: server[0].ipaddress,
                        server_port: server[0].port
                    }
                }
                _getServerService(serverdata).then((res: any): void => {
                    if (res && res.result) {
                        const datasource = []
                        if (res.data !== null) {
                            for (const item of res.data) {
                                item.key = `${item.service_type}${Math.floor(Math.random() * 10000000)}`
                                if (item.status === '1') {
                                    item.status = `${intl.get('COM001002002V1').d('启用')}`
                                } else {
                                    item.status = `${intl.get('COM001002002V0').d('禁用')}`
                                }
                                if (item.service_type === '271') {
                                    item.service_type = `${intl.get('M26P102261011090500MT002').d('录音服务')}`
                                } else if (item.service_type === '284') {
                                    item.service_type = `${intl.get('M26P102261011090500MT001').d('许可服务')}`
                                } else if (item.service_type === '276') {
                                    item.service_type = `${intl.get('M26P102261011090500MT003').d('监视监听服务')}`
                                } else if (item.service_type === '282') {
                                    item.service_type = `${intl.get('M26P102261011090500MT004').d('归档回删服务')}`
                                } else if (item.service_type === '273') {
                                    item.service_type = `${intl.get('M26P102261011090500ML026').d('DBbridge')}`
                                }
                                datasource.push(item)
                            }
                            this.setState({
                                dataSource: datasource
                            })
                        } else if (res.data === null) {
                            this.setState({
                                dataSource: []
                            })
                        }
                    }
                })
            }
        }
    }

    public handleSetServerRestart = (): void => {
        this.setNoticeParamUpdate()
    }

    public render(): React.ReactElement {
        return (
            <div className={styles.main}>
                <div className={styles.contentLeft}>
                    <Row className={styles.row}>
                        <Col span={4}>
                            {intl.get('M26P102261011099800P001').d('选择站点')}
                        </Col>
                        <Col span={6}>
                            <Select onChange={(e): void => { this._handleChangeOthers(e) }} style={{ width: '100%' }} value={this.state.value}>
                                {this.state.localMachineData.length > 0 && this.state.localMachineData.map((item): any => (<Select.Option value={item.siteid} key={item.siteid}>{item.sitename}</Select.Option>))}
                            </Select>
                        </Col>
                        <Col span={4}>
                            <Button onClick={(): void => { this.getServiceData() }} type="primary">{intl.get('COM00100010001').d('确定')}</Button>
                        </Col>
                    </Row>
                    <Collapse accordion onChange={(key): void => { this.getServerList(key) }}>
                        {this.renderService(this.state.serverData)}
                    </Collapse>
                </div>
                <RightOperation rightOperationData={this.state.rightOperationData} operateCallBack={(data): void => this.rightIdData(data)} />
                <DraggableModal
                    visible={this.state.fastVisible}
                    title={intl.get('FO1022610110998010000').d('立即生效')}
                    width={400}
                    onOk={(): void => { this.handleSetServerRestart() }}
                    onCancel={(): void => { this.setState({ fastVisible: false }) }}
                >
                    <Row style={{ margin: '30px' }}>
                        <Col span={8}>
                            {intl.get('M26P102261011099800ML001').d('方法')}
                        </Col>
                        <Col span={16}>
                            <Radio.Group onChange={(e): void => { this._handleChange(e) }} value={this.state.operation}>
                                <Radio value="R">{intl.get('M26P102261011099800ML002').d('重新启动')}</Radio>
                                <Radio value="S">{intl.get('M26P102261011099800ML003').d('停止')}</Radio>
                            </Radio.Group>
                        </Col>
                    </Row>
                </DraggableModal>
                <DraggableModal
                    visible={this.state.waitVisible}
                    title={intl.get('FO1022610110998090000').d('稍后生效')}
                    width={400}
                    onOk={(): void => { this.handleSetServerRestart() }}
                    onCancel={(): void => { this.setState({ waitVisible: false }) }}
                >
                    <Row style={{ margin: '30px' }}>
                        <Col span={8}>
                            {intl.get('M26P102261011099800ML001').d('方法')}
                        </Col>
                        <Col span={16}>
                            <Radio.Group onChange={(e): void => { this._handleChange(e) }} value={this.state.operation}>
                                <Radio value="R">{intl.get('M26P102261011099800ML002').d('重新启动')}</Radio>
                                <Radio value="S">{intl.get('M26P102261011099800ML003').d('停止')}</Radio>
                            </Radio.Group>
                        </Col>
                    </Row>
                    <Row style={{ margin: '30px' }}>
                        <Col span={8}>
                            {intl.get('M26P102261011099800ML003').d('M26P102261011099800ML004')}
                        </Col>
                        <Col span={16}>
                            <DatePicker value={this.state.time} style={{ width: '100%' }} onChange={(e): void => { this._handleChangeTime(e) }} format="YYYY-MM-DD HH:mm:ss" />
                        </Col>
                    </Row>
                </DraggableModal>
            </div>
        )
    }
}

export default Setting
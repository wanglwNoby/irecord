import * as React from 'react'
import { Row, Col, Input, Select, Checkbox, Tabs, Button } from 'antd'
import intl from 'react-intl-universal'
import styles from './server.module.less'
import { _getMachineName, _getServerUid } from '../../common/api/siteManage'
import { _getOptionLang } from '../../common/api/global'

function callback(key): void {
    console.log(key)
}

interface IState {
    formData: {
        IP_address: string; // ip
        type: string; // 类型
        alias: string; // 别名
        logLevel: string; // 日志等级
        functionMonitor: boolean; // 性能监视
        guid: number; // 服务器唯一资源码
        port: number; // rest端口
        websocketPort: number; // websocket端口
    };
    category: any[]; // 类别数据语言包
    log: any[]; // 日志等级语言包数据
}
class Server extends React.Component<any, IState> {
    constructor(props: any) {
        super(props)
        this.state = {
            formData: {
                IP_address: '',
                type: '1',
                alias: '',
                logLevel: '2',
                functionMonitor: true,
                guid: undefined,
                port: 2600,
                websocketPort: 2640
            },
            category: [],
            log: []
        }
    }

    public componentDidMount(): void {
        console.log(this.props.dataInfo)
        if (this.props.editType === 2) {
            const formData1 = {
                IP_address: this.props.dataInfo.ipaddress,
                type: this.props.dataInfo.type.toString(),
                alias: this.props.dataInfo.alias,
                logLevel: this.props.dataInfo.loglevel.toString(),
                functionMonitor: this.props.dataInfo.functionmonitor === 1,
                guid: this.props.dataInfo.guid,
                port: this.props.dataInfo.port,
                websocketPort: this.props.dataInfo.websocketport

            }
            this.setState({
                formData: formData1
            }, (): void => {
                console.log(this.state.formData)
                this.props.ServerDevice(this.state.formData)
            })
        }
        this.props.ServerDevice(this.state.formData)
        this.getOptionLangs()
        this.getOptionLangs1()
    }

    // 获取下拉单选类别数据语言包
    public getOptionLangs = async (): Promise<void> => {
        const params = {
            params: {
                parent_code: '1115',
                type: ''
            }
        }
        const res: any = await _getOptionLang(params)
        if (res && res.result) {
            this.setState({
                category: res.data
            })
        }
    }

    // 获取下拉单选类别数据语言包
    public getOptionLangs1 = async (): Promise<void> => {
        const params = {
            params: {
                parent_code: '1109',
                type: ''
            }
        }
        const res: any = await _getOptionLang(params)
        if (res && res.result) {
            this.setState({
                log: res.data
            })
        }
    }

    // 所有input输入框事件
    public _handleChangeInput = (type: any, e: any): void => {
        const value = e.target.value
        this.setState((prevState): any => ({
            formData: { ...prevState.formData, [type]: value }
        }), (): void => { this.props.ServerDevice(this.state.formData) })
    }

    // 所有通用Form表单下拉框,switch开关,多选checkbox,呼叫方向,rangeDatepicker事件
    public _handleChangeOthers = (type: any, value: any): void => {
        this.setState((prevState): any => ({
            formData: { ...prevState.formData, [type]: value }
        }), (): void => { this.props.ServerDevice(this.state.formData) })
    }

    // 所有单选checkbox事件
    public _handleChangeCheckBox = (type: any, e: any): void => {
        const value = e.target.checked
        this.setState((prevState): any => ({
            formData: { ...prevState.formData, [type]: value }
        }), (): void => { this.props.ServerDevice(this.state.formData) })
    }

    // 获取别名与唯一资源码
    public handleMachineName = (): void => {
        this.getMachineName()
    }

    public getMachineName = async (): Promise<void> => {
        const params = {
            params: {
                server_ip: this.state.formData.IP_address,
                server_port: this.state.formData.port
            }

        }
        // 获取别名
        const res: any = await _getMachineName(params)
        if (res && res.result) {
            const aliasData = res.data
            this.setState((prevState): any => ({
                formData: { ...prevState.formData, alias: aliasData }
            }), (): void => { this.props.ServerDevice(this.state.formData) })
        }
        // 获取唯一资源码
        const res1: any = await _getServerUid(params)
        if (res1 && res1.result) {
            const guidData = res1.data
            this.setState((prevState): any => ({
                formData: { ...prevState.formData, guid: guidData }
            }), (): void => { this.props.ServerDevice(this.state.formData) })
        }
    }

    public render(): React.ReactElement {
        return (
            <div className={styles.server}>
                <Tabs defaultActiveKey="1" onChange={callback}>
                    <Tabs.TabPane tab={intl.get('M26P102261011090100MC001').d('基本配置')} key="1">
                        <Row style={{ marginTop: '20px' }}>
                            <Col span={8}>
                                {intl.get('M26P102261011090100ML004').d('IP')}
                            </Col>
                            <Col span={16}><Input disabled={this.props.editType === 2} onChange={(e): void => { this._handleChangeInput('IP_address', e) }} value={this.state.formData.IP_address} /></Col>
                        </Row>
                        <Row>
                            <Col span={8}>{intl.get('M26P102261011090100ML005').d('websocket端口')}</Col>
                            <Col span={3}><Input onChange={(e): void => { this._handleChangeInput('websocketPort', e) }} value={this.state.formData.websocketPort} /></Col>
                            <Col style={{ textAlign: 'center' }} span={8}>{intl.get('M26P102261011090100ML019').d('restful端口')}</Col>
                            <Col span={3}><Input onChange={(e): void => { this._handleChangeInput('port', e) }} value={this.state.formData.port} /></Col>
                        </Row>
                        <Row>
                            <Col span={8}>{intl.get('M26P102261011090100ML006').d('服务器别名')}</Col>
                            <Col span={12}><Input disabled onChange={(e): void => { this._handleChangeInput('alias', e) }} value={this.state.formData.alias} /></Col>
                            <Col style={{ textAlign: 'right' }} span={4}><Button className="ant-btn-primary" onClick={(): void => this.handleMachineName()}>获取</Button></Col>
                        </Row>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab={intl.get('M26P102261011090100MC002').d('其他配置')} key="2">
                        <Row style={{ marginTop: '20px' }}>
                            <Col span={8}>{intl.get('M26P102261011090100ML007').d('类别')}</Col>
                            <Col span={16}>
                                <Select onChange={(e): void => { this._handleChangeOthers('type', e) }} value={this.state.formData.type} style={{ width: '100%' }}>
                                    {/* <Option value={1}>实体机</Option>
                                    <Option value={2}>虚拟机</Option> */}
                                    {this.state.category && this.state.category.map((item): React.ReactElement => (<Select.Option value={item.valid_data} key={item.order_id}>{item.display_character}</Select.Option>))}
                                </Select>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>{intl.get('BDN000211108999').d('日志等级')}</Col>
                            <Col span={16}>
                                <Select onChange={(e): void => { this._handleChangeOthers('logLevel', e) }} value={this.state.formData.logLevel} style={{ width: '100%' }}>
                                    {/* <Option value={0}>0</Option>
                                    <Option value={1}>1</Option>
                                    <Option value={2}>2</Option>
                                    <Option value={3}>3</Option>
                                    <Option value={4}>4</Option>
                                    <Option value={5}>5</Option> */}
                                    {this.state.log && this.state.log.map((item): React.ReactElement => (<Select.Option value={item.valid_data} key={item.order_id}>{item.display_character}</Select.Option>))}
                                </Select>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Checkbox checked={this.state.formData.functionMonitor} onChange={(e): void => { this._handleChangeCheckBox('functionMonitor', e) }}>{intl.get('M26P102261011090100ML008').d('启用性能监视')}</Checkbox>
                            </Col>
                        </Row>
                    </Tabs.TabPane>
                </Tabs>
            </div>
        )
    }
}


export default Server
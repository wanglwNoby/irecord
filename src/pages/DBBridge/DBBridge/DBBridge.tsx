import * as React from 'react'
import { Row, Col, Input, Select, Checkbox, Tabs } from 'antd'
import intl from 'react-intl-universal'
import { _getOptionLang } from '../../../common/api/global'

function callback(key): void {
    console.log(key)
}
interface IState {
    formData: {
        guid: number; // 所在服务器
        alias: string; // 别名
        logLevel: string; // 日志等级
        alarmPush: boolean; // 消息告警
        restfulPort: number; // restful端口
        websocketPort: number; // websocket端口
        description: string; // 描述
    };
    log: any[]; // 日志等级语言包数据
}

class DBBridge extends React.Component<any, IState> {
    constructor(props: any) {
        super(props)
        this.state = {
            formData: {
                guid: undefined,
                alias: '',
                logLevel: '2',
                alarmPush: true,
                restfulPort: 2611,
                websocketPort: 2641,
                description: ''
            },
            log: []
        }
    }

    public componentDidMount(): void {
        if (this.props.editType === 2) {
            const formData1 = {
                guid: this.props.dataInfo.guid,
                alias: this.props.dataInfo.alias,
                logLevel: this.props.dataInfo.loglevel.toString(),
                alarmPush: this.props.dataInfo.alarmpush === 1,
                restfulPort: this.props.dataInfo.restfulport,
                websocketPort: this.props.dataInfo.websocketport,
                description: this.props.dataInfo.description
            }
            this.setState({
                formData: formData1
            }, (): void => {
                this.props.DBBridge(this.state.formData)
            })
        }
        this.getOptionLangs()
    }

    // 获取下拉单选类别数据语言包
    public getOptionLangs = async (): Promise<void> => {
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
        }), (): void => { this.props.DBBridge(this.state.formData) })
    }

    // 所有通用Form表单下拉框,switch开关,多选checkbox,呼叫方向,rangeDatepicker事件
    public _handleChangeOthers = (type: any, value: any): void => {
        this.setState((prevState): any => ({
            formData: { ...prevState.formData, [type]: value }
        }), (): void => { this.props.DBBridge(this.state.formData) })
    }

    // 所有单选checkbox事件
    public _handleChangeCheckBox = (type: any, e: any): void => {
        const value = e.target.checked
        this.setState((prevState): any => ({
            formData: { ...prevState.formData, [type]: value }
        }), (): void => { this.props.DBBridge(this.state.formData) })
    }

    public render(): React.ReactElement {
        return (
            <div>
                <Tabs defaultActiveKey="1" onChange={callback}>
                    <Tabs.TabPane tab={intl.get('M26P102261011090100MC001').d('基本配置')} key="1">
                        <Row style={{ marginTop: '20px' }}>
                            <Col span={8}>{intl.get('M26P102261011090100ML011').d('所在服务器')}</Col>
                            <Col span={16}>
                                <Select onChange={(e): void => { this._handleChangeOthers('guid', e) }} value={this.state.formData.guid} style={{ width: '100%' }}>
                                    {this.props.serverData.length > 0 && this.props.serverData.map((item): any => (<Select.Option value={item.guid} key={item.guid}>{item.ipaddress}</Select.Option>))}
                                </Select>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>{intl.get('M26P102261011090300ML001').d('DBBridge别名')}</Col>
                            <Col span={16}><Input onChange={(e): void => { this._handleChangeInput('alias', e) }} value={this.state.formData.alias} /></Col>
                        </Row>
                        <Row>
                            <Col span={8}>{intl.get('M26P102261011090100ML005').d('websocket端口')}</Col>
                            <Col span={16}><Input onChange={(e): void => { this._handleChangeInput('websocketPort', e) }} value={this.state.formData.websocketPort} /></Col>
                        </Row>
                        <Row>
                            <Col span={8}>{intl.get('M26P102261011090100ML019').d('restful端口')}</Col>
                            <Col span={16}><Input type="number" onChange={(e): void => { this._handleChangeInput('restfulPort', e) }} value={this.state.formData.restfulPort} /></Col>
                        </Row>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab={intl.get('M26P102261011090100MC002').d('其他配置')} key="2">
                        <Row style={{ marginTop: '20px' }}>
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
                            <Col span={8}>{intl.get('M26P102261011090100ML003').d('描述')}</Col>
                            <Col span={16}>
                                <Input.TextArea onChange={(e): void => { this._handleChangeInput('description', e) }} value={this.state.formData.description} />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={26}>
                                <Checkbox checked={this.state.formData.alarmPush} onChange={(e): void => { this._handleChangeCheckBox('alarmPush', e) }}>{intl.get('M26P102261011090300ML002').d('启用消息告警服务')}</Checkbox>
                            </Col>
                        </Row>
                    </Tabs.TabPane>
                </Tabs>
            </div>
        )
    }
}

export default DBBridge
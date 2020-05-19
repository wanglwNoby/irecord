import * as React from 'react'
import { Row, Col, Input, Select, Radio, Tabs, Checkbox } from 'antd'
import intl from 'react-intl-universal'
import { _getOptionLang } from '../../../common/api/global'

const { Option } = Select
function callback(key): void {
    console.log(key)
}
interface IState {
    formData: {
        licenseId: number;
        mainStandby: number;
        restfulPort: number;
        websocketPort: number;
        alias: string;
        description: string;
        state: boolean;
        alarmPush: boolean;
        logLevel: string;
    };
    log: any[]; // 日志等级语言包数据
}

class Licence extends React.Component<any, IState> {
    constructor(props: any) {
        super(props)
        this.state = {
            formData: {
                licenseId: 1,
                mainStandby: 1,
                restfulPort: 6901,
                websocketPort: 6941,
                alias: '',
                description: '',
                state: true,
                alarmPush: true,
                logLevel: '2'
            },
            log: []
        }
    }

    public componentDidMount(): void {
        console.log('1111')
        this.props.licence(this.state.formData)
        if (this.props.editType === 2 && this.props.licenceInfoData.length !== 0) {
            console.log(this.props.licenceInfoData)
            const formData1 = {
                licenseId: this.props.licenceInfoData[0].licenseid,
                mainStandby: this.props.licenceInfoData[0].mainstandby,
                restfulPort: this.props.licenceInfoData[0].restfulport,
                websocketPort: this.props.licenceInfoData[0].websocketport,
                alias: this.props.licenceInfoData[0].alias,
                description: this.props.licenceInfoData[0].description,
                state: this.props.licenceInfoData[0].state === 1,
                alarmPush: this.props.licenceInfoData[0].alarmpush === 1,
                logLevel: this.props.licenceInfoData[0].loglevel.toString()
            }
            this.setState({
                formData: formData1
            }, (): void => {
                console.log(this.state.formData)
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
        }), (): void => { this.props.licence(this.state.formData) })
    }

    // 所有通用Form表单下拉框,switch开关,多选checkbox,呼叫方向,rangeDatepicker事件
    public _handleChangeOthers = (type: any, value: any): void => {
        this.setState((prevState): any => ({
            formData: { ...prevState.formData, [type]: value }
        }), (): void => { this.props.licence(this.state.formData) })
    }

    // 所有单选checkbox事件
    public _handleChangeCheckBox = (type: any, e: any): void => {
        const value = e.target.checked
        this.setState((prevState): any => ({
            formData: { ...prevState.formData, [type]: value }
        }), (): void => { this.props.licence(this.state.formData) })
    }

    public render(): React.ReactElement {
        console.log(this.props.serverList)
        return (
            <div>
                <Tabs defaultActiveKey="1" onChange={callback}>
                    <Tabs.TabPane tab={intl.get('M26P102261011090100MC001').d('基本配置')} key="1">
                        <Row style={{ marginTop: '20px' }}>
                            <Col span={10}>{intl.get('M26P102261011090500ML001').d('许可服务别名')}</Col>
                            <Col span={14}><Input onChange={(e): void => { this._handleChangeInput('alias', e) }} value={this.state.formData.alias} /></Col>
                        </Row>
                        <Row>
                            <Col span={10}>{intl.get('M26P102261011090500ML002').d('许可服务编号')}</Col>
                            <Col span={14}>
                                <Select onChange={(e): void => { this._handleChangeOthers('licenseId', e) }} value={this.state.formData.licenseId} style={{ width: '100%' }}>
                                    <Option value={1}>1</Option>
                                    <Option value={2}>2</Option>
                                </Select>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={10}>{intl.get('M26P102261011090100ML019').d('restful端口')}</Col>
                            <Col span={3}><Input onChange={(e): void => { this._handleChangeInput('restfulPort', e) }} value={this.state.formData.restfulPort} /></Col>
                            <Col style={{ textAlign: 'center' }} span={8}>{intl.get('M26P102261011090100ML005').d('websocket端口')}</Col>
                            <Col span={3}><Input onChange={(e): void => { this._handleChangeInput('websocketPort', e) }} value={this.state.formData.websocketPort} /></Col>
                        </Row>
                        <Row>
                            <Col span={10}>{intl.get('M26P102261011090500ML003').d('主备')}</Col>
                            <Col span={14}>
                                <Radio.Group onChange={(e): void => { this._handleChangeInput('mainStandby', e) }} value={this.state.formData.mainStandby}>
                                    <Radio value={1}>{intl.get('M26P102261011090500ML004').d('主')}</Radio>
                                    <Radio value={0}>{intl.get('M26P102261011090500ML005').d('备')}</Radio>
                                </Radio.Group>
                            </Col>
                        </Row>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab={intl.get('M26P102261011090100MC002').d('其他配置')} key="2">
                        <Row style={{ marginTop: '20px' }}>
                            <Col span={10}>{intl.get('BDN000211108999').d('日志等级')}</Col>
                            <Col span={14}>
                                <Select onChange={(e): void => { this._handleChangeOthers('logLevel', e) }} value={this.state.formData.logLevel} style={{ width: '100%' }}>
                                    {/* <Select.Option value={1}>1</Select.Option>
                                    <Select.Option value={2}>2</Select.Option>
                                    <Select.Option value={3}>3</Select.Option>
                                    <Select.Option value={4}>4</Select.Option>
                                    <Select.Option value={5}>5</Select.Option> */}
                                    {this.state.log && this.state.log.map((item): React.ReactElement => (<Select.Option value={item.valid_data} key={item.order_id}>{item.display_character}</Select.Option>))}
                                </Select>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={10}>{intl.get('M26P102261011090100ML003').d('描述')}</Col>
                            <Col span={14}><Input.TextArea onChange={(e): void => { this._handleChangeInput('description', e) }} value={this.state.formData.description} /></Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <Checkbox checked={this.state.formData.alarmPush} onChange={(e): void => { this._handleChangeCheckBox('alarmPush', e) }}>{intl.get('M26P102261011090500ML006').d('启用告警消息推送服务')}</Checkbox>
                            </Col>
                            <Col span={12}>
                                <Checkbox checked={this.state.formData.state} onChange={(e): void => { this._handleChangeCheckBox('state', e) }}>{intl.get('M26P102261011090500ML007').d('启用状态')}</Checkbox>
                            </Col>
                        </Row>
                    </Tabs.TabPane>
                </Tabs>
            </div>
        )
    }
}


export default Licence
import * as React from 'react'
import { Row, Col, Input, Select, Tabs, Checkbox, Icon } from 'antd'
import intl from 'react-intl-universal'
import { _getOptionLang } from '../../../common/api/global'

const { Option } = Select
function callback(key): void {
    console.log(key)
}
interface IState {
    formData: {
        masterId: number;
        restfulPort: number;
        websocketPort: number;
        recordType: string;
        startDelay: number;
        concurrentChannel: number;
        maxMuteDuration: string;
        minRecordDuration: string;
        maxRecordDuration: string;
        mediaFormat: string;
        storageDevice: number;
        alias: string;
        dbBridgeId: number;
        hashCheckCode: boolean;
        streamBuffer: string;
        guid: string;
        pushStream: number;
        filingMonths: number;
        alarmPush: boolean;
        startArchive: boolean;
        startDelete: boolean;
        startEncryption: boolean;
        description: string;
        logLevel: string;
        state: boolean;
        moreThanRecordTime: number;
        lessThanRecordTime: number;
        doubleTrack: boolean;
    };
    log: any[]; // 日志等级语言包数据
    recordTypeData: any[]; // 录音类型语言包数据
    recordCode: any[]; // 录音服务编码语言包数据
    ipValues: any[];
}

class RecordService extends React.Component<any, IState> {
    constructor(props: any) {
        super(props)
        this.state = {
            formData: {
                masterId: -1,
                restfulPort: 2601,
                websocketPort: 2601,
                recordType: '65',
                startDelay: 0,
                concurrentChannel: 0,
                maxMuteDuration: '',
                minRecordDuration: '0',
                maxRecordDuration: '3600',
                mediaFormat: '1',
                storageDevice: undefined,
                alias: '',
                dbBridgeId: undefined,
                hashCheckCode: false,
                streamBuffer: '200',
                guid: '',
                pushStream: 0,
                filingMonths: 6,
                alarmPush: true,
                startArchive: false,
                startDelete: false,
                startEncryption: false,
                description: '',
                logLevel: '2',
                state: true,
                lessThanRecordTime: 10,
                moreThanRecordTime: 1200,
                doubleTrack: false
            },
            log: [],
            recordTypeData: [],
            recordCode: [],
            ipValues: [] // ip网关列表
        }
    }

    public componentDidMount(): void {
        console.log(this.props.currentServer)
        console.log(this.props.masterData)
        if (this.props.editType === 1) {
            this.props.recordService(this.state.formData)
        }
        if (this.props.currentServer) {
            const formData2 = {
                masterId: -1,
                restfulPort: 2601,
                websocketPort: 2601,
                recordType: '65',
                startDelay: 0,
                concurrentChannel: 0,
                maxMuteDuration: '',
                minRecordDuration: '5',
                maxRecordDuration: '3600',
                mediaFormat: '1',
                storageDevice: undefined,
                alias: this.props.currentServer.alias,
                dbBridgeId: undefined,
                hashCheckCode: false,
                streamBuffer: '200',
                guid: '',
                pushStream: 0,
                filingMonths: 6,
                alarmPush: true,
                startArchive: false,
                startDelete: false,
                startEncryption: false,
                description: '',
                logLevel: '2',
                state: true,
                lessThanRecordTime: 10,
                moreThanRecordTime: 1200,
                doubleTrack: false
            }
            this.setState({
                formData: formData2
            }, (): void => {
                console.log(this.state.formData)
            })
        }

        if (this.props.editType === 2 && this.props.recordInfoData.length !== 0) {
            console.log(this.props.recordInfoData)
            const formData1 = {
                masterId: this.props.recordInfoData[0].masterid,
                restfulPort: this.props.recordInfoData[0].restfulport,
                websocketPort: this.props.recordInfoData[0].websocketport,
                recordType: this.props.recordInfoData[0].recordtype.toString(),
                startDelay: this.props.recordInfoData[0].startdelay,
                concurrentChannel: this.props.recordInfoData[0].concurrentchannel,
                maxMuteDuration: this.props.recordInfoData[0].maxmuteduration,
                minRecordDuration: this.props.recordInfoData[0].minrecordduration,
                maxRecordDuration: this.props.recordInfoData[0].maxrecordduration,
                mediaFormat: this.props.recordInfoData[0].mediaformat.toString(),
                storageDevice: Number(this.props.recordInfoData[0].storagedevice),
                alias: this.props.recordInfoData[0].alias,
                dbBridgeId: Number(this.props.recordInfoData[0].dbbridgeid),
                hashCheckCode: Number(this.props.recordInfoData[0].hashcheckcode) === 1,
                streamBuffer: this.props.recordInfoData[0].streambuffer,
                guid: this.props.recordInfoData[0].guid,
                pushStream: this.props.recordInfoData[0].pushstream,
                filingMonths: this.props.recordInfoData[0].filingmonths,
                alarmPush: this.props.recordInfoData[0].alarmpush === 1,
                startArchive: this.props.recordInfoData[0].startarchive === 1,
                startDelete: this.props.recordInfoData[0].startdelete === 1,
                startEncryption: this.props.recordInfoData[0].startencryption === 1,
                description: this.props.recordInfoData[0].description,
                logLevel: this.props.recordInfoData[0].loglevel.toString(),
                state: this.props.recordInfoData[0].state === 1,
                lessThanRecordTime: this.props.recordInfoData[0].lessthanrecordtime,
                moreThanRecordTime: this.props.recordInfoData[0].morethanrecordtime,
                doubleTrack: this.props.recordInfoData[0].doubletrack === 1
            }
            // const IpValues = JSON.parse(JSON.stringify(this.state.ipValues))
            console.log(this.props.recordInfoData[0])
            // if (this.props.recordInfoData[0].gatewayone !== null) {
            //     IpValues[0] = this.props.recordInfoData[0].gatewayone
            // } else {
            //     delete IpValues[0]
            // }
            // if (this.props.recordInfoData[0].gatewaytwo !== null) {
            //     IpValues[1] = this.props.recordInfoData[0].gatewaytwo
            // } else {
            //     delete IpValues[1]
            // }
            // if (this.props.recordInfoData[0].gatewaythree !== null) {
            //     IpValues[2] = this.props.recordInfoData[0].gatewaythree
            // } else {
            //     delete IpValues[2]
            // }
            // if (this.props.recordInfoData[0].gatewayfour !== null) {
            //     IpValues[3] = this.props.recordInfoData[0].gatewayfour
            // } else {
            //     delete IpValues[3]
            // }
            // if (this.props.recordInfoData[0].gatewayfive !== null) {
            //     IpValues[4] = this.props.recordInfoData[0].gatewayfive
            // } else {
            //     delete IpValues[4]
            // }
            // if (this.props.recordInfoData[0].gatewaysix !== null) {
            //     IpValues[5] = this.props.recordInfoData[0].gatewaysix
            // } else {
            //     delete IpValues[5]
            // }
            // if (this.props.recordInfoData[0].gatewayseven !== null) {
            //     IpValues[6] = this.props.recordInfoData[0].gatewayseven
            // } else {
            //     delete IpValues[6]
            // }
            // if (this.props.recordInfoData[0].gatewayeight !== null) {
            //     IpValues[7] = this.props.recordInfoData[0].gatewayeight
            // } else {
            //     delete IpValues[7]
            // }
            // if (this.props.recordInfoData[0].gatewaynine !== null) {
            //     IpValues[8] = this.props.recordInfoData[0].gatewaynine
            // } else {
            //     delete IpValues[8]
            // }
            // if (this.props.recordInfoData[0].gatewayten !== null) {
            //     IpValues[9] = this.props.recordInfoData[0].gatewayten
            // } else {
            //     delete IpValues[9]
            // }
            const IpValues = this.getIpValues(this.props.recordInfoData[0])
            // this.setState({
            //     formData: Object.assign({}, formData1),
            //     ipValues: IpValues
            // }, (): void => {
            //     console.log(this.state.formData)
            // })
            this.setState((): any => ({
                formData: Object.assign({}, formData1),
                ipValues: IpValues
            }), (): void => {
                this.props.recordService(this.state.formData)
                this.props.recordServiceIp(this.state.ipValues)
            })
        }
        this.getOptionLangs()
        this.getOptionLangs1()
        this.getOptionLangs2()
    }

    public getIpValues = (data: any): string[] => {
        const list: string[] = []
        if (data.gatewayone) {
            list.push(data.gatewayone)
        } else { return [''] }
        if (data.gatewaytwo) {
            list.push(data.gatewaytwo)
        } else { return list }
        if (data.gatewaythree) {
            list.push(data.gatewaythree)
        } else { return list }
        if (data.gatewayfour) {
            list.push(data.gatewayfour)
        } else { return list }
        if (data.gatewayfive) {
            list.push(data.gatewayfive)
        } else { return list }
        if (data.gatewaysix) {
            list.push(data.gatewaysix)
        } else { return list }
        if (data.gatewayseven) {
            list.push(data.gatewayseven)
        } else { return list }
        if (data.gatewayseven) {
            list.push(data.gatewayseven)
        } else { return list }
        if (data.gatewayeight) {
            list.push(data.gatewayeight)
        } else { return list }
        if (data.gatewaynine) {
            list.push(data.gatewaynine)
        } else { return list }
        if (data.gatewayten) {
            list.push(data.gatewayten)
            return list
        }
        return list
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

    // 获取下拉录音类型数据语言包
    public getOptionLangs1 = async (): Promise<void> => {
        const params = {
            params: {
                parent_code: '2601',
                type: ''
            }
        }
        const res: any = await _getOptionLang(params)
        if (res && res.result) {
            this.setState({
                recordTypeData: res.data
            })
        }
    }

    // 获取下拉录音服务编码数据语言包
    public getOptionLangs2 = async (): Promise<void> => {
        const params = {
            params: {
                parent_code: '2603',
                type: ''
            }
        }
        const res: any = await _getOptionLang(params)
        if (res && res.result) {
            this.setState({
                recordCode: res.data
            })
        }
    }

    // 所有input输入框事件
    public _handleChangeInput = (type: any, e: any): void => {
        const value = e.target.value
        this.setState((prevState): any => ({
            formData: { ...prevState.formData, [type]: value }
        }), (): void => { this.props.recordService(this.state.formData) })
    }

    // 所有通用Form表单下拉框,switch开关,多选checkbox,呼叫方向,rangeDatepicker事件
    public _handleChangeOthers = (type: any, value: any): void => {
        this.setState((prevState): any => ({
            formData: { ...prevState.formData, [type]: value }
        }), (): void => {
            this.props.recordService(this.state.formData)
        })
    }

    // 所有单选checkbox事件
    public _handleChangeCheckBox = (type: any, e: any): void => {
        const value = e.target.checked
        this.setState((prevState): any => ({
            formData: { ...prevState.formData, [type]: value }
        }), (): void => { this.props.recordService(this.state.formData) })
    }

    public handleIplChange = (index: number, e: any): void => {
        const newEmail = e.target.value
        const newEmailValues = (ipValues: string[]): string[] => {
            ipValues[index] = newEmail
            return ipValues
        }
        this.setState((prevState: any): any => ({
            ipValues: [...newEmailValues(prevState.ipValues)]
        }), (): void => {
            this.props.recordServiceIp(this.state.ipValues)
            setTimeout((): void => {
                document.getElementById(`ip_${index}`).focus()
            }, 100)
        })
    }

    public deleteIp = (index: number): void => {
        this.state.ipValues.splice(index, 1)
        this.setState((prevState: any): any => ({
            ipValues: [...prevState.ipValues]
        }))
    }

    public addIp = (): void => {
        this.setState((prevState: any): any => ({
            ipValues: [
                ...prevState.ipValues, ''
            ]
        }), (): void => {
            console.log(this.state.ipValues)
        })
    }

    public render(): React.ReactElement {
        console.log(this.state.ipValues)
        return (
            <div>
                <Tabs defaultActiveKey="1" onChange={callback}>
                    <Tabs.TabPane tab={intl.get('M26P102261011090100MC001').d('基本配置')} key="1">
                        {/* <Row style={{ marginTop: '20px' }}>
                            <Col span={8}>所在服务器:</Col>
                            <Col span={16}>
                                <Select onChange={(e): void => { this._handleChangeOthers('guid', e) }} value={this.state.formData.guid} style={{ width: '100%' }}>
                                    {this.props.serviceData.length > 0 && this.props.serviceData.map((item): any => (<Select.Option value={item.guid} key={item.guid}>{item.IPAddress}</Select.Option>))}
                                </Select>
                            </Col>
                        </Row> */}
                        <Row style={{ marginTop: '20px' }}>
                            <Col span={10}>{intl.get('M26P102261011090500ML008').d('录音类型')}</Col>
                            <Col span={14}>
                                <Select onChange={(e): void => { this._handleChangeOthers('recordType', e) }} value={this.state.formData.recordType} style={{ width: '100%' }}>
                                    {/* <Option value={65}>模拟线</Option>
                                    <Option value={68}>数字线</Option>
                                    <Option value={73}>VoIP</Option>
                                    <Option value={133}>模拟+数字</Option> */}
                                    {this.state.recordTypeData && this.state.recordTypeData.map((item): React.ReactElement => (<Select.Option value={item.valid_data} key={item.order_id}>{item.display_character}</Select.Option>))}
                                </Select>
                            </Col>
                        </Row>
                        {this.state.formData.recordType === '73' ?
                            <Row>
                                <Col span={10}>{intl.get('M26P102261011090500ML024').d('master服务器')}</Col>
                                <Col span={14}>
                                    <Select onChange={(e): void => { this._handleChangeOthers('masterId', e) }} value={this.state.formData.masterId} style={{ width: '100%' }}>
                                        {/* <Option value={1}>1</Option>
                                        <Option value={2}>2</Option> */}
                                        {this.props.masterData.length > 0 && this.props.masterData.map((item): any => (<Select.Option value={item.guid} key={item.guid}>{item.IPAddress}</Select.Option>))}
                                    </Select>
                                </Col>
                            </Row> : null}
                        {this.state.formData.recordType === '73' ?
                            <Row>
                                <Col span={10}>{intl.get('M26P102261011090500ML025').d('并发通道数')}</Col>
                                <Col span={14}><Input onChange={(e): void => { this._handleChangeInput('concurrentChannel', e) }} value={this.state.formData.concurrentChannel} /></Col>
                            </Row> : null}
                        <Row>
                            <Col span={10}>{intl.get('M26P102261011090100MT003').d('存储设备')}</Col>
                            <Col span={14}>
                                <Select onChange={(e): void => { this._handleChangeOthers('storageDevice', e) }} value={this.state.formData.storageDevice} style={{ width: '100%' }}>
                                    {this.props.storageList.length > 0 && this.props.storageList.map((item): any => (<Select.Option value={item.DeviceId} key={item.DeviceId}>{item.Full_Name}</Select.Option>))}
                                </Select>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={10}>{intl.get('M26P102261011090500ML026').d('DBbridge')}</Col>
                            <Col span={14}>
                                <Select onChange={(e): void => { this._handleChangeOthers('dbBridgeId', e) }} value={this.state.formData.dbBridgeId} style={{ width: '100%' }}>
                                    {this.props.DBBirdgeList.length > 0 && this.props.DBBirdgeList.map((item): any => (<Select.Option value={item.dbbridgeid} key={item.dbbridgeid}>{item.full_name}</Select.Option>))}
                                </Select>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={10}>{intl.get('M26P102261011090500ML009').d('录音服务编码')}</Col>
                            <Col span={14}>
                                <Select onChange={(e): void => { this._handleChangeOthers('mediaFormat', e) }} style={{ width: '100%' }} value={this.state.formData.mediaFormat}>
                                    {/* <Option value={1}>G7lla</Option>
                                    <Option value={2}>G7llu</Option>
                                    <Option value={3}>PCM8</Option>
                                    <Option value={4}>PCM16</Option>
                                    <Option value={7}>GSM</Option> */}
                                    {this.state.recordCode && this.state.recordCode.map((item): React.ReactElement => (<Select.Option value={item.valid_data} key={item.order_id}>{item.display_character}</Select.Option>))}
                                </Select>
                            </Col>
                        </Row>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab={intl.get('M26P102261011090100MC002').d('其他配置')} key="2">
                        <Row style={{ marginTop: '20px' }}>
                            <Col span={10}>{intl.get('M26P102261011090500ML010').d('录音服务别名')}</Col>
                            <Col span={14}><Input onChange={(e): void => { this._handleChangeInput('alias', e) }} value={this.state.formData.alias} /></Col>
                        </Row>
                        <Row>
                            <Col span={10}>{intl.get('M26P102261011090500ML011').d('告警最小阀值(秒)')}</Col>
                            <Col span={3}><Input onChange={(e): void => { this._handleChangeInput('lessThanRecordTime', e) }} value={this.state.formData.lessThanRecordTime} /></Col>
                            <Col style={{ textAlign: 'center' }} span={8}>{intl.get('M26P102261011090500ML012').d('告警最大阀值(秒)')}</Col>
                            <Col span={3}><Input onChange={(e): void => { this._handleChangeInput('moreThanRecordTime', e) }} value={this.state.formData.moreThanRecordTime} /></Col>
                        </Row>
                        <Row>
                            <Col span={10}>{intl.get('M26P102261011090100ML019').d('restful端口')}</Col>
                            <Col span={3}><Input onChange={(e): void => { this._handleChangeInput('restfulPort', e) }} value={this.state.formData.restfulPort} /></Col>
                            <Col style={{ textAlign: 'center' }} span={8}>{intl.get('M26P102261011090100ML005').d('websocket端口')}</Col>
                            <Col span={3}><Input onChange={(e): void => { this._handleChangeInput('websocketPort', e) }} value={this.state.formData.websocketPort} /></Col>
                        </Row>
                        <Row>
                            <Col span={10}>{intl.get('M26P102261011090500ML013').d('最短录音时长')}</Col>
                            <Col span={3}><Input onChange={(e): void => { this._handleChangeInput('minRecordDuration', e) }} value={this.state.formData.minRecordDuration} /></Col>
                            <Col style={{ textAlign: 'center' }} span={8}>{intl.get('M26P102261011090500ML027').d('最大录音时长')}</Col>
                            <Col span={3}><Input onChange={(e): void => { this._handleChangeInput('maxRecordDuration', e) }} value={this.state.formData.maxRecordDuration} /></Col>
                        </Row>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab={intl.get('M26P102261011090100MC002').d('其他配置')} key="3">
                        <Row style={{ marginTop: '20px' }}>
                            <Col span={10}>{intl.get('M26P102261011090500ML028').d('最大静音时长')}</Col>
                            <Col span={14}><Input onChange={(e): void => { this._handleChangeInput('maxMuteDuration', e) }} value={this.state.formData.maxMuteDuration} /></Col>
                        </Row>
                        <Row>
                            <Col span={10}>{intl.get('M26P102261011090500ML029').d('启动延时')}</Col>
                            <Col span={14}><Input onChange={(e): void => { this._handleChangeInput('startDelay', e) }} value={this.state.formData.startDelay} /></Col>
                        </Row>
                        <Row>
                            <Col span={10}>{intl.get('M26P102261011090500ML030').d('推流BUFF延时')}</Col>
                            <Col span={14}><Input onChange={(e): void => { this._handleChangeInput('streamBuffer', e) }} value={this.state.formData.streamBuffer} /></Col>
                        </Row>
                        <Row>
                            <Col span={10}>{intl.get('BDN000211108999').d('日志等级')}</Col>
                            <Col span={14}>
                                <Select onChange={(e): void => { this._handleChangeOthers('logLevel', e) }} value={this.state.formData.logLevel} style={{ width: '100%' }}>
                                    {/* <Option value={1}>1</Option>
                                    <Option value={2}>2</Option>
                                    <Option value={3}>3</Option>
                                    <Option value={4}>4</Option>
                                    <Option value={5}>5</Option> */}
                                    {this.state.log && this.state.log.map((item): React.ReactElement => (<Select.Option value={item.valid_data} key={item.order_id}>{item.display_character}</Select.Option>))}
                                </Select>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={10}>{intl.get('M26P102261011090500ML031').d('归档录音记录')}</Col>
                            <Col span={8}>
                                <Select onChange={(e): void => { this._handleChangeOthers('filingMonths', e) }} value={this.state.formData.filingMonths} style={{ width: '100%' }}>
                                    <Option value={3}>3</Option>
                                    <Option value={6}>6</Option>
                                    <Option value={12}>12</Option>
                                    <Option value={24}>24</Option>
                                </Select>
                            </Col>
                            <Col style={{ textAlign: 'center', paddingTop: '3px' }} span={6}>{intl.get('M26P102261011090500ML032').d('月之前')}</Col>
                        </Row>
                        {/* <Row style={{ marginTop: '20px' }}>
                            <Col span={8}>实时监听主服务器:</Col>
                            <Col span={16}>
                                <Select onChange={(e): void => { this._handleChangeOthers('pushStream', e) }} value={this.state.formData.pushStream} style={{ width: '100%' }}>
                                    {this.props.serverList.length > 0 && this.props.serverList.map((item): any => (<Select.Option value={item.deviceId} key={item.deviceId}>{item.alias}</Select.Option>))}
                                </Select>
                            </Col>
                        </Row> */}
                    </Tabs.TabPane>
                    <Tabs.TabPane tab={intl.get('M26P102261011090100MC002').d('其他配置')} key="4">
                        <Row style={{ marginTop: '20px' }}>
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
                        <Row>
                            <Col span={12}>
                                <Checkbox checked={this.state.formData.hashCheckCode} onChange={(e): void => { this._handleChangeCheckBox('hashCheckCode', e) }}>{intl.get('M26P102261011090500ML033').d('启用HASH校验码')}</Checkbox>
                            </Col>
                            <Col span={12}>
                                <Checkbox checked={this.state.formData.startArchive} onChange={(e): void => { this._handleChangeCheckBox('startArchive', e) }}>{intl.get('M26P102261011090500ML034').d('启用归档')}</Checkbox>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <Checkbox checked={this.state.formData.startDelete} onChange={(e): void => { this._handleChangeCheckBox('startDelete', e) }}>{intl.get('M26P102261011090500ML035').d('启用回删')}</Checkbox>
                            </Col>
                            <Col span={12}>
                                <Checkbox checked={this.state.formData.startEncryption} onChange={(e): void => { this._handleChangeCheckBox('startEncryption', e) }}>{intl.get('M26P102261011090500ML036').d('启用录音加密')}</Checkbox>
                            </Col>
                        </Row>
                    </Tabs.TabPane>
                    {this.state.formData.recordType === '73' ?
                        <Tabs.TabPane tab={intl.get('M26P102261011090100MC030').d('来去话分离')} key="5">
                            <Row>
                                <Col span={24}>
                                    <Checkbox checked={this.state.formData.doubleTrack} onChange={(e): void => { this._handleChangeCheckBox('doubleTrack', e) }}>{intl.get('M26P102261011090100ML051').d('启用来去话分离')}</Checkbox>
                                </Col>
                            </Row>
                            {this.state.formData.doubleTrack === true ?
                                <div>
                                    {
                                        this.state.ipValues.filter((item): any => item !== null).map((item: string, index: number): React.ReactElement => (
                                            <Row key={`${item}${Math.random()}`}>
                                                <Col span={10}>
                                                    {intl.get('M26P102261011090100ML050').d('网关IP')}
                                                    {index + 1}
                                                </Col>
                                                <Col span={8}>
                                                    <Input id={`ip_${index}`} value={item} onChange={this.handleIplChange.bind(this, index)} />
                                                </Col>
                                                <Col span={2} />
                                                {
                                                    this.state.ipValues.length > 1 &&
                                                    <Col span={2}>
                                                        <Icon type="minus-circle" onClick={this.deleteIp.bind(this, index)} />
                                                    </Col>
                                                }
                                                {
                                                    (index < 9 && index === this.state.ipValues.length - 1) &&
                                                    <Col span={2}>
                                                        <Icon type="plus-circle" onClick={this.addIp} />
                                                    </Col>
                                                }
                                            </Row>
                                        ))
                                    }
                                </div> :
                                ''
                            }
                            {/* {this.state.formData.doubleTrack === true ?
                                <Row>
                                    <Col span={10}>IP网关1</Col>
                                    <Col span={14}><Input onChange={(e): void => { this._handleChangeInput('gateWayOne', e) }} value={this.state.formData.gateWayOne} /></Col>
                                </Row> :
                                ''
                            }
                            {this.state.formData.doubleTrack === true ?
                                <Row>
                                    <Col span={10}>IP网关2</Col>
                                    <Col span={14}><Input onChange={(e): void => { this._handleChangeInput('gateWayTwo', e) }} value={this.state.formData.gateWayTwo} /></Col>
                                </Row> :
                                ''
                            }
                            {this.state.formData.doubleTrack === true ?
                                <Row>
                                    <Col span={10}>IP网关3</Col>
                                    <Col span={14}><Input onChange={(e): void => { this._handleChangeInput('gateWayThree', e) }} value={this.state.formData.gateWayThree} /></Col>
                                </Row> :
                                ''
                            }
                            {this.state.formData.doubleTrack === true ?
                                <Row>
                                    <Col span={10}>IP网关4</Col>
                                    <Col span={14}><Input onChange={(e): void => { this._handleChangeInput('gateWayFour', e) }} value={this.state.formData.gateWayFour} /></Col>
                                </Row> :
                                ''
                            }
                            {this.state.formData.doubleTrack === true ?
                                <Row>
                                    <Col span={10}>IP网关5</Col>
                                    <Col span={14}><Input onChange={(e): void => { this._handleChangeInput('gateWayFive', e) }} value={this.state.formData.gateWayFive} /></Col>
                                </Row> :
                                ''
                            }
                            {this.state.formData.doubleTrack === true ?
                                <Row>
                                    <Col span={10}>IP网关6</Col>
                                    <Col span={14}><Input onChange={(e): void => { this._handleChangeInput('gateWaySix', e) }} value={this.state.formData.gateWaySix} /></Col>
                                </Row> :
                                ''
                            }
                            {this.state.formData.doubleTrack === true ?
                                <Row>
                                    <Col span={10}>IP网关7</Col>
                                    <Col span={14}><Input onChange={(e): void => { this._handleChangeInput('gateWaySeven', e) }} value={this.state.formData.gateWaySeven} /></Col>
                                </Row> :
                                ''
                            }
                            {this.state.formData.doubleTrack === true ?
                                <Row>
                                    <Col span={10}>IP网关8</Col>
                                    <Col span={14}><Input onChange={(e): void => { this._handleChangeInput('gateWayEight', e) }} value={this.state.formData.gateWayEight} /></Col>
                                </Row> :
                                ''
                            }
                            {this.state.formData.doubleTrack === true ?
                                <Row>
                                    <Col span={10}>IP网关9</Col>
                                    <Col span={14}><Input onChange={(e): void => { this._handleChangeInput('gateWayNine', e) }} value={this.state.formData.gateWayNine} /></Col>
                                </Row> :
                                ''
                            }
                            {this.state.formData.doubleTrack === true ?
                                <Row>
                                    <Col span={10}>IP网关10</Col>
                                    <Col span={14}><Input onChange={(e): void => { this._handleChangeInput('gateWayTen', e) }} value={this.state.formData.gateWayTen} /></Col>
                                </Row> :
                                ''
                            } */}
                        </Tabs.TabPane> :
                        ''
                    }
                </Tabs>
            </div>
        )
    }
}


export default RecordService
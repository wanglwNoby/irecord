import * as React from 'react'
import { Row, Col, Input, Select, Checkbox, Tabs } from 'antd'
import intl from 'react-intl-universal'
import { _getChannel } from '../../../common/api/channel'
import { _getOptionLang } from '../../../common/api/global'
import { _getRecordConfig } from '../../../common/api/siteManage'

function callback(key): void {
    console.log(key)
}

class AddChannel extends React.Component<any, any> {
    constructor(props: any) {
        super(props)
        this.state = {
            formData: {
                channelId: null,
                channelName: '',
                extensionId: null,
                phoneIp: null,
                phonePort: 0,
                startMode: '',
                startDtmf: '',
                stopDtmf: '',
                recordFileCode: '1',
                codingFormat: '72770001',
                minRecordDuration: '',
                maxRecordDuration: '',
                cuttingRecord: false,
                choiceRecord: 0,
                recordTimeRange: '',
                description: '',
                channelCount: 1,
                doubleTrack: true
            },
            startModeData: [], // 录音服务编码语言包数据
            realTimeData: [], // 实时流编码语言包数据
            codingFormatData: [], // 文件编码格式语言包数据
            recordType: undefined // 录音服务信息
        }
    }

    public componentDidMount(): void {
        console.log(this.props)
        if (this.props.editType === 1) {
            this.getChannel()
        }
        if (this.props.editType === 2) {
            const formData1 = {
                channelId: this.props.dataInfo.channelid,
                channelName: this.props.dataInfo.channelname === null ? '' : this.props.dataInfo.channelname,
                extensionId: this.props.dataInfo.extensionid,
                phoneIp: this.props.dataInfo.phoneip === null ? '' : this.props.dataInfo.phoneip,
                phonePort: this.props.dataInfo.phoneport,
                startMode: this.props.dataInfo.startmode.toString(),
                startDtmf: this.props.dataInfo.startdtmf === null ? '' : this.props.dataInfo.startdtmf,
                stopDtmf: this.props.dataInfo.stopdtmf === null ? '' : this.props.dataInfo.stopdtmf,
                recordFileCode: this.props.dataInfo.recordfilecode.toString(),
                codingFormat: this.props.dataInfo.codingformat.toString(),
                minRecordDuration: this.props.dataInfo.minrecordduration,
                maxRecordDuration: this.props.dataInfo.maxrecordduration,
                cuttingRecord: this.props.dataInfo.cuttingrecord === 1,
                choiceRecord: this.props.dataInfo.choicerecord,
                recordTimeRange: this.props.dataInfo.recordtimerange === null ? '' : this.props.dataInfo.recordtimerange,
                description: this.props.dataInfo.description,
                channelCount: 1,
                doubleTrack: this.props.dataInfo.doubletrack === 1
            }
            this.setState({
                formData: formData1
            }, (): void => {
                this.props.channel(this.state.formData)
            })
        }
        this.getOptionLangs()
        this.getOptionLangs1()
        this.getOptionLangs2()
        this.getRecordservice()
    }

    // 获取下拉启动方式数据语言包
    public getOptionLangs = async (): Promise<void> => {
        const data = {
            params: {
                system_id: 271,
                site_id: this.props.siteId,
                guid: this.props.currentServer.guid
            }
        }
        const res: any = await _getRecordConfig(data)
        if (res && res.result && res.data !== '[]') {
            const newData = res.data.replace(/"guid":(\d+)/g, '"guid":"$1"')
            const infodata = JSON.parse(newData)
            const params = {
                params: {
                    parent_code: '2602',
                    type: infodata[0].recordtype
                }
            }
            const res1: any = await _getOptionLang(params)
            if (res1 && res1.result) {
                this.setState({
                    startModeData: res1.data
                })
            }
        }
    }

    // 获取下拉实时流编码数据语言包
    public getOptionLangs1 = async (): Promise<void> => {
        const params = {
            params: {
                parent_code: '2603',
                type: ''
            }
        }
        const res: any = await _getOptionLang(params)
        if (res && res.result) {
            this.setState({
                realTimeData: res.data
            })
        }
    }

    // 获取下拉文件编码数据语言包
    public getOptionLangs2 = async (): Promise<void> => {
        const params = {
            params: {
                parent_code: '2604',
                type: ''
            }
        }
        const res: any = await _getOptionLang(params)
        if (res && res.result) {
            this.setState({
                codingFormatData: res.data
            })
        }
    }

    // 获取录音服务信息
    public getRecordservice = async (): Promise<void> => {
        const data = {
            params: {
                system_id: 271,
                site_id: this.props.siteId,
                guid: this.props.currentServer.guid
            }
        }
        const res: any = await _getRecordConfig(data)
        if (res && res.result && res.data !== 'null') {
            const newData = res.data.replace(/"guid":(\d+)/g, '"guid":"$1"')
            const infodata = JSON.parse(newData)
            console.log(infodata)
            this.setState({
                recordType: infodata[0].recordtype
            })
        }
    }


    // 获取录音通道号
    public getChannel = async (): Promise<void> => {
        const data = {
            params: {
                site_id: this.props.siteId,
                record_service_id: this.props.currentServer.deviceid
            }
        }
        const res: any = await _getChannel(data)
        if (res && res.result) {
            let channelIdData = res.code
            if (res.code === 0 && res.data === '[]') {
                channelIdData = 0
            } else {
                console.log(111)
                channelIdData = res.code + 1
            }
            const formData1 = {
                channelId: channelIdData,
                channelName: '',
                extensionId: null,
                phoneIp: null,
                phonePort: 0,
                startMode: '',
                startDtmf: '',
                stopDtmf: '',
                recordFileCode: '1',
                codingFormat: '72770001',
                minRecordDuration: '',
                maxRecordDuration: '',
                cuttingRecord: false,
                choiceRecord: 0,
                recordTimeRange: '',
                description: '',
                channelCount: 1,
                doubleTrack: true
            }
            this.setState({
                formData: formData1
            }, (): void => {
                console.log(this.state.formData)
            })
        }
    }

    // 所有input输入框事件
    public _handleChangeInput = (type: any, e: any): void => {
        const value = e.target.value
        this.setState((prevState): any => ({
            formData: { ...prevState.formData, [type]: value }
        }), (): void => { this.props.channel(this.state.formData) })
    }

    // 所有通用Form表单下拉框,switch开关,多选checkbox,呼叫方向,rangeDatepicker事件
    public _handleChangeOthers = (type: any, value: any): void => {
        this.setState((prevState): any => ({
            formData: { ...prevState.formData, [type]: value }
        }), (): void => { this.props.channel(this.state.formData) })
    }

    // 所有单选checkbox事件
    public _handleChangeCheckBox = (type: any, e: any): void => {
        const value = e.target.checked
        this.setState((prevState): any => ({
            formData: { ...prevState.formData, [type]: value }
        }), (): void => { this.props.channel(this.state.formData) })
    }

    public render(): React.ReactElement {
        return (
            <div>
                <Tabs defaultActiveKey="1" onChange={callback}>
                    <Tabs.TabPane tab={intl.get('M26P102261011090100MC001').d('基本配置')} key="1">
                        <Row style={{ marginTop: '20px' }}>
                            <Col span={10}>{intl.get('M26P102261011091100ML001').d('通道号')}</Col>
                            <Col span={14}><Input disabled onChange={(e): void => { this._handleChangeInput('channelId', e) }} value={this.state.formData.channelId} /></Col>
                        </Row>
                        <Row>
                            <Col span={10}>{intl.get('M26P102261011091100ML002').d('分机号')}</Col>
                            <Col span={14}><Input onChange={(e): void => { this._handleChangeInput('extensionId', e) }} value={this.state.formData.extensionId} /></Col>
                        </Row>
                        <Row>
                            <Col span={10}>{intl.get('M26P102261011091100ML003').d('需要添加分机数')}</Col>
                            <Col span={14}><Input disabled={this.props.editType === 2} onChange={(e): void => { this._handleChangeInput('channelCount', e) }} value={this.state.formData.channelCount} /></Col>
                        </Row>
                        <Row>
                            <Col span={10}>{intl.get('M26P102261011091100ML004').d('启动方式')}</Col>
                            <Col span={14}>
                                <Select onChange={(e): void => { this._handleChangeOthers('startMode', e) }} style={{ width: '100%' }} value={this.state.formData.startMode}>
                                    {/* <Option value={1}>声控启动</Option>
                                    <Option value={2}>信道启动</Option>
                                    <Option value={3}>CTI启动</Option>
                                    <Option value={4}>按键启动</Option> */}
                                    {this.state.startModeData && this.state.startModeData.map((item): React.ReactElement => (<Select.Option value={item.valid_data} key={item.system_code}>{item.display_character}</Select.Option>))}
                                </Select>
                            </Col>
                        </Row>
                        {this.state.formData.startMode === 4 ?
                            <Row>
                                <Col span={10}>{intl.get('M26P102261011091100ML025').d('启动按键')}</Col>
                                <Col span={14}>
                                    <Input onChange={(e): void => { this._handleChangeInput('startDtmf', e) }} value={this.state.formData.startDtmf} />
                                </Col>
                            </Row> : null}
                        {this.state.formData.startMode === 4 ?
                            <Row>
                                <Col span={10}>{intl.get('M26P102261011091100ML026').d('停止按键')}</Col>
                                <Col span={14}>
                                    <Input onChange={(e): void => { this._handleChangeInput('stopDtmf', e) }} value={this.state.formData.stopDtmf} />
                                </Col>
                            </Row> : null}
                        <Row>
                            <Col span={10}>{intl.get('M26P102261011091100ML005').d('实时流格式')}</Col>
                            <Col span={14}>
                                <Select onChange={(e): void => { this._handleChangeOthers('recordFileCode', e) }} style={{ width: '100%' }} value={this.state.formData.recordFileCode}>
                                    {/* <Option value={1}>G7lla</Option>
                                    <Option value={2}>G7llu</Option> */}
                                    {this.state.realTimeData && this.state.realTimeData.map((item): React.ReactElement => (<Select.Option value={item.valid_data} key={item.order_id}>{item.display_character}</Select.Option>))}
                                </Select>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={10}>{intl.get('M26P102261011091100ML006').d('录音文件保存格式')}</Col>
                            <Col span={14}>
                                <Select onChange={(e): void => { this._handleChangeOthers('codingFormat', e) }} style={{ width: '100%' }} value={this.state.formData.codingFormat}>
                                    {/* <Option value={72770001}>G7lla</Option>
                                    <Option value={72770002}>G7llu</Option>
                                    <Option value={72770003}>PCM8</Option>
                                    <Option value={72770004}>PCM16</Option>
                                    <Option value={72770007}>GSM</Option> */}
                                    {this.state.codingFormatData && this.state.codingFormatData.map((item): React.ReactElement => (<Select.Option value={item.valid_data} key={item.order_id}>{item.display_character}</Select.Option>))}
                                </Select>
                            </Col>
                        </Row>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab={intl.get('M26P102261011090100MC002').d('其他配置')} key="2">
                        <Row>
                            <Col span={10}>{intl.get('M26P102261011091100ML007').d('IP话机IPAddress或MAC')}</Col>
                            <Col span={8}>
                                <Input onChange={(e): void => { this._handleChangeInput('phoneIp', e) }} value={this.state.formData.phoneIp} />
                            </Col>
                            <Col style={{ textAlign: 'center' }} span={3}>:</Col>
                            <Col span={3}>
                                <Input onChange={(e): void => { this._handleChangeInput('phonePort', e) }} value={this.state.formData.phonePort} />
                            </Col>
                        </Row>
                        {/* <Row style={{ marginTop: '20px' }}>
                            <Col span={8}>是否选择录音:</Col>
                            <Col span={16}>
                                <Radio.Group onChange={(e): void => { this._handleChangeInput('choiceRecord', e) }} value={this.state.formData.choiceRecord}>
                                    <Radio value={1}>是</Radio>
                                    <Radio value={0}>否</Radio>
                                </Radio.Group>
                            </Col>
                        </Row> */}
                        {this.state.formData.choiceRecord === 1 ?
                            <Row>
                                <Col span={10}>{intl.get('M26P102261011091100ML027').d('录音时段范围')}</Col>
                                <Col span={14}>
                                    <Input onChange={(e): void => { this._handleChangeInput('recordTimeRange', e) }} value={this.state.formData.recordTimeRange} />
                                </Col>
                            </Row> : null}
                        <Row>
                            <Col span={10}>{intl.get('M26P102261011091100ML008').d('通道名')}</Col>
                            <Col span={14}><Input onChange={(e): void => { this._handleChangeInput('channelName', e) }} value={this.state.formData.channelName} /></Col>
                        </Row>
                        <Row>
                            <Col span={10}>{intl.get('M26P102261011090500ML027').d('最大录音时长')}</Col>
                            <Col span={14}>
                                <Input onChange={(e): void => { this._handleChangeInput('maxRecordDuration', e) }} value={this.state.formData.maxRecordDuration} />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={10}>{intl.get('M26P102261011090500ML013').d('最短录音时长')}</Col>
                            <Col span={14}>
                                <Input onChange={(e): void => { this._handleChangeInput('minRecordDuration', e) }} value={this.state.formData.minRecordDuration} />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={10}>{intl.get('M26P102261011090100ML003').d('描述')}</Col>
                            <Col span={14}>
                                <Input.TextArea onChange={(e): void => { this._handleChangeInput('description', e) }} value={this.state.formData.description} />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Checkbox checked={this.state.formData.cuttingRecord} onChange={(e): void => { this._handleChangeCheckBox('cuttingRecord', e) }}>{intl.get('M26P102261011090500ML006').d('启用告警消息推送服务')}</Checkbox>
                            </Col>
                        </Row>
                        {this.state.recordType === 73 ?
                            <Row>
                                <Col span={24}>
                                    <Checkbox checked={this.state.formData.doubleTrack} onChange={(e): void => { this._handleChangeCheckBox('doubleTrack', e) }}>{intl.get('M26P102261011090100ML051').d('启用来去话分离')}</Checkbox>
                                </Col>
                            </Row> :
                            ''}
                    </Tabs.TabPane>
                </Tabs>
            </div>
        )
    }
}


export default AddChannel
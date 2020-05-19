import * as React from 'react'
import { Row, Col, Input, Checkbox, Select } from 'antd'
import intl from 'react-intl-universal'
import { _getOptionLang } from '../../../common/api/global'

interface IState {
    formData: {
        restfulPort: number;
        websocketPort: number;
        alias: string;
        state: boolean;
        logLevel: string;
        alarmPush: boolean;
    };
    log: any[]; // 日志等级语言包数据
}

class FileDeleteConfig extends React.Component<any, IState> {
    constructor(props: any) {
        super(props)
        this.state = {
            formData: {
                restfulPort: 2613,
                websocketPort: 2653,
                alias: '',
                state: true,
                logLevel: '2',
                alarmPush: true
            },
            log: []
        }
    }

    public componentDidMount(): void {
        console.log('1111')
        this.props.fileDelete(this.state.formData)
        if (this.props.editType === 2 && this.props.fileDeleteInfoData.length !== 0) {
            console.log(this.props.fileDeleteInfoData)
            const formData1 = {
                restfulPort: this.props.fileDeleteInfoData[0].restfulport,
                websocketPort: this.props.fileDeleteInfoData[0].websocketport,
                alias: this.props.fileDeleteInfoData[0].alias,
                state: this.props.fileDeleteInfoData[0].state === 1,
                logLevel: this.props.fileDeleteInfoData[0].loglevel.toString(),
                alarmPush: this.props.fileDeleteInfoData[0].alarmpush === 1
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
        }), (): void => { this.props.fileDelete(this.state.formData) })
    }

    // 所有通用Form表单下拉框,switch开关,多选checkbox,呼叫方向,rangeDatepicker事件
    public _handleChangeOthers = (type: any, value: any): void => {
        this.setState((prevState): any => ({
            formData: { ...prevState.formData, [type]: value }
        }), (): void => { this.props.fileDelete(this.state.formData) })
    }

    // 所有单选checkbox事件
    public _handleChangeCheckBox = (type: any, e: any): void => {
        const value = e.target.checked
        this.setState((prevState): any => ({
            formData: { ...prevState.formData, [type]: value }
        }), (): void => { this.props.fileDelete(this.state.formData) })
    }

    public render(): React.ReactElement {
        return (
            <div>
                <Row style={{ marginTop: '20px' }}>
                    <Col span={10}>{intl.get('M26P102261011090500ML023').d('归档回删服务别名')}</Col>
                    <Col span={14}><Input onChange={(e): void => { this._handleChangeInput('alias', e) }} value={this.state.formData.alias} /></Col>
                </Row>
                <Row>
                    <Col span={10}>{intl.get('M26P102261011090100ML019').d('restful端口')}</Col>
                    <Col span={14}><Input onChange={(e): void => { this._handleChangeInput('restfulPort', e) }} value={this.state.formData.restfulPort} /></Col>
                </Row>
                <Row>
                    <Col span={10}>{intl.get('M26P102261011090100ML005').d('websocket端口')}</Col>
                    <Col span={14}><Input onChange={(e): void => { this._handleChangeInput('websocketPort', e) }} value={this.state.formData.websocketPort} /></Col>
                </Row>
                <Row>
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
                    {/* <Col span={8}>告警消息推送服务:</Col>
                    <Col span={16}>
                        <Radio.Group onChange={(e): void => { this._handleChangeInput('alarmPush', e) }} value={this.state.formData.alarmPush}>
                            <Radio value={1}>启用</Radio>
                            <Radio value={0}>禁用</Radio>
                        </Radio.Group>
                    </Col> */}
                    <Col span={12}>
                        <Checkbox checked={this.state.formData.alarmPush} onChange={(e): void => { this._handleChangeCheckBox('alarmPush', e) }}>{intl.get('M26P102261011090500ML006').d('启用告警消息推送服务')}</Checkbox>
                    </Col>
                    <Col span={12}>
                        <Checkbox checked={this.state.formData.state} onChange={(e): void => { this._handleChangeCheckBox('state', e) }}>{intl.get('M26P102261011090500ML007').d('启用状态')}</Checkbox>
                    </Col>
                </Row>
            </div>
        )
    }
}


export default FileDeleteConfig
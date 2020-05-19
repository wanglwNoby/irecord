import * as React from 'react'
import { Row, Col, Input, Select, Radio, Checkbox } from 'antd'
import intl from 'react-intl-universal'

class RecordFile extends React.Component<any, any> {
    constructor(props: any) {
        super(props)
        this.state = {
            formData: {
                storageDeviceId: null,
                tryFileCount: 3,
                fileTimeSlot: '',
                routeConfig: 1,
                state: true
            }
        }
    }


    public componentDidMount(): void {
        this.props.recordFile(this.state.formData)
        if (this.props.editType === 2) {
            console.log(this.props.recordFileInfoData)
            const formData1 = {
                storageDeviceId: this.props.recordFileInfoData.storagedeviceid,
                tryFileCount: this.props.recordFileInfoData.tryfilecount,
                fileTimeSlot: '',
                routeConfig: this.props.recordFileInfoData.routeconfig,
                state: this.props.recordFileInfoData.state === 1
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
        }), (): void => { this.props.recordFile(this.state.formData) })
    }

    // 所有通用Form表单下拉框,switch开关,多选checkbox,呼叫方向,rangeDatepicker事件
    public _handleChangeOthers = (type: any, value: any): void => {
        this.setState((prevState): any => ({
            formData: { ...prevState.formData, [type]: value }
        }), (): void => { this.props.recordFile(this.state.formData) })
    }

    // 所有单选checkbox事件
    public _handleChangeCheckBox = (type: any, e: any): void => {
        const value = e.target.checked
        this.setState((prevState): any => ({
            formData: { ...prevState.formData, [type]: value }
        }), (): void => { this.props.recordFile(this.state.formData) })
    }

    public render(): React.ReactElement {
        console.log(this.props.storageData)
        return (
            <div>
                <Row style={{ marginTop: '20px' }}>
                    <Col span={10}>{intl.get('M26P102261011090100MT003').d('存储设备')}</Col>
                    <Col span={14}>
                        <Select onChange={(e): void => { this._handleChangeOthers('storageDeviceId', e) }} value={this.state.formData.storageDeviceId} style={{ width: '100%' }}>
                            {this.props.storageData.length > 0 && this.props.storageData.map((item): any => (<Select.Option value={item.DeviceId} key={item.DeviceId}>{item.Alias}</Select.Option>))}
                        </Select>
                    </Col>
                </Row>
                <Row>
                    <Col span={10}>{intl.get('M26P102261011091100ML009').d('尝试归档次数')}</Col>
                    <Col span={14}><Input onChange={(e): void => { this._handleChangeInput('tryFileCount', e) }} value={this.state.formData.tryFileCount} /></Col>
                </Row>
                <Row>
                    <Col span={10}>{intl.get('M26P102261011091100ML010').d('归档时间段')}</Col>
                    <Col span={14}>
                        <Input value={this.state.formData.fileTimeSlot} style={{ width: '100%' }} onChange={(e): void => { this._handleChangeInput('fileTimeSlot', e) }} />
                    </Col>
                </Row>
                <Row>
                    <Col span={10}>{intl.get('M26P102261011091100ML011').d('保持原始路径方式')}</Col>
                    <Col span={14}>
                        <Radio.Group onChange={(e): void => { this._handleChangeInput('routeConfig', e) }} value={this.state.formData.routeConfig}>
                            <Radio value={1}>{intl.get('M26P102261011091100ML012').d('原始路径+文件')}</Radio>
                            <Radio disabled value={2}>{intl.get('M26P102261011091100ML013').d('只是文件')}</Radio>
                        </Radio.Group>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Checkbox checked={this.state.formData.state} onChange={(e): void => { this._handleChangeCheckBox('state', e) }}>{intl.get('M26P102261011090500ML007').d('启用状态')}</Checkbox>
                    </Col>
                </Row>
            </div>
        )
    }
}


export default RecordFile
import * as React from 'react'
import { Row, Col, Input, Checkbox, Tabs } from 'antd'
import intl from 'react-intl-universal'

function callback(key): void {
    console.log(key)
}
class Delete extends React.Component<any, any> {
    constructor(props: any) {
        super(props)
        this.state = {
            formData: {
                deleteMethod: 50,
                deleteConfig: 180,
                retentionDays: 7,
                deleteDatabase: true,
                lockedRecord: true,
                description: '',
                state: true,
                method: [1]
            }
        }
    }


    public componentDidMount(): void {
        this.props.delete(this.state.formData)
        if (this.props.deleteInfo && this.props.deleteInfo.length !== 0) {
            let method1
            if (this.props.deleteInfo[0].deleteconfig !== -1 && this.props.deleteInfo[0].deletemethod === -1) {
                method1 = [2]
            } else if (this.props.deleteInfo[0].deletemethod !== -1 && this.props.deleteInfo[0].deleteconfig === -1) {
                method1 = [1]
            } else {
                method1 = [1, 2]
            }
            const formData1 = {
                deleteMethod: this.props.deleteInfo[0].deletemethod,
                deleteConfig: this.props.deleteInfo[0].deleteconfig,
                retentionDays: this.props.deleteInfo[0].retentiondays,
                deleteDatabase: this.props.deleteInfo[0].deletedatabase === 1,
                lockedRecord: this.props.deleteInfo[0].lockedrecord === 1,
                description: this.props.deleteInfo[0].description,
                state: this.props.deleteInfo[0].state === 1,
                method: method1
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
        }), (): void => { this.props.delete(this.state.formData) })
    }

    // 所有通用Form表单下拉框,switch开关,多选checkbox,呼叫方向,rangeDatepicker事件
    public _handleChangeOthers = (type: any, value: any): void => {
        this.setState((prevState): any => ({
            formData: { ...prevState.formData, [type]: value }
        }), (): void => {
            this.props.delete(this.state.formData)
            console.log(this.state.formData.deleteMethod)
        })
    }

    // 所有单选checkbox事件
    public _handleChangeCheckBox = (type: any, e: any): void => {
        const value = e.target.checked
        this.setState((prevState): any => ({
            formData: { ...prevState.formData, [type]: value }
        }), (): void => { this.props.delete(this.state.formData) })
    }

    public render(): React.ReactElement {
        return (
            <div>
                <Tabs defaultActiveKey="1" onChange={callback}>
                    <Tabs.TabPane tab={intl.get('M26P102261011090100MC001').d('基本配置')} key="1">
                        <Row style={{ marginTop: '20px' }}>
                            <Col span={10}>{intl.get('M26P102261011091100ML014').d('回删方法')}</Col>
                            <Col span={14}>
                                <Checkbox.Group style={{ width: '100%' }} onChange={(e): void => { this._handleChangeOthers('method', e) }} value={this.state.formData.method}>
                                    <Checkbox value={1}>{intl.get('M26P102261011091100ML015').d('根据磁盘剩余空间')}</Checkbox>
                                    <Checkbox value={2}>{intl.get('M26P102261011091100ML016').d('根据本地保留天数')}</Checkbox>
                                </Checkbox.Group>
                            </Col>
                        </Row>
                        {this.state.formData.method.indexOf(1) !== -1 ?
                            <Row>
                                <Col span={10}>{intl.get('M26P102261011091100ML017').d('最小剩余空间(GB)')}</Col>
                                <Col span={14}>
                                    <Input onChange={(e): void => { this._handleChangeInput('deleteMethod', e) }} value={this.state.formData.deleteMethod} />
                                </Col>
                            </Row> : null}
                        {this.state.formData.method.indexOf(2) !== -1 ?
                            <Row>
                                <Col span={10}>{intl.get('M26P102261011091100ML018').d('删除N天前(天)')}</Col>
                                <Col span={14}>
                                    <Input onChange={(e): void => { this._handleChangeInput('deleteConfig', e) }} value={this.state.formData.deleteConfig} />
                                </Col>
                            </Row> : null}
                        <Row>
                            <Col span={10}>{intl.get('M26P102261011091100ML019').d('保留天数(天)')}</Col>
                            <Col span={14}><Input onChange={(e): void => { this._handleChangeInput('retentionDays', e) }} value={this.state.formData.retentionDays} /></Col>
                        </Row>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab={intl.get('M26P102261011090100MC002').d('其他配置')} key="2">
                        <Row>
                            <Col span={10}>{intl.get('M26P102261011090100ML003').d('描述')}</Col>
                            <Col span={14}>
                                <Input.TextArea onChange={(e): void => { this._handleChangeInput('description', e) }} value={this.state.formData.description} />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <Checkbox checked={this.state.formData.deleteDatabase} onChange={(e): void => { this._handleChangeCheckBox('deleteDatabase', e) }}>{intl.get('M26P102261011091100ML020').d('同时删除数据库记录')}</Checkbox>
                            </Col>
                            <Col span={12}>
                                <Checkbox checked={this.state.formData.lockedRecord} onChange={(e): void => { this._handleChangeCheckBox('lockedRecord', e) }}>{intl.get('M26P102261011091100ML021').d('启用锁定记录不删除')}</Checkbox>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Checkbox checked={this.state.formData.state} onChange={(e): void => { this._handleChangeCheckBox('state', e) }}>{intl.get('M26P102261011090500ML007').d('启用状态')}</Checkbox>
                            </Col>
                        </Row>
                    </Tabs.TabPane>
                </Tabs>
            </div>
        )
    }
}


export default Delete
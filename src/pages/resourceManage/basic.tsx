import * as React from 'react'
import { Row, Col, Input, Select } from 'antd'
import intl from 'react-intl-universal'

const { Option } = Select

interface IState {
    formData: {
        siteId: number; // 站点id
        siteName: string; // 站点名称
        description: string; // 描述
    };
}

class Basic extends React.Component<any, IState> {
    constructor(props: any) {
        super(props)
        this.state = {
            formData: {
                siteId: 101,
                siteName: '',
                description: ''
            }
        }
    }

    public componentDidMount(): void {
        console.log('1111')
        if (this.props.editType === 2) {
            const formData1 = {
                siteId: this.props.dataInfo.siteid,
                siteName: this.props.dataInfo.sitename,
                description: this.props.dataInfo.description

            }
            this.setState({
                formData: formData1
            }, (): void => {
                this.props.LocalMachine(this.state.formData)
            })
        }
    }

    // 所有input输入框事件
    public _handleChangeInput = (type: any, e: any): void => {
        const value = e.target.value
        this.setState((prevState): any => ({
            formData: { ...prevState.formData, [type]: value }
        }), (): void => { this.props.LocalMachine(this.state.formData) })
    }

    // 所有通用Form表单下拉框,switch开关,多选checkbox,呼叫方向,rangeDatepicker事件
    public _handleChangeOthers = (type: any, value: any): void => {
        this.setState((prevState): any => ({
            formData: { ...prevState.formData, [type]: value }
        }), (): void => { this.props.LocalMachine(this.state.formData) })
    }

    public render(): React.ReactElement {
        console.log(this.props.dataInfo)
        return (
            <div>
                <Row style={{ marginTop: '20px' }}>
                    <Col span={8}>
                        {intl.get('M26P102261011090100ML001').d('站点编号')}
                    </Col>
                    <Col span={16}>
                        <Select disabled={this.props.editType === 2} onChange={(e): void => { this._handleChangeOthers('siteId', e) }} value={this.state.formData.siteId} style={{ width: '100%' }}>
                            <Option value={101}>101</Option>
                            <Option value={102}>102</Option>
                            <Option value={103}>103</Option>
                            <Option value={104}>104</Option>
                            <Option value={105}>105</Option>
                            <Option value={106}>106</Option>
                            <Option value={107}>107</Option>
                            <Option value={108}>108</Option>
                            <Option value={109}>109</Option>
                            <Option value={110}>110</Option>
                        </Select>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        {intl.get('M26P102261011090100ML002').d('站点名称')}
                    </Col>
                    <Col span={16}><Input onChange={(e): void => { this._handleChangeInput('siteName', e) }} value={this.state.formData.siteName} /></Col>
                </Row>
                <Row>
                    <Col span={8}>
                        {intl.get('M26P102261011090100ML003').d('描述')}
                    </Col>
                    <Col span={16}><Input.TextArea onChange={(e): void => { this._handleChangeInput('description', e) }} value={this.state.formData.description} /></Col>
                </Row>
            </div>
        )
    }
}


export default Basic
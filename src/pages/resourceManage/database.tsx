import * as React from 'react'
import { Row, Col, Input, Select, Tabs } from 'antd'
import intl from 'react-intl-universal'
import { _getOptionLang } from '../../common/api/global'


function callback(key): void {
    console.log(key)
}

interface IState {
    formData: {
        type: string; // 数据库类型
        IPAddress: string; // ip
        port: number; // 端口
        databaseName: string; // 数据库名
        account: string; // 用户
        password: string; // 密码
        alias: string; // 别名
        description: string; // 描述
    };
    dataBaseType: any[]; // 数据库类型语言包数据
}
class Database extends React.Component<any, IState> {
    constructor(props: any) {
        super(props)
        this.state = {
            formData: {
                type: '1',
                IPAddress: '',
                port: 3306,
                databaseName: '',
                account: '',
                password: '',
                alias: '',
                description: ''
            },
            dataBaseType: []
        }
    }

    public componentDidMount(): void {
        console.log('1111')
        if (this.props.editType === 2) {
            const formData1 = {
                type: this.props.dataInfo.Type.toString(),
                databaseName: this.props.dataInfo.DatabaseName,
                description: this.props.dataInfo.Description,
                alias: this.props.dataInfo.Alias,
                account: this.props.dataInfo.Account,
                password: this.props.dataInfo.Password,
                IPAddress: this.props.dataInfo.IpAddress,
                port: this.props.dataInfo.Port

            }
            this.setState({
                formData: formData1
            }, (): void => {
                this.props.Database(this.state.formData)
            })
        }
        this.getOptionLangs()
    }

    // 获取下拉数据库类型数据语言包
    public getOptionLangs = async (): Promise<void> => {
        const params = {
            params: {
                parent_code: '1103',
                type: ''
            }
        }
        const res: any = await _getOptionLang(params)
        if (res && res.result) {
            this.setState({
                dataBaseType: res.data
            })
        }
    }

    // 所有input输入框事件
    public _handleChangeInput = (type: any, e: any): void => {
        const value = e.target.value
        this.setState((prevState): any => ({
            formData: { ...prevState.formData, [type]: value }
        }), (): void => { this.props.Database(this.state.formData) })
    }

    // 所有通用Form表单下拉框,switch开关,多选checkbox,呼叫方向,rangeDatepicker事件
    public _handleChangeOthers = (type: any, value: any): void => {
        this.setState((prevState): any => ({
            formData: { ...prevState.formData, [type]: value }
        }), (): void => {
            this.props.Database(this.state.formData)
            if (this.state.formData.type === '1') {
                this.setState((prevState): any => ({
                    formData: {
                        ...prevState.formData,
                        port: 3306
                    }
                }))
            } else if (this.state.formData.type === '2') {
                this.setState((prevState): any => ({
                    formData: {
                        ...prevState.formData,
                        port: 1433
                    }
                }))
            } else if (this.state.formData.type === '3') {
                this.setState((prevState): any => ({
                    formData: {
                        ...prevState.formData,
                        port: 1521
                    }
                }))
            } else if (this.state.formData.type === '4') {
                this.setState((prevState): any => ({
                    formData: {
                        ...prevState.formData,
                        port: 5432
                    }
                }))
            }
        })
    }


    public render(): React.ReactElement {
        return (
            <div>
                <Tabs defaultActiveKey="1" onChange={callback}>
                    <Tabs.TabPane tab={intl.get('M26P102261011090100MC001').d('基本配置')} key="1">
                        <Row style={{ marginTop: '20px' }}>
                            <Col span={8}>{intl.get('M26P102261011090100ML020').d('数据库名称')}</Col>
                            <Col span={16}><Input onChange={(e): void => { this._handleChangeInput('databaseName', e) }} value={this.state.formData.databaseName} /></Col>
                        </Row>
                        <Row>
                            <Col span={8}>{intl.get('M26P102261011090100ML021').d('数据库类型')}</Col>
                            <Col span={16}>
                                <Select onChange={(e): void => { this._handleChangeOthers('type', e) }} value={this.state.formData.type} style={{ width: '100%' }}>
                                    {/* <Option value={1}>MySql</Option>
                                    <Option value={2}>MS sql</Option>
                                    <Option value={3}>Oracle</Option>
                                    <Option value={4}>PG Sql</Option> */}
                                    {this.state.dataBaseType && this.state.dataBaseType.map((item): React.ReactElement => (<Select.Option value={item.valid_data} key={item.order_id}>{item.display_character}</Select.Option>))}
                                </Select>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>{intl.get('M26P102261011090100ML004').d('IP')}</Col>
                            <Col span={7}><Input onChange={(e): void => { this._handleChangeInput('IPAddress', e) }} value={this.state.formData.IPAddress} /></Col>
                            <Col style={{ textAlign: 'center' }} span={3}>{intl.get('M26P102261011090100ML015').d('端口')}</Col>
                            <Col span={6}><Input onChange={(e): void => { this._handleChangeInput('port', e) }} value={this.state.formData.port} /></Col>
                        </Row>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab={intl.get('M26P102261011090100MC002').d('其他配置')} key="2">
                        <Row style={{ marginTop: '20px' }}>
                            <Col span={8}>{intl.get('M26P102261011090100ML016').d('登录账号')}</Col>
                            <Col span={16}><Input onChange={(e): void => { this._handleChangeInput('account', e) }} value={this.state.formData.account} /></Col>
                        </Row>
                        <Row>
                            <Col span={8}>{intl.get('M26P102261011090100ML017').d('登录密码')}</Col>
                            <Col span={16}><Input type="password" onChange={(e): void => { this._handleChangeInput('password', e) }} value={this.state.formData.password} /></Col>
                        </Row>
                        <Row>
                            <Col span={8}>{intl.get('M26P102261011090100ML022').d('数据库别名')}</Col>
                            <Col span={16}><Input onChange={(e): void => { this._handleChangeInput('alias', e) }} value={this.state.formData.alias} /></Col>
                        </Row>
                    </Tabs.TabPane>
                </Tabs>
            </div>
        )
    }
}


export default Database
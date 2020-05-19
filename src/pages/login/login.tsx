import * as React from 'react'
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import intl from 'react-intl-universal'
import { Form, Icon, Input, Button, message, Modal, Row, Col } from 'antd'
import DraggableModal from '../../components/cores/draggableModal/draggableModal'
import { _login, _changePassword, _queryLang } from '../../common/api/global'
import styles from './login.module.less'
import logo from '../../assets/images/logo.png'

// intl语言包
const locales = {}

interface IState {
    initDone: boolean;
    newPasswordOnce: string;
    newPasswordTwice: string;
    oldPassword: string;
    visible: boolean;
    warningMsg: string;
    footer: string[];
}

class LoginPage extends React.Component<any, IState> {
    constructor(props: any) {
        super(props)
        this.state = {
            initDone: false,
            newPasswordOnce: '',
            newPasswordTwice: '',
            oldPassword: '',
            visible: false,
            warningMsg: '',
            footer: ['取消', '确认']
        }
    }

    public componentDidMount(): void {
        this.loadLocalLang()
    }

    // 加载本地语言包
    public loadLocalLang = async (): Promise<void> => {
        const res: any = await _queryLang()
        if (res && res.result) {
            res.data.forEach((item: any): void => {
                axios.get(`/${item.lang_id}.js`).then((response: any): void => {
                    console.log(response.data)
                    locales[item.culture] = response.data
                    if (Object.keys(locales).length === res.data.length) {
                        const isExist = res.data.some((dataItem: any): boolean => (
                            dataItem.culture === navigator.language
                        ))
                        intl.init({
                            currentLocale: isExist ? navigator.language : 'en-US',
                            locales
                        }).then((): void => {
                            document.getElementsByTagName('title')[0].innerText = intl.get('BDN00013002026')
                            this.setState({
                                initDone: true,
                                footer: [intl.get('COM00100010003').d('Cancel'), intl.get('COM00100010001').d('OK')]
                            })
                        })
                    }
                })
            })
        }
    }

    // 登录提交
    public handleSubmit = (e: any): void => {
        e.preventDefault()
        this.props.form.validateFields((err: any, values: any): void => {
            if (!err) {
                const pwdBase64 = window.btoa(values.password)
                this.setState({
                    oldPassword: pwdBase64
                })
                const data = {
                    account: values.username,
                    password: pwdBase64
                }
                this.login(data)
            }
        })
    }

    public login = async (data: ILogin): Promise<void> => {
        const res: any = await _login(data)
        if (res && res.result) {
            sessionStorage.setItem('iRecord', JSON.stringify(res.data))
            if (res.code === 1014 || res.code === 1015) {
                this.setState({ visible: true, warningMsg: res.msg })
            } else if (res.code === 1016) {
                Modal.confirm({
                    title: intl.get('LOGIN000000003'),
                    content: res.msg,
                    onOk: (): void => {
                        this.setState({ visible: true, warningMsg: res.msg })
                    },
                    onCancel: (): void => {
                        this.props.history.push('/')
                    }
                })
            } else {
                this.props.history.push('/')
            }
        } else {
            message.error(<span dangerouslySetInnerHTML={{ __html: res.msg }} />)
        }
    }

    // 修改密码点击确定按钮
    public handleOk = (): void => {
        if (this.state.newPasswordOnce !== this.state.newPasswordTwice) {
            message.error(intl.get('COM00200000010001'))
            return
        }
        this.changePassword()
    }

    public changePassword = async (): Promise<void> => {
        const res: any = await _changePassword({
            type: 'login',
            oldpassword: this.state.oldPassword,
            newpassword: window.btoa(this.state.newPasswordOnce)
        })
        this.setState({ visible: false })
        if (res && res.result) {
            this.props.history.push('/')
        } else {
            sessionStorage.removeItem('iRecord')
            message.error(res.msg)
        }
    }

    public handleCancel = (): void => {
        sessionStorage.removeItem('iRecord')
        this.setState({ visible: false })
    }

    public render(): React.ReactElement {
        const { getFieldDecorator } = this.props.form
        return (
            this.state.initDone &&
            <div className={styles.loginContainer}>
                <div className={styles.banner}>
                    <img src={logo} alt="irecord" />
                    <h1>{intl.get('BDN00013001026')}</h1>
                </div>
                <Form layout="inline" onSubmit={this.handleSubmit} className={styles.loginForm}>
                    <Form.Item>
                        {getFieldDecorator('username', {
                            rules: [{ required: true, message: intl.get('LOGIN000000001') }]
                        })(
                            <Input
                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="Username"
                            />
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: intl.get('LOGIN000000002') }]
                        })(
                            <Input
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="password"
                                placeholder="Password"
                            />
                        )}
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            <Icon type="login" />
                        </Button>
                    </Form.Item>
                </Form>

                <DraggableModal
                    visible={this.state.visible}
                    title={intl.get('COM10100000040004')}
                    className={styles.modalWrapper}
                    width={600}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="cancel" onClick={this.handleCancel}>
                            {this.state.footer[0]}
                        </Button>,
                        <Button key="confirm" type="primary" onClick={this.handleOk}>
                            {this.state.footer[1]}
                        </Button>
                    ]}
                >
                    <p style={{ color: 'red' }}>{this.state.warningMsg}</p>
                    <Row>
                        <Col span={8}>{intl.get('COM10100000040002')}</Col>
                        <Col span={16}>
                            <Input.Password onChange={(e: any): void => this.setState({ newPasswordOnce: e.target.value })} />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>{intl.get('COM10100000040003')}</Col>
                        <Col span={16}>
                            <Input.Password onChange={(e: any): void => this.setState({ newPasswordTwice: e.target.value })} />
                        </Col>
                    </Row>
                </DraggableModal>
            </div>
        )
    }
}

const Login = Form.create()(withRouter(LoginPage))

export default Login
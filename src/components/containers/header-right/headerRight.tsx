import * as React from 'react'
import intl from 'react-intl-universal'
import { Icon, message, Row, Col, Input } from 'antd'
import { withRouter } from 'react-router-dom'
import DraggableModal from '../../cores/draggableModal/draggableModal'
import { _changePassword, _logout } from '../../../common/api/global'
import styles from './headerRight.module.less'

interface IState {
    oldPassword: string;
    newPasswordOnce: string;
    newPasswordTwice: string;
    visible: boolean;
}

class HeaderRight extends React.PureComponent<any, IState> {
    constructor(props: any) {
        super(props)
        this.state = {
            oldPassword: '',
            newPasswordOnce: '',
            newPasswordTwice: '',
            visible: false
        }
    }

    public handleOk = (): void => {
        if (this.state.newPasswordOnce !== this.state.newPasswordTwice) {
            message.error(intl.get('COM00200000010001'))
            return
        }
        this.changePassword()
    }

    // 修改密码
    public changePassword = async (): Promise<void> => {
        const res: any = await _changePassword({
            type: 'not',
            oldpassword: window.btoa(this.state.oldPassword),
            newpassword: window.btoa(this.state.newPasswordOnce)
        })
        this.setState({ visible: false })
        if (res && res.result) {
            message.success(intl.get('SUC10100000020001'))
            sessionStorage.removeItem('iRecord')
            this.props.history.push('/login')
        } else {
            message.error(res.msg)
        }
    }

    public logout = async (): Promise<void> => {
        const res: any = await _logout()
        if (res && res.result) {
            sessionStorage.removeItem('iRecord')
            this.props.history.push('/login')
        }
    }

    public render(): React.ReactElement {
        return (
            <React.Fragment>
                <Icon className={styles.icon} type="message" />
                <Icon className={styles.icon} type="edit" onClick={(): void => { this.setState({ visible: true }) }} />
                <Icon className={styles.icon} type="user" />
                <Icon className={styles.icon} type="logout" onClick={this.logout} />

                <DraggableModal
                    visible={this.state.visible}
                    title={intl.get('COM10100000040004')}
                    width={600}
                    onOk={this.handleOk}
                    onCancel={(): void => { this.setState({ visible: false }) }}
                >
                    <Row>
                        <Col span={8}>{intl.get('COM10100000040001').d('原密码')}</Col>
                        <Col span={16}>
                            <Input.Password onChange={(e: any): void => this.setState({ oldPassword: e.target.value })} />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>{intl.get('COM10100000040002').d('新密码')}</Col>
                        <Col span={16}>
                            <Input.Password onChange={(e: any): void => this.setState({ newPasswordOnce: e.target.value })} />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>{intl.get('COM10100000040003').d('确认密码')}</Col>
                        <Col span={16}><Input.Password onChange={(e: any): void => this.setState({ newPasswordTwice: e.target.value })} /></Col>
                    </Row>
                </DraggableModal>
            </React.Fragment>
        )
    }
}

export default withRouter(HeaderRight)
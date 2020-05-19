import * as React from 'react'
import { withRouter } from 'react-router-dom'
import { Popover, Avatar, Card, Icon } from 'antd'
import styles from './headerUser.module.less'

interface IState {
    user: string;
}

class HeaderUser extends React.PureComponent<any, IState> {
    constructor(props: any) {
        super(props)
        this.state = {
            user: ''
        }
    }

    public componentDidMount(): void {
        const userInfomation = JSON.parse(window.sessionStorage.getItem('iRecord'))
        this.setState({
            user: userInfomation.full_name
        })
    }

    public logout = (): void => {
        window.sessionStorage.removeItem('iRecord')
        this.props.history.push('/login')
    }

    public render(): React.ReactElement {
        return (
            <Popover
                trigger="click"
                overlayClassName={styles.popover}
                placement="bottomLeft"
                arrowPointAtCenter
                content={
                    <div>
                        <Card
                            style={{ width: 300 }}
                            bordered={false}
                            actions={[
                                <Icon type="logout" title="退出登录" onClick={this.logout} />,
                                <Icon type="edit" title="个人中心" />
                            ]}
                        >
                            <Card.Meta
                                avatar={
                                    <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                                }
                                title={`欢迎您：${this.state.user}`}
                                description={
                                    <div>这里放入用户的一些基本信息，例如：积分</div>
                                }
                            />
                        </Card>
                    </div>
                }
            >
                <Avatar className={styles.avatar} icon="user" size="small" />
            </Popover>
        )
    }
}

export default withRouter(HeaderUser)
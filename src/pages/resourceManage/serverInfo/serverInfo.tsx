import * as React from 'react'
import { Row, Col } from 'antd'
import intl from 'react-intl-universal'
import styles from './serverInfo.module.less'

class ServerInfo extends React.Component<any, any> {
    constructor(props: any) {
        super(props)
        this.state = {

        }
    }

    public componentDidMount(): void {
        console.log(this.props)
    }

    public render(): React.ReactElement {
        console.log(this.props.dataInfo)
        return (
            <div className={styles.basicInfo}>
                <div style={{ marginTop: '20px', marginLeft: '30px', textAlign: 'center' }}>{intl.get('M26P102261011090100PF002').d('服务器设备信息')}</div>
                <div>
                    <Row style={{ marginTop: '40px', marginLeft: '30px', borderBottom: '1px solid #2C3E50', padding: '8px' }}>
                        <Col span={8}>
                            {intl.get('M26P102261011090100ML004').d('IP')}
                        </Col>
                        <Col span={16}>
                            {this.props.dataInfo && this.props.dataInfo.ipaddress}
                        </Col>
                    </Row>
                    <Row style={{ marginLeft: '30px', borderBottom: '1px solid #2C3E50', padding: '8px' }}>
                        <Col span={8}>
                            {intl.get('M26P102261011090100ML006').d('服务器别名')}
                        </Col>
                        <Col span={16}>
                            {this.props.dataInfo && this.props.dataInfo.alias}
                        </Col>
                    </Row>
                    <Row style={{ padding: '8px', marginLeft: '30px', borderBottom: '1px solid #2C3E50' }}>
                        <Col span={8}>
                            {intl.get('M26P102261011090100ML019').d('restful端口')}
                        </Col>
                        <Col span={16}>
                            {this.props.dataInfo && this.props.dataInfo.port}
                        </Col>
                    </Row>
                    <Row style={{ padding: '8px', marginLeft: '30px', borderBottom: '1px solid #2C3E50' }}>
                        <Col span={8}>
                            {intl.get('M26P102261011090100ML005').d('websocket端口')}
                        </Col>
                        <Col span={16}>
                            {this.props.dataInfo && this.props.dataInfo.websocketport}
                        </Col>
                    </Row>
                    <Row style={{ padding: '8px', marginLeft: '30px', borderBottom: '1px solid #2C3E50' }}>
                        <Col span={8}>
                            {intl.get('BDN000211108999').d('日志等级')}
                        </Col>
                        <Col span={16}>
                            {this.props.dataInfo && this.props.dataInfo.loglevel}
                        </Col>
                    </Row>
                    <Row style={{ padding: '8px', marginLeft: '30px', borderBottom: '1px solid #2C3E50' }}>
                        <Col span={8}>
                            {intl.get('M26P102261011090100MT005').d('日志路径')}
                        </Col>
                        <Col span={16}>
                            {this.props.dataInfo && this.props.dataInfo.logpath}
                        </Col>
                    </Row>
                    <Row style={{ padding: '8px', marginLeft: '30px', borderBottom: '1px solid #2C3E50' }}>
                        <Col span={8}>
                            {intl.get('M26P102261011090100ML007').d('类别')}
                        </Col>
                        <Col span={16}>
                            {this.props.dataInfo && this.props.dataInfo.type === 1 ? `${intl.get('BDN000211115001').d('实体机')}` : `${intl.get('BDN000211115002').d('虚拟机')}`}
                        </Col>
                    </Row>
                    <Row style={{ padding: '8px', marginLeft: '30px', borderBottom: '1px solid #2C3E50' }}>
                        <Col span={8}>
                            {intl.get('M26P102261011090100ML008').d('启用性能监视')}
                        </Col>
                        <Col span={16}>
                            {this.props.dataInfo && this.props.dataInfo.functionmonitor === 1 ? `${intl.get('COM001002002V1').d('启用')}` : `${intl.get('COM001002002V0').d('禁用')}`}
                        </Col>
                    </Row>
                    <Row style={{ padding: '8px', marginLeft: '30px', borderBottom: '1px solid #2C3E50' }}>
                        <Col span={8}>
                            {intl.get('M26P102261011090100P001').d('状态')}
                        </Col>
                        <Col span={16}>
                            {this.props.dataInfo && this.props.dataInfo.state === 1 ? `${intl.get('COM001002002V1').d('启用')}` : `${intl.get('COM001002002V0').d('禁用')}`}
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}


export default ServerInfo
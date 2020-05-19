import * as React from 'react'
import { Row, Col } from 'antd'

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
            <div>
                <div style={{ marginTop: '20px', marginLeft: '30px', textAlign: 'center' }}>服务器设备信息</div>
                <div>
                    <Row style={{ marginTop: '40px', marginLeft: '30px', borderBottom: '1px solid #2C3E50', paddingBottom: '20px' }}>
                        <Col span={8}>
                            服务器名称：
                        </Col>
                        <Col span={16}>
                            {this.props.dataInfo && this.props.dataInfo.IPAddress}
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '40px', marginLeft: '30px', borderBottom: '1px solid #2C3E50', paddingBottom: '20px' }}>
                        <Col span={8}>
                            服务器别名：
                        </Col>
                        <Col span={16}>
                            {this.props.dataInfo && this.props.dataInfo.alias}
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '20px', marginLeft: '30px', borderBottom: '1px solid #2C3E50', paddingBottom: '20px' }}>
                        <Col span={8}>
                            端口：
                        </Col>
                        <Col span={16}>
                            {this.props.dataInfo && this.props.dataInfo.port}
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '20px', marginLeft: '30px', borderBottom: '1px solid #2C3E50', paddingBottom: '20px' }}>
                        <Col span={8}>
                            日志等级：
                        </Col>
                        <Col span={16}>
                            {this.props.dataInfo && this.props.dataInfo.logLevel}
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '20px', marginLeft: '30px', borderBottom: '1px solid #2C3E50', paddingBottom: '20px' }}>
                        <Col span={8}>
                            类别：
                        </Col>
                        <Col span={16}>
                            {this.props.dataInfo && this.props.dataInfo.deviceType}
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '20px', marginLeft: '30px', borderBottom: '1px solid #2C3E50', paddingBottom: '20px' }}>
                        <Col span={8}>
                            性能监视：
                        </Col>
                        <Col span={16}>
                            {this.props.dataInfo && this.props.dataInfo.functionMonitor === 1 ? '启用' : '禁用'}
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '20px', marginLeft: '30px', borderBottom: '1px solid #2C3E50', paddingBottom: '20px' }}>
                        <Col span={8}>
                            状态：
                        </Col>
                        <Col span={16}>
                            {this.props.dataInfo && this.props.dataInfo.state === 1 ? '启用' : '禁用'}
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}


export default ServerInfo
import * as React from 'react'
import { Row, Col } from 'antd'
import intl from 'react-intl-universal'

class MonitorInfo extends React.Component<any, any> {
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
            <div style={{ height: '650px', overflow: 'auto' }}>
                <div style={{ marginTop: '15px', marginLeft: '30px', textAlign: 'center' }}>{intl.get('M26P102261011090500PF003').d('监视监听服务信息')}</div>
                <div>
                    <Row style={{ marginTop: '15px', marginLeft: '30px', borderBottom: '1px solid #2C3E50', padding: '8px' }}>
                        <Col span={8}>
                            {intl.get('M26P102261011090500ML022').d('监视监听服务别名')}
                        </Col>
                        <Col span={16}>
                            {this.props.dataInfo && this.props.dataInfo.alias}
                        </Col>
                    </Row>
                    <Row style={{ marginLeft: '30px', borderBottom: '1px solid #2C3E50', padding: '8px' }}>
                        <Col span={8}>
                            {intl.get('M26P102261011090100ML019').d('restful端口')}
                        </Col>
                        <Col span={16}>
                            {this.props.dataInfo && this.props.dataInfo.restfulport}
                        </Col>
                    </Row>
                    <Row style={{ marginLeft: '30px', borderBottom: '1px solid #2C3E50', padding: '8px' }}>
                        <Col span={8}>
                            {intl.get('M26P102261011090100ML005').d('websocket端口')}
                        </Col>
                        <Col span={16}>
                            {this.props.dataInfo && this.props.dataInfo.websocketport}
                        </Col>
                    </Row>
                    <Row style={{ marginLeft: '30px', borderBottom: '1px solid #2C3E50', padding: '8px' }}>
                        <Col span={8}>
                            {intl.get('BDN000211108999').d('日志等级')}
                        </Col>
                        <Col span={16}>
                            {this.props.dataInfo && this.props.dataInfo.loglevel}
                        </Col>
                    </Row>
                    <Row style={{ marginLeft: '30px', borderBottom: '1px solid #2C3E50', padding: '8px' }}>
                        <Col span={8}>
                            {intl.get('M26P102261011090500ML006').d('启用告警消息推送服务')}
                        </Col>
                        <Col span={16}>
                            {this.props.dataInfo && this.props.dataInfo.alarmpush === 1 ? `${intl.get('COM001002002V1').d('启用')}` : `${intl.get('COM001002002V0').d('禁用')}`}
                        </Col>
                    </Row>
                    <Row style={{ marginLeft: '30px', borderBottom: '1px solid #2C3E50', padding: '8px' }}>
                        <Col span={8}>
                            {intl.get('M26P102261011090500ML007').d('启用状态')}
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


export default MonitorInfo
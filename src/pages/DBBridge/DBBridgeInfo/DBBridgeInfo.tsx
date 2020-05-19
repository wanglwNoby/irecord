import * as React from 'react'
import { Row, Col } from 'antd'
import intl from 'react-intl-universal'

class DBBridgeInfo extends React.Component<any, any> {
    constructor(props: any) {
        super(props)
        this.state = {

        }
    }

    public componentDidMount(): void {
        console.log(this.props.dataInfo)
    }

    public render(): React.ReactElement {
        let guid
        if (this.props.dataInfo !== undefined) {
            for (const item of this.props.serverData) {
                if (item.guid === this.props.dataInfo.guid) {
                    guid = item.full_name
                }
            }
        }
        return (
            <div>
                <div style={{ marginTop: '20px', marginLeft: '30px', textAlign: 'center' }}>{intl.get('M26P102261011090300MF001').d('DBBridge信息')}</div>
                <div>
                    <Row style={{ marginTop: '40px', marginLeft: '30px', borderBottom: '1px solid #2C3E50', padding: '8px' }}>
                        <Col span={8}>
                            {intl.get('M26P102261011090100ML011').d('所在服务器')}
                        </Col>
                        <Col span={16}>
                            {guid}
                        </Col>
                    </Row>
                    <Row style={{ marginLeft: '30px', borderBottom: '1px solid #2C3E50', padding: '8px' }}>
                        <Col span={8}>
                            {intl.get('M26P102261011090300ML001').d('DBBridge别名')}
                        </Col>
                        <Col span={16}>
                            {this.props.dataInfo && this.props.dataInfo.alias}
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
                            {intl.get('M26P102261011090100ML019').d('restful端口')}
                        </Col>
                        <Col span={16}>
                            {this.props.dataInfo && this.props.dataInfo.restfulport}
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
                            {intl.get('M26P102261011090100P001').d('状态')}
                        </Col>
                        <Col span={16}>
                            {this.props.dataInfo && this.props.dataInfo.state === 1 ? `${intl.get('COM001002002V1').d('启用')}` : `${intl.get('COM001002002V0').d('禁用')}`}
                        </Col>
                    </Row>
                    {
                        this.props.databaseName !== null && this.props.databaseName.map((item): any => (
                            <Row onClick={(): void => { this.props.deleteDataBase(item) }} key={`${item.SystemId}${Math.floor(Math.random() * 10000000)}`} style={{ marginLeft: '30px', borderBottom: '1px solid #2C3E50', padding: '8px', color: '#1890FF', cursor: 'pointer' }}>
                                <Col span={8}>
                                    {intl.get('M26P102261011090100ML020').d('数据库名称')}
                                    ：
                                    {item.DataBaseName}
                                </Col>
                                <Col span={8}>
                                    {intl.get('M26P102261011090100ML004').d('IP')}
                                    ：
                                    {item.Ipaddress}
                                </Col>
                                <Col span={8}>
                                    {intl.get('M26P102261011090100P001').d('状态')}
                                    ：
                                    {item.State === 1 ? `${intl.get('COM001002002V1').d('启用')}` : `${intl.get('COM001002002V0').d('禁用')}`}
                                </Col>
                            </Row>
                        ))
                    }
                </div>
            </div>
        )
    }
}


export default DBBridgeInfo
import * as React from 'react'
import { Row, Col } from 'antd'
import intl from 'react-intl-universal'
import styles from './index.module.less'

class RecordServiceInfo extends React.Component<any, any> {
    constructor(props: any) {
        super(props)
        this.state = {

        }
    }

    public componentDidMount(): void {
        console.log(this.props)
    }

    public recordType = (data): any => {
        switch (data) {
            case 65:
                return '模拟线'
            case 68:
                return '数字线'
            case 73:
                return 'VoIP'
            case 133:
                return '模拟+数字'
            case 153:
                return 'E1/T1 中继线'
            default:
                return '模拟线'
        }
    }

    public mediaFormat = (data): any => {
        switch (data) {
            case '1':
                return 'G7lla'
            case '2':
                return 'G7llu'
            case '3':
                return 'PCM8'
            case '4':
                return 'PCM16'
            default:
                return 'GSM'
        }
    }

    public render(): React.ReactElement {
        let storageDevice
        let dbBridgeId
        if (this.props.dataInfo !== undefined) {
            for (const item of this.props.storageList) {
                if (item.DeviceId === Number(this.props.dataInfo.storagedevice)) {
                    storageDevice = item.Full_Name
                }
            }
            for (const item of this.props.DBBirdgeList) {
                if (item.dbbridgeid === Number(this.props.dataInfo.dbbridgeid)) {
                    dbBridgeId = item.full_name
                }
            }
        }
        return (
            <div className={styles.basicInfo}>
                <div style={{ marginTop: '15px', marginLeft: '30px', textAlign: 'center' }}>{intl.get('M26P102261011090500PF002').d('录音服务信息')}</div>
                <div style={{ overflow: 'auto' }}>
                    <Row style={{ marginTop: '15px', marginLeft: '30px', borderBottom: '1px solid #2C3E50', paddingBottom: '20px' }}>
                        <Col span={8}>
                            {intl.get('M26P102261011090100MT003').d('存储设备')}
                        </Col>
                        <Col span={16}>
                            {storageDevice}
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '15px', marginLeft: '30px', borderBottom: '1px solid #2C3E50', paddingBottom: '20px' }}>
                        <Col span={8}>
                            {intl.get('M26P102261011090500ML026').d('DBbridge')}
                        </Col>
                        <Col span={16}>
                            {dbBridgeId}
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '15px', marginLeft: '30px', borderBottom: '1px solid #2C3E50', paddingBottom: '20px' }}>
                        <Col span={8}>
                            {intl.get('M26P102261011090500ML024').d('master服务器')}
                        </Col>
                        <Col span={16}>
                            {this.props.dataInfo && this.props.dataInfo.masterid === -1 ? this.props.currentServer.ipaddress : this.props.dataInfo.masterid}
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '15px', marginLeft: '30px', borderBottom: '1px solid #2C3E50', paddingBottom: '20px' }}>
                        <Col span={8}>
                            {intl.get('M26P102261011090500ML008').d('录音类型')}
                        </Col>
                        <Col span={16}>
                            {this.recordType(this.props.dataInfo && this.props.dataInfo.recordtype)}
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '15px', marginLeft: '30px', borderBottom: '1px solid #2C3E50', paddingBottom: '20px' }}>
                        <Col span={8}>
                            {intl.get('M26P102261011090100ML019').d('restful端口')}
                        </Col>
                        <Col span={16}>
                            {this.props.dataInfo && this.props.dataInfo.restfulport}
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '15px', marginLeft: '30px', borderBottom: '1px solid #2C3E50', paddingBottom: '20px' }}>
                        <Col span={8}>
                            {intl.get('M26P102261011090100ML005').d('websocket端口')}
                        </Col>
                        <Col span={16}>
                            {this.props.dataInfo && this.props.dataInfo.websocketport}
                        </Col>
                    </Row>
                    {this.props.dataInfo && this.props.dataInfo.recordtype === 73 ?
                        <Row style={{ marginTop: '15px', marginLeft: '30px', borderBottom: '1px solid #2C3E50', paddingBottom: '20px' }}>
                            <Col span={8}>
                                {intl.get('M26P102261011090500ML029').d('启动延时')}
                            </Col>
                            <Col span={16}>
                                {this.props.dataInfo && this.props.dataInfo.startdelay}
                            </Col>
                        </Row> :
                        ''}
                    {this.props.dataInfo && this.props.dataInfo.recordtype === 73 ?
                        <Row style={{ marginTop: '15px', marginLeft: '30px', borderBottom: '1px solid #2C3E50', paddingBottom: '20px' }}>
                            <Col span={8}>
                                {intl.get('M26P102261011090500ML025').d('并发通道数')}
                            </Col>
                            <Col span={16}>
                                {this.props.dataInfo && this.props.dataInfo.concurrentchannel}
                            </Col>
                        </Row> :
                        ''}
                    <Row style={{ marginTop: '15px', marginLeft: '30px', borderBottom: '1px solid #2C3E50', paddingBottom: '20px' }}>
                        <Col span={8}>
                            {intl.get('M26P102261011090500ML011').d('告警最小阀值(秒)')}
                        </Col>
                        <Col span={16}>
                            {this.props.dataInfo && this.props.dataInfo.lessthanrecordtime}
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '15px', marginLeft: '30px', borderBottom: '1px solid #2C3E50', paddingBottom: '20px' }}>
                        <Col span={8}>
                            {intl.get('M26P102261011090500ML012').d('告警最大阀值(秒)')}
                        </Col>
                        <Col span={16}>
                            {this.props.dataInfo && this.props.dataInfo.morethanrecordtime}
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '15px', marginLeft: '30px', borderBottom: '1px solid #2C3E50', paddingBottom: '20px' }}>
                        <Col span={8}>
                            {intl.get('M26P102261011090500ML028').d('最大静音时长')}
                        </Col>
                        <Col span={16}>
                            {this.props.dataInfo && this.props.dataInfo.maxmuteduration}
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '15px', marginLeft: '30px', borderBottom: '1px solid #2C3E50', paddingBottom: '20px' }}>
                        <Col span={8}>
                            {intl.get('M26P102261011090500ML013').d('最短录音时长')}
                        </Col>
                        <Col span={16}>
                            {this.props.dataInfo && this.props.dataInfo.minrecordduration}
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '15px', marginLeft: '30px', borderBottom: '1px solid #2C3E50', paddingBottom: '20px' }}>
                        <Col span={8}>
                            {intl.get('M26P102261011090500ML027').d('最大录音时长')}
                        </Col>
                        <Col span={16}>
                            {this.props.dataInfo && this.props.dataInfo.maxrecordduration}
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '15px', marginLeft: '30px', borderBottom: '1px solid #2C3E50', paddingBottom: '20px' }}>
                        <Col span={8}>
                            {intl.get('M26P102261011090500ML009').d('录音服务编码')}
                        </Col>
                        <Col span={16}>
                            {this.mediaFormat(this.props.dataInfo && this.props.dataInfo.mediaformat)}
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '15px', marginLeft: '30px', borderBottom: '1px solid #2C3E50', paddingBottom: '20px' }}>
                        <Col span={8}>
                            {intl.get('M26P102261011090500ML030').d('推流BUFF延时')}
                        </Col>
                        <Col span={16}>
                            {this.props.dataInfo && this.props.dataInfo.streambuffer}
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '15px', marginLeft: '30px', borderBottom: '1px solid #2C3E50', paddingBottom: '20px' }}>
                        <Col span={8}>
                            {intl.get('BDN000211108999').d('日志等级')}
                        </Col>
                        <Col span={16}>
                            {this.props.dataInfo && this.props.dataInfo.loglevel}
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '15px', marginLeft: '30px', borderBottom: '1px solid #2C3E50', paddingBottom: '20px' }}>
                        <Col span={8}>
                            {intl.get('M26P102261011090500ML031').d('归档录音记录')}
                        </Col>
                        <Col span={16}>
                            {this.props.dataInfo && this.props.dataInfo.filingmonths}
                            {intl.get('M26P102261011090500ML032').d('月之前')}
                        </Col>
                    </Row>
                    {/* <Row style={{ marginTop: '15px', marginLeft: '30px', borderBottom: '1px solid #2C3E50', paddingBottom: '20px' }}>
                        <Col span={8}>
                        实时监听主服务器:
                        </Col>
                        <Col span={16}>
                            {this.props.dataInfo && this.props.dataInfo.pushStream}
                        </Col>
                    </Row> */}
                    <Row style={{ marginTop: '15px', marginLeft: '30px', borderBottom: '1px solid #2C3E50', paddingBottom: '20px' }}>
                        <Col span={8}>
                            {intl.get('M26P102261011090500ML006').d('启用告警消息推送服务')}
                        </Col>
                        <Col span={16}>
                            {this.props.dataInfo && this.props.dataInfo.alarmpush === 1 ? `${intl.get('COM001002002V1').d('启用')}` : `${intl.get('COM001002002V0').d('禁用')}`}
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '15px', marginLeft: '30px', borderBottom: '1px solid #2C3E50', paddingBottom: '20px' }}>
                        <Col span={8}>
                            {intl.get('M26P102261011090500ML033').d('启用HASH校验码')}
                        </Col>
                        <Col span={16}>
                            {this.props.dataInfo && this.props.dataInfo.hashcheckcode === 1 ? `${intl.get('COM001002002V1').d('启用')}` : `${intl.get('COM001002002V0').d('禁用')}`}
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '15px', marginLeft: '30px', borderBottom: '1px solid #2C3E50', paddingBottom: '20px' }}>
                        <Col span={8}>
                            {intl.get('M26P102261011090500ML034').d('启用归档')}
                        </Col>
                        <Col span={16}>
                            {this.props.dataInfo && this.props.dataInfo.startarchive === 1 ? `${intl.get('COM001002002V1').d('启用')}` : `${intl.get('COM001002002V0').d('禁用')}`}
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '15px', marginLeft: '30px', borderBottom: '1px solid #2C3E50', paddingBottom: '20px' }}>
                        <Col span={8}>
                            {intl.get('M26P102261011090500ML035').d('启用回删')}
                        </Col>
                        <Col span={16}>
                            {this.props.dataInfo && this.props.dataInfo.startdelete === 1 ? `${intl.get('COM001002002V1').d('启用')}` : `${intl.get('COM001002002V0').d('禁用')}`}
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '15px', marginLeft: '30px', borderBottom: '1px solid #2C3E50', paddingBottom: '20px' }}>
                        <Col span={8}>
                            {intl.get('M26P102261011090500ML036').d('启用录音加密')}
                        </Col>
                        <Col span={16}>
                            {this.props.dataInfo && this.props.dataInfo.startencryption === 1 ? `${intl.get('COM001002002V1').d('启用')}` : `${intl.get('COM001002002V0').d('禁用')}`}
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '15px', marginLeft: '30px', borderBottom: '1px solid #2C3E50', paddingBottom: '20px' }}>
                        <Col span={8}>
                            {intl.get('M26P102261011090500ML007').d('启用状态')}
                        </Col>
                        <Col span={16}>
                            {this.props.dataInfo && this.props.dataInfo.state === 1 ? `${intl.get('COM001002002V1').d('启用')}` : `${intl.get('COM001002002V0').d('禁用')}`}
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '15px', marginLeft: '30px', borderBottom: '1px solid #2C3E50', paddingBottom: '20px' }}>
                        <Col span={8}>
                            {intl.get('M26P102261011090500ML010').d('录音服务别名')}
                        </Col>
                        <Col span={16}>
                            {this.props.dataInfo && this.props.dataInfo.alias}
                        </Col>
                    </Row>
                    {this.props.dataInfo && this.props.dataInfo.recordtype === 73 ?
                        <Row style={{ marginTop: '15px', marginLeft: '30px', borderBottom: '1px solid #2C3E50', paddingBottom: '20px' }}>
                            <Col span={8}>
                                {intl.get('M26P102261011090100MC030').d('来去话分离')}
                            </Col>
                            <Col span={16}>
                                {this.props.dataInfo && this.props.dataInfo.doubletrack === 1 ? `${intl.get('COM001002002V1').d('启用')}` : `${intl.get('COM001002002V0').d('禁用')}`}
                            </Col>
                        </Row> :
                        ''}
                    {this.props.dataInfo && this.props.dataInfo.recordtype === 73 ?
                        <Row style={{ marginTop: '15px', marginLeft: '30px', borderBottom: '1px solid #2C3E50', paddingBottom: '20px' }}>
                            <Col span={8}>
                                {intl.get('M26P102261011090100ML050').d('网关IP')}
                                1
                            </Col>
                            <Col span={16}>
                                {this.props.dataInfo && this.props.dataInfo.gatewayone}
                            </Col>
                        </Row> :
                        ''}
                    {this.props.dataInfo && this.props.dataInfo.recordtype === 73 ?
                        <Row style={{ marginTop: '15px', marginLeft: '30px', borderBottom: '1px solid #2C3E50', paddingBottom: '20px' }}>
                            <Col span={8}>
                                {intl.get('M26P102261011090100ML050').d('网关IP')}
                                2
                            </Col>
                            <Col span={16}>
                                {this.props.dataInfo && this.props.dataInfo.gatewaytwo}
                            </Col>
                        </Row> :
                        ''}
                    {this.props.dataInfo && this.props.dataInfo.recordtype === 73 ?
                        <Row style={{ marginTop: '15px', marginLeft: '30px', borderBottom: '1px solid #2C3E50', paddingBottom: '20px' }}>
                            <Col span={8}>
                                {intl.get('M26P102261011090100ML050').d('网关IP')}
                                3
                            </Col>
                            <Col span={16}>
                                {this.props.dataInfo && this.props.dataInfo.gatewaythree}
                            </Col>
                        </Row> :
                        ''}
                    {this.props.dataInfo && this.props.dataInfo.recordtype === 73 ?
                        <Row style={{ marginTop: '15px', marginLeft: '30px', borderBottom: '1px solid #2C3E50', paddingBottom: '20px' }}>
                            <Col span={8}>
                                {intl.get('M26P102261011090100ML050').d('网关IP')}
                                4
                            </Col>
                            <Col span={16}>
                                {this.props.dataInfo && this.props.dataInfo.gatewayfour}
                            </Col>
                        </Row> :
                        ''}
                    {this.props.dataInfo && this.props.dataInfo.recordtype === 73 ?
                        <Row style={{ marginTop: '15px', marginLeft: '30px', borderBottom: '1px solid #2C3E50', paddingBottom: '20px' }}>
                            <Col span={8}>
                                {intl.get('M26P102261011090100ML050').d('网关IP')}
                                5
                            </Col>
                            <Col span={16}>
                                {this.props.dataInfo && this.props.dataInfo.gatewayfive}
                            </Col>
                        </Row> :
                        ''}
                    {this.props.dataInfo && this.props.dataInfo.recordtype === 73 ?
                        <Row style={{ marginTop: '15px', marginLeft: '30px', borderBottom: '1px solid #2C3E50', paddingBottom: '20px' }}>
                            <Col span={8}>
                                {intl.get('M26P102261011090100ML050').d('网关IP')}
                                6
                            </Col>
                            <Col span={16}>
                                {this.props.dataInfo && this.props.dataInfo.gatewaysix}
                            </Col>
                        </Row> :
                        ''}
                    {this.props.dataInfo && this.props.dataInfo.recordtype === 73 ?
                        <Row style={{ marginTop: '15px', marginLeft: '30px', borderBottom: '1px solid #2C3E50', paddingBottom: '20px' }}>
                            <Col span={8}>
                                {intl.get('M26P102261011090100ML050').d('网关IP')}
                                7
                            </Col>
                            <Col span={16}>
                                {this.props.dataInfo && this.props.dataInfo.gatewayseven}
                            </Col>
                        </Row> :
                        ''}
                    {this.props.dataInfo && this.props.dataInfo.recordtype === 73 ?
                        <Row style={{ marginTop: '15px', marginLeft: '30px', borderBottom: '1px solid #2C3E50', paddingBottom: '20px' }}>
                            <Col span={8}>
                                {intl.get('M26P102261011090100ML050').d('网关IP')}
                                8
                            </Col>
                            <Col span={16}>
                                {this.props.dataInfo && this.props.dataInfo.gatewayeight}
                            </Col>
                        </Row> :
                        ''}
                    {this.props.dataInfo && this.props.dataInfo.recordtype === 73 ?
                        <Row style={{ marginTop: '15px', marginLeft: '30px', borderBottom: '1px solid #2C3E50', paddingBottom: '20px' }}>
                            <Col span={8}>
                                {intl.get('M26P102261011090100ML050').d('网关IP')}
                                9
                            </Col>
                            <Col span={16}>
                                {this.props.dataInfo && this.props.dataInfo.gatewaynine}
                            </Col>
                        </Row> :
                        ''}
                    {this.props.dataInfo && this.props.dataInfo.recordtype === 73 ?
                        <Row style={{ marginTop: '15px', marginLeft: '30px', borderBottom: '1px solid #2C3E50', paddingBottom: '20px' }}>
                            <Col span={8}>
                                {intl.get('M26P102261011090100ML050').d('网关IP')}
                                10
                            </Col>
                            <Col span={16}>
                                {this.props.dataInfo && this.props.dataInfo.gatewayten}
                            </Col>
                        </Row> :
                        ''}
                    {this.props.dataInfo && this.props.dataInfo.recordtype === 73 ?
                        <Row style={{ marginTop: '15px', marginLeft: '30px', borderBottom: '1px solid #2C3E50', paddingBottom: '20px' }}>
                            <Col span={8}>
                                {intl.get('M26P102261011090100ML003').d('描述')}
                            </Col>
                            <Col span={16}>
                                {this.props.dataInfo && this.props.dataInfo.description}
                            </Col>
                        </Row> :
                        ''}
                </div>
            </div>
        )
    }
}


export default RecordServiceInfo
import * as React from 'react'
import { Row, Col } from 'antd'
import intl from 'react-intl-universal'
import styles from './channelInfo.module.less'

class ChannelInfo extends React.Component<any, any> {
    constructor(props: any) {
        super(props)
        this.state = {

        }
    }

    public componentDidMount(): void {
        console.log(this.props)
    }

    public startModeType = (data): any => {
        switch (data) {
            case 6502:
                return `${intl.get('BDN260212602001').d('模拟线，摘挂机')}`
            case 2:
                return `${intl.get('BDN260212602002').d('模拟线，网络注册后摘挂机')}`
            case 6501:
                return `${intl.get('BDN260212602003').d('模拟线，能量')}`
            case 6503:
                return `${intl.get('BDN260212602004').d('模拟线，网络')}`
            case 6504:
                return `${intl.get('BDN260212602005').d('模拟线，DTMF')}`
            case 6:
                return `${intl.get('BDN260212602006').d('模拟线，CTI')}`
            case 7:
                return `${intl.get('BDN260212602007').d('模拟线，摘挂机，CTI收消息')}`
            case 8:
                return `${intl.get('BDN260212602008').d('模拟线，对讲机，主通道')}`
            case 9:
                return `${intl.get('BDN260212602009').d('模拟线，对讲机，副通道')}`
            case 10:
                return `${intl.get('BDN260212602010').d('数字线，网络')}`
            case 6802:
                return `${intl.get('BDN260212602011').d('数字线，D信道')}`
            case 12:
                return `${intl.get('BDN260212602012').d('数字线，能量')}`
            case 13:
                return `${intl.get('BDN260212602013').d('数字线，网络注册后D信道')}`
            case 14:
                return `${intl.get('BDN260212602014').d('数字线，CTI')}`
            case 15:
                return `${intl.get('BDN260212602015').d('数字线，DTMF')}`
            case 16:
                return `${intl.get('BDN260212602016').d('数字线，D信道，CTI收消息')}`
            case 17:
                return `${intl.get('BDN260212602017').d('E1/T1中继线，网络')}`
            case 15302:
                return `${intl.get('BDN260212602018').d('E1/T1中继线，D信道')}`
            case 19:
                return `${intl.get('BDN260212602019').d('E1/T1中继线，CTI')}`
            case 20:
                return `${intl.get('BDN260212602020').d('E1/T1中继线，单步会议')}`
            case 21:
                return `${intl.get('BDN260212602021').d('E1/T1中继线，D信道，CTI收消息')}`
            case 22:
                return `${intl.get('BDN260212602022').d('E1/T1中继线，自动会议')}`
            case 7302:
                return `${intl.get('BDN260212602023').d('VoIP，D信道')}`
            case 24:
                return `${intl.get('BDN260212602024').d('VoIP，网络注册后D信道')}`
            case 7303:
                return `${intl.get('BDN260212602025').d(' VoIP，网络')}`
            case 26:
                return `${intl.get('BDN260212602026').d('VoIP，CTI')}`
            case 7304:
                return `${intl.get('BDN260212602027').d('VoIP，DTMF')}`
            default:
                return `${intl.get('BDN260212602028').d('VoIP，D信道，CTI收消息')}`
        }
    }

    public recordFileCode = (data): any => {
        switch (data) {
            case 1:
                return `${intl.get('BDN260212603001').d('PCMA(G.711A)')}`
            default:
                return `${intl.get('BDN260212603002').d('PCMU(G.711U)')}`
        }
    }

    public codingFormat = (data): any => {
        switch (data) {
            case 72770001:
                return `${intl.get('BDN260212604001').d('PCMA(G.711A) 8bit，8000Hz')}`
            case 72770002:
                return `${intl.get('BDN260212604002').d('PCMU(G.711U) 8bit，8000Hz')}`
            case 72770003:
                return `${intl.get('BDN260212604003').d('PCM原始编码  8bit，8000Hz')}`
            case 72770004:
                return `${intl.get('BDN260212604004').d('PCM原始编码 16bit，8000Hz')}`
            case 72770007:
                return `${intl.get('BDN260212604005').d('Microsoft GSM 6.10 13000 bps 8 KHz')}`
            default:
                return `${intl.get('BDN260212604006').d('MP3 32 KHz 8-bit stereo(Experimenting)')}`
        }
    }

    public render(): React.ReactElement {
        console.log(this.props.dataInfo)
        return (
            <div style={{ overflow: 'auto' }} className={styles.basicInfo}>
                <div style={{ marginTop: '15px', marginLeft: '30px', textAlign: 'center' }}>{intl.get('M26P102261011091100PF001').d('录音通道信息')}</div>
                <div>
                    {/* <Row style={{ marginTop: '20px', marginLeft: '30px', borderBottom: '1px solid #2C3E50', paddingBottom: '20px' }}>
                        <Col span={8}>
                            录音厂商ID：
                        </Col>
                        <Col span={16}>
                            {this.props.dataInfo && this.props.dataInfo.recorderId}
                        </Col>
                    </Row> */}
                    <Row style={{ marginLeft: '30px', borderBottom: '1px solid #2C3E50', padding: '8px' }}>
                        <Col span={10}>
                            {intl.get('M26P102261011091100ML001').d('通道号')}
                        </Col>
                        <Col span={14}>
                            {this.props.dataInfo && this.props.dataInfo.channelid}
                        </Col>
                    </Row>
                    <Row style={{ marginLeft: '30px', borderBottom: '1px solid #2C3E50', padding: '8px' }}>
                        <Col span={10}>
                            {intl.get('M26P102261011091100ML008').d('通道名')}
                        </Col>
                        <Col span={14}>
                            {this.props.dataInfo && this.props.dataInfo.channelname}
                        </Col>
                    </Row>
                    <Row style={{ marginLeft: '30px', borderBottom: '1px solid #2C3E50', padding: '8px' }}>
                        <Col span={10}>
                            {intl.get('M26P102261011091100ML002').d('分机号')}
                        </Col>
                        <Col span={14}>
                            {this.props.dataInfo && this.props.dataInfo.extensionid}
                        </Col>
                    </Row>
                    <Row style={{ marginLeft: '30px', borderBottom: '1px solid #2C3E50', padding: '8px' }}>
                        <Col span={10}>
                            {intl.get('M26P102261011091100ML007').d('IP话机IPAddress或MAC')}
                        </Col>
                        <Col span={14}>
                            {this.props.dataInfo && this.props.dataInfo.phoneip}
                        </Col>
                    </Row>
                    <Row style={{ marginLeft: '30px', borderBottom: '1px solid #2C3E50', padding: '8px' }}>
                        <Col span={10}>
                            {intl.get('M26P102261011090100ML015').d('端口')}
                        </Col>
                        <Col span={14}>
                            {this.props.dataInfo && this.props.dataInfo.phoneport}
                        </Col>
                    </Row>
                    <Row style={{ marginLeft: '30px', borderBottom: '1px solid #2C3E50', padding: '8px' }}>
                        <Col span={10}>
                            {intl.get('M26P102261011091100ML006').d('录音文件保存格式')}
                        </Col>
                        <Col span={14}>
                            {this.codingFormat(this.props.dataInfo && this.props.dataInfo.codingformat)}
                        </Col>
                    </Row>
                    <Row style={{ marginLeft: '30px', borderBottom: '1px solid #2C3E50', padding: '8px' }}>
                        <Col span={10}>
                            {intl.get('M26P102261011091100ML005').d('实时流格式')}
                        </Col>
                        <Col span={14}>
                            {this.recordFileCode(this.props.dataInfo && this.props.dataInfo.recordfilecode)}
                        </Col>
                    </Row>
                    <Row style={{ marginLeft: '30px', borderBottom: '1px solid #2C3E50', padding: '8px' }}>
                        <Col span={10}>
                            {intl.get('M26P102261011091100ML004').d('启动方式')}
                        </Col>
                        <Col span={14}>
                            {this.startModeType(this.props.dataInfo && this.props.dataInfo.startmode)}
                        </Col>
                    </Row>
                    <Row style={{ marginLeft: '30px', borderBottom: '1px solid #2C3E50', padding: '8px' }}>
                        <Col span={10}>
                            {intl.get('M26P102261011091100ML025').d('启动按键')}
                        </Col>
                        <Col span={14}>
                            {this.props.dataInfo && this.props.dataInfo.startdtmf}
                        </Col>
                    </Row>
                    <Row style={{ marginLeft: '30px', borderBottom: '1px solid #2C3E50', padding: '8px' }}>
                        <Col span={10}>
                            {intl.get('M26P102261011091100ML026').d('停止按键')}
                        </Col>
                        <Col span={14}>
                            {this.props.dataInfo && this.props.dataInfo.stopdtmf}
                        </Col>
                    </Row>
                    <Row style={{ marginLeft: '30px', borderBottom: '1px solid #2C3E50', padding: '8px' }}>
                        <Col span={10}>
                            {intl.get('M26P102261011090500ML027').d('最大录音时长')}
                        </Col>
                        <Col span={14}>
                            {this.props.dataInfo && this.props.dataInfo.maxrecordduration}
                        </Col>
                    </Row>
                    <Row style={{ marginLeft: '30px', borderBottom: '1px solid #2C3E50', padding: '8px' }}>
                        <Col span={10}>
                            {intl.get('M26P102261011090500ML013').d('最短录音时长')}
                        </Col>
                        <Col span={14}>
                            {this.props.dataInfo && this.props.dataInfo.minrecordduration}
                        </Col>
                    </Row>
                    <Row style={{ marginLeft: '30px', borderBottom: '1px solid #2C3E50', padding: '8px' }}>
                        <Col span={10}>
                            {intl.get('M26P102261011091100ML027').d('录音时段范围')}
                        </Col>
                        <Col span={14}>
                            {this.props.dataInfo && this.props.dataInfo.recordtimerange}
                        </Col>
                    </Row>
                    {/* <Row style={{ marginTop: '15px', marginLeft: '30px', borderBottom: '1px solid #2C3E50', paddingBottom: '20px' }}>
                        <Col span={8}>
                            是否选择录音：
                        </Col>
                        <Col span={16}>
                            {this.props.dataInfo && this.props.dataInfo.choiceRecord === 1 ? '是' : '否'}
                        </Col>
                    </Row> */}
                    <Row style={{ marginLeft: '30px', borderBottom: '1px solid #2C3E50', padding: '8px' }}>
                        <Col span={10}>
                            来去话分离
                        </Col>
                        <Col span={14}>
                            {this.props.dataInfo && this.props.dataInfo.doubletrack === 1 ? `${intl.get('COM001002002V1').d('启用')}` : `${intl.get('COM001002002V0').d('禁用')}`}
                        </Col>
                    </Row>
                    <Row style={{ marginLeft: '30px', borderBottom: '1px solid #2C3E50', padding: '8px' }}>
                        <Col span={10}>
                            {intl.get('M26P102261011090100ML003').d('描述')}
                        </Col>
                        <Col span={14}>
                            {this.props.dataInfo && this.props.dataInfo.description}
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}


export default ChannelInfo
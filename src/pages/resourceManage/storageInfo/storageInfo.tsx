import * as React from 'react'
import { Row, Col } from 'antd'
import intl from 'react-intl-universal'
import styles from './storageInfo.module.less'

class StorageInfo extends React.Component<any, any> {
    constructor(props: any) {
        super(props)
        this.state = {

        }
    }

    public componentDidMount(): void {
        console.log(this.props)
    }

    public storageType = (data): any => {
        console.log(data)
        switch (data) {
            case 101:
                return `${intl.get('BDN000211116101').d('本机存储空间')}`
            case 102:
                return `${intl.get('BDN000211116102').d('映射网络盘')}`
            case 201:
                return `${intl.get('BDN000211116201').d('FTP 存储空间')}`
            default:
                return `${intl.get('BDN000211116202').d('SFTP存储空间')}`
        }
    }

    public render(): React.ReactElement {
        console.log(this.props.dataInfo)
        let guid
        console.log(this.props.dataInfo)
        if (this.props.dataInfo !== undefined) {
            for (const item of this.props.serverInfo) {
                if (item.guid === this.props.dataInfo.Guid) {
                    guid = item.full_name
                }
            }
        }
        return (
            <div className={styles.basicInfo}>
                <div style={{ marginTop: '20px', marginLeft: '30px', textAlign: 'center' }}>{intl.get('M26P102261011090100PF003').d('存储设备信息')}</div>
                <div>
                    <Row style={{ marginTop: '40px', marginLeft: '30px', borderBottom: '1px solid #2C3E50', padding: '8px' }}>
                        <Col span={8}>
                            {intl.get('M26P102261011090100ML010').d('存储空间别名')}
                        </Col>
                        <Col span={16}>
                            {this.props.dataInfo && this.props.dataInfo.Alias}
                        </Col>
                    </Row>
                    <Row style={{ marginLeft: '30px', borderBottom: '1px solid #2C3E50', padding: '8px' }}>
                        <Col span={8}>
                            {intl.get('M26P102261011090100ML009').d('存储类别')}
                        </Col>
                        <Col span={16}>
                            {this.storageType(this.props.dataInfo && this.props.dataInfo.Type)}
                        </Col>
                    </Row>
                    {this.props.dataInfo && this.props.dataInfo.Type === 201 ?
                        <div>
                            <Row style={{ marginLeft: '30px', borderBottom: '1px solid #2C3E50', padding: '8px' }}>
                                <Col span={8}>
                                    {intl.get('M26P102261011090100ML004').d('IP')}
                                </Col>
                                <Col span={16}>
                                    {this.props.dataInfo && this.props.dataInfo.ServerIp}
                                </Col>
                            </Row>
                            <Row style={{ marginLeft: '30px', borderBottom: '1px solid #2C3E50', padding: '8px' }}>
                                <Col span={8}>
                                    {intl.get('M26P102261011090100ML015').d('端口')}
                                </Col>
                                <Col span={16}>
                                    {this.props.dataInfo && this.props.dataInfo.Port}
                                </Col>
                            </Row>
                            <Row style={{ marginLeft: '30px', borderBottom: '1px solid #2C3E50', padding: '8px' }}>
                                <Col span={8}>
                                    {intl.get('M26P102261011090100ML016').d('登录账号')}
                                </Col>
                                <Col span={16}>
                                    {this.props.dataInfo && this.props.dataInfo.Account}
                                </Col>
                            </Row>
                            <Row style={{ marginLeft: '30px', borderBottom: '1px solid #2C3E50', padding: '8px' }}>
                                <Col span={8}>
                                    {intl.get('M26P102261011090100ML017').d('登录密码')}
                                </Col>
                                <Col span={16}>
                                    {this.props.dataInfo && this.props.dataInfo.Password !== null ? '......' : null}
                                </Col>
                            </Row>
                            <Row style={{ marginLeft: '30px', borderBottom: '1px solid #2C3E50', padding: '8px' }}>
                                <Col span={8}>
                                    {intl.get('M26P102261011090100ML018').d('模式')}
                                </Col>
                                <Col span={16}>
                                    {this.props.dataInfo && this.props.dataInfo.Pattern === '1' ? `${intl.get('BDN000211117001').d('主动模式')}` : `${intl.get('BDN000211117002').d('被动模式')}`}
                                </Col>
                            </Row>
                        </div> : null}
                    <Row style={{ marginLeft: '30px', borderBottom: '1px solid #2C3E50', padding: '8px' }}>
                        <Col span={8}>
                            {intl.get('M26P102261011090100ML008').d('启用可用性检测')}
                        </Col>
                        <Col span={16}>
                            {this.props.dataInfo && this.props.dataInfo.AvailableCheck === 1 ? `${intl.get('COM001002002V1').d('启用')}` : `${intl.get('COM001002002V0').d('禁用')}`}
                        </Col>
                    </Row>
                    <Row style={{ marginLeft: '30px', borderBottom: '1px solid #2C3E50', padding: '8px' }}>
                        <Col span={8}>
                            {intl.get('M26P102261011090100ML014').d('存储目录')}
                        </Col>
                        <Col span={16}>
                            {this.props.dataInfo && this.props.dataInfo.HomeDirectory}
                        </Col>
                    </Row>
                    <Row style={{ marginLeft: '30px', borderBottom: '1px solid #2C3E50', padding: '8px' }}>
                        <Col span={8}>
                            {intl.get('M26P102261011090100ML011').d('所在服务器')}
                        </Col>
                        <Col span={16}>
                            {guid}
                        </Col>
                    </Row>
                    <Row style={{ marginLeft: '30px', borderBottom: '1px solid #2C3E50', padding: '8px' }}>
                        <Col span={8}>
                            {intl.get('M26P102261011090100P001').d('状态')}
                        </Col>
                        <Col span={16}>
                            {this.props.dataInfo && this.props.dataInfo.State === 1 ? `${intl.get('COM001002002V1').d('启用')}` : `${intl.get('COM001002002V0').d('禁用')}`}
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}


export default StorageInfo
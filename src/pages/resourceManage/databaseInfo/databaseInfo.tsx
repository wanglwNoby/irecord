import * as React from 'react'
import { Row, Col } from 'antd'
import intl from 'react-intl-universal'
import styles from './databaseInfo.module.less'

class DatabaseInfo extends React.Component<any, any> {
    constructor(props: any) {
        super(props)
        this.state = {

        }
    }

    public componentDidMount(): void {
        console.log(this.props)
    }

    public databaseType = (data): any => {
        console.log(data)
        switch (data) {
            case 1:
                return 'MySql'
            case 2:
                return 'MS sql'
            case 3:
                return 'Oracle'
            default:
                return 'PG Sql'
        }
    }

    public render(): React.ReactElement {
        console.log(this.props.dataInfo)
        return (
            <div className={styles.basicInfo}>
                <div style={{ marginTop: '20px', marginLeft: '30px', textAlign: 'center' }}>{intl.get('M26P102261011090100PF004').d('数据库信息')}</div>
                <div>
                    <Row style={{ marginTop: '40px', marginLeft: '30px', borderBottom: '1px solid #2C3E50', padding: '8px' }}>
                        <Col span={8}>
                            {intl.get('M26P102261011090100ML020').d('数据库名称')}
                        </Col>
                        <Col span={16}>
                            {this.props.dataInfo && this.props.dataInfo.DatabaseName}
                        </Col>
                    </Row>
                    <Row style={{ marginLeft: '30px', borderBottom: '1px solid #2C3E50', padding: '8px' }}>
                        <Col span={8}>
                            {intl.get('M26P102261011090100ML022').d('数据库别名')}
                        </Col>
                        <Col span={16}>
                            {this.props.dataInfo && this.props.dataInfo.Full_Name}
                        </Col>
                    </Row>
                    <Row style={{ marginLeft: '30px', borderBottom: '1px solid #2C3E50', padding: '8px' }}>
                        <Col span={8}>
                            {intl.get('M26P102261011090100ML021').d('数据库类型')}
                        </Col>
                        <Col span={16}>
                            {this.databaseType(this.props.dataInfo && this.props.dataInfo.Type)}
                        </Col>
                    </Row>
                    <Row style={{ marginLeft: '30px', borderBottom: '1px solid #2C3E50', padding: '8px' }}>
                        <Col span={8}>
                            {intl.get('M26P102261011090100ML004').d('IP')}
                        </Col>
                        <Col span={16}>
                            {this.props.dataInfo && this.props.dataInfo.IpAddress}
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


export default DatabaseInfo
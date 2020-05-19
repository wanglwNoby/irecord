import * as React from 'react'
import { Row, Col } from 'antd'
import intl from 'react-intl-universal'
import styles from './basicInfo.module.less'

class BasicInfo extends React.Component<any, any> {
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
                <div style={{ marginTop: '20px', marginLeft: '30px', textAlign: 'center' }}>{intl.get('M26P102261011090100PF001').d('站点信息')}</div>
                <div>
                    <Row style={{ padding: '8px', marginTop: '40px', marginLeft: '30px', borderBottom: '1px solid #2C3E50' }}>
                        <Col span={8}>
                            {intl.get('M26P102261011090100ML002').d('站点名称')}
                        </Col>
                        <Col span={16}>
                            {this.props.dataInfo && this.props.dataInfo.sitename}
                        </Col>
                    </Row>
                    <Row style={{ padding: '8px', marginLeft: '30px', borderBottom: '1px solid #2C3E50' }}>
                        <Col span={8}>
                            {intl.get('M26P102261011090100ML001').d('站点编号')}
                        </Col>
                        <Col span={16}>
                            {this.props.dataInfo && this.props.dataInfo.siteid}
                        </Col>
                    </Row>
                    <Row style={{ padding: '8px', marginLeft: '30px', borderBottom: '1px solid #2C3E50' }}>
                        <Col span={8}>
                            {intl.get('M26P102261011090100ML003').d('描述')}
                        </Col>
                        <Col span={16}>
                            {this.props.dataInfo && this.props.dataInfo.description}
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


export default BasicInfo
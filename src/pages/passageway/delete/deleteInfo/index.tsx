import * as React from 'react'
import { Row, Col } from 'antd'
import intl from 'react-intl-universal'

class DeleteInfo extends React.Component<any, any> {
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
        let method1
        if (this.props.dataInfo[0] && this.props.dataInfo[0].deleteconfig !== -1 && this.props.dataInfo[0] && this.props.dataInfo[0].deletemethod === -1) {
            method1 = `${intl.get('M26P102261011091100ML016').d('根据本地保留天数')}`
        } else if (this.props.dataInfo[0] && this.props.dataInfo[0].deletemethod !== -1 && this.props.dataInfo[0] && this.props.dataInfo[0].deleteconfig === -1) {
            method1 = `${intl.get('M26P102261011091100ML015').d('根据磁盘剩余空间')}`
        } else {
            method1 = `${intl.get('M26P102261011091100ML016').d('根据本地保留天数')} ${intl.get('M26P102261011091100ML015').d('根据磁盘剩余空间')}`
        }
        return (
            <div>
                <div style={{ marginTop: '20px', marginLeft: '30px', textAlign: 'center' }}>{intl.get('M26P102261011091100PF003').d('回删信息')}</div>
                <div>
                    <Row style={{ marginLeft: '30px', borderBottom: '1px solid #2C3E50', padding: '8px' }}>
                        <Col span={8}>
                            {intl.get('M26P102261011091100ML014').d('回删方法')}
                        </Col>
                        <Col span={16}>
                            {method1}
                        </Col>
                    </Row>
                    {this.props.dataInfo[0] && this.props.dataInfo[0].deletemethod !== -1 ?
                        <Row style={{ marginLeft: '30px', borderBottom: '1px solid #2C3E50', padding: '8px' }}>
                            <Col span={8}>
                                {intl.get('M26P102261011091100ML017').d('最小剩余空间(GB)')}
                            </Col>
                            <Col span={16}>
                                {this.props.dataInfo[0] && this.props.dataInfo[0].deletemethod}
                            </Col>
                        </Row> :
                        null
                    }
                    {this.props.dataInfo[0] && this.props.dataInfo[0].deleteconfig !== -1 ?
                        <Row style={{ marginLeft: '30px', borderBottom: '1px solid #2C3E50', padding: '8px' }}>
                            <Col span={8}>
                                {intl.get('M26P102261011091100ML018').d('删除N天前(天)')}
                            </Col>
                            <Col span={16}>
                                {this.props.dataInfo[0] && this.props.dataInfo[0].deleteconfig}
                            </Col>
                        </Row> :
                        null
                    }
                    <Row style={{ marginLeft: '30px', borderBottom: '1px solid #2C3E50', padding: '8px' }}>
                        <Col span={8}>
                            {intl.get('M26P102261011091100ML019').d('保留天数(天)')}
                        </Col>
                        <Col span={16}>
                            {this.props.dataInfo[0] && this.props.dataInfo[0].retentiondays}
                        </Col>
                    </Row>
                    <Row style={{ marginLeft: '30px', borderBottom: '1px solid #2C3E50', padding: '8px' }}>
                        <Col span={8}>
                            {intl.get('M26P102261011091100ML020').d('启用同时删除数据库记录')}
                        </Col>
                        <Col span={16}>
                            {this.props.dataInfo[0] && this.props.dataInfo[0].deletedatabase === 1 ? `${intl.get('COM001002002V1').d('启用')}` : `${intl.get('COM001002002V0').d('禁用')}`}
                        </Col>
                    </Row>
                    <Row style={{ marginLeft: '30px', borderBottom: '1px solid #2C3E50', padding: '8px' }}>
                        <Col span={8}>
                            {intl.get('M26P102261011091100ML021').d('启用锁定记录不删除')}
                        </Col>
                        <Col span={16}>
                            {this.props.dataInfo[0] && this.props.dataInfo[0].lockedrecord === 1 ? `${intl.get('COM001002002V1').d('启用')}` : `${intl.get('COM001002002V0').d('禁用')}`}
                        </Col>
                    </Row>
                    <Row style={{ marginLeft: '30px', borderBottom: '1px solid #2C3E50', padding: '8px' }}>
                        <Col span={8}>
                            {intl.get('M26P102261011090100P001').d('状态')}
                        </Col>
                        <Col span={16}>
                            {this.props.dataInfo[0] && this.props.dataInfo[0].state === 1 ? `${intl.get('COM001002002V1').d('启用')}` : `${intl.get('COM001002002V0').d('禁用')}`}
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}


export default DeleteInfo
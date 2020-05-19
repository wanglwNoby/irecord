import * as React from 'react'
import { Table, InputNumber, Icon, Select } from 'antd'
import intl from 'react-intl-universal'
import { _getColumns } from '../../../common/api/recordManage'
import styles from './columnsConfig.module.less'

/* interface IState {
    columns: any[];
    dataSource: any[];
    settingData: [],
            rowId: '',
            order: '',
} */
class ColumnsConfig extends React.Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            columns: [
                { title: `${intl.get('M26P102261011010000ML008').d('名称')}`, dataIndex: 'display', width: 150 },
                {
                    title: `${intl.get('M26P102261011010000ML009').d('宽度')}`,
                    dataIndex: 'view_width',
                    width: 150,
                    editable: true,
                    render: (text: number, record: any): React.ReactElement => (
                        <InputNumber value={text} onChange={(value: number): void => { this.handleChangeInput(value, record) }} />
                    )

                },
                {
                    title: `${intl.get('VP9121110110100100004').d('状态')}`,
                    dataIndex: 'view_on_page',
                    width: 100,
                    editable: true,
                    render: (text: number, record: any): React.ReactElement => (
                        <Select value={text} onChange={(value: number): void => { this.handleChangeSelect(value, record) }}>
                            <Select.Option value={1}>{intl.get('M26P102261011010000ML010').d('显示')}</Select.Option>
                            <Select.Option value={0}>{intl.get('M26P102261011010000ML011').d('隐藏')}</Select.Option>
                        </Select>
                    )
                }
                /* {
                    title: '操作',
                    width: 150,
                    editable: true,
                    render: (record: any): React.ReactElement => (
                        <div>
                            <Tooltip placement="top" title="向上移动">
                                <Button type="primary" onClick={(): any => { this.handleUp(record.order_id) }} shape="circle" icon="arrow-up" />
                            </Tooltip>
                            <Tooltip placement="top" title="向下移动">
                                <Button type="primary" onClick={(): any => { this.handleDown(record.order_id) }} shape="circle" icon="arrow-down" />
                            </Tooltip>
                        </div>
                    )

                } */
            ],
            dataSource: [],
            rowId: '',
            order: ''
        }
    }

    public componentDidMount(): void {
        this.getColumns()
    }

    // 获取表头数据
    public getColumns = async (): Promise<void> => {
        const res: any = await _getColumns({
            params: {
                view_id: this.props.pageId,
                type: this.props.pageType
            }
        })
        if (res && res.result) {
            console.log(res)
            this.setState({
                dataSource: res.data.map((item: any): React.ReactElement => {
                    res.data.sort((a: any, b: any): number => (a.order_id - b.order_id))
                    for (let i = 0; i < res.data.length; i++) {
                        res.data[i].order_id = i + 1
                    }
                    return {
                        ...item,
                        key: item.col_id
                    }
                })
            })
            this.props.saveCols(res.data)
        }
    }

    // 填写宽度
    public handleChangeInput = (value: number, record: any): void => {
        const newdata = (data): any => {
            console.log(data)
            const index = data.findIndex((item): any => record.col_id === item.col_id)
            const item = data[index]
            data.splice(index, 1, {
                ...item,
                view_width: Number.isNaN(Number(value)) ? 100 : Number(value)
            })
            return data
        }
        this.setState((prevState): any => ({
            dataSource: newdata(prevState.dataSource)
        }), (): void => { this.props.saveCols(this.state.dataSource) })
    }

    // 是否显示
    public handleChangeSelect = (value: number, record: any): void => {
        const newdata = (data: any): any => {
            const index = data.findIndex((item: any): any => record.col_id === item.col_id)
            const item = data[index]
            data.splice(index, 1, {
                ...item,
                view_on_page: value
            })
            return data
        }
        this.setState((prevState): any => ({
            dataSource: newdata(prevState.dataSource)
        }), (): void => { this.props.saveCols(this.state.dataSource) })
    }

    // 上移
    /* public handleUp = (order: number): any => {
        const dataUp = JSON.parse(JSON.stringify(this.state.dataSource))
        if (order === 1) {
            return false
        }
        dataUp.forEach((item): void => {
            if (order - 1 === item.order_id) {
                item.order_id += 1
            } else if (order === item.order_id) {
                item.order_id -= 1
            }
        })
        dataUp.sort((a: any, b: any): any => a.order_id - b.orde_id)
        const
        this.setState((): any => ({
            dataSource: dataUp
        }), (): any => {
            this.props.saveCols(dataUp)
        })
        return true
    } */

    // 上移
    public handleUp = (order): any => {
        const dataUp = JSON.parse(JSON.stringify(this.state.dataSource))
        if (order === 1) {
            return false
        }
        dataUp.forEach((item): void => {
            if (order - 1 === item.order_id) {
                item.order_id += 1
            } else if (order === item.order_id) {
                item.order_id -= 1
            }
        })
        dataUp.sort((a: any, b: any): any => a.order_id - b.orde_id)
        const orders = order - 1
        this.setState((): any => ({
            dataSource: dataUp,
            order: orders
        }), (): any => {
            this.props.saveCols(dataUp)
        })
        return true
    }

    // 下移
    public handleDown = (order: number): any => {
        const dataDown = JSON.parse(JSON.stringify(this.state.dataSource))
        if (order === dataDown.length) {
            return false
        }
        dataDown.forEach((item): void => {
            if (order + 1 === item.order_id) {
                item.order_id -= 1
            } else if (order === item.order_id) {
                item.order_id += 1
            }
        })
        dataDown.sort((a: any, b: any): any => a.order_id - b.order_id)
        const orders = order + 1
        this.setState((): any => ({
            dataSource: dataDown,
            order: orders
        }), (): any => {
            this.props.saveCols(dataDown)
        })
        return true
    }

    // 点击一行获取数据
    public onClickRow = (settingData): any => ({
        onClick: (): void => {
            this.setState({
                rowId: settingData.col_id,
                order: settingData.order_id
            })
        }
    })

    // 点击一行改变背景色
    public setRowClassName = (settingData): any => {
        console.log(settingData.col_id === this.state.rowId)
        return settingData.col_id === this.state.rowId ? 'clickRow' : ''
    }

    public render(): React.ReactElement {
        const dataSource = JSON.parse(JSON.stringify(this.state.dataSource)).sort((a: any, b: any): any => a.order_id - b.order_id)
        return (
            <div className={styles.columns} style={{ position: 'relative' }}>
                <Table
                    scroll={{ y: 300 }}
                    size="small"
                    columns={this.state.columns}
                    dataSource={dataSource}
                    onRow={this.onClickRow}
                    rowClassName={this.setRowClassName}
                    pagination={false}
                />
                <div style={{ position: 'absolute', top: '50%', right: '-15px'/* , fontSzie: '25px' */ }}>
                    <div style={{ marginBottom: '30px' }}>
                        <Icon style={{ cursor: 'pointer' }} onClick={(): void => { this.handleUp(this.state.order) }} type="arrow-up" />

                    </div>
                    <div>
                        <Icon style={{ cursor: 'pointer' }} onClick={(): void => { this.handleDown(this.state.order) }} type="arrow-down" />

                    </div>

                </div>
            </div>
        )
    }
}

export default ColumnsConfig
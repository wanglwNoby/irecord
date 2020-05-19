import * as React from 'react'
import { connect } from 'react-redux'
import intl from 'react-intl-universal'
import { Base64 } from 'js-base64'
import { Table, Pagination, Drawer } from 'antd'
import RightOperation from '../../../components/containers/right-operation/rightOperation'
import { _getRightOperation, _getColumns, _getWebsocketUrl } from '../../../common/api/resourceMonitor'
import { formatColumns } from '../../../utils/tableUtil'
import styles from './systemAbnormal.module.less'

interface IState {
    drawerVisible: boolean; // 详情抽屉开关
    tableHeight: number; // table滚动高度
    userID: string; // 登陆账号
    columns: any[]; // 表头
    dataSource: any[]; // 表数据
    rightOperationData: any[]; // 右侧按钮
    selectedRowKeys: string[] | number[]; // 选中的行keys
    selectedRows: any; // 选中的行数据
    ringedKeys: string; // 已经响过的keys
    ringedDegree: number; // 正在响的等级
}

let url: string
let ws: WebSocket

class SystemAbnormal extends React.PureComponent<any, IState> {
    constructor(props: any) {
        super(props)
        this.state = {
            drawerVisible: false,
            tableHeight: 0,
            userID: JSON.parse(sessionStorage.getItem('iRecord')).user_id,
            columns: [],
            dataSource: [],
            rightOperationData: [],
            selectedRowKeys: [],
            selectedRows: {},
            ringedKeys: '',
            ringedDegree: 0
        }
    }

    public componentDidMount(): void {
        const abnormal = document.querySelectorAll('#abnormal')[0]
        this.setState({
            tableHeight: abnormal.getBoundingClientRect().height - 102
        })
        this.getColumns()
        this.getRightOperation('')
    }

    public componentWillUnmount(): void {
        if (ws) {
            ws.close()
        }
        if (document.getElementById('audio')) {
            document.getElementsByTagName('body')[0].removeChild(document.getElementById('audio'))
        }
    }

    // 获取表头数据
    public getColumns = async (): Promise<void> => {
        const res: any = await _getColumns({
            params: {
                view_id: '9112650110100000000',
                type: '0'
            }
        })
        if (res && res.result) {
            const columns = formatColumns(res.data)
            this.setState({ columns }, (): void => { this.getWsUrl() })
        }
    }

    // 获取右侧菜单
    public getRightOperation = async (id: string): Promise<void> => {
        const res: any = await _getRightOperation({
            params: {
                parent_id: '1022610110305000000',
                resource_id: id
            }
        })
        if (res && res.result) {
            const rightOperation = res.data[0].P004
            this.setState({
                rightOperationData: rightOperation
            })
        }
    }

    // 获取ws地址
    public getWsUrl = async (): Promise<void> => {
        _getWebsocketUrl({
            params: { server_id: this.state.userID }
        }).then((response: any): void => {
            if (response && response.result) {
                url = `ws://${JSON.parse(response.data)[0].ip}:${JSON.parse(response.data)[0].port}/G1103100`
                this.beforeOpenWs()
            }
        })
    }

    public beforeOpenWs = (): void => {
        if (ws) {
            ws.close()
        }
        setTimeout((): void => {
            this.openWebSocket()
        }, 50)
    }

    // 与ws建立连接
    public openWebSocket = (): void => {
        if (!ws) {
            ws = new WebSocket(url)
            this.openWebSocket()
        }
        if (ws.readyState === 0) {
            ws.onopen = (): void => {
                this.openWebSocket()
            }
        } else if (ws.readyState === 1) {
            const sendMsg = {
                code: '1103102',
                data: `${this.state.userID}|${this.props.lang}`,
                msg: 'S2',
                result: true
            }
            ws.send(JSON.stringify(sendMsg))
        } else if (ws.readyState === 2 || ws.readyState === 3) {
            ws = new WebSocket(url)
            this.openWebSocket()
        }
        ws.onmessage = (e: any): void => {
            console.log(JSON.parse(e.data))
            if (JSON.parse(e.data).result && JSON.parse(e.data).msg === 'RN') {
                if (JSON.parse(e.data).code === 1103102) {
                    const data = JSON.parse(Base64.decode(JSON.parse(e.data).data))
                    console.log(data)
                    this.formatDataSource(data.ReturnInfo)
                }
            }
        }
        ws.onclose = (): void => {
            console.log('连接已关闭...')
        }
    }

    // format WS返回的数据，生成表数据
    public formatDataSource = (data: any): void => {
        const dataSource = {
            key: Math.random().toString(),
            Degree: parseInt(data['@Degree'], 10),
            CstTime: data['@LocalTime'],
            Title: data['@Title'],
            Source: data['@Code'],
            Host: `${data['@SourceGUID']}(${data['@Source19']})`,
            Type: data['@CategoryName'],
            details: data['@Content']
        }
        this.setState((prevState: any): any => ({
            dataSource: [...prevState.dataSource, dataSource]
        }), (): void => {
            if (parseInt(data['@Degree'], 10) > this.state.ringedDegree) {
                this.setState({
                    ringedKeys: dataSource.key,
                    ringedDegree: parseInt(data['@Degree'], 10)
                })
                this.startAlarm(parseInt(data['@Degree'], 10))
            }
        })
    }

    // >1开始告警
    public startAlarm = (degree: number): void => {
        if (document.getElementById('audio')) {
            document.getElementsByTagName('body')[0].removeChild(document.getElementById('audio'))
        }
        const d = 2600000 + degree
        const audio = document.createElement('audio')
        audio.setAttribute('id', 'audio')
        audio.setAttribute('hidden', 'hidden')
        audio.setAttribute('autoplay', 'autoplay')
        audio.setAttribute('loop', 'loop')
        audio.setAttribute('src', require(`../../../assets/audio/${d}.mp3`))
        document.getElementsByTagName('body')[0].appendChild(audio)
    }

    public rightIdData = (data: any): void => {
        switch (data.P003) {
            case 'OP102261011030502':
                if (document.getElementById('audio')) {
                    document.getElementsByTagName('body')[0].removeChild(document.getElementById('audio'))
                }
                this.setState({
                    dataSource: [],
                    drawerVisible: false
                })
                this.getRightOperation('')
                break
            case 'OP102261011030504':
                if (this.state.ringedKeys === this.state.selectedRowKeys.toString()) {
                    if (document.getElementById('audio')) {
                        document.getElementsByTagName('body')[0].removeChild(document.getElementById('audio'))
                        this.setState({
                            ringedDegree: 0
                        })
                    }
                }
                this.setState({
                    drawerVisible: true
                })
                break
            default:
                break
        }
    }

    public render(): React.ReactElement {
        const rowSelection = {
            selectedRowKeys: this.state.selectedRowKeys,
            selectedRows: this.state.selectedRows,
            onChange: (selectedRowKeys: string[] | number[], selectedRows: any): void => {
                if (selectedRowKeys.length === 0) {
                    this.getRightOperation('')
                    this.setState({
                        selectedRowKeys, selectedRows
                    })
                } else {
                    this.getRightOperation('264')
                    const key = selectedRowKeys.pop().toString()
                    this.setState({
                        selectedRowKeys: [key],
                        selectedRows: selectedRows.pop()
                    })
                }
            }
        }

        return (
            <div className={styles.main}>
                <div id="abnormal" className={styles.wrapper}>
                    <Table
                        className={styles.tableWrapper}
                        scroll={{ x: true, y: this.state.tableHeight }}
                        columns={this.state.columns}
                        dataSource={this.state.dataSource}
                        rowSelection={rowSelection}
                        pagination={false}
                    />
                    <Pagination
                        // total={this.state.dataSource.length}
                        // showSizeChanger={this.state.dataSource.length > 0}
                        // pageSize={this.state.pageSize}
                        pageSizeOptions={['50', '100', '200', '500']}
                    // onShowSizeChange={this.onShowSizeChange}
                    // onChange={this.onPageChange}
                    />
                    {/* 告警详情 */}
                    <Drawer
                        getContainer={false}
                        style={{ position: 'absolute' }}
                        height="auto"
                        title={intl.get('M26P1022610110305000M001').d('异常详情')}
                        placement="bottom"
                        closable={false}
                        visible={this.state.drawerVisible}
                        onClose={(): void => this.setState({ drawerVisible: false })}
                    >
                        <span>{this.state.selectedRows.details}</span>
                    </Drawer>
                </div>

                <RightOperation rightOperationData={this.state.rightOperationData} operateCallBack={(data): void => this.rightIdData(data)} />
            </div>
        )
    }
}

const mapStateToProps = (state: any): IMapStateToProps => ({
    lang: state.langReducer.lang
})

export default connect(mapStateToProps, null)(SystemAbnormal)
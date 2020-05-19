import * as React from 'react'
import { Row, Col, Input, Select, Tabs, Tree } from 'antd'
import intl from 'react-intl-universal'
import { _getDriver, _getDirectory } from '../../../common/api/siteManage'
import { _getOptionLang } from '../../../common/api/global'

function callback(key): void {
    console.log(key)
}
class Download extends React.Component<any, any> {
    constructor(props: any) {
        super(props)
        this.state = {
            formData: {
                serialNumber: 1,
                downloadType: '201',
                address: '',
                port: 21,
                account: '',
                password: '',
                patternType: '2',
                description: ''
            },
            driveLetter: '',
            directory: '',
            driver: [],
            downloadTypeData: [],
            patternData: []
        }
    }


    public componentDidMount(): void {
        this.props.homeDirectory(this.state.driveLetter)
        this.props.homeDirectory1(this.state.directory)
        this.props.download(this.state.formData)
        if (this.props.editType === 2) {
            const formData1 = {
                serialNumber: this.props.downloadInfoData.SerialNumber,
                driveLetter: this.props.downloadInfoData.DriveLetter,
                downloadType: this.props.downloadInfoData.DownloadType.toString(),
                address: this.props.downloadInfoData.Address,
                port: this.props.downloadInfoData.Port,
                account: this.props.downloadInfoData.Account,
                password: this.props.downloadInfoData.Password,
                directory: this.props.downloadInfoData.Directory,
                patternType: this.props.downloadInfoData.PatternType.toString(),
                description: this.props.downloadInfoData.Description
            }
            this.setState({
                formData: formData1,
                driveLetter: this.props.downloadInfoData.DriveLetter,
                directory: this.props.downloadInfoData.Directory
            }, (): void => {
                this.props.homeDirectory(this.state.driveLetter)
                this.props.homeDirectory1(this.state.directory)
                this.props.download(this.state.formData)
            })
        }
        this.getDriver()
        this.getOptionLangs()
        this.getOptionLangs1()
    }

    // 获取文件下载方式数据语言包
    public getOptionLangs = async (): Promise<void> => {
        const params = {
            params: {
                parent_code: '1116',
                type: ''
            }
        }
        const res: any = await _getOptionLang(params)
        if (res && res.result) {
            this.setState({
                downloadTypeData: res.data
            })
        }
    }

    // 获取下拉模式数据语言包
    public getOptionLangs1 = async (): Promise<void> => {
        const params = {
            params: {
                parent_code: '1117',
                type: ''
            }
        }
        const res: any = await _getOptionLang(params)
        if (res && res.result) {
            this.setState({
                patternData: res.data
            })
        }
    }

    // 获取根目录
    public getDriver = async (): Promise<void> => {
        console.log(this.props.dataInfo)
        const params = {
            params: {
                server_ip: this.props.dataInfo.ipaddress,
                server_port: this.props.dataInfo.port
            }

        }
        const res: any = await _getDriver(params)
        if (res && res.result) {
            console.log(res)
            const treedata = []
            res.data.driver_list.forEach((item: any): void => {
                treedata.push({ title: item.name, key: `${item.name}`, parent: item.name })
            })
            this.setState({
                driver: treedata
            })
        }
    }

    // 所有input输入框事件
    public _handleChangeInput = (type: any, e: any): void => {
        const value = e.target.value
        this.setState((prevState): any => ({
            formData: { ...prevState.formData, [type]: value }
        }), (): void => { this.props.download(this.state.formData) })
    }

    // 所有通用Form表单下拉框,switch开关,多选checkbox,呼叫方向,rangeDatepicker事件
    public _handleChangeOthers = (type: any, value: any): void => {
        this.setState((prevState): any => ({
            formData: { ...prevState.formData, [type]: value }
        }), (): void => {
            this.props.download(this.state.formData)
            // this.getDirectory()
        })
    }

    public _handleChangeOthers1 = (type: any, value: any): void => {
        this.setState((prevState): any => ({
            formData1: { ...prevState.formDat1a, [type]: value }
        }), (): void => {
            this.props.download(this.state.formData1)
            // this.getDirectory()
        })
    }

    public onExpand = (keys: any, event: any): void => {
        console.log('Trigger Select', keys, event)
        let data
        let data1
        if (event.node.props.dataRef.parent !== undefined && event.node.props.dataRef.parent.indexOf('\\') > -1) {
            data = event.node.props.dataRef.parent.substring(0, 3)
            data1 = event.node.props.dataRef.parent.substring(3)
        } else if (event.node.props.dataRef.parent !== undefined && event.node.props.dataRef.parent.indexOf('/') > -1) {
            data = event.node.props.dataRef.parent.substring((event.node.props.dataRef.parent).indexOf('/'), (event.node.props.dataRef.parent).indexOf('/') + 1)
            data1 = event.node.props.dataRef.parent.substring((event.node.props.dataRef.parent).indexOf('/') + 1, event.node.props.dataRef.parent.length)
        } else {
            data = ''
            data1 = ''
        }
        this.setState((): any => ({
            homeDirectory: event.node.props.dataRef.parent,
            driveLetter: data,
            directory: data1
        }), (): void => {
            this.props.homeDirectory(this.state.driveLetter)
            this.props.homeDirectory1(this.state.directory)
        })
    }

    public onLoadData = (treeNode: any): PromiseLike<void> => (
        new Promise((resolve): any => {
            if (treeNode.props.children) {
                resolve()
                return
            }
            console.log(this.state.homeDirectory)
            let route = ''
            if (this.state.homeDirectory.indexOf('/') > -1) {
                route = '/'
                console.log('这是linux')
            } else {
                route = '\\'
                console.log('这不是linux')
            }
            const params = {
                params: {
                    server_ip: this.props.dataInfo.ipaddress,
                    server_port: this.props.dataInfo.port,
                    directory: this.state.homeDirectory
                }
            }
            _getDirectory(params).then((res: any): void => {
                if (res && res.result && res.data.directory_list !== null) {
                    // 盘符下面的文件夹
                    const directory = res.data.directory_list
                    // 所有数据
                    const dirve = res.data
                    const data = JSON.parse(JSON.stringify(this.state.driver))
                    const treedata = []
                    directory.forEach((item: any): void => {
                        treedata.push({ title: item.name, key: `${item.name}${Math.floor(Math.random() * 10000000)}`, parent: `${dirve.parent}${item.name}${route}` })
                    })
                    for (const item of data) {
                        if (dirve.parent === this.state.homeDirectory) {
                            if (item.children) {
                                treeNode.props.dataRef.children = treedata
                            } else {
                                treeNode.props.dataRef.children = treedata
                            }
                        }
                    }
                    this.setState((prevState: any): any => ({
                        driver: [...prevState.driver]
                    }), (): void => { console.log(this.state.driver) })
                }
                resolve()
            })
        })
    )

    public loadTreeNode = (data: any): any => (
        data.map((item): any => {
            if (item.children) {
                return (
                    <Tree.TreeNode title={item.title} key={item.key} dataRef={item}>
                        {this.loadTreeNode(item.children)}
                    </Tree.TreeNode>
                )
            }
            return <Tree.TreeNode key={item.key} {...item} dataRef={item} />
        })
    )

    public onSelect = (keys: any, event: any): void => {
        console.log('Trigger Select', keys, event)
        let data
        let data1
        if (event.node.props.dataRef.parent !== undefined && event.node.props.dataRef.parent.indexOf('\\') > -1) {
            data = event.node.props.dataRef.parent.substring(0, 3)
            data1 = event.node.props.dataRef.parent.substring(3)
        } else if (event.node.props.dataRef.parent !== undefined && event.node.props.dataRef.parent.indexOf('/') > -1) {
            data = event.node.props.dataRef.parent.substring((event.node.props.dataRef.parent).indexOf('/'), (event.node.props.dataRef.parent).indexOf('/') + 1)
            data1 = event.node.props.dataRef.parent.substring((event.node.props.dataRef.parent).indexOf('/') + 1, event.node.props.dataRef.parent.length)
        } else {
            data = ''
            data1 = ''
        }
        this.setState((): any => ({
            homeDirectory: event.node.props.dataRef.parent,
            driveLetter: data,
            directory: data1
        }), (): void => {
            this.props.homeDirectory(this.state.driveLetter)
            this.props.homeDirectory1(this.state.directory)
        })
    }

    public _handleChangeInput1 = (e): void => {
        this.setState((): any => ({
            driveLetter: e
        }), (): void => {
            this.props.homeDirectory(this.state.driveLetter)
        })
    }

    public _handleChangeInput2 = (e): void => {
        const value = e.target.value
        this.setState((): any => ({
            directory: value
        }), (): void => {
            this.props.homeDirectory(this.state.directory)
        })
    }

    public render(): React.ReactElement {
        return (
            <div>
                <Tabs defaultActiveKey="1" onChange={callback}>
                    <Tabs.TabPane tab={intl.get('M26P102261011090100MC001').d('基本配置')} key="1">
                        <Row style={{ marginTop: '20px' }}>
                            <Col span={10}>{intl.get('M26P102261011091100ML022').d('文件下载方式')}</Col>
                            <Col span={14}>
                                <Select onChange={(e): void => { this._handleChangeOthers('downloadType', e) }} style={{ width: '100%' }} value={this.state.formData.downloadType}>
                                    {/* <Select.Option value={101}>http</Select.Option>
                                    <Select.Option value={102}>https</Select.Option>
                                    <Select.Option value={201}>ftp</Select.Option>
                                    <Select.Option value={202}>sftp</Select.Option> */}
                                    {this.state.downloadTypeData && this.state.downloadTypeData.map((item): React.ReactElement => (<Select.Option value={item.valid_data} key={item.order_id}>{item.display_character}</Select.Option>))}
                                </Select>
                            </Col>
                        </Row>
                        {this.state.formData.downloadType === '201' || this.state.formData.downloadType === '202' ?
                            <Row>
                                <Col span={10}>{intl.get('M26P102261011090100ML016').d('登录账号')}</Col>
                                <Col span={14}>
                                    <Input onChange={(e): void => { this._handleChangeInput('account', e) }} value={this.state.formData.account} />
                                </Col>
                            </Row> : null}
                        {this.state.formData.downloadType === '201' || this.state.formData.downloadType === '202' ?
                            <Row>
                                <Col span={10}>{intl.get('M26P102261011090100ML017').d('登录密码')}</Col>
                                <Col span={14}>
                                    <Input type="password" onChange={(e): void => { this._handleChangeInput('password', e) }} value={this.state.formData.password} />
                                </Col>
                            </Row> : null}
                        {this.state.formData.downloadType === '201' ?
                            <Row>
                                <Col span={10}>{intl.get('M26P102261011090100ML018').d('模式')}</Col>
                                <Col span={14}>
                                    <Select onChange={(e): void => { this._handleChangeOthers('patternType', e) }} style={{ width: '100%' }} value={this.state.formData.patternType}>
                                        {/* <Select.Option value={1}>主动模式</Select.Option>
                                        <Select.Option value={2}>被动模式</Select.Option> */}
                                        {this.state.patternData && this.state.patternData.map((item): React.ReactElement => (<Select.Option value={item.valid_data} key={item.order_id}>{item.display_character}</Select.Option>))}
                                    </Select>
                                </Col>
                            </Row> : null}
                        <Row>
                            <Col span={10}>{intl.get('M26P102261011090100ML011').d('所在服务器')}</Col>
                            <Col span={7}>
                                <Input onChange={(e): void => { this._handleChangeInput('address', e) }} value={this.state.formData.address} />
                            </Col>
                            <Col style={{ textAlign: 'center' }} span={4}>{intl.get('M26P102261011090100ML015').d('端口')}</Col>
                            <Col span={3}>
                                <Input onChange={(e): void => { this._handleChangeInput('port', e) }} value={this.state.formData.port} />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={10}>{intl.get('M26P102261011090100ML003').d('描述')}</Col>
                            <Col span={14}>
                                <Input.TextArea onChange={(e): void => { this._handleChangeInput('description', e) }} value={this.state.formData.description} />
                            </Col>
                        </Row>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab={intl.get('M26P102261011090100MC003').d('存储目录配置')} key="2">
                        {this.state.formData.downloadType === 201 || this.state.formData.downloadType === 202 ?
                            <div>
                                <Row>
                                    <Col span={10}>{intl.get('M26P102261011091100ML023').d('盘符')}</Col>
                                    <Col span={14}>
                                        {/* <Input onChange={(e): void => { this._handleChangeInput1(e) }} value={this.state.driveLetter} /> */}
                                        <Select style={{ width: '100%' }} onChange={(e): void => { this._handleChangeInput1(e) }} value={this.state.driveLetter}>
                                            {this.state.driver && this.state.driver.map((item): React.ReactElement => (<Select.Option value={item.title} key={item.key}>{item.title}</Select.Option>))}
                                        </Select>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={10}>{intl.get('M26P102261011091100ML024').d('路径')}</Col>
                                    <Col span={14}><Input onChange={(e): void => { this._handleChangeInput2(e) }} value={this.state.directory} /></Col>
                                </Row>
                            </div> :
                            <div>
                                <div>
                                    {intl.get('M26P102261011091100ML023').d('盘符')}
                                    {this.state.driveLetter}
                                </div>
                                <div>
                                    {intl.get('M26P102261011091100ML024').d('路径')}
                                    {this.state.directory}
                                </div>
                                {
                                    this.state.driver.length > 0 &&
                                    <Tree.DirectoryTree
                                        onExpand={this.onExpand}
                                        onSelect={this.onSelect}
                                        loadData={this.onLoadData}
                                    >
                                        {this.loadTreeNode(this.state.driver)}
                                    </Tree.DirectoryTree>
                                }
                            </div>
                        }
                    </Tabs.TabPane>
                </Tabs>
            </div>
        )
    }
}


export default Download
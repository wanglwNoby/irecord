import * as React from 'react'
import { Row, Col, Input, Select, Checkbox, Tabs, Tree } from 'antd'
import intl from 'react-intl-universal'
import { _getDriver, _getDirectory } from '../../common/api/siteManage'
import { _getOptionLang } from '../../common/api/global'

function callback(key): void {
    console.log(key)
}

interface IState {
    formData: {
        type: string;
        alias: string;
        availableCheck: boolean;
        guid: string;
        account: string;
        password: string;
        pattern: string;
        serverIp: string;
        port: string;
    };
    driver: any[];
    homeDirectory: string;
    server_ip: string;
    server_port: string;
    storageType: any[]; // 存储类别语言包数据
    patternData: any[]; // 模式语言包数据
}
class Storage extends React.Component<any, IState> {
    constructor(props: any) {
        super(props)
        this.state = {
            formData: {
                type: '101',
                alias: '',
                availableCheck: true,
                guid: '',
                account: '',
                password: '',
                pattern: '2',
                serverIp: '',
                port: '21'
            },
            driver: [],
            homeDirectory: '',
            server_ip: '',
            server_port: '',
            storageType: [],
            patternData: []
        }
    }

    public componentDidMount(): void {
        console.log(this.props.dataInfo)
        console.log(this.props.serverInfo)
        if (this.props.editType === 2 && this.props.dataInfo.Type === 101) {
            this.getDriver()
            const formData1 = {
                type: this.props.dataInfo.Type.toString(),
                alias: this.props.dataInfo.Alias,
                availableCheck: this.props.dataInfo.AvailableCheck === 1,
                guid: this.props.dataInfo.Guid,
                account: '',
                password: '',
                pattern: this.props.dataInfo.Pattern,
                serverIp: '',
                port: ''

            }
            this.setState({
                formData: formData1,
                homeDirectory: this.props.dataInfo.HomeDirectory
            }, (): void => {
                this.props.Storage(this.state.formData)
                this.props.homeDirectory(this.state.homeDirectory)
            })
        } else if (this.props.editType === 2 && (this.props.dataInfo.type === 201 || this.props.dataInfo.type === 202)) {
            const formData1 = {
                type: this.props.dataInfo.Type.toString(),
                alias: this.props.dataInfo.Alias,
                availableCheck: this.props.dataInfo.AvailableCheck === 1,
                guid: this.props.dataInfo.Guid,
                account: this.props.dataInfo.Account,
                password: this.props.dataInfo.Password,
                pattern: this.props.dataInfo.Pattern,
                serverIp: this.props.dataInfo.ServerIp,
                port: this.props.dataInfo.Port

            }
            this.setState({
                formData: formData1,
                homeDirectory: this.props.dataInfo.HomeDirectory
            }, (): void => {
                this.props.Storage(this.state.formData)
                this.props.homeDirectory(this.state.homeDirectory)
            })
        }
        this.getOptionLangs()
        this.getOptionLangs1()
    }

    // 获取下拉存储类别数据语言包
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
                storageType: res.data
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

    // 获取存放目录
    public getDriver = async (): Promise<void> => {
        if (this.state.formData.guid !== '' && this.props.editType !== 2) {
            let serverIp
            let serverport
            for (const item of this.props.serverInfo) {
                if (item.guid === this.state.formData.guid) {
                    serverIp = item.ipaddress
                    serverport = item.port
                }
                this.setState({
                    server_ip: serverIp,
                    server_port: serverport
                })
            }
            const params = {
                params: {
                    server_ip: serverIp,
                    server_port: serverport
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
        if (this.props.editType === 2) {
            let serverIp
            let serverport
            for (const item of this.props.serverInfo) {
                if (item.guid === this.props.dataInfo.Guid) {
                    serverIp = item.ipaddress
                    serverport = item.port
                }
                this.setState({
                    server_ip: serverIp,
                    server_port: serverport
                })
            }
            const params = {
                params: {
                    server_ip: serverIp,
                    server_port: serverport
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
    }

    // 所有input输入框事件
    public _handleChangeInput = (type: any, e: any): void => {
        const value = e.target.value
        this.setState((prevState): any => ({
            formData: { ...prevState.formData, [type]: value }
        }), (): void => { this.props.Storage(this.state.formData) })
    }

    // 所有通用Form表单下拉框,switch开关,多选checkbox,呼叫方向,rangeDatepicker事件
    public _handleChangeOthers = (type: any, value: any): void => {
        this.setState((prevState): any => ({
            formData: { ...prevState.formData, [type]: value }
        }), (): void => {
            this.props.Storage(this.state.formData)
            this.getDriver()
            if (this.state.formData.type === '101') {
                this.setState((prevState): any => ({
                    formData: {
                        ...prevState.formData,
                        port: '',
                        serverIp: '',
                        account: '',
                        password: ''
                    }
                }), (): void => {
                    this.props.Storage(this.state.formData)
                })
            }
        })
    }

    // 所有单选checkbox事件
    public _handleChangeCheckBox = (type: any, e: any): void => {
        const value = e.target.checked
        this.setState((prevState): any => ({
            formData: { ...prevState.formData, [type]: value }
        }), (): void => { this.props.Storage(this.state.formData) })
    }

    public _handleChangeInput1 = (e: any): void => {
        const value = e.target.value
        this.setState((): any => ({
            homeDirectory: value
        }), (): void => {
            this.props.homeDirectory(this.state.homeDirectory)
            console.log(this.state.homeDirectory)
        })
    }

    public onExpand = (keys: any, event: any): void => {
        console.log('Trigger Select', keys, event)
        console.log('Trigger Select', keys, event)
        this.setState((): any => ({
            homeDirectory: event.node.props.dataRef.parent
        }), (): void => {
            this.props.homeDirectory(this.state.homeDirectory)
            console.log(this.state.homeDirectory)
        })
    }

    public onLoadData = (treeNode: any): PromiseLike<void> => (
        new Promise((resolve): any => {
            if (treeNode.props.children) {
                resolve()
                return
            }
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
                    server_ip: this.state.server_ip,
                    server_port: this.state.server_port,
                    directory: this.state.homeDirectory
                }
            }
            _getDirectory(params).then((res: any): void => {
                if (res && res.result && res.data.directory_list !== null) {
                    // 盘符下面的文件夹
                    const directory = res.data.directory_list
                    // 所有数据
                    const dirve = res.data
                    console.log(dirve)
                    const data = JSON.parse(JSON.stringify(this.state.driver))
                    console.log(data)
                    const treedata = []
                    directory.forEach((item: any): void => {
                        treedata.push({ title: item.name, key: `${item.name}${Math.floor(Math.random() * 10000000)}`, parent: `${dirve.parent}${item.name}${route}` })
                    })
                    for (const item of data) {
                        console.log(dirve.parent)
                        console.log(item)
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
        this.setState((): any => ({
            homeDirectory: event.node.props.dataRef.parent
        }), (): void => {
            this.props.homeDirectory(this.state.homeDirectory)
            console.log(this.state.homeDirectory)
        })
        console.log(event.node.props.parent)
        console.log(event.node.props.title)
    }


    public render(): React.ReactElement {
        console.log(this.props.serverInfo)
        return (
            <div>
                <Tabs defaultActiveKey="1" onChange={callback}>
                    <Tabs.TabPane tab={intl.get('M26P102261011090100MC001').d('基本配置')} key="1">
                        <Row style={{ marginTop: '20px' }}>
                            <Col span={8}>{intl.get('M26P102261011090100ML009').d('存储类别')}</Col>
                            <Col span={16}>
                                <Select onChange={(e): void => { this._handleChangeOthers('type', e) }} value={this.state.formData.type} style={{ width: '100%' }}>
                                    {/* <Option value={101}>本地磁盘</Option>
                                    <Option value={201}>fTP提供空间</Option>
                                    <Option value={202}>SFTP提供空间</Option> */}
                                    {this.state.storageType && this.state.storageType.map((item): React.ReactElement => (<Select.Option value={item.valid_data} key={item.order_id}>{item.display_character}</Select.Option>))}
                                </Select>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>{intl.get('M26P102261011090100ML010').d('存储空间别名')}</Col>
                            <Col span={16}><Input onChange={(e): void => { this._handleChangeInput('alias', e) }} value={this.state.formData.alias} /></Col>
                        </Row>
                        {this.state.formData.type === '101' ?
                            <Row>
                                <Col span={8}>{intl.get('M26P102261011090100ML011').d('所在服务器')}</Col>
                                <Col span={16}>
                                    <Select style={{ width: '100%' }} onChange={(e): void => { this._handleChangeOthers('guid', e) }} value={this.state.formData.guid}>
                                        {this.props.serverInfo && this.props.serverInfo.map((item): React.ReactElement => (<Select.Option value={item.guid} key={item.guid}>{item.ipaddress}</Select.Option>))}
                                    </Select>
                                </Col>
                            </Row> :
                            <div>
                                <Row>
                                    <Col span={8}>{intl.get('M26P102261011090100ML004').d('IP')}</Col>
                                    <Col span={7}><Input onChange={(e): void => { this._handleChangeInput('serverIp', e) }} value={this.state.formData.serverIp} /></Col>
                                    <Col style={{ textAlign: 'center' }} span={3}>{intl.get('M26P102261011090100ML015').d('端口')}</Col>
                                    <Col span={6}><Input onChange={(e): void => { this._handleChangeInput('port', e) }} value={this.state.formData.port} /></Col>
                                </Row>
                                <Row>
                                    <Col span={8}>{intl.get('M26P102261011090100ML016').d('登录账号')}</Col>
                                    <Col span={7}><Input onChange={(e): void => { this._handleChangeInput('account', e) }} value={this.state.formData.account} /></Col>
                                    <Col style={{ textAlign: 'center' }} span={3}>{intl.get('M26P102261011090100ML017').d('登录密码')}</Col>
                                    <Col span={6}><Input type="password" onChange={(e): void => { this._handleChangeInput('password', e) }} value={this.state.formData.password} /></Col>
                                </Row>
                            </div>
                        }
                        {this.state.formData.type === '201' ?
                            <Row>
                                <Col span={8}>{intl.get('M26P102261011090100ML018').d('模式')}</Col>
                                <Col span={16}>
                                    <Select onChange={(e): void => { this._handleChangeOthers('pattern', e) }} value={this.state.formData.pattern} style={{ width: '100%' }}>
                                        {/* <Option value="1">主动</Option>
                                        <Option value="2">被动</Option> */}
                                        {this.state.patternData && this.state.patternData.map((item): React.ReactElement => (<Select.Option value={item.valid_data} key={item.order_id}>{item.display_character}</Select.Option>))}
                                    </Select>
                                </Col>
                            </Row> : null
                        }
                        <Row>
                            <Col span={24}>
                                <Checkbox checked={this.state.formData.availableCheck} onChange={(e): void => { this._handleChangeCheckBox('availableCheck', e) }}>{intl.get('M26P102261011090100ML008').d('启用可用性检测')}</Checkbox>
                            </Col>
                        </Row>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab={intl.get('M26P102261011090100MC003').d('存储目录配置')} key="2">
                        {/* <Row style={{ marginTop: '20px' }}>
                            <Col span={5}>存放目录:</Col>
                            <Col span={19}>
                                <Select style={{ width: '100%' }} onChange={(e): void => { this._handleChangeOthers('homeDirectory', e) }} value={this.state.formData.homeDirectory}>
                                    {this.state.Driver.map((item): React.ReactElement => (<Select.Option value={item.name} key={Math.floor(Math.random() * 10000)}>{item.name}</Select.Option>))}
                                </Select>
                            </Col>
                        </Row> */}
                        {this.state.formData.type === '201' || this.state.formData.type === '202' ?
                            <Row style={{ marginTop: '20px' }}>
                                <Col span={8}>{intl.get('M26P102261011090100ML014').d('存储目录')}</Col>
                                <Col span={16}><Input onChange={(e): void => { this._handleChangeInput1(e) }} value={this.state.homeDirectory} /></Col>
                            </Row> :
                            <div>
                                <div>
                                    {intl.get('M26P102261011090100ML013').d('选择路径')}
                                    {this.state.homeDirectory}
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


export default Storage
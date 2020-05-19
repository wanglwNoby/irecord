import * as React from 'react'
import { Tree } from 'antd'
import intl from 'react-intl-universal'
import { _getDriver, _getDirectory } from '../../../../common/api/siteManage'

class BasicInfo extends React.Component<any, any> {
    constructor(props: any) {
        super(props)
        this.state = {
            driver: [],
            parent: 'C:\\'
        }
    }

    public componentDidMount(): void {
        this.getDriver()
        console.log(this.props)
        console.log(this.props.dataInfo)
        if (this.props.editType === 2) {
            this.setState({
                parent: this.props.dataInfo.logpath
            })
        }
    }

    public onExpand = (keys: any, event: any): void => {
        console.log('Trigger Select', keys, event)
        if (event.node.props.dataRef.disk && event.node.props.dataRef.disk === '根目录') {
            this.setState((): any => ({
                parent: event.node.props.title
            }), (): void => {
                this.props.logRoute(this.state.parent)
            })
        } else {
            this.setState((): any => ({
                parent: event.node.props.parent
            }), (): void => {
                this.props.logRoute(this.state.parent)
            })
        }
    }

    public onSelect = (keys: any, event: any): void => {
        console.log('Trigger Select', keys, event)
        console.log(event.node.props.parent)
        if (event.node.props.dataRef.disk && event.node.props.dataRef.disk === '根目录') {
            console.log(event.node.props.title)
            console.log(event.node.props.parent)
            this.setState((): any => ({
                parent: event.node.props.title
            }), (): void => {
                this.props.logRoute(this.state.parent)
            })
        } else {
            this.setState((): any => ({
                parent: event.node.props.parent
            }), (): void => {
                this.props.logRoute(this.state.parent)
            })
        }
    }

    public onLoadData = (treeNode: any): PromiseLike<void> => (
        new Promise((resolve): any => {
            if (treeNode.props.children) {
                resolve()
                return
            }
            let route = ''
            if (this.state.parent.indexOf('/') > -1) {
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
                    directory: this.state.parent
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
                    const treedata = []
                    directory.forEach((item: any): void => {
                        treedata.push({ title: item.name, key: `${item.name}${Math.floor(Math.random() * 10000000)}`, parent: `${dirve.parent}${item.name}${route}` })
                    })
                    for (const item of data) {
                        if (dirve.parent === this.state.parent) {
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

    // 获取根目录
    public getDriver = async (): Promise<void> => {
        const params = {
            params: {
                server_ip: this.props.dataInfo.ipaddress,
                server_port: this.props.dataInfo.port
            }

        }
        const res: any = await _getDriver(params)
        if (res && res.result) {
            const treedata = []
            res.data.driver_list.forEach((item: any): void => {
                treedata.push({ title: item.name, key: `${item.name}`, parent: item.name, disk: '根目录' })
            })
            this.setState({
                driver: treedata
            })
        }
    }

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

    public render(): React.ReactElement {
        return (
            <div>
                <div>
                    {intl.get('M26P102261011090100ML013').d('选择路径')}
                    {this.state.parent}
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
        )
    }
}


export default BasicInfo
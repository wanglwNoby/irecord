import * as React from 'react'
import { connect } from 'react-redux'
import intl from 'react-intl-universal'
import { Menu, Icon } from 'antd'
import { addTab, setDefalutTab } from '../../../redux/actions/tabsAction'
import { _getLeftMenu } from '../../../common/api/global'
import styles from './leftMenu.module.less'

class LeftMenu extends React.PureComponent<any, any> {
    constructor(props: any) {
        super(props)
        this.state = {
            data: []
        }
    }

    public componentDidMount(): void {
        _getLeftMenu().then((res: any): void => {
            this.props.setDefaultTab('1022610110100000000', intl.get('FO1022610110100000000'))
            this.setState({
                data: res.data
            })
        })
    }

    public addTab = (id: string, name: string): void => {
        console.log(id, name)
        this.props.addTab(id, name)
    }

    public getIcon = (id: string): React.ReactElement => {
        switch (id) {
            case '1022610110100000000':
                return <Icon type="database" />
            case '1022610110300000000':
                return <Icon type="desktop" />
            case '1022610110500000000':
                return <Icon type="bar-chart" />
            case '1022610110900000000':
                return <Icon type="folder-open" />
            default:
                return null
        }
    }

    public renderMenu(data: any[]): React.ReactElement[] {
        const list: React.ReactElement[] = []
        data.forEach((item: any): void => {
            if (item.children.length > 0) {
                list.push(
                    <Menu.SubMenu
                        key={item.id}
                        title={
                            <span>
                                {this.getIcon(item.id)}
                                <span>{item.name}</span>
                            </span>
                        }
                    >
                        {this.renderMenu(item.children)}
                    </Menu.SubMenu>
                )
            } else {
                list.push(
                    <Menu.Item key={item.id} onClick={(): void => { this.addTab(item.id, item.name) }}>
                        {this.getIcon(item.id)}
                        <span>{item.name}</span>
                    </Menu.Item>
                )
            }
        })
        return list
    }

    public render(): React.ReactElement {
        return (
            <div className={`${styles.leftMenu} menu`}>
                <div className={`${styles.menuTitle} menuTitle`}>
                    <Icon type="appstore" />
                    <span style={{ marginLeft: 8 }}>{intl.get('COM10100000010002')}</span>
                </div>
                <Menu
                    mode="inline"
                    theme={this.props.theme}
                    className={styles.menu}
                >
                    {this.renderMenu(this.state.data)}
                </Menu>
            </div>
        )
    }
}

const mapStateToProps = (state: any): IMapStateToProps => ({
    theme: state.themeReducer.theme
})
const mapDispatchToPros = (dispatch: any): any => ({
    addTab: (id: string, name: string): void => { dispatch(addTab(id, name)) },
    setDefaultTab: (id: string, name: string): void => { dispatch(setDefalutTab(id, name)) }
})

export default connect(mapStateToProps, mapDispatchToPros)(LeftMenu)
import * as React from 'react'
import { connect } from 'react-redux'
import { Menu } from 'antd'
import intl from 'react-intl-universal'
import styles from './rightOperation.module.less'

interface IProps {
    theme?: any;
    rightOperationData: any;
    operateCallBack: (id: any) => void;
}

class RightOperation extends React.PureComponent<IProps, any> {
    constructor(props: IProps) {
        super(props)
        this.state = {}
    }

    public clickRow = (data: any): void => {
        this.props.operateCallBack(data)
    }

    public renderMenu(data: any[]): React.ReactElement[] {
        const list: React.ReactElement[] = []
        data.forEach((item: any): void => {
            if (item.children && item.children.length > 0) {
                list.push(
                    <Menu.SubMenu
                        key={item.P000}
                        title={
                            <span>{item.P001}</span>
                        }
                    >
                        {this.renderMenu(item.children)}
                    </Menu.SubMenu>
                )
            } else {
                list.push(
                    <Menu.Item key={item.P000} onClick={this.clickRow.bind(this, item)}>
                        <span>{item.P001}</span>
                    </Menu.Item>
                )
            }
        })
        return list
    }

    public render(): React.ReactElement {
        return (
            <div className={`${styles.rightOperation} menu`}>
                <div className={`${styles.menuTitle} menuTitle`}>
                    {intl.get('COM10100000010003').d('操作')}
                </div>
                <Menu
                    theme={this.props.theme}
                    className={styles.menu}
                    mode="inline"
                >
                    {this.renderMenu(this.props.rightOperationData)}
                </Menu>
            </div>
        )
    }
}

const mapStateToProps = (state: any): IMapStateToProps => ({
    theme: state.themeReducer.theme
})

export default connect(mapStateToProps, null)(RightOperation)
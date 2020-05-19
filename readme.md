# 项目文件夹树
|--assets // 资源，静态
  |--images    //  存放图片
|--common // 公共类
  |--api    //  存放axios请求接口
  |--styles //  存放皮肤样式
|--views（pages）// 展示的页面
  |--页面1
|--components // 具体到页面的组件，头部，尾部，导航栏等等
  |--cores // 重要组件,核心组件
    |--主组件1
  |--containers // 容器组件
    |--容器组件1
  |--组件1 // 其他组件
  |--组件2
|--utils //工具类
|--types // typeScript类型检查,主要服务于common/api,与之命名必须一致
|--redux // 状态管理
  |--actions 
  |--reducers
|--router // 路由,未用到


# ant-modal挂载方法
1.import CustomModal from '../../components/customModal/customModal'
2.指定container, ref={(container) => { this.container = container }},并且指定container的position: relative;
3.增加getContainer={this.container}属性;

# 主题皮肤设置
在public/color.less文件中找到控制该元素的颜色属性，然后
    vars = Object.assign({}, '此处为需要配置的颜色属性', JSON.parse(localStorage.getItem('theme')))   
    const win: any = window
    win.less.modifyVars(vars).then(() => {
        message.success('主题设置成功')
    }).catch((error: any) => {
        message.error('主题设置失败', error)
    })
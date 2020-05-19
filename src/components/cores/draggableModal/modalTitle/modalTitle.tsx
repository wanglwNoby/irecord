import * as React from 'react'
import logo from '../../../../assets/images/logo.png'

interface IProps {
    title: string;
}

class ModalTitle extends React.Component<IProps, any> {
    public position = {
        modalWidth: 0, // modal宽高
        modalHeight: 0,
        modalInitialX: 0, // 初始弹窗content的坐标距离X，Y
        modalInitialY: 0,
        mousedownX: 0, // 鼠标mousedown时在modalTitle里的相对偏移X，Y
        mousedownY: 0,
        translateX: 0, // 偏移量
        translateY: 0,
        beforeTranslateX: 0, // 上次移动时留下的偏移量
        beforeTranslateY: 0
    }

    public componentDidMount(): void {
        const antModalHeader = document.querySelectorAll('.ant-modal-header')[0]
        antModalHeader.addEventListener('mousedown', this.mousedown)
        document.addEventListener('mouseup', this.mouseup)
    }

    public componentWillUnmount(): void {
        const antModalHeader = document.querySelectorAll('.ant-modal-header')[0]
        if (antModalHeader) {
            antModalHeader.removeEventListener('mousedown', this.mousedown)
            document.removeEventListener('mouseup', this.mouseup)
        }
    }

    public mousedown = (e: any): void => {
        if (e.button === 0) {
            const antModal = document.querySelectorAll('.ant-modal')[0]
            const antModalPosition = antModal.getBoundingClientRect()
            this.position.modalWidth = antModalPosition.width
            this.position.modalHeight = antModalPosition.height
            this.position.modalInitialX = antModalPosition.left
            this.position.modalInitialY = antModalPosition.top
            this.position.mousedownX = e.clientX - this.position.modalInitialX
            this.position.mousedownY = e.clientY - this.position.modalInitialY
            document.addEventListener('mousemove', this.mousemove)
        }
    }

    public mousemove = (e: any): void => {
        const translateX = e.clientX - this.position.modalInitialX - this.position.mousedownX + this.position.beforeTranslateX
        const translateY = e.clientY - this.position.modalInitialY - this.position.mousedownY + this.position.beforeTranslateY
        // 限制x范围
        if (translateX + this.position.modalInitialX - this.position.beforeTranslateX <= 0) {
            this.position.translateX = this.position.beforeTranslateX - this.position.modalInitialX
        } else if (translateX + this.position.modalInitialX + this.position.modalWidth - this.position.beforeTranslateX >= document.documentElement.clientWidth) {
            this.position.translateX = document.documentElement.clientWidth - this.position.modalInitialX - this.position.modalWidth + this.position.beforeTranslateX
        } else {
            this.position.translateX = translateX
        }
        // 限制y范围
        if (translateY + this.position.modalInitialY - this.position.beforeTranslateY <= 0) {
            this.position.translateY = this.position.beforeTranslateY - this.position.modalInitialY
        } else if (translateY + this.position.modalInitialY + this.position.modalHeight - this.position.beforeTranslateY >= document.documentElement.clientHeight) {
            this.position.translateY = document.documentElement.clientHeight - this.position.modalInitialY - this.position.modalHeight + this.position.beforeTranslateY
        } else {
            this.position.translateY = translateY
        }
        const antModal = document.querySelectorAll('.ant-modal') as NodeListOf<HTMLElement>
        antModal[0].style.transform = `translate(${this.position.translateX}px,${this.position.translateY}px)`
    }

    public mouseup = (): void => {
        this.position.beforeTranslateX = this.position.translateX
        this.position.beforeTranslateY = this.position.translateY
        document.removeEventListener('mousemove', this.mousemove)
    }

    public render(): React.ReactElement {
        return (
            <React.Fragment>
                <img src={logo} alt="eMP" style={{ height: 22, marginBottom: 2 }} />
                <span style={{ marginLeft: '5px' }}>{this.props.title}</span>
            </React.Fragment>
        )
    }
}

export default ModalTitle
declare module '*.svg'
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.gif'
declare module '*.bmp'
declare module '*.tiff'
declare module '*.module.less' {
    const classes: { [key: string]: string }
    export default classes
}

// mapStateToProps
interface IMapStateToProps {
    [key: string]: any;
}

// mapDispatchToProps
interface IMapDispatchToProps {
    [key: string]: ([key]: any) => any;
}
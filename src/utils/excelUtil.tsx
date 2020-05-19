import XLSX from 'xlsx'

// 导入excel
function importExcel(file: any): void {
    // 获取上传的文件对象
    const { files } = file.target
    // 通过FileReader对象读取文件
    const fileReader = new FileReader()
    fileReader.onload = (event: any): void => {
        try {
            const { result } = event.target
            // 以二进制流方式读取得到整份excel表格对象
            const workbook = XLSX.read(result, { type: 'binary' })
            let data = [] // 存储获取到的数据
            // 遍历每张工作表进行读取（这里默认只读取第一张表）
            for (const sheet in workbook.Sheets) {
                if (workbook.Sheets.hasOwnProperty(sheet)) {
                    // 利用 sheet_to_json 方法将 excel 转成 json 数据
                    data = data.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]))
                    // break; // 如果只取第一张表，就取消注释这行
                }
            }
            console.log(data)
        } catch (e) {
            // 这里可以抛出文件类型错误不正确的相关提示
            console.log('文件类型不正确')
        }
    }
    // 以二进制方式打开文件
    fileReader.readAsBinaryString(files[0])
}

// // dataUrl为base64编码
// function dataURLtoFile(dataUrl: string): any {
//     const arr = dataUrl.split(',')
//     const mime = arr[0].match(/:(.*?);/)[1]
//     const bstr = atob(arr[1])
//     let n = bstr.length
//     const u8arr = new Uint8Array(n)
//     while (n) {
//         u8arr[n] = bstr.charCodeAt(n)
//         n -= 1
//     }
//     return new Blob([u8arr], { type: mime })
// }

// 导出excel
function exportExcel(headers: any[], data: any[], fileName: string, picture?: string): void {
    let lineNum = 1
    let _picHeader = {}
    let _picData = {}
    if (picture) {
        _picHeader = {
            B1: { v: '图片名称', s: 'center' }
        }
        _picData = {
            A4: { v: '此处为图片' }
        }
        lineNum = 21
    }

    const _headers = headers
        .map((item, i): any => Object.assign({}, { key: item.key, title: item.title, position: String.fromCharCode(65 + i) + lineNum }))
        .reduce((prev, next): any => Object.assign({}, prev, { [next.position]: { key: next.key, v: next.title } }), {})
    console.log(_headers)
    const _data = data
        .map((item, i): any => headers.map((key, j): any => Object.assign({}, { content: item[key.key], position: String.fromCharCode(65 + j) + (i + lineNum + 1) })))
        // 对刚才的结果进行降维处理（二维数组变成一维数组）
        .reduce((prev, next): any => prev.concat(next))
        // 转换成 worksheet 需要的结构
        .reduce((prev: any, next: any): any => Object.assign({}, prev, { [next.position]: { v: next.content } }), {})
    console.log(_data)
    // 合并 headers 和 data
    const output = Object.assign({}, _picHeader, _picData, _headers, _data)
    console.log(output)
    // 获取所有单元格的位置
    const outputPos = Object.keys(output)
    console.log(outputPos)
    // 计算出范围 ,["A1",..., "H2"]
    const ref = `${outputPos[0]}:${outputPos[outputPos.length - 1]}`
    console.log(ref)
    // 构建 workbook 对象
    const wb = {
        SheetNames: ['mySheet'],
        Sheets: {
            mySheet: Object.assign(
                {},
                output,
                {
                    '!ref': ref,
                    '!cols': [{ wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }],
                    '!merges': picture && [
                        { s: { c: 1, r: 0 }, e: { c: 6, r: 1 } },
                        { s: { c: 0, r: 3 }, e: { c: 7, r: 18 } }
                    ]
                }
            )
        }
    }

    // 导出 Excel
    XLSX.writeFile(wb, fileName, { type: 'base64' })
}
export default { importExcel, exportExcel }
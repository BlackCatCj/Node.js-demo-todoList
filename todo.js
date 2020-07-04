
var fs = require('fs'); //file system 文件系统 声明后可以进行文件读写操作

// verb 操作名称   process.argv就是获取node的内容
// process.argv[0]是node.exe的安装目录
// process.argv[1]是当前项目的目录
// const 表示变量不能变更
const verb = process.argv[2]
// content 任务内容  node todo add 吃饭  命令中的 吃饭 就是content的值
// node todo delete 2   命令中的 2 就是content的值
const content = process.argv[3]
const content2 = process.argv[4]



// 优化重复代码部分

// 注意这里路径要用\\ 因为\是字符转义，会让路径出错，所以要用\\表示\
// db 数据库  是没有后缀的
// Sync是同步的意思  writeFileSync就是以同步的方式写入文件（没有则新建一个文件）
const dbPath = 'D:\\VSCodeProject\\Node-demo\\db'

// 保存到数据库db
function save(list) {
    // JSON序列化  JSON.stringify(list)把list数组序列化为字符串
    // 之所以要把数组序列化为字符串，是因为如果不序列化，而是使用list.toString()存入db文件,那文件中的就是个单纯的字符串
    // 序列化后的存入的则是、数组的样式的字符串
    // list.toString()——>工作1    JSON.stringify(list)——>['工作1']
    fs.writeFileSync(dbPath, JSON.stringify(list)) //保存到数据库
}

// 读取数据库db
function fetch() {
    // 一个list数组充当任务列表
    // 首先先读取db中已有的数据，存入list中，以免内容被覆盖
    const readFileContent = fs.readFileSync(dbPath).toString()
    const list = JSON.parse(readFileContent); //反序列化 将字符串转成数组
    return list
}

// 展示list清单
function display(list) {
    console.log(list) // 打印出list清单
}

// 向list中添加数据
function addContent(list, content) {
    list.push([content, '未完成'])
}

// 删除list中数据
function removeContent(list, n) {
    // 对于我们来说的第一项，在数组里是第0项，所以n-1
    list.splice(n - 1, 1) //n-1表示开始删除的位置是第0个位置   1表示删除一个
}

// 标记任务完成情况
function markContentDone(list, n) {
    //list[n-1]表示数组的第几项  list[n - 1][1]后面的[1]表示[ '吃饭', '已完成' ]中的第二项，即已完成这个值
    list[n - 1][1] = '已完成'
}

// 修改任务
function editContent(list, n, newContent) {
    list[n - 1][0] = newContent
}
// 优化重复代码部分



switch (verb) {
    case 'add':
        // 检查db数据文件是否存在，不存在则新建一个
        fs.access(dbPath, (err) => {
            if (err) {
                fs.writeFileSync(dbPath, '')
                // 这里不能用读取文件的形式，因为读取的是反序列化后的list，而此时db为空，不是['abc']这种形式，会报错
                // 所以这里直接用数组形式
                const list = []
                addContent(list, content)
                save(list)
                display(list)

            } else {
                list = fetch()
                // 把task数组添加进list列表中 因为list是数组，所以只有数组能push进去，字符串不行
                addContent(list, content)  //将每次存进list的数据后加上 未完成
                save(list)

                display(list)
            }
        });
        break;
    case 'done':
        list = fetch()
        //content就是我们输入的 node todo delete 1 的这个1
        markContentDone(list, content)
        display(list)
        save(list)
        break;
    case 'delete':
        list = fetch()
        //content就是我们输入的 node todo delete 1 的这个1 
        removeContent(list, content)
        display(list)
        save(list)
        break;
    case 'edit':
        list = fetch()
        //content就是我们输入的 node todo delete 1 的这个1
        //content2就是我们输入的第二个参数
        editContent(list, content, content2)
        display(list)
        save(list)
        break;
    case 'list':
        list = fetch()
        display(list)
        break;
    default:
        console.log('你想干什么？')
        break;
}

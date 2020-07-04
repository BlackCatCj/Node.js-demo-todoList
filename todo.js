
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

// 读取数据库db的内容
function fetch() {
    // 一个list数组充当任务列表
    // 首先先读取db中已有的数据，存入list中，以免内容被覆盖
    const readFileContent = fs.readFileSync(dbPath).toString()
    let list   //这里不能用const声明，因为const必须赋值，let不用
    try {
        //这种写法是兜底值，意思是当前面的反序列化出错（文件为空时就没法反序列化），那么就赋值list为[]空数组
        list = JSON.parse(readFileContent) || []
    } catch (error) {  //如果出错则将list赋值为[]空数组
        list = []
    }
    //反序列化 将字符串转成数组

    return list
}

// 展示list清单
function display(list) {
    console.log(list) // 打印出list清单
}

// 向list中添加数据
function addContent(list, content) {
    // 把content数组添加进list列表中 因为list是数组，所以只有数组能push进去，字符串不行
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

// 检查db数据文件是否存在，不存在则新建一个
// try——>尝试运行代码，报错则运行catch中的代码
try {
    fs.statSync(dbPath)
} catch (error) {
    fs.writeFileSync(dbPath, '')
}
// 运行完try之后，db文件必定已经存在


//提前声明，防止后面重复声明list
//提前运行fetch()函数，读取数据给list，减少每项操作的重复动作
const list = fetch()



switch (verb) {
    case 'add':

        addContent(list, content)  //将每次存进list的数据后加上 未完成


        break;
    case 'done':

        //content就是我们输入的 node todo delete 1 的这个1
        markContentDone(list, content)


        break;
    case 'delete':

        //content就是我们输入的 node todo delete 1 的这个1 
        removeContent(list, content)


        break;
    case 'edit':

        //content就是我们输入的 node todo delete 1 的这个1
        //content2就是我们输入的第二个参数
        editContent(list, content, content2)


        break;
    case 'list':


        break;
    default:
        console.log('你想干什么？')
        break;
}

// 执行完操作后对list数据进行展示
display(list)
// 执行完操作后对list数据进行保存
if (verb !== 'list') {  //因为list操作只是展示，不需要保存
    save(list)
}


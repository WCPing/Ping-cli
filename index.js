const program = require('commander') // 控制台工具
const chalk = require('chalk') // 美化工具
const Inquirer = require('inquirer') // 命令行交互
// const ora = require('ora') // 命令行加载loading效果 ora
const figlet = require('figlet') // 控制台打印艺术字效果

program
.command('create <project-name>')
.description('create a new project')
.option('-f --force', 'overwrite target directory if it exists') // 强制覆盖
.action((projectName, cmd) => {
    // 处理输入的create指令的附加参数
    console.log(projectName, cmd);
    require('./lib/create')(projectName, cmd)
})

program.on('--help', function() {
    console.log(
        '\r\n' + 
        figlet.textSync('Ping-cli', {
            font: '3D-ASCII',
            horizontalLayout: 'default',
            verticalLayout: 'default',
            width: 100,
            whitespaceBreak: true
        })
    );
    // 前后两个空行调整格式，更舒适
    console.log();
    console.log(
        `Run ${chalk.cyan(
            'Ping-cli <command> --help'
        )} for detailed usage of given command`
    );
    console.log();
})

program
.name('Ping-cli')
.usage('<command> [option]')
.version( `Ping-cli ${require('./package.json').version}`)

program.parse(process.argv);
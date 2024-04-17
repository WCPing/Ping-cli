#!/usr/bin/env node

// 使用Node开发命令行工具所执行的Javascript脚本必须在顶部加入#!/usr/bin/env node声明

const program = require('commander')
const download = require('download-git-repo')
const handlebars = require('handlebars')
const inquirer = require('inquirer')
const fs = require('fs')
const ora = require('ora') // 载入loading样式
const chalk = require('chalk') // 文本样式 颜色
const logSymbols = require('log-symbols') // 模板符号

const templates = {
	'tpla': {
		url: 'https://github.com/WCPing/tlpa',
		downloadUrl: 'direct:https://github.com/WCPing/tlpa.git',
		description: '模板a'
	},
	'tplb': {
		url: 'https://github.com/WCPing/tplb',
		downloadUrl: 'direct:https://github.com/WCPing/tplb.git',
		description: '模板b'
	}

}
program
  .version('0.1.0'); // -V 或者--version

program
  .command('init <templateName> <projectName>')
  .description('初始化项目模板')
  .action((templateName, projectName) =>{
  	// 下载之前做loading提示
  	const spinner = ora('正在下载模板...').start();
  	// download 第一个参数： 仓库url, 第二个参数： 下载路径
  	const { downloadUrl } = templates[templateName]
  	download(downloadUrl, projectName, { clone: true }, (err) => {
  		if (err) {
  			spinner.fail() // 下载失败提示
  			console.log(logSymbols.error, chalk.red(err))
  			return
  			// return console.log('下载失败', err)
  		}
  		spinner.succeed() // 下载成功提示
  		// 把项目下的package.json读取出来
  		// 使用向导方式采集用户的输入的值
  		// 使用模板引擎把用户输入的数据解析到package.json文件中
  		// 解析完毕， 重写到package.json文件中
  		inquirer.prompt([{
  			type: 'input',
  			name: 'name',
  			message: '请输入项目名称'
  		}, {
  			type: 'input',
  			name: 'description',
  			message: '请输入项目简介'
  		}, {
  			type: 'input',
  			name: 'author',
  			message: '请输入作者'
  		}]).then((answers) => {
  			const packagePath = `${projectName}/package.json`
  			const packageContent = fs.readFileSync(packagePath, 'utf8')
  			const packageResult = handlebars.compile(packageContent)(answers)
  			fs.writeFileSync(packagePath, packageResult)
  			console.log(logSymbols.success, chalk.green('初始化模板成功'))

  		})
  	})
    
  });

 program
  .command('list')
  .description('查看可用模板')
  .action(() =>{
  	for(let key in templates) {
  		console.log(`${key}`, `${templates[key].description}`)
  	}
  });

program.parse(process.argv);
const Inquirer = require('inquirer')
const download = require('download-git-repo')
const chalk = require('chalk')
const path = require('path')
const { loading } = require('./util')

class Template {
    constructor(name, target) {
        this.name = name
        this.target = target
        this.templateOptions = ['tpla', 'tplb']
        this.templates = {
            tpla: {
                url: 'https://github.com/WCPing/uniAppMPTemp',
                downloadUrl:
                    'direct:https://github.com/WCPing/uniAppMPTemp.git',
                description: '模板a',
            },
            tplb: {
                url: 'https://github.com/WCPing/uniAppMPTemp',
                downloadUrl:
                    'direct:https://github.com/WCPing/uniAppMPTemp.git',
                description: '模板b',
            },
        }
    }

    async create() {
        let temp = await this.getRepoInfo()
        // 下载末班
        await this.downloadTemp(temp)
        console.log(`\r\nSuccessfully created project ${chalk.cyan(this.name)}`)
        console.log(`\r\n  cd ${chalk.cyan(this.name)}`)
        console.log('  npm install')
        console.log('  npm run serve\r\n')
    }

    // 获取用户选取的模板
    async getRepoInfo() {
        let { temp } = await new Inquirer.prompt([
            {
                name: 'temp',
                type: 'list',
                message: 'please choose a template to ceate project',
                choices: this.templateOptions,
            },
        ])
        return temp
    }

    async downloadTemp(temp) {
        const templateUrl = this.templates[temp].downloadUrl
        await loading(
            'downloading template, please wait',
            download,
            templateUrl,
            this.name,
            { clone: true },
            (res) => {
                console.log(res)
            }
        )
    }
}

module.exports = Template
const path = require('path')
const fs = require('fs-extra')
const Inquirer = require('inquirer')
const Template = require('./template')
const { loading } = require('./util')

module.exports = async function (projectName, options) {
    // 获取当前工作目录
    const cwd = process.cwd()
    const targetDirectory = path.join(cwd, projectName)

    if (fs.existsSync(targetDirectory)) {
        // 强制覆盖为真
        if (options.force) {
            // 删除同名目录
            await fs.remove(targetDirectory)
        } else {
            const { isOverwrite } = new Inquirer.prompt([
                // 返回值为promise
                {
                    name: 'isOverwrite',
                    type: 'list',
                    message:
                        'Targer directory exists, Do you want to overwrite the folder?',
                    choices: [
                        { name: 'Overwrite', value: true },
                        { name: 'Cancel', value: false },
                    ],
                },
            ])
            if (!isOverwrite) {
                // 不覆盖， 取消进程
                console.log('Cancel')
                return
            } else {
                await loading(
                    `Removing ${projectName}, please wait a moment`,
                    fs.remove,
                    targetDirectory
                )
            }
        }
    }

    // 创建项目
    const template = new Template(projectName, targetDirectory)
    template.create()
}

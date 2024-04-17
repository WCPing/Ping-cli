const ora = require('ora')

/**
 * 睡觉函数
 */
const sleep = (n) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, n)
    })
}

/**
 * 加载效果
 */
async function loading(messgae, fn, ...args) {
    const spinner = ora(messgae);
    spinner.start(); // 开启加载
    try {
        let executeRes = await fn(...args)
        spinner.succeed();
        return executeRes;
    } catch (error) {
        spinner.fail('Request failed, Retry')
        await sleep(1000)
        return loading(messgae, fn, ...args)
    }
}

module.exports = {
    loading,
}
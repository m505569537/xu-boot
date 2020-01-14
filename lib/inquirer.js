// 问询
const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')
const symbols = require('log-symbols')
const chalk = require('chalk')

module.exports = async (args) => {
    const initPath = path.join(__dirname, '../../')
    let info = {}
    const dirList_1 = fs.readdirSync(initPath).filter(item => {
        let stat = fs.lstatSync(path.join(initPath, item))
        return stat.isDirectory()
    });
    let dirList_2

    const noArgs = async (menu) => {
        let temInfo = {}
        let temSec = {}
        temInfo = await inquirer.prompt([
            {
                type: 'list',
                name: 'first-stage',
                description: '第一级目录',
                choices: menu,
                default: menu[0]
            }
        ])
        let firPath = path.join(__dirname, `../../${temInfo["first-stage"]}`)
        dirList_2 = fs.readdirSync(firPath).filter(item => {
            let stat = fs.lstatSync(path.join(firPath, item))
            return stat.isDirectory()
        })
        if(dirList_2.length == 0) {
            console.log(symbols.error, chalk.red('该目录为空'));
            process.exit(1)
        }
        if(args.length == 0 || args.length == 1) {
            let sec = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'sec-stage',
                    description: '第二级目录',
                    choices: dirList_2,
                    default: dirList_2[0]
                }
            ])
            temInfo['sec-stage'] = sec['sec-stage']
        } else if(args.length == 2) {
            temSec = await getSec(firPath)
        }
        temInfo = { ...temInfo, ...temSec }
        return temInfo
    }

    const getSec = async (firPath) => {
        let temInfo = {}
        dirList_2 = fs.readdirSync(firPath).filter(item => {
            let stat = fs.lstatSync(path.join(firPath, item))
            return stat.isDirectory()
        })
        if(dirList_2.length == 0) {
            console.log(symbols.error, chalk.red('该目录为空'));
            process.exit(1)
        }
        let curDir = dirList_2.filter(dir => dir.toLowerCase().indexOf(args[1].toLowerCase())!== -1)
        if(curDir.length == 0) {
            console.log(symbols.error, chalk.red('无效二级目录，请选择'));
            let sec = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'sec-stage',
                    description: '第二级目录',
                    choices: dirList_2,
                    default: dirList_2[0]
                }
            ])
            temInfo['sec-stage'] = sec['sec-stage']
        } else if(curDir.length == 1) {
            console.log(chalk.green(`当前路径为${path.join(firPath, curDir[0])}/`));
            temInfo['sec-stage'] = curDir[0]
        } else {
            let sec = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'sec-stage',
                    description: '第二级目录',
                    choices: curDir,
                    default: curDir[0]
                }
            ])
            temInfo['sec-stage'] = sec['sec-stage']
        }
        return temInfo
    }

    if(args.length == 0) {
        console.log(chalk.green(`当前目录为${initPath}`));
        info = noArgs(dirList_1)
    } else if(args.length == 1) {
        // 默认一个参数，表示一级目录，默认路径为/web/
        const dirPathComplete = dirList_1.filter(dir => dir.toLowerCase().indexOf(args[0].toLowerCase())!== -1)
        if(dirPathComplete.length === 0) {
            console.log(symbols.error, chalk.red('无效路径，请选择'));
            info = noArgs(dirList_1)
        } else if(dirPathComplete.length === 1) {
            info['first-stage'] = dirPathComplete[0]
            const firPath = path.join(__dirname, `../../${dirPathComplete[0]}`)
            console.log(chalk.green(`当前路径为${firPath}/`));
            dirList_2 = fs.readdirSync(firPath).filter(item => {
                let stat = fs.lstatSync(path.join(firPath, item))
                return stat.isDirectory()
            })
            let sec = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'sec-stage',
                    description: '第二级目录',
                    choices: dirList_2,
                    default: dirList_2[0]
                }
            ])
            info['sec-stage'] = sec['sec-stage']
        } else {
            info = noArgs(dirPathComplete)
        }
    } else if(args.length == 2) {
        const dirPathComplete = dirList_1.filter(dir => dir.toLowerCase().indexOf(args[0].toLowerCase())!== -1)
        if(dirPathComplete.length === 0) {
            console.log(symbols.error, chalk.red('无效路径，请选择'));
            info = noArgs(dirList_1)
        } else if(dirPathComplete.length === 1) {
            info['first-stage'] = dirPathComplete[0]
            const firPath = path.join(__dirname, `../../${dirPathComplete[0]}`)
            let tem = await getSec(firPath)
            info = { ...info, ...tem }
        } else {
            info = noArgs(dirPathComplete)
        }
    } else {
        console.log(symbols.error, chalk.red('参数不能超过2个'));
    }
    return info
}
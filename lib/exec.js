const fs = require('fs')
const path = require('path')
const cp = require('child_process')
const symbols = require('log-symbols')
const chalk = require('chalk')
const ora = require('ora')

module.exports = async (info) => {
    const initPath = path.join(__dirname, '../../')
    const curPath = path.join(initPath, info && info['first-stage'], info && info['sec-stage'])
    let list = fs.readdirSync(curPath)
    if(list.indexOf('package.json') !== -1) {
        fs.readFile(path.join(curPath, '/package.json'), async (err, data) => {
            if(err) throw err
            let _data = JSON.parse(data.toString())
            let scripts = _data.scripts
            const spinner = ora('正在启动任务...')
            if(scripts.server) {
                // 启动数据库
                // 方法一: 使用terminal
                // cp.exec('open ~/desktop/mongod.sh', err => {
                //     if(!err) {
                //         // 启动服务端
                //         cp.exec(`osascript -e 'tell app "Terminal"
                //         do script "cd ${curPath} && yarn server"
                //         end tell'`, error => {
                //             if(!error) {
                //                 // 启动前端
                //                 if(scripts.start){
                //                     cp.exec(`osascript -e 'tell app "Terminal"
                //                     do script "cd ${curPath} && yarn start"
                //                     end tell'`, err => {
                //                         if(!err) {
                //                             spinner.succeed()
                //                             console.log(symbols.success, chalk.green('任务启动成功'));
                //                         } else {
                //                             spinner.fail()
                //                             console.log(symbols.error, chalk.red('任务启动失败'));
                //                         }
                //                     })
                //                 } else {
                //                     cp.exec(`osascript -e 'tell app "Terminal"
                //                     do script "cd ${curPath} && yarn dev"
                //                     end tell'`, err => {
                //                         if(!err) {
                //                             spinner.succeed()
                //                             console.log(symbols.success, chalk.green('任务启动成功'));
                //                         } else {
                //                             spinner.fail()
                //                             console.log(symbols.error, chalk.red('任务启动失败'));
                //                         }
                //                     })
                //                 }
                //             } else {
                //                 spinner.fail()
                //                 console.log(symbols.error, chalk.red('任务启动失败'));
                //             }
                //         })
                //     } else {
                //         spinner.fail()
                //         console.log(symbols.error, chalk.red('任务启动失败'));
                //     }
                // })
                // 方法二: 使用iterm
                cp.exec('open ~/desktop/mongod.sh', err => {
                    if(!err) {
                        // 启动服务器
                        cp.exec(`osascript -e 'tell app "iterm"
                        activate
                        tell current window
                        create tab with default profile
                        end tell
                        tell current session of current tab of current window
                        write text "cd ${curPath}"
                        write text "yarn server"
                        end tell
                        end tell'`, err => {
                            if(!err) {
                                // 启动客户端
                                cp.exec(`osascript -e 'tell app "iterm"
                                activate
                                tell current window
                                create tab with default profile
                                end tell
                                tell current session of current tab of current window
                                write text "cd ${curPath}"
                                write text "yarn start"
                                end tell
                                end tell'`, err => {
                                    if(!err) {
                                        spinner.succeed()
                                        console.log(symbols.success, chalk.green('任务启动成功'));
                                    } else {
                                        spinner.fail()
                                        console.log(symbols.error, chalk.red('任务启动失败'));
                                    }
                                })
                            } else {
                                spinner.fail()
                                console.log(symbols.error, chalk.red('任务启动失败'));
                            }
                        })
                    } else {
                        spinner.fail()
                        console.log(symbols.error, chalk.red('任务启动失败'));
                    }
                })
            } else {
                if(scripts.dev) {
                    cp.exec(`osascript -e 'tell app "iterm"
                    activate
                    tell current window
                    create tab with default profile
                    end tell
                    tell current session of current tab of current window
                    write text "cd ${curPath}"
                    write text "npm run dev"
                    end tell
                    end tell'`, err => {
                        if(!err) {
                            spinner.succeed()
                            console.log(symbols.success, chalk.green('任务启动成功'));
                        }  else {
                            spinner.fail()
                            console.log(symbols.error, chalk.red('任务启动失败'));
                        }
                    })
                } else {
                    cp.exec(`osascript -e 'tell app "iterm"
                    activate
                    tell current window
                    create tab with default profile
                    end tell
                    tell current session of current tab of current window
                    write text "cd ${curPath}"
                    write text "npm run start"
                    end tell
                    end tell'`, err => {
                        if(!err) {
                            spinner.succeed()
                            console.log(symbols.success, chalk.green('任务启动成功'));
                        } else {
                            spinner.fail()
                            console.log(symbols.error, chalk.red('任务启动失败'));
                        }
                    })
                }
            }
        })
    }
    console.log(chalk.green(`当前路径为：${curPath}`));
}
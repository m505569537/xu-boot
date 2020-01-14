const program = require('commander')

const inquirerFn = require('./inquirer')
const execFn = require('./exec')

module.exports = async () => {
    program
        .version('1.0.0', '-v, --version')
        .usage('[options] [name]')
        .parse(process.argv)
    
    const info = await inquirerFn(program.args)
    if(info && JSON.stringify(info) !== '{}') {
        await execFn(info)
    }
}
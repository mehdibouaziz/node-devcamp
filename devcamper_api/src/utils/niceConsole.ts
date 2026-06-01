import chalk from "chalk";

const info = (...args: string[]) => {
    console.log(chalk.blue(`i ${args.join(' ')}`))
}

const warning = (...args: string[]) => {
    console.log(chalk.yellow(`! ${args.join(' ')}`))
}

const error = (...args: string[]) => {
    console.log(chalk.bgRed(`x ${args.join(' ')}`))
}

const success = (...args: string[]) => {
    console.log(chalk.green(`+ ${args.join(' ')}`))
}

const text = (...args: string[]) => {
    console.log(`> ${args.join(' ')}`)
}

const log = {
    info,
    warning,
    error,
    success,
    text
}

export default log;
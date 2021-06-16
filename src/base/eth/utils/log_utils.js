import chalk from 'chalk';
import * as _ from 'lodash';
const DEFAULT_TERMINAL_WIDTH = 80;
const TERMINAL_WIDTH = _.get(process, 'stdout.columns') || DEFAULT_TERMINAL_WIDTH;
export const logUtils = {
    log(...args) {
        console.log(...args);
    },
    header(text, padStr = '=') {
        const padLength = TERMINAL_WIDTH - text.length;
        const padLengthEnd = (padLength + 1) / 2;
        const leftPadded = text.padStart(TERMINAL_WIDTH - padLengthEnd, padStr);
        const padded = leftPadded.padEnd(TERMINAL_WIDTH, padStr);
        console.log(padded);
    },
    warn(...args) {
        console.warn(...args);
    },
    table(columnarData) {
        const formattedColumnarData = _.mapValues(columnarData, (columnOrColumns, _rowName) => _.isNumber(columnOrColumns) ? columnOrColumns.toLocaleString() : columnOrColumns);
        console.table(formattedColumnarData);
    },
    logWithTime(arg) {
        logUtils.log(`[${chalk.gray(new Date().toLocaleTimeString())}] ${arg}`);
    },
};

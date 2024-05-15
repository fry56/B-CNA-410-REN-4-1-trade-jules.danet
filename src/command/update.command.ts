import { Command } from "../interface/command.interface.js"
import marketSingleton from "../class/market.class.js";
import { Candle } from "../class/candle.class.js";
import { Currency } from "../class/currency.class.js";

const commands: Command[] = [
    { name: 'next_candles', execute: nextCandle },
    { name: 'stacks', execute: updateStacks }
];

function nextCandle(data: string): void {
    const chartStrings: string[] = data.split(';');

    for (const candleString of chartStrings) {
        const candle: Candle = new Candle(marketSingleton.settings.candle_format, candleString);

        marketSingleton.chart.push(candle);
        marketSingleton.updatedAt = new Date();
    }
}

function updateStacks(data: string): void {
    const stackStrings: string[] = data.split(',');

    for (const stackString of stackStrings) {
        const parts: string[] = stackString.split(':');
        const currency: Currency = marketSingleton.wallet.getCurrency(parts[0]);

        if (currency) {
            currency.quantity = parseFloat(parts[1]);
        } else {
            marketSingleton.wallet.addCurrency({
                symbol: parts[0],
                quantity: parseFloat(parts[1]),
                isFiat: parts[0] === marketSingleton.pair.split('_')[0]
            });
        }
    }
}

export default (args: string[]): void => {
    if (args.shift() !== 'game')
        throw new Error('Invalid command format');
    const command: string = args.shift();
    const data: string = args.join(' ');
    const findCommand: Command = commands.find(cmd => cmd.name === command);

    if (!findCommand)
        throw new Error(`Update sub command ${command} not found.`);
    findCommand.execute(data);
}

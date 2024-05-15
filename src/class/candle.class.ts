import marketSingleton from '../class/market.class.js';

export class Candle {
    constructor(format: string[], data: string) {
        const values: string[] = data.split(',');

        for (let i = 0; i < format.length; i++) {
            switch (format[i]) {
                case 'pair':
                    this[format[i]] = values[i];
                    if (!marketSingleton.pair)
                        marketSingleton.pair = values[i];
                    break;
                case 'date':
                    this[format[i]] = new Date(Number.parseInt(values[i]) * 1000);
                    break;
                default:
                    this[format[i]] = parseFloat(values[i]);
                    break;
            }
        }
    }
}
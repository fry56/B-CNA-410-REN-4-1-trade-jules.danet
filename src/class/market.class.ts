import { Settings } from './settings.class.js';
import { Candle } from "./candle.class.js";
import { Strategy } from "../interface/strategy.interface.js";
import { Wallet } from "./wallet.class.js";
export class Market {
    private static instance: Market;
    public settings: Settings;
    public strategy: Strategy;
    public chart: Candle[];
    public updatedAt: Date;
    public timebank: number;
    public pair: string;

    public wallet: Wallet;

    private constructor() {
        this.settings = new Settings();
        this.updatedAt = new Date();
        this.timebank = 0;
        this.wallet = new Wallet();
        this.chart = [];
        this.pair = null;
    }

    public static getInstance(): Market {
        if (!Market.instance)
            Market.instance = new Market();
        return Market.instance;
    }
}

export default Market.getInstance();
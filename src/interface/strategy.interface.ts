import { Market } from "../class/market.class.js";

export interface Strategy {
    execute: (market: Market) => string | void;
}
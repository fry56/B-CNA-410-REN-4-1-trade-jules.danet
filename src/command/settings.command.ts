import marketSingleton from "../class/market.class.js";

export default (args: string[]): void => {
    switch (args[0]) {
        case "player_name":
            marketSingleton.settings[args[0]] = args[1];
            break;
        case "your_bot":
            marketSingleton.settings[args[0]] = args[1];
            break;
        case "candle_format":
            marketSingleton.settings[args[0]] = args[1].split(",");
            break;
        default:
            marketSingleton.settings[args[0]] = parseFloat(args[1]);
    }
}

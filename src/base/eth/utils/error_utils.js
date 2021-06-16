export const errorUtils = {
    spawnSwitchErr(name, value) {
        return new Error(`Unexpected switch value: ${value} encountered for ${name}`);
    },
};

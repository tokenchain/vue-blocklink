import * as _ from 'lodash';
export const providerUtils = {
    startProviderEngine(providerEngine) {
        if (providerEngine.start === undefined) {
            throw new Error(`Invalid Web3ProviderEngine`);
        }
        providerEngine._ready.go();
        providerEngine._running = true;
    },
    standardizeOrThrow(supportedProvider) {
        if (supportedProvider === undefined) {
            throw new Error(`supportedProvider cannot be 'undefined'`);
        }
        const provider = {
            isStandardizedProvider: true,
            isMetaMask: supportedProvider.isMetaMask,
            isParity: supportedProvider.isParity,
            stop: supportedProvider.stop,
            enable: supportedProvider.enable,
            sendAsync: _.noop.bind(_),
        };
        if (provider.enable) {
            provider.enable.bind(supportedProvider);
        }
        if (supportedProvider.isStandardizedProvider) {
            return supportedProvider;
        }
        else if (supportedProvider.isEIP1193) {
            provider.sendAsync = (payload, callback) => {
                const method = payload.method;
                const params = payload.params;
                supportedProvider
                    .send(method, params)
                    .then((result) => {
                    callback(null, result);
                })
                    .catch((err) => {
                    callback(err);
                });
            };
            return provider;
        }
        else if (supportedProvider.sendAsync !== undefined) {
            provider.sendAsync = supportedProvider.sendAsync.bind(supportedProvider);
            return provider;
        }
        else if (supportedProvider.send !== undefined) {
            if (_.includes(supportedProvider.send.toString().replace(' ', ''), 'function(payload,callback)')) {
                provider.sendAsync = supportedProvider.send.bind(supportedProvider);
                return provider;
            }
            else {
                provider.sendAsync = (payload, callback) => {
                    const method = payload.method;
                    const params = payload.params;
                    supportedProvider
                        .send(method, params)
                        .then((result) => {
                        callback(null, result);
                    })
                        .catch((err) => {
                        callback(err);
                    });
                };
                return provider;
            }
        }
        throw new Error(`Unsupported provider found. Please make sure it conforms to one of the supported providers. See 'Provider' type in 'ethereum-types' package.`);
    },
    async getChainIdAsync(supportedProvider) {
        const provider = providerUtils.standardizeOrThrow(supportedProvider);
        const RPC_ID_MAX = 2 ** 64;
        return new Promise((accept, reject) => {
            provider.sendAsync({
                jsonrpc: '2.0',
                id: _.random(1, RPC_ID_MAX),
                method: 'eth_chainId',
                params: [],
            }, (err, result) => {
                if (!_.isNil(err)) {
                    reject(err);
                }
                if (!result) {
                    throw new Error("Invalid 'eth_chainId' response");
                }
                accept(_.toNumber(result.result));
            });
        });
    },
};

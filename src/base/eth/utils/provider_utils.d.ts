import { SupportedProvider, ZeroExProvider } from '../types';
export declare const providerUtils: {
    startProviderEngine(providerEngine: any): void;
    standardizeOrThrow(supportedProvider: SupportedProvider): ZeroExProvider;
    getChainIdAsync(supportedProvider: SupportedProvider): Promise<number>;
};
//# sourceMappingURL=provider_utils.d.ts.map
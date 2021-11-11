import { SolidityTypes } from '../../../types';
import * as _ from 'lodash';
import { AbstractSetDataType } from '../abstract_data_types/types/set';
export class TupleDataType extends AbstractSetDataType {
    static matchType(type) {
        return type === SolidityTypes.Tuple;
    }
    constructor(dataItem, dataTypeFactory) {
        super(dataItem, dataTypeFactory);
        if (!TupleDataType.matchType(dataItem.type)) {
            throw new Error(`Tried to instantiate Tuple with bad input: ${dataItem}`);
        }
    }
    getSignatureType() {
        return this._computeSignatureOfMembers(false);
    }
    getSignature(isDetailed) {
        if (_.isEmpty(this.getDataItem().name) || !isDetailed) {
            return this.getSignatureType();
        }
        const name = this.getDataItem().name;
        const lastIndexOfScopeDelimiter = name.lastIndexOf('.');
        const isScopedName = lastIndexOfScopeDelimiter !== undefined && lastIndexOfScopeDelimiter > 0;
        const shortName = isScopedName ? name.substr(lastIndexOfScopeDelimiter + 1) : name;
        const detailedSignature = `${shortName} ${this._computeSignatureOfMembers(isDetailed)}`;
        return detailedSignature;
    }
}
//# sourceMappingURL=tuple.js.map
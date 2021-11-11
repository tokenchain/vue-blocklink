import { AbstractPointerDataType } from '../abstract_data_types/types/pointer';
export class PointerDataType extends AbstractPointerDataType {
    constructor(destDataType, parentDataType, dataTypeFactory) {
        const destDataItem = destDataType.getDataItem();
        const dataItem = { name: `ptr<${destDataItem.name}>`, type: `ptr<${destDataItem.type}>` };
        super(dataItem, dataTypeFactory, destDataType, parentDataType);
    }
    getSignatureType() {
        return this._destination.getSignature(false);
    }
    getSignature(isDetailed) {
        return this._destination.getSignature(isDetailed);
    }
    getDefaultValue() {
        const defaultValue = this._destination.getDefaultValue();
        return defaultValue;
    }
}
//# sourceMappingURL=pointer.js.map
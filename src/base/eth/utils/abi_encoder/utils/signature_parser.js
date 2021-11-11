import * as _ from 'lodash';
function parseNode(node) {
    const components = [];
    _.each(node.children, (child) => {
        const component = parseNode(child);
        components.push(component);
    });
    const dataItem = {
        name: node.name,
        type: node.value,
    };
    if (!_.isEmpty(components)) {
        dataItem.components = components;
    }
    return dataItem;
}
export function generateDataItemFromSignature(signature) {
    if (_.isEmpty(signature)) {
        throw new Error(`Cannot parse data item from empty signature, ''`);
    }
    let node = {
        name: '',
        value: '',
        children: [],
    };
    for (const char of signature) {
        switch (char) {
            case '(':
                const child = {
                    name: '',
                    value: '',
                    children: [],
                    parent: node,
                };
                node.value = 'tuple';
                node.children.push(child);
                node = child;
                break;
            case ')':
                node = node.parent;
                break;
            case ',':
                const sibling = {
                    name: '',
                    value: '',
                    children: [],
                    parent: node.parent,
                };
                node.parent.children.push(sibling);
                node = sibling;
                break;
            case ' ':
                node.name = node.value;
                node.value = '';
                break;
            default:
                node.value += char;
                break;
        }
    }
    return parseNode(node);
}
//# sourceMappingURL=signature_parser.js.map
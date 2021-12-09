function getStoredItemInt(key, _default) {
    if (localStorage) {
        if (localStorage.getItem(key) === null) {
            return _default
        } else {
            return parseInt(localStorage.getItem(key))
        }
    } else {
        return _default
    }
}

function getStoredItemStr(key, _default_str) {
    if (localStorage) {
        if (localStorage.getItem(key) === null) {
            return _default_str
        } else {
            return parseInt(localStorage.getItem(key))
        }
    } else {
        return _default_str
    }
}

function clone(item) {
    return JSON.parse(JSON.stringify(item));
}

function jsonParse(input, fallback) {
    if (typeof input !== 'string') {
        return fallback || {};
    }
    try {
        return JSON.parse(input);
    } catch (err) {
        return fallback || {};
    }
}

function formatProposals(proposals) {
    return Object.fromEntries(
        Object.entries(proposals).map(proposal => [
            proposal[0],
            formatProposal(proposal[1])
        ])
    );
}

function formatProposal(proposal) {
    proposal.msg = jsonParse(proposal.msg, proposal.msg);
    // v0.1.0
    if (proposal.msg.version === '0.1.0') {
        proposal.msg.payload.start = 1595088000;
        proposal.msg.payload.end = 1595174400;
        proposal.msg.payload.snapshot = 10484400;
        proposal.bpt_voting_disabled = '1';
    }

    return proposal;
}

function shorten(str = '') {
    return `${str.slice(0, 6)}...${str.slice(str.length - 4)}`;
}


export {
    shorten,
    formatProposal,
    formatProposals,
    jsonParse,
    clone,
    getStoredItemInt,
    getStoredItemStr
}

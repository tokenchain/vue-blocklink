import NODES from "../utils/const";

/**
 * under construction
 * events:
 */
export default {
    data() {
        return {
            scatter: false,
            tronWeb: false,
            // object json
            scatterInitialData: false,
            // node name NILE, MAINNET
            connectedNode: false,
            // wallet account name
            account_name: false,
            // --
            authorized_address: false,
            //module debug on core scatter only
            _debug_scatter: false,
            node_version: "",
        }
    },
    methods: {},
    mounted() {
        let _this = this

        const task = new Promise(r => {
            document.addEventListener('scatterLoaded', r);
        });


        task.then(() => {
            if (!scatter.identity) return;
            const account = scatter.identity.accounts.find(account => account.blockchain === 'eos');
            if (!account) return;

        });

    },
}

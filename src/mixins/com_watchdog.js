/**
 * this is the watcher component
 */
export default {
    data() {
        return {
            watchers: {}
        }
    },
    methods: {
        update_watch_val(prop, newval, oldval) {

        },
        onWatch(proper) {
            this.watchers[proper] = this.$watch(proper,
                (newVal, oldVal) => this.update_watch_val(proper, newVal, oldVal)
            )
        },
        unWatchAll() {
            const watchers = Object.keys(this.watchers)
            watchers.forEach(name => this.watchers[name]())
        }
    }
}

/**
 * events:
 * notify_tron_not_install
 * notify_tron_installed
 * notify_tron_node_change
 * notify_tron_account_set
 * notify_tron_initialization
 */
export default {
    data() {
        return {
            imtokenInstance: false,
            on_imtoken: false,
            imtoken_pop_setting_align: "top",
            imtoken_pop_setting_model: "banner"
        }
    },
    methods: {
        checkImtoken() {
            if (window && window.hasOwnProperty("imToken")) {
                this.imtokenInstance = window.imToken;
                this.$emit("imtoken_on_detect")
                return true
            }
            return false
        },
        imtokenAlert(message) {
            if (!this.on_imtoken) return;
            this.imtokenInstance.callAPI('native.alert', message)
        },
        imtokenSwitchAccount(chain_type, error_cb, result_cb) {
            if (!this.on_imtoken) return;
            /**
             imToken.callAPI('user.showAccountSwitch', { chainType: null }, function(err, address){
                if(err) {
                    alert(err.message)
                } else {
                    alert(address)
                }
            })**/
            this.imtokenInstance.callAPI('user.showAccountSwitch', {chainType: chain_type}, function (err, address) {
                if (err) {
                    error_cb(err.message)
                } else {
                    result_cb(address)
                }
            })
        },
        imtokenScanQRCode(error_cb, result_cb) {
            if (!this.on_imtoken) return;
            try {
                this.imtokenInstance.callAPI("native.scanQRCode", function (err, text) {
                    if (err) {
                        error_cb(err.message)
                    } else {
                        result_cb(text)
                    }

                });
            } catch (error) {
                error_cb(error)
            }
        },
        imtokenToastInfo(message) {
            if (!this.on_imtoken) return;
            this.imtokenInstance.callAPI('native.toast', {
                type: 'info',
                message: message,
                align: this.imtoken_pop_setting_align,
                model: this.imtoken_pop_setting_model,
                duration: 3000,
            })
        },
        imtokenToastWarning(message) {
            if (!this.on_imtoken) return;
            this.imtokenInstance.callAPI('native.toast', {
                type: 'warnning',
                message: message,
                align: this.imtoken_pop_setting_align,
                model: this.imtoken_pop_setting_model,
                duration: 3000,
            })
        },
        imtokenToastSuccess(message) {
            if (!this.on_imtoken) return;
            this.imtokenInstance.callAPI('native.toast', {
                type: 'success',
                message: message,
                align: this.imtoken_pop_setting_align,
                model: this.imtoken_pop_setting_model,
                duration: 2500,
            })
        },
        imtokenRouteTo(screen_id, title, url) {
            if (!this.on_imtoken) return;
            /**
             imToken.callAPI('navigator.routeTo', {
              screen: 'DappView',
              passProps: {
                title: 'DApp API Examples',
                url: 'https://consenlabs.github.io/dapp-sdk-doc/index.html',
              },
            })
             */
            this.imtokenInstance.callAPI('navigator.routeTo', {
                screen: screen_id,
                passProps: {
                    title: title,
                    url: url,
                },
            })
        },
        imtokenUIConfirm(payload, yes_cb, no_cb) {
            if (!this.on_imtoken) return;
            /**
             imToken.callAPI('native.confirm', {
                title: 'quick question',
                message: 'is Javascript the worst language?',
                cancelText: 'no',
                confirmText: 'yes',
            }, function(err, result) {
                if(err) {
                    console.log('no')
                } else {
                    console.log('yes')
                }
            })
             **/
            this.imtokenInstance.callAPI('native.confirm', payload,
                function (err, result) {
                    if (err) {
                        no_cb()
                    } else {
                        yes_cb()
                    }
                })
        },
        imtokenSelectImage(w, h, error_cb, result_cb) {
            if (!this.on_imtoken) return;
            /**
             imToken.callAPI('native.selectPicture',{
              maxWidth: 400,
              maxHeight: 200
            }, function (err, ret) {
              if(err) {
                alert(err.message)
              } else {
                document.getElementById('imgContainer').src = ret.data
              }
            })
             */
            this.imtokenInstance.callAPI('selectPicture.confirm',
                {
                    maxWidth: w,
                    maxHeight: h
                },
                function (err, result) {
                    if (err) {
                        error_cb(err.message)
                    } else {
                        // document.getElementById('imgContainer').src = result.data
                        result_cb(result.data)
                    }
                })
        }
    }
    ,
    mounted() {
        let _this = this

        setTimeout(function () {
            _this.on_imtoken = _this.checkImtoken()
        }, 0)

        _this.$on("set_imtoken_style", (payload) => {
            _this.imtokenInstance.callAPI('navigator.configure', payload)
        })

        _this.$on("set_imtoken_pop", (payload) => {
            _this.imtoken_pop_setting_align = payload.imtoken_pop_setting_align
            _this.imtoken_pop_setting_model = payload.imtoken_pop_setting_model
        })
        /**
         *
         * Property            Meaning                             Option values               Default value
         * orientation         Divice direction                    landscape/portrait          portrait
         * navigationStyle     navigation style                    default/transparent         default
         * navigatorColor      navigation background color         Any color like you write in CSS    white
         * implementation example



         this.$on("imtoken_on_detect",()=>{
              this.$emit("set_imtoken_style",
              {
                    navigatorColor: '#008cd5',
                    navigationStyle: 'transparent'
              })
         })


         */
    }
    ,
}

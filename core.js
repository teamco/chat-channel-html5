(function () {

    /**
     * Define new
     * @memberOf Function
     * @returns {Function}
     */
    Function.prototype.new = function () {
        return new this();
    };

    /**
     * Define Core
     * @class Core
     * @constructor
     */
    function Core() {
        this.init();
    }

    Core.prototype = {

        /**
         * Define constructor after overwrite prototype
         * @memberOf Core
         */
        constructor: Core,

        /**
         * Define init
         * @memberOf Core
         * @returns {Core}
         */
        init: function () {
            this._defineModel();
            this._defineView();
            this._defineController();
            this._defineListeners();
        },

        _defineListeners: function () {
            var name = '';
            document.addEventListener("DOMContentLoaded",
                function (loadEvent) {

                    var scope = this,
                        header = document.querySelector('header'),
                        plus = header.querySelector('span'),
                        form = header.querySelector('section'),
                        input = form.querySelector('input');

                    function hideForm() {
                        form.className = 'arrow_box';
                    }

                    document.addEventListener("keydown",
                        function (escEvent) {
                            if (input === escEvent.target) {
                                if (escEvent.which === 27) {
                                    hideForm();
                                    input.value = '';
                                }
                                if (escEvent.which === 13) {
                                    name = input.value;
                                    hideForm();
                                    if (name.length > 0) {
                                        scope.c.addChat(name);
                                    }
                                    input.value = '';
                                }
                            } else if (form.className.indexOf('fadeIn') > -1) {
                                hideForm();
                            }
                        }, false
                    );

                    plus.addEventListener('click',
                        function (addEvent) {
                            hideForm();
                            if (form.className.indexOf('fadeIn') === -1) {
                                form.className += ' fadeIn';
                                input.focus();
                            }

                        }, false
                    );

                    this.container = document.body;
                    this.c.addChat('Boss', true);

                }.bind(this), false
            );
        },

        /**
         * Define model
         * @memberOf Core
         * @private
         */
        _defineModel: function () {

            (function (scope) {

                /**
                 * Define Model
                 * @class Model
                 * @constructor
                 */
                function Model() {

                    /**
                     * Define collector
                     * @memberOf Model
                     * @type {{}}
                     */
                    this.collector = {};
                }

                Model.prototype = {

                    /**
                     * Define constructor after overwrite prototype
                     * @memberOf Model
                     */
                    constructor: Model,

                    /**
                     * Define getter
                     * @memberOf Model
                     * @param {string} [id]
                     * @returns {Object}
                     */
                    getCollector: function (id) {
                        if (typeof(id) === 'undefined') return this.collector;
                        if (typeof(this.collector[id]) === 'undefined') this.collector[id] = [];
                        return this.collector[id];
                    },

                    /**
                     * Define setter
                     * @memberOf Model
                     * @param {string} id
                     * @param {string} value
                     */
                    updateCollector: function (id, value) {
                        // Get collector
                        var collector = this.getCollector(id);
                        collector = collector || [];
                        collector.push({text: value, timestamp: (new Date()).getTime()});
                    },

                    /**
                     * Define setter
                     * @memberOf Model
                     * @param {string} id
                     * @returns {number}
                     */
                    getCollectorSize: function (id) {
                        return (this.getCollector(id) || []).length;
                    }
                };

                scope.constructor.prototype.m = Model.new();

            })(this);
        }

        ,

        /**
         * Define view
         * @memberOf Core
         * @private
         */
        _defineView: function () {

            (function (scope) {

                /**
                 * Define View
                 * @class View
                 * @constructor
                 */
                function View() {
                }

                View.prototype = {

                    /**
                     * Define constructor after overwrite prototype
                     * @memberOf View
                     */
                    constructor: View,

                    renderChat: function (container, opts) {
                        function getRange(min, max) {
                            return Math.random() * (max - min) + min;
                        }

                        var divFrame = document.createElement('div'),
                            iframe = document.createElement('iframe');
                        iframe.src = 'iframe.html';
                        divFrame.setAttribute('id', 'div-' + opts.id);
                        divFrame.setAttribute('draggable', 'true');
                        divFrame.style.width = (opts.width || 200) + 'px';
                        divFrame.style.height = (opts.height || 400) + 'px';
                        divFrame.style.top = (opts.top || getRange(0, 40)) + 'px';
                        divFrame.style.left = (opts.left || getRange(0, 200)) + 'px';
                        divFrame.appendChild(iframe);
                        container.appendChild(divFrame);

                        var rect = divFrame.getBoundingClientRect();
                        divFrame.addEventListener("dragstart", function (event) {
                            divFrame.style.opacity = .5;
                        }, false);
                        divFrame.addEventListener("dragend", function (event) {
                            event.preventDefault();
                            divFrame.style.opacity = '';
                            divFrame.style.left = event.screenX + 'px';
                            divFrame.style.top = (event.pageY - rect.height) + 'px';
                            rect = divFrame.getBoundingClientRect();
                            if (rect.top < 0) {
                                divFrame.style.top = 10 + 'px';
                            }
                            if (rect.left < 0) {
                                divFrame.style.left = 10 + 'px';
                            }
                            if (rect.right > document.documentElement.clientWidth) {
                                divFrame.style.left = document.documentElement.clientWidth - 10 - rect.width + 'px';
                            }
                            if (rect.bottom > document.documentElement.clientHeight) {
                                divFrame.style.top = document.documentElement.clientHeight - 10 - rect.height + 'px';
                            }
                        }, false);
                    }
                };

                scope.constructor.prototype.v = View.new();

            })(this);
        }
        ,

        /**
         * Define controller
         * @memberOf Core
         * @private
         */
        _defineController: function () {

            (function (scope) {

                /**
                 * Define Controller
                 * @class Controller
                 * @constructor
                 */
                function Controller() {
                    this.v = scope.v;
                    this.m = scope.m;
                }

                Controller.prototype = {

                    /**
                     * Define constructor after overwrite prototype
                     * @memberOf Controller
                     */
                    constructor: Controller,

                    /**
                     * Define add chat
                     * @param {string} name
                     * @param {boolean} [root]
                     */
                    addChat: function (name, root) {
                        function _uuid(a) {
                            return a ?
                                (a ^ Math.random() * 16 >> a / 4).toString(16) :
                                ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, _uuid);
                        }

                        var uuid = _uuid();

                        this.v.renderChat(scope.container, {id: uuid});

                        var hello = 'Hello ' + name + ': ' + (this.root && root ? 'Hacker' : root ? 'Manager' : 'Guest');

                        this.m.updateCollector(uuid, hello);

                        if (root && typeof(this.root) === 'undefined') {
                            this.initChannel(uuid);
                        }

                        var msg = this.m.getCollector(uuid);
                        this.handleChat(uuid, name, 'msg,' + msg[msg.length - 1].text);
                    },

                    initChannel: function (uuid) {
                        this.root = uuid;
                        this.channel = {};
                    },

                    handleChat: function (uuid, name, text) {

                        var ifr = document.querySelector('#div-' + uuid + '>iframe');

                        if (!this.channel[uuid]) {

                            /**
                             * Define channel
                             * @type {MessageChannel}
                             */
                            this.channel[uuid] = new MessageChannel();
                            this.channel[uuid].port1.onmessage = handleMessage.bind(this);
                            function handleMessage(e) {
                                this.handleChat(uuid, name, 'msg,' + e.data);
                            }

                            window.addEventListener("message", function (e) {
                                ifr.contentWindow.postMessage(e.data, '*');
                                this.m.updateCollector(uuid, e.data);
                                console.log(e.data);
                            }.bind(this));

                            ifr.addEventListener("load", this.postMessage.bind({
                                scope: this,
                                uuid: uuid,
                                name: name,
                                w: ifr.contentWindow,
                                msg: text
                            }), false);

                        } else {

                            var msg = name + ': ' + text.replace(/^msg,/, "");
                            console.log(msg);
                            var root = document.querySelector('#div-' + this.root + '>iframe');
                            root.contentWindow.postMessage(msg, '*');
                            if (uuid !== this.root) {
                                ifr.contentWindow.postMessage(msg, '*');
                            }
                            this.m.updateCollector(uuid, msg);
                        }
                    },

                    postMessage: function () {
                        if (!this.msg.length) {
                            console.warn('Empty msg', this);
                            return false;
                        }
                        this.w.postMessage([this.msg], '*', [this.scope.channel[this.uuid].port2]);
                        this.scope.m.updateCollector(this.uuid, this.msg);
                    }

                };

                scope.constructor.prototype.c = Controller.new();

            })(this);
        }
    };

    window.c = Core.new();
})();
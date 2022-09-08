/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
    /* harmony export */ });
    /* harmony import */ var _events_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
    /* harmony import */ var parse5__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
    
    
    
    class HTML extends _events_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
        constructor(ctx) {
            super();
            this.ctx = ctx;
            this.rewriteUrl = ctx.rewriteUrl;
            this.sourceUrl = ctx.sourceUrl;
        };
        rewrite(str, options = {}) {
            if (!str) return str;
            return this.recast(str, node => {
                if (node.tagName) this.emit('element', node, 'rewrite');
                if (node.attr) this.emit('attr', node, 'rewrite');
                if (node.nodeName === '#text') this.emit('text', node, 'rewrite');
            }, options)
        };
        source(str, options = {}) {
            if (!str) return str;
            return this.recast(str, node => {
                if (node.tagName) this.emit('element', node, 'source');
                if (node.attr) this.emit('attr', node, 'source');
                if (node.nodeName === '#text') this.emit('text', node, 'source');
            }, options)
        };
        recast(str, fn, options = {}) {
            try {
                const ast = (options.document ? parse5__WEBPACK_IMPORTED_MODULE_1__.parse : parse5__WEBPACK_IMPORTED_MODULE_1__.parseFragment)(new String(str).toString());
                this.iterate(ast, fn, options);
                return (0,parse5__WEBPACK_IMPORTED_MODULE_1__.serialize)(ast);
            } catch(e) {
                return str;
            };
        };
        iterate(ast, fn, fnOptions) {
            if (!ast) return ast;
        
            if (ast.tagName) {
                const element = new P5Element(ast, false, fnOptions);
                fn(element);
                if (ast.attrs) {
                    for (const attr of ast.attrs) {
                        if (!attr.skip) fn(new AttributeEvent(element, attr, fnOptions));
                    };
                };
            };
    
            if (ast.childNodes) {
                for (const child of ast.childNodes) {
                    if (!child.skip) this.iterate(child, fn, fnOptions);
                };
            };
    
            if (ast.nodeName === '#text') {
                fn(new TextEvent(ast, new P5Element(ast.parentNode), false, fnOptions));
            };
    
            return ast;
        };
        wrapSrcset(str, meta = this.ctx.meta) {
            return str.split(',').map(src => {
                const parts = src.trimStart().split(' ');
                if (parts[0]) parts[0] = this.ctx.rewriteUrl(parts[0], meta);
                return parts.join(' ');
            }).join(', ');
        };
        unwrapSrcset(str, meta = this.ctx.meta) {
            return str.split(',').map(src => {
                const parts = src.trimStart().split(' ');
                if (parts[0]) parts[0] = this.ctx.sourceUrl(parts[0], meta);
                return parts.join(' ');
            }).join(', ');
        };
        static parse = parse5__WEBPACK_IMPORTED_MODULE_1__.parse;
        static parseFragment = parse5__WEBPACK_IMPORTED_MODULE_1__.parseFragment;
        static serialize = parse5__WEBPACK_IMPORTED_MODULE_1__.serialize;  
    };
    
    class P5Element extends _events_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
        constructor(node, stream = false, options = {}) {
            super();
            this.stream = stream;
            this.node = node;
            this.options = options;
        };
        setAttribute(name, value) {
            for (const attr of this.attrs) {
                if (attr.name === name) {
                    attr.value = value;
                    return true;
                };
            };
    
            this.attrs.push(
                {
                    name,
                    value,
                }
            );
        };
        getAttribute(name) {
            const attr = this.attrs.find(attr => attr.name === name) || {};
            return attr.value;
        };
        hasAttribute(name) {
            return !!this.attrs.find(attr => attr.name === name);
        };
        removeAttribute(name) {
            const i = this.attrs.findIndex(attr => attr.name === name);
            if (typeof i !== 'undefined') this.attrs.splice(i, 1);
        };
        get tagName() {
            return this.node.tagName;
        };
        set tagName(val) {
            this.node.tagName = val;
        };
        get childNodes() {
            return !this.stream ? this.node.childNodes : null;
        };
        get innerHTML() {
            return !this.stream ? (0,parse5__WEBPACK_IMPORTED_MODULE_1__.serialize)(
                {
                    nodeName: '#document-fragment',
                    childNodes: this.childNodes,
                }
            ) : null;
        };
        set innerHTML(val) {
            if (!this.stream) this.node.childNodes = (0,parse5__WEBPACK_IMPORTED_MODULE_1__.parseFragment)(val).childNodes;
        };
        get outerHTML() {
            return !this.stream ? (0,parse5__WEBPACK_IMPORTED_MODULE_1__.serialize)(
                {
                    nodeName: '#document-fragment',
                    childNodes: [ this ],
                }
            ) : null;
        };
        set outerHTML(val) {
            if (!this.stream) this.parentNode.childNodes.splice(this.parentNode.childNodes.findIndex(node => node === this.node), 1, ...(0,parse5__WEBPACK_IMPORTED_MODULE_1__.parseFragment)(val).childNodes);
        };
        get textContent() {
            if (this.stream) return null;
    
            let str = '';
            iterate(this.node, node => {
                if (node.nodeName === '#text') str += node.value;
            });
            
            return str;
        };
        set textContent(val) {
            if (!this.stream) this.node.childNodes = [ 
                { 
                    nodeName: '#text', 
                    value: val,
                    parentNode: this.node 
                }
            ];
        };
        get nodeName() {
            return this.node.nodeName;
        } 
        get parentNode() {
            return this.node.parentNode ? new P5Element(this.node.parentNode) : null;
        };
        get attrs() {
            return this.node.attrs;
        }
        get namespaceURI() {
            return this.node.namespaceURI;
        }
    };
    
    class AttributeEvent {
        constructor(node, attr, options = {}) {
            this.attr = attr;
            this.attrs = node.attrs;
            this.node = node;
            this.options = options;
        };
        delete() {
            const i = this.attrs.findIndex(attr => attr === this.attr);
    
            this.attrs.splice(i, 1);
    
            Object.defineProperty(this, 'deleted', {
                get: () => true,
            });
    
            return true;
        };
        get name() {
            return this.attr.name;
        };
    
        set name(val) {
            this.attr.name = val;
        };
        get value() {
            return this.attr.value;
        };
    
        set value(val) {
            this.attr.value = val;
        };
        get deleted() {
            return false;
        };
    };
    
    class TextEvent {
        constructor(node, element, stream = false, options = {}) {
            this.stream = stream;
            this.node = node;
            this.element = element;
            this.options = options;
        };
        get nodeName() {
            return this.node.nodeName;
        } 
        get parentNode() {
            return this.element;
        };
        get value() {
            return this.stream ? this.node.text : this.node.value;
        };
        set value(val) {
    
            if (this.stream) this.node.text = val;
            else this.node.value = val;
        };
    };
    
    /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (HTML);
    
    /***/ }),
    /* 2 */
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
    /* harmony export */ });
    // Copyright Joyent, Inc. and other Node contributors.
    //
    // Permission is hereby granted, free of charge, to any person obtaining a
    // copy of this software and associated documentation files (the
    // "Software"), to deal in the Software without restriction, including
    // without limitation the rights to use, copy, modify, merge, publish,
    // distribute, sublicense, and/or sell copies of the Software, and to permit
    // persons to whom the Software is furnished to do so, subject to the
    // following conditions:
    //
    // The above copyright notice and this permission notice shall be included
    // in all copies or substantial portions of the Software.
    //
    // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
    // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
    // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
    // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
    // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
    // USE OR OTHER DEALINGS IN THE SOFTWARE.
    
    
    
    var R = typeof Reflect === 'object' ? Reflect : null
    var ReflectApply = R && typeof R.apply === 'function'
      ? R.apply
      : function ReflectApply(target, receiver, args) {
        return Function.prototype.apply.call(target, receiver, args);
      }
    
    var ReflectOwnKeys
    if (R && typeof R.ownKeys === 'function') {
      ReflectOwnKeys = R.ownKeys
    } else if (Object.getOwnPropertySymbols) {
      ReflectOwnKeys = function ReflectOwnKeys(target) {
        return Object.getOwnPropertyNames(target)
          .concat(Object.getOwnPropertySymbols(target));
      };
    } else {
      ReflectOwnKeys = function ReflectOwnKeys(target) {
        return Object.getOwnPropertyNames(target);
      };
    }
    
    function ProcessEmitWarning(warning) {
      if (console && console.warn) console.warn(warning);
    }
    
    var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
      return value !== value;
    }
    
    function EventEmitter() {
      EventEmitter.init.call(this);
    }
    
    /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (EventEmitter);
    
    // Backwards-compat with node 0.10.x
    EventEmitter.EventEmitter = EventEmitter;
    
    EventEmitter.prototype._events = undefined;
    EventEmitter.prototype._eventsCount = 0;
    EventEmitter.prototype._maxListeners = undefined;
    
    // By default EventEmitters will print a warning if more than 10 listeners are
    // added to it. This is a useful default which helps finding memory leaks.
    var defaultMaxListeners = 10;
    
    function checkListener(listener) {
      if (typeof listener !== 'function') {
        throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
      }
    }
    
    Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
      enumerable: true,
      get: function() {
        return defaultMaxListeners;
      },
      set: function(arg) {
        if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
          throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
        }
        defaultMaxListeners = arg;
      }
    });
    
    EventEmitter.init = function() {
    
      if (this._events === undefined ||
          this._events === Object.getPrototypeOf(this)._events) {
        this._events = Object.create(null);
        this._eventsCount = 0;
      }
    
      this._maxListeners = this._maxListeners || undefined;
    };
    
    // Obviously not all Emitters should be limited to 10. This function allows
    // that to be increased. Set to zero for unlimited.
    EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
      if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
        throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
      }
      this._maxListeners = n;
      return this;
    };
    
    function _getMaxListeners(that) {
      if (that._maxListeners === undefined)
        return EventEmitter.defaultMaxListeners;
      return that._maxListeners;
    }
    
    EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
      return _getMaxListeners(this);
    };
    
    EventEmitter.prototype.emit = function emit(type) {
      var args = [];
      for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
      var doError = (type === 'error');
    
      var events = this._events;
      if (events !== undefined)
        doError = (doError && events.error === undefined);
      else if (!doError)
        return false;
    
      // If there is no 'error' event listener then throw.
      if (doError) {
        var er;
        if (args.length > 0)
          er = args[0];
        if (er instanceof Error) {
          // Note: The comments on the `throw` lines are intentional, they show
          // up in Node's output if this results in an unhandled exception.
          throw er; // Unhandled 'error' event
        }
        // At least give some kind of context to the user
        var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
        err.context = er;
        throw err; // Unhandled 'error' event
      }
    
      var handler = events[type];
    
      if (handler === undefined)
        return false;
    
      if (typeof handler === 'function') {
        ReflectApply(handler, this, args);
      } else {
        var len = handler.length;
        var listeners = arrayClone(handler, len);
        for (var i = 0; i < len; ++i)
          ReflectApply(listeners[i], this, args);
      }
    
      return true;
    };
    
    function _addListener(target, type, listener, prepend) {
      var m;
      var events;
      var existing;
    
      checkListener(listener);
    
      events = target._events;
      if (events === undefined) {
        events = target._events = Object.create(null);
        target._eventsCount = 0;
      } else {
        // To avoid recursion in the case that type === "newListener"! Before
        // adding it to the listeners, first emit "newListener".
        if (events.newListener !== undefined) {
          target.emit('newListener', type,
                      listener.listener ? listener.listener : listener);
    
          // Re-assign `events` because a newListener handler could have caused the
          // this._events to be assigned to a new object
          events = target._events;
        }
        existing = events[type];
      }
    
      if (existing === undefined) {
        // Optimize the case of one listener. Don't need the extra array object.
        existing = events[type] = listener;
        ++target._eventsCount;
      } else {
        if (typeof existing === 'function') {
          // Adding the second element, need to change to array.
          existing = events[type] =
            prepend ? [listener, existing] : [existing, listener];
          // If we've already got an array, just append.
        } else if (prepend) {
          existing.unshift(listener);
        } else {
          existing.push(listener);
        }
    
        // Check for listener leak
        m = _getMaxListeners(target);
        if (m > 0 && existing.length > m && !existing.warned) {
          existing.warned = true;
          // No error code for this since it is a Warning
          // eslint-disable-next-line no-restricted-syntax
          var w = new Error('Possible EventEmitter memory leak detected. ' +
                              existing.length + ' ' + String(type) + ' listeners ' +
                              'added. Use emitter.setMaxListeners() to ' +
                              'increase limit');
          w.name = 'MaxListenersExceededWarning';
          w.emitter = target;
          w.type = type;
          w.count = existing.length;
          ProcessEmitWarning(w);
        }
      }
    
      return target;
    }
    
    EventEmitter.prototype.addListener = function addListener(type, listener) {
      return _addListener(this, type, listener, false);
    };
    
    EventEmitter.prototype.on = EventEmitter.prototype.addListener;
    
    EventEmitter.prototype.prependListener =
        function prependListener(type, listener) {
          return _addListener(this, type, listener, true);
        };
    
    function onceWrapper() {
      if (!this.fired) {
        this.target.removeListener(this.type, this.wrapFn);
        this.fired = true;
        if (arguments.length === 0)
          return this.listener.call(this.target);
        return this.listener.apply(this.target, arguments);
      }
    }
    
    function _onceWrap(target, type, listener) {
      var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
      var wrapped = onceWrapper.bind(state);
      wrapped.listener = listener;
      state.wrapFn = wrapped;
      return wrapped;
    }
    
    EventEmitter.prototype.once = function once(type, listener) {
      checkListener(listener);
      this.on(type, _onceWrap(this, type, listener));
      return this;
    };
    
    EventEmitter.prototype.prependOnceListener =
        function prependOnceListener(type, listener) {
          checkListener(listener);
          this.prependListener(type, _onceWrap(this, type, listener));
          return this;
        };
    
    // Emits a 'removeListener' event if and only if the listener was removed.
    EventEmitter.prototype.removeListener =
        function removeListener(type, listener) {
          var list, events, position, i, originalListener;
    
          checkListener(listener);
    
          events = this._events;
          if (events === undefined)
            return this;
    
          list = events[type];
          if (list === undefined)
            return this;
    
          if (list === listener || list.listener === listener) {
            if (--this._eventsCount === 0)
              this._events = Object.create(null);
            else {
              delete events[type];
              if (events.removeListener)
                this.emit('removeListener', type, list.listener || listener);
            }
          } else if (typeof list !== 'function') {
            position = -1;
    
            for (i = list.length - 1; i >= 0; i--) {
              if (list[i] === listener || list[i].listener === listener) {
                originalListener = list[i].listener;
                position = i;
                break;
              }
            }
    
            if (position < 0)
              return this;
    
            if (position === 0)
              list.shift();
            else {
              spliceOne(list, position);
            }
    
            if (list.length === 1)
              events[type] = list[0];
    
            if (events.removeListener !== undefined)
              this.emit('removeListener', type, originalListener || listener);
          }
    
          return this;
        };
    
    EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
    
    EventEmitter.prototype.removeAllListeners =
        function removeAllListeners(type) {
          var listeners, events, i;
    
          events = this._events;
          if (events === undefined)
            return this;
    
          // not listening for removeListener, no need to emit
          if (events.removeListener === undefined) {
            if (arguments.length === 0) {
              this._events = Object.create(null);
              this._eventsCount = 0;
            } else if (events[type] !== undefined) {
              if (--this._eventsCount === 0)
                this._events = Object.create(null);
              else
                delete events[type];
            }
            return this;
          }
    
          // emit removeListener for all listeners on all events
          if (arguments.length === 0) {
            var keys = Object.keys(events);
            var key;
            for (i = 0; i < keys.length; ++i) {
              key = keys[i];
              if (key === 'removeListener') continue;
              this.removeAllListeners(key);
            }
            this.removeAllListeners('removeListener');
            this._events = Object.create(null);
            this._eventsCount = 0;
            return this;
          }
    
          listeners = events[type];
    
          if (typeof listeners === 'function') {
            this.removeListener(type, listeners);
          } else if (listeners !== undefined) {
            // LIFO order
            for (i = listeners.length - 1; i >= 0; i--) {
              this.removeListener(type, listeners[i]);
            }
          }
    
          return this;
        };
    
    function _listeners(target, type, unwrap) {
      var events = target._events;
    
      if (events === undefined)
        return [];
    
      var evlistener = events[type];
      if (evlistener === undefined)
        return [];
    
      if (typeof evlistener === 'function')
        return unwrap ? [evlistener.listener || evlistener] : [evlistener];
    
      return unwrap ?
        unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
    }
    
    EventEmitter.prototype.listeners = function listeners(type) {
      return _listeners(this, type, true);
    };
    
    EventEmitter.prototype.rawListeners = function rawListeners(type) {
      return _listeners(this, type, false);
    };
    
    EventEmitter.listenerCount = function(emitter, type) {
      if (typeof emitter.listenerCount === 'function') {
        return emitter.listenerCount(type);
      } else {
        return listenerCount.call(emitter, type);
      }
    };
    
    EventEmitter.prototype.listenerCount = listenerCount;
    function listenerCount(type) {
      var events = this._events;
    
      if (events !== undefined) {
        var evlistener = events[type];
    
        if (typeof evlistener === 'function') {
          return 1;
        } else if (evlistener !== undefined) {
          return evlistener.length;
        }
      }
    
      return 0;
    }
    
    EventEmitter.prototype.eventNames = function eventNames() {
      return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
    };
    
    function arrayClone(arr, n) {
      var copy = new Array(n);
      for (var i = 0; i < n; ++i)
        copy[i] = arr[i];
      return copy;
    }
    
    function spliceOne(list, index) {
      for (; index + 1 < list.length; index++)
        list[index] = list[index + 1];
      list.pop();
    }
    
    function unwrapListeners(arr) {
      var ret = new Array(arr.length);
      for (var i = 0; i < ret.length; ++i) {
        ret[i] = arr[i].listener || arr[i];
      }
      return ret;
    }
    
    function once(emitter, name) {
      return new Promise(function (resolve, reject) {
        function errorListener(err) {
          emitter.removeListener(name, resolver);
          reject(err);
        }
    
        function resolver() {
          if (typeof emitter.removeListener === 'function') {
            emitter.removeListener('error', errorListener);
          }
          resolve([].slice.call(arguments));
        };
    
        eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
        if (name !== 'error') {
          addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
        }
      });
    }
    
    function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
      if (typeof emitter.on === 'function') {
        eventTargetAgnosticAddListener(emitter, 'error', handler, flags);
      }
    }
    
    function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
      if (typeof emitter.on === 'function') {
        if (flags.once) {
          emitter.once(name, listener);
        } else {
          emitter.on(name, listener);
        }
      } else if (typeof emitter.addEventListener === 'function') {
        // EventTarget does not have `error` event semantics like Node
        // EventEmitters, we do not listen for `error` events here.
        emitter.addEventListener(name, function wrapListener(arg) {
          // IE does not have builtin `{ once: true }` support so we
          // have to do it manually.
          if (flags.once) {
            emitter.removeEventListener(name, wrapListener);
          }
          listener(arg);
        });
      } else {
        throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
      }
    }
    
    /***/ }),
    /* 3 */
    /***/ ((__unused_webpack_module, exports, __webpack_require__) => {
    
    "use strict";
    
    
    const Parser = __webpack_require__(4);
    const Serializer = __webpack_require__(26);
    
    // Shorthands
    exports.parse = function parse(html, options) {
        const parser = new Parser(options);
    
        return parser.parse(html);
    };
    
    exports.parseFragment = function parseFragment(fragmentContext, html, options) {
        if (typeof fragmentContext === 'string') {
            options = html;
            html = fragmentContext;
            fragmentContext = null;
        }
    
        const parser = new Parser(options);
    
        return parser.parseFragment(html, fragmentContext);
    };
    
    exports.serialize = function(node, options) {
        const serializer = new Serializer(node, options);
    
        return serializer.serialize();
    };
    
    
    /***/ }),
    /* 4 */
    /***/ ((module, __unused_webpack_exports, __webpack_require__) => {
    
    "use strict";
    
    
    const Tokenizer = __webpack_require__(5);
    const OpenElementStack = __webpack_require__(10);
    const FormattingElementList = __webpack_require__(12);
    const LocationInfoParserMixin = __webpack_require__(13);
    const ErrorReportingParserMixin = __webpack_require__(18);
    const Mixin = __webpack_require__(14);
    const defaultTreeAdapter = __webpack_require__(22);
    const mergeOptions = __webpack_require__(23);
    const doctype = __webpack_require__(24);
    const foreignContent = __webpack_require__(25);
    const ERR = __webpack_require__(8);
    const unicode = __webpack_require__(7);
    const HTML = __webpack_require__(11);
    
    //Aliases
    const $ = HTML.TAG_NAMES;
    const NS = HTML.NAMESPACES;
    const ATTRS = HTML.ATTRS;
    
    const DEFAULT_OPTIONS = {
        scriptingEnabled: true,
        sourceCodeLocationInfo: false,
        onParseError: null,
        treeAdapter: defaultTreeAdapter
    };
    
    //Misc constants
    const HIDDEN_INPUT_TYPE = 'hidden';
    
    //Adoption agency loops iteration count
    const AA_OUTER_LOOP_ITER = 8;
    const AA_INNER_LOOP_ITER = 3;
    
    //Insertion modes
    const INITIAL_MODE = 'INITIAL_MODE';
    const BEFORE_HTML_MODE = 'BEFORE_HTML_MODE';
    const BEFORE_HEAD_MODE = 'BEFORE_HEAD_MODE';
    const IN_HEAD_MODE = 'IN_HEAD_MODE';
    const IN_HEAD_NO_SCRIPT_MODE = 'IN_HEAD_NO_SCRIPT_MODE';
    const AFTER_HEAD_MODE = 'AFTER_HEAD_MODE';
    const IN_BODY_MODE = 'IN_BODY_MODE';
    const TEXT_MODE = 'TEXT_MODE';
    const IN_TABLE_MODE = 'IN_TABLE_MODE';
    const IN_TABLE_TEXT_MODE = 'IN_TABLE_TEXT_MODE';
    const IN_CAPTION_MODE = 'IN_CAPTION_MODE';
    const IN_COLUMN_GROUP_MODE = 'IN_COLUMN_GROUP_MODE';
    const IN_TABLE_BODY_MODE = 'IN_TABLE_BODY_MODE';
    const IN_ROW_MODE = 'IN_ROW_MODE';
    const IN_CELL_MODE = 'IN_CELL_MODE';
    const IN_SELECT_MODE = 'IN_SELECT_MODE';
    const IN_SELECT_IN_TABLE_MODE = 'IN_SELECT_IN_TABLE_MODE';
    const IN_TEMPLATE_MODE = 'IN_TEMPLATE_MODE';
    const AFTER_BODY_MODE = 'AFTER_BODY_MODE';
    const IN_FRAMESET_MODE = 'IN_FRAMESET_MODE';
    const AFTER_FRAMESET_MODE = 'AFTER_FRAMESET_MODE';
    const AFTER_AFTER_BODY_MODE = 'AFTER_AFTER_BODY_MODE';
    const AFTER_AFTER_FRAMESET_MODE = 'AFTER_AFTER_FRAMESET_MODE';
    
    //Insertion mode reset map
    const INSERTION_MODE_RESET_MAP = {
        [$.TR]: IN_ROW_MODE,
        [$.TBODY]: IN_TABLE_BODY_MODE,
        [$.THEAD]: IN_TABLE_BODY_MODE,
        [$.TFOOT]: IN_TABLE_BODY_MODE,
        [$.CAPTION]: IN_CAPTION_MODE,
        [$.COLGROUP]: IN_COLUMN_GROUP_MODE,
        [$.TABLE]: IN_TABLE_MODE,
        [$.BODY]: IN_BODY_MODE,
        [$.FRAMESET]: IN_FRAMESET_MODE
    };
    
    //Template insertion mode switch map
    const TEMPLATE_INSERTION_MODE_SWITCH_MAP = {
        [$.CAPTION]: IN_TABLE_MODE,
        [$.COLGROUP]: IN_TABLE_MODE,
        [$.TBODY]: IN_TABLE_MODE,
        [$.TFOOT]: IN_TABLE_MODE,
        [$.THEAD]: IN_TABLE_MODE,
        [$.COL]: IN_COLUMN_GROUP_MODE,
        [$.TR]: IN_TABLE_BODY_MODE,
        [$.TD]: IN_ROW_MODE,
        [$.TH]: IN_ROW_MODE
    };
    
    //Token handlers map for insertion modes
    const TOKEN_HANDLERS = {
        [INITIAL_MODE]: {
            [Tokenizer.CHARACTER_TOKEN]: tokenInInitialMode,
            [Tokenizer.NULL_CHARACTER_TOKEN]: tokenInInitialMode,
            [Tokenizer.WHITESPACE_CHARACTER_TOKEN]: ignoreToken,
            [Tokenizer.COMMENT_TOKEN]: appendComment,
            [Tokenizer.DOCTYPE_TOKEN]: doctypeInInitialMode,
            [Tokenizer.START_TAG_TOKEN]: tokenInInitialMode,
            [Tokenizer.END_TAG_TOKEN]: tokenInInitialMode,
            [Tokenizer.EOF_TOKEN]: tokenInInitialMode
        },
        [BEFORE_HTML_MODE]: {
            [Tokenizer.CHARACTER_TOKEN]: tokenBeforeHtml,
            [Tokenizer.NULL_CHARACTER_TOKEN]: tokenBeforeHtml,
            [Tokenizer.WHITESPACE_CHARACTER_TOKEN]: ignoreToken,
            [Tokenizer.COMMENT_TOKEN]: appendComment,
            [Tokenizer.DOCTYPE_TOKEN]: ignoreToken,
            [Tokenizer.START_TAG_TOKEN]: startTagBeforeHtml,
            [Tokenizer.END_TAG_TOKEN]: endTagBeforeHtml,
            [Tokenizer.EOF_TOKEN]: tokenBeforeHtml
        },
        [BEFORE_HEAD_MODE]: {
            [Tokenizer.CHARACTER_TOKEN]: tokenBeforeHead,
            [Tokenizer.NULL_CHARACTER_TOKEN]: tokenBeforeHead,
            [Tokenizer.WHITESPACE_CHARACTER_TOKEN]: ignoreToken,
            [Tokenizer.COMMENT_TOKEN]: appendComment,
            [Tokenizer.DOCTYPE_TOKEN]: misplacedDoctype,
            [Tokenizer.START_TAG_TOKEN]: startTagBeforeHead,
            [Tokenizer.END_TAG_TOKEN]: endTagBeforeHead,
            [Tokenizer.EOF_TOKEN]: tokenBeforeHead
        },
        [IN_HEAD_MODE]: {
            [Tokenizer.CHARACTER_TOKEN]: tokenInHead,
            [Tokenizer.NULL_CHARACTER_TOKEN]: tokenInHead,
            [Tokenizer.WHITESPACE_CHARACTER_TOKEN]: insertCharacters,
            [Tokenizer.COMMENT_TOKEN]: appendComment,
            [Tokenizer.DOCTYPE_TOKEN]: misplacedDoctype,
            [Tokenizer.START_TAG_TOKEN]: startTagInHead,
            [Tokenizer.END_TAG_TOKEN]: endTagInHead,
            [Tokenizer.EOF_TOKEN]: tokenInHead
        },
        [IN_HEAD_NO_SCRIPT_MODE]: {
            [Tokenizer.CHARACTER_TOKEN]: tokenInHeadNoScript,
            [Tokenizer.NULL_CHARACTER_TOKEN]: tokenInHeadNoScript,
            [Tokenizer.WHITESPACE_CHARACTER_TOKEN]: insertCharacters,
            [Tokenizer.COMMENT_TOKEN]: appendComment,
            [Tokenizer.DOCTYPE_TOKEN]: misplacedDoctype,
            [Tokenizer.START_TAG_TOKEN]: startTagInHeadNoScript,
            [Tokenizer.END_TAG_TOKEN]: endTagInHeadNoScript,
            [Tokenizer.EOF_TOKEN]: tokenInHeadNoScript
        },
        [AFTER_HEAD_MODE]: {
            [Tokenizer.CHARACTER_TOKEN]: tokenAfterHead,
            [Tokenizer.NULL_CHARACTER_TOKEN]: tokenAfterHead,
            [Tokenizer.WHITESPACE_CHARACTER_TOKEN]: insertCharacters,
            [Tokenizer.COMMENT_TOKEN]: appendComment,
            [Tokenizer.DOCTYPE_TOKEN]: misplacedDoctype,
            [Tokenizer.START_TAG_TOKEN]: startTagAfterHead,
            [Tokenizer.END_TAG_TOKEN]: endTagAfterHead,
            [Tokenizer.EOF_TOKEN]: tokenAfterHead
        },
        [IN_BODY_MODE]: {
            [Tokenizer.CHARACTER_TOKEN]: characterInBody,
            [Tokenizer.NULL_CHARACTER_TOKEN]: ignoreToken,
            [Tokenizer.WHITESPACE_CHARACTER_TOKEN]: whitespaceCharacterInBody,
            [Tokenizer.COMMENT_TOKEN]: appendComment,
            [Tokenizer.DOCTYPE_TOKEN]: ignoreToken,
            [Tokenizer.START_TAG_TOKEN]: startTagInBody,
            [Tokenizer.END_TAG_TOKEN]: endTagInBody,
            [Tokenizer.EOF_TOKEN]: eofInBody
        },
        [TEXT_MODE]: {
            [Tokenizer.CHARACTER_TOKEN]: insertCharacters,
            [Tokenizer.NULL_CHARACTER_TOKEN]: insertCharacters,
            [Tokenizer.WHITESPACE_CHARACTER_TOKEN]: insertCharacters,
            [Tokenizer.COMMENT_TOKEN]: ignoreToken,
            [Tokenizer.DOCTYPE_TOKEN]: ignoreToken,
            [Tokenizer.START_TAG_TOKEN]: ignoreToken,
            [Tokenizer.END_TAG_TOKEN]: endTagInText,
            [Tokenizer.EOF_TOKEN]: eofInText
        },
        [IN_TABLE_MODE]: {
            [Tokenizer.CHARACTER_TOKEN]: characterInTable,
            [Tokenizer.NULL_CHARACTER_TOKEN]: characterInTable,
            [Tokenizer.WHITESPACE_CHARACTER_TOKEN]: characterInTable,
            [Tokenizer.COMMENT_TOKEN]: appendComment,
            [Tokenizer.DOCTYPE_TOKEN]: ignoreToken,
            [Tokenizer.START_TAG_TOKEN]: startTagInTable,
            [Tokenizer.END_TAG_TOKEN]: endTagInTable,
            [Tokenizer.EOF_TOKEN]: eofInBody
        },
        [IN_TABLE_TEXT_MODE]: {
            [Tokenizer.CHARACTER_TOKEN]: characterInTableText,
            [Tokenizer.NULL_CHARACTER_TOKEN]: ignoreToken,
            [Tokenizer.WHITESPACE_CHARACTER_TOKEN]: whitespaceCharacterInTableText,
            [Tokenizer.COMMENT_TOKEN]: tokenInTableText,
            [Tokenizer.DOCTYPE_TOKEN]: tokenInTableText,
            [Tokenizer.START_TAG_TOKEN]: tokenInTableText,
            [Tokenizer.END_TAG_TOKEN]: tokenInTableText,
            [Tokenizer.EOF_TOKEN]: tokenInTableText
        },
        [IN_CAPTION_MODE]: {
            [Tokenizer.CHARACTER_TOKEN]: characterInBody,
            [Tokenizer.NULL_CHARACTER_TOKEN]: ignoreToken,
            [Tokenizer.WHITESPACE_CHARACTER_TOKEN]: whitespaceCharacterInBody,
            [Tokenizer.COMMENT_TOKEN]: appendComment,
            [Tokenizer.DOCTYPE_TOKEN]: ignoreToken,
            [Tokenizer.START_TAG_TOKEN]: startTagInCaption,
            [Tokenizer.END_TAG_TOKEN]: endTagInCaption,
            [Tokenizer.EOF_TOKEN]: eofInBody
        },
        [IN_COLUMN_GROUP_MODE]: {
            [Tokenizer.CHARACTER_TOKEN]: tokenInColumnGroup,
            [Tokenizer.NULL_CHARACTER_TOKEN]: tokenInColumnGroup,
            [Tokenizer.WHITESPACE_CHARACTER_TOKEN]: insertCharacters,
            [Tokenizer.COMMENT_TOKEN]: appendComment,
            [Tokenizer.DOCTYPE_TOKEN]: ignoreToken,
            [Tokenizer.START_TAG_TOKEN]: startTagInColumnGroup,
            [Tokenizer.END_TAG_TOKEN]: endTagInColumnGroup,
            [Tokenizer.EOF_TOKEN]: eofInBody
        },
        [IN_TABLE_BODY_MODE]: {
            [Tokenizer.CHARACTER_TOKEN]: characterInTable,
            [Tokenizer.NULL_CHARACTER_TOKEN]: characterInTable,
            [Tokenizer.WHITESPACE_CHARACTER_TOKEN]: characterInTable,
            [Tokenizer.COMMENT_TOKEN]: appendComment,
            [Tokenizer.DOCTYPE_TOKEN]: ignoreToken,
            [Tokenizer.START_TAG_TOKEN]: startTagInTableBody,
            [Tokenizer.END_TAG_TOKEN]: endTagInTableBody,
            [Tokenizer.EOF_TOKEN]: eofInBody
        },
        [IN_ROW_MODE]: {
            [Tokenizer.CHARACTER_TOKEN]: characterInTable,
            [Tokenizer.NULL_CHARACTER_TOKEN]: characterInTable,
            [Tokenizer.WHITESPACE_CHARACTER_TOKEN]: characterInTable,
            [Tokenizer.COMMENT_TOKEN]: appendComment,
            [Tokenizer.DOCTYPE_TOKEN]: ignoreToken,
            [Tokenizer.START_TAG_TOKEN]: startTagInRow,
            [Tokenizer.END_TAG_TOKEN]: endTagInRow,
            [Tokenizer.EOF_TOKEN]: eofInBody
        },
        [IN_CELL_MODE]: {
            [Tokenizer.CHARACTER_TOKEN]: characterInBody,
            [Tokenizer.NULL_CHARACTER_TOKEN]: ignoreToken,
            [Tokenizer.WHITESPACE_CHARACTER_TOKEN]: whitespaceCharacterInBody,
            [Tokenizer.COMMENT_TOKEN]: appendComment,
            [Tokenizer.DOCTYPE_TOKEN]: ignoreToken,
            [Tokenizer.START_TAG_TOKEN]: startTagInCell,
            [Tokenizer.END_TAG_TOKEN]: endTagInCell,
            [Tokenizer.EOF_TOKEN]: eofInBody
        },
        [IN_SELECT_MODE]: {
            [Tokenizer.CHARACTER_TOKEN]: insertCharacters,
            [Tokenizer.NULL_CHARACTER_TOKEN]: ignoreToken,
            [Tokenizer.WHITESPACE_CHARACTER_TOKEN]: insertCharacters,
            [Tokenizer.COMMENT_TOKEN]: appendComment,
            [Tokenizer.DOCTYPE_TOKEN]: ignoreToken,
            [Tokenizer.START_TAG_TOKEN]: startTagInSelect,
            [Tokenizer.END_TAG_TOKEN]: endTagInSelect,
            [Tokenizer.EOF_TOKEN]: eofInBody
        },
        [IN_SELECT_IN_TABLE_MODE]: {
            [Tokenizer.CHARACTER_TOKEN]: insertCharacters,
            [Tokenizer.NULL_CHARACTER_TOKEN]: ignoreToken,
            [Tokenizer.WHITESPACE_CHARACTER_TOKEN]: insertCharacters,
            [Tokenizer.COMMENT_TOKEN]: appendComment,
            [Tokenizer.DOCTYPE_TOKEN]: ignoreToken,
            [Tokenizer.START_TAG_TOKEN]: startTagInSelectInTable,
            [Tokenizer.END_TAG_TOKEN]: endTagInSelectInTable,
            [Tokenizer.EOF_TOKEN]: eofInBody
        },
        [IN_TEMPLATE_MODE]: {
            [Tokenizer.CHARACTER_TOKEN]: characterInBody,
            [Tokenizer.NULL_CHARACTER_TOKEN]: ignoreToken,
            [Tokenizer.WHITESPACE_CHARACTER_TOKEN]: whitespaceCharacterInBody,
            [Tokenizer.COMMENT_TOKEN]: appendComment,
            [Tokenizer.DOCTYPE_TOKEN]: ignoreToken,
            [Tokenizer.START_TAG_TOKEN]: startTagInTemplate,
            [Tokenizer.END_TAG_TOKEN]: endTagInTemplate,
            [Tokenizer.EOF_TOKEN]: eofInTemplate
        },
        [AFTER_BODY_MODE]: {
            [Tokenizer.CHARACTER_TOKEN]: tokenAfterBody,
            [Tokenizer.NULL_CHARACTER_TOKEN]: tokenAfterBody,
            [Tokenizer.WHITESPACE_CHARACTER_TOKEN]: whitespaceCharacterInBody,
            [Tokenizer.COMMENT_TOKEN]: appendCommentToRootHtmlElement,
            [Tokenizer.DOCTYPE_TOKEN]: ignoreToken,
            [Tokenizer.START_TAG_TOKEN]: startTagAfterBody,
            [Tokenizer.END_TAG_TOKEN]: endTagAfterBody,
            [Tokenizer.EOF_TOKEN]: stopParsing
        },
        [IN_FRAMESET_MODE]: {
            [Tokenizer.CHARACTER_TOKEN]: ignoreToken,
            [Tokenizer.NULL_CHARACTER_TOKEN]: ignoreToken,
            [Tokenizer.WHITESPACE_CHARACTER_TOKEN]: insertCharacters,
            [Tokenizer.COMMENT_TOKEN]: appendComment,
            [Tokenizer.DOCTYPE_TOKEN]: ignoreToken,
            [Tokenizer.START_TAG_TOKEN]: startTagInFrameset,
            [Tokenizer.END_TAG_TOKEN]: endTagInFrameset,
            [Tokenizer.EOF_TOKEN]: stopParsing
        },
        [AFTER_FRAMESET_MODE]: {
            [Tokenizer.CHARACTER_TOKEN]: ignoreToken,
            [Tokenizer.NULL_CHARACTER_TOKEN]: ignoreToken,
            [Tokenizer.WHITESPACE_CHARACTER_TOKEN]: insertCharacters,
            [Tokenizer.COMMENT_TOKEN]: appendComment,
            [Tokenizer.DOCTYPE_TOKEN]: ignoreToken,
            [Tokenizer.START_TAG_TOKEN]: startTagAfterFrameset,
            [Tokenizer.END_TAG_TOKEN]: endTagAfterFrameset,
            [Tokenizer.EOF_TOKEN]: stopParsing
        },
        [AFTER_AFTER_BODY_MODE]: {
            [Tokenizer.CHARACTER_TOKEN]: tokenAfterAfterBody,
            [Tokenizer.NULL_CHARACTER_TOKEN]: tokenAfterAfterBody,
            [Tokenizer.WHITESPACE_CHARACTER_TOKEN]: whitespaceCharacterInBody,
            [Tokenizer.COMMENT_TOKEN]: appendCommentToDocument,
            [Tokenizer.DOCTYPE_TOKEN]: ignoreToken,
            [Tokenizer.START_TAG_TOKEN]: startTagAfterAfterBody,
            [Tokenizer.END_TAG_TOKEN]: tokenAfterAfterBody,
            [Tokenizer.EOF_TOKEN]: stopParsing
        },
        [AFTER_AFTER_FRAMESET_MODE]: {
            [Tokenizer.CHARACTER_TOKEN]: ignoreToken,
            [Tokenizer.NULL_CHARACTER_TOKEN]: ignoreToken,
            [Tokenizer.WHITESPACE_CHARACTER_TOKEN]: whitespaceCharacterInBody,
            [Tokenizer.COMMENT_TOKEN]: appendCommentToDocument,
            [Tokenizer.DOCTYPE_TOKEN]: ignoreToken,
            [Tokenizer.START_TAG_TOKEN]: startTagAfterAfterFrameset,
            [Tokenizer.END_TAG_TOKEN]: ignoreToken,
            [Tokenizer.EOF_TOKEN]: stopParsing
        }
    };
    
    //Parser
    class Parser {
        constructor(options) {
            this.options = mergeOptions(DEFAULT_OPTIONS, options);
    
            this.treeAdapter = this.options.treeAdapter;
            this.pendingScript = null;
    
            if (this.options.sourceCodeLocationInfo) {
                Mixin.install(this, LocationInfoParserMixin);
            }
    
            if (this.options.onParseError) {
                Mixin.install(this, ErrorReportingParserMixin, { onParseError: this.options.onParseError });
            }
        }
    
        // API
        parse(html) {
            const document = this.treeAdapter.createDocument();
    
            this._bootstrap(document, null);
            this.tokenizer.write(html, true);
            this._runParsingLoop(null);
    
            return document;
        }
    
        parseFragment(html, fragmentContext) {
            //NOTE: use <template> element as a fragment context if context element was not provided,
            //so we will parse in "forgiving" manner
            if (!fragmentContext) {
                fragmentContext = this.treeAdapter.createElement($.TEMPLATE, NS.HTML, []);
            }
    
            //NOTE: create fake element which will be used as 'document' for fragment parsing.
            //This is important for jsdom there 'document' can't be recreated, therefore
            //fragment parsing causes messing of the main `document`.
            const documentMock = this.treeAdapter.createElement('documentmock', NS.HTML, []);
    
            this._bootstrap(documentMock, fragmentContext);
    
            if (this.treeAdapter.getTagName(fragmentContext) === $.TEMPLATE) {
                this._pushTmplInsertionMode(IN_TEMPLATE_MODE);
            }
    
            this._initTokenizerForFragmentParsing();
            this._insertFakeRootElement();
            this._resetInsertionMode();
            this._findFormInFragmentContext();
            this.tokenizer.write(html, true);
            this._runParsingLoop(null);
    
            const rootElement = this.treeAdapter.getFirstChild(documentMock);
            const fragment = this.treeAdapter.createDocumentFragment();
    
            this._adoptNodes(rootElement, fragment);
    
            return fragment;
        }
    
        //Bootstrap parser
        _bootstrap(document, fragmentContext) {
            this.tokenizer = new Tokenizer(this.options);
    
            this.stopped = false;
    
            this.insertionMode = INITIAL_MODE;
            this.originalInsertionMode = '';
    
            this.document = document;
            this.fragmentContext = fragmentContext;
    
            this.headElement = null;
            this.formElement = null;
    
            this.openElements = new OpenElementStack(this.document, this.treeAdapter);
            this.activeFormattingElements = new FormattingElementList(this.treeAdapter);
    
            this.tmplInsertionModeStack = [];
            this.tmplInsertionModeStackTop = -1;
            this.currentTmplInsertionMode = null;
    
            this.pendingCharacterTokens = [];
            this.hasNonWhitespacePendingCharacterToken = false;
    
            this.framesetOk = true;
            this.skipNextNewLine = false;
            this.fosterParentingEnabled = false;
        }
    
        //Errors
        _err() {
            // NOTE: err reporting is noop by default. Enabled by mixin.
        }
    
        //Parsing loop
        _runParsingLoop(scriptHandler) {
            while (!this.stopped) {
                this._setupTokenizerCDATAMode();
    
                const token = this.tokenizer.getNextToken();
    
                if (token.type === Tokenizer.HIBERNATION_TOKEN) {
                    break;
                }
    
                if (this.skipNextNewLine) {
                    this.skipNextNewLine = false;
    
                    if (token.type === Tokenizer.WHITESPACE_CHARACTER_TOKEN && token.chars[0] === '\n') {
                        if (token.chars.length === 1) {
                            continue;
                        }
    
                        token.chars = token.chars.substr(1);
                    }
                }
    
                this._processInputToken(token);
    
                if (scriptHandler && this.pendingScript) {
                    break;
                }
            }
        }
    
        runParsingLoopForCurrentChunk(writeCallback, scriptHandler) {
            this._runParsingLoop(scriptHandler);
    
            if (scriptHandler && this.pendingScript) {
                const script = this.pendingScript;
    
                this.pendingScript = null;
    
                scriptHandler(script);
    
                return;
            }
    
            if (writeCallback) {
                writeCallback();
            }
        }
    
        //Text parsing
        _setupTokenizerCDATAMode() {
            const current = this._getAdjustedCurrentElement();
    
            this.tokenizer.allowCDATA =
                current &&
                current !== this.document &&
                this.treeAdapter.getNamespaceURI(current) !== NS.HTML &&
                !this._isIntegrationPoint(current);
        }
    
        _switchToTextParsing(currentToken, nextTokenizerState) {
            this._insertElement(currentToken, NS.HTML);
            this.tokenizer.state = nextTokenizerState;
            this.originalInsertionMode = this.insertionMode;
            this.insertionMode = TEXT_MODE;
        }
    
        switchToPlaintextParsing() {
            this.insertionMode = TEXT_MODE;
            this.originalInsertionMode = IN_BODY_MODE;
            this.tokenizer.state = Tokenizer.MODE.PLAINTEXT;
        }
    
        //Fragment parsing
        _getAdjustedCurrentElement() {
            return this.openElements.stackTop === 0 && this.fragmentContext
                ? this.fragmentContext
                : this.openElements.current;
        }
    
        _findFormInFragmentContext() {
            let node = this.fragmentContext;
    
            do {
                if (this.treeAdapter.getTagName(node) === $.FORM) {
                    this.formElement = node;
                    break;
                }
    
                node = this.treeAdapter.getParentNode(node);
            } while (node);
        }
    
        _initTokenizerForFragmentParsing() {
            if (this.treeAdapter.getNamespaceURI(this.fragmentContext) === NS.HTML) {
                const tn = this.treeAdapter.getTagName(this.fragmentContext);
    
                if (tn === $.TITLE || tn === $.TEXTAREA) {
                    this.tokenizer.state = Tokenizer.MODE.RCDATA;
                } else if (
                    tn === $.STYLE ||
                    tn === $.XMP ||
                    tn === $.IFRAME ||
                    tn === $.NOEMBED ||
                    tn === $.NOFRAMES ||
                    tn === $.NOSCRIPT
                ) {
                    this.tokenizer.state = Tokenizer.MODE.RAWTEXT;
                } else if (tn === $.SCRIPT) {
                    this.tokenizer.state = Tokenizer.MODE.SCRIPT_DATA;
                } else if (tn === $.PLAINTEXT) {
                    this.tokenizer.state = Tokenizer.MODE.PLAINTEXT;
                }
            }
        }
    
        //Tree mutation
        _setDocumentType(token) {
            const name = token.name || '';
            const publicId = token.publicId || '';
            const systemId = token.systemId || '';
    
            this.treeAdapter.setDocumentType(this.document, name, publicId, systemId);
        }
    
        _attachElementToTree(element) {
            if (this._shouldFosterParentOnInsertion()) {
                this._fosterParentElement(element);
            } else {
                const parent = this.openElements.currentTmplContent || this.openElements.current;
    
                this.treeAdapter.appendChild(parent, element);
            }
        }
    
        _appendElement(token, namespaceURI) {
            const element = this.treeAdapter.createElement(token.tagName, namespaceURI, token.attrs);
    
            this._attachElementToTree(element);
        }
    
        _insertElement(token, namespaceURI) {
            const element = this.treeAdapter.createElement(token.tagName, namespaceURI, token.attrs);
    
            this._attachElementToTree(element);
            this.openElements.push(element);
        }
    
        _insertFakeElement(tagName) {
            const element = this.treeAdapter.createElement(tagName, NS.HTML, []);
    
            this._attachElementToTree(element);
            this.openElements.push(element);
        }
    
        _insertTemplate(token) {
            const tmpl = this.treeAdapter.createElement(token.tagName, NS.HTML, token.attrs);
            const content = this.treeAdapter.createDocumentFragment();
    
            this.treeAdapter.setTemplateContent(tmpl, content);
            this._attachElementToTree(tmpl);
            this.openElements.push(tmpl);
        }
    
        _insertFakeRootElement() {
            const element = this.treeAdapter.createElement($.HTML, NS.HTML, []);
    
            this.treeAdapter.appendChild(this.openElements.current, element);
            this.openElements.push(element);
        }
    
        _appendCommentNode(token, parent) {
            const commentNode = this.treeAdapter.createCommentNode(token.data);
    
            this.treeAdapter.appendChild(parent, commentNode);
        }
    
        _insertCharacters(token) {
            if (this._shouldFosterParentOnInsertion()) {
                this._fosterParentText(token.chars);
            } else {
                const parent = this.openElements.currentTmplContent || this.openElements.current;
    
                this.treeAdapter.insertText(parent, token.chars);
            }
        }
    
        _adoptNodes(donor, recipient) {
            for (let child = this.treeAdapter.getFirstChild(donor); child; child = this.treeAdapter.getFirstChild(donor)) {
                this.treeAdapter.detachNode(child);
                this.treeAdapter.appendChild(recipient, child);
            }
        }
    
        //Token processing
        _shouldProcessTokenInForeignContent(token) {
            const current = this._getAdjustedCurrentElement();
    
            if (!current || current === this.document) {
                return false;
            }
    
            const ns = this.treeAdapter.getNamespaceURI(current);
    
            if (ns === NS.HTML) {
                return false;
            }
    
            if (
                this.treeAdapter.getTagName(current) === $.ANNOTATION_XML &&
                ns === NS.MATHML &&
                token.type === Tokenizer.START_TAG_TOKEN &&
                token.tagName === $.SVG
            ) {
                return false;
            }
    
            const isCharacterToken =
                token.type === Tokenizer.CHARACTER_TOKEN ||
                token.type === Tokenizer.NULL_CHARACTER_TOKEN ||
                token.type === Tokenizer.WHITESPACE_CHARACTER_TOKEN;
    
            const isMathMLTextStartTag =
                token.type === Tokenizer.START_TAG_TOKEN && token.tagName !== $.MGLYPH && token.tagName !== $.MALIGNMARK;
    
            if ((isMathMLTextStartTag || isCharacterToken) && this._isIntegrationPoint(current, NS.MATHML)) {
                return false;
            }
    
            if (
                (token.type === Tokenizer.START_TAG_TOKEN || isCharacterToken) &&
                this._isIntegrationPoint(current, NS.HTML)
            ) {
                return false;
            }
    
            return token.type !== Tokenizer.EOF_TOKEN;
        }
    
        _processToken(token) {
            TOKEN_HANDLERS[this.insertionMode][token.type](this, token);
        }
    
        _processTokenInBodyMode(token) {
            TOKEN_HANDLERS[IN_BODY_MODE][token.type](this, token);
        }
    
        _processTokenInForeignContent(token) {
            if (token.type === Tokenizer.CHARACTER_TOKEN) {
                characterInForeignContent(this, token);
            } else if (token.type === Tokenizer.NULL_CHARACTER_TOKEN) {
                nullCharacterInForeignContent(this, token);
            } else if (token.type === Tokenizer.WHITESPACE_CHARACTER_TOKEN) {
                insertCharacters(this, token);
            } else if (token.type === Tokenizer.COMMENT_TOKEN) {
                appendComment(this, token);
            } else if (token.type === Tokenizer.START_TAG_TOKEN) {
                startTagInForeignContent(this, token);
            } else if (token.type === Tokenizer.END_TAG_TOKEN) {
                endTagInForeignContent(this, token);
            }
        }
    
        _processInputToken(token) {
            if (this._shouldProcessTokenInForeignContent(token)) {
                this._processTokenInForeignContent(token);
            } else {
                this._processToken(token);
            }
    
            if (token.type === Tokenizer.START_TAG_TOKEN && token.selfClosing && !token.ackSelfClosing) {
                this._err(ERR.nonVoidHtmlElementStartTagWithTrailingSolidus);
            }
        }
    
        //Integration points
        _isIntegrationPoint(element, foreignNS) {
            const tn = this.treeAdapter.getTagName(element);
            const ns = this.treeAdapter.getNamespaceURI(element);
            const attrs = this.treeAdapter.getAttrList(element);
    
            return foreignContent.isIntegrationPoint(tn, ns, attrs, foreignNS);
        }
    
        //Active formatting elements reconstruction
        _reconstructActiveFormattingElements() {
            const listLength = this.activeFormattingElements.length;
    
            if (listLength) {
                let unopenIdx = listLength;
                let entry = null;
    
                do {
                    unopenIdx--;
                    entry = this.activeFormattingElements.entries[unopenIdx];
    
                    if (entry.type === FormattingElementList.MARKER_ENTRY || this.openElements.contains(entry.element)) {
                        unopenIdx++;
                        break;
                    }
                } while (unopenIdx > 0);
    
                for (let i = unopenIdx; i < listLength; i++) {
                    entry = this.activeFormattingElements.entries[i];
                    this._insertElement(entry.token, this.treeAdapter.getNamespaceURI(entry.element));
                    entry.element = this.openElements.current;
                }
            }
        }
    
        //Close elements
        _closeTableCell() {
            this.openElements.generateImpliedEndTags();
            this.openElements.popUntilTableCellPopped();
            this.activeFormattingElements.clearToLastMarker();
            this.insertionMode = IN_ROW_MODE;
        }
    
        _closePElement() {
            this.openElements.generateImpliedEndTagsWithExclusion($.P);
            this.openElements.popUntilTagNamePopped($.P);
        }
    
        //Insertion modes
        _resetInsertionMode() {
            for (let i = this.openElements.stackTop, last = false; i >= 0; i--) {
                let element = this.openElements.items[i];
    
                if (i === 0) {
                    last = true;
    
                    if (this.fragmentContext) {
                        element = this.fragmentContext;
                    }
                }
    
                const tn = this.treeAdapter.getTagName(element);
                const newInsertionMode = INSERTION_MODE_RESET_MAP[tn];
    
                if (newInsertionMode) {
                    this.insertionMode = newInsertionMode;
                    break;
                } else if (!last && (tn === $.TD || tn === $.TH)) {
                    this.insertionMode = IN_CELL_MODE;
                    break;
                } else if (!last && tn === $.HEAD) {
                    this.insertionMode = IN_HEAD_MODE;
                    break;
                } else if (tn === $.SELECT) {
                    this._resetInsertionModeForSelect(i);
                    break;
                } else if (tn === $.TEMPLATE) {
                    this.insertionMode = this.currentTmplInsertionMode;
                    break;
                } else if (tn === $.HTML) {
                    this.insertionMode = this.headElement ? AFTER_HEAD_MODE : BEFORE_HEAD_MODE;
                    break;
                } else if (last) {
                    this.insertionMode = IN_BODY_MODE;
                    break;
                }
            }
        }
    
        _resetInsertionModeForSelect(selectIdx) {
            if (selectIdx > 0) {
                for (let i = selectIdx - 1; i > 0; i--) {
                    const ancestor = this.openElements.items[i];
                    const tn = this.treeAdapter.getTagName(ancestor);
    
                    if (tn === $.TEMPLATE) {
                        break;
                    } else if (tn === $.TABLE) {
                        this.insertionMode = IN_SELECT_IN_TABLE_MODE;
                        return;
                    }
                }
            }
    
            this.insertionMode = IN_SELECT_MODE;
        }
    
        _pushTmplInsertionMode(mode) {
            this.tmplInsertionModeStack.push(mode);
            this.tmplInsertionModeStackTop++;
            this.currentTmplInsertionMode = mode;
        }
    
        _popTmplInsertionMode() {
            this.tmplInsertionModeStack.pop();
            this.tmplInsertionModeStackTop--;
            this.currentTmplInsertionMode = this.tmplInsertionModeStack[this.tmplInsertionModeStackTop];
        }
    
        //Foster parenting
        _isElementCausesFosterParenting(element) {
            const tn = this.treeAdapter.getTagName(element);
    
            return tn === $.TABLE || tn === $.TBODY || tn === $.TFOOT || tn === $.THEAD || tn === $.TR;
        }
    
        _shouldFosterParentOnInsertion() {
            return this.fosterParentingEnabled && this._isElementCausesFosterParenting(this.openElements.current);
        }
    
        _findFosterParentingLocation() {
            const location = {
                parent: null,
                beforeElement: null
            };
    
            for (let i = this.openElements.stackTop; i >= 0; i--) {
                const openElement = this.openElements.items[i];
                const tn = this.treeAdapter.getTagName(openElement);
                const ns = this.treeAdapter.getNamespaceURI(openElement);
    
                if (tn === $.TEMPLATE && ns === NS.HTML) {
                    location.parent = this.treeAdapter.getTemplateContent(openElement);
                    break;
                } else if (tn === $.TABLE) {
                    location.parent = this.treeAdapter.getParentNode(openElement);
    
                    if (location.parent) {
                        location.beforeElement = openElement;
                    } else {
                        location.parent = this.openElements.items[i - 1];
                    }
    
                    break;
                }
            }
    
            if (!location.parent) {
                location.parent = this.openElements.items[0];
            }
    
            return location;
        }
    
        _fosterParentElement(element) {
            const location = this._findFosterParentingLocation();
    
            if (location.beforeElement) {
                this.treeAdapter.insertBefore(location.parent, element, location.beforeElement);
            } else {
                this.treeAdapter.appendChild(location.parent, element);
            }
        }
    
        _fosterParentText(chars) {
            const location = this._findFosterParentingLocation();
    
            if (location.beforeElement) {
                this.treeAdapter.insertTextBefore(location.parent, chars, location.beforeElement);
            } else {
                this.treeAdapter.insertText(location.parent, chars);
            }
        }
    
        //Special elements
        _isSpecialElement(element) {
            const tn = this.treeAdapter.getTagName(element);
            const ns = this.treeAdapter.getNamespaceURI(element);
    
            return HTML.SPECIAL_ELEMENTS[ns][tn];
        }
    }
    
    module.exports = Parser;
    
    //Adoption agency algorithm
    //(see: http://www.whatwg.org/specs/web-apps/current-work/multipage/tree-construction.html#adoptionAgency)
    //------------------------------------------------------------------
    
    //Steps 5-8 of the algorithm
    function aaObtainFormattingElementEntry(p, token) {
        let formattingElementEntry = p.activeFormattingElements.getElementEntryInScopeWithTagName(token.tagName);
    
        if (formattingElementEntry) {
            if (!p.openElements.contains(formattingElementEntry.element)) {
                p.activeFormattingElements.removeEntry(formattingElementEntry);
                formattingElementEntry = null;
            } else if (!p.openElements.hasInScope(token.tagName)) {
                formattingElementEntry = null;
            }
        } else {
            genericEndTagInBody(p, token);
        }
    
        return formattingElementEntry;
    }
    
    //Steps 9 and 10 of the algorithm
    function aaObtainFurthestBlock(p, formattingElementEntry) {
        let furthestBlock = null;
    
        for (let i = p.openElements.stackTop; i >= 0; i--) {
            const element = p.openElements.items[i];
    
            if (element === formattingElementEntry.element) {
                break;
            }
    
            if (p._isSpecialElement(element)) {
                furthestBlock = element;
            }
        }
    
        if (!furthestBlock) {
            p.openElements.popUntilElementPopped(formattingElementEntry.element);
            p.activeFormattingElements.removeEntry(formattingElementEntry);
        }
    
        return furthestBlock;
    }
    
    //Step 13 of the algorithm
    function aaInnerLoop(p, furthestBlock, formattingElement) {
        let lastElement = furthestBlock;
        let nextElement = p.openElements.getCommonAncestor(furthestBlock);
    
        for (let i = 0, element = nextElement; element !== formattingElement; i++, element = nextElement) {
            //NOTE: store next element for the next loop iteration (it may be deleted from the stack by step 9.5)
            nextElement = p.openElements.getCommonAncestor(element);
    
            const elementEntry = p.activeFormattingElements.getElementEntry(element);
            const counterOverflow = elementEntry && i >= AA_INNER_LOOP_ITER;
            const shouldRemoveFromOpenElements = !elementEntry || counterOverflow;
    
            if (shouldRemoveFromOpenElements) {
                if (counterOverflow) {
                    p.activeFormattingElements.removeEntry(elementEntry);
                }
    
                p.openElements.remove(element);
            } else {
                element = aaRecreateElementFromEntry(p, elementEntry);
    
                if (lastElement === furthestBlock) {
                    p.activeFormattingElements.bookmark = elementEntry;
                }
    
                p.treeAdapter.detachNode(lastElement);
                p.treeAdapter.appendChild(element, lastElement);
                lastElement = element;
            }
        }
    
        return lastElement;
    }
    
    //Step 13.7 of the algorithm
    function aaRecreateElementFromEntry(p, elementEntry) {
        const ns = p.treeAdapter.getNamespaceURI(elementEntry.element);
        const newElement = p.treeAdapter.createElement(elementEntry.token.tagName, ns, elementEntry.token.attrs);
    
        p.openElements.replace(elementEntry.element, newElement);
        elementEntry.element = newElement;
    
        return newElement;
    }
    
    //Step 14 of the algorithm
    function aaInsertLastNodeInCommonAncestor(p, commonAncestor, lastElement) {
        if (p._isElementCausesFosterParenting(commonAncestor)) {
            p._fosterParentElement(lastElement);
        } else {
            const tn = p.treeAdapter.getTagName(commonAncestor);
            const ns = p.treeAdapter.getNamespaceURI(commonAncestor);
    
            if (tn === $.TEMPLATE && ns === NS.HTML) {
                commonAncestor = p.treeAdapter.getTemplateContent(commonAncestor);
            }
    
            p.treeAdapter.appendChild(commonAncestor, lastElement);
        }
    }
    
    //Steps 15-19 of the algorithm
    function aaReplaceFormattingElement(p, furthestBlock, formattingElementEntry) {
        const ns = p.treeAdapter.getNamespaceURI(formattingElementEntry.element);
        const token = formattingElementEntry.token;
        const newElement = p.treeAdapter.createElement(token.tagName, ns, token.attrs);
    
        p._adoptNodes(furthestBlock, newElement);
        p.treeAdapter.appendChild(furthestBlock, newElement);
    
        p.activeFormattingElements.insertElementAfterBookmark(newElement, formattingElementEntry.token);
        p.activeFormattingElements.removeEntry(formattingElementEntry);
    
        p.openElements.remove(formattingElementEntry.element);
        p.openElements.insertAfter(furthestBlock, newElement);
    }
    
    //Algorithm entry point
    function callAdoptionAgency(p, token) {
        let formattingElementEntry;
    
        for (let i = 0; i < AA_OUTER_LOOP_ITER; i++) {
            formattingElementEntry = aaObtainFormattingElementEntry(p, token, formattingElementEntry);
    
            if (!formattingElementEntry) {
                break;
            }
    
            const furthestBlock = aaObtainFurthestBlock(p, formattingElementEntry);
    
            if (!furthestBlock) {
                break;
            }
    
            p.activeFormattingElements.bookmark = formattingElementEntry;
    
            const lastElement = aaInnerLoop(p, furthestBlock, formattingElementEntry.element);
            const commonAncestor = p.openElements.getCommonAncestor(formattingElementEntry.element);
    
            p.treeAdapter.detachNode(lastElement);
            aaInsertLastNodeInCommonAncestor(p, commonAncestor, lastElement);
            aaReplaceFormattingElement(p, furthestBlock, formattingElementEntry);
        }
    }
    
    //Generic token handlers
    //------------------------------------------------------------------
    function ignoreToken() {
        //NOTE: do nothing =)
    }
    
    function misplacedDoctype(p) {
        p._err(ERR.misplacedDoctype);
    }
    
    function appendComment(p, token) {
        p._appendCommentNode(token, p.openElements.currentTmplContent || p.openElements.current);
    }
    
    function appendCommentToRootHtmlElement(p, token) {
        p._appendCommentNode(token, p.openElements.items[0]);
    }
    
    function appendCommentToDocument(p, token) {
        p._appendCommentNode(token, p.document);
    }
    
    function insertCharacters(p, token) {
        p._insertCharacters(token);
    }
    
    function stopParsing(p) {
        p.stopped = true;
    }
    
    // The "initial" insertion mode
    //------------------------------------------------------------------
    function doctypeInInitialMode(p, token) {
        p._setDocumentType(token);
    
        const mode = token.forceQuirks ? HTML.DOCUMENT_MODE.QUIRKS : doctype.getDocumentMode(token);
    
        if (!doctype.isConforming(token)) {
            p._err(ERR.nonConformingDoctype);
        }
    
        p.treeAdapter.setDocumentMode(p.document, mode);
    
        p.insertionMode = BEFORE_HTML_MODE;
    }
    
    function tokenInInitialMode(p, token) {
        p._err(ERR.missingDoctype, { beforeToken: true });
        p.treeAdapter.setDocumentMode(p.document, HTML.DOCUMENT_MODE.QUIRKS);
        p.insertionMode = BEFORE_HTML_MODE;
        p._processToken(token);
    }
    
    // The "before html" insertion mode
    //------------------------------------------------------------------
    function startTagBeforeHtml(p, token) {
        if (token.tagName === $.HTML) {
            p._insertElement(token, NS.HTML);
            p.insertionMode = BEFORE_HEAD_MODE;
        } else {
            tokenBeforeHtml(p, token);
        }
    }
    
    function endTagBeforeHtml(p, token) {
        const tn = token.tagName;
    
        if (tn === $.HTML || tn === $.HEAD || tn === $.BODY || tn === $.BR) {
            tokenBeforeHtml(p, token);
        }
    }
    
    function tokenBeforeHtml(p, token) {
        p._insertFakeRootElement();
        p.insertionMode = BEFORE_HEAD_MODE;
        p._processToken(token);
    }
    
    // The "before head" insertion mode
    //------------------------------------------------------------------
    function startTagBeforeHead(p, token) {
        const tn = token.tagName;
    
        if (tn === $.HTML) {
            startTagInBody(p, token);
        } else if (tn === $.HEAD) {
            p._insertElement(token, NS.HTML);
            p.headElement = p.openElements.current;
            p.insertionMode = IN_HEAD_MODE;
        } else {
            tokenBeforeHead(p, token);
        }
    }
    
    function endTagBeforeHead(p, token) {
        const tn = token.tagName;
    
        if (tn === $.HEAD || tn === $.BODY || tn === $.HTML || tn === $.BR) {
            tokenBeforeHead(p, token);
        } else {
            p._err(ERR.endTagWithoutMatchingOpenElement);
        }
    }
    
    function tokenBeforeHead(p, token) {
        p._insertFakeElement($.HEAD);
        p.headElement = p.openElements.current;
        p.insertionMode = IN_HEAD_MODE;
        p._processToken(token);
    }
    
    // The "in head" insertion mode
    //------------------------------------------------------------------
    function startTagInHead(p, token) {
        const tn = token.tagName;
    
        if (tn === $.HTML) {
            startTagInBody(p, token);
        } else if (tn === $.BASE || tn === $.BASEFONT || tn === $.BGSOUND || tn === $.LINK || tn === $.META) {
            p._appendElement(token, NS.HTML);
            token.ackSelfClosing = true;
        } else if (tn === $.TITLE) {
            p._switchToTextParsing(token, Tokenizer.MODE.RCDATA);
        } else if (tn === $.NOSCRIPT) {
            if (p.options.scriptingEnabled) {
                p._switchToTextParsing(token, Tokenizer.MODE.RAWTEXT);
            } else {
                p._insertElement(token, NS.HTML);
                p.insertionMode = IN_HEAD_NO_SCRIPT_MODE;
            }
        } else if (tn === $.NOFRAMES || tn === $.STYLE) {
            p._switchToTextParsing(token, Tokenizer.MODE.RAWTEXT);
        } else if (tn === $.SCRIPT) {
            p._switchToTextParsing(token, Tokenizer.MODE.SCRIPT_DATA);
        } else if (tn === $.TEMPLATE) {
            p._insertTemplate(token, NS.HTML);
            p.activeFormattingElements.insertMarker();
            p.framesetOk = false;
            p.insertionMode = IN_TEMPLATE_MODE;
            p._pushTmplInsertionMode(IN_TEMPLATE_MODE);
        } else if (tn === $.HEAD) {
            p._err(ERR.misplacedStartTagForHeadElement);
        } else {
            tokenInHead(p, token);
        }
    }
    
    function endTagInHead(p, token) {
        const tn = token.tagName;
    
        if (tn === $.HEAD) {
            p.openElements.pop();
            p.insertionMode = AFTER_HEAD_MODE;
        } else if (tn === $.BODY || tn === $.BR || tn === $.HTML) {
            tokenInHead(p, token);
        } else if (tn === $.TEMPLATE) {
            if (p.openElements.tmplCount > 0) {
                p.openElements.generateImpliedEndTagsThoroughly();
    
                if (p.openElements.currentTagName !== $.TEMPLATE) {
                    p._err(ERR.closingOfElementWithOpenChildElements);
                }
    
                p.openElements.popUntilTagNamePopped($.TEMPLATE);
                p.activeFormattingElements.clearToLastMarker();
                p._popTmplInsertionMode();
                p._resetInsertionMode();
            } else {
                p._err(ERR.endTagWithoutMatchingOpenElement);
            }
        } else {
            p._err(ERR.endTagWithoutMatchingOpenElement);
        }
    }
    
    function tokenInHead(p, token) {
        p.openElements.pop();
        p.insertionMode = AFTER_HEAD_MODE;
        p._processToken(token);
    }
    
    // The "in head no script" insertion mode
    //------------------------------------------------------------------
    function startTagInHeadNoScript(p, token) {
        const tn = token.tagName;
    
        if (tn === $.HTML) {
            startTagInBody(p, token);
        } else if (
            tn === $.BASEFONT ||
            tn === $.BGSOUND ||
            tn === $.HEAD ||
            tn === $.LINK ||
            tn === $.META ||
            tn === $.NOFRAMES ||
            tn === $.STYLE
        ) {
            startTagInHead(p, token);
        } else if (tn === $.NOSCRIPT) {
            p._err(ERR.nestedNoscriptInHead);
        } else {
            tokenInHeadNoScript(p, token);
        }
    }
    
    function endTagInHeadNoScript(p, token) {
        const tn = token.tagName;
    
        if (tn === $.NOSCRIPT) {
            p.openElements.pop();
            p.insertionMode = IN_HEAD_MODE;
        } else if (tn === $.BR) {
            tokenInHeadNoScript(p, token);
        } else {
            p._err(ERR.endTagWithoutMatchingOpenElement);
        }
    }
    
    function tokenInHeadNoScript(p, token) {
        const errCode =
            token.type === Tokenizer.EOF_TOKEN ? ERR.openElementsLeftAfterEof : ERR.disallowedContentInNoscriptInHead;
    
        p._err(errCode);
        p.openElements.pop();
        p.insertionMode = IN_HEAD_MODE;
        p._processToken(token);
    }
    
    // The "after head" insertion mode
    //------------------------------------------------------------------
    function startTagAfterHead(p, token) {
        const tn = token.tagName;
    
        if (tn === $.HTML) {
            startTagInBody(p, token);
        } else if (tn === $.BODY) {
            p._insertElement(token, NS.HTML);
            p.framesetOk = false;
            p.insertionMode = IN_BODY_MODE;
        } else if (tn === $.FRAMESET) {
            p._insertElement(token, NS.HTML);
            p.insertionMode = IN_FRAMESET_MODE;
        } else if (
            tn === $.BASE ||
            tn === $.BASEFONT ||
            tn === $.BGSOUND ||
            tn === $.LINK ||
            tn === $.META ||
            tn === $.NOFRAMES ||
            tn === $.SCRIPT ||
            tn === $.STYLE ||
            tn === $.TEMPLATE ||
            tn === $.TITLE
        ) {
            p._err(ERR.abandonedHeadElementChild);
            p.openElements.push(p.headElement);
            startTagInHead(p, token);
            p.openElements.remove(p.headElement);
        } else if (tn === $.HEAD) {
            p._err(ERR.misplacedStartTagForHeadElement);
        } else {
            tokenAfterHead(p, token);
        }
    }
    
    function endTagAfterHead(p, token) {
        const tn = token.tagName;
    
        if (tn === $.BODY || tn === $.HTML || tn === $.BR) {
            tokenAfterHead(p, token);
        } else if (tn === $.TEMPLATE) {
            endTagInHead(p, token);
        } else {
            p._err(ERR.endTagWithoutMatchingOpenElement);
        }
    }
    
    function tokenAfterHead(p, token) {
        p._insertFakeElement($.BODY);
        p.insertionMode = IN_BODY_MODE;
        p._processToken(token);
    }
    
    // The "in body" insertion mode
    //------------------------------------------------------------------
    function whitespaceCharacterInBody(p, token) {
        p._reconstructActiveFormattingElements();
        p._insertCharacters(token);
    }
    
    function characterInBody(p, token) {
        p._reconstructActiveFormattingElements();
        p._insertCharacters(token);
        p.framesetOk = false;
    }
    
    function htmlStartTagInBody(p, token) {
        if (p.openElements.tmplCount === 0) {
            p.treeAdapter.adoptAttributes(p.openElements.items[0], token.attrs);
        }
    }
    
    function bodyStartTagInBody(p, token) {
        const bodyElement = p.openElements.tryPeekProperlyNestedBodyElement();
    
        if (bodyElement && p.openElements.tmplCount === 0) {
            p.framesetOk = false;
            p.treeAdapter.adoptAttributes(bodyElement, token.attrs);
        }
    }
    
    function framesetStartTagInBody(p, token) {
        const bodyElement = p.openElements.tryPeekProperlyNestedBodyElement();
    
        if (p.framesetOk && bodyElement) {
            p.treeAdapter.detachNode(bodyElement);
            p.openElements.popAllUpToHtmlElement();
            p._insertElement(token, NS.HTML);
            p.insertionMode = IN_FRAMESET_MODE;
        }
    }
    
    function addressStartTagInBody(p, token) {
        if (p.openElements.hasInButtonScope($.P)) {
            p._closePElement();
        }
    
        p._insertElement(token, NS.HTML);
    }
    
    function numberedHeaderStartTagInBody(p, token) {
        if (p.openElements.hasInButtonScope($.P)) {
            p._closePElement();
        }
    
        const tn = p.openElements.currentTagName;
    
        if (tn === $.H1 || tn === $.H2 || tn === $.H3 || tn === $.H4 || tn === $.H5 || tn === $.H6) {
            p.openElements.pop();
        }
    
        p._insertElement(token, NS.HTML);
    }
    
    function preStartTagInBody(p, token) {
        if (p.openElements.hasInButtonScope($.P)) {
            p._closePElement();
        }
    
        p._insertElement(token, NS.HTML);
        //NOTE: If the next token is a U+000A LINE FEED (LF) character token, then ignore that token and move
        //on to the next one. (Newlines at the start of pre blocks are ignored as an authoring convenience.)
        p.skipNextNewLine = true;
        p.framesetOk = false;
    }
    
    function formStartTagInBody(p, token) {
        const inTemplate = p.openElements.tmplCount > 0;
    
        if (!p.formElement || inTemplate) {
            if (p.openElements.hasInButtonScope($.P)) {
                p._closePElement();
            }
    
            p._insertElement(token, NS.HTML);
    
            if (!inTemplate) {
                p.formElement = p.openElements.current;
            }
        }
    }
    
    function listItemStartTagInBody(p, token) {
        p.framesetOk = false;
    
        const tn = token.tagName;
    
        for (let i = p.openElements.stackTop; i >= 0; i--) {
            const element = p.openElements.items[i];
            const elementTn = p.treeAdapter.getTagName(element);
            let closeTn = null;
    
            if (tn === $.LI && elementTn === $.LI) {
                closeTn = $.LI;
            } else if ((tn === $.DD || tn === $.DT) && (elementTn === $.DD || elementTn === $.DT)) {
                closeTn = elementTn;
            }
    
            if (closeTn) {
                p.openElements.generateImpliedEndTagsWithExclusion(closeTn);
                p.openElements.popUntilTagNamePopped(closeTn);
                break;
            }
    
            if (elementTn !== $.ADDRESS && elementTn !== $.DIV && elementTn !== $.P && p._isSpecialElement(element)) {
                break;
            }
        }
    
        if (p.openElements.hasInButtonScope($.P)) {
            p._closePElement();
        }
    
        p._insertElement(token, NS.HTML);
    }
    
    function plaintextStartTagInBody(p, token) {
        if (p.openElements.hasInButtonScope($.P)) {
            p._closePElement();
        }
    
        p._insertElement(token, NS.HTML);
        p.tokenizer.state = Tokenizer.MODE.PLAINTEXT;
    }
    
    function buttonStartTagInBody(p, token) {
        if (p.openElements.hasInScope($.BUTTON)) {
            p.openElements.generateImpliedEndTags();
            p.openElements.popUntilTagNamePopped($.BUTTON);
        }
    
        p._reconstructActiveFormattingElements();
        p._insertElement(token, NS.HTML);
        p.framesetOk = false;
    }
    
    function aStartTagInBody(p, token) {
        const activeElementEntry = p.activeFormattingElements.getElementEntryInScopeWithTagName($.A);
    
        if (activeElementEntry) {
            callAdoptionAgency(p, token);
            p.openElements.remove(activeElementEntry.element);
            p.activeFormattingElements.removeEntry(activeElementEntry);
        }
    
        p._reconstructActiveFormattingElements();
        p._insertElement(token, NS.HTML);
        p.activeFormattingElements.pushElement(p.openElements.current, token);
    }
    
    function bStartTagInBody(p, token) {
        p._reconstructActiveFormattingElements();
        p._insertElement(token, NS.HTML);
        p.activeFormattingElements.pushElement(p.openElements.current, token);
    }
    
    function nobrStartTagInBody(p, token) {
        p._reconstructActiveFormattingElements();
    
        if (p.openElements.hasInScope($.NOBR)) {
            callAdoptionAgency(p, token);
            p._reconstructActiveFormattingElements();
        }
    
        p._insertElement(token, NS.HTML);
        p.activeFormattingElements.pushElement(p.openElements.current, token);
    }
    
    function appletStartTagInBody(p, token) {
        p._reconstructActiveFormattingElements();
        p._insertElement(token, NS.HTML);
        p.activeFormattingElements.insertMarker();
        p.framesetOk = false;
    }
    
    function tableStartTagInBody(p, token) {
        if (
            p.treeAdapter.getDocumentMode(p.document) !== HTML.DOCUMENT_MODE.QUIRKS &&
            p.openElements.hasInButtonScope($.P)
        ) {
            p._closePElement();
        }
    
        p._insertElement(token, NS.HTML);
        p.framesetOk = false;
        p.insertionMode = IN_TABLE_MODE;
    }
    
    function areaStartTagInBody(p, token) {
        p._reconstructActiveFormattingElements();
        p._appendElement(token, NS.HTML);
        p.framesetOk = false;
        token.ackSelfClosing = true;
    }
    
    function inputStartTagInBody(p, token) {
        p._reconstructActiveFormattingElements();
        p._appendElement(token, NS.HTML);
    
        const inputType = Tokenizer.getTokenAttr(token, ATTRS.TYPE);
    
        if (!inputType || inputType.toLowerCase() !== HIDDEN_INPUT_TYPE) {
            p.framesetOk = false;
        }
    
        token.ackSelfClosing = true;
    }
    
    function paramStartTagInBody(p, token) {
        p._appendElement(token, NS.HTML);
        token.ackSelfClosing = true;
    }
    
    function hrStartTagInBody(p, token) {
        if (p.openElements.hasInButtonScope($.P)) {
            p._closePElement();
        }
    
        p._appendElement(token, NS.HTML);
        p.framesetOk = false;
        token.ackSelfClosing = true;
    }
    
    function imageStartTagInBody(p, token) {
        token.tagName = $.IMG;
        areaStartTagInBody(p, token);
    }
    
    function textareaStartTagInBody(p, token) {
        p._insertElement(token, NS.HTML);
        //NOTE: If the next token is a U+000A LINE FEED (LF) character token, then ignore that token and move
        //on to the next one. (Newlines at the start of textarea elements are ignored as an authoring convenience.)
        p.skipNextNewLine = true;
        p.tokenizer.state = Tokenizer.MODE.RCDATA;
        p.originalInsertionMode = p.insertionMode;
        p.framesetOk = false;
        p.insertionMode = TEXT_MODE;
    }
    
    function xmpStartTagInBody(p, token) {
        if (p.openElements.hasInButtonScope($.P)) {
            p._closePElement();
        }
    
        p._reconstructActiveFormattingElements();
        p.framesetOk = false;
        p._switchToTextParsing(token, Tokenizer.MODE.RAWTEXT);
    }
    
    function iframeStartTagInBody(p, token) {
        p.framesetOk = false;
        p._switchToTextParsing(token, Tokenizer.MODE.RAWTEXT);
    }
    
    //NOTE: here we assume that we always act as an user agent with enabled plugins, so we parse
    //<noembed> as a rawtext.
    function noembedStartTagInBody(p, token) {
        p._switchToTextParsing(token, Tokenizer.MODE.RAWTEXT);
    }
    
    function selectStartTagInBody(p, token) {
        p._reconstructActiveFormattingElements();
        p._insertElement(token, NS.HTML);
        p.framesetOk = false;
    
        if (
            p.insertionMode === IN_TABLE_MODE ||
            p.insertionMode === IN_CAPTION_MODE ||
            p.insertionMode === IN_TABLE_BODY_MODE ||
            p.insertionMode === IN_ROW_MODE ||
            p.insertionMode === IN_CELL_MODE
        ) {
            p.insertionMode = IN_SELECT_IN_TABLE_MODE;
        } else {
            p.insertionMode = IN_SELECT_MODE;
        }
    }
    
    function optgroupStartTagInBody(p, token) {
        if (p.openElements.currentTagName === $.OPTION) {
            p.openElements.pop();
        }
    
        p._reconstructActiveFormattingElements();
        p._insertElement(token, NS.HTML);
    }
    
    function rbStartTagInBody(p, token) {
        if (p.openElements.hasInScope($.RUBY)) {
            p.openElements.generateImpliedEndTags();
        }
    
        p._insertElement(token, NS.HTML);
    }
    
    function rtStartTagInBody(p, token) {
        if (p.openElements.hasInScope($.RUBY)) {
            p.openElements.generateImpliedEndTagsWithExclusion($.RTC);
        }
    
        p._insertElement(token, NS.HTML);
    }
    
    function menuStartTagInBody(p, token) {
        if (p.openElements.hasInButtonScope($.P)) {
            p._closePElement();
        }
    
        p._insertElement(token, NS.HTML);
    }
    
    function mathStartTagInBody(p, token) {
        p._reconstructActiveFormattingElements();
    
        foreignContent.adjustTokenMathMLAttrs(token);
        foreignContent.adjustTokenXMLAttrs(token);
    
        if (token.selfClosing) {
            p._appendElement(token, NS.MATHML);
        } else {
            p._insertElement(token, NS.MATHML);
        }
    
        token.ackSelfClosing = true;
    }
    
    function svgStartTagInBody(p, token) {
        p._reconstructActiveFormattingElements();
    
        foreignContent.adjustTokenSVGAttrs(token);
        foreignContent.adjustTokenXMLAttrs(token);
    
        if (token.selfClosing) {
            p._appendElement(token, NS.SVG);
        } else {
            p._insertElement(token, NS.SVG);
        }
    
        token.ackSelfClosing = true;
    }
    
    function genericStartTagInBody(p, token) {
        p._reconstructActiveFormattingElements();
        p._insertElement(token, NS.HTML);
    }
    
    //OPTIMIZATION: Integer comparisons are low-cost, so we can use very fast tag name length filters here.
    //It's faster than using dictionary.
    function startTagInBody(p, token) {
        const tn = token.tagName;
    
        switch (tn.length) {
            case 1:
                if (tn === $.I || tn === $.S || tn === $.B || tn === $.U) {
                    bStartTagInBody(p, token);
                } else if (tn === $.P) {
                    addressStartTagInBody(p, token);
                } else if (tn === $.A) {
                    aStartTagInBody(p, token);
                } else {
                    genericStartTagInBody(p, token);
                }
    
                break;
    
            case 2:
                if (tn === $.DL || tn === $.OL || tn === $.UL) {
                    addressStartTagInBody(p, token);
                } else if (tn === $.H1 || tn === $.H2 || tn === $.H3 || tn === $.H4 || tn === $.H5 || tn === $.H6) {
                    numberedHeaderStartTagInBody(p, token);
                } else if (tn === $.LI || tn === $.DD || tn === $.DT) {
                    listItemStartTagInBody(p, token);
                } else if (tn === $.EM || tn === $.TT) {
                    bStartTagInBody(p, token);
                } else if (tn === $.BR) {
                    areaStartTagInBody(p, token);
                } else if (tn === $.HR) {
                    hrStartTagInBody(p, token);
                } else if (tn === $.RB) {
                    rbStartTagInBody(p, token);
                } else if (tn === $.RT || tn === $.RP) {
                    rtStartTagInBody(p, token);
                } else if (tn !== $.TH && tn !== $.TD && tn !== $.TR) {
                    genericStartTagInBody(p, token);
                }
    
                break;
    
            case 3:
                if (tn === $.DIV || tn === $.DIR || tn === $.NAV) {
                    addressStartTagInBody(p, token);
                } else if (tn === $.PRE) {
                    preStartTagInBody(p, token);
                } else if (tn === $.BIG) {
                    bStartTagInBody(p, token);
                } else if (tn === $.IMG || tn === $.WBR) {
                    areaStartTagInBody(p, token);
                } else if (tn === $.XMP) {
                    xmpStartTagInBody(p, token);
                } else if (tn === $.SVG) {
                    svgStartTagInBody(p, token);
                } else if (tn === $.RTC) {
                    rbStartTagInBody(p, token);
                } else if (tn !== $.COL) {
                    genericStartTagInBody(p, token);
                }
    
                break;
    
            case 4:
                if (tn === $.HTML) {
                    htmlStartTagInBody(p, token);
                } else if (tn === $.BASE || tn === $.LINK || tn === $.META) {
                    startTagInHead(p, token);
                } else if (tn === $.BODY) {
                    bodyStartTagInBody(p, token);
                } else if (tn === $.MAIN || tn === $.MENU) {
                    addressStartTagInBody(p, token);
                } else if (tn === $.FORM) {
                    formStartTagInBody(p, token);
                } else if (tn === $.CODE || tn === $.FONT) {
                    bStartTagInBody(p, token);
                } else if (tn === $.NOBR) {
                    nobrStartTagInBody(p, token);
                } else if (tn === $.AREA) {
                    areaStartTagInBody(p, token);
                } else if (tn === $.MATH) {
                    mathStartTagInBody(p, token);
                } else if (tn === $.MENU) {
                    menuStartTagInBody(p, token);
                } else if (tn !== $.HEAD) {
                    genericStartTagInBody(p, token);
                }
    
                break;
    
            case 5:
                if (tn === $.STYLE || tn === $.TITLE) {
                    startTagInHead(p, token);
                } else if (tn === $.ASIDE) {
                    addressStartTagInBody(p, token);
                } else if (tn === $.SMALL) {
                    bStartTagInBody(p, token);
                } else if (tn === $.TABLE) {
                    tableStartTagInBody(p, token);
                } else if (tn === $.EMBED) {
                    areaStartTagInBody(p, token);
                } else if (tn === $.INPUT) {
                    inputStartTagInBody(p, token);
                } else if (tn === $.PARAM || tn === $.TRACK) {
                    paramStartTagInBody(p, token);
                } else if (tn === $.IMAGE) {
                    imageStartTagInBody(p, token);
                } else if (tn !== $.FRAME && tn !== $.TBODY && tn !== $.TFOOT && tn !== $.THEAD) {
                    genericStartTagInBody(p, token);
                }
    
                break;
    
            case 6:
                if (tn === $.SCRIPT) {
                    startTagInHead(p, token);
                } else if (
                    tn === $.CENTER ||
                    tn === $.FIGURE ||
                    tn === $.FOOTER ||
                    tn === $.HEADER ||
                    tn === $.HGROUP ||
                    tn === $.DIALOG
                ) {
                    addressStartTagInBody(p, token);
                } else if (tn === $.BUTTON) {
                    buttonStartTagInBody(p, token);
                } else if (tn === $.STRIKE || tn === $.STRONG) {
                    bStartTagInBody(p, token);
                } else if (tn === $.APPLET || tn === $.OBJECT) {
                    appletStartTagInBody(p, token);
                } else if (tn === $.KEYGEN) {
                    areaStartTagInBody(p, token);
                } else if (tn === $.SOURCE) {
                    paramStartTagInBody(p, token);
                } else if (tn === $.IFRAME) {
                    iframeStartTagInBody(p, token);
                } else if (tn === $.SELECT) {
                    selectStartTagInBody(p, token);
                } else if (tn === $.OPTION) {
                    optgroupStartTagInBody(p, token);
                } else {
                    genericStartTagInBody(p, token);
                }
    
                break;
    
            case 7:
                if (tn === $.BGSOUND) {
                    startTagInHead(p, token);
                } else if (
                    tn === $.DETAILS ||
                    tn === $.ADDRESS ||
                    tn === $.ARTICLE ||
                    tn === $.SECTION ||
                    tn === $.SUMMARY
                ) {
                    addressStartTagInBody(p, token);
                } else if (tn === $.LISTING) {
                    preStartTagInBody(p, token);
                } else if (tn === $.MARQUEE) {
                    appletStartTagInBody(p, token);
                } else if (tn === $.NOEMBED) {
                    noembedStartTagInBody(p, token);
                } else if (tn !== $.CAPTION) {
                    genericStartTagInBody(p, token);
                }
    
                break;
    
            case 8:
                if (tn === $.BASEFONT) {
                    startTagInHead(p, token);
                } else if (tn === $.FRAMESET) {
                    framesetStartTagInBody(p, token);
                } else if (tn === $.FIELDSET) {
                    addressStartTagInBody(p, token);
                } else if (tn === $.TEXTAREA) {
                    textareaStartTagInBody(p, token);
                } else if (tn === $.TEMPLATE) {
                    startTagInHead(p, token);
                } else if (tn === $.NOSCRIPT) {
                    if (p.options.scriptingEnabled) {
                        noembedStartTagInBody(p, token);
                    } else {
                        genericStartTagInBody(p, token);
                    }
                } else if (tn === $.OPTGROUP) {
                    optgroupStartTagInBody(p, token);
                } else if (tn !== $.COLGROUP) {
                    genericStartTagInBody(p, token);
                }
    
                break;
    
            case 9:
                if (tn === $.PLAINTEXT) {
                    plaintextStartTagInBody(p, token);
                } else {
                    genericStartTagInBody(p, token);
                }
    
                break;
    
            case 10:
                if (tn === $.BLOCKQUOTE || tn === $.FIGCAPTION) {
                    addressStartTagInBody(p, token);
                } else {
                    genericStartTagInBody(p, token);
                }
    
                break;
    
            default:
                genericStartTagInBody(p, token);
        }
    }
    
    function bodyEndTagInBody(p) {
        if (p.openElements.hasInScope($.BODY)) {
            p.insertionMode = AFTER_BODY_MODE;
        }
    }
    
    function htmlEndTagInBody(p, token) {
        if (p.openElements.hasInScope($.BODY)) {
            p.insertionMode = AFTER_BODY_MODE;
            p._processToken(token);
        }
    }
    
    function addressEndTagInBody(p, token) {
        const tn = token.tagName;
    
        if (p.openElements.hasInScope(tn)) {
            p.openElements.generateImpliedEndTags();
            p.openElements.popUntilTagNamePopped(tn);
        }
    }
    
    function formEndTagInBody(p) {
        const inTemplate = p.openElements.tmplCount > 0;
        const formElement = p.formElement;
    
        if (!inTemplate) {
            p.formElement = null;
        }
    
        if ((formElement || inTemplate) && p.openElements.hasInScope($.FORM)) {
            p.openElements.generateImpliedEndTags();
    
            if (inTemplate) {
                p.openElements.popUntilTagNamePopped($.FORM);
            } else {
                p.openElements.remove(formElement);
            }
        }
    }
    
    function pEndTagInBody(p) {
        if (!p.openElements.hasInButtonScope($.P)) {
            p._insertFakeElement($.P);
        }
    
        p._closePElement();
    }
    
    function liEndTagInBody(p) {
        if (p.openElements.hasInListItemScope($.LI)) {
            p.openElements.generateImpliedEndTagsWithExclusion($.LI);
            p.openElements.popUntilTagNamePopped($.LI);
        }
    }
    
    function ddEndTagInBody(p, token) {
        const tn = token.tagName;
    
        if (p.openElements.hasInScope(tn)) {
            p.openElements.generateImpliedEndTagsWithExclusion(tn);
            p.openElements.popUntilTagNamePopped(tn);
        }
    }
    
    function numberedHeaderEndTagInBody(p) {
        if (p.openElements.hasNumberedHeaderInScope()) {
            p.openElements.generateImpliedEndTags();
            p.openElements.popUntilNumberedHeaderPopped();
        }
    }
    
    function appletEndTagInBody(p, token) {
        const tn = token.tagName;
    
        if (p.openElements.hasInScope(tn)) {
            p.openElements.generateImpliedEndTags();
            p.openElements.popUntilTagNamePopped(tn);
            p.activeFormattingElements.clearToLastMarker();
        }
    }
    
    function brEndTagInBody(p) {
        p._reconstructActiveFormattingElements();
        p._insertFakeElement($.BR);
        p.openElements.pop();
        p.framesetOk = false;
    }
    
    function genericEndTagInBody(p, token) {
        const tn = token.tagName;
    
        for (let i = p.openElements.stackTop; i > 0; i--) {
            const element = p.openElements.items[i];
    
            if (p.treeAdapter.getTagName(element) === tn) {
                p.openElements.generateImpliedEndTagsWithExclusion(tn);
                p.openElements.popUntilElementPopped(element);
                break;
            }
    
            if (p._isSpecialElement(element)) {
                break;
            }
        }
    }
    
    //OPTIMIZATION: Integer comparisons are low-cost, so we can use very fast tag name length filters here.
    //It's faster than using dictionary.
    function endTagInBody(p, token) {
        const tn = token.tagName;
    
        switch (tn.length) {
            case 1:
                if (tn === $.A || tn === $.B || tn === $.I || tn === $.S || tn === $.U) {
                    callAdoptionAgency(p, token);
                } else if (tn === $.P) {
                    pEndTagInBody(p, token);
                } else {
                    genericEndTagInBody(p, token);
                }
    
                break;
    
            case 2:
                if (tn === $.DL || tn === $.UL || tn === $.OL) {
                    addressEndTagInBody(p, token);
                } else if (tn === $.LI) {
                    liEndTagInBody(p, token);
                } else if (tn === $.DD || tn === $.DT) {
                    ddEndTagInBody(p, token);
                } else if (tn === $.H1 || tn === $.H2 || tn === $.H3 || tn === $.H4 || tn === $.H5 || tn === $.H6) {
                    numberedHeaderEndTagInBody(p, token);
                } else if (tn === $.BR) {
                    brEndTagInBody(p, token);
                } else if (tn === $.EM || tn === $.TT) {
                    callAdoptionAgency(p, token);
                } else {
                    genericEndTagInBody(p, token);
                }
    
                break;
    
            case 3:
                if (tn === $.BIG) {
                    callAdoptionAgency(p, token);
                } else if (tn === $.DIR || tn === $.DIV || tn === $.NAV || tn === $.PRE) {
                    addressEndTagInBody(p, token);
                } else {
                    genericEndTagInBody(p, token);
                }
    
                break;
    
            case 4:
                if (tn === $.BODY) {
                    bodyEndTagInBody(p, token);
                } else if (tn === $.HTML) {
                    htmlEndTagInBody(p, token);
                } else if (tn === $.FORM) {
                    formEndTagInBody(p, token);
                } else if (tn === $.CODE || tn === $.FONT || tn === $.NOBR) {
                    callAdoptionAgency(p, token);
                } else if (tn === $.MAIN || tn === $.MENU) {
                    addressEndTagInBody(p, token);
                } else {
                    genericEndTagInBody(p, token);
                }
    
                break;
    
            case 5:
                if (tn === $.ASIDE) {
                    addressEndTagInBody(p, token);
                } else if (tn === $.SMALL) {
                    callAdoptionAgency(p, token);
                } else {
                    genericEndTagInBody(p, token);
                }
    
                break;
    
            case 6:
                if (
                    tn === $.CENTER ||
                    tn === $.FIGURE ||
                    tn === $.FOOTER ||
                    tn === $.HEADER ||
                    tn === $.HGROUP ||
                    tn === $.DIALOG
                ) {
                    addressEndTagInBody(p, token);
                } else if (tn === $.APPLET || tn === $.OBJECT) {
                    appletEndTagInBody(p, token);
                } else if (tn === $.STRIKE || tn === $.STRONG) {
                    callAdoptionAgency(p, token);
                } else {
                    genericEndTagInBody(p, token);
                }
    
                break;
    
            case 7:
                if (
                    tn === $.ADDRESS ||
                    tn === $.ARTICLE ||
                    tn === $.DETAILS ||
                    tn === $.SECTION ||
                    tn === $.SUMMARY ||
                    tn === $.LISTING
                ) {
                    addressEndTagInBody(p, token);
                } else if (tn === $.MARQUEE) {
                    appletEndTagInBody(p, token);
                } else {
                    genericEndTagInBody(p, token);
                }
    
                break;
    
            case 8:
                if (tn === $.FIELDSET) {
                    addressEndTagInBody(p, token);
                } else if (tn === $.TEMPLATE) {
                    endTagInHead(p, token);
                } else {
                    genericEndTagInBody(p, token);
                }
    
                break;
    
            case 10:
                if (tn === $.BLOCKQUOTE || tn === $.FIGCAPTION) {
                    addressEndTagInBody(p, token);
                } else {
                    genericEndTagInBody(p, token);
                }
    
                break;
    
            default:
                genericEndTagInBody(p, token);
        }
    }
    
    function eofInBody(p, token) {
        if (p.tmplInsertionModeStackTop > -1) {
            eofInTemplate(p, token);
        } else {
            p.stopped = true;
        }
    }
    
    // The "text" insertion mode
    //------------------------------------------------------------------
    function endTagInText(p, token) {
        if (token.tagName === $.SCRIPT) {
            p.pendingScript = p.openElements.current;
        }
    
        p.openElements.pop();
        p.insertionMode = p.originalInsertionMode;
    }
    
    function eofInText(p, token) {
        p._err(ERR.eofInElementThatCanContainOnlyText);
        p.openElements.pop();
        p.insertionMode = p.originalInsertionMode;
        p._processToken(token);
    }
    
    // The "in table" insertion mode
    //------------------------------------------------------------------
    function characterInTable(p, token) {
        const curTn = p.openElements.currentTagName;
    
        if (curTn === $.TABLE || curTn === $.TBODY || curTn === $.TFOOT || curTn === $.THEAD || curTn === $.TR) {
            p.pendingCharacterTokens = [];
            p.hasNonWhitespacePendingCharacterToken = false;
            p.originalInsertionMode = p.insertionMode;
            p.insertionMode = IN_TABLE_TEXT_MODE;
            p._processToken(token);
        } else {
            tokenInTable(p, token);
        }
    }
    
    function captionStartTagInTable(p, token) {
        p.openElements.clearBackToTableContext();
        p.activeFormattingElements.insertMarker();
        p._insertElement(token, NS.HTML);
        p.insertionMode = IN_CAPTION_MODE;
    }
    
    function colgroupStartTagInTable(p, token) {
        p.openElements.clearBackToTableContext();
        p._insertElement(token, NS.HTML);
        p.insertionMode = IN_COLUMN_GROUP_MODE;
    }
    
    function colStartTagInTable(p, token) {
        p.openElements.clearBackToTableContext();
        p._insertFakeElement($.COLGROUP);
        p.insertionMode = IN_COLUMN_GROUP_MODE;
        p._processToken(token);
    }
    
    function tbodyStartTagInTable(p, token) {
        p.openElements.clearBackToTableContext();
        p._insertElement(token, NS.HTML);
        p.insertionMode = IN_TABLE_BODY_MODE;
    }
    
    function tdStartTagInTable(p, token) {
        p.openElements.clearBackToTableContext();
        p._insertFakeElement($.TBODY);
        p.insertionMode = IN_TABLE_BODY_MODE;
        p._processToken(token);
    }
    
    function tableStartTagInTable(p, token) {
        if (p.openElements.hasInTableScope($.TABLE)) {
            p.openElements.popUntilTagNamePopped($.TABLE);
            p._resetInsertionMode();
            p._processToken(token);
        }
    }
    
    function inputStartTagInTable(p, token) {
        const inputType = Tokenizer.getTokenAttr(token, ATTRS.TYPE);
    
        if (inputType && inputType.toLowerCase() === HIDDEN_INPUT_TYPE) {
            p._appendElement(token, NS.HTML);
        } else {
            tokenInTable(p, token);
        }
    
        token.ackSelfClosing = true;
    }
    
    function formStartTagInTable(p, token) {
        if (!p.formElement && p.openElements.tmplCount === 0) {
            p._insertElement(token, NS.HTML);
            p.formElement = p.openElements.current;
            p.openElements.pop();
        }
    }
    
    function startTagInTable(p, token) {
        const tn = token.tagName;
    
        switch (tn.length) {
            case 2:
                if (tn === $.TD || tn === $.TH || tn === $.TR) {
                    tdStartTagInTable(p, token);
                } else {
                    tokenInTable(p, token);
                }
    
                break;
    
            case 3:
                if (tn === $.COL) {
                    colStartTagInTable(p, token);
                } else {
                    tokenInTable(p, token);
                }
    
                break;
    
            case 4:
                if (tn === $.FORM) {
                    formStartTagInTable(p, token);
                } else {
                    tokenInTable(p, token);
                }
    
                break;
    
            case 5:
                if (tn === $.TABLE) {
                    tableStartTagInTable(p, token);
                } else if (tn === $.STYLE) {
                    startTagInHead(p, token);
                } else if (tn === $.TBODY || tn === $.TFOOT || tn === $.THEAD) {
                    tbodyStartTagInTable(p, token);
                } else if (tn === $.INPUT) {
                    inputStartTagInTable(p, token);
                } else {
                    tokenInTable(p, token);
                }
    
                break;
    
            case 6:
                if (tn === $.SCRIPT) {
                    startTagInHead(p, token);
                } else {
                    tokenInTable(p, token);
                }
    
                break;
    
            case 7:
                if (tn === $.CAPTION) {
                    captionStartTagInTable(p, token);
                } else {
                    tokenInTable(p, token);
                }
    
                break;
    
            case 8:
                if (tn === $.COLGROUP) {
                    colgroupStartTagInTable(p, token);
                } else if (tn === $.TEMPLATE) {
                    startTagInHead(p, token);
                } else {
                    tokenInTable(p, token);
                }
    
                break;
    
            default:
                tokenInTable(p, token);
        }
    }
    
    function endTagInTable(p, token) {
        const tn = token.tagName;
    
        if (tn === $.TABLE) {
            if (p.openElements.hasInTableScope($.TABLE)) {
                p.openElements.popUntilTagNamePopped($.TABLE);
                p._resetInsertionMode();
            }
        } else if (tn === $.TEMPLATE) {
            endTagInHead(p, token);
        } else if (
            tn !== $.BODY &&
            tn !== $.CAPTION &&
            tn !== $.COL &&
            tn !== $.COLGROUP &&
            tn !== $.HTML &&
            tn !== $.TBODY &&
            tn !== $.TD &&
            tn !== $.TFOOT &&
            tn !== $.TH &&
            tn !== $.THEAD &&
            tn !== $.TR
        ) {
            tokenInTable(p, token);
        }
    }
    
    function tokenInTable(p, token) {
        const savedFosterParentingState = p.fosterParentingEnabled;
    
        p.fosterParentingEnabled = true;
        p._processTokenInBodyMode(token);
        p.fosterParentingEnabled = savedFosterParentingState;
    }
    
    // The "in table text" insertion mode
    //------------------------------------------------------------------
    function whitespaceCharacterInTableText(p, token) {
        p.pendingCharacterTokens.push(token);
    }
    
    function characterInTableText(p, token) {
        p.pendingCharacterTokens.push(token);
        p.hasNonWhitespacePendingCharacterToken = true;
    }
    
    function tokenInTableText(p, token) {
        let i = 0;
    
        if (p.hasNonWhitespacePendingCharacterToken) {
            for (; i < p.pendingCharacterTokens.length; i++) {
                tokenInTable(p, p.pendingCharacterTokens[i]);
            }
        } else {
            for (; i < p.pendingCharacterTokens.length; i++) {
                p._insertCharacters(p.pendingCharacterTokens[i]);
            }
        }
    
        p.insertionMode = p.originalInsertionMode;
        p._processToken(token);
    }
    
    // The "in caption" insertion mode
    //------------------------------------------------------------------
    function startTagInCaption(p, token) {
        const tn = token.tagName;
    
        if (
            tn === $.CAPTION ||
            tn === $.COL ||
            tn === $.COLGROUP ||
            tn === $.TBODY ||
            tn === $.TD ||
            tn === $.TFOOT ||
            tn === $.TH ||
            tn === $.THEAD ||
            tn === $.TR
        ) {
            if (p.openElements.hasInTableScope($.CAPTION)) {
                p.openElements.generateImpliedEndTags();
                p.openElements.popUntilTagNamePopped($.CAPTION);
                p.activeFormattingElements.clearToLastMarker();
                p.insertionMode = IN_TABLE_MODE;
                p._processToken(token);
            }
        } else {
            startTagInBody(p, token);
        }
    }
    
    function endTagInCaption(p, token) {
        const tn = token.tagName;
    
        if (tn === $.CAPTION || tn === $.TABLE) {
            if (p.openElements.hasInTableScope($.CAPTION)) {
                p.openElements.generateImpliedEndTags();
                p.openElements.popUntilTagNamePopped($.CAPTION);
                p.activeFormattingElements.clearToLastMarker();
                p.insertionMode = IN_TABLE_MODE;
    
                if (tn === $.TABLE) {
                    p._processToken(token);
                }
            }
        } else if (
            tn !== $.BODY &&
            tn !== $.COL &&
            tn !== $.COLGROUP &&
            tn !== $.HTML &&
            tn !== $.TBODY &&
            tn !== $.TD &&
            tn !== $.TFOOT &&
            tn !== $.TH &&
            tn !== $.THEAD &&
            tn !== $.TR
        ) {
            endTagInBody(p, token);
        }
    }
    
    // The "in column group" insertion mode
    //------------------------------------------------------------------
    function startTagInColumnGroup(p, token) {
        const tn = token.tagName;
    
        if (tn === $.HTML) {
            startTagInBody(p, token);
        } else if (tn === $.COL) {
            p._appendElement(token, NS.HTML);
            token.ackSelfClosing = true;
        } else if (tn === $.TEMPLATE) {
            startTagInHead(p, token);
        } else {
            tokenInColumnGroup(p, token);
        }
    }
    
    function endTagInColumnGroup(p, token) {
        const tn = token.tagName;
    
        if (tn === $.COLGROUP) {
            if (p.openElements.currentTagName === $.COLGROUP) {
                p.openElements.pop();
                p.insertionMode = IN_TABLE_MODE;
            }
        } else if (tn === $.TEMPLATE) {
            endTagInHead(p, token);
        } else if (tn !== $.COL) {
            tokenInColumnGroup(p, token);
        }
    }
    
    function tokenInColumnGroup(p, token) {
        if (p.openElements.currentTagName === $.COLGROUP) {
            p.openElements.pop();
            p.insertionMode = IN_TABLE_MODE;
            p._processToken(token);
        }
    }
    
    // The "in table body" insertion mode
    //------------------------------------------------------------------
    function startTagInTableBody(p, token) {
        const tn = token.tagName;
    
        if (tn === $.TR) {
            p.openElements.clearBackToTableBodyContext();
            p._insertElement(token, NS.HTML);
            p.insertionMode = IN_ROW_MODE;
        } else if (tn === $.TH || tn === $.TD) {
            p.openElements.clearBackToTableBodyContext();
            p._insertFakeElement($.TR);
            p.insertionMode = IN_ROW_MODE;
            p._processToken(token);
        } else if (
            tn === $.CAPTION ||
            tn === $.COL ||
            tn === $.COLGROUP ||
            tn === $.TBODY ||
            tn === $.TFOOT ||
            tn === $.THEAD
        ) {
            if (p.openElements.hasTableBodyContextInTableScope()) {
                p.openElements.clearBackToTableBodyContext();
                p.openElements.pop();
                p.insertionMode = IN_TABLE_MODE;
                p._processToken(token);
            }
        } else {
            startTagInTable(p, token);
        }
    }
    
    function endTagInTableBody(p, token) {
        const tn = token.tagName;
    
        if (tn === $.TBODY || tn === $.TFOOT || tn === $.THEAD) {
            if (p.openElements.hasInTableScope(tn)) {
                p.openElements.clearBackToTableBodyContext();
                p.openElements.pop();
                p.insertionMode = IN_TABLE_MODE;
            }
        } else if (tn === $.TABLE) {
            if (p.openElements.hasTableBodyContextInTableScope()) {
                p.openElements.clearBackToTableBodyContext();
                p.openElements.pop();
                p.insertionMode = IN_TABLE_MODE;
                p._processToken(token);
            }
        } else if (
            (tn !== $.BODY && tn !== $.CAPTION && tn !== $.COL && tn !== $.COLGROUP) ||
            (tn !== $.HTML && tn !== $.TD && tn !== $.TH && tn !== $.TR)
        ) {
            endTagInTable(p, token);
        }
    }
    
    // The "in row" insertion mode
    //------------------------------------------------------------------
    function startTagInRow(p, token) {
        const tn = token.tagName;
    
        if (tn === $.TH || tn === $.TD) {
            p.openElements.clearBackToTableRowContext();
            p._insertElement(token, NS.HTML);
            p.insertionMode = IN_CELL_MODE;
            p.activeFormattingElements.insertMarker();
        } else if (
            tn === $.CAPTION ||
            tn === $.COL ||
            tn === $.COLGROUP ||
            tn === $.TBODY ||
            tn === $.TFOOT ||
            tn === $.THEAD ||
            tn === $.TR
        ) {
            if (p.openElements.hasInTableScope($.TR)) {
                p.openElements.clearBackToTableRowContext();
                p.openElements.pop();
                p.insertionMode = IN_TABLE_BODY_MODE;
                p._processToken(token);
            }
        } else {
            startTagInTable(p, token);
        }
    }
    
    function endTagInRow(p, token) {
        const tn = token.tagName;
    
        if (tn === $.TR) {
            if (p.openElements.hasInTableScope($.TR)) {
                p.openElements.clearBackToTableRowContext();
                p.openElements.pop();
                p.insertionMode = IN_TABLE_BODY_MODE;
            }
        } else if (tn === $.TABLE) {
            if (p.openElements.hasInTableScope($.TR)) {
                p.openElements.clearBackToTableRowContext();
                p.openElements.pop();
                p.insertionMode = IN_TABLE_BODY_MODE;
                p._processToken(token);
            }
        } else if (tn === $.TBODY || tn === $.TFOOT || tn === $.THEAD) {
            if (p.openElements.hasInTableScope(tn) || p.openElements.hasInTableScope($.TR)) {
                p.openElements.clearBackToTableRowContext();
                p.openElements.pop();
                p.insertionMode = IN_TABLE_BODY_MODE;
                p._processToken(token);
            }
        } else if (
            (tn !== $.BODY && tn !== $.CAPTION && tn !== $.COL && tn !== $.COLGROUP) ||
            (tn !== $.HTML && tn !== $.TD && tn !== $.TH)
        ) {
            endTagInTable(p, token);
        }
    }
    
    // The "in cell" insertion mode
    //------------------------------------------------------------------
    function startTagInCell(p, token) {
        const tn = token.tagName;
    
        if (
            tn === $.CAPTION ||
            tn === $.COL ||
            tn === $.COLGROUP ||
            tn === $.TBODY ||
            tn === $.TD ||
            tn === $.TFOOT ||
            tn === $.TH ||
            tn === $.THEAD ||
            tn === $.TR
        ) {
            if (p.openElements.hasInTableScope($.TD) || p.openElements.hasInTableScope($.TH)) {
                p._closeTableCell();
                p._processToken(token);
            }
        } else {
            startTagInBody(p, token);
        }
    }
    
    function endTagInCell(p, token) {
        const tn = token.tagName;
    
        if (tn === $.TD || tn === $.TH) {
            if (p.openElements.hasInTableScope(tn)) {
                p.openElements.generateImpliedEndTags();
                p.openElements.popUntilTagNamePopped(tn);
                p.activeFormattingElements.clearToLastMarker();
                p.insertionMode = IN_ROW_MODE;
            }
        } else if (tn === $.TABLE || tn === $.TBODY || tn === $.TFOOT || tn === $.THEAD || tn === $.TR) {
            if (p.openElements.hasInTableScope(tn)) {
                p._closeTableCell();
                p._processToken(token);
            }
        } else if (tn !== $.BODY && tn !== $.CAPTION && tn !== $.COL && tn !== $.COLGROUP && tn !== $.HTML) {
            endTagInBody(p, token);
        }
    }
    
    // The "in select" insertion mode
    //------------------------------------------------------------------
    function startTagInSelect(p, token) {
        const tn = token.tagName;
    
        if (tn === $.HTML) {
            startTagInBody(p, token);
        } else if (tn === $.OPTION) {
            if (p.openElements.currentTagName === $.OPTION) {
                p.openElements.pop();
            }
    
            p._insertElement(token, NS.HTML);
        } else if (tn === $.OPTGROUP) {
            if (p.openElements.currentTagName === $.OPTION) {
                p.openElements.pop();
            }
    
            if (p.openElements.currentTagName === $.OPTGROUP) {
                p.openElements.pop();
            }
    
            p._insertElement(token, NS.HTML);
        } else if (tn === $.INPUT || tn === $.KEYGEN || tn === $.TEXTAREA || tn === $.SELECT) {
            if (p.openElements.hasInSelectScope($.SELECT)) {
                p.openElements.popUntilTagNamePopped($.SELECT);
                p._resetInsertionMode();
    
                if (tn !== $.SELECT) {
                    p._processToken(token);
                }
            }
        } else if (tn === $.SCRIPT || tn === $.TEMPLATE) {
            startTagInHead(p, token);
        }
    }
    
    function endTagInSelect(p, token) {
        const tn = token.tagName;
    
        if (tn === $.OPTGROUP) {
            const prevOpenElement = p.openElements.items[p.openElements.stackTop - 1];
            const prevOpenElementTn = prevOpenElement && p.treeAdapter.getTagName(prevOpenElement);
    
            if (p.openElements.currentTagName === $.OPTION && prevOpenElementTn === $.OPTGROUP) {
                p.openElements.pop();
            }
    
            if (p.openElements.currentTagName === $.OPTGROUP) {
                p.openElements.pop();
            }
        } else if (tn === $.OPTION) {
            if (p.openElements.currentTagName === $.OPTION) {
                p.openElements.pop();
            }
        } else if (tn === $.SELECT && p.openElements.hasInSelectScope($.SELECT)) {
            p.openElements.popUntilTagNamePopped($.SELECT);
            p._resetInsertionMode();
        } else if (tn === $.TEMPLATE) {
            endTagInHead(p, token);
        }
    }
    
    //12.2.5.4.17 The "in select in table" insertion mode
    //------------------------------------------------------------------
    function startTagInSelectInTable(p, token) {
        const tn = token.tagName;
    
        if (
            tn === $.CAPTION ||
            tn === $.TABLE ||
            tn === $.TBODY ||
            tn === $.TFOOT ||
            tn === $.THEAD ||
            tn === $.TR ||
            tn === $.TD ||
            tn === $.TH
        ) {
            p.openElements.popUntilTagNamePopped($.SELECT);
            p._resetInsertionMode();
            p._processToken(token);
        } else {
            startTagInSelect(p, token);
        }
    }
    
    function endTagInSelectInTable(p, token) {
        const tn = token.tagName;
    
        if (
            tn === $.CAPTION ||
            tn === $.TABLE ||
            tn === $.TBODY ||
            tn === $.TFOOT ||
            tn === $.THEAD ||
            tn === $.TR ||
            tn === $.TD ||
            tn === $.TH
        ) {
            if (p.openElements.hasInTableScope(tn)) {
                p.openElements.popUntilTagNamePopped($.SELECT);
                p._resetInsertionMode();
                p._processToken(token);
            }
        } else {
            endTagInSelect(p, token);
        }
    }
    
    // The "in template" insertion mode
    //------------------------------------------------------------------
    function startTagInTemplate(p, token) {
        const tn = token.tagName;
    
        if (
            tn === $.BASE ||
            tn === $.BASEFONT ||
            tn === $.BGSOUND ||
            tn === $.LINK ||
            tn === $.META ||
            tn === $.NOFRAMES ||
            tn === $.SCRIPT ||
            tn === $.STYLE ||
            tn === $.TEMPLATE ||
            tn === $.TITLE
        ) {
            startTagInHead(p, token);
        } else {
            const newInsertionMode = TEMPLATE_INSERTION_MODE_SWITCH_MAP[tn] || IN_BODY_MODE;
    
            p._popTmplInsertionMode();
            p._pushTmplInsertionMode(newInsertionMode);
            p.insertionMode = newInsertionMode;
            p._processToken(token);
        }
    }
    
    function endTagInTemplate(p, token) {
        if (token.tagName === $.TEMPLATE) {
            endTagInHead(p, token);
        }
    }
    
    function eofInTemplate(p, token) {
        if (p.openElements.tmplCount > 0) {
            p.openElements.popUntilTagNamePopped($.TEMPLATE);
            p.activeFormattingElements.clearToLastMarker();
            p._popTmplInsertionMode();
            p._resetInsertionMode();
            p._processToken(token);
        } else {
            p.stopped = true;
        }
    }
    
    // The "after body" insertion mode
    //------------------------------------------------------------------
    function startTagAfterBody(p, token) {
        if (token.tagName === $.HTML) {
            startTagInBody(p, token);
        } else {
            tokenAfterBody(p, token);
        }
    }
    
    function endTagAfterBody(p, token) {
        if (token.tagName === $.HTML) {
            if (!p.fragmentContext) {
                p.insertionMode = AFTER_AFTER_BODY_MODE;
            }
        } else {
            tokenAfterBody(p, token);
        }
    }
    
    function tokenAfterBody(p, token) {
        p.insertionMode = IN_BODY_MODE;
        p._processToken(token);
    }
    
    // The "in frameset" insertion mode
    //------------------------------------------------------------------
    function startTagInFrameset(p, token) {
        const tn = token.tagName;
    
        if (tn === $.HTML) {
            startTagInBody(p, token);
        } else if (tn === $.FRAMESET) {
            p._insertElement(token, NS.HTML);
        } else if (tn === $.FRAME) {
            p._appendElement(token, NS.HTML);
            token.ackSelfClosing = true;
        } else if (tn === $.NOFRAMES) {
            startTagInHead(p, token);
        }
    }
    
    function endTagInFrameset(p, token) {
        if (token.tagName === $.FRAMESET && !p.openElements.isRootHtmlElementCurrent()) {
            p.openElements.pop();
    
            if (!p.fragmentContext && p.openElements.currentTagName !== $.FRAMESET) {
                p.insertionMode = AFTER_FRAMESET_MODE;
            }
        }
    }
    
    // The "after frameset" insertion mode
    //------------------------------------------------------------------
    function startTagAfterFrameset(p, token) {
        const tn = token.tagName;
    
        if (tn === $.HTML) {
            startTagInBody(p, token);
        } else if (tn === $.NOFRAMES) {
            startTagInHead(p, token);
        }
    }
    
    function endTagAfterFrameset(p, token) {
        if (token.tagName === $.HTML) {
            p.insertionMode = AFTER_AFTER_FRAMESET_MODE;
        }
    }
    
    // The "after after body" insertion mode
    //------------------------------------------------------------------
    function startTagAfterAfterBody(p, token) {
        if (token.tagName === $.HTML) {
            startTagInBody(p, token);
        } else {
            tokenAfterAfterBody(p, token);
        }
    }
    
    function tokenAfterAfterBody(p, token) {
        p.insertionMode = IN_BODY_MODE;
        p._processToken(token);
    }
    
    // The "after after frameset" insertion mode
    //------------------------------------------------------------------
    function startTagAfterAfterFrameset(p, token) {
        const tn = token.tagName;
    
        if (tn === $.HTML) {
            startTagInBody(p, token);
        } else if (tn === $.NOFRAMES) {
            startTagInHead(p, token);
        }
    }
    
    // The rules for parsing tokens in foreign content
    //------------------------------------------------------------------
    function nullCharacterInForeignContent(p, token) {
        token.chars = unicode.REPLACEMENT_CHARACTER;
        p._insertCharacters(token);
    }
    
    function characterInForeignContent(p, token) {
        p._insertCharacters(token);
        p.framesetOk = false;
    }
    
    function startTagInForeignContent(p, token) {
        if (foreignContent.causesExit(token) && !p.fragmentContext) {
            while (
                p.treeAdapter.getNamespaceURI(p.openElements.current) !== NS.HTML &&
                !p._isIntegrationPoint(p.openElements.current)
            ) {
                p.openElements.pop();
            }
    
            p._processToken(token);
        } else {
            const current = p._getAdjustedCurrentElement();
            const currentNs = p.treeAdapter.getNamespaceURI(current);
    
            if (currentNs === NS.MATHML) {
                foreignContent.adjustTokenMathMLAttrs(token);
            } else if (currentNs === NS.SVG) {
                foreignContent.adjustTokenSVGTagName(token);
                foreignContent.adjustTokenSVGAttrs(token);
            }
    
            foreignContent.adjustTokenXMLAttrs(token);
    
            if (token.selfClosing) {
                p._appendElement(token, currentNs);
            } else {
                p._insertElement(token, currentNs);
            }
    
            token.ackSelfClosing = true;
        }
    }
    
    function endTagInForeignContent(p, token) {
        for (let i = p.openElements.stackTop; i > 0; i--) {
            const element = p.openElements.items[i];
    
            if (p.treeAdapter.getNamespaceURI(element) === NS.HTML) {
                p._processToken(token);
                break;
            }
    
            if (p.treeAdapter.getTagName(element).toLowerCase() === token.tagName) {
                p.openElements.popUntilElementPopped(element);
                break;
            }
        }
    }
    
    
    /***/ }),
    /* 5 */
    /***/ ((module, __unused_webpack_exports, __webpack_require__) => {
    
    "use strict";
    
    
    const Preprocessor = __webpack_require__(6);
    const unicode = __webpack_require__(7);
    const neTree = __webpack_require__(9);
    const ERR = __webpack_require__(8);
    
    //Aliases
    const $ = unicode.CODE_POINTS;
    const $$ = unicode.CODE_POINT_SEQUENCES;
    
    //C1 Unicode control character reference replacements
    const C1_CONTROLS_REFERENCE_REPLACEMENTS = {
        0x80: 0x20ac,
        0x82: 0x201a,
        0x83: 0x0192,
        0x84: 0x201e,
        0x85: 0x2026,
        0x86: 0x2020,
        0x87: 0x2021,
        0x88: 0x02c6,
        0x89: 0x2030,
        0x8a: 0x0160,
        0x8b: 0x2039,
        0x8c: 0x0152,
        0x8e: 0x017d,
        0x91: 0x2018,
        0x92: 0x2019,
        0x93: 0x201c,
        0x94: 0x201d,
        0x95: 0x2022,
        0x96: 0x2013,
        0x97: 0x2014,
        0x98: 0x02dc,
        0x99: 0x2122,
        0x9a: 0x0161,
        0x9b: 0x203a,
        0x9c: 0x0153,
        0x9e: 0x017e,
        0x9f: 0x0178
    };
    
    // Named entity tree flags
    const HAS_DATA_FLAG = 1 << 0;
    const DATA_DUPLET_FLAG = 1 << 1;
    const HAS_BRANCHES_FLAG = 1 << 2;
    const MAX_BRANCH_MARKER_VALUE = HAS_DATA_FLAG | DATA_DUPLET_FLAG | HAS_BRANCHES_FLAG;
    
    //States
    const DATA_STATE = 'DATA_STATE';
    const RCDATA_STATE = 'RCDATA_STATE';
    const RAWTEXT_STATE = 'RAWTEXT_STATE';
    const SCRIPT_DATA_STATE = 'SCRIPT_DATA_STATE';
    const PLAINTEXT_STATE = 'PLAINTEXT_STATE';
    const TAG_OPEN_STATE = 'TAG_OPEN_STATE';
    const END_TAG_OPEN_STATE = 'END_TAG_OPEN_STATE';
    const TAG_NAME_STATE = 'TAG_NAME_STATE';
    const RCDATA_LESS_THAN_SIGN_STATE = 'RCDATA_LESS_THAN_SIGN_STATE';
    const RCDATA_END_TAG_OPEN_STATE = 'RCDATA_END_TAG_OPEN_STATE';
    const RCDATA_END_TAG_NAME_STATE = 'RCDATA_END_TAG_NAME_STATE';
    const RAWTEXT_LESS_THAN_SIGN_STATE = 'RAWTEXT_LESS_THAN_SIGN_STATE';
    const RAWTEXT_END_TAG_OPEN_STATE = 'RAWTEXT_END_TAG_OPEN_STATE';
    const RAWTEXT_END_TAG_NAME_STATE = 'RAWTEXT_END_TAG_NAME_STATE';
    const SCRIPT_DATA_LESS_THAN_SIGN_STATE = 'SCRIPT_DATA_LESS_THAN_SIGN_STATE';
    const SCRIPT_DATA_END_TAG_OPEN_STATE = 'SCRIPT_DATA_END_TAG_OPEN_STATE';
    const SCRIPT_DATA_END_TAG_NAME_STATE = 'SCRIPT_DATA_END_TAG_NAME_STATE';
    const SCRIPT_DATA_ESCAPE_START_STATE = 'SCRIPT_DATA_ESCAPE_START_STATE';
    const SCRIPT_DATA_ESCAPE_START_DASH_STATE = 'SCRIPT_DATA_ESCAPE_START_DASH_STATE';
    const SCRIPT_DATA_ESCAPED_STATE = 'SCRIPT_DATA_ESCAPED_STATE';
    const SCRIPT_DATA_ESCAPED_DASH_STATE = 'SCRIPT_DATA_ESCAPED_DASH_STATE';
    const SCRIPT_DATA_ESCAPED_DASH_DASH_STATE = 'SCRIPT_DATA_ESCAPED_DASH_DASH_STATE';
    const SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN_STATE = 'SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN_STATE';
    const SCRIPT_DATA_ESCAPED_END_TAG_OPEN_STATE = 'SCRIPT_DATA_ESCAPED_END_TAG_OPEN_STATE';
    const SCRIPT_DATA_ESCAPED_END_TAG_NAME_STATE = 'SCRIPT_DATA_ESCAPED_END_TAG_NAME_STATE';
    const SCRIPT_DATA_DOUBLE_ESCAPE_START_STATE = 'SCRIPT_DATA_DOUBLE_ESCAPE_START_STATE';
    const SCRIPT_DATA_DOUBLE_ESCAPED_STATE = 'SCRIPT_DATA_DOUBLE_ESCAPED_STATE';
    const SCRIPT_DATA_DOUBLE_ESCAPED_DASH_STATE = 'SCRIPT_DATA_DOUBLE_ESCAPED_DASH_STATE';
    const SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH_STATE = 'SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH_STATE';
    const SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN_STATE = 'SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN_STATE';
    const SCRIPT_DATA_DOUBLE_ESCAPE_END_STATE = 'SCRIPT_DATA_DOUBLE_ESCAPE_END_STATE';
    const BEFORE_ATTRIBUTE_NAME_STATE = 'BEFORE_ATTRIBUTE_NAME_STATE';
    const ATTRIBUTE_NAME_STATE = 'ATTRIBUTE_NAME_STATE';
    const AFTER_ATTRIBUTE_NAME_STATE = 'AFTER_ATTRIBUTE_NAME_STATE';
    const BEFORE_ATTRIBUTE_VALUE_STATE = 'BEFORE_ATTRIBUTE_VALUE_STATE';
    const ATTRIBUTE_VALUE_DOUBLE_QUOTED_STATE = 'ATTRIBUTE_VALUE_DOUBLE_QUOTED_STATE';
    const ATTRIBUTE_VALUE_SINGLE_QUOTED_STATE = 'ATTRIBUTE_VALUE_SINGLE_QUOTED_STATE';
    const ATTRIBUTE_VALUE_UNQUOTED_STATE = 'ATTRIBUTE_VALUE_UNQUOTED_STATE';
    const AFTER_ATTRIBUTE_VALUE_QUOTED_STATE = 'AFTER_ATTRIBUTE_VALUE_QUOTED_STATE';
    const SELF_CLOSING_START_TAG_STATE = 'SELF_CLOSING_START_TAG_STATE';
    const BOGUS_COMMENT_STATE = 'BOGUS_COMMENT_STATE';
    const MARKUP_DECLARATION_OPEN_STATE = 'MARKUP_DECLARATION_OPEN_STATE';
    const COMMENT_START_STATE = 'COMMENT_START_STATE';
    const COMMENT_START_DASH_STATE = 'COMMENT_START_DASH_STATE';
    const COMMENT_STATE = 'COMMENT_STATE';
    const COMMENT_LESS_THAN_SIGN_STATE = 'COMMENT_LESS_THAN_SIGN_STATE';
    const COMMENT_LESS_THAN_SIGN_BANG_STATE = 'COMMENT_LESS_THAN_SIGN_BANG_STATE';
    const COMMENT_LESS_THAN_SIGN_BANG_DASH_STATE = 'COMMENT_LESS_THAN_SIGN_BANG_DASH_STATE';
    const COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH_STATE = 'COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH_STATE';
    const COMMENT_END_DASH_STATE = 'COMMENT_END_DASH_STATE';
    const COMMENT_END_STATE = 'COMMENT_END_STATE';
    const COMMENT_END_BANG_STATE = 'COMMENT_END_BANG_STATE';
    const DOCTYPE_STATE = 'DOCTYPE_STATE';
    const BEFORE_DOCTYPE_NAME_STATE = 'BEFORE_DOCTYPE_NAME_STATE';
    const DOCTYPE_NAME_STATE = 'DOCTYPE_NAME_STATE';
    const AFTER_DOCTYPE_NAME_STATE = 'AFTER_DOCTYPE_NAME_STATE';
    const AFTER_DOCTYPE_PUBLIC_KEYWORD_STATE = 'AFTER_DOCTYPE_PUBLIC_KEYWORD_STATE';
    const BEFORE_DOCTYPE_PUBLIC_IDENTIFIER_STATE = 'BEFORE_DOCTYPE_PUBLIC_IDENTIFIER_STATE';
    const DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED_STATE = 'DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED_STATE';
    const DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED_STATE = 'DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED_STATE';
    const AFTER_DOCTYPE_PUBLIC_IDENTIFIER_STATE = 'AFTER_DOCTYPE_PUBLIC_IDENTIFIER_STATE';
    const BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS_STATE = 'BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS_STATE';
    const AFTER_DOCTYPE_SYSTEM_KEYWORD_STATE = 'AFTER_DOCTYPE_SYSTEM_KEYWORD_STATE';
    const BEFORE_DOCTYPE_SYSTEM_IDENTIFIER_STATE = 'BEFORE_DOCTYPE_SYSTEM_IDENTIFIER_STATE';
    const DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED_STATE = 'DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED_STATE';
    const DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED_STATE = 'DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED_STATE';
    const AFTER_DOCTYPE_SYSTEM_IDENTIFIER_STATE = 'AFTER_DOCTYPE_SYSTEM_IDENTIFIER_STATE';
    const BOGUS_DOCTYPE_STATE = 'BOGUS_DOCTYPE_STATE';
    const CDATA_SECTION_STATE = 'CDATA_SECTION_STATE';
    const CDATA_SECTION_BRACKET_STATE = 'CDATA_SECTION_BRACKET_STATE';
    const CDATA_SECTION_END_STATE = 'CDATA_SECTION_END_STATE';
    const CHARACTER_REFERENCE_STATE = 'CHARACTER_REFERENCE_STATE';
    const NAMED_CHARACTER_REFERENCE_STATE = 'NAMED_CHARACTER_REFERENCE_STATE';
    const AMBIGUOUS_AMPERSAND_STATE = 'AMBIGUOS_AMPERSAND_STATE';
    const NUMERIC_CHARACTER_REFERENCE_STATE = 'NUMERIC_CHARACTER_REFERENCE_STATE';
    const HEXADEMICAL_CHARACTER_REFERENCE_START_STATE = 'HEXADEMICAL_CHARACTER_REFERENCE_START_STATE';
    const DECIMAL_CHARACTER_REFERENCE_START_STATE = 'DECIMAL_CHARACTER_REFERENCE_START_STATE';
    const HEXADEMICAL_CHARACTER_REFERENCE_STATE = 'HEXADEMICAL_CHARACTER_REFERENCE_STATE';
    const DECIMAL_CHARACTER_REFERENCE_STATE = 'DECIMAL_CHARACTER_REFERENCE_STATE';
    const NUMERIC_CHARACTER_REFERENCE_END_STATE = 'NUMERIC_CHARACTER_REFERENCE_END_STATE';
    
    //Utils
    
    //OPTIMIZATION: these utility functions should not be moved out of this module. V8 Crankshaft will not inline
    //this functions if they will be situated in another module due to context switch.
    //Always perform inlining check before modifying this functions ('node --trace-inlining').
    function isWhitespace(cp) {
        return cp === $.SPACE || cp === $.LINE_FEED || cp === $.TABULATION || cp === $.FORM_FEED;
    }
    
    function isAsciiDigit(cp) {
        return cp >= $.DIGIT_0 && cp <= $.DIGIT_9;
    }
    
    function isAsciiUpper(cp) {
        return cp >= $.LATIN_CAPITAL_A && cp <= $.LATIN_CAPITAL_Z;
    }
    
    function isAsciiLower(cp) {
        return cp >= $.LATIN_SMALL_A && cp <= $.LATIN_SMALL_Z;
    }
    
    function isAsciiLetter(cp) {
        return isAsciiLower(cp) || isAsciiUpper(cp);
    }
    
    function isAsciiAlphaNumeric(cp) {
        return isAsciiLetter(cp) || isAsciiDigit(cp);
    }
    
    function isAsciiUpperHexDigit(cp) {
        return cp >= $.LATIN_CAPITAL_A && cp <= $.LATIN_CAPITAL_F;
    }
    
    function isAsciiLowerHexDigit(cp) {
        return cp >= $.LATIN_SMALL_A && cp <= $.LATIN_SMALL_F;
    }
    
    function isAsciiHexDigit(cp) {
        return isAsciiDigit(cp) || isAsciiUpperHexDigit(cp) || isAsciiLowerHexDigit(cp);
    }
    
    function toAsciiLowerCodePoint(cp) {
        return cp + 0x0020;
    }
    
    //NOTE: String.fromCharCode() function can handle only characters from BMP subset.
    //So, we need to workaround this manually.
    //(see: https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/String/fromCharCode#Getting_it_to_work_with_higher_values)
    function toChar(cp) {
        if (cp <= 0xffff) {
            return String.fromCharCode(cp);
        }
    
        cp -= 0x10000;
        return String.fromCharCode(((cp >>> 10) & 0x3ff) | 0xd800) + String.fromCharCode(0xdc00 | (cp & 0x3ff));
    }
    
    function toAsciiLowerChar(cp) {
        return String.fromCharCode(toAsciiLowerCodePoint(cp));
    }
    
    function findNamedEntityTreeBranch(nodeIx, cp) {
        const branchCount = neTree[++nodeIx];
        let lo = ++nodeIx;
        let hi = lo + branchCount - 1;
    
        while (lo <= hi) {
            const mid = (lo + hi) >>> 1;
            const midCp = neTree[mid];
    
            if (midCp < cp) {
                lo = mid + 1;
            } else if (midCp > cp) {
                hi = mid - 1;
            } else {
                return neTree[mid + branchCount];
            }
        }
    
        return -1;
    }
    
    //Tokenizer
    class Tokenizer {
        constructor() {
            this.preprocessor = new Preprocessor();
    
            this.tokenQueue = [];
    
            this.allowCDATA = false;
    
            this.state = DATA_STATE;
            this.returnState = '';
    
            this.charRefCode = -1;
            this.tempBuff = [];
            this.lastStartTagName = '';
    
            this.consumedAfterSnapshot = -1;
            this.active = false;
    
            this.currentCharacterToken = null;
            this.currentToken = null;
            this.currentAttr = null;
        }
    
        //Errors
        _err() {
            // NOTE: err reporting is noop by default. Enabled by mixin.
        }
    
        _errOnNextCodePoint(err) {
            this._consume();
            this._err(err);
            this._unconsume();
        }
    
        //API
        getNextToken() {
            while (!this.tokenQueue.length && this.active) {
                this.consumedAfterSnapshot = 0;
    
                const cp = this._consume();
    
                if (!this._ensureHibernation()) {
                    this[this.state](cp);
                }
            }
    
            return this.tokenQueue.shift();
        }
    
        write(chunk, isLastChunk) {
            this.active = true;
            this.preprocessor.write(chunk, isLastChunk);
        }
    
        insertHtmlAtCurrentPos(chunk) {
            this.active = true;
            this.preprocessor.insertHtmlAtCurrentPos(chunk);
        }
    
        //Hibernation
        _ensureHibernation() {
            if (this.preprocessor.endOfChunkHit) {
                for (; this.consumedAfterSnapshot > 0; this.consumedAfterSnapshot--) {
                    this.preprocessor.retreat();
                }
    
                this.active = false;
                this.tokenQueue.push({ type: Tokenizer.HIBERNATION_TOKEN });
    
                return true;
            }
    
            return false;
        }
    
        //Consumption
        _consume() {
            this.consumedAfterSnapshot++;
            return this.preprocessor.advance();
        }
    
        _unconsume() {
            this.consumedAfterSnapshot--;
            this.preprocessor.retreat();
        }
    
        _reconsumeInState(state) {
            this.state = state;
            this._unconsume();
        }
    
        _consumeSequenceIfMatch(pattern, startCp, caseSensitive) {
            let consumedCount = 0;
            let isMatch = true;
            const patternLength = pattern.length;
            let patternPos = 0;
            let cp = startCp;
            let patternCp = void 0;
    
            for (; patternPos < patternLength; patternPos++) {
                if (patternPos > 0) {
                    cp = this._consume();
                    consumedCount++;
                }
    
                if (cp === $.EOF) {
                    isMatch = false;
                    break;
                }
    
                patternCp = pattern[patternPos];
    
                if (cp !== patternCp && (caseSensitive || cp !== toAsciiLowerCodePoint(patternCp))) {
                    isMatch = false;
                    break;
                }
            }
    
            if (!isMatch) {
                while (consumedCount--) {
                    this._unconsume();
                }
            }
    
            return isMatch;
        }
    
        //Temp buffer
        _isTempBufferEqualToScriptString() {
            if (this.tempBuff.length !== $$.SCRIPT_STRING.length) {
                return false;
            }
    
            for (let i = 0; i < this.tempBuff.length; i++) {
                if (this.tempBuff[i] !== $$.SCRIPT_STRING[i]) {
                    return false;
                }
            }
    
            return true;
        }
    
        //Token creation
        _createStartTagToken() {
            this.currentToken = {
                type: Tokenizer.START_TAG_TOKEN,
                tagName: '',
                selfClosing: false,
                ackSelfClosing: false,
                attrs: []
            };
        }
    
        _createEndTagToken() {
            this.currentToken = {
                type: Tokenizer.END_TAG_TOKEN,
                tagName: '',
                selfClosing: false,
                attrs: []
            };
        }
    
        _createCommentToken() {
            this.currentToken = {
                type: Tokenizer.COMMENT_TOKEN,
                data: ''
            };
        }
    
        _createDoctypeToken(initialName) {
            this.currentToken = {
                type: Tokenizer.DOCTYPE_TOKEN,
                name: initialName,
                forceQuirks: false,
                publicId: null,
                systemId: null
            };
        }
    
        _createCharacterToken(type, ch) {
            this.currentCharacterToken = {
                type: type,
                chars: ch
            };
        }
    
        _createEOFToken() {
            this.currentToken = { type: Tokenizer.EOF_TOKEN };
        }
    
        //Tag attributes
        _createAttr(attrNameFirstCh) {
            this.currentAttr = {
                name: attrNameFirstCh,
                value: ''
            };
        }
    
        _leaveAttrName(toState) {
            if (Tokenizer.getTokenAttr(this.currentToken, this.currentAttr.name) === null) {
                this.currentToken.attrs.push(this.currentAttr);
            } else {
                this._err(ERR.duplicateAttribute);
            }
    
            this.state = toState;
        }
    
        _leaveAttrValue(toState) {
            this.state = toState;
        }
    
        //Token emission
        _emitCurrentToken() {
            this._emitCurrentCharacterToken();
    
            const ct = this.currentToken;
    
            this.currentToken = null;
    
            //NOTE: store emited start tag's tagName to determine is the following end tag token is appropriate.
            if (ct.type === Tokenizer.START_TAG_TOKEN) {
                this.lastStartTagName = ct.tagName;
            } else if (ct.type === Tokenizer.END_TAG_TOKEN) {
                if (ct.attrs.length > 0) {
                    this._err(ERR.endTagWithAttributes);
                }
    
                if (ct.selfClosing) {
                    this._err(ERR.endTagWithTrailingSolidus);
                }
            }
    
            this.tokenQueue.push(ct);
        }
    
        _emitCurrentCharacterToken() {
            if (this.currentCharacterToken) {
                this.tokenQueue.push(this.currentCharacterToken);
                this.currentCharacterToken = null;
            }
        }
    
        _emitEOFToken() {
            this._createEOFToken();
            this._emitCurrentToken();
        }
    
        //Characters emission
    
        //OPTIMIZATION: specification uses only one type of character tokens (one token per character).
        //This causes a huge memory overhead and a lot of unnecessary parser loops. parse5 uses 3 groups of characters.
        //If we have a sequence of characters that belong to the same group, parser can process it
        //as a single solid character token.
        //So, there are 3 types of character tokens in parse5:
        //1)NULL_CHARACTER_TOKEN - \u0000-character sequences (e.g. '\u0000\u0000\u0000')
        //2)WHITESPACE_CHARACTER_TOKEN - any whitespace/new-line character sequences (e.g. '\n  \r\t   \f')
        //3)CHARACTER_TOKEN - any character sequence which don't belong to groups 1 and 2 (e.g. 'abcdef1234@@#$%^')
        _appendCharToCurrentCharacterToken(type, ch) {
            if (this.currentCharacterToken && this.currentCharacterToken.type !== type) {
                this._emitCurrentCharacterToken();
            }
    
            if (this.currentCharacterToken) {
                this.currentCharacterToken.chars += ch;
            } else {
                this._createCharacterToken(type, ch);
            }
        }
    
        _emitCodePoint(cp) {
            let type = Tokenizer.CHARACTER_TOKEN;
    
            if (isWhitespace(cp)) {
                type = Tokenizer.WHITESPACE_CHARACTER_TOKEN;
            } else if (cp === $.NULL) {
                type = Tokenizer.NULL_CHARACTER_TOKEN;
            }
    
            this._appendCharToCurrentCharacterToken(type, toChar(cp));
        }
    
        _emitSeveralCodePoints(codePoints) {
            for (let i = 0; i < codePoints.length; i++) {
                this._emitCodePoint(codePoints[i]);
            }
        }
    
        //NOTE: used then we emit character explicitly. This is always a non-whitespace and a non-null character.
        //So we can avoid additional checks here.
        _emitChars(ch) {
            this._appendCharToCurrentCharacterToken(Tokenizer.CHARACTER_TOKEN, ch);
        }
    
        // Character reference helpers
        _matchNamedCharacterReference(startCp) {
            let result = null;
            let excess = 1;
            let i = findNamedEntityTreeBranch(0, startCp);
    
            this.tempBuff.push(startCp);
    
            while (i > -1) {
                const current = neTree[i];
                const inNode = current < MAX_BRANCH_MARKER_VALUE;
                const nodeWithData = inNode && current & HAS_DATA_FLAG;
    
                if (nodeWithData) {
                    //NOTE: we use greedy search, so we continue lookup at this point
                    result = current & DATA_DUPLET_FLAG ? [neTree[++i], neTree[++i]] : [neTree[++i]];
                    excess = 0;
                }
    
                const cp = this._consume();
    
                this.tempBuff.push(cp);
                excess++;
    
                if (cp === $.EOF) {
                    break;
                }
    
                if (inNode) {
                    i = current & HAS_BRANCHES_FLAG ? findNamedEntityTreeBranch(i, cp) : -1;
                } else {
                    i = cp === current ? ++i : -1;
                }
            }
    
            while (excess--) {
                this.tempBuff.pop();
                this._unconsume();
            }
    
            return result;
        }
    
        _isCharacterReferenceInAttribute() {
            return (
                this.returnState === ATTRIBUTE_VALUE_DOUBLE_QUOTED_STATE ||
                this.returnState === ATTRIBUTE_VALUE_SINGLE_QUOTED_STATE ||
                this.returnState === ATTRIBUTE_VALUE_UNQUOTED_STATE
            );
        }
    
        _isCharacterReferenceAttributeQuirk(withSemicolon) {
            if (!withSemicolon && this._isCharacterReferenceInAttribute()) {
                const nextCp = this._consume();
    
                this._unconsume();
    
                return nextCp === $.EQUALS_SIGN || isAsciiAlphaNumeric(nextCp);
            }
    
            return false;
        }
    
        _flushCodePointsConsumedAsCharacterReference() {
            if (this._isCharacterReferenceInAttribute()) {
                for (let i = 0; i < this.tempBuff.length; i++) {
                    this.currentAttr.value += toChar(this.tempBuff[i]);
                }
            } else {
                this._emitSeveralCodePoints(this.tempBuff);
            }
    
            this.tempBuff = [];
        }
    
        // State machine
    
        // Data state
        //------------------------------------------------------------------
        [DATA_STATE](cp) {
            this.preprocessor.dropParsedChunk();
    
            if (cp === $.LESS_THAN_SIGN) {
                this.state = TAG_OPEN_STATE;
            } else if (cp === $.AMPERSAND) {
                this.returnState = DATA_STATE;
                this.state = CHARACTER_REFERENCE_STATE;
            } else if (cp === $.NULL) {
                this._err(ERR.unexpectedNullCharacter);
                this._emitCodePoint(cp);
            } else if (cp === $.EOF) {
                this._emitEOFToken();
            } else {
                this._emitCodePoint(cp);
            }
        }
    
        //  RCDATA state
        //------------------------------------------------------------------
        [RCDATA_STATE](cp) {
            this.preprocessor.dropParsedChunk();
    
            if (cp === $.AMPERSAND) {
                this.returnState = RCDATA_STATE;
                this.state = CHARACTER_REFERENCE_STATE;
            } else if (cp === $.LESS_THAN_SIGN) {
                this.state = RCDATA_LESS_THAN_SIGN_STATE;
            } else if (cp === $.NULL) {
                this._err(ERR.unexpectedNullCharacter);
                this._emitChars(unicode.REPLACEMENT_CHARACTER);
            } else if (cp === $.EOF) {
                this._emitEOFToken();
            } else {
                this._emitCodePoint(cp);
            }
        }
    
        // RAWTEXT state
        //------------------------------------------------------------------
        [RAWTEXT_STATE](cp) {
            this.preprocessor.dropParsedChunk();
    
            if (cp === $.LESS_THAN_SIGN) {
                this.state = RAWTEXT_LESS_THAN_SIGN_STATE;
            } else if (cp === $.NULL) {
                this._err(ERR.unexpectedNullCharacter);
                this._emitChars(unicode.REPLACEMENT_CHARACTER);
            } else if (cp === $.EOF) {
                this._emitEOFToken();
            } else {
                this._emitCodePoint(cp);
            }
        }
    
        // Script data state
        //------------------------------------------------------------------
        [SCRIPT_DATA_STATE](cp) {
            this.preprocessor.dropParsedChunk();
    
            if (cp === $.LESS_THAN_SIGN) {
                this.state = SCRIPT_DATA_LESS_THAN_SIGN_STATE;
            } else if (cp === $.NULL) {
                this._err(ERR.unexpectedNullCharacter);
                this._emitChars(unicode.REPLACEMENT_CHARACTER);
            } else if (cp === $.EOF) {
                this._emitEOFToken();
            } else {
                this._emitCodePoint(cp);
            }
        }
    
        // PLAINTEXT state
        //------------------------------------------------------------------
        [PLAINTEXT_STATE](cp) {
            this.preprocessor.dropParsedChunk();
    
            if (cp === $.NULL) {
                this._err(ERR.unexpectedNullCharacter);
                this._emitChars(unicode.REPLACEMENT_CHARACTER);
            } else if (cp === $.EOF) {
                this._emitEOFToken();
            } else {
                this._emitCodePoint(cp);
            }
        }
    
        // Tag open state
        //------------------------------------------------------------------
        [TAG_OPEN_STATE](cp) {
            if (cp === $.EXCLAMATION_MARK) {
                this.state = MARKUP_DECLARATION_OPEN_STATE;
            } else if (cp === $.SOLIDUS) {
                this.state = END_TAG_OPEN_STATE;
            } else if (isAsciiLetter(cp)) {
                this._createStartTagToken();
                this._reconsumeInState(TAG_NAME_STATE);
            } else if (cp === $.QUESTION_MARK) {
                this._err(ERR.unexpectedQuestionMarkInsteadOfTagName);
                this._createCommentToken();
                this._reconsumeInState(BOGUS_COMMENT_STATE);
            } else if (cp === $.EOF) {
                this._err(ERR.eofBeforeTagName);
                this._emitChars('<');
                this._emitEOFToken();
            } else {
                this._err(ERR.invalidFirstCharacterOfTagName);
                this._emitChars('<');
                this._reconsumeInState(DATA_STATE);
            }
        }
    
        // End tag open state
        //------------------------------------------------------------------
        [END_TAG_OPEN_STATE](cp) {
            if (isAsciiLetter(cp)) {
                this._createEndTagToken();
                this._reconsumeInState(TAG_NAME_STATE);
            } else if (cp === $.GREATER_THAN_SIGN) {
                this._err(ERR.missingEndTagName);
                this.state = DATA_STATE;
            } else if (cp === $.EOF) {
                this._err(ERR.eofBeforeTagName);
                this._emitChars('</');
                this._emitEOFToken();
            } else {
                this._err(ERR.invalidFirstCharacterOfTagName);
                this._createCommentToken();
                this._reconsumeInState(BOGUS_COMMENT_STATE);
            }
        }
    
        // Tag name state
        //------------------------------------------------------------------
        [TAG_NAME_STATE](cp) {
            if (isWhitespace(cp)) {
                this.state = BEFORE_ATTRIBUTE_NAME_STATE;
            } else if (cp === $.SOLIDUS) {
                this.state = SELF_CLOSING_START_TAG_STATE;
            } else if (cp === $.GREATER_THAN_SIGN) {
                this.state = DATA_STATE;
                this._emitCurrentToken();
            } else if (isAsciiUpper(cp)) {
                this.currentToken.tagName += toAsciiLowerChar(cp);
            } else if (cp === $.NULL) {
                this._err(ERR.unexpectedNullCharacter);
                this.currentToken.tagName += unicode.REPLACEMENT_CHARACTER;
            } else if (cp === $.EOF) {
                this._err(ERR.eofInTag);
                this._emitEOFToken();
            } else {
                this.currentToken.tagName += toChar(cp);
            }
        }
    
        // RCDATA less-than sign state
        //------------------------------------------------------------------
        [RCDATA_LESS_THAN_SIGN_STATE](cp) {
            if (cp === $.SOLIDUS) {
                this.tempBuff = [];
                this.state = RCDATA_END_TAG_OPEN_STATE;
            } else {
                this._emitChars('<');
                this._reconsumeInState(RCDATA_STATE);
            }
        }
    
        // RCDATA end tag open state
        //------------------------------------------------------------------
        [RCDATA_END_TAG_OPEN_STATE](cp) {
            if (isAsciiLetter(cp)) {
                this._createEndTagToken();
                this._reconsumeInState(RCDATA_END_TAG_NAME_STATE);
            } else {
                this._emitChars('</');
                this._reconsumeInState(RCDATA_STATE);
            }
        }
    
        // RCDATA end tag name state
        //------------------------------------------------------------------
        [RCDATA_END_TAG_NAME_STATE](cp) {
            if (isAsciiUpper(cp)) {
                this.currentToken.tagName += toAsciiLowerChar(cp);
                this.tempBuff.push(cp);
            } else if (isAsciiLower(cp)) {
                this.currentToken.tagName += toChar(cp);
                this.tempBuff.push(cp);
            } else {
                if (this.lastStartTagName === this.currentToken.tagName) {
                    if (isWhitespace(cp)) {
                        this.state = BEFORE_ATTRIBUTE_NAME_STATE;
                        return;
                    }
    
                    if (cp === $.SOLIDUS) {
                        this.state = SELF_CLOSING_START_TAG_STATE;
                        return;
                    }
    
                    if (cp === $.GREATER_THAN_SIGN) {
                        this.state = DATA_STATE;
                        this._emitCurrentToken();
                        return;
                    }
                }
    
                this._emitChars('</');
                this._emitSeveralCodePoints(this.tempBuff);
                this._reconsumeInState(RCDATA_STATE);
            }
        }
    
        // RAWTEXT less-than sign state
        //------------------------------------------------------------------
        [RAWTEXT_LESS_THAN_SIGN_STATE](cp) {
            if (cp === $.SOLIDUS) {
                this.tempBuff = [];
                this.state = RAWTEXT_END_TAG_OPEN_STATE;
            } else {
                this._emitChars('<');
                this._reconsumeInState(RAWTEXT_STATE);
            }
        }
    
        // RAWTEXT end tag open state
        //------------------------------------------------------------------
        [RAWTEXT_END_TAG_OPEN_STATE](cp) {
            if (isAsciiLetter(cp)) {
                this._createEndTagToken();
                this._reconsumeInState(RAWTEXT_END_TAG_NAME_STATE);
            } else {
                this._emitChars('</');
                this._reconsumeInState(RAWTEXT_STATE);
            }
        }
    
        // RAWTEXT end tag name state
        //------------------------------------------------------------------
        [RAWTEXT_END_TAG_NAME_STATE](cp) {
            if (isAsciiUpper(cp)) {
                this.currentToken.tagName += toAsciiLowerChar(cp);
                this.tempBuff.push(cp);
            } else if (isAsciiLower(cp)) {
                this.currentToken.tagName += toChar(cp);
                this.tempBuff.push(cp);
            } else {
                if (this.lastStartTagName === this.currentToken.tagName) {
                    if (isWhitespace(cp)) {
                        this.state = BEFORE_ATTRIBUTE_NAME_STATE;
                        return;
                    }
    
                    if (cp === $.SOLIDUS) {
                        this.state = SELF_CLOSING_START_TAG_STATE;
                        return;
                    }
    
                    if (cp === $.GREATER_THAN_SIGN) {
                        this._emitCurrentToken();
                        this.state = DATA_STATE;
                        return;
                    }
                }
    
                this._emitChars('</');
                this._emitSeveralCodePoints(this.tempBuff);
                this._reconsumeInState(RAWTEXT_STATE);
            }
        }
    
        // Script data less-than sign state
        //------------------------------------------------------------------
        [SCRIPT_DATA_LESS_THAN_SIGN_STATE](cp) {
            if (cp === $.SOLIDUS) {
                this.tempBuff = [];
                this.state = SCRIPT_DATA_END_TAG_OPEN_STATE;
            } else if (cp === $.EXCLAMATION_MARK) {
                this.state = SCRIPT_DATA_ESCAPE_START_STATE;
                this._emitChars('<!');
            } else {
                this._emitChars('<');
                this._reconsumeInState(SCRIPT_DATA_STATE);
            }
        }
    
        // Script data end tag open state
        //------------------------------------------------------------------
        [SCRIPT_DATA_END_TAG_OPEN_STATE](cp) {
            if (isAsciiLetter(cp)) {
                this._createEndTagToken();
                this._reconsumeInState(SCRIPT_DATA_END_TAG_NAME_STATE);
            } else {
                this._emitChars('</');
                this._reconsumeInState(SCRIPT_DATA_STATE);
            }
        }
    
        // Script data end tag name state
        //------------------------------------------------------------------
        [SCRIPT_DATA_END_TAG_NAME_STATE](cp) {
            if (isAsciiUpper(cp)) {
                this.currentToken.tagName += toAsciiLowerChar(cp);
                this.tempBuff.push(cp);
            } else if (isAsciiLower(cp)) {
                this.currentToken.tagName += toChar(cp);
                this.tempBuff.push(cp);
            } else {
                if (this.lastStartTagName === this.currentToken.tagName) {
                    if (isWhitespace(cp)) {
                        this.state = BEFORE_ATTRIBUTE_NAME_STATE;
                        return;
                    } else if (cp === $.SOLIDUS) {
                        this.state = SELF_CLOSING_START_TAG_STATE;
                        return;
                    } else if (cp === $.GREATER_THAN_SIGN) {
                        this._emitCurrentToken();
                        this.state = DATA_STATE;
                        return;
                    }
                }
    
                this._emitChars('</');
                this._emitSeveralCodePoints(this.tempBuff);
                this._reconsumeInState(SCRIPT_DATA_STATE);
            }
        }
    
        // Script data escape start state
        //------------------------------------------------------------------
        [SCRIPT_DATA_ESCAPE_START_STATE](cp) {
            if (cp === $.HYPHEN_MINUS) {
                this.state = SCRIPT_DATA_ESCAPE_START_DASH_STATE;
                this._emitChars('-');
            } else {
                this._reconsumeInState(SCRIPT_DATA_STATE);
            }
        }
    
        // Script data escape start dash state
        //------------------------------------------------------------------
        [SCRIPT_DATA_ESCAPE_START_DASH_STATE](cp) {
            if (cp === $.HYPHEN_MINUS) {
                this.state = SCRIPT_DATA_ESCAPED_DASH_DASH_STATE;
                this._emitChars('-');
            } else {
                this._reconsumeInState(SCRIPT_DATA_STATE);
            }
        }
    
        // Script data escaped state
        //------------------------------------------------------------------
        [SCRIPT_DATA_ESCAPED_STATE](cp) {
            if (cp === $.HYPHEN_MINUS) {
                this.state = SCRIPT_DATA_ESCAPED_DASH_STATE;
                this._emitChars('-');
            } else if (cp === $.LESS_THAN_SIGN) {
                this.state = SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN_STATE;
            } else if (cp === $.NULL) {
                this._err(ERR.unexpectedNullCharacter);
                this._emitChars(unicode.REPLACEMENT_CHARACTER);
            } else if (cp === $.EOF) {
                this._err(ERR.eofInScriptHtmlCommentLikeText);
                this._emitEOFToken();
            } else {
                this._emitCodePoint(cp);
            }
        }
    
        // Script data escaped dash state
        //------------------------------------------------------------------
        [SCRIPT_DATA_ESCAPED_DASH_STATE](cp) {
            if (cp === $.HYPHEN_MINUS) {
                this.state = SCRIPT_DATA_ESCAPED_DASH_DASH_STATE;
                this._emitChars('-');
            } else if (cp === $.LESS_THAN_SIGN) {
                this.state = SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN_STATE;
            } else if (cp === $.NULL) {
                this._err(ERR.unexpectedNullCharacter);
                this.state = SCRIPT_DATA_ESCAPED_STATE;
                this._emitChars(unicode.REPLACEMENT_CHARACTER);
            } else if (cp === $.EOF) {
                this._err(ERR.eofInScriptHtmlCommentLikeText);
                this._emitEOFToken();
            } else {
                this.state = SCRIPT_DATA_ESCAPED_STATE;
                this._emitCodePoint(cp);
            }
        }
    
        // Script data escaped dash dash state
        //------------------------------------------------------------------
        [SCRIPT_DATA_ESCAPED_DASH_DASH_STATE](cp) {
            if (cp === $.HYPHEN_MINUS) {
                this._emitChars('-');
            } else if (cp === $.LESS_THAN_SIGN) {
                this.state = SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN_STATE;
            } else if (cp === $.GREATER_THAN_SIGN) {
                this.state = SCRIPT_DATA_STATE;
                this._emitChars('>');
            } else if (cp === $.NULL) {
                this._err(ERR.unexpectedNullCharacter);
                this.state = SCRIPT_DATA_ESCAPED_STATE;
                this._emitChars(unicode.REPLACEMENT_CHARACTER);
            } else if (cp === $.EOF) {
                this._err(ERR.eofInScriptHtmlCommentLikeText);
                this._emitEOFToken();
            } else {
                this.state = SCRIPT_DATA_ESCAPED_STATE;
                this._emitCodePoint(cp);
            }
        }
    
        // Script data escaped less-than sign state
        //------------------------------------------------------------------
        [SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN_STATE](cp) {
            if (cp === $.SOLIDUS) {
                this.tempBuff = [];
                this.state = SCRIPT_DATA_ESCAPED_END_TAG_OPEN_STATE;
            } else if (isAsciiLetter(cp)) {
                this.tempBuff = [];
                this._emitChars('<');
                this._reconsumeInState(SCRIPT_DATA_DOUBLE_ESCAPE_START_STATE);
            } else {
                this._emitChars('<');
                this._reconsumeInState(SCRIPT_DATA_ESCAPED_STATE);
            }
        }
    
        // Script data escaped end tag open state
        //------------------------------------------------------------------
        [SCRIPT_DATA_ESCAPED_END_TAG_OPEN_STATE](cp) {
            if (isAsciiLetter(cp)) {
                this._createEndTagToken();
                this._reconsumeInState(SCRIPT_DATA_ESCAPED_END_TAG_NAME_STATE);
            } else {
                this._emitChars('</');
                this._reconsumeInState(SCRIPT_DATA_ESCAPED_STATE);
            }
        }
    
        // Script data escaped end tag name state
        //------------------------------------------------------------------
        [SCRIPT_DATA_ESCAPED_END_TAG_NAME_STATE](cp) {
            if (isAsciiUpper(cp)) {
                this.currentToken.tagName += toAsciiLowerChar(cp);
                this.tempBuff.push(cp);
            } else if (isAsciiLower(cp)) {
                this.currentToken.tagName += toChar(cp);
                this.tempBuff.push(cp);
            } else {
                if (this.lastStartTagName === this.currentToken.tagName) {
                    if (isWhitespace(cp)) {
                        this.state = BEFORE_ATTRIBUTE_NAME_STATE;
                        return;
                    }
    
                    if (cp === $.SOLIDUS) {
                        this.state = SELF_CLOSING_START_TAG_STATE;
                        return;
                    }
    
                    if (cp === $.GREATER_THAN_SIGN) {
                        this._emitCurrentToken();
                        this.state = DATA_STATE;
                        return;
                    }
                }
    
                this._emitChars('</');
                this._emitSeveralCodePoints(this.tempBuff);
                this._reconsumeInState(SCRIPT_DATA_ESCAPED_STATE);
            }
        }
    
        // Script data double escape start state
        //------------------------------------------------------------------
        [SCRIPT_DATA_DOUBLE_ESCAPE_START_STATE](cp) {
            if (isWhitespace(cp) || cp === $.SOLIDUS || cp === $.GREATER_THAN_SIGN) {
                this.state = this._isTempBufferEqualToScriptString()
                    ? SCRIPT_DATA_DOUBLE_ESCAPED_STATE
                    : SCRIPT_DATA_ESCAPED_STATE;
                this._emitCodePoint(cp);
            } else if (isAsciiUpper(cp)) {
                this.tempBuff.push(toAsciiLowerCodePoint(cp));
                this._emitCodePoint(cp);
            } else if (isAsciiLower(cp)) {
                this.tempBuff.push(cp);
                this._emitCodePoint(cp);
            } else {
                this._reconsumeInState(SCRIPT_DATA_ESCAPED_STATE);
            }
        }
    
        // Script data double escaped state
        //------------------------------------------------------------------
        [SCRIPT_DATA_DOUBLE_ESCAPED_STATE](cp) {
            if (cp === $.HYPHEN_MINUS) {
                this.state = SCRIPT_DATA_DOUBLE_ESCAPED_DASH_STATE;
                this._emitChars('-');
            } else if (cp === $.LESS_THAN_SIGN) {
                this.state = SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN_STATE;
                this._emitChars('<');
            } else if (cp === $.NULL) {
                this._err(ERR.unexpectedNullCharacter);
                this._emitChars(unicode.REPLACEMENT_CHARACTER);
            } else if (cp === $.EOF) {
                this._err(ERR.eofInScriptHtmlCommentLikeText);
                this._emitEOFToken();
            } else {
                this._emitCodePoint(cp);
            }
        }
    
        // Script data double escaped dash state
        //------------------------------------------------------------------
        [SCRIPT_DATA_DOUBLE_ESCAPED_DASH_STATE](cp) {
            if (cp === $.HYPHEN_MINUS) {
                this.state = SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH_STATE;
                this._emitChars('-');
            } else if (cp === $.LESS_THAN_SIGN) {
                this.state = SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN_STATE;
                this._emitChars('<');
            } else if (cp === $.NULL) {
                this._err(ERR.unexpectedNullCharacter);
                this.state = SCRIPT_DATA_DOUBLE_ESCAPED_STATE;
                this._emitChars(unicode.REPLACEMENT_CHARACTER);
            } else if (cp === $.EOF) {
                this._err(ERR.eofInScriptHtmlCommentLikeText);
                this._emitEOFToken();
            } else {
                this.state = SCRIPT_DATA_DOUBLE_ESCAPED_STATE;
                this._emitCodePoint(cp);
            }
        }
    
        // Script data double escaped dash dash state
        //------------------------------------------------------------------
        [SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH_STATE](cp) {
            if (cp === $.HYPHEN_MINUS) {
                this._emitChars('-');
            } else if (cp === $.LESS_THAN_SIGN) {
                this.state = SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN_STATE;
                this._emitChars('<');
            } else if (cp === $.GREATER_THAN_SIGN) {
                this.state = SCRIPT_DATA_STATE;
                this._emitChars('>');
            } else if (cp === $.NULL) {
                this._err(ERR.unexpectedNullCharacter);
                this.state = SCRIPT_DATA_DOUBLE_ESCAPED_STATE;
                this._emitChars(unicode.REPLACEMENT_CHARACTER);
            } else if (cp === $.EOF) {
                this._err(ERR.eofInScriptHtmlCommentLikeText);
                this._emitEOFToken();
            } else {
                this.state = SCRIPT_DATA_DOUBLE_ESCAPED_STATE;
                this._emitCodePoint(cp);
            }
        }
    
        // Script data double escaped less-than sign state
        //------------------------------------------------------------------
        [SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN_STATE](cp) {
            if (cp === $.SOLIDUS) {
                this.tempBuff = [];
                this.state = SCRIPT_DATA_DOUBLE_ESCAPE_END_STATE;
                this._emitChars('/');
            } else {
                this._reconsumeInState(SCRIPT_DATA_DOUBLE_ESCAPED_STATE);
            }
        }
    
        // Script data double escape end state
        //------------------------------------------------------------------
        [SCRIPT_DATA_DOUBLE_ESCAPE_END_STATE](cp) {
            if (isWhitespace(cp) || cp === $.SOLIDUS || cp === $.GREATER_THAN_SIGN) {
                this.state = this._isTempBufferEqualToScriptString()
                    ? SCRIPT_DATA_ESCAPED_STATE
                    : SCRIPT_DATA_DOUBLE_ESCAPED_STATE;
    
                this._emitCodePoint(cp);
            } else if (isAsciiUpper(cp)) {
                this.tempBuff.push(toAsciiLowerCodePoint(cp));
                this._emitCodePoint(cp);
            } else if (isAsciiLower(cp)) {
                this.tempBuff.push(cp);
                this._emitCodePoint(cp);
            } else {
                this._reconsumeInState(SCRIPT_DATA_DOUBLE_ESCAPED_STATE);
            }
        }
    
        // Before attribute name state
        //------------------------------------------------------------------
        [BEFORE_ATTRIBUTE_NAME_STATE](cp) {
            if (isWhitespace(cp)) {
                return;
            }
    
            if (cp === $.SOLIDUS || cp === $.GREATER_THAN_SIGN || cp === $.EOF) {
                this._reconsumeInState(AFTER_ATTRIBUTE_NAME_STATE);
            } else if (cp === $.EQUALS_SIGN) {
                this._err(ERR.unexpectedEqualsSignBeforeAttributeName);
                this._createAttr('=');
                this.state = ATTRIBUTE_NAME_STATE;
            } else {
                this._createAttr('');
                this._reconsumeInState(ATTRIBUTE_NAME_STATE);
            }
        }
    
        // Attribute name state
        //------------------------------------------------------------------
        [ATTRIBUTE_NAME_STATE](cp) {
            if (isWhitespace(cp) || cp === $.SOLIDUS || cp === $.GREATER_THAN_SIGN || cp === $.EOF) {
                this._leaveAttrName(AFTER_ATTRIBUTE_NAME_STATE);
                this._unconsume();
            } else if (cp === $.EQUALS_SIGN) {
                this._leaveAttrName(BEFORE_ATTRIBUTE_VALUE_STATE);
            } else if (isAsciiUpper(cp)) {
                this.currentAttr.name += toAsciiLowerChar(cp);
            } else if (cp === $.QUOTATION_MARK || cp === $.APOSTROPHE || cp === $.LESS_THAN_SIGN) {
                this._err(ERR.unexpectedCharacterInAttributeName);
                this.currentAttr.name += toChar(cp);
            } else if (cp === $.NULL) {
                this._err(ERR.unexpectedNullCharacter);
                this.currentAttr.name += unicode.REPLACEMENT_CHARACTER;
            } else {
                this.currentAttr.name += toChar(cp);
            }
        }
    
        // After attribute name state
        //------------------------------------------------------------------
        [AFTER_ATTRIBUTE_NAME_STATE](cp) {
            if (isWhitespace(cp)) {
                return;
            }
    
            if (cp === $.SOLIDUS) {
                this.state = SELF_CLOSING_START_TAG_STATE;
            } else if (cp === $.EQUALS_SIGN) {
                this.state = BEFORE_ATTRIBUTE_VALUE_STATE;
            } else if (cp === $.GREATER_THAN_SIGN) {
                this.state = DATA_STATE;
                this._emitCurrentToken();
            } else if (cp === $.EOF) {
                this._err(ERR.eofInTag);
                this._emitEOFToken();
            } else {
                this._createAttr('');
                this._reconsumeInState(ATTRIBUTE_NAME_STATE);
            }
        }
    
        // Before attribute value state
        //------------------------------------------------------------------
        [BEFORE_ATTRIBUTE_VALUE_STATE](cp) {
            if (isWhitespace(cp)) {
                return;
            }
    
            if (cp === $.QUOTATION_MARK) {
                this.state = ATTRIBUTE_VALUE_DOUBLE_QUOTED_STATE;
            } else if (cp === $.APOSTROPHE) {
                this.state = ATTRIBUTE_VALUE_SINGLE_QUOTED_STATE;
            } else if (cp === $.GREATER_THAN_SIGN) {
                this._err(ERR.missingAttributeValue);
                this.state = DATA_STATE;
                this._emitCurrentToken();
            } else {
                this._reconsumeInState(ATTRIBUTE_VALUE_UNQUOTED_STATE);
            }
        }
    
        // Attribute value (double-quoted) state
        //------------------------------------------------------------------
        [ATTRIBUTE_VALUE_DOUBLE_QUOTED_STATE](cp) {
            if (cp === $.QUOTATION_MARK) {
                this.state = AFTER_ATTRIBUTE_VALUE_QUOTED_STATE;
            } else if (cp === $.AMPERSAND) {
                this.returnState = ATTRIBUTE_VALUE_DOUBLE_QUOTED_STATE;
                this.state = CHARACTER_REFERENCE_STATE;
            } else if (cp === $.NULL) {
                this._err(ERR.unexpectedNullCharacter);
                this.currentAttr.value += unicode.REPLACEMENT_CHARACTER;
            } else if (cp === $.EOF) {
                this._err(ERR.eofInTag);
                this._emitEOFToken();
            } else {
                this.currentAttr.value += toChar(cp);
            }
        }
    
        // Attribute value (single-quoted) state
        //------------------------------------------------------------------
        [ATTRIBUTE_VALUE_SINGLE_QUOTED_STATE](cp) {
            if (cp === $.APOSTROPHE) {
                this.state = AFTER_ATTRIBUTE_VALUE_QUOTED_STATE;
            } else if (cp === $.AMPERSAND) {
                this.returnState = ATTRIBUTE_VALUE_SINGLE_QUOTED_STATE;
                this.state = CHARACTER_REFERENCE_STATE;
            } else if (cp === $.NULL) {
                this._err(ERR.unexpectedNullCharacter);
                this.currentAttr.value += unicode.REPLACEMENT_CHARACTER;
            } else if (cp === $.EOF) {
                this._err(ERR.eofInTag);
                this._emitEOFToken();
            } else {
                this.currentAttr.value += toChar(cp);
            }
        }
    
        // Attribute value (unquoted) state
        //------------------------------------------------------------------
        [ATTRIBUTE_VALUE_UNQUOTED_STATE](cp) {
            if (isWhitespace(cp)) {
                this._leaveAttrValue(BEFORE_ATTRIBUTE_NAME_STATE);
            } else if (cp === $.AMPERSAND) {
                this.returnState = ATTRIBUTE_VALUE_UNQUOTED_STATE;
                this.state = CHARACTER_REFERENCE_STATE;
            } else if (cp === $.GREATER_THAN_SIGN) {
                this._leaveAttrValue(DATA_STATE);
                this._emitCurrentToken();
            } else if (cp === $.NULL) {
                this._err(ERR.unexpectedNullCharacter);
                this.currentAttr.value += unicode.REPLACEMENT_CHARACTER;
            } else if (
                cp === $.QUOTATION_MARK ||
                cp === $.APOSTROPHE ||
                cp === $.LESS_THAN_SIGN ||
                cp === $.EQUALS_SIGN ||
                cp === $.GRAVE_ACCENT
            ) {
                this._err(ERR.unexpectedCharacterInUnquotedAttributeValue);
                this.currentAttr.value += toChar(cp);
            } else if (cp === $.EOF) {
                this._err(ERR.eofInTag);
                this._emitEOFToken();
            } else {
                this.currentAttr.value += toChar(cp);
            }
        }
    
        // After attribute value (quoted) state
        //------------------------------------------------------------------
        [AFTER_ATTRIBUTE_VALUE_QUOTED_STATE](cp) {
            if (isWhitespace(cp)) {
                this._leaveAttrValue(BEFORE_ATTRIBUTE_NAME_STATE);
            } else if (cp === $.SOLIDUS) {
                this._leaveAttrValue(SELF_CLOSING_START_TAG_STATE);
            } else if (cp === $.GREATER_THAN_SIGN) {
                this._leaveAttrValue(DATA_STATE);
                this._emitCurrentToken();
            } else if (cp === $.EOF) {
                this._err(ERR.eofInTag);
                this._emitEOFToken();
            } else {
                this._err(ERR.missingWhitespaceBetweenAttributes);
                this._reconsumeInState(BEFORE_ATTRIBUTE_NAME_STATE);
            }
        }
    
        // Self-closing start tag state
        //------------------------------------------------------------------
        [SELF_CLOSING_START_TAG_STATE](cp) {
            if (cp === $.GREATER_THAN_SIGN) {
                this.currentToken.selfClosing = true;
                this.state = DATA_STATE;
                this._emitCurrentToken();
            } else if (cp === $.EOF) {
                this._err(ERR.eofInTag);
                this._emitEOFToken();
            } else {
                this._err(ERR.unexpectedSolidusInTag);
                this._reconsumeInState(BEFORE_ATTRIBUTE_NAME_STATE);
            }
        }
    
        // Bogus comment state
        //------------------------------------------------------------------
        [BOGUS_COMMENT_STATE](cp) {
            if (cp === $.GREATER_THAN_SIGN) {
                this.state = DATA_STATE;
                this._emitCurrentToken();
            } else if (cp === $.EOF) {
                this._emitCurrentToken();
                this._emitEOFToken();
            } else if (cp === $.NULL) {
                this._err(ERR.unexpectedNullCharacter);
                this.currentToken.data += unicode.REPLACEMENT_CHARACTER;
            } else {
                this.currentToken.data += toChar(cp);
            }
        }
    
        // Markup declaration open state
        //------------------------------------------------------------------
        [MARKUP_DECLARATION_OPEN_STATE](cp) {
            if (this._consumeSequenceIfMatch($$.DASH_DASH_STRING, cp, true)) {
                this._createCommentToken();
                this.state = COMMENT_START_STATE;
            } else if (this._consumeSequenceIfMatch($$.DOCTYPE_STRING, cp, false)) {
                this.state = DOCTYPE_STATE;
            } else if (this._consumeSequenceIfMatch($$.CDATA_START_STRING, cp, true)) {
                if (this.allowCDATA) {
                    this.state = CDATA_SECTION_STATE;
                } else {
                    this._err(ERR.cdataInHtmlContent);
                    this._createCommentToken();
                    this.currentToken.data = '[CDATA[';
                    this.state = BOGUS_COMMENT_STATE;
                }
            }
    
            //NOTE: sequence lookup can be abrupted by hibernation. In that case lookup
            //results are no longer valid and we will need to start over.
            else if (!this._ensureHibernation()) {
                this._err(ERR.incorrectlyOpenedComment);
                this._createCommentToken();
                this._reconsumeInState(BOGUS_COMMENT_STATE);
            }
        }
    
        // Comment start state
        //------------------------------------------------------------------
        [COMMENT_START_STATE](cp) {
            if (cp === $.HYPHEN_MINUS) {
                this.state = COMMENT_START_DASH_STATE;
            } else if (cp === $.GREATER_THAN_SIGN) {
                this._err(ERR.abruptClosingOfEmptyComment);
                this.state = DATA_STATE;
                this._emitCurrentToken();
            } else {
                this._reconsumeInState(COMMENT_STATE);
            }
        }
    
        // Comment start dash state
        //------------------------------------------------------------------
        [COMMENT_START_DASH_STATE](cp) {
            if (cp === $.HYPHEN_MINUS) {
                this.state = COMMENT_END_STATE;
            } else if (cp === $.GREATER_THAN_SIGN) {
                this._err(ERR.abruptClosingOfEmptyComment);
                this.state = DATA_STATE;
                this._emitCurrentToken();
            } else if (cp === $.EOF) {
                this._err(ERR.eofInComment);
                this._emitCurrentToken();
                this._emitEOFToken();
            } else {
                this.currentToken.data += '-';
                this._reconsumeInState(COMMENT_STATE);
            }
        }
    
        // Comment state
        //------------------------------------------------------------------
        [COMMENT_STATE](cp) {
            if (cp === $.HYPHEN_MINUS) {
                this.state = COMMENT_END_DASH_STATE;
            } else if (cp === $.LESS_THAN_SIGN) {
                this.currentToken.data += '<';
                this.state = COMMENT_LESS_THAN_SIGN_STATE;
            } else if (cp === $.NULL) {
                this._err(ERR.unexpectedNullCharacter);
                this.currentToken.data += unicode.REPLACEMENT_CHARACTER;
            } else if (cp === $.EOF) {
                this._err(ERR.eofInComment);
                this._emitCurrentToken();
                this._emitEOFToken();
            } else {
                this.currentToken.data += toChar(cp);
            }
        }
    
        // Comment less-than sign state
        //------------------------------------------------------------------
        [COMMENT_LESS_THAN_SIGN_STATE](cp) {
            if (cp === $.EXCLAMATION_MARK) {
                this.currentToken.data += '!';
                this.state = COMMENT_LESS_THAN_SIGN_BANG_STATE;
            } else if (cp === $.LESS_THAN_SIGN) {
                this.currentToken.data += '!';
            } else {
                this._reconsumeInState(COMMENT_STATE);
            }
        }
    
        // Comment less-than sign bang state
        //------------------------------------------------------------------
        [COMMENT_LESS_THAN_SIGN_BANG_STATE](cp) {
            if (cp === $.HYPHEN_MINUS) {
                this.state = COMMENT_LESS_THAN_SIGN_BANG_DASH_STATE;
            } else {
                this._reconsumeInState(COMMENT_STATE);
            }
        }
    
        // Comment less-than sign bang dash state
        //------------------------------------------------------------------
        [COMMENT_LESS_THAN_SIGN_BANG_DASH_STATE](cp) {
            if (cp === $.HYPHEN_MINUS) {
                this.state = COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH_STATE;
            } else {
                this._reconsumeInState(COMMENT_END_DASH_STATE);
            }
        }
    
        // Comment less-than sign bang dash dash state
        //------------------------------------------------------------------
        [COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH_STATE](cp) {
            if (cp !== $.GREATER_THAN_SIGN && cp !== $.EOF) {
                this._err(ERR.nestedComment);
            }
    
            this._reconsumeInState(COMMENT_END_STATE);
        }
    
        // Comment end dash state
        //------------------------------------------------------------------
        [COMMENT_END_DASH_STATE](cp) {
            if (cp === $.HYPHEN_MINUS) {
                this.state = COMMENT_END_STATE;
            } else if (cp === $.EOF) {
                this._err(ERR.eofInComment);
                this._emitCurrentToken();
                this._emitEOFToken();
            } else {
                this.currentToken.data += '-';
                this._reconsumeInState(COMMENT_STATE);
            }
        }
    
        // Comment end state
        //------------------------------------------------------------------
        [COMMENT_END_STATE](cp) {
            if (cp === $.GREATER_THAN_SIGN) {
                this.state = DATA_STATE;
                this._emitCurrentToken();
            } else if (cp === $.EXCLAMATION_MARK) {
                this.state = COMMENT_END_BANG_STATE;
            } else if (cp === $.HYPHEN_MINUS) {
                this.currentToken.data += '-';
            } else if (cp === $.EOF) {
                this._err(ERR.eofInComment);
                this._emitCurrentToken();
                this._emitEOFToken();
            } else {
                this.currentToken.data += '--';
                this._reconsumeInState(COMMENT_STATE);
            }
        }
    
        // Comment end bang state
        //------------------------------------------------------------------
        [COMMENT_END_BANG_STATE](cp) {
            if (cp === $.HYPHEN_MINUS) {
                this.currentToken.data += '--!';
                this.state = COMMENT_END_DASH_STATE;
            } else if (cp === $.GREATER_THAN_SIGN) {
                this._err(ERR.incorrectlyClosedComment);
                this.state = DATA_STATE;
                this._emitCurrentToken();
            } else if (cp === $.EOF) {
                this._err(ERR.eofInComment);
                this._emitCurrentToken();
                this._emitEOFToken();
            } else {
                this.currentToken.data += '--!';
                this._reconsumeInState(COMMENT_STATE);
            }
        }
    
        // DOCTYPE state
        //------------------------------------------------------------------
        [DOCTYPE_STATE](cp) {
            if (isWhitespace(cp)) {
                this.state = BEFORE_DOCTYPE_NAME_STATE;
            } else if (cp === $.GREATER_THAN_SIGN) {
                this._reconsumeInState(BEFORE_DOCTYPE_NAME_STATE);
            } else if (cp === $.EOF) {
                this._err(ERR.eofInDoctype);
                this._createDoctypeToken(null);
                this.currentToken.forceQuirks = true;
                this._emitCurrentToken();
                this._emitEOFToken();
            } else {
                this._err(ERR.missingWhitespaceBeforeDoctypeName);
                this._reconsumeInState(BEFORE_DOCTYPE_NAME_STATE);
            }
        }
    
        // Before DOCTYPE name state
        //------------------------------------------------------------------
        [BEFORE_DOCTYPE_NAME_STATE](cp) {
            if (isWhitespace(cp)) {
                return;
            }
    
            if (isAsciiUpper(cp)) {
                this._createDoctypeToken(toAsciiLowerChar(cp));
                this.state = DOCTYPE_NAME_STATE;
            } else if (cp === $.NULL) {
                this._err(ERR.unexpectedNullCharacter);
                this._createDoctypeToken(unicode.REPLACEMENT_CHARACTER);
                this.state = DOCTYPE_NAME_STATE;
            } else if (cp === $.GREATER_THAN_SIGN) {
                this._err(ERR.missingDoctypeName);
                this._createDoctypeToken(null);
                this.currentToken.forceQuirks = true;
                this._emitCurrentToken();
                this.state = DATA_STATE;
            } else if (cp === $.EOF) {
                this._err(ERR.eofInDoctype);
                this._createDoctypeToken(null);
                this.currentToken.forceQuirks = true;
                this._emitCurrentToken();
                this._emitEOFToken();
            } else {
                this._createDoctypeToken(toChar(cp));
                this.state = DOCTYPE_NAME_STATE;
            }
        }
    
        // DOCTYPE name state
        //------------------------------------------------------------------
        [DOCTYPE_NAME_STATE](cp) {
            if (isWhitespace(cp)) {
                this.state = AFTER_DOCTYPE_NAME_STATE;
            } else if (cp === $.GREATER_THAN_SIGN) {
                this.state = DATA_STATE;
                this._emitCurrentToken();
            } else if (isAsciiUpper(cp)) {
                this.currentToken.name += toAsciiLowerChar(cp);
            } else if (cp === $.NULL) {
                this._err(ERR.unexpectedNullCharacter);
                this.currentToken.name += unicode.REPLACEMENT_CHARACTER;
            } else if (cp === $.EOF) {
                this._err(ERR.eofInDoctype);
                this.currentToken.forceQuirks = true;
                this._emitCurrentToken();
                this._emitEOFToken();
            } else {
                this.currentToken.name += toChar(cp);
            }
        }
    
        // After DOCTYPE name state
        //------------------------------------------------------------------
        [AFTER_DOCTYPE_NAME_STATE](cp) {
            if (isWhitespace(cp)) {
                return;
            }
    
            if (cp === $.GREATER_THAN_SIGN) {
                this.state = DATA_STATE;
                this._emitCurrentToken();
            } else if (cp === $.EOF) {
                this._err(ERR.eofInDoctype);
                this.currentToken.forceQuirks = true;
                this._emitCurrentToken();
                this._emitEOFToken();
            } else if (this._consumeSequenceIfMatch($$.PUBLIC_STRING, cp, false)) {
                this.state = AFTER_DOCTYPE_PUBLIC_KEYWORD_STATE;
            } else if (this._consumeSequenceIfMatch($$.SYSTEM_STRING, cp, false)) {
                this.state = AFTER_DOCTYPE_SYSTEM_KEYWORD_STATE;
            }
            //NOTE: sequence lookup can be abrupted by hibernation. In that case lookup
            //results are no longer valid and we will need to start over.
            else if (!this._ensureHibernation()) {
                this._err(ERR.invalidCharacterSequenceAfterDoctypeName);
                this.currentToken.forceQuirks = true;
                this._reconsumeInState(BOGUS_DOCTYPE_STATE);
            }
        }
    
        // After DOCTYPE public keyword state
        //------------------------------------------------------------------
        [AFTER_DOCTYPE_PUBLIC_KEYWORD_STATE](cp) {
            if (isWhitespace(cp)) {
                this.state = BEFORE_DOCTYPE_PUBLIC_IDENTIFIER_STATE;
            } else if (cp === $.QUOTATION_MARK) {
                this._err(ERR.missingWhitespaceAfterDoctypePublicKeyword);
                this.currentToken.publicId = '';
                this.state = DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED_STATE;
            } else if (cp === $.APOSTROPHE) {
                this._err(ERR.missingWhitespaceAfterDoctypePublicKeyword);
                this.currentToken.publicId = '';
                this.state = DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED_STATE;
            } else if (cp === $.GREATER_THAN_SIGN) {
                this._err(ERR.missingDoctypePublicIdentifier);
                this.currentToken.forceQuirks = true;
                this.state = DATA_STATE;
                this._emitCurrentToken();
            } else if (cp === $.EOF) {
                this._err(ERR.eofInDoctype);
                this.currentToken.forceQuirks = true;
                this._emitCurrentToken();
                this._emitEOFToken();
            } else {
                this._err(ERR.missingQuoteBeforeDoctypePublicIdentifier);
                this.currentToken.forceQuirks = true;
                this._reconsumeInState(BOGUS_DOCTYPE_STATE);
            }
        }
    
        // Before DOCTYPE public identifier state
        //------------------------------------------------------------------
        [BEFORE_DOCTYPE_PUBLIC_IDENTIFIER_STATE](cp) {
            if (isWhitespace(cp)) {
                return;
            }
    
            if (cp === $.QUOTATION_MARK) {
                this.currentToken.publicId = '';
                this.state = DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED_STATE;
            } else if (cp === $.APOSTROPHE) {
                this.currentToken.publicId = '';
                this.state = DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED_STATE;
            } else if (cp === $.GREATER_THAN_SIGN) {
                this._err(ERR.missingDoctypePublicIdentifier);
                this.currentToken.forceQuirks = true;
                this.state = DATA_STATE;
                this._emitCurrentToken();
            } else if (cp === $.EOF) {
                this._err(ERR.eofInDoctype);
                this.currentToken.forceQuirks = true;
                this._emitCurrentToken();
                this._emitEOFToken();
            } else {
                this._err(ERR.missingQuoteBeforeDoctypePublicIdentifier);
                this.currentToken.forceQuirks = true;
                this._reconsumeInState(BOGUS_DOCTYPE_STATE);
            }
        }
    
        // DOCTYPE public identifier (double-quoted) state
        //------------------------------------------------------------------
        [DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED_STATE](cp) {
            if (cp === $.QUOTATION_MARK) {
                this.state = AFTER_DOCTYPE_PUBLIC_IDENTIFIER_STATE;
            } else if (cp === $.NULL) {
                this._err(ERR.unexpectedNullCharacter);
                this.currentToken.publicId += unicode.REPLACEMENT_CHARACTER;
            } else if (cp === $.GREATER_THAN_SIGN) {
                this._err(ERR.abruptDoctypePublicIdentifier);
                this.currentToken.forceQuirks = true;
                this._emitCurrentToken();
                this.state = DATA_STATE;
            } else if (cp === $.EOF) {
                this._err(ERR.eofInDoctype);
                this.currentToken.forceQuirks = true;
                this._emitCurrentToken();
                this._emitEOFToken();
            } else {
                this.currentToken.publicId += toChar(cp);
            }
        }
    
        // DOCTYPE public identifier (single-quoted) state
        //------------------------------------------------------------------
        [DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED_STATE](cp) {
            if (cp === $.APOSTROPHE) {
                this.state = AFTER_DOCTYPE_PUBLIC_IDENTIFIER_STATE;
            } else if (cp === $.NULL) {
                this._err(ERR.unexpectedNullCharacter);
                this.currentToken.publicId += unicode.REPLACEMENT_CHARACTER;
            } else if (cp === $.GREATER_THAN_SIGN) {
                this._err(ERR.abruptDoctypePublicIdentifier);
                this.currentToken.forceQuirks = true;
                this._emitCurrentToken();
                this.state = DATA_STATE;
            } else if (cp === $.EOF) {
                this._err(ERR.eofInDoctype);
                this.currentToken.forceQuirks = true;
                this._emitCurrentToken();
                this._emitEOFToken();
            } else {
                this.currentToken.publicId += toChar(cp);
            }
        }
    
        // After DOCTYPE public identifier state
        //------------------------------------------------------------------
        [AFTER_DOCTYPE_PUBLIC_IDENTIFIER_STATE](cp) {
            if (isWhitespace(cp)) {
                this.state = BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS_STATE;
            } else if (cp === $.GREATER_THAN_SIGN) {
                this.state = DATA_STATE;
                this._emitCurrentToken();
            } else if (cp === $.QUOTATION_MARK) {
                this._err(ERR.missingWhitespaceBetweenDoctypePublicAndSystemIdentifiers);
                this.currentToken.systemId = '';
                this.state = DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED_STATE;
            } else if (cp === $.APOSTROPHE) {
                this._err(ERR.missingWhitespaceBetweenDoctypePublicAndSystemIdentifiers);
                this.currentToken.systemId = '';
                this.state = DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED_STATE;
            } else if (cp === $.EOF) {
                this._err(ERR.eofInDoctype);
                this.currentToken.forceQuirks = true;
                this._emitCurrentToken();
                this._emitEOFToken();
            } else {
                this._err(ERR.missingQuoteBeforeDoctypeSystemIdentifier);
                this.currentToken.forceQuirks = true;
                this._reconsumeInState(BOGUS_DOCTYPE_STATE);
            }
        }
    
        // Between DOCTYPE public and system identifiers state
        //------------------------------------------------------------------
        [BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS_STATE](cp) {
            if (isWhitespace(cp)) {
                return;
            }
    
            if (cp === $.GREATER_THAN_SIGN) {
                this._emitCurrentToken();
                this.state = DATA_STATE;
            } else if (cp === $.QUOTATION_MARK) {
                this.currentToken.systemId = '';
                this.state = DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED_STATE;
            } else if (cp === $.APOSTROPHE) {
                this.currentToken.systemId = '';
                this.state = DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED_STATE;
            } else if (cp === $.EOF) {
                this._err(ERR.eofInDoctype);
                this.currentToken.forceQuirks = true;
                this._emitCurrentToken();
                this._emitEOFToken();
            } else {
                this._err(ERR.missingQuoteBeforeDoctypeSystemIdentifier);
                this.currentToken.forceQuirks = true;
                this._reconsumeInState(BOGUS_DOCTYPE_STATE);
            }
        }
    
        // After DOCTYPE system keyword state
        //------------------------------------------------------------------
        [AFTER_DOCTYPE_SYSTEM_KEYWORD_STATE](cp) {
            if (isWhitespace(cp)) {
                this.state = BEFORE_DOCTYPE_SYSTEM_IDENTIFIER_STATE;
            } else if (cp === $.QUOTATION_MARK) {
                this._err(ERR.missingWhitespaceAfterDoctypeSystemKeyword);
                this.currentToken.systemId = '';
                this.state = DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED_STATE;
            } else if (cp === $.APOSTROPHE) {
                this._err(ERR.missingWhitespaceAfterDoctypeSystemKeyword);
                this.currentToken.systemId = '';
                this.state = DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED_STATE;
            } else if (cp === $.GREATER_THAN_SIGN) {
                this._err(ERR.missingDoctypeSystemIdentifier);
                this.currentToken.forceQuirks = true;
                this.state = DATA_STATE;
                this._emitCurrentToken();
            } else if (cp === $.EOF) {
                this._err(ERR.eofInDoctype);
                this.currentToken.forceQuirks = true;
                this._emitCurrentToken();
                this._emitEOFToken();
            } else {
                this._err(ERR.missingQuoteBeforeDoctypeSystemIdentifier);
                this.currentToken.forceQuirks = true;
                this._reconsumeInState(BOGUS_DOCTYPE_STATE);
            }
        }
    
        // Before DOCTYPE system identifier state
        //------------------------------------------------------------------
        [BEFORE_DOCTYPE_SYSTEM_IDENTIFIER_STATE](cp) {
            if (isWhitespace(cp)) {
                return;
            }
    
            if (cp === $.QUOTATION_MARK) {
                this.currentToken.systemId = '';
                this.state = DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED_STATE;
            } else if (cp === $.APOSTROPHE) {
                this.currentToken.systemId = '';
                this.state = DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED_STATE;
            } else if (cp === $.GREATER_THAN_SIGN) {
                this._err(ERR.missingDoctypeSystemIdentifier);
                this.currentToken.forceQuirks = true;
                this.state = DATA_STATE;
                this._emitCurrentToken();
            } else if (cp === $.EOF) {
                this._err(ERR.eofInDoctype);
                this.currentToken.forceQuirks = true;
                this._emitCurrentToken();
                this._emitEOFToken();
            } else {
                this._err(ERR.missingQuoteBeforeDoctypeSystemIdentifier);
                this.currentToken.forceQuirks = true;
                this._reconsumeInState(BOGUS_DOCTYPE_STATE);
            }
        }
    
        // DOCTYPE system identifier (double-quoted) state
        //------------------------------------------------------------------
        [DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED_STATE](cp) {
            if (cp === $.QUOTATION_MARK) {
                this.state = AFTER_DOCTYPE_SYSTEM_IDENTIFIER_STATE;
            } else if (cp === $.NULL) {
                this._err(ERR.unexpectedNullCharacter);
                this.currentToken.systemId += unicode.REPLACEMENT_CHARACTER;
            } else if (cp === $.GREATER_THAN_SIGN) {
                this._err(ERR.abruptDoctypeSystemIdentifier);
                this.currentToken.forceQuirks = true;
                this._emitCurrentToken();
                this.state = DATA_STATE;
            } else if (cp === $.EOF) {
                this._err(ERR.eofInDoctype);
                this.currentToken.forceQuirks = true;
                this._emitCurrentToken();
                this._emitEOFToken();
            } else {
                this.currentToken.systemId += toChar(cp);
            }
        }
    
        // DOCTYPE system identifier (single-quoted) state
        //------------------------------------------------------------------
        [DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED_STATE](cp) {
            if (cp === $.APOSTROPHE) {
                this.state = AFTER_DOCTYPE_SYSTEM_IDENTIFIER_STATE;
            } else if (cp === $.NULL) {
                this._err(ERR.unexpectedNullCharacter);
                this.currentToken.systemId += unicode.REPLACEMENT_CHARACTER;
            } else if (cp === $.GREATER_THAN_SIGN) {
                this._err(ERR.abruptDoctypeSystemIdentifier);
                this.currentToken.forceQuirks = true;
                this._emitCurrentToken();
                this.state = DATA_STATE;
            } else if (cp === $.EOF) {
                this._err(ERR.eofInDoctype);
                this.currentToken.forceQuirks = true;
                this._emitCurrentToken();
                this._emitEOFToken();
            } else {
                this.currentToken.systemId += toChar(cp);
            }
        }
    
        // After DOCTYPE system identifier state
        //------------------------------------------------------------------
        [AFTER_DOCTYPE_SYSTEM_IDENTIFIER_STATE](cp) {
            if (isWhitespace(cp)) {
                return;
            }
    
            if (cp === $.GREATER_THAN_SIGN) {
                this._emitCurrentToken();
                this.state = DATA_STATE;
            } else if (cp === $.EOF) {
                this._err(ERR.eofInDoctype);
                this.currentToken.forceQuirks = true;
                this._emitCurrentToken();
                this._emitEOFToken();
            } else {
                this._err(ERR.unexpectedCharacterAfterDoctypeSystemIdentifier);
                this._reconsumeInState(BOGUS_DOCTYPE_STATE);
            }
        }
    
        // Bogus DOCTYPE state
        //------------------------------------------------------------------
        [BOGUS_DOCTYPE_STATE](cp) {
            if (cp === $.GREATER_THAN_SIGN) {
                this._emitCurrentToken();
                this.state = DATA_STATE;
            } else if (cp === $.NULL) {
                this._err(ERR.unexpectedNullCharacter);
            } else if (cp === $.EOF) {
                this._emitCurrentToken();
                this._emitEOFToken();
            }
        }
    
        // CDATA section state
        //------------------------------------------------------------------
        [CDATA_SECTION_STATE](cp) {
            if (cp === $.RIGHT_SQUARE_BRACKET) {
                this.state = CDATA_SECTION_BRACKET_STATE;
            } else if (cp === $.EOF) {
                this._err(ERR.eofInCdata);
                this._emitEOFToken();
            } else {
                this._emitCodePoint(cp);
            }
        }
    
        // CDATA section bracket state
        //------------------------------------------------------------------
        [CDATA_SECTION_BRACKET_STATE](cp) {
            if (cp === $.RIGHT_SQUARE_BRACKET) {
                this.state = CDATA_SECTION_END_STATE;
            } else {
                this._emitChars(']');
                this._reconsumeInState(CDATA_SECTION_STATE);
            }
        }
    
        // CDATA section end state
        //------------------------------------------------------------------
        [CDATA_SECTION_END_STATE](cp) {
            if (cp === $.GREATER_THAN_SIGN) {
                this.state = DATA_STATE;
            } else if (cp === $.RIGHT_SQUARE_BRACKET) {
                this._emitChars(']');
            } else {
                this._emitChars(']]');
                this._reconsumeInState(CDATA_SECTION_STATE);
            }
        }
    
        // Character reference state
        //------------------------------------------------------------------
        [CHARACTER_REFERENCE_STATE](cp) {
            this.tempBuff = [$.AMPERSAND];
    
            if (cp === $.NUMBER_SIGN) {
                this.tempBuff.push(cp);
                this.state = NUMERIC_CHARACTER_REFERENCE_STATE;
            } else if (isAsciiAlphaNumeric(cp)) {
                this._reconsumeInState(NAMED_CHARACTER_REFERENCE_STATE);
            } else {
                this._flushCodePointsConsumedAsCharacterReference();
                this._reconsumeInState(this.returnState);
            }
        }
    
        // Named character reference state
        //------------------------------------------------------------------
        [NAMED_CHARACTER_REFERENCE_STATE](cp) {
            const matchResult = this._matchNamedCharacterReference(cp);
    
            //NOTE: matching can be abrupted by hibernation. In that case match
            //results are no longer valid and we will need to start over.
            if (this._ensureHibernation()) {
                this.tempBuff = [$.AMPERSAND];
            } else if (matchResult) {
                const withSemicolon = this.tempBuff[this.tempBuff.length - 1] === $.SEMICOLON;
    
                if (!this._isCharacterReferenceAttributeQuirk(withSemicolon)) {
                    if (!withSemicolon) {
                        this._errOnNextCodePoint(ERR.missingSemicolonAfterCharacterReference);
                    }
    
                    this.tempBuff = matchResult;
                }
    
                this._flushCodePointsConsumedAsCharacterReference();
                this.state = this.returnState;
            } else {
                this._flushCodePointsConsumedAsCharacterReference();
                this.state = AMBIGUOUS_AMPERSAND_STATE;
            }
        }
    
        // Ambiguos ampersand state
        //------------------------------------------------------------------
        [AMBIGUOUS_AMPERSAND_STATE](cp) {
            if (isAsciiAlphaNumeric(cp)) {
                if (this._isCharacterReferenceInAttribute()) {
                    this.currentAttr.value += toChar(cp);
                } else {
                    this._emitCodePoint(cp);
                }
            } else {
                if (cp === $.SEMICOLON) {
                    this._err(ERR.unknownNamedCharacterReference);
                }
    
                this._reconsumeInState(this.returnState);
            }
        }
    
        // Numeric character reference state
        //------------------------------------------------------------------
        [NUMERIC_CHARACTER_REFERENCE_STATE](cp) {
            this.charRefCode = 0;
    
            if (cp === $.LATIN_SMALL_X || cp === $.LATIN_CAPITAL_X) {
                this.tempBuff.push(cp);
                this.state = HEXADEMICAL_CHARACTER_REFERENCE_START_STATE;
            } else {
                this._reconsumeInState(DECIMAL_CHARACTER_REFERENCE_START_STATE);
            }
        }
    
        // Hexademical character reference start state
        //------------------------------------------------------------------
        [HEXADEMICAL_CHARACTER_REFERENCE_START_STATE](cp) {
            if (isAsciiHexDigit(cp)) {
                this._reconsumeInState(HEXADEMICAL_CHARACTER_REFERENCE_STATE);
            } else {
                this._err(ERR.absenceOfDigitsInNumericCharacterReference);
                this._flushCodePointsConsumedAsCharacterReference();
                this._reconsumeInState(this.returnState);
            }
        }
    
        // Decimal character reference start state
        //------------------------------------------------------------------
        [DECIMAL_CHARACTER_REFERENCE_START_STATE](cp) {
            if (isAsciiDigit(cp)) {
                this._reconsumeInState(DECIMAL_CHARACTER_REFERENCE_STATE);
            } else {
                this._err(ERR.absenceOfDigitsInNumericCharacterReference);
                this._flushCodePointsConsumedAsCharacterReference();
                this._reconsumeInState(this.returnState);
            }
        }
    
        // Hexademical character reference state
        //------------------------------------------------------------------
        [HEXADEMICAL_CHARACTER_REFERENCE_STATE](cp) {
            if (isAsciiUpperHexDigit(cp)) {
                this.charRefCode = this.charRefCode * 16 + cp - 0x37;
            } else if (isAsciiLowerHexDigit(cp)) {
                this.charRefCode = this.charRefCode * 16 + cp - 0x57;
            } else if (isAsciiDigit(cp)) {
                this.charRefCode = this.charRefCode * 16 + cp - 0x30;
            } else if (cp === $.SEMICOLON) {
                this.state = NUMERIC_CHARACTER_REFERENCE_END_STATE;
            } else {
                this._err(ERR.missingSemicolonAfterCharacterReference);
                this._reconsumeInState(NUMERIC_CHARACTER_REFERENCE_END_STATE);
            }
        }
    
        // Decimal character reference state
        //------------------------------------------------------------------
        [DECIMAL_CHARACTER_REFERENCE_STATE](cp) {
            if (isAsciiDigit(cp)) {
                this.charRefCode = this.charRefCode * 10 + cp - 0x30;
            } else if (cp === $.SEMICOLON) {
                this.state = NUMERIC_CHARACTER_REFERENCE_END_STATE;
            } else {
                this._err(ERR.missingSemicolonAfterCharacterReference);
                this._reconsumeInState(NUMERIC_CHARACTER_REFERENCE_END_STATE);
            }
        }
    
        // Numeric character reference end state
        //------------------------------------------------------------------
        [NUMERIC_CHARACTER_REFERENCE_END_STATE]() {
            if (this.charRefCode === $.NULL) {
                this._err(ERR.nullCharacterReference);
                this.charRefCode = $.REPLACEMENT_CHARACTER;
            } else if (this.charRefCode > 0x10ffff) {
                this._err(ERR.characterReferenceOutsideUnicodeRange);
                this.charRefCode = $.REPLACEMENT_CHARACTER;
            } else if (unicode.isSurrogate(this.charRefCode)) {
                this._err(ERR.surrogateCharacterReference);
                this.charRefCode = $.REPLACEMENT_CHARACTER;
            } else if (unicode.isUndefinedCodePoint(this.charRefCode)) {
                this._err(ERR.noncharacterCharacterReference);
            } else if (unicode.isControlCodePoint(this.charRefCode) || this.charRefCode === $.CARRIAGE_RETURN) {
                this._err(ERR.controlCharacterReference);
    
                const replacement = C1_CONTROLS_REFERENCE_REPLACEMENTS[this.charRefCode];
    
                if (replacement) {
                    this.charRefCode = replacement;
                }
            }
    
            this.tempBuff = [this.charRefCode];
    
            this._flushCodePointsConsumedAsCharacterReference();
            this._reconsumeInState(this.returnState);
        }
    }
    
    //Token types
    Tokenizer.CHARACTER_TOKEN = 'CHARACTER_TOKEN';
    Tokenizer.NULL_CHARACTER_TOKEN = 'NULL_CHARACTER_TOKEN';
    Tokenizer.WHITESPACE_CHARACTER_TOKEN = 'WHITESPACE_CHARACTER_TOKEN';
    Tokenizer.START_TAG_TOKEN = 'START_TAG_TOKEN';
    Tokenizer.END_TAG_TOKEN = 'END_TAG_TOKEN';
    Tokenizer.COMMENT_TOKEN = 'COMMENT_TOKEN';
    Tokenizer.DOCTYPE_TOKEN = 'DOCTYPE_TOKEN';
    Tokenizer.EOF_TOKEN = 'EOF_TOKEN';
    Tokenizer.HIBERNATION_TOKEN = 'HIBERNATION_TOKEN';
    
    //Tokenizer initial states for different modes
    Tokenizer.MODE = {
        DATA: DATA_STATE,
        RCDATA: RCDATA_STATE,
        RAWTEXT: RAWTEXT_STATE,
        SCRIPT_DATA: SCRIPT_DATA_STATE,
        PLAINTEXT: PLAINTEXT_STATE
    };
    
    //Static
    Tokenizer.getTokenAttr = function(token, attrName) {
        for (let i = token.attrs.length - 1; i >= 0; i--) {
            if (token.attrs[i].name === attrName) {
                return token.attrs[i].value;
            }
        }
    
        return null;
    };
    
    module.exports = Tokenizer;
    
    
    /***/ }),
    /* 6 */
    /***/ ((module, __unused_webpack_exports, __webpack_require__) => {
    
    "use strict";
    
    
    const unicode = __webpack_require__(7);
    const ERR = __webpack_require__(8);
    
    //Aliases
    const $ = unicode.CODE_POINTS;
    
    //Const
    const DEFAULT_BUFFER_WATERLINE = 1 << 16;
    
    //Preprocessor
    //NOTE: HTML input preprocessing
    //(see: http://www.whatwg.org/specs/web-apps/current-work/multipage/parsing.html#preprocessing-the-input-stream)
    class Preprocessor {
        constructor() {
            this.html = null;
    
            this.pos = -1;
            this.lastGapPos = -1;
            this.lastCharPos = -1;
    
            this.gapStack = [];
    
            this.skipNextNewLine = false;
    
            this.lastChunkWritten = false;
            this.endOfChunkHit = false;
            this.bufferWaterline = DEFAULT_BUFFER_WATERLINE;
        }
    
        _err() {
            // NOTE: err reporting is noop by default. Enabled by mixin.
        }
    
        _addGap() {
            this.gapStack.push(this.lastGapPos);
            this.lastGapPos = this.pos;
        }
    
        _processSurrogate(cp) {
            //NOTE: try to peek a surrogate pair
            if (this.pos !== this.lastCharPos) {
                const nextCp = this.html.charCodeAt(this.pos + 1);
    
                if (unicode.isSurrogatePair(nextCp)) {
                    //NOTE: we have a surrogate pair. Peek pair character and recalculate code point.
                    this.pos++;
    
                    //NOTE: add gap that should be avoided during retreat
                    this._addGap();
    
                    return unicode.getSurrogatePairCodePoint(cp, nextCp);
                }
            }
    
            //NOTE: we are at the end of a chunk, therefore we can't infer surrogate pair yet.
            else if (!this.lastChunkWritten) {
                this.endOfChunkHit = true;
                return $.EOF;
            }
    
            //NOTE: isolated surrogate
            this._err(ERR.surrogateInInputStream);
    
            return cp;
        }
    
        dropParsedChunk() {
            if (this.pos > this.bufferWaterline) {
                this.lastCharPos -= this.pos;
                this.html = this.html.substring(this.pos);
                this.pos = 0;
                this.lastGapPos = -1;
                this.gapStack = [];
            }
        }
    
        write(chunk, isLastChunk) {
            if (this.html) {
                this.html += chunk;
            } else {
                this.html = chunk;
            }
    
            this.lastCharPos = this.html.length - 1;
            this.endOfChunkHit = false;
            this.lastChunkWritten = isLastChunk;
        }
    
        insertHtmlAtCurrentPos(chunk) {
            this.html = this.html.substring(0, this.pos + 1) + chunk + this.html.substring(this.pos + 1, this.html.length);
    
            this.lastCharPos = this.html.length - 1;
            this.endOfChunkHit = false;
        }
    
        advance() {
            this.pos++;
    
            if (this.pos > this.lastCharPos) {
                this.endOfChunkHit = !this.lastChunkWritten;
                return $.EOF;
            }
    
            let cp = this.html.charCodeAt(this.pos);
    
            //NOTE: any U+000A LINE FEED (LF) characters that immediately follow a U+000D CARRIAGE RETURN (CR) character
            //must be ignored.
            if (this.skipNextNewLine && cp === $.LINE_FEED) {
                this.skipNextNewLine = false;
                this._addGap();
                return this.advance();
            }
    
            //NOTE: all U+000D CARRIAGE RETURN (CR) characters must be converted to U+000A LINE FEED (LF) characters
            if (cp === $.CARRIAGE_RETURN) {
                this.skipNextNewLine = true;
                return $.LINE_FEED;
            }
    
            this.skipNextNewLine = false;
    
            if (unicode.isSurrogate(cp)) {
                cp = this._processSurrogate(cp);
            }
    
            //OPTIMIZATION: first check if code point is in the common allowed
            //range (ASCII alphanumeric, whitespaces, big chunk of BMP)
            //before going into detailed performance cost validation.
            const isCommonValidRange =
                (cp > 0x1f && cp < 0x7f) || cp === $.LINE_FEED || cp === $.CARRIAGE_RETURN || (cp > 0x9f && cp < 0xfdd0);
    
            if (!isCommonValidRange) {
                this._checkForProblematicCharacters(cp);
            }
    
            return cp;
        }
    
        _checkForProblematicCharacters(cp) {
            if (unicode.isControlCodePoint(cp)) {
                this._err(ERR.controlCharacterInInputStream);
            } else if (unicode.isUndefinedCodePoint(cp)) {
                this._err(ERR.noncharacterInInputStream);
            }
        }
    
        retreat() {
            if (this.pos === this.lastGapPos) {
                this.lastGapPos = this.gapStack.pop();
                this.pos--;
            }
    
            this.pos--;
        }
    }
    
    module.exports = Preprocessor;
    
    
    /***/ }),
    /* 7 */
    /***/ ((__unused_webpack_module, exports) => {
    
    "use strict";
    
    
    const UNDEFINED_CODE_POINTS = [
        0xfffe,
        0xffff,
        0x1fffe,
        0x1ffff,
        0x2fffe,
        0x2ffff,
        0x3fffe,
        0x3ffff,
        0x4fffe,
        0x4ffff,
        0x5fffe,
        0x5ffff,
        0x6fffe,
        0x6ffff,
        0x7fffe,
        0x7ffff,
        0x8fffe,
        0x8ffff,
        0x9fffe,
        0x9ffff,
        0xafffe,
        0xaffff,
        0xbfffe,
        0xbffff,
        0xcfffe,
        0xcffff,
        0xdfffe,
        0xdffff,
        0xefffe,
        0xeffff,
        0xffffe,
        0xfffff,
        0x10fffe,
        0x10ffff
    ];
    
    exports.REPLACEMENT_CHARACTER = '\uFFFD';
    
    exports.CODE_POINTS = {
        EOF: -1,
        NULL: 0x00,
        TABULATION: 0x09,
        CARRIAGE_RETURN: 0x0d,
        LINE_FEED: 0x0a,
        FORM_FEED: 0x0c,
        SPACE: 0x20,
        EXCLAMATION_MARK: 0x21,
        QUOTATION_MARK: 0x22,
        NUMBER_SIGN: 0x23,
        AMPERSAND: 0x26,
        APOSTROPHE: 0x27,
        HYPHEN_MINUS: 0x2d,
        SOLIDUS: 0x2f,
        DIGIT_0: 0x30,
        DIGIT_9: 0x39,
        SEMICOLON: 0x3b,
        LESS_THAN_SIGN: 0x3c,
        EQUALS_SIGN: 0x3d,
        GREATER_THAN_SIGN: 0x3e,
        QUESTION_MARK: 0x3f,
        LATIN_CAPITAL_A: 0x41,
        LATIN_CAPITAL_F: 0x46,
        LATIN_CAPITAL_X: 0x58,
        LATIN_CAPITAL_Z: 0x5a,
        RIGHT_SQUARE_BRACKET: 0x5d,
        GRAVE_ACCENT: 0x60,
        LATIN_SMALL_A: 0x61,
        LATIN_SMALL_F: 0x66,
        LATIN_SMALL_X: 0x78,
        LATIN_SMALL_Z: 0x7a,
        REPLACEMENT_CHARACTER: 0xfffd
    };
    
    exports.CODE_POINT_SEQUENCES = {
        DASH_DASH_STRING: [0x2d, 0x2d], //--
        DOCTYPE_STRING: [0x44, 0x4f, 0x43, 0x54, 0x59, 0x50, 0x45], //DOCTYPE
        CDATA_START_STRING: [0x5b, 0x43, 0x44, 0x41, 0x54, 0x41, 0x5b], //[CDATA[
        SCRIPT_STRING: [0x73, 0x63, 0x72, 0x69, 0x70, 0x74], //script
        PUBLIC_STRING: [0x50, 0x55, 0x42, 0x4c, 0x49, 0x43], //PUBLIC
        SYSTEM_STRING: [0x53, 0x59, 0x53, 0x54, 0x45, 0x4d] //SYSTEM
    };
    
    //Surrogates
    exports.isSurrogate = function(cp) {
        return cp >= 0xd800 && cp <= 0xdfff;
    };
    
    exports.isSurrogatePair = function(cp) {
        return cp >= 0xdc00 && cp <= 0xdfff;
    };
    
    exports.getSurrogatePairCodePoint = function(cp1, cp2) {
        return (cp1 - 0xd800) * 0x400 + 0x2400 + cp2;
    };
    
    //NOTE: excluding NULL and ASCII whitespace
    exports.isControlCodePoint = function(cp) {
        return (
            (cp !== 0x20 && cp !== 0x0a && cp !== 0x0d && cp !== 0x09 && cp !== 0x0c && cp >= 0x01 && cp <= 0x1f) ||
            (cp >= 0x7f && cp <= 0x9f)
        );
    };
    
    exports.isUndefinedCodePoint = function(cp) {
        return (cp >= 0xfdd0 && cp <= 0xfdef) || UNDEFINED_CODE_POINTS.indexOf(cp) > -1;
    };
    
    
    /***/ }),
    /* 8 */
    /***/ ((module) => {
    
    "use strict";
    
    
    module.exports = {
        controlCharacterInInputStream: 'control-character-in-input-stream',
        noncharacterInInputStream: 'noncharacter-in-input-stream',
        surrogateInInputStream: 'surrogate-in-input-stream',
        nonVoidHtmlElementStartTagWithTrailingSolidus: 'non-void-html-element-start-tag-with-trailing-solidus',
        endTagWithAttributes: 'end-tag-with-attributes',
        endTagWithTrailingSolidus: 'end-tag-with-trailing-solidus',
        unexpectedSolidusInTag: 'unexpected-solidus-in-tag',
        unexpectedNullCharacter: 'unexpected-null-character',
        unexpectedQuestionMarkInsteadOfTagName: 'unexpected-question-mark-instead-of-tag-name',
        invalidFirstCharacterOfTagName: 'invalid-first-character-of-tag-name',
        unexpectedEqualsSignBeforeAttributeName: 'unexpected-equals-sign-before-attribute-name',
        missingEndTagName: 'missing-end-tag-name',
        unexpectedCharacterInAttributeName: 'unexpected-character-in-attribute-name',
        unknownNamedCharacterReference: 'unknown-named-character-reference',
        missingSemicolonAfterCharacterReference: 'missing-semicolon-after-character-reference',
        unexpectedCharacterAfterDoctypeSystemIdentifier: 'unexpected-character-after-doctype-system-identifier',
        unexpectedCharacterInUnquotedAttributeValue: 'unexpected-character-in-unquoted-attribute-value',
        eofBeforeTagName: 'eof-before-tag-name',
        eofInTag: 'eof-in-tag',
        missingAttributeValue: 'missing-attribute-value',
        missingWhitespaceBetweenAttributes: 'missing-whitespace-between-attributes',
        missingWhitespaceAfterDoctypePublicKeyword: 'missing-whitespace-after-doctype-public-keyword',
        missingWhitespaceBetweenDoctypePublicAndSystemIdentifiers:
            'missing-whitespace-between-doctype-public-and-system-identifiers',
        missingWhitespaceAfterDoctypeSystemKeyword: 'missing-whitespace-after-doctype-system-keyword',
        missingQuoteBeforeDoctypePublicIdentifier: 'missing-quote-before-doctype-public-identifier',
        missingQuoteBeforeDoctypeSystemIdentifier: 'missing-quote-before-doctype-system-identifier',
        missingDoctypePublicIdentifier: 'missing-doctype-public-identifier',
        missingDoctypeSystemIdentifier: 'missing-doctype-system-identifier',
        abruptDoctypePublicIdentifier: 'abrupt-doctype-public-identifier',
        abruptDoctypeSystemIdentifier: 'abrupt-doctype-system-identifier',
        cdataInHtmlContent: 'cdata-in-html-content',
        incorrectlyOpenedComment: 'incorrectly-opened-comment',
        eofInScriptHtmlCommentLikeText: 'eof-in-script-html-comment-like-text',
        eofInDoctype: 'eof-in-doctype',
        nestedComment: 'nested-comment',
        abruptClosingOfEmptyComment: 'abrupt-closing-of-empty-comment',
        eofInComment: 'eof-in-comment',
        incorrectlyClosedComment: 'incorrectly-closed-comment',
        eofInCdata: 'eof-in-cdata',
        absenceOfDigitsInNumericCharacterReference: 'absence-of-digits-in-numeric-character-reference',
        nullCharacterReference: 'null-character-reference',
        surrogateCharacterReference: 'surrogate-character-reference',
        characterReferenceOutsideUnicodeRange: 'character-reference-outside-unicode-range',
        controlCharacterReference: 'control-character-reference',
        noncharacterCharacterReference: 'noncharacter-character-reference',
        missingWhitespaceBeforeDoctypeName: 'missing-whitespace-before-doctype-name',
        missingDoctypeName: 'missing-doctype-name',
        invalidCharacterSequenceAfterDoctypeName: 'invalid-character-sequence-after-doctype-name',
        duplicateAttribute: 'duplicate-attribute',
        nonConformingDoctype: 'non-conforming-doctype',
        missingDoctype: 'missing-doctype',
        misplacedDoctype: 'misplaced-doctype',
        endTagWithoutMatchingOpenElement: 'end-tag-without-matching-open-element',
        closingOfElementWithOpenChildElements: 'closing-of-element-with-open-child-elements',
        disallowedContentInNoscriptInHead: 'disallowed-content-in-noscript-in-head',
        openElementsLeftAfterEof: 'open-elements-left-after-eof',
        abandonedHeadElementChild: 'abandoned-head-element-child',
        misplacedStartTagForHeadElement: 'misplaced-start-tag-for-head-element',
        nestedNoscriptInHead: 'nested-noscript-in-head',
        eofInElementThatCanContainOnlyText: 'eof-in-element-that-can-contain-only-text'
    };
    
    
    /***/ }),
    /* 9 */
    /***/ ((module) => {
    
    "use strict";
    
    
    //NOTE: this file contains auto-generated array mapped radix tree that is used for the named entity references consumption
    //(details: https://github.com/inikulin/parse5/tree/master/scripts/generate-named-entity-data/README.md)
    module.exports = new Uint16Array([4,52,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,106,303,412,810,1432,1701,1796,1987,2114,2360,2420,2484,3170,3251,4140,4393,4575,4610,5106,5512,5728,6117,6274,6315,6345,6427,6516,7002,7910,8733,9323,9870,10170,10631,10893,11318,11386,11467,12773,13092,14474,14922,15448,15542,16419,17666,18166,18611,19004,19095,19298,19397,4,16,69,77,97,98,99,102,103,108,109,110,111,112,114,115,116,117,140,150,158,169,176,194,199,210,216,222,226,242,256,266,283,294,108,105,103,5,198,1,59,148,1,198,80,5,38,1,59,156,1,38,99,117,116,101,5,193,1,59,167,1,193,114,101,118,101,59,1,258,4,2,105,121,182,191,114,99,5,194,1,59,189,1,194,59,1,1040,114,59,3,55349,56580,114,97,118,101,5,192,1,59,208,1,192,112,104,97,59,1,913,97,99,114,59,1,256,100,59,1,10835,4,2,103,112,232,237,111,110,59,1,260,102,59,3,55349,56632,112,108,121,70,117,110,99,116,105,111,110,59,1,8289,105,110,103,5,197,1,59,264,1,197,4,2,99,115,272,277,114,59,3,55349,56476,105,103,110,59,1,8788,105,108,100,101,5,195,1,59,292,1,195,109,108,5,196,1,59,301,1,196,4,8,97,99,101,102,111,114,115,117,321,350,354,383,388,394,400,405,4,2,99,114,327,336,107,115,108,97,115,104,59,1,8726,4,2,118,119,342,345,59,1,10983,101,100,59,1,8966,121,59,1,1041,4,3,99,114,116,362,369,379,97,117,115,101,59,1,8757,110,111,117,108,108,105,115,59,1,8492,97,59,1,914,114,59,3,55349,56581,112,102,59,3,55349,56633,101,118,101,59,1,728,99,114,59,1,8492,109,112,101,113,59,1,8782,4,14,72,79,97,99,100,101,102,104,105,108,111,114,115,117,442,447,456,504,542,547,569,573,577,616,678,784,790,796,99,121,59,1,1063,80,89,5,169,1,59,454,1,169,4,3,99,112,121,464,470,497,117,116,101,59,1,262,4,2,59,105,476,478,1,8914,116,97,108,68,105,102,102,101,114,101,110,116,105,97,108,68,59,1,8517,108,101,121,115,59,1,8493,4,4,97,101,105,111,514,520,530,535,114,111,110,59,1,268,100,105,108,5,199,1,59,528,1,199,114,99,59,1,264,110,105,110,116,59,1,8752,111,116,59,1,266,4,2,100,110,553,560,105,108,108,97,59,1,184,116,101,114,68,111,116,59,1,183,114,59,1,8493,105,59,1,935,114,99,108,101,4,4,68,77,80,84,591,596,603,609,111,116,59,1,8857,105,110,117,115,59,1,8854,108,117,115,59,1,8853,105,109,101,115,59,1,8855,111,4,2,99,115,623,646,107,119,105,115,101,67,111,110,116,111,117,114,73,110,116,101,103,114,97,108,59,1,8754,101,67,117,114,108,121,4,2,68,81,658,671,111,117,98,108,101,81,117,111,116,101,59,1,8221,117,111,116,101,59,1,8217,4,4,108,110,112,117,688,701,736,753,111,110,4,2,59,101,696,698,1,8759,59,1,10868,4,3,103,105,116,709,717,722,114,117,101,110,116,59,1,8801,110,116,59,1,8751,111,117,114,73,110,116,101,103,114,97,108,59,1,8750,4,2,102,114,742,745,59,1,8450,111,100,117,99,116,59,1,8720,110,116,101,114,67,108,111,99,107,119,105,115,101,67,111,110,116,111,117,114,73,110,116,101,103,114,97,108,59,1,8755,111,115,115,59,1,10799,99,114,59,3,55349,56478,112,4,2,59,67,803,805,1,8915,97,112,59,1,8781,4,11,68,74,83,90,97,99,101,102,105,111,115,834,850,855,860,865,888,903,916,921,1011,1415,4,2,59,111,840,842,1,8517,116,114,97,104,100,59,1,10513,99,121,59,1,1026,99,121,59,1,1029,99,121,59,1,1039,4,3,103,114,115,873,879,883,103,101,114,59,1,8225,114,59,1,8609,104,118,59,1,10980,4,2,97,121,894,900,114,111,110,59,1,270,59,1,1044,108,4,2,59,116,910,912,1,8711,97,59,1,916,114,59,3,55349,56583,4,2,97,102,927,998,4,2,99,109,933,992,114,105,116,105,99,97,108,4,4,65,68,71,84,950,957,978,985,99,117,116,101,59,1,180,111,4,2,116,117,964,967,59,1,729,98,108,101,65,99,117,116,101,59,1,733,114,97,118,101,59,1,96,105,108,100,101,59,1,732,111,110,100,59,1,8900,102,101,114,101,110,116,105,97,108,68,59,1,8518,4,4,112,116,117,119,1021,1026,1048,1249,102,59,3,55349,56635,4,3,59,68,69,1034,1036,1041,1,168,111,116,59,1,8412,113,117,97,108,59,1,8784,98,108,101,4,6,67,68,76,82,85,86,1065,1082,1101,1189,1211,1236,111,110,116,111,117,114,73,110,116,101,103,114,97,108,59,1,8751,111,4,2,116,119,1089,1092,59,1,168,110,65,114,114,111,119,59,1,8659,4,2,101,111,1107,1141,102,116,4,3,65,82,84,1117,1124,1136,114,114,111,119,59,1,8656,105,103,104,116,65,114,114,111,119,59,1,8660,101,101,59,1,10980,110,103,4,2,76,82,1149,1177,101,102,116,4,2,65,82,1158,1165,114,114,111,119,59,1,10232,105,103,104,116,65,114,114,111,119,59,1,10234,105,103,104,116,65,114,114,111,119,59,1,10233,105,103,104,116,4,2,65,84,1199,1206,114,114,111,119,59,1,8658,101,101,59,1,8872,112,4,2,65,68,1218,1225,114,114,111,119,59,1,8657,111,119,110,65,114,114,111,119,59,1,8661,101,114,116,105,99,97,108,66,97,114,59,1,8741,110,4,6,65,66,76,82,84,97,1264,1292,1299,1352,1391,1408,114,114,111,119,4,3,59,66,85,1276,1278,1283,1,8595,97,114,59,1,10515,112,65,114,114,111,119,59,1,8693,114,101,118,101,59,1,785,101,102,116,4,3,82,84,86,1310,1323,1334,105,103,104,116,86,101,99,116,111,114,59,1,10576,101,101,86,101,99,116,111,114,59,1,10590,101,99,116,111,114,4,2,59,66,1345,1347,1,8637,97,114,59,1,10582,105,103,104,116,4,2,84,86,1362,1373,101,101,86,101,99,116,111,114,59,1,10591,101,99,116,111,114,4,2,59,66,1384,1386,1,8641,97,114,59,1,10583,101,101,4,2,59,65,1399,1401,1,8868,114,114,111,119,59,1,8615,114,114,111,119,59,1,8659,4,2,99,116,1421,1426,114,59,3,55349,56479,114,111,107,59,1,272,4,16,78,84,97,99,100,102,103,108,109,111,112,113,115,116,117,120,1466,1470,1478,1489,1515,1520,1525,1536,1544,1593,1609,1617,1650,1664,1668,1677,71,59,1,330,72,5,208,1,59,1476,1,208,99,117,116,101,5,201,1,59,1487,1,201,4,3,97,105,121,1497,1503,1512,114,111,110,59,1,282,114,99,5,202,1,59,1510,1,202,59,1,1069,111,116,59,1,278,114,59,3,55349,56584,114,97,118,101,5,200,1,59,1534,1,200,101,109,101,110,116,59,1,8712,4,2,97,112,1550,1555,99,114,59,1,274,116,121,4,2,83,86,1563,1576,109,97,108,108,83,113,117,97,114,101,59,1,9723,101,114,121,83,109,97,108,108,83,113,117,97,114,101,59,1,9643,4,2,103,112,1599,1604,111,110,59,1,280,102,59,3,55349,56636,115,105,108,111,110,59,1,917,117,4,2,97,105,1624,1640,108,4,2,59,84,1631,1633,1,10869,105,108,100,101,59,1,8770,108,105,98,114,105,117,109,59,1,8652,4,2,99,105,1656,1660,114,59,1,8496,109,59,1,10867,97,59,1,919,109,108,5,203,1,59,1675,1,203,4,2,105,112,1683,1689,115,116,115,59,1,8707,111,110,101,110,116,105,97,108,69,59,1,8519,4,5,99,102,105,111,115,1713,1717,1722,1762,1791,121,59,1,1060,114,59,3,55349,56585,108,108,101,100,4,2,83,86,1732,1745,109,97,108,108,83,113,117,97,114,101,59,1,9724,101,114,121,83,109,97,108,108,83,113,117,97,114,101,59,1,9642,4,3,112,114,117,1770,1775,1781,102,59,3,55349,56637,65,108,108,59,1,8704,114,105,101,114,116,114,102,59,1,8497,99,114,59,1,8497,4,12,74,84,97,98,99,100,102,103,111,114,115,116,1822,1827,1834,1848,1855,1877,1882,1887,1890,1896,1978,1984,99,121,59,1,1027,5,62,1,59,1832,1,62,109,109,97,4,2,59,100,1843,1845,1,915,59,1,988,114,101,118,101,59,1,286,4,3,101,105,121,1863,1869,1874,100,105,108,59,1,290,114,99,59,1,284,59,1,1043,111,116,59,1,288,114,59,3,55349,56586,59,1,8921,112,102,59,3,55349,56638,101,97,116,101,114,4,6,69,70,71,76,83,84,1915,1933,1944,1953,1959,1971,113,117,97,108,4,2,59,76,1925,1927,1,8805,101,115,115,59,1,8923,117,108,108,69,113,117,97,108,59,1,8807,114,101,97,116,101,114,59,1,10914,101,115,115,59,1,8823,108,97,110,116,69,113,117,97,108,59,1,10878,105,108,100,101,59,1,8819,99,114,59,3,55349,56482,59,1,8811,4,8,65,97,99,102,105,111,115,117,2005,2012,2026,2032,2036,2049,2073,2089,82,68,99,121,59,1,1066,4,2,99,116,2018,2023,101,107,59,1,711,59,1,94,105,114,99,59,1,292,114,59,1,8460,108,98,101,114,116,83,112,97,99,101,59,1,8459,4,2,112,114,2055,2059,102,59,1,8461,105,122,111,110,116,97,108,76,105,110,101,59,1,9472,4,2,99,116,2079,2083,114,59,1,8459,114,111,107,59,1,294,109,112,4,2,68,69,2097,2107,111,119,110,72,117,109,112,59,1,8782,113,117,97,108,59,1,8783,4,14,69,74,79,97,99,100,102,103,109,110,111,115,116,117,2144,2149,2155,2160,2171,2189,2194,2198,2209,2245,2307,2329,2334,2341,99,121,59,1,1045,108,105,103,59,1,306,99,121,59,1,1025,99,117,116,101,5,205,1,59,2169,1,205,4,2,105,121,2177,2186,114,99,5,206,1,59,2184,1,206,59,1,1048,111,116,59,1,304,114,59,1,8465,114,97,118,101,5,204,1,59,2207,1,204,4,3,59,97,112,2217,2219,2238,1,8465,4,2,99,103,2225,2229,114,59,1,298,105,110,97,114,121,73,59,1,8520,108,105,101,115,59,1,8658,4,2,116,118,2251,2281,4,2,59,101,2257,2259,1,8748,4,2,103,114,2265,2271,114,97,108,59,1,8747,115,101,99,116,105,111,110,59,1,8898,105,115,105,98,108,101,4,2,67,84,2293,2300,111,109,109,97,59,1,8291,105,109,101,115,59,1,8290,4,3,103,112,116,2315,2320,2325,111,110,59,1,302,102,59,3,55349,56640,97,59,1,921,99,114,59,1,8464,105,108,100,101,59,1,296,4,2,107,109,2347,2352,99,121,59,1,1030,108,5,207,1,59,2358,1,207,4,5,99,102,111,115,117,2372,2386,2391,2397,2414,4,2,105,121,2378,2383,114,99,59,1,308,59,1,1049,114,59,3,55349,56589,112,102,59,3,55349,56641,4,2,99,101,2403,2408,114,59,3,55349,56485,114,99,121,59,1,1032,107,99,121,59,1,1028,4,7,72,74,97,99,102,111,115,2436,2441,2446,2452,2467,2472,2478,99,121,59,1,1061,99,121,59,1,1036,112,112,97,59,1,922,4,2,101,121,2458,2464,100,105,108,59,1,310,59,1,1050,114,59,3,55349,56590,112,102,59,3,55349,56642,99,114,59,3,55349,56486,4,11,74,84,97,99,101,102,108,109,111,115,116,2508,2513,2520,2562,2585,2981,2986,3004,3011,3146,3167,99,121,59,1,1033,5,60,1,59,2518,1,60,4,5,99,109,110,112,114,2532,2538,2544,2548,2558,117,116,101,59,1,313,98,100,97,59,1,923,103,59,1,10218,108,97,99,101,116,114,102,59,1,8466,114,59,1,8606,4,3,97,101,121,2570,2576,2582,114,111,110,59,1,317,100,105,108,59,1,315,59,1,1051,4,2,102,115,2591,2907,116,4,10,65,67,68,70,82,84,85,86,97,114,2614,2663,2672,2728,2735,2760,2820,2870,2888,2895,4,2,110,114,2620,2633,103,108,101,66,114,97,99,107,101,116,59,1,10216,114,111,119,4,3,59,66,82,2644,2646,2651,1,8592,97,114,59,1,8676,105,103,104,116,65,114,114,111,119,59,1,8646,101,105,108,105,110,103,59,1,8968,111,4,2,117,119,2679,2692,98,108,101,66,114,97,99,107,101,116,59,1,10214,110,4,2,84,86,2699,2710,101,101,86,101,99,116,111,114,59,1,10593,101,99,116,111,114,4,2,59,66,2721,2723,1,8643,97,114,59,1,10585,108,111,111,114,59,1,8970,105,103,104,116,4,2,65,86,2745,2752,114,114,111,119,59,1,8596,101,99,116,111,114,59,1,10574,4,2,101,114,2766,2792,101,4,3,59,65,86,2775,2777,2784,1,8867,114,114,111,119,59,1,8612,101,99,116,111,114,59,1,10586,105,97,110,103,108,101,4,3,59,66,69,2806,2808,2813,1,8882,97,114,59,1,10703,113,117,97,108,59,1,8884,112,4,3,68,84,86,2829,2841,2852,111,119,110,86,101,99,116,111,114,59,1,10577,101,101,86,101,99,116,111,114,59,1,10592,101,99,116,111,114,4,2,59,66,2863,2865,1,8639,97,114,59,1,10584,101,99,116,111,114,4,2,59,66,2881,2883,1,8636,97,114,59,1,10578,114,114,111,119,59,1,8656,105,103,104,116,97,114,114,111,119,59,1,8660,115,4,6,69,70,71,76,83,84,2922,2936,2947,2956,2962,2974,113,117,97,108,71,114,101,97,116,101,114,59,1,8922,117,108,108,69,113,117,97,108,59,1,8806,114,101,97,116,101,114,59,1,8822,101,115,115,59,1,10913,108,97,110,116,69,113,117,97,108,59,1,10877,105,108,100,101,59,1,8818,114,59,3,55349,56591,4,2,59,101,2992,2994,1,8920,102,116,97,114,114,111,119,59,1,8666,105,100,111,116,59,1,319,4,3,110,112,119,3019,3110,3115,103,4,4,76,82,108,114,3030,3058,3070,3098,101,102,116,4,2,65,82,3039,3046,114,114,111,119,59,1,10229,105,103,104,116,65,114,114,111,119,59,1,10231,105,103,104,116,65,114,114,111,119,59,1,10230,101,102,116,4,2,97,114,3079,3086,114,114,111,119,59,1,10232,105,103,104,116,97,114,114,111,119,59,1,10234,105,103,104,116,97,114,114,111,119,59,1,10233,102,59,3,55349,56643,101,114,4,2,76,82,3123,3134,101,102,116,65,114,114,111,119,59,1,8601,105,103,104,116,65,114,114,111,119,59,1,8600,4,3,99,104,116,3154,3158,3161,114,59,1,8466,59,1,8624,114,111,107,59,1,321,59,1,8810,4,8,97,99,101,102,105,111,115,117,3188,3192,3196,3222,3227,3237,3243,3248,112,59,1,10501,121,59,1,1052,4,2,100,108,3202,3213,105,117,109,83,112,97,99,101,59,1,8287,108,105,110,116,114,102,59,1,8499,114,59,3,55349,56592,110,117,115,80,108,117,115,59,1,8723,112,102,59,3,55349,56644,99,114,59,1,8499,59,1,924,4,9,74,97,99,101,102,111,115,116,117,3271,3276,3283,3306,3422,3427,4120,4126,4137,99,121,59,1,1034,99,117,116,101,59,1,323,4,3,97,101,121,3291,3297,3303,114,111,110,59,1,327,100,105,108,59,1,325,59,1,1053,4,3,103,115,119,3314,3380,3415,97,116,105,118,101,4,3,77,84,86,3327,3340,3365,101,100,105,117,109,83,112,97,99,101,59,1,8203,104,105,4,2,99,110,3348,3357,107,83,112,97,99,101,59,1,8203,83,112,97,99,101,59,1,8203,101,114,121,84,104,105,110,83,112,97,99,101,59,1,8203,116,101,100,4,2,71,76,3389,3405,114,101,97,116,101,114,71,114,101,97,116,101,114,59,1,8811,101,115,115,76,101,115,115,59,1,8810,76,105,110,101,59,1,10,114,59,3,55349,56593,4,4,66,110,112,116,3437,3444,3460,3464,114,101,97,107,59,1,8288,66,114,101,97,107,105,110,103,83,112,97,99,101,59,1,160,102,59,1,8469,4,13,59,67,68,69,71,72,76,78,80,82,83,84,86,3492,3494,3517,3536,3578,3657,3685,3784,3823,3860,3915,4066,4107,1,10988,4,2,111,117,3500,3510,110,103,114,117,101,110,116,59,1,8802,112,67,97,112,59,1,8813,111,117,98,108,101,86,101,114,116,105,99,97,108,66,97,114,59,1,8742,4,3,108,113,120,3544,3552,3571,101,109,101,110,116,59,1,8713,117,97,108,4,2,59,84,3561,3563,1,8800,105,108,100,101,59,3,8770,824,105,115,116,115,59,1,8708,114,101,97,116,101,114,4,7,59,69,70,71,76,83,84,3600,3602,3609,3621,3631,3637,3650,1,8815,113,117,97,108,59,1,8817,117,108,108,69,113,117,97,108,59,3,8807,824,114,101,97,116,101,114,59,3,8811,824,101,115,115,59,1,8825,108,97,110,116,69,113,117,97,108,59,3,10878,824,105,108,100,101,59,1,8821,117,109,112,4,2,68,69,3666,3677,111,119,110,72,117,109,112,59,3,8782,824,113,117,97,108,59,3,8783,824,101,4,2,102,115,3692,3724,116,84,114,105,97,110,103,108,101,4,3,59,66,69,3709,3711,3717,1,8938,97,114,59,3,10703,824,113,117,97,108,59,1,8940,115,4,6,59,69,71,76,83,84,3739,3741,3748,3757,3764,3777,1,8814,113,117,97,108,59,1,8816,114,101,97,116,101,114,59,1,8824,101,115,115,59,3,8810,824,108,97,110,116,69,113,117,97,108,59,3,10877,824,105,108,100,101,59,1,8820,101,115,116,101,100,4,2,71,76,3795,3812,114,101,97,116,101,114,71,114,101,97,116,101,114,59,3,10914,824,101,115,115,76,101,115,115,59,3,10913,824,114,101,99,101,100,101,115,4,3,59,69,83,3838,3840,3848,1,8832,113,117,97,108,59,3,10927,824,108,97,110,116,69,113,117,97,108,59,1,8928,4,2,101,105,3866,3881,118,101,114,115,101,69,108,101,109,101,110,116,59,1,8716,103,104,116,84,114,105,97,110,103,108,101,4,3,59,66,69,3900,3902,3908,1,8939,97,114,59,3,10704,824,113,117,97,108,59,1,8941,4,2,113,117,3921,3973,117,97,114,101,83,117,4,2,98,112,3933,3952,115,101,116,4,2,59,69,3942,3945,3,8847,824,113,117,97,108,59,1,8930,101,114,115,101,116,4,2,59,69,3963,3966,3,8848,824,113,117,97,108,59,1,8931,4,3,98,99,112,3981,4000,4045,115,101,116,4,2,59,69,3990,3993,3,8834,8402,113,117,97,108,59,1,8840,99,101,101,100,115,4,4,59,69,83,84,4015,4017,4025,4037,1,8833,113,117,97,108,59,3,10928,824,108,97,110,116,69,113,117,97,108,59,1,8929,105,108,100,101,59,3,8831,824,101,114,115,101,116,4,2,59,69,4056,4059,3,8835,8402,113,117,97,108,59,1,8841,105,108,100,101,4,4,59,69,70,84,4080,4082,4089,4100,1,8769,113,117,97,108,59,1,8772,117,108,108,69,113,117,97,108,59,1,8775,105,108,100,101,59,1,8777,101,114,116,105,99,97,108,66,97,114,59,1,8740,99,114,59,3,55349,56489,105,108,100,101,5,209,1,59,4135,1,209,59,1,925,4,14,69,97,99,100,102,103,109,111,112,114,115,116,117,118,4170,4176,4187,4205,4212,4217,4228,4253,4259,4292,4295,4316,4337,4346,108,105,103,59,1,338,99,117,116,101,5,211,1,59,4185,1,211,4,2,105,121,4193,4202,114,99,5,212,1,59,4200,1,212,59,1,1054,98,108,97,99,59,1,336,114,59,3,55349,56594,114,97,118,101,5,210,1,59,4226,1,210,4,3,97,101,105,4236,4241,4246,99,114,59,1,332,103,97,59,1,937,99,114,111,110,59,1,927,112,102,59,3,55349,56646,101,110,67,117,114,108,121,4,2,68,81,4272,4285,111,117,98,108,101,81,117,111,116,101,59,1,8220,117,111,116,101,59,1,8216,59,1,10836,4,2,99,108,4301,4306,114,59,3,55349,56490,97,115,104,5,216,1,59,4314,1,216,105,4,2,108,109,4323,4332,100,101,5,213,1,59,4330,1,213,101,115,59,1,10807,109,108,5,214,1,59,4344,1,214,101,114,4,2,66,80,4354,4380,4,2,97,114,4360,4364,114,59,1,8254,97,99,4,2,101,107,4372,4375,59,1,9182,101,116,59,1,9140,97,114,101,110,116,104,101,115,105,115,59,1,9180,4,9,97,99,102,104,105,108,111,114,115,4413,4422,4426,4431,4435,4438,4448,4471,4561,114,116,105,97,108,68,59,1,8706,121,59,1,1055,114,59,3,55349,56595,105,59,1,934,59,1,928,117,115,77,105,110,117,115,59,1,177,4,2,105,112,4454,4467,110,99,97,114,101,112,108,97,110,101,59,1,8460,102,59,1,8473,4,4,59,101,105,111,4481,4483,4526,4531,1,10939,99,101,100,101,115,4,4,59,69,83,84,4498,4500,4507,4519,1,8826,113,117,97,108,59,1,10927,108,97,110,116,69,113,117,97,108,59,1,8828,105,108,100,101,59,1,8830,109,101,59,1,8243,4,2,100,112,4537,4543,117,99,116,59,1,8719,111,114,116,105,111,110,4,2,59,97,4555,4557,1,8759,108,59,1,8733,4,2,99,105,4567,4572,114,59,3,55349,56491,59,1,936,4,4,85,102,111,115,4585,4594,4599,4604,79,84,5,34,1,59,4592,1,34,114,59,3,55349,56596,112,102,59,1,8474,99,114,59,3,55349,56492,4,12,66,69,97,99,101,102,104,105,111,114,115,117,4636,4642,4650,4681,4704,4763,4767,4771,5047,5069,5081,5094,97,114,114,59,1,10512,71,5,174,1,59,4648,1,174,4,3,99,110,114,4658,4664,4668,117,116,101,59,1,340,103,59,1,10219,114,4,2,59,116,4675,4677,1,8608,108,59,1,10518,4,3,97,101,121,4689,4695,4701,114,111,110,59,1,344,100,105,108,59,1,342,59,1,1056,4,2,59,118,4710,4712,1,8476,101,114,115,101,4,2,69,85,4722,4748,4,2,108,113,4728,4736,101,109,101,110,116,59,1,8715,117,105,108,105,98,114,105,117,109,59,1,8651,112,69,113,117,105,108,105,98,114,105,117,109,59,1,10607,114,59,1,8476,111,59,1,929,103,104,116,4,8,65,67,68,70,84,85,86,97,4792,4840,4849,4905,4912,4972,5022,5040,4,2,110,114,4798,4811,103,108,101,66,114,97,99,107,101,116,59,1,10217,114,111,119,4,3,59,66,76,4822,4824,4829,1,8594,97,114,59,1,8677,101,102,116,65,114,114,111,119,59,1,8644,101,105,108,105,110,103,59,1,8969,111,4,2,117,119,4856,4869,98,108,101,66,114,97,99,107,101,116,59,1,10215,110,4,2,84,86,4876,4887,101,101,86,101,99,116,111,114,59,1,10589,101,99,116,111,114,4,2,59,66,4898,4900,1,8642,97,114,59,1,10581,108,111,111,114,59,1,8971,4,2,101,114,4918,4944,101,4,3,59,65,86,4927,4929,4936,1,8866,114,114,111,119,59,1,8614,101,99,116,111,114,59,1,10587,105,97,110,103,108,101,4,3,59,66,69,4958,4960,4965,1,8883,97,114,59,1,10704,113,117,97,108,59,1,8885,112,4,3,68,84,86,4981,4993,5004,111,119,110,86,101,99,116,111,114,59,1,10575,101,101,86,101,99,116,111,114,59,1,10588,101,99,116,111,114,4,2,59,66,5015,5017,1,8638,97,114,59,1,10580,101,99,116,111,114,4,2,59,66,5033,5035,1,8640,97,114,59,1,10579,114,114,111,119,59,1,8658,4,2,112,117,5053,5057,102,59,1,8477,110,100,73,109,112,108,105,101,115,59,1,10608,105,103,104,116,97,114,114,111,119,59,1,8667,4,2,99,104,5087,5091,114,59,1,8475,59,1,8625,108,101,68,101,108,97,121,101,100,59,1,10740,4,13,72,79,97,99,102,104,105,109,111,113,115,116,117,5134,5150,5157,5164,5198,5203,5259,5265,5277,5283,5374,5380,5385,4,2,67,99,5140,5146,72,99,121,59,1,1065,121,59,1,1064,70,84,99,121,59,1,1068,99,117,116,101,59,1,346,4,5,59,97,101,105,121,5176,5178,5184,5190,5195,1,10940,114,111,110,59,1,352,100,105,108,59,1,350,114,99,59,1,348,59,1,1057,114,59,3,55349,56598,111,114,116,4,4,68,76,82,85,5216,5227,5238,5250,111,119,110,65,114,114,111,119,59,1,8595,101,102,116,65,114,114,111,119,59,1,8592,105,103,104,116,65,114,114,111,119,59,1,8594,112,65,114,114,111,119,59,1,8593,103,109,97,59,1,931,97,108,108,67,105,114,99,108,101,59,1,8728,112,102,59,3,55349,56650,4,2,114,117,5289,5293,116,59,1,8730,97,114,101,4,4,59,73,83,85,5306,5308,5322,5367,1,9633,110,116,101,114,115,101,99,116,105,111,110,59,1,8851,117,4,2,98,112,5329,5347,115,101,116,4,2,59,69,5338,5340,1,8847,113,117,97,108,59,1,8849,101,114,115,101,116,4,2,59,69,5358,5360,1,8848,113,117,97,108,59,1,8850,110,105,111,110,59,1,8852,99,114,59,3,55349,56494,97,114,59,1,8902,4,4,98,99,109,112,5395,5420,5475,5478,4,2,59,115,5401,5403,1,8912,101,116,4,2,59,69,5411,5413,1,8912,113,117,97,108,59,1,8838,4,2,99,104,5426,5468,101,101,100,115,4,4,59,69,83,84,5440,5442,5449,5461,1,8827,113,117,97,108,59,1,10928,108,97,110,116,69,113,117,97,108,59,1,8829,105,108,100,101,59,1,8831,84,104,97,116,59,1,8715,59,1,8721,4,3,59,101,115,5486,5488,5507,1,8913,114,115,101,116,4,2,59,69,5498,5500,1,8835,113,117,97,108,59,1,8839,101,116,59,1,8913,4,11,72,82,83,97,99,102,104,105,111,114,115,5536,5546,5552,5567,5579,5602,5607,5655,5695,5701,5711,79,82,78,5,222,1,59,5544,1,222,65,68,69,59,1,8482,4,2,72,99,5558,5563,99,121,59,1,1035,121,59,1,1062,4,2,98,117,5573,5576,59,1,9,59,1,932,4,3,97,101,121,5587,5593,5599,114,111,110,59,1,356,100,105,108,59,1,354,59,1,1058,114,59,3,55349,56599,4,2,101,105,5613,5631,4,2,114,116,5619,5627,101,102,111,114,101,59,1,8756,97,59,1,920,4,2,99
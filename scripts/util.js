// vim:softtabstop=4:shiftwidth=4

define(['underscore'],
    function(_)
{
    "use strict";

    /**
     * Process a class definition by applying properties and mixins.
     *
     * @private
     */
    var _processClassDefinition = function(def, ctor) {
        var proto = _.omit(def, 'properties', 'mixins');

        proto = _processClassProperties(def, proto, ctor); 
        proto = _processClassMixins(def, proto, ctor);

        return proto;
    };

    /**
     * Process class mixings by copying all properties (with the exception of
     * create) over to the prototype. Mixins are specified in the the array
     * 'mixins' in the class definition and may be either plain javascript
     * objects or classes.
     *
     * NOTE that inheritance between is currently NOT honoured, only the
     * prototype's own properties are copied.
     *
     * @private
     */
    var _processClassMixins = function(def, proto, ctor) {
        ctor.mixins = [];
        if (!_.isArray(def.mixins)) return proto;

        _.each(def.mixins, function(mixin) {
            if (!_.isObject(mixin)) return;

            if (_.isObject(mixin.prototype)) {

                _.defaults(proto, _.omit(mixin.prototype, 'create'));
                ctor.mixins.push(mixin.prototype);
            } else {

                _.defaults(proto, _.omit(mixin, 'create'));
                ctor.mixins.push(mixin);
            }
        });

        return proto;
    };

    /**
     * Process class properties. Properties are defined with the 'properties'
     * array of the class definition and may be either a string or an object
     * with the entries 'field', 'getter' and 'setter'.
     *
     * In the first case, a private property '_name' and a getter / setter pair
     * 'getName' / 'setName' is generated. In the second form, 'field' specifies
     * the property name, and 'getter' / 'setter' specify getter and setter
     * names. Placing 'true' instead of a name automatically infers the
     * generated name from 'field' by stripping a possible leading underscore
     * and camelizing, eg '_name' -> 'getName'. Leaving out 'getter' / 'setter'
     * will skip.
     */
    var _processClassProperties = function(def, proto) {
        if (!_.isArray(def.properties)) return proto;

        // First step: compile the properties into an associative array
        var properties = {};
        _.each(def.properties, function(val) {
            if (_.isString(val)) {

                properties['_' + val] = {
                    getter: 'get' + Util.ucFirst(val),
                    setter: 'set' + Util.ucFirst(val)
                };
            } else if (_.isObject(val) && val.field !== undefined) {

                // Generate names if neccessary
                if (val.getter !== undefined && !_.isString(val.getter) && val.getter)
                    val.getter = 'get' + Util.ucFirst(val.field.replace(/^_/, ''));
                if (val.setter !== undefined && !_.isString(val.setter) && val.setter)
                    val.setter = 'set' + Util.ucFirst(val.field.replace(/^_/, ''));

                properties[val.field] = _.pick(val, 'getter', 'setter');
            }
        });

        // Tag field and getter / setter onto the prototype
        _.each(properties, function(config, field) {
            if (proto[field] === undefined) proto[field] = null;

            if (config.getter !== undefined && !proto[config.getter])
                proto[config.getter] = function() {
                    return this[field];
                };
            if (config.setter !== undefined && !proto[config.setter])
                proto[config.setter] = function(val) {
                    this[field] = val;
                    return this;
                };
        });

        return proto;
    };

    /**
     * Generic constructor. Calls 'create' if applicable.
     *
     * @private
     */
    var _ctor = function() {
        var me = this;

        if (me.create) me.create.apply(me, arguments);

        return me;
    };

    var Util = {};
    
    /**
     * Uppercase the first character of a string.
     */
    Util.ucFirst = function(val) {
        var res = '';
        if (val.length > 0) res += val.substr(0, 1).toUpperCase();
        if (val.length > 1) res += val.substr(1);

        return res;
    };

    /**
     * Create a new object with a given prototype.
     */
    Util.objectCreate = function(proto) {
        if (Object.create) {
            return Object.create(proto);
        } else {
            var Ctor = function() {return this;};
            Ctor.prototype = proto;
            return new Ctor();
        }
    };

    /**
     * Define a new class.
     */
    Util.define = function(def) {
        var ctor = function() {
            return _ctor.apply(this, arguments);
        };

        _.extend(ctor.prototype, _processClassDefinition(def, ctor));
        return ctor;
    };

    /**
     * Extend an existing clas..
     */
    Util.extend = function(base, def) {
        var ctor = function() {
            return _ctor.apply(this, arguments);
        };

        ctor.prototype = _.extend(Util.objectCreate(base.prototype),
            _processClassDefinition(def, ctor),
            {
                constructor: ctor
            }
        );
        return ctor;
    };

    /**
     * Make sure that a value lies in a certain interval.
     */
    Util.boundValue = function(value, min, max) {
        if (value < min) {
            value = min;
        } else if (value > max) {
            value = max;
        }

        return value;
    };

    /**
     * Generic base class, poll for nice-to-have helpers.
     */
    Util.Base = Util.define({
        /**
         * Process constructor parameters: for each 'name' in properties,
         * we try to set '_name' on the object from an initial value
         * provided as 'config[name]'.
         */
        getConfig: function(config, properties) {
            var me = this;

            _.each(properties, function(property) {
                if (config[property] !== undefined)
                    me['_' + property] = config[property];
            });

            return me;
        },

        /**
         * Stub constructor.
         */
        create: function() {},

        /**
         * Stub destructor
         */
        destroy: function() {}
    });

    /**
     * Promise.
     */
    Util.Promise = Util.define({
        _stack: [],

        _resolved: false,
        _value: null,

        /**
         * Create a new promise.
         */
        create: function() {
            var me = this;

            me._stack = [];
            me._value = [];
        },

        _invoke: function(callback) {
            var me = this;
            callback.apply(null, me._value);
        },

        /**
         * Registers a callback. On resolving the promise, callbacks ara
         * called and provided with the promise status and any parameters
         * passed to resolve.
         */
        then: function(callback) {
            var me = this;

            if (me._resolved) {
                me._invoke(callback);
            } else {
                me._stack.push(callback);
            }
        },

        /**
         * Resolve the promise. Parameters are passed through to registered
         * callbacks.
         */
        resolve: function() {
            var me = this;
            if (me._resolved) return;

            me._value = Array.prototype.slice.call(arguments, 0);
            me._value.unshift(true);
            me._resolved = true;
            _.each(me._stack, me._invoke, me);
        },

        /**
         * Cancels the promise.
         */
        cancel: function() {
            var me = this;
            if (me._resolved) return;

            me._value = [false];
            me._resolved = true;
            _.each(me._stack, me._invoke, me);

        },

        /**
         * Chain two promises by creating a new one which resolves once
         * both parents are resolved. The new promise is cancelled if any
         * of its parents are cancelled. If it is resolved, all parameters
         * provided to the parent resolve calls are passed to the callbacks
         * as arguments (in the order in which they are chained).
         */
        and: function(other) {
            var me = this;

            var composite = new Util.Promise();
            me.then(function(success) {
                if (success) {
                    var values = Array.prototype.slice.call(arguments, 1);

                    other.then(function(success) {

                        if (success) {
                            var othervalues = Array.prototype.slice.call(arguments, 1);
                            composite.resolve.apply(composite, values.concat(othervalues));
                        }
                    });
                } else {

                    composite.cancel();
                }
            });

            other.then(function(success) {
                if (!success) {
                    composite.cancel();
                }
            });

            return composite;
        }
    });

    /**
     * Semaphore. A semaphore is a counter which can be lowered and raised;
     * callbacks can be registered which are fired whenever the semaphore
     * aquires a certain value (trippoint).
     */
    Util.Semaphore = Util.define({
        _trippoints: null,
        _value: 0,

        create: function(initial) {
            var me = this;
            me._value = initial;
            me._trippoints = [];
        },

        /**
         * Register a handler for a specific trippoint.
         */
        when: function(value, handler) {
            var me = this;

            if (!me._trippoints[value]) me._trippoints[value] = [];
            me._trippoints[value].push(handler);
        },

        _handle: function() {
            var me = this;

            if (!me._trippoints[me._value]) return;
            _.each(me._trippoints[me._value], function(handler) {handler();});
        },

        raise: function() {
            var me = this;

            me._value++;
            me._handle();
        },

        lower: function() {
            var me = this;

            me._value--;
            me._handle();
        }
    });

    /**
     * Observable. Usually used as a mixin -> take care to call our
     * constructor in the target class constructor.
     */
    Util.Observable = Util.define({
        _listeners: null,

        create: function() {
            var me = this;

            me._listeners = {};
        },

        /**
         * Attach event listeners. Arguments are an associative array of event
         * <-> handler pairs, scope is the execution scope if the handlers.
         */
        attachListeners: function(listeners, scope) {
            var me = this;

            _.each(listeners, function(handler, evt) {
                if (!me._listeners[evt]) me._listeners[evt] = [];

                me._listeners[evt].push({
                    callback: handler,
                    scope: scope
                });
            });
        },

        /**
         * Detach event handlers. Signature is identical to attachListeners.
         * IMPORTANT: Both scope and handler must match those passed during
         * registration.
         */
        detachListeners: function(listeners, scope) {
            var me = this;

            _.each(listeners, function(handler, evt) {
                if (!me._listeners[evt]) return;

                me._listeners[evt] = _.reject(me._listeners[evt],
                    function(listener) {
                        return listener.callback === handler && listener.scope === scope;
                    }
                );      
            });
        },

        /**
         * Detach all handlers registered with a given scope.
         */
        detachAllListeners: function(scope) {
            var me = this;

            _.each(me._listeners, function(listeners, evt) {
                me._listeners[evt] = _.reject(me._listeners[evt],
                    function(listener) {
                        return listener.scope === scope;
                    }
                );
            });
        },

        /**
         * Trigger an event. First argument is the event name, all other
         * arguments are directly passed to the handler.
         */
        fireEvent: function() {
            var me = this;
            var args = _.values(arguments);
            var evt = args.shift();

            if (!me._listeners[evt]) return;
            _.each(me._listeners[evt], function(handler) {
                handler.callback.apply(handler.scope, args);
            });
        }
    });

    return Util;
});

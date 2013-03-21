// vim: set softtabstop=4

define(['underscore'],
    function(_)
{
    "use strict";

    var _processClassDefinition = function(def, ctor) {
        var proto = _.omit(def, 'properties', 'mixins');

        proto = _processClassProperties(def, proto, ctor); 
        proto = _processClassMixins(def, proto, ctor);

        return proto;
    };

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

    var _processClassProperties = function(def, proto) {
        if (!_.isArray(def.properties)) return proto;

        var properties = {};
        _.each(def.properties, function(val) {
            if (_.isString(val)) {

                properties['_' + val] = {
                    getter: 'get' + Util.ucFirst(val),
                    setter: 'set' + Util.ucFirst(val)
                };
            } else if (_.isObject(val) && val.field !== undefined) {

                if (val.getter !== undefined && !_.isString(val.getter) && val.getter)
                    val.getter = 'get' + Util.ucFirst(val.field.replace(/^_/, ''));
                if (val.setter !== undefined && !_.isString(val.setter) && val.setter)
                    val.setter = 'set' + Util.ucFirst(val.field.replace(/^_/, ''));

                properties[val.field] = _.pick(val, 'getter', 'setter');
            }
        });

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

    var _ctor = function() {
        var me = this;

        if (me.create) me.create.apply(me, arguments);

        return me;
    };

    var Util = {};
    
    Util.ucFirst = function(val) {
        var res = '';
        if (val.length > 0) res += val.substr(0, 1).toUpperCase();
        if (val.length > 1) res += val.substr(1);

        return res;
    };

    Util.objectCreate = function(proto) {
        if (Object.create) {
            return Object.create(proto);
        } else {
            var Ctor = function() {return this;};
            Ctor.prototype = proto;
            return new Ctor();
        }
    };

    Util.define = function(def) {
        var ctor = function() {
            return _ctor.apply(this, arguments);
        };

        _.extend(ctor.prototype, _processClassDefinition(def, ctor));
        return ctor;
    };

    Util.extend = function(base, def) {
        var ctor = function() {
            return _ctor.apply(this, arguments);
        };

        ctor.prototype = _.extend(Util.objectCreate(base.prototype),
            _processClassDefinition(def, ctor),
            {
                constructor: ctor,
            }
        );
        return ctor;
    };

    Util.boundValue = function(value, min, max) {
        if (value < min) {
            value = min;
        } else if (value > max) {
            value = max;
        }

        return value;
    };

    Util.Base = Util.define({
        getConfig: function(config, properties) {
            var me = this;

            _.each(properties, function(property) {
                if (config[property] !== undefined)
                    me['_' + property] = config[property];
            });

            return me;
        },
    });

    Util.Promise = Util.define({
        _stack: [],

        _resolved: false,
        _cancelled: false,
        _value: null,

        create: function() {
            var me = this;

            me._stack = [];
        },

        _invoke: function(callback) {
            var me = this;
            callback(!me._cancelled, me._value);
        },

        then: function(callback) {
            var me = this;

            if (me._resolved) {
                me._invoke(callback);
            } else {
                me._stack.push(callback);
            }
        },

        resolve: function(value) {
            var me = this;
            if (me._resolved) return;

            if (typeof(value) !=  'undefined') {
                me._value = value;
            }
            _.each(me._stack, me._invoke, me);

            me._resolved = true;
        },

        cancel: function() {
            var me = this;
            if (me._resolved) return;

            _.each(me._stack, me._invoke, me);

            me._resolved = true;
        }
    });

    Util.Semaphore = Util.define({
        _trippoints: null,
        _value: 0,

        create: function(initial) {
            var me = this;
            me._value = initial;
            me._trippoints = [];
        },

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

    Util.Observable = Util.define({
        _listeners: null,

        create: function() {
            var me = this;

            me._listeners = {};
        },

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

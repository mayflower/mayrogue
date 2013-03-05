define(['lib/underscore'],
   function(_)
{
   var Util = {
      objectCreate: function(proto) {
         if (Object.create) {
            return Object.create(proto);
         } else {
            var ctor = function() {return this};
            ctor.prototype = proto;
            return new ctor();
         }
      },

      define: function(def) {
         var ctor = function() {
            if (this.create) this.create.apply(this, arguments);
            return this;
         }
         _.extend(ctor.prototype, def);
         return ctor;
      },

      extend: function(base, def) {
         var ctor = function() {
            if (this.create) this.create.apply(this, arguments);
            return this;
         }
         ctor.prototype = _.extend(Util.objectCreate(base.prototype), def, {
            constructor: ctor,
            parent: base.prototype
         });
         return ctor;
      },

      boundValue: function(value, min, max) {
         if (value < min) {
            value = min;
         } else if (value > max) {
            value = max;
         }

         return value;
      }
   }

   Util.Base = Util.define({
      getConfig: function(config, properties) {
         var me = this;

         _.each(properties, function(property) {
            if (property in config)
               me['_' + property] = config[property];
         });

         return me;
      }
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
         _.each(me._trippoints[me._value], function(handler) {handler()});
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

   return Util;
});

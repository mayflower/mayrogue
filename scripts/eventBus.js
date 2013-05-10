define(['util'], function(Util) {
    "use strict";

    var EventBus = Util.extend(Util.Base, {
        mixins: [Util.Observable],

        create: function() {
            var me = this;

            Util.Base.prototype.create.apply(me, arguments);
            Util.Observable.prototype.create.apply(me, arguments);
        }
    });

    return new EventBus();
});
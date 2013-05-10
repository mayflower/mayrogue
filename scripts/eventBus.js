define(['util'], function(Util) {
    "use strict";

    var EventBus = Util.extend(Util.Observable, {

        create: function() {
            var me = this;

            Util.Observable.prototype.create.apply(me, arguments);
        }
    });

    return new EventBus();
});
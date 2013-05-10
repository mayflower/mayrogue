// vim:softtabstop=4:shiftwidth=4

/**
 * A rectangle on a grid. This is slightly special as a rectangle of width /
 * height zero indeed covers an extend.
 */

define(['underscore', 'util'],
    function(_, Util)
{

    "use strict";

    var Rectangle = Util.extend(Util.Base, {
        properties: ['x', 'y', 'width', 'height'],

        create: function(config) {
            var me = this;
            Util.Base.prototype.create.apply(me, arguments);

            me.getConfig(config, ['x', 'y', 'width', 'height']);
        },

        isInside: function(x, y) {
            var me = this;

            return (x >= me._x) && (x < me._x + me._width) &&
                (y >= me._y) && (y < me._y + me._height);
        },

        intersect: function(rect) {
            var me = this;

            return me.isInside(rect._x, rect._y) ||
                me.isInside(rect._x + rect._width - 1, rect._y) ||
                me.isInside(rect._x, rect._y + rect._height - 1) ||
                me.isInside(rect._x + rect._width - 1, rect._y + rect._height - 1);
        },

        clone: function() {
            return new Rectangle({
                x: this._x,
                y: this._y,
                width: this._width,
                height: this._height
            });
        }

    });

    return Rectangle;

});

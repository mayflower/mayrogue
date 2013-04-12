// vim:softtabstop=4:shiftwidth=4

define(['underscore', 'util', 'geometry', 'tiles'],
    function(_, Util, Geometry, Tiles)
{

    "use strict";

    var Entity = Util.extend(Util.Base, {
        properties: ['shape', 'world',
            {field: '_id', getter: true},
            {field: '_boundingBox', getter: true},
            {field: '_hp', getter: true}
        ],
        mixins: [Util.Observable],

        _shape: 0,

        create: function(config) {
            var me = this;
            Util.Base.prototype.create.apply(me, arguments);
            Util.Observable.prototype.create.apply(me, arguments);

            me.getConfig(config, ['map', 'shape', 'id']);

            me._boundingBox = new Geometry.Rectangle({
                x: config.x,
                y: config.y,
                width: Tiles.properties[me._shape].width,
                height: Tiles.properties[me._shape].height
            });
        },

        _changePosition: function(x, y) {
            var me = this;

            var boundingBoxNew = new Geometry.Rectangle({
                x: x,
                y: y,
                height: me._boundingBox.getHeight(),
                width: me._boundingBox.getWidth()
            });
            var boundingBoxOld = me._boundingBox;

            if (!me._world ||
                    me._world.rectAccessible(boundingBoxNew, me))
            {
                me._boundingBox = boundingBoxNew;
                me.fireEvent('change', me, boundingBoxOld, boundingBoxNew);
            }
        },

        _doAttack: function(target) {
            var me = this;
            // todo do some bounding box math
            //me.fireEvent('change', me, target);
        },

        getX: function() {
            var me = this;

            return me._boundingBox.getX();
        },

        getY: function() {
            var me = this;

            return me._boundingBox.getY();
        },

        setX: function(x) {
            var me = this;
            
            me._changePosition(x, me._boundingBox.getY());

            return me;
        },

        setY: function(y) {
            var me = this;

            me._changePosition(me._boundingBox.getX(), y);

            return me;
        },

        setXY: function(x, y) {
            var me = this;

            me._changePosition(x, y);

            return me;
        },

        attack: function(x, y) {
            var me = this,
                attackTarget = {};

            if (this.getX() + x && this.getY() + y) {
                attackTarget = {
                    x: this.getX() + x,
                    y: this.getY() + y
                }
                this._doAttack(attackTarget);
            } else {
                return;
            }

            console.debug("me", this.getX(), this.getY());
            console.debug("now attacking", attackTarget.x, attackTarget.y);
        },

        serialize: function() {
            var me = this;

            return {
                x: me.getX(),
                y: me.getY(),
                width: me._boundingBox.getWidth(),
                height: me._boundingBox.getHeight(),
                shape: me._shape,
                id: me._id
            };
        }
    });

    Entity.unserialize = function(blob) {
        return new Entity(blob);
    };

    return Entity;
});

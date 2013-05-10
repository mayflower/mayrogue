// vim:softtabstop=4:shiftwidth=4

define(['underscore', 'util', 'geometry', 'tiles', 'stats'],
    function(_, Util, Geometry, Tiles, Stats)
{

    "use strict";

    var Entity = Util.extend(Util.Base, {
        properties: [
            'shape',
            'world',
            'heading',
            {field: '_id', getter: true},
            {field: '_boundingBox', getter: true},
            {field: '_stats', getter: true}
        ],
        mixins: [Util.Observable],

        _shape: 0,

        create: function(config) {
            var me = this;
            Util.Base.prototype.create.apply(me, arguments);
            Util.Observable.prototype.create.apply(me, arguments);

            me.getConfig(config, ['map', 'shape', 'id']);

            if (!me._heading) {
                me._heading = 'east';
            }

            me._boundingBox = new Geometry.Rectangle({
                x: config.x,
                y: config.y,
                width: Tiles.properties[me._shape].width,
                height: Tiles.properties[me._shape].height
            });

            me._stats = config.stats ? config.stats : new Stats();
            me._stats.attachListeners({
                change: me._statsChange
            }, me);
        },

        _statsChange: function() {
            var me = this;

            me.fireEvent('statsChange', me);
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

            me._setHeadingAfterMovement(boundingBoxOld, boundingBoxNew);

            if (!me._world || me._world.rectAccessible(boundingBoxNew, me))
            {
                me._boundingBox = boundingBoxNew;
                me.fireEvent('change', me, boundingBoxOld, boundingBoxNew);
            } else {
                me.fireEvent('change', me, boundingBoxOld, boundingBoxOld);
            }
        },

        _setHeadingAfterMovement: function(boundingBoxOld, boundingBoxNew)
        {
            var me = this;
            if (boundingBoxOld.getX() > boundingBoxNew.getX()) {
                me._heading = "west";
            } else if (boundingBoxOld.getX() < boundingBoxNew.getX()) {
                me._heading = "east";
            } else if (boundingBoxOld.getY() > boundingBoxNew.getY()) {
                me._heading = "north";
            } else if (boundingBoxOld.getY() < boundingBoxNew.getY()) {
                me._heading = "south";
            }
        },

        _doAttack: function(target) {
            var me = this;
            me.fireEvent('attack', me, target);
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

        attack: function() {
            var attackTarget = this.getAttackTarget();
            this._doAttack(attackTarget);
        },

        getAttackTarget: function()
        {
            var attackTarget = {
                x: this.getX(),
                y: this.getY()
            };

            switch (this._heading) {
                case 'north':
                    attackTarget.y -= 1;
                    break;
                case 'south':
                    attackTarget.y += 1;
                    break;
                case 'east':
                    attackTarget.x += 1;
                    break;
                case 'west':
                    attackTarget.x -= 1;
                    break;
            }

            return attackTarget;
        },

        serialize: function() {
            var me = this;

            return {
                x: me.getX(),
                y: me.getY(),
                width: me._boundingBox.getWidth(),
                height: me._boundingBox.getHeight(),
                shape: me._shape,
                id: me._id,
                stats: me._stats.serialize()
            };
        }
    });

    Entity.unserialize = function(blob) {
        blob.stats = Stats.unserialize(blob.stats);
        return new Entity(blob);
    };

    return Entity;
});

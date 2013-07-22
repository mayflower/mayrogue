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
            'role',
            {field: '_id', getter: true},
            {field: '_boundingBox', getter: true},
            {field: '_stats', getter: true}
        ],
        mixins: [Util.Observable],

        _shape: 0,
        _role: 0,

        create: function(config) {
            var me = this;
            Util.Base.prototype.create.apply(me, arguments);
            Util.Observable.prototype.create.apply(me, arguments);

            me.getConfig(config, ['map', 'shape', 'id', 'heading', 'role']);

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
                change: me._onStatsChange
            }, me);
        },

        setHeading: function(heading) {
            var me = this;

            if (me._heading !== heading) {
                me._heading = heading;
                me.fireEvent('headingChange');
            }
        },

        _onStatsChange: function() {
            var me = this;

            me.fireEvent('statsChange', me);
        },

        _changePosition: function(x, y, force) {
            var me = this;

            var boundingBoxNew = new Geometry.Rectangle({
                x: x,
                y: y,
                height: me._boundingBox.getHeight(),
                width: me._boundingBox.getWidth()
            });
            var boundingBoxOld = me._boundingBox;

            me._setHeadingAfterMovement(boundingBoxOld, boundingBoxNew);

            if (force || !me._world || me._world.rectAccessible(boundingBoxNew, me))
            {
                me._boundingBox = boundingBoxNew;
                me.fireEvent('move', boundingBoxOld, boundingBoxNew);
            } else {
                me.fireEvent('move', boundingBoxOld, boundingBoxOld);
            }
        },

        _setHeadingAfterMovement: function(boundingBoxOld, boundingBoxNew)
        {
            var me = this;
            if (boundingBoxOld.getX() > boundingBoxNew.getX()) {
                me.setHeading("west");
            } else if (boundingBoxOld.getX() < boundingBoxNew.getX()) {
                me.setHeading("east");
            } else if (boundingBoxOld.getY() > boundingBoxNew.getY()) {
                me.setHeading("north");
            } else if (boundingBoxOld.getY() < boundingBoxNew.getY()) {
                me.setHeading("south");
            }
        },

        getX: function() {
            var me = this;

            return me._boundingBox.getX();
        },

        getY: function() {
            var me = this;

            return me._boundingBox.getY();
        },

        setX: function(x, force) {
            var me = this;
            
            me._changePosition(x, me._boundingBox.getY(), force);

            return me;
        },

        setY: function(y, force) {
            var me = this;

            me._changePosition(me._boundingBox.getX(), y, force);

            return me;
        },

        setXY: function(x, y, force) {
            var me = this;

            me._changePosition(x, y, force);

            return me;
        },

        attacked: function(attacker) {
            this.fireEvent('attacked', attacker);
        },

        getAttackTarget: function()
        {
            var attackRect = new Geometry.Rectangle({
                x: this.getX(),
                y: this.getY(),
                height: 1,
                width: 1
            });

            switch (this._heading) {
                case 'north':
                    attackRect.setY(attackRect.getY() - 1);
                    attackRect.setWidth(this._boundingBox.getWidth());
                    break;
                case 'south':
                    attackRect.setY(attackRect.getY() + 1 + this._boundingBox.getHeight() - 1);
                    attackRect.setWidth(this._boundingBox.getWidth());
                    break;
                case 'east':
                    attackRect.setX(attackRect.getX() + 1 + this._boundingBox.getWidth() - 1);
                    attackRect.setHeight(this._boundingBox.getHeight());
                    break;
                case 'west':
                    attackRect.setX(attackRect.getX() - 1);
                    attackRect.setHeight(this._boundingBox.getHeight());
                    break;
            }

            return attackRect;
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
                stats: me._stats.serialize(),
                heading: me._heading
            };
        }
    });

    Entity.unserialize = function(blob) {
        blob.stats = Stats.unserialize(blob.stats);
        return new Entity(blob);
    };

    Entity.Role = {
        'NPC': 0,
        'PLAYER': 1
    };

    return Entity;
});

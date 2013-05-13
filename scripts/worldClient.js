// vim:softtabstop=4:shiftwidth=4

define(['underscore', 'util', 'geometry', 'worldBase', 'entityManagerClient'],
    function(_, Util, Geometry, WorldBase, EntityManagerClient)
{
    "use strict";

    var _parent = WorldBase.prototype;

    var WorldClient = Util.extend(WorldBase, {
        properties: ['dirty',
            {field: '_player', getter: true},
            {field: '_viewport', getter: true}
        ],

        _dirty: false,
        _batchInProgress: false,

        _viewportWidth: null,
        _viewportHeight: null,
        _playerPosition: null,

        create: function(config) {
            var me = this;

            me.getConfig(config,
                ['player', 'viewportWidth', 'viewportHeight']);

            if (!config.entityManager) config.entityManager = new EntityManagerClient({
                world: me
            });

            _parent.create.apply(me, arguments);

            me._viewport = new Geometry.Rectangle({
                x: 0,
                y: 0,
                width: me._viewportWidth,
                height: me._viewportHeight
            });

            me._playerPosition = {
                x: Math.floor(me._viewport.getWidth() / 2),
                y: Math.floor(me._viewport.getHeight() / 2)
            };

            me._trackPlayer();
        },

        _onEntityMove: function(entity, bbOld, bbNew) {
            var me = this;

            _parent._onEntityMove.apply(me, arguments);

            if (entity === me._player) {
                me._trackPlayer();
            }

            if (me._viewport.intersect(bbOld) || me._viewport.intersect(bbNew)) {
                me._onVisibleChange();
            }
        },

        _onVisibleChange: function() {
            var me = this;

            if (me._batchInProgress) {
                me._dirty = true;
            } else {
                me.fireEvent('visibleChange');
            }
        },

        _onEntityStatsChange: function(entity) {
            var me = this;

            _parent._onEntityStatsChange.apply(me, arguments);

            if (me._viewport.intersect(entity.getBoundingBox())) {
                me._onVisibleChange();
            }
        },

        _trackPlayer: function() {
            var me = this;

            var x = Util.boundValue(me._player.getX() - me._playerPosition.x, 
                0, me._map.getWidth() - me._viewport.getWidth());
            var y = Util.boundValue(me._player.getY() - me._playerPosition.y,
                0, me._map.getHeight() - me._viewport.getHeight());

            me._viewport.setX(x);
            me._viewport.setY(y);
        },

        startBatchUpdate: function() {
            var me = this;

            me._batchInProgress = true;
            me._dirty = false;
        },

        endBatchUpdate: function() {
            var me = this;

            me._batchInProgress = false;
            if (me._dirty) me.fireEvent('visibleChange');
            me._dirty = false;
        }
    });

    return WorldClient;
});

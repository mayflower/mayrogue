define(['underscore', 'util'],
    function(_, Util) {
        "use strict";

        var StatsView = Util.extend(Util.Base, {
            properties: ['player',
                {field: '_elt', getter: 'getElt'}
            ],

            create: function(config) {
                var me = this;

                Util.Base.prototype.create.apply(me, arguments);

                me.getConfig(config, ['elt']);
                if (config.player) {
                    me.setPlayer(config.player);
                    me._render();
                }
            },

            _render: function() {
                var me = this;

                if (!me._player) return;

                var stats = me._player.getStats();

                var content =   'Name: ' + stats.getName() + '<br/>' +
                                'Hitopoints: ' + stats.getHp();
                me._elt.innerHTML = content;
            },

            setPlayer: function(player) {
                var me = this;
                var listenersConfig = {
                    'statsChange': me._render
                };

                if (me._player) {
                    me._player.detachListeners(listenersConfig, me);
                }

                me._player = player;
                player.attachListeners(listenersConfig, me);
            }
        });

        return StatsView;
});
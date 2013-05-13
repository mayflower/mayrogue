define(['underscore', 'util', 'jquery', 'toastr'],
    function(_, Util, $, Toastr) {
        "use strict";

        var StatsView = Util.extend(Util.Base, {
            properties: ['player',
                {field: '_elt', getter: 'getElt'}
            ],

            _nameField: null,
            _hpBar: null,
            _hpBarProgress: null,

            create: function(config) {
                var me = this;

                Util.Base.prototype.create.apply(me, arguments);

                me.getConfig(config, ['elt']);

                me._nameField = $(me._elt).find('.name_field').get(0);
                me._hpBar = $(me._elt).find('.hp_bar').get(0);
                me._hpBarProgress = $(me._elt).find('.hp_bar_progress').get(0);

                if (config.player) {
                    me.setPlayer(config.player);
                    me._render();
                }
            },

            _render: function() {
                var me = this;

                if (!me._player) return;

                var stats = me._player.getStats();

                me._renderHeading(stats);
                me._renderHP(stats);
                me._renderExp(stats);
            },

            _renderExp: function(stats) {
                var expDisplay = document.getElementById('exp_stats');

                var exp = stats.getExp();
                var maxExp = stats.getNextLevelExp();
                var percentage = (exp/maxExp) * 100;


                if(stats._lvlUp) {
                    //ugly hack, because the lvlUp state is send more then one time
                    //Toastr.clean();
                    Toastr.success('Level up!');
                }

                expDisplay.style.width = percentage + '%';
                expDisplay.innerHTML = exp + '/' + maxExp + ' Exp';
            },

            _renderHP: function(stats) {
                var me = this;

                var hp = stats.getHp();
                var percent = (hp / stats.getMaxHp()) * 100;

                if(hp == 0) {
                    Toastr.error('The death has reached you');
                }

                if (percent <= 25) {
                    me._hpBar.setAttribute("class", "progress progress-danger");
                } else if (percent <= 50) {
                    me._hpBar.setAttribute("class", "progress progress-warning");
                } else {
                    me._hpBar.setAttribute("class", "progress progress-success");
                }

                me._hpBarProgress.style.width = percent + '%';
                me._hpBarProgress.innerHTML = hp + " HP";
            },

            _renderHeading: function(stats) {
                var me = this;
                me._nameField.innerHTML = stats.getName() + ' (' + stats._lvl + ')';
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
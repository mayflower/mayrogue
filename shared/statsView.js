define(['underscore', 'util', 'jquery'],
    function(_, Util, $) {
        "use strict";

        var StatsView = Util.extend(Util.Base, {
            properties: ['player',
                {field: '_elt', getter: 'getElt'}
            ],

            _nameField: null,
            _levelField: null,
            _hpBar: null,
            _hpBarProgress: null,
            _expBar: null,
            _expBarProgress: null,

            create: function(config) {
                var me = this;

                Util.Base.prototype.create.apply(me, arguments);

                me.getConfig(config, ['elt', 'player']);

                me._nameField = $(me._elt).find('.name_field').get(0);
                me._levelField = $(me._elt).find('.level_field').get(0);

                me._hpBar = $(me._elt).find('.hp_bar').get(0);
                me._hpBarProgress = $(me._elt).find('.hp_bar_progress').get(0);

                me._expBar = $(me._elt).find('.exp_bar').get(0);
                me._expBarProgress = $(me._elt).find('.exp_bar_progress').get(0);

                if (config.player) {
                    me._render();
                }
            },

            _render: function() {
                var me = this;

                if (!me._player) return;
                var stats = me._player.getStats();

                me._nameField.innerHTML = stats.getName();
                me._levelField.innerHTML = 'Level: ' + stats.getLevel();

                me._renderHP(stats);
                me._renderEXP(stats);
            },

            _renderHP: function(stats) {
                var me = this;

                var hp = stats.getHp();
                var percent = (hp / stats.getMaxHp()) * 100;

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

            _renderEXP: function(stats) {
                var me = this;

                var exp = stats.getExp() || 0;
                var percent = (exp / stats.getNeededExp()) * 100;

                me._expBarProgress.style.width = percent + '%';
                me._expBarProgress.innerHTML = exp + " EXP";
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
                if (me._player) {
                    me._player.attachListeners(listenersConfig, me);
                }
            }
        });

        return StatsView;
});
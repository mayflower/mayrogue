// vim:softtabstop=4:shiftwidth=4

define(['underscore', 'util', 'change/types', 'change/movement',
        'change/addEntity', 'change/removeEntity', 'change/attack'],
    function(_, Util, Types, Movement, AddEntity, RemoveEntity, Attack)
{
    "use strict";

    var Change = {
        Movement: Movement,
        AddEntity: AddEntity,
        RemoveEntity: RemoveEntity,
        Attack: Attack,

        serialize: function(change) {
            return {
                type: change.type,
                data: change.serialize()
            };
        },

        unserialize: function(blob) {
            switch (blob.type) {
                case (Change.MOVEMENT):
                    return Movement.unserialize(blob.data);
                case (Change.ADD_ENTITY):
                    return AddEntity.unserialize(blob.data);
                case (Change.REMOVE_ENTITY):
                    return RemoveEntity.unserialize(blob.data);
                case (Change.ATTACK):
                    return Attack.unserialize(blob.data);
                default:
                    return null;
            }
        }
    };

    _.extend(Change, Types);

    return Change;
});

// vim:softtabstop=4:shiftwidth=4

define(['underscore', 'util', 'change/types', 'change/movement',
        'change/addEntity', 'change/removeEntity'],
    function(_, Util, Types, Movement, AddEntity, RemoveEntity)
{
    "use strict";

    var Change = {
        Movement: Movement,
        AddEntity: AddEntity,
        RemoveEntity: RemoveEntity,

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
                default:
                    return null;
            }
        }
    };

    _.extend(Change, Types);

    return Change;
});

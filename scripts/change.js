// vim:softtabstop=4:shiftwidth=4

define(['underscore', 'util', 'change/movement',
        'change/addEntity', 'change/removeEntity'],
    function(_, Util, Movement, AddEntity, RemoveEntity)
{
    "use strict";

    var Change = {
        MOVEMENT: 1,
        ADDENTITY: 2,
        REMOVEENTITY: 3,

        Movement: Movement,
        AddEntity: AddEntity,
        RemoveEntity: RemoveEntity,

        serialize: function(change) {
            var type;
            if (change instanceof Movement) {
                type = Change.MOVEMENT;
            } else if (change instanceof AddEntity) {
                type = Change.ADDENTITY;
            } else if (change instanceof RemoveEntity) {
                type = Change.REMOVEENTITY;
            } else {
                return;
            }

            return {
                type: type,
                data: change.serialize()
            };
        },

        unserialize: function(blob) {
            switch (blob.type) {
                case (Change.MOVEMENT):
                    return Movement.unserialize(blob.data);
                case (Change.ADDENTITY):
                    return AddEntity.unserialize(blob.data);
                case (Change.REMOVEENTITY):
                    return RemoveEntity.unserialize(blob.data);
                default:
                    return null;
            }
        }
    };

    return Change;
});

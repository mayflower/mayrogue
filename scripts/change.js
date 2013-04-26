// vim:softtabstop=4:shiftwidth=4

/**
 * Change namespace. Provides the various actual changes and serialization /
 * deserialization.
 *
 * A change encapsulates an atomic change to the world state. Changes to the
 * world state on the server (and on the client) are repesented as change
 * instances, serialized and passed to the other side. There, they are
 * unserialized and applied.
 *
 * To this end, each change has an 'apply' method. The first parameter to this
 * method is the world state (an instance of world), the second a flag which is
 * set if the change should be considered 'stale'. A change is considered stale
 * if the server state lags behind the client state (i.e. not all actions
 * requested by the client have been processed).
 *
 * In order to determine whether a change is stale, each change is assigned an
 * unique, incrementing generation index. Each update published by the server
 * includes the generation of the last change processed; if it is smaller than
 * the last generation send by the client, the change is considered stale.
 */

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

        /**
         * Serialize a change, store the type in the blob.
         */
        serialize: function(change) {
            return {
                type: change.type,
                data: change.serialize()
            };
        },

        /**
         * Unserialize a change, inferring the type from the blob.
         */
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

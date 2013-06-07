define(['command/atom', 'command/emitter', 'command/executor'],
    function(Atom, Emitter, Executor)
{
    'use strict';

    var Command = {
        Atom: Atom,
        Emitter: Emitter,
        Executor: Executor
    };

    return Command;
});
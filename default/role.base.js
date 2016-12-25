/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.base');
 * mod.thing == 'a thing'; // true
 */
 
 
 var roleBase = {
    run: function(creep) {
         var repairTargets = creep.pos.findInRange(FIND_STRUCTURES, 1, {
        filter: function(object) {
            return object.hits < object.hitsMax
                && object.hitsMax - object.hits > REPAIR_POWER;
        }
    });
    repairTargets.sort(function (a,b) {return (a.hits - b.hits)});
    if (repairTargets.length > 0)
        creep.repair(repairTargets[0]);
        //creep.say('repairing');
    }
 }

module.exports = roleBase;
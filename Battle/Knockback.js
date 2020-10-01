//Plugin for doing attacks that make your unit move backwards after using a specific weapon.
//Based on Goiza's unitcommand-skills (the FEH movement assist skills)
//Add knockbackUser: true and/or knockbackTarget: true to your weapon's custom parameters
//Alternatively, add identical custom parameters to a skill with the keyword "Knockback" for the same effect.
//Note that if a unit can pursuit, they will (be) knock(ed) back several times.
//Made by Eclogia

var Knockback = {
	getOppositeDirection: function(direction) {
		switch (direction) {
			case DirectionType.LEFT:
				return DirectionType.RIGHT;
			case DirectionType.TOP:
				return DirectionType.BOTTOM;
			case DirectionType.RIGHT:
				return DirectionType.LEFT;
			case DirectionType.BOTTOM:
				return DirectionType.TOP;
			default:
				return DirectionType.NULL;
		}
	},

	canMoveOnTargetTile: function(unit, direction) {
		var targetX = unit.getMapX() + XPoint[direction];
		var targetY = unit.getMapY() + YPoint[direction];
		var curSession = root.getCurrentSession();
		var boundaryX = curSession.getCurrentMapInfo().getMapWidth();
        var boundaryY = curSession.getCurrentMapInfo().getMapHeight();
        var canMove = false;
        if (targetX < boundaryX && targetX >= 0 && targetY < boundaryY && targetY >= 0) {
            var targetTerrain = curSession.getTerrainFromPos(targetX, targetY, true);
            var tileOccupied = (curSession.getUnitFromPos(targetX, targetY) != null); //True if there is a unit at the target coordinates
            if (targetTerrain.getMovePoint(unit) > 0 && !tileOccupied) {
                canMove = true;
            }
        }
        return canMove;
	},

	knockbackUnit: function(unit, direction) {
		unit.setMapX(unit.getMapX() + XPoint[direction]);
		unit.setMapY(unit.getMapY() + YPoint[direction]);
	},

	applyOnAttacker: function(unit, target) {
		var direction = this.getOppositeDirection(EasyMapUnit._getAdhocDirection(unit, target));
        if (this.canMoveOnTargetTile(unit, direction)) {
        	this.knockbackUnit(unit, direction);
        }
	},

	applyOnDefender: function(unit, target) {
		var direction = EasyMapUnit._getAdhocDirection(unit, target);
        if (this.canMoveOnTargetTile(target, direction)) {
        	this.knockbackUnit(target, direction);
        }
	}
};

(function() {
	var alias0 = AttackFlow._doAttackAction;
	AttackFlow._doAttackAction = function() {
		alias0.call(this);
		var active = this._order.getActiveUnit();
		var passive = this._order.getPassiveUnit();
        var skillActive = SkillControl.getPossessionCustomSkill(active, "Knockback");
        var skillPassive = SkillControl.getPossessionCustomSkill(passive, "Knockback");
		var activeWeapon = BattlerChecker.getBaseWeapon(active);
		var knockbackActiveWithWeapon = typeof activeWeapon.custom.knockbackUser !== 'undefined' && activeWeapon.custom.knockbackUser;
		var knockbackPassiveWithWeapon = typeof activeWeapon.custom.knockbackTarget !== 'undefined' && activeWeapon.custom.knockbackTarget;
		var knockbackActiveWithActiveSkill = skillActive !== null && skillActive.custom.knockbackUser === true;
		var knockbackPassiveWithActiveSkill = skillActive !== null && skillActive.custom.knockbackTarget === true;
		var knockbackActiveWithPassiveSkill = skillPassive !== null && skillPassive.custom.knockbackTarget === true;
		var knockbackPassiveWithPassiveSkill = skillPassive !== null && skillPassive.custom.knockbackUser === true;
		if (knockbackActiveWithWeapon || knockbackActiveWithActiveSkill || knockbackActiveWithPassiveSkill) {
			Knockback.applyOnAttacker(active, passive);
		}
		if (knockbackPassiveWithWeapon || knockbackPassiveWithActiveSkill || knockbackPassiveWithPassiveSkill) {
			Knockback.applyOnDefender(active, passive);
		}
	}
})();
//Plugin for having a main unit take damage when specific other units are defeated. Give units 3 custom parameters.
//Example: {linkedUnitId: 24, isMain: false, damage: 0}
//linkedUnitId: the id of the unit group. In this implementation, only one group can be given to a unit.
//isMain: whether the unit you give this parameter is going to take damage when the other units die. There can only be one main units in this implementation.
//damage: If it is set to 0, the sub unit's HP will be substracted to the main unit. Otherwise, the specified number will be substracted.
//Only supports basic armies Player, Enemy, and Ally.
//Adds to the function UnitEventChecker._getEvent.
//Made by Eclogia

var LinkedUnit = {
	getUnitTypeList: function(unitType) {
		switch (unitType) {
			case UnitType.PLAYER:
				return root.getCurrentSession().getPlayerList();
			case UnitType.ENEMY:
				return root.getCurrentSession().getEnemyList();
			case UnitType.ALLY:
				return root.getCurrentSession().getAllyList();
			//If you ever find yourself in another case, I suppose you would have added another army and you will have to add their relevant info
		}
		return null;
	},

	isSubUnit: function(unit) {
		return typeof unit.custom.isMain !== 'undefined' ? !unit.custom.isMain : false;
	},

	getMainUnit: function(subUnit) {
		var unitList = this.getUnitTypeList(subUnit.getUnitType());
		for (var i = unitList.getCount() - 1; i >= 0; i--) {
			var curUnit = unitList.getData(i);
			if (curUnit.custom.linkedUnitId === subUnit.custom.linkedUnitId && curUnit.custom.isMain)
				return curUnit;
		}
	},

	substractToMainUnitHP: function(subUnit) {
		var mainUnit = this.getMainUnit(subUnit);
		var damage = subUnit.custom.damage;
		if (damage === 0)
			damage = ParamBonus.getMhp(subUnit);
		mainUnit.setHp(mainUnit.getHp() - damage);
	}
};

(function() {
	var alias2 = UnitEventChecker._getEvent;
	UnitEventChecker._getEvent = function(unit, targetUnit, unitEventType) {
		if (LinkedUnit.isSubUnit(unit) && (unitEventType === UnitEventType.INJURY || unitEventType === UnitEventType.DEAD)) {
			LinkedUnit.substractToMainUnitHP(unit);
		}
		return alias2.call(this, unit, targetUnit, unitEventType);
	}
})();
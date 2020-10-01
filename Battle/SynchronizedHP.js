//Plugin for synchronized HP between several unit that have 2 custom parameters
//Example: {synchroUnitId: 42, nextMember: null}
//synchroUnitId can be anything as long as it's consistent between the sub units
//nextMember is null and will be initialized upon the first time a sub unit of the SynchroUnit takes damage
//Applicable for breakable walls spanning several tiles, hiveminds, or maybe for huge monsters.
//Adds code to DamageEraseFlowEntry._doAction and DamageControl.reduceHp.
//Only supports basic armies Player, Enemy, and Ally.
//Made by Eclogia

var SynchroUnit = {
	//The members of a SynchroUnit are the multiple units spanning it
	setupMemberList: function(synchroUnitId, unitType) {
		var unitList = this.getUnitTypeList(unitType);
		var synchroUnitMembers = [];
		for (var i = unitList.getCount() - 1; i >= 0; i--) {
			var curUnit = unitList.getData(i);
			if (curUnit.custom.synchroUnitId === synchroUnitId)
				synchroUnitMembers.push(curUnit);
		}
		for (var i = synchroUnitMembers.length - 1; i > 0; i--) {
			synchroUnitMembers[i].custom.nextMember = synchroUnitMembers[i - 1].getId();
		}
		synchroUnitMembers[0].custom.nextMember = synchroUnitMembers[synchroUnitMembers.length - 1].getId();
	},

	getNextMember: function(synchroUnit) {
		if (typeof synchroUnit.custom.synchroUnitId !== 'undefined' && synchroUnit.custom.nextMember === null)
			this.setupMemberList(synchroUnit.custom.synchroUnitId, synchroUnit.getUnitType());
		return synchroUnit.custom.nextMember;
	},

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

	synchronizeHP: function(targetSubUnit) {
		if (typeof targetSubUnit.custom.synchroUnitId !== 'undefined') {
			var newHP = targetSubUnit.getHp();
			var synchroUnitIsDead = newHP <= 0;
			var targetSubUnitId = targetSubUnit.getId();
			var nextSubUnitId = this.getNextMember(targetSubUnit);
			var unitList = this.getUnitTypeList(targetSubUnit.getUnitType());
			while (nextSubUnitId != targetSubUnitId) {
				var nextSubUnit = unitList.getDataFromId(nextSubUnitId);
				nextSubUnit.setHp(newHP);
				if (synchroUnitIsDead) {
					DamageControl.setDeathState(nextSubUnit);
				}
				nextSubUnitId = this.getNextMember(nextSubUnit);
			}
		}
	}
};

(function() {
	var alias0 = DamageControl.reduceHp;
	DamageControl.reduceHp = function(unit, damage) {
		alias0.call(this, unit, damage);
		SynchroUnit.synchronizeHP(unit);
	}

	var alias1 = DamageEraseFlowEntry._doAction;
	DamageEraseFlowEntry._doAction = function(damageData){
		alias1.call(this, damageData);
		SynchroUnit.synchronizeHP(damageData.targetUnit);
	}

	var alias2 = HpRecoveryEventCommand.mainEventCommand;
	HpRecoveryEventCommand.mainEventCommand = function() {
		alias2.call(this);
		var unit = this._targetUnit;
		SynchroUnit.synchronizeHP(unit);
	}
})();
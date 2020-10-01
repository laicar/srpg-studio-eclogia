//Simple plugin to manage units that act as breakable wall.
//You will still have to do the map chip change event upon death.
//Set the unit custom parameter as such: {isWall: true}
//Made by Eclogia, using old code by Goinza

var BreakableWall = {
	changeAllWallsUnitType: function(startEndType) {
		var newUnitType = null;
		var isEnemyStart = startEndType === StartEndType.ENEMY_START;
		if (startEndType === StartEndType.PLAYER_START) {
			newUnitType = UnitType.ENEMY;
		} else if (isEnemyStart) {
			newUnitType = UnitType.ALLY;
		} else if (startEndType === StartEndType.ALLY_START) {
			return;
		}
		var wallList = this.getWallList(isEnemyStart);
		for (var i = wallList.length - 1; i >= 0; i--) {
			var evtGen = root.getEventGenerator();
			evtGen.unitAssign(wallList[i], newUnitType);
			evtGen.execute();
		}
	},

	getWallList: function(wallsAreCurrentlyEnemies) {
		var unitList = null;
		if (wallsAreCurrentlyEnemies)
			unitList = root.getCurrentSession().getEnemyList();
		else
			unitList = root.getCurrentSession().getAllyList();
		var wallList = [];
		for (var i = unitList.getCount() - 1; i >= 0; i--) {
			var curUnit = unitList.getData(i);
			if (curUnit.custom.isWall)
				wallList.push(curUnit);
		}
		return wallList;
	}
};

(function() {
	var alias1 = TurnChangeStart.getStartEndType;
	TurnChangeStart.getStartEndType = function() {
		var result = alias1.call(this);
		BreakableWall.changeAllWallsUnitType(result);
		return result;
	}

	//The following is by Goinza
    var alias2 = MapEdit._openMenu;
    MapEdit._openMenu = function(unit) {
        return unit !== null && unit.custom.isWall!=null && unit.custom.isWall ? MapEditResult.NONE : alias2.call(this, unit);
    }
})();
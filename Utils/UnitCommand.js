/*
** Unit Command template plugin by Eclogia
** In this template, the command is displayable if the unit has a custom skill with the keyword "NewCommand"
** I recommend you check out MarshalStackableItems.js in my same folder for more advanced principles to apply here.
*/
(function() {
	var cc01 = UnitCommand.configureCommands;
	UnitCommand.configureCommands = function(groupArray) {
		cc01.call(this, groupArray);
		//add the new command at the beginning of the list (index 0)
		//groupArray.insertObject(UnitCommand.NewCommand, 0);
		//alternatively, add the new command at the end of the list
		groupArray.appendObject(UnitCommand.NewCommand);
	}
})();

UnitCommand.NewCommand = defineObject(UnitListCommand, {
	openCommand: function() {
		//Prepare to do stuff here
	},

	moveCommand: function() {
		//Actually do the stuff here
		this.endCommandAction();
		return MoveResult.END;
	},

	isCommandDisplayable: function() {
		var unit = this.getCommandTarget();
		var hasSkill = SkillControl.getPossessionCustomSkill(unit, "NewCommand") !== null;
		return hasSkill;
	},

	getCommandName: function() {
		return "Displayed Name";
	},

	isRepeatMoveAllowed: function() {
		//for Move Again
		return false;
	}
})
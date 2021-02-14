/*
Item-stacking command for the preparation screen by Eclogia, inspired by LadyRena (aka Claris)
Will merge items having the custom parameter {Stackable: true},
both in the convoy and inside a unit's inventory (no cross-inventory merges).
Uses past the item's max durability are preserved in other items.
There is a prompt to confirm the action.
Warning: overwrites SetupCommand.configureCommands (scene-battlesetup.js line 975)
*/

CommandActionType.MERGEITEMS = 400;

SetupCommand.configureCommands = function(groupArray) {
	var mixer = createObject(CommandMixer);

	mixer.pushCommand(SetupCommand.UnitSortie, CommandActionType.UNITSORTIE);
	mixer.pushCommand(SetupCommand.Sortie, CommandActionType.BATTLESTART);
	mixer.pushCommand(SetupCommand.Merge, CommandActionType.MERGEITEMS);
	
	mixer.mixCommand(CommandLayoutType.BATTLESETUP, groupArray, BaseListCommand);
	groupArray.appendObject(SetupCommand.Merge);// will be added at the bottom of the list
};

SetupCommand.Merge = defineObject(BaseListCommand,
{
	_questionWindow: null,
	_idx1: null,
	_idx2: null,
	
	openCommand: function() {
		this._questionWindow = createWindowObject(QuestionWindow, this);
		this._questionWindow.setQuestionMessage("Merge used items?");
		this._questionWindow.setQuestionActive(true);
	},
	
	moveCommand: function() {
		if (this._questionWindow.moveWindow() !== MoveResult.CONTINUE) {
			if (this._questionWindow.getQuestionAnswer() === QuestionAnswer.YES) {
				this.stackInPlayerInventories();
				this.stackConvoy();
			}
			return MoveResult.END;
		}
		
		return MoveResult.CONTINUE;
	},
	
	drawCommand: function() {
		var x = LayoutControl.getCenterX(-1, this._questionWindow.getWindowWidth());
		var y = LayoutControl.getCenterY(-1, this._questionWindow.getWindowHeight());
		
		this._questionWindow.drawWindow(x, y);
	},

	getCommandName: function() {
		return "Merge Items";
	},

	fetchFirstStackableItemPairInInventory: function(unit) {
		var count = UnitItemControl.getPossessionItemCount(unit);
		UnitItemControl.arrangeItem(unit);
		this._idx1 = null;
		this._idx2 = null;
		for (var i = 0; i < count; i++) {
			var item1 = unit.getItem(i);
			if (item1.getLimitMax() === 0 || !item1.custom.Stackable || item1.getLimitMax() === item1.getLimit())
				continue;
			for (var j = i+1; j < count; j++) {
				var item2 = unit.getItem(j);
				if (item1.getName() === item2.getName()){
					this._idx1 = i;
					this._idx2 = j;
					return;
				}
			}
		}
	},

	mergeItemsInInventory: function(unit) {
		var firstItem = unit.getItem(this._idx1);
		var secondItem = unit.getItem(this._idx2);
		var maxDurability = secondItem.getLimitMax();
		var newDurability = secondItem.getLimit() + firstItem.getLimit();
		var overflow = newDurability - maxDurability;
		if (overflow > 0) {
			firstItem.setLimit(maxDurability);
			secondItem.setLimit(overflow);
		} else if (overflow === 0) {
			firstItem.setLimit(maxDurability);
			UnitItemControl.cutItem(unit,this._idx2);
		} else {
			UnitItemControl.cutItem(unit,this._idx2);
		}
		this._idx1 = null;
		this._idx2 = null;
	},

	stackInPlayerInventories: function() {
		var players = root.getCurrentSession().getPlayerList();
		var count = players.getCount();
		for (var i = 0; i < count; i++) {
			var unit = players.getData(i);
			this.fetchFirstStackableItemPairInInventory(unit);
			while (this._idx1 !== null) {
				this.mergeItemsInInventory(unit);
				this.fetchFirstStackableItemPairInInventory(unit);
			}
		}
	},

	stackConvoy: function() {
		var itemArray = StockItemControl.getStockItemArray();
		StockItemControl.sortItem();
		for (var j = 0; j < itemArray.length -1; j++) {
			var item = itemArray[j];
			var item2 = null;
			for (var i = j +1; i < itemArray.length; i++){
				if (itemArray[i].getName() === item.getName()){
					item2 = itemArray[i];
					break;
				}
			}
			if (item2 !== null){
				var maxDurability = item2.getLimitMax();
				var stockDurability = item2.getLimit();
				if (item2.custom.Stackable && stockDurability < maxDurability){
					var newDurability = item.getLimit() + stockDurability;
					var overflow = newDurability - maxDurability;
					if(overflow > 0) {
						item2.setLimit(maxDurability);
						item.setLimit(overflow);
					} else if (overflow === 0) {
						item2.setLimit(maxDurability);
						var toRemove = StockItemControl.getIndexFromItem(item);
						StockItemControl.cutStockItem(toRemove);
					} else {
						item2.setLimit(newDurability);
						var toRemove = StockItemControl.getIndexFromItem(item);
						StockItemControl.cutStockItem(toRemove);
					}
				} else {
					itemArray.push(item);
				}
			}
			else{
				itemArray.push(item);
			}
			StockItemControl.sortItem();
		}
	}
}
);
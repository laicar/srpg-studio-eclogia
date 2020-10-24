/*
Plugin for an item that does Again for all adjacent allies by Eclogia.
If the user uses the item, all adjacent allies will be be refreshed and stop waiting.

To use:
Make a custom item with the keyword specified here (default: Instrument).
Set the scope to Self and the animation to the one you want (it will be centered on the user).
If you want, you can even create a new weapon type for your instruments in Config.
If you set a durability, it will decrease upon use. 

The display name parameter below is the item type that is displayed in the item info.
*/


var EclogiaInstrument = {
	keyword: "Instrument",
	displayName: "Instrument",

	getTargetUnitList: function(itemUser) {
		var list = [];
		var userX = itemUser.getMapX();
		var userY = itemUser.getMapY();
		var mapInfo = root.getCurrentSession().getCurrentMapInfo();
		var mapWidth = mapInfo.getMapWidth();
		var mapHeight = mapInfo.getMapHeight();
		for (var i = 0; i < XPoint.length; i++)	{
			var targetX = userX + XPoint[i];
			var targetY = userY + YPoint[i];
			if (0 <= targetX && targetX <= mapWidth && 0 <= targetY && targetY <= mapHeight){
				var targetUnit = PosChecker.getUnitFromPos(targetX, targetY);
				if (targetUnit != null && targetUnit.isWait()) {
					list.push(targetUnit);
				}
			}
		}
		return list;
	}	
}

var eclogiaInstrumentAlias01 = ItemPackageControl.getCustomItemSelectionObject;
ItemPackageControl.getCustomItemSelectionObject = function(item, keyword) {
	if (keyword === EclogiaInstrument.keyword) {
		return InstrumentItemSelection;
	}
	return eclogiaInstrumentAlias01.call(this, item, keyword);
};

var InstrumentItemSelection = defineObject(BaseItemSelection, {
});

var eclogiaInstrumentAlias02 = ItemPackageControl.getCustomItemUseObject;
ItemPackageControl.getCustomItemUseObject = function(item, keyword) {
	if (keyword === EclogiaInstrument.keyword) {
		return InstrumentItemUse;
	}
	return null;
};

var InstrumentItemUse = defineObject(BaseItemUse,
{	
	enterMainUseCycle: function(itemUseParent) {		
		var targetUnitList = EclogiaInstrument.getTargetUnitList(itemUseParent.getItemTargetInfo().targetUnit);
		for(var i = 0; i < targetUnitList.length; i++) {
			targetUnitList[i].setWait(false);
			// Enable to move with the enemy turn by deactivating acted.
			targetUnitList[i].setOrderMark(OrderMarkType.FREE);
		}
		return EnterResult.OK;
	},
	
	getItemAnimePos: function(itemUseParent, animeData) {
		return this.getUnitBasePos(itemUseParent, animeData);
	},

	getUnitBasePos: function(itemUseParent, animeData) {
		var x, y, size, pos;

		if (Miscellaneous.isPrepareScene()) {
			size = Miscellaneous.getFirstKeySpriteSize(animeData, 0);
			x = LayoutControl.getCenterX(-1, size.width);
			y = LayoutControl.getCenterY(-1, size.height);
			pos = createPos(x, y);
		}
		else {
			var itemUser = itemUseParent.getItemTargetInfo().targetUnit;
			x = LayoutControl.getPixelX(itemUser.getMapX());
			y = LayoutControl.getPixelY(itemUser.getMapY());
			pos = LayoutControl.getMapAnimationPos(x, y, animeData);
		}
		return pos;
	}
}
);


var eclogiaInstrumentAlias03 = ItemPackageControl.getCustomItemInfoObject;
ItemPackageControl.getCustomItemInfoObject = function(item, keyword) {
	if (keyword === EclogiaInstrument.keyword) {
		return InstrumentItemInfo;
	}
	return null;
};

var InstrumentItemInfo = defineObject(BaseItemInfo, {
	drawItemInfoCycle: function(x, y) {
		ItemInfoRenderer.drawKeyword(x, y, EclogiaInstrument.displayName);
	},
	
	getInfoPartsCount: function() {
		return 1;
	}
});

var eclogiaInstrumentAlias05 = ItemPackageControl.getCustomItemAvailabilityObject;
ItemPackageControl.getCustomItemAvailabilityObject = function(item, keyword) {
	if (keyword === EclogiaInstrument.keyword) {
		return InstrumentItemAvailability;
	}
	return null;
};

var InstrumentItemAvailability = defineObject(BaseItemAvailability, {
	isItemAllowed: function(unit, targetUnit, item) {
		var targetUnitList = EclogiaInstrument.getTargetUnitList(unit);
		// The unit who doesn't wait is not a target.
		return targetUnitList.length > 0;
	}
});

var eclogiaInstrumentAlias06 = ItemPackageControl.getCustomItemAIObject;
ItemPackageControl.getCustomItemAIObject = function(item, keyword) {
	if (keyword === EclogiaInstrument.keyword) {
		return InstrumentItemAI;
	}
	return null;
}

var InstrumentItemAI = defineObject(QuickItemAI, {
});
(function () {
	//IIF body
	angular.module("NarrowItDownApp",[]).
	controller("NarrowItDownController",NarrowItDownController).
	service('MenuSearchService',MenuSearchService).
	directive("foundItems",FoundItems);





	NarrowItDownController.$inject = ['MenuSearchService']
	function NarrowItDownController(MenuSearchService) {
		var menuList = this;
		menuList.found = [];
		menuList.searchTerm = "";
		menuList.errorMessage = "";

		menuList.onClickNarrowItDown = function () {
			var searchTerm = menuList.searchTerm;
			var foundList = MenuSearchService.getMatchedMenuItems(searchTerm);
			// here foundList is a promise
			foundList.then(
			//on success
				function (found) {
				menuList.errorMessage = "";
				menuList.found=found;
			},
			//on fail:
			function (reason) {
				menuList.found = [];
				menuList.errorMessage = reason;
			});
		}
		menuList.onClickNotThisOne = function (itemIndex) {
			menuList.found.splice(itemIndex,1);

		}
	}


	MenuSearchService.$inject = ['$q',"$http"];
	function MenuSearchService($q,$http) {
		var service = this;

		service.getMatchedMenuItems = function (searchTerm) {
			var defered = $q.defer();

			var jsonDataPromise = service.getAllItems();
			jsonDataPromise.then(function (response) {
				//when all item list is ready, filter them.
				var itemList = response.data.menu_items;
				var found = service.filterItems(itemList,searchTerm);
				if(  found.length > 0 && searchTerm != ''){
					defered.resolve(found);
				}
				else{defered.reject("Nothing matched!");}
				
			});

			return defered.promise;
		}

		service.getAllItems = function () {
			//return all items return from server.
			var response = $http({method: "GET",url:"https://davids-restaurant.herokuapp.com/menu_items.json"});
			return response; //here response is a promise!
		}

		service.filterItems = function(itemList,searchTerm){
			var found=[];
				for (i = 0; i < itemList.length - 1; i++) {
					if(itemList[i].description.toLowerCase().indexOf(searchTerm) != -1){
						found.push(itemList[i]);
					}
				}
				return found;

		}
	}

	FoundItems.$inject = [];
	function FoundItems() {
		var ddo = {
			templateUrl: 'foundItems.html',
			//template: " <ul><li ng-repeat= 'menuItem in itemList'>Name:{{menuItem.name}} Description: {{menuItem.description}}<button ng-click = 'onRemove({index:$index});'' >Do not want this!</button></li></ul> ",
			scope: {
				itemList: '<searchResult',
				onRemove: '&'
			}
		};
		//console.log(ddo);
		return ddo;
	}






})();
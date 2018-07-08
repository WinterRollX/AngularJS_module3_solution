(function () {
	//IIF body
	angular.module("NarrowItDownApp",[]).
	controller("NarrowItDownController",NarrowItDownController).
	service('MenuSearchService',MenuSearchService);





	NarrowItDownController.$inject = ['MenuSearchService']
	function NarrowItDownController(MenuSearchService) {
		var menuList = this;
		menuList.found = [];
		menuList.searchTerm = "";

		this.testFun2 = function () {
			var searchTerm = "egg";
			var foundList = MenuSearchService.getMatchedMenuItems(searchTerm);
			// here foundList is a promise
			foundList.then(function (found) {
				menuList.found=found;
				console.log("completed loading");
			},function (reason) {
				console.log("Fail to load, reason:" + reason);
			});
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
				console.log(response.data);
				var itemList = response.data.menu_items;
				if(  itemList.length > 0){
					var found = service.filterItems(itemList,searchTerm);
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






})();
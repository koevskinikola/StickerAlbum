// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";
    
    var appView = Windows.UI.ViewManagement.ApplicationView;
    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;

    WinJS.UI.Pages.define("/pages/searchedPlayers/searchedPlayers.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            // TODO: Initialize the page here.
            var player = options.ime;
            var naslov = element.querySelector(".pagetitle");
            var listview = element.querySelector(".igracLV").winControl;
            listview.itemTemplate = element.querySelector(".igracTemplate");

            var igrac = Data.getSearchedPlayer(player);
            if (igrac.length === 0) {           //Доколку нема залепени слики од бараниот играч
                naslov.innerHTML = "Овој играч го немате залепено ";
                var nezalepeni = fullData.getSearchedPlayer(player);
                if (nezalepeni.length === 0)    //Доколку бараниот играч/тим не е пронајден во листата од сите можни играчи
                    naslov.innerHTML = "Овој играч не постои во Западната Конференција!";
                else {                          //Доколку бараниот играч е најден, но не е залепен
                    naslov.innerHTML = "Овој играч сеуште го немате залепено!";
                    listview.itemDataSource = nezalepeni.dataSource;
                }
            }
            else {  //Доколку играчот е најден во залепените слики
                naslov.innerHTML = "Пребарување за играчот " + player;
                listview.itemDataSource = igrac.dataSource;
            };

            

            if (appView.value === appViewState.snapped) {
                listview.layout = new WinJS.UI.ListLayout();
            } else {
                listview.layout = new WinJS.UI.GridLayout();
            };

            
        },

        unload: function () {
            // TODO: Respond to navigations away from this page.
        },

        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />
            /// <param name="viewState" value="Windows.UI.ViewManagement.ApplicationViewState" />
            /// <param name="lastViewState" value="Windows.UI.ViewManagement.ApplicationViewState" />

            var listView = element.querySelector(".igracLV").winControl;

            if (lastViewState !== viewState) {
                if (appView.value === appViewState.snapped) {
                    listView.layout = new WinJS.UI.ListLayout();
                } else {
                    listView.layout = new WinJS.UI.GridLayout();
                }
            }
        }
    });
})();

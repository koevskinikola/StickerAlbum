// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    var appView = Windows.UI.ViewManagement.ApplicationView;
    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;

    WinJS.UI.Pages.define("/pages/teams/teams.html", {

        //ФУНКЦИЈА ЗА НАВИГИРАЊЕ ПРИ КЛИК НА ТИМ ОД ListView
        //го проследува името на тимот при навигирање
        itemInvoked: function (args) {
                var item = Data.teamsArr.getAt(args.detail.itemIndex);
                var timot = item.key;
                WinJS.Navigation.navigate("/pages/players/players.html", { groupKey: timot });
        },

        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            // TODO: Initialize the page here.
            var listview = element.querySelector(".teamLV").winControl;
            listview.itemTemplate = element.querySelector(".teamTemplate");
            
            if (appView.value === appViewState.snapped) {
                listview.layout = new WinJS.UI.ListLayout();
            } else {
                listview.layout = new WinJS.UI.GridLayout();
            };

            listview.itemDataSource = Data.teamsArr.dataSource;
            listview.oniteminvoked = this.itemInvoked.bind(this);
        },

        unload: function () {
            // TODO: Respond to navigations away from this page.
        },

        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />
            /// <param name="viewState" value="Windows.UI.ViewManagement.ApplicationViewState" />
            /// <param name="lastViewState" value="Windows.UI.ViewManagement.ApplicationViewState" />

            var listView = element.querySelector(".teamLV").winControl;

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

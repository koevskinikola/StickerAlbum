(function () {
    "use strict";

    var appView = Windows.UI.ViewManagement.ApplicationView;
    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;

    WinJS.UI.Pages.define("/pages/home/home.html", {

        //ФУНКЦИЈА ЗА НАВИГИРАЊЕ ПРИ КЛИК НА АЛБУМ ОД ListView (Моментално има само еден)
        itemInvoked: function (args) {
            WinJS.Navigation.navigate("/pages/teams/teams.html");
        },

        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            // TODO: Initialize the page here.
            Data.stats();

            var listView = element.querySelector(".albumsListView").winControl;
            listView.itemTemplate = element.querySelector(".albumTemplate");

            listView.itemDataSource = Data.albumArr.dataSource;

            //==========ZA DUPLIKATI APP BAR++++++++++++++
            var doublesListView = element.querySelector(".doublesLV").winControl;
            doublesListView.itemTemplate = element.querySelector(".doublesTemplate");

            var groupedItems = Data.duplikatiArr;

            doublesListView.itemDataSource = Data.getGrouped().dataSource;

            doublesListView.layout = new WinJS.UI.GridLayout();
            doublesListView.layout.maxRows = 1;

            //++++++++++++++++++++++++++++++++++++++++++++

            if (appView.value === appViewState.snapped) {
                listView.layout = new WinJS.UI.ListLayout();
            } else {
                listView.layout = new WinJS.UI.GridLayout();
            };

            listView.oniteminvoked = this.itemInvoked.bind(this);
        },

        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />
            /// <param name="viewState" value="Windows.UI.ViewManagement.ApplicationViewState" />
            /// <param name="lastViewState" value="Windows.UI.ViewManagement.ApplicationViewState" />

            var listView = element.querySelector(".albumsListView").winControl;
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

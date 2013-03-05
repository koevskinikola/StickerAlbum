// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";
    
    var appView = Windows.UI.ViewManagement.ApplicationView;
    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;

    WinJS.UI.Pages.define("/pages/players/players.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            // TODO: Initialize the page here.
            var tim = options.groupKey;
            var naslov = element.querySelector(".pagetitle");
            naslov.innerHTML = "Вашите слики од " + tim;
            
            //==========ZA DUPLIKATI APP BAR++++++++++++++
            var duplikati = Data.getDuplicatesFromTim(tim);

            var doublesListView = element.querySelector(".doublesLV").winControl;
            doublesListView.itemTemplate = element.querySelector(".doublesTemplate");

            doublesListView.itemDataSource = duplikati.dataSource;

            doublesListView.layout = new WinJS.UI.GridLayout();
            //==================================================

            var team = Data.getItemsFromTim(options.groupKey);

            var listview = element.querySelector(".igracLV").winControl;
            listview.itemTemplate = element.querySelector(".igracTemplate");

            if (appView.value === appViewState.snapped) {
                listview.layout = new WinJS.UI.ListLayout();
            } else {
                listview.layout = new WinJS.UI.GridLayout();
            };

            listview.itemDataSource = team.dataSource;
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

// For an introduction to the Navigation template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232506
(function () {
    "use strict";

    WinJS.Binding.optimizeBindingReferences = true;

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    var nav = WinJS.Navigation;
    var brDuplikati = 0;

    app.addEventListener("activated", function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize
                // your application here.
                initialize();

            } else {
                // TODO: This application has been reactivated from suspension.
                // Restore application state here.
            }

            if (app.sessionState.history) {
                nav.history = app.sessionState.history;
            }
            args.setPromise(WinJS.UI.processAll().then(function () {

                initAddBtn();               //Иницијализација на копче за пакети
                initDuplikatiBtn();         //Иницијализација на копче за дупликати
                paketFlyout.initialize();
                Data.getFromLocal();        //десеријализација на локално складирани податоци
                Data.zemiStats();           //земање на податоци од web сервис

                //=============== PROBNO ZA DUPLIKATI +++++++++++++++

                //var listView = element.querySelector(".doublesLV").winControl;
               // listView.itemTemplate = element.querySelector(".doublesTemplate");
            
               // listView.itemDataSource = Data.duplikatiArr.dataSource;

               // listView.layout = new WinJS.UI.GridLayout();

                //========================================proba

                if (nav.location) {
                    nav.history.current.initialPlaceholder = true;
                    return nav.navigate(nav.location, nav.state);
                } else {
                    return nav.navigate(Application.navigator.home);
                }
            }));
        }
    });

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. If you need to 
        // complete an asynchronous operation before your application is 
        // suspended, call args.setPromise().
        app.sessionState.history = nav.history;
    };

    app.start();

    //=================================================
    //Функција за иницијализација на Search Charm
    function initialize(args) {
        var searchPane = Windows.ApplicationModel.Search.SearchPane.getForCurrentView();
        searchPane.addEventListener("querysubmitted", handlingQuerySubmitted, false);
    }

    //функција за справување со Search Charm
    function handlingQuerySubmitted(e) {
        //Го сместува текстот за пребарување во променлива igrac
        var igrac = e.queryText;

        //Навигира кон страната за приказ на резултати од пребарување,
        //ја проследува и променливата igrac, за добивање на резултати
        var nav = WinJS.Navigation; nav.navigate("/pages/searchedPlayers/searchedPlayers.html", { ime: igrac });
    }

    //=================================================
    //EventListener за AppBar копчето за пакет со слики
    //Ги сместува random генерираните слики во привремена листа tmpDuplikati
    function initAddBtn() {
        var btnZemi = document.getElementById("btnPaket");

        var btnSlika1 = document.getElementById("btnSlika1");
        var btnSlika2 = document.getElementById("btnSlika2");
        var btnSlika3 = document.getElementById("btnSlika3");
        var btnSlika4 = document.getElementById("btnSlika4");
        var btnSlika5 = document.getElementById("btnSlika5");

        btnZemi.addEventListener("click", function (e) {
            Data.tmpDuplikati = [];
            Data.tmpZalepi = [];

            btnSlika1.style.backgroundColor = "green";
            btnSlika2.style.backgroundColor = "green";
            btnSlika3.style.backgroundColor = "green";
            btnSlika4.style.backgroundColor = "green";
            btnSlika5.style.backgroundColor = "green";

            var item;
            for (var i = 1; i <= 5; i++) {
                item = fullData.getRandom();
                fullData.setImage("slika" + i, item);
                Data.tmpDuplikati.push(item);
            }
        });
    }

    //=================================================
    //ДОДАВА EventListener за AppBar копчето за незалепени слики
    //ги прикажува незалепените слики при клик на копчето
    function initDuplikatiBtn() {
        var btnDuplikati = document.getElementById("btnDuplikati");
        var flyoutDiv = document.getElementById("duplikatiContainer");

        btnDuplikati.addEventListener("click", function (e) {
            var divTag;
            flyoutDiv.innerHTML = '';
            Data.duplikatiArr.forEach(function (elem) {
                var spanTag = document.createElement("span");
                spanTag.innerHTML = "Играч: " + elem.ime + "<br /> Дупликати: " + elem.duplikati;

                var imgTag = document.createElement("img")
                imgTag.src = elem.slika;
                imgTag.style.width = "200px";
                imgTag.style.height = "200px";

                divTag = document.createElement("div");
                divTag.appendChild(imgTag);
                divTag.appendChild(spanTag);
                divTag.className = "duplikat";
                flyoutDiv.appendChild(divTag);
                flyoutDiv.appendChild(document.createElement("br"));
            });
        });
    }

})();
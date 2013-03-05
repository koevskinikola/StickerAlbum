/// <reference path="//Microsoft.WinJS.0.6/js/base.js" /> 
/// <reference path="//Microsoft.WinJS.0.6/js/ui.js" /> 
(function () {
    "use strict";

    //Објект за заведување на кога последен пат е земен пакет (кликнато на копчето за пакет)
    var prethodnoZemal = { saat: 5, den: 9, mesec: 5, god: 1991 };

    var albumi = [
            { ime: "NBA Western Conference League", slika: "/images/wcl.gif" }
    ];

    var timovi = [
        { key: 'Blazers', ime: 'Portland Blazers', slika: '/images/Blazers/blazers_logo.jpg' },
        { key: 'Clippers', ime: 'Los Angeles Clippers', slika: '/images/Clippers/clippers_logo.png' },
        { key: 'Grizzlies', ime: 'Memphis Grizzlies', slika: '/images/Grizzlies/grizzlies_logo.jpg' },
        { key: 'Hornets', ime: 'New Orleans Hornets', slika: '/images/Hornets/hornets_logo.jpg' },
        { key: 'Jazz', ime: 'Utah Jazz', slika: '/images/Jazz/jazz_logo.jpg' },
        { key: 'Kings', ime: 'Sacramento Kings', slika: '/images/Kings/kings_logo.gif' },
        { key: 'Lakers', ime: 'Los Angeles Lakers', slika: '/images/Lakers/logo.jpg' },
        { key: 'Mavericks', ime: 'Dallas Mavericks', slika: '/images/Mavericks/mavericks.jpg' },
        { key: 'Nuggets', ime: 'Denver Nuggets', slika: '/images/Nuggets/nuggets_logo.gif' },
        { key: 'Rockets', ime: 'Houston Rockets', slika: '/images/Rockets/RocketsLogo.gif' },
        { key: 'Spurs', ime: 'San Antonio Spurs', slika: '/images/Spurs/spurs_logo.jpg' },
        { key: 'Suns', ime: 'Phoenix Suns', slika: '/images/Suns/suns_logo.png' },
        { key: 'Thunder', ime: 'Oklahoma City Thunder', slika: '/images/Thunder/thunder_logo.jpg' },
        { key: 'Timberwolves', ime: 'Minnesota Timberwolves', slika: '/images/Timberwolves/timberwolves_logo.jpg' },
        { key: 'Warriors', ime: 'Golden State Warriors', slika: '/images/Warriors/warriors_logo.jpg' },
    ];

    var igraci = [
        //{ tim: , ime: '', pozicija: '', broj: '', slika: '' },
    ];

    var duplikati = [
        //{ tim: , ime: '', pozicija: '', broj: '', slika: '', duplikati: 1 },
    ];

    var tmpZalepi = [];
    var tmpDuplikati = [];
    var statistika = [];

    var albumArr = new WinJS.Binding.List(albumi);
    var teamsArr = new WinJS.Binding.List(timovi);
    var duplikatiArr = new WinJS.Binding.List(duplikati);
    var igraciArr = new WinJS.Binding.List(igraci);

    var groupedItems = igraciArr.createGrouped(
        function groupKeySelector(item) { return item.tim; },
        function groupDataSelector(item) { return item; }
    );

    function getGrouped() {
        return duplikatiArr.createGrouped(
                function groupKeySelector(item) { return item.tim; },
                function groupDataSelector(item) { return item; });
    }

    //ФУКЦИЈА ЗА КРЕИРАЊЕ НА ФИЛТРИРАНА НИЗА ПО ТИМОВИ
    function getItemsFromTim(tim) {
        return igraciArr.createFiltered(function (item) { return item.tim === tim; });
    }

    //ФУНКЦИЈА ЗА КРЕИРАЊЕ НА ФИЛТРИРАНА НИЗА ПО ТИМОВИ ( ЗА ДУПЛИКАТИ ) TUKA
    function getDuplicatesFromTim(tim) {
        return duplikatiArr.createFiltered(function (item) { return item.tim === tim; });
    }

    //ФУНКЦИЈА ЗА КРЕИРАЊЕ НА ФИЛТРИРАНА НИЗА ПРИ Charm Search
    function getSearchedPlayer(player) {
        return igraciArr.createFiltered(function (item) {
            return item.ime.search(player)!==-1;
        });
    }

    //===============ФУНКЦИИ ЗА ДОДАВАЊЕ СЛИКИ=================
    //ФУНКЦИЈА ЗА ПРОВЕРКА ДАЛИ ДАДЕНА СЛИКА Е "ЗАЛЕПЕНА". СЕ КОРИСТИ ВО paketFlyout.js
    function neZalepena(item) {
        if (getSearchedPlayer(item.ime).length > 0)
            return false;
        else
            return true;
    }

    //ФУНКЦИЈА ЗА ДОДАВАЊЕ НА ДУПЛИКАТИ. СЕ КОРИСТИ ВО paketFlyout.js
    function dodadiDuplikat(item) {
        var ima = false;
        duplikatiArr.forEach(function (elem) {
            if (elem.ime === item.ime) {
                elem.duplikati++;
                ima = true;
            };
        });
        //Доколку сликате не е веќе до дупликати, се додава
        if (!ima)
            duplikatiArr.push({ tim: item.tim, ime: item.ime, pozicija: item.pozicija, broj: item.broj, slika: item.slika, duplikati: 1 });
    };

    //ФУНКЦИЈА ЗА ВАДЕЊЕ НА ДУПЛИКАТИ ОД ЛИСТАТА ЗА ЛЕПЕЊЕ И НИВНО ДОДАВАЊЕ ВО ДУПЛИКАТИТЕ
    function eliminirajDupli() {
        for (var i = 0; i < tmpZalepi.length; i++) {
            for (var j = 0; j < tmpZalepi.length; i++) {
                if (tmpZalepi[i].ime === Data.tmpZalepi[j].ime && i !== j) {
                    dodadiDuplikat(Data.tmpZalepi[j]);
                    tmpZalepi.splice(j, 1);
                };
            };
        };
    };
    //===========================================


    //================ФУНКЦИИ ЗА СЕРИЈАЛИЗАЦИЈА И ДЕСЕРИЈАЛИЗАЦИЈА===========================

    //ФУНКЦИЈА ЗА ДЕСЕРИЈАЛИЗАЦИЈА
    function getFromLocal() {
        var applicationData = Windows.Storage.ApplicationData.current;
        var localFolder = applicationData.localFolder;

        //ЗЕМАЊЕ НА ПОДАТОК ЗА ПОСЛЕДНО КЛИКАЊЕ
        localFolder.getFileAsync("zemanje.txt").then(function (sampleFile) {
            return Windows.Storage.FileIO.readTextAsync(sampleFile);
        }).done(function (timestamp) {
            var item = JSON.parse(timestamp);
            prethodnoZemal.saat = item.saat;
            prethodnoZemal.den = item.den;
            prethodnoZemal.mesec = item.mesec;
            prethodnoZemal.god = item.god;
        }, function () {
            // Timestamp not found
        });

        //ЗЕМАЊЕ НА ПОДАТОЦИ ЗА ЗАЛЕПЕНИ СЛИКИ
        localFolder.getFileAsync("myimages.txt").then(function (sampleFile) {
            return Windows.Storage.FileIO.readTextAsync(sampleFile);
        }).done(function (timestamp) {
            var item = JSON.parse(timestamp);
            for (var i in item) {
                igraciArr.push({ tim: item[i].tim, ime: item[i].ime, pozicija: item[i].pozicija, broj: item[i].broj, slika: item[i].slika });
            }
        }, function () {
            // Timestamp not found
        });

        //ЗЕМАЊЕ НА ПОДАТОЦИ ЗА ДУПЛИКАТ/НЕЗАЛЕПЕНИ СЛИКИ
        localFolder.getFileAsync("duplikati.txt").then(function (sampleFile) {
            return Windows.Storage.FileIO.readTextAsync(sampleFile);
        }).done(function (timestamp) {
            var item = JSON.parse(timestamp);
            for (var i in item) {
                duplikatiArr.push({ tim: item[i].tim, ime: item[i].ime, pozicija: item[i].pozicija, broj: item[i].broj, slika: item[i].slika, duplikati: item[i].duplikati });
            }

        }, function () {
            // Timestamp not found
        });
    }

    //ФУНКЦИЈА ЗА СЕРИЈАЛИЗАЦИЈА
    function saveToLocal() {
        var myImages = igraciArr.slice(0);
        var dupli = duplikatiArr.slice(0);

        var myImagesSerialized = JSON.stringify(myImages);
        var dupliSerialized = JSON.stringify(dupli);
        var zemanjeSerialized = JSON.stringify(prethodnoZemal);

        // SAVE to local storage 
        var applicationData = Windows.Storage.ApplicationData.current;
        var localFolder = applicationData.localFolder;

        //ЗЕМАЊЕ НА ПОДАТОК ЗА ПОСЛЕДНО КЛИКАЊЕ
        localFolder.createFileAsync("zemanje.txt", Windows.Storage.CreationCollisionOption.replaceExisting)
            .then(function (sampleFile) {
                return Windows.Storage.FileIO.writeTextAsync(sampleFile, zemanjeSerialized);
            });

        //ЗЕМАЊЕ НА ПОДАТОЦИ ЗА ЗАЛЕПЕНИ СЛИКИ
        localFolder.createFileAsync("myimages.txt", Windows.Storage.CreationCollisionOption.replaceExisting)
            .then(function (sampleFile) {
                return Windows.Storage.FileIO.writeTextAsync(sampleFile, myImagesSerialized);
            });

        //ЗЕМАЊЕ НА ПОДАТОЦИ ЗА ДУПЛИКАТ/НЕЗАЛЕПЕНИ СЛИКИ
        localFolder.createFileAsync("duplikati.txt", Windows.Storage.CreationCollisionOption.replaceExisting)
            .then(function (sampleFile) {
                return Windows.Storage.FileIO.writeTextAsync(sampleFile, dupliSerialized);
            });
    }
    //===========================================

    //==================ФУКЦИИ ЗА WEB СЕРВИС=========================

    //ФУНКЦИЈА ЗА ЗЕМАЊЕ НА ПОДАТОЦИ ОД ВЕБ СЕРВИСОТ И СМЕСТУВАЊЕ ВО НИЗА
    function zemiStats() {

        WinJS.xhr({ url: "http://erikberg.com/nba/standings.json" })
            .then(function complete(result) {
                var results = JSON.parse(result.response);
                for (var k = 1; k <= 15; k++) {
                    for (var i in results.standing) {
                        if (results.standing[i].conference === "WEST" && results.standing[i].rank === k)
                            statistika.push({
                                rank: results.standing[i].ordinal_rank,
                                ime: results.standing[i].first_name + " " + results.standing[i].last_name,
                                won: "Победи: " + results.standing[i].won,
                                lost: "Порази: " + results.standing[i].lost
                            });
                    }
                }
            }).done(function dodadiStatistika() {
                postaviStats();
            });
    };

    //ФУНКЦИЈА ЗА ПРИКАЗ НА ПОДАТОЦИ ОД ВЕБ СЕРВИС
    function postaviStats() {
        var listView = document.getElementById("statsListView").winControl;
        listView.itemTemplate = document.getElementById("statsTemplate");
        listView.layout = new WinJS.UI.ListLayout();
        listView.itemDataSource = new WinJS.Binding.List(statistika).dataSource;
    };

    //===========================================

    var publicMembers = {
        albumArr: albumArr,
        teamsArr: teamsArr,
        igraciArr: igraciArr,
        playArr: groupedItems,
        timovi: timovi,
        duplikatiArr: duplikatiArr,
        tmpZalepi: tmpZalepi,
        tmpDuplikati: tmpDuplikati,
        poslednoZemanje: prethodnoZemal,
        getGrouped: getGrouped,
        getItemsFromTim: getItemsFromTim,
        getDuplicatesFromTim: getDuplicatesFromTim,
        neZalepena: neZalepena,
        saveToLocal: saveToLocal,
        getFromLocal: getFromLocal,
        zemiStats: zemiStats,
        stats: postaviStats,
        getSearchedPlayer: getSearchedPlayer,
        dodadiDuplikat: dodadiDuplikat,
        eliminirajDupli: eliminirajDupli
    };

    WinJS.Namespace.define("Data", publicMembers);
})();
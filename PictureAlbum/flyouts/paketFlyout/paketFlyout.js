/// <reference path="//Microsoft.WinJS.0.6/js/base.js" /> 
/// <reference path="//Microsoft.WinJS.0.6/js/ui.js" /> 
(function () {
    "use strict";

    var publicMembers =
        {
            initialize: initialize,
        };


    function initialize() {
        var btnClick = document.getElementById("btnDodadiSliki");

        var btnSlika1 = document.getElementById("btnSlika1");
        var btnSlika2 = document.getElementById("btnSlika2");
        var btnSlika3 = document.getElementById("btnSlika3");
        var btnSlika4 = document.getElementById("btnSlika4");
        var btnSlika5 = document.getElementById("btnSlika5");

        btnSlika1.addEventListener("click", function (e) {
            if (Data.neZalepena(Data.tmpDuplikati[0])) {  //ПРОВЕРКА ЗА ДАЛИ СЛИКАТА Е ЗАЛЕПЕНА
                Data.tmpZalepi.push(Data.tmpDuplikati[0]);
                Data.tmpDuplikati[0] = null;
                btnSlika1.style.backgroundColor = "blue";
            }
        });

        btnSlika2.addEventListener("click", function (e) {
            if (Data.neZalepena(Data.tmpDuplikati[1])) {
                Data.tmpZalepi.push(Data.tmpDuplikati[1]);
                Data.tmpDuplikati[1] = null;
                btnSlika2.style.backgroundColor = "blue";
            }
        });

        btnSlika3.addEventListener("click", function (e) {
            if (Data.neZalepena(Data.tmpDuplikati[2])) {
                Data.tmpZalepi.push(Data.tmpDuplikati[2]);
                Data.tmpDuplikati[2] = null;
                btnSlika3.style.backgroundColor = "blue";
            }
        });

        btnSlika4.addEventListener("click", function (e) {
            if (Data.neZalepena(Data.tmpDuplikati[3])) {
                Data.tmpZalepi.push(Data.tmpDuplikati[3]);
                Data.tmpDuplikati[3] = null;
                btnSlika4.style.backgroundColor = "blue";
            }
        });

        btnSlika5.addEventListener("click", function (e) {
            if (Data.neZalepena(Data.tmpDuplikati[4])) {
                Data.tmpZalepi.push(Data.tmpDuplikati[4]);
                Data.tmpDuplikati[4] = null;
                btnSlika5.style.backgroundColor = "blue";
            }
        });

        btnClick.addEventListener("click", function (e) {
            var date = new Date();
            var fly = document.getElementById("paketFlyout");
            
            if (Math.abs(date.getHours() - Data.poslednoZemanje.saat) <= 3 || //treba >= za da raboti korektno
                (date.getDay() != Data.poslednoZemanje.den &&
                 date.getMonth() != Data.poslednoZemanje.mesec &&
                 date.getYear() != Data.poslednoZemanje.god)
                ) {

                Data.poslednoZemanje.saat = date.getHours();
                Data.poslednoZemanje.den = date.getDay();
                Data.poslednoZemanje.mesec = date.getMonth();
                Data.poslednoZemanje.god = date.getYear();

                Data.eliminirajDupli();

                Data.tmpZalepi.forEach(function (elem) {
                    if(Data.neZalepena(elem))
                        Data.igraciArr.push(elem);
                });

                Data.tmpDuplikati.forEach(function (item) {
                    if (item !== null)
                        Data.dodadiDuplikat(item);
                });
                
                Data.saveToLocal();

                var msg = new Windows.UI.Popups.MessageDialog("Сликите се залепени!");
                msg.showAsync();

            } else {
                var msg = new Windows.UI.Popups.MessageDialog("Времето за нов пакет сеуште не е дојдено! Пакети може да земате на секои 3 часа.");
                msg.showAsync();
            };
        });
    }



    WinJS.Namespace.define("paketFlyout", publicMembers);
})();
/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 6;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.632976862725501, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5652173913043478, 500, 1500, "logout-0"], "isController": false}, {"data": [0.7183939229517091, 500, 1500, "catalog"], "isController": true}, {"data": [0.6576517150395779, 500, 1500, "book"], "isController": true}, {"data": [0.6658970976253298, 500, 1500, "book-0"], "isController": false}, {"data": [0.444, 500, 1500, "login-1"], "isController": false}, {"data": [0.9155, 500, 1500, "login-0"], "isController": false}, {"data": [0.4295, 500, 1500, "login"], "isController": true}, {"data": [0.877, 500, 1500, "Home-0"], "isController": false}, {"data": [0.7167063020214031, 500, 1500, "Book category"], "isController": true}, {"data": [0.7306777645659929, 500, 1500, "Book category-0"], "isController": false}, {"data": [0.6338546458141674, 500, 1500, "review-1"], "isController": false}, {"data": [0.5635451505016722, 500, 1500, "logout"], "isController": true}, {"data": [0.28835978835978837, 500, 1500, "review-0"], "isController": false}, {"data": [0.19954648526077098, 500, 1500, "review"], "isController": true}, {"data": [0.7319587628865979, 500, 1500, "catalog-0"], "isController": false}, {"data": [0.877, 500, 1500, "Home"], "isController": true}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 12049, 0, 0.0, 1135.8530998423105, 1, 16192, 3031.0, 4032.0, 7620.5, 282.4756769429141, 3566.4868613365957, 121.77513443617396], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["logout-0", 598, 0, 0.0, 979.1036789297663, 2, 3598, 2444.2000000000003, 2807.3499999999995, 3353.05, 16.975133416600432, 115.65967367931758, 12.532422717724536], "isController": false}, {"data": ["catalog", 1843, 0, 0.0, 681.9034183396628, 2, 6541, 1549.800000000001, 2917.199999999999, 4969.799999999997, 44.47715809542196, 579.9432016148008, 12.378896540229746], "isController": true}, {"data": ["book", 1516, 0, 0.0, 919.752638522427, 5, 6729, 2635.5, 3746.0, 5446.719999999994, 38.01785535158993, 719.7290604781072, 10.64033366718076], "isController": true}, {"data": ["book-0", 1516, 0, 0.0, 732.1879947229548, 5, 3551, 1786.8999999999999, 2341.949999999998, 2848.2999999999993, 38.249987384568804, 724.1236316199476, 10.705302147461776], "isController": false}, {"data": ["login-1", 1000, 0, 0.0, 1452.2029999999984, 89, 4686, 3152.9, 3444.7999999999997, 3923.6200000000003, 24.037305898754866, 321.4285446012211, 14.854585566799674], "isController": false}, {"data": ["login-0", 1000, 0, 0.0, 197.59799999999993, 1, 2131, 669.8, 877.7499999999997, 1233.9, 26.182122846520397, 127.25432168665235, 5.906318728072471], "isController": false}, {"data": ["login", 1000, 0, 0.0, 1751.3250000000012, 90, 14197, 3678.3999999999996, 4075.5999999999995, 9674.540000000003, 23.576564894494872, 429.8578775197454, 19.88839811976895], "isController": true}, {"data": ["Home-0", 1000, 0, 0.0, 266.4709999999999, 2, 2149, 786.0, 1147.8999999999999, 1798.2400000000007, 29.192818566632607, 191.32129433659318, 6.442946285213837], "isController": false}, {"data": ["Book category", 1682, 0, 0.0, 709.0065398335322, 1, 8375, 1636.1000000000001, 3150.9499999999994, 5143.220000000005, 41.72454852153205, 397.5606722641521, 7.537254338038302], "isController": true}, {"data": ["Book category-0", 1682, 0, 0.0, 551.3032104637338, 1, 3132, 1371.8000000000002, 1804.8999999999987, 2277.6700000000037, 42.249629499384596, 402.563759270365, 7.632106625681344], "isController": false}, {"data": ["review-1", 1087, 0, 0.0, 785.2005519779214, 3, 3606, 1768.2000000000003, 2189.6, 2950.8399999999992, 29.087503344929086, 553.2522640988761, 9.47615797263848], "isController": false}, {"data": ["logout", 598, 0, 0.0, 1122.6321070234117, 2, 7728, 2815.7000000000003, 3754.25, 5768.0499999999965, 16.02830416253451, 109.20847474805008, 11.833396432496182], "isController": true}, {"data": ["review-0", 1323, 0, 0.0, 2076.2592592592596, 40, 8348, 4128.800000000001, 4843.799999999999, 6118.92, 33.771537970644545, 463.55406429483094, 36.38179542916401], "isController": false}, {"data": ["review", 1323, 0, 0.0, 3322.0922146636426, 59, 16192, 6858.800000000005, 8766.4, 11707.92, 33.36780246664481, 979.4639859296577, 44.87832881976847], "isController": true}, {"data": ["catalog-0", 1843, 0, 0.0, 549.698860553446, 2, 2627, 1332.6000000000008, 1745.1999999999998, 2255.5999999999995, 45.714994418950766, 596.083503542416, 12.723411532618133], "isController": false}, {"data": ["Home", 1000, 0, 0.0, 266.47099999999995, 2, 2149, 786.0, 1147.8999999999999, 1798.2400000000007, 32.176067441037354, 210.87264511406414, 7.101358634447697], "isController": true}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Percentile 1
            case 8:
            // Percentile 2
            case 9:
            // Percentile 3
            case 10:
            // Throughput
            case 11:
            // Kbytes/s
            case 12:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 12049, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

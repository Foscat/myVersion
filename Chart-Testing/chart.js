

//Make a list of companies//
$.getJSON("nasdaq-companies.json", function (json) {

    for (var i = 0; i < json.length; i++) {

        compName = json[i].fields.name;
        compSymbol = json[i].fields.symbol;

        $("#companyName").append("<option value='" + compSymbol + "' value2='" + compName + "'>" + compName + " (" + compSymbol + ")</option>");

    }
});

// Retriving stock data based on selected company

var symbol = "";
var Cname = "";
$("#companyName").change(function () {
    symbol = $(this).children(":selected").attr("value");
    Cname = $(this).children(":selected").attr("value2");
    console.log($(this).children(":selected").attr("value"));
});

$(document).on("click", "#submit", function (e) {
    e.preventDefault();
    stockPriceProcessing(symbol, Cname);
    console.log("submit")
});

var percentChange = 0;
// Using Alpha Advantage API to get stock price information
function stockPriceProcessing(symbol, Cname) {

    var apiKey = "OITK8BXMQAB96E81";

    var companySymbol = symbol;

    var apiUrl2 = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE"

    var queryURL3 = apiUrl2 + "&symbol=" + companySymbol + "&apikey=" + apiKey;

    $.ajax({
        url: queryURL3,
        method: "GET",
    }).then(function (response) {
        console.log(response);
        console.log(response["Global Quote"]["02. open"]);
        $("#stockData").empty();
        $("#stockData").append("<li><p>" + Cname + "</p></li>");
        $("#stockData").append("<li><p> Open Price: $" + response["Global Quote"]["02. open"] + "</p></li>");
        $("#stockData").append("<li><p> High Price: $" + response["Global Quote"]["03. high"] + "</p></li>");
        $("#stockData").append("<li><p> Low Price: $" + response["Global Quote"]["04. low"] + "</p></li>");
        $("#stockData").append("<li><p> Current Price: $" + response["Global Quote"]["05. price"] + "</p></li>");
        $("#stockData").append("<li><p> Latest Trading Day: " + response["Global Quote"]["07. latest trading day"] + "</p></li>");
        $("#stockData").append("<li><p> Previous Close: $" + response["Global Quote"]["08. previous close"] + "</p></li>");
        $("#stockData").append("<li><p> Change: " + response["Global Quote"]["09. change"] + "</p></li>");
        $("#stockData").append("<li><p> Change Percent: " + response["Global Quote"]["10. change percent"] + "</p></li>");
        $("#container").empty();

        //percentChange = parseFloat(response["Global Quote"]["10. change percent"]);
        //percentCheck(percentChange);
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /////daily stock info history
       var apiUrl3 =  "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED"

       var queryURL4 = apiUrl3 + "&symbol=" + companySymbol + "&apikey=" + apiKey;

       $.ajax({
           url: queryURL4,
           method: "GET",
       }).then(function (responseDaily) {

        console.log(responseDaily);
        console.log(responseDaily["Time Series (Daily)"]);
           
        
        var graphfiller = responseDaily["Time Series (Daily)"];
        console.log(graphfiller);
        console.log(graphfiller["2018-05-17"]);
        console.log(graphfiller["2018-05-17"]["1. open"]);
        console.log(graphfiller["2018-05-17"]["2. high"]);
        console.log(graphfiller["2018-05-17"]["3. low"]);
        console.log(graphfiller["2018-05-17"]["4. close"]);
        // ///////////////////////////////////////////////////


        // console.log({graphfiller});

        var graphInfo = {graphfiller};

        console.log(graphInfo);
        
        
            anychart.onDocumentReady(function () {
                
                // set the data
                 table = anychart.data.table();
                table.addData(graphInfo);

                //map the data
                mapping = table.mapAs();
                mapping.addField('open', 1);
                mapping.addField('high', 2);
                mapping.addField('low', 3);
                mapping.addField('close', 4);
                
                var chart = anychart.stock();
            /////////////////////////
                console.log(mapping);
                /////////////////
                // set the series
                var series = chart.plot(0).candlestick(mapping);
                series.name(Cname);
            
                chart.title(companySymbol);
                chart.container('container');
            
                chart.draw();
            });
       })
    


    });
    
};



//
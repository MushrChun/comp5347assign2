var top5Bar;
var singleBarChart;
var singlePieChart;

$.get('whole/findAllArticles', function (data, status) {
    var $parent = $('#articleSelector');
	for (var i in data) {
		var title = data[i].title;
		$parent.append($('<li onclick=getArticleList("' + encodeURI(title) + '")><a>' + title + '</a></li>'));
	}
})

function getArticleList(title) {
    var deTitle = decodeURI(title);

    $.get('single/updateArticle/' + deTitle, function(data, status){

        $('#updatedCount').html('<span class="text-info">Updated Count => </span>' + data.updated);
        $('#singleTitle').html('<span class="text-info">Title => </span>' + deTitle);

        $.get('single/statTotalRevisionOfArticle/' + deTitle, function (data,status) {
            var totalRevisionSingle = data.count;
            $('#singleTotoalRevision').html('<span class="text-info">The total number of revisions => </span>' + data.count);
        })

        $.get('single/findTop5RegUsersRevisedArticle/' + deTitle, function (data,status) {
            $('#topUserSelector').empty();
            if(top5Bar){
                top5Bar.destroy();
            }


            $('#topFiveRegularUser').html('<span class="text-info">Top 5 user and revision number => </span><br>');
            $('#topUserSelector').append($('<li onclick=getTop5UserStat("all","' + title +'")><a> All </a></li>'));
            for (var i=0; i<data.length; i++) {
                var topUser = data[i].user;
                $('#topFiveRegularUser').append(topUser + ' : ' + data[i].count + '</br> ');
                $('#topUserSelector').append($('<li onclick=getTop5UserStat("' + encodeURI(topUser) + '","' + title +'")><a>' + topUser + '</a></li>'));
            }
        })

        $.get('single/statRevByYearByTypeOfArticle/' + deTitle, function (data,status) {
            var adminData = new Array();
            var anonData = new Array();
            var botData = new Array();
            var userData = new Array();

            var year = new Set();

            for(var i in data){
                year.add(data[i].year);
            }
            var yearList = Array.from(year);

            for(var yearIndex in yearList){
                var adminFlag = false;
                var anonFlag = false;
                var botFlag = false;
                var userFlag = false;
                for(var dataIndex in data) {
                    if(data[dataIndex].year == yearList[yearIndex]){
                        switch (data[dataIndex].type){
                            case "administrator":
                                adminData.push(data[dataIndex].count);
                                adminFlag = true;
                                break;
                            case "anonymous":
                                anonData.push(data[dataIndex].count);
                                anonFlag = true;
                                break;
                            case "bot":
                                botData.push(data[dataIndex].count);
                                botFlag = true;
                                break;
                            case "user":
                                userData.push(data[dataIndex].count);
                                userFlag = true;
                                break;
                        }
                    }
                }
                if(adminFlag == false){
                    adminData.push(0);
                }
                if(anonFlag == false){
                    anonData.push(0);
                }
                if(botFlag == false){
                    botData.push(0);
                }
                if(userFlag == false){
                    userData.push(0);
                }
            }

            if(singleBarChart){
                singleBarChart.destroy();
            }

            var sbc = document.getElementById("singleBarChart");
            singleBarChart = new Chart(sbc, {
                type: 'bar',
                data: {
                    labels: yearList.map(String),
                    datasets: [
                        {
                            label: 'Administrator',
                            backgroundColor : "rgba(255, 159, 64, 0.2)",
                            borderColor : "rgba(255, 159, 64, 1)",
                            data : adminData,
                            borderWidth: 1
                        },
                        {
                            label: 'Anonymous',
                            backgroundColor : "rgba(255, 99, 132, 0.2)",
                            borderColor : "rgba(255, 99, 132, 1)",
                            data : anonData,
                            borderWidth: 1
                        },
                        {
                            label: 'Bot',
                            backgroundColor : "rgba(54, 162, 235, 0.2)",
                            borderColor : "rgba(54, 162, 235, 1)",
                            data : botData,
                            borderWidth: 1
                        },
                        {
                            label: 'Regular user',
                            backgroundColor : "rgba(153, 102, 255, 0.2)",
                            borderColor : "rgba(153, 102, 255, 1)",
                            data : userData,
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero:true
                            }
                        }]
                    }
                }
            });
        })


        $.get('single/statRevByTypeOfArticle/' + deTitle, function (data,status) {
            var anonymousDataSingle;
            var botDataSingle;
            var adminDataSingle;
            var userDataSingle;
            for (var i in data) {
                if (data[i].type == "anonymous") {
                    anonymousDataSingle = data[i].count;
                }
                if (data[i].type == "bot") {
                    botDataSingle = data[i].count;
                }
                if (data[i].type == "administrator") {
                    adminDataSingle = data[i].count;
                }
                if (data[i].type == "user") {
                    userDataSingle = data[i].count;
                }
            }

            if(singlePieChart){
                singlePieChart.destroy();
            }
            var spc = document.getElementById("singlePieChart");
            singlePieChart = new Chart(spc, {
                type: 'pie',
                data:
                    {
                        labels: ["Administrator","Anonymous","Bot","Regular user"],
                        datasets:
                            [
                                {
                                    data: [adminDataSingle, anonymousDataSingle, botDataSingle, userDataSingle],
                                    backgroundColor: ["#FF6384","#36A2EB","#FFCE56"],
                                    hoverBackgroundColor: ["#FF6384","#36A2EB","#FFCE56"]
                                }
                            ]
                    },
                options: {
                    tooltips: {
                        callbacks: {
                            label: function(tooltipItem, data) {
                                var allData = data.datasets[tooltipItem.datasetIndex].data;
                                var tooltipLabel = data.labels[tooltipItem.index];
                                var tooltipData = allData[tooltipItem.index];
                                var total = 0;
                                for (var i in allData) {
                                    total += allData[i];
                                }
                                var tooltipPercentage = Math.round((tooltipData / total) * 1000);
                                return tooltipLabel + ': ' + tooltipData + ' (' + tooltipPercentage/10 + '%)';
                            }
                        }
                    }
                }

            })

        })

    })



}

function randomBackgroundColorGenerator(i) {
    var backgroundColor = [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
    ];
    return backgroundColor[i];
};

function randomBorderColorColorGenerator(i) {
    var  borderColor = [
        'rgba(255,99,132,1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
    ];
    return borderColor[i];
};



function getTop5UserStat(topUser, title) {
    var deTitle = decodeURI(title);
    var deTopUser = decodeURI(topUser);
    if(topUser=='all'){
        $.get('single/statTop5RegUsersRevisedArticle/' + deTitle, function (dataX, status){

            var dataSet = [];
            dataX.dataSet.forEach(function(entry, index){
                var obj = {};
                obj.label = entry.name;
                obj.data = entry.data;
                obj.backgroundColor = randomBackgroundColorGenerator(index);
                obj.borderColor = randomBorderColorColorGenerator(index);
                obj.borderWidth = 1;
                dataSet.push(obj);
            });

            var yearSet = dataX.yearList;
            var sortedSet = yearSet.sort();

            var t5b = document.getElementById("top5Bar");
            if(top5Bar){
                top5Bar.destroy();
            }
            top5Bar = new Chart(t5b, {
                type: 'bar',
                data: {
                    labels: dataX.yearList.map(String),
                    datasets: dataSet
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero:true
                            }
                        }]
                    }
                }
            })
        })
    }else{
        $.get('single/statRevByYearByUserOfArticle/' + deTopUser + '/' + deTitle, function (dataX, status) {

            var singleYearList = new Array();
            var userYearlyRevision = new Array();

            for (var i in dataX) {
                singleYearList.push(dataX[i].year);
                userYearlyRevision.push(dataX[i].count);
            }

            var t5b = document.getElementById("top5Bar");
            if(top5Bar){
                top5Bar.destroy();
            }
            top5Bar = new Chart(t5b, {
                type: 'bar',
                data: {
                    labels: singleYearList.map(String),
                    datasets: [
                        {
                            label: deTopUser,
                            backgroundColor : "rgba(255, 159, 64, 0.2)",
                            borderColor : "rgba(255, 159, 64, 1)",
                            data : userYearlyRevision,
                            borderWidth: 1
                        },

                    ]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero:true
                            }
                        }]
                    }
                }
            })
        })

    }


}


$.get('whole/findMostRevisedArticle', function(data, status){
    var mostRevised = data.title;
    var mostRevisedCount = data.count;
    $('#mostRevision').append(mostRevised);
})

$.get('whole/findLeastRevisedArticle', function(data, status){
    var leastRevised = data.title;
    var leastRevisedCount = data.count;
    $('#leastRevision').append(leastRevised);
})

$.get('whole/findMostPopularArticle', function(data, status){
    var mostPopular = data.title;
    var mostPopularCount = data.count;
    $('#mostPopular').append(mostPopular);
})

$.get('whole/findLeastPopularArticle', function (data, status) {
	var leastPopular = data.title;
	var leastPopularCount = data.count;
	$('#leastPopular').append(leastPopular);
})

$.get('whole/findLongestHistoryArticle', function (data, status) {
	var longestHistory = data.title;
	var longestHistoryCount = data.count;
	$('#longHistory').append(longestHistory);
})

$.get('whole/findLeastHistoryArticle', function (data, status) {
	var shortestHistory = data.title;
	var shortestHistoryCount = data.count;
	$('#shortestHistory').append(shortestHistory);
})

$.get('whole/statRevByYearByType', function (data, status) {
	var adminData = new Array();
	var anonymousData = new Array();
	var botData = new Array();
	var userData = new Array();
	var allYearList = new Set();
	var adminTotal = 0;
	var anonymousTotal = 0;
	var botTotal = 0;
	var userTotal = 0;
	for (var i=0; i<data.length; i++) {
		allYearList.add(data[i].year);
		if (data[i].type == "administrator") {
			adminData.push(data[i].count);
			adminTotal += data[i].count;
		}
		if (data[i].type == "anonymous") {
			anonymousData.push(data[i].count);
			anonymousTotal += data[i].count;
		}
		if (data[i].type == "bot") {
			botData.push(data[i].count);
			botTotal += data[i].count;
		}
		if (data[i].type == "user") {
			userData.push(data[i].count);
			userTotal += data[i].count;
		}
	}

    var yearList = Array.from(allYearList);

    var wbc = document.getElementById("wholeBarChart");
    var wholeBarChart = new Chart(wbc, {
        type: 'bar',
        data: {
            labels: yearList.map(String),
            datasets: [
                {
                    label: 'Administrator',
                    backgroundColor : "rgba(255, 159, 64, 0.2)",
                    borderColor : "rgba(255, 159, 64, 1)",
                    data : adminData,
                    borderWidth: 1
                },
                {
                    label: 'Anonymous',
                    backgroundColor : "rgba(255, 99, 132, 0.2)",
                    borderColor : "rgba(255, 99, 132, 1)",
                    data : anonymousData,
                    borderWidth: 1
                },
                {
                    label: 'Bot',
                    backgroundColor : "rgba(54, 162, 235, 0.2)",
                    borderColor : "rgba(54, 162, 235, 1)",
                    data : botData,
                    borderWidth: 1
                },
                {
                    label: 'Regular user',
                    backgroundColor : "rgba(153, 102, 255, 0.2)",
                    borderColor : "rgba(153, 102, 255, 1)",
                    data : userData,
                    borderWidth: 1
                }
            ]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    });


    var wpc = document.getElementById("wholePieChart");
    var wholePieChart = new Chart(wpc, {
        type: 'pie',
        data:
            {
                labels: ["Administrator","Anonymous","Bot","Regular user"],
                datasets:
                    [
                        {
                            data: [adminTotal, anonymousTotal, botTotal, userTotal],
                            backgroundColor: ["#FF6384","#36A2EB","#FFCE56"],
                            hoverBackgroundColor: ["#FF6384","#36A2EB","#FFCE56"]
                        }
                    ]
            },
        options: {
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        var allData = data.datasets[tooltipItem.datasetIndex].data;
                        var tooltipLabel = data.labels[tooltipItem.index];
                        var tooltipData = allData[tooltipItem.index];
                        var total = 0;
                        for (var i in allData) {
                            total += allData[i];
                        }
                        var tooltipPercentage = Math.round((tooltipData / total) * 1000);
                        return tooltipLabel + ': ' + tooltipData + ' (' + tooltipPercentage/10 + '%)';
                    }
                }
            }
        }

    });

})













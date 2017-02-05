Highcharts.chart('container', {
    chart: {
        type: 'spline',
        animation: Highcharts.svg, // don't animate in old IE
        marginRight: 10,
        events: {
            load: function () {
            }
        }
    },
    title: {
        text: 'RSSI data comparison'
    },
    xAxis: {
        type: 'datetime',
        tickPixelInterval: 150
    },
    yAxis: {
        title: {
            text: 'RSSI'
        },
        plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
        }]
    },
    tooltip: {
        formatter: function () {
            return '<b>' + this.series.name + '</b><br/>' +
                Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                Highcharts.numberFormat(this.y, 2);
        }
    },
    legend: {
        enabled: true
    },
    exporting: {
        enabled: false
    },
    series: [{
        name: 'Filtered RSSI data',
        data: (function () {
            // generate an array of random data
            var data = [],
                time = (new Date()).getTime(),
                i;

            for (i = -10; i <= 0; i += 1) {
                data.push({
                    x: time + i * 1000,
                    y: Math.random() * -(30) - 30
                });
            }
            return data;
        }())
    },
    {
        name: 'Raw RSSI data',
        data: (function () {
            // generate an array of random data
            var data = [],
                time = (new Date()).getTime(),
                i;

            for (i = -10; i <= 0; i += 1) {
                data.push({
                    x: time + i * 1000,
                    y: Math.random() * -(30) - 30
                });
            }
            return data;
        }())
    }]
});

var ws = new WebSocket("ws://" + window.location.hostname + ":8080");
var firstUser = null;
ws.onmessage = function (message) {

    try {
        var payload = JSON.parse(message.data);
        i++;

        if (firstUser == null) {
            firstUser = payload.user;
        }

        if (i > 20) {
            payload.beacons.forEach(function (beacon) {
                switch (beacon.Minor) {
                    case 101:
                        if (payload.user === firstUser) {
                            Highcharts.charts[0].series[0].addPoint([(new Date().getTime()), beacon.SignalPower], true, true)
                            Highcharts.charts[0].series[1].addPoint([(new Date().getTime()), beacon.RawSignalPower], true, true)
                            console.log(firstUser);
                        }
                        break;
                }
            });

            i = 0;
        }
    } catch (e) {
        console.log('malformed message' + message.data);
    }
}
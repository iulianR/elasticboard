var API_BASE = 'http://' + window.location.hostname + ':5000/';

function logFailure(fail) {
    console.log("Trouble getting data. API server down?");
    console.log(fail);
}

function makeLink(url, text) {
    var link = $('<a />', {
        href: url,
        text: text,
    });
    return $('<div />').append(link).html();
}

function makeList(container, options) {
    $.getJSON(API_BASE + options.endpoint)
        .done(function (json) {
            $container = $(container);
            $container.append($('<h3 />').text(options.title).addClass('text-center'));
            $list = $('<ul />');

            data = json.data;
            data.forEach(function (e) {
                $item = $('<li />');
                if (typeof options.keyName === 'function') {
                    $item.html(options.keyName(e));
                } else {
                    $item.html(e[options.keyName]);
                }
                $list.append($item);
            });
            $container.append($list);
        })
        .fail(logFailure);
}

function makeXYGraph(container, options) {
    $.getJSON(API_BASE + options.endpoint)
        .done(function (json) {
            data = json.data;
            $(container).highcharts({
                chart: {
                    type: options.type
                },
                title: {
                    text: options.title
                },
                subtitle: {
                    text: options.subtitle
                },
                xAxis: {
                    categories: data.map(function (e) {
                        if (typeof options.keyName === 'function') {
                            return options.keyName(e);
                        }
                        return e[options.keyName];
                    })
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: options.yTitle
                    }
                },
                legend: {
                    enabled: false
                },
                series: [{
                    name: options.label,
                    data: data.map(function (e) {
                        if (typeof options.valueName === 'function') {
                            return options.valueName(e);
                        }
                        return e[options.valueName];
                    })
                }]
            });
        })
        .fail(logFailure);
}

// first row
makeXYGraph('#most-active-people', {
    endpoint: 'gabrielfalcao/lettuce/most_active_people',
    type: 'bar',
    title: "Most active people",
    keyName: function (e) {
        return makeLink("http://github.com/" + e.term, e.term);
    },
    valueName: 'count',
    yTitle: 'Events',
    label: 'events'
});
makeXYGraph('#total-events-monthly', {
    endpoint: 'gabrielfalcao/lettuce/total_events_monthly',
    type: 'area',
    title: "Activity",
    subtitle: "Total monthly events",
    keyName: 'month',
    valueName: 'value',
    yTitle: 'Events',
    label: 'events'
});

// second row
makeXYGraph('#most-active-issues', {
    endpoint: 'gabrielfalcao/lettuce/most_active_issues',
    type: 'bar',
    title: "Most active issues",
    keyName: function (e) {
        return makeLink("http://github.com/gabrielfalcao/lettuce/issues/" + e.term,
                        "#" + e.term);
    },
    valueName: 'count',
    yTitle: 'Events',
    label: 'events'
});

makeList('#open-issues', {
    endpoint: 'gabrielfalcao/lettuce/open_issues',
    title: "Open issues",
    keyName: function (e) {
        return makeLink("http://github.com/gabrielfalcao/lettuce/issues/" + e,
                        "#" + e);
    }
});


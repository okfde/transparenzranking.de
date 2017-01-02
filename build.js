var yaml = require('js-yaml');
var tabletop = require('tabletop');
var jsonfile = require('jsonfile');
var fs = require('fs');
var urlify = require('urlify').create({
    addEToUmlauts:true,
    szToSs:true,
    spaces:"_",
    nonPrintable:"_",
    trim:true
});
var colors = ['#ffcb64', '#ff7c7c', ' #ff639c', '#d3b4ff', '#83eeff', '#6ddecb'];

var layput = "state";

function loadData() {
    return new Promise(function(resolve, reject) {
        var spreadsheet = "https://docs.google.com/spreadsheets/d/10QpOTuLp01kl2Dev8ueblqCUFK8GAJD0UJXV6rBhjeo/pubhtml";

        tabletop.init({
            key: spreadsheet,
            parseNumbers: true,
            callback: function(result) {
                var indexdata = {data:{},names:{}};
                for (var key in result) {
                    if (!result.hasOwnProperty(key)) continue;
                    var district = result[key];
                    var categories = district.elements.reduce(function(prev, curr) {
                        var category = curr['kategorie'].trim();
                        console.log(category);
                        if (!prev[category]) {
                            prev[category] = {};
                        }
                        prev[category][curr['bezeichnung']] = curr;
                        return prev;
                    }, {});
                    indexdata.data[key] = categories;
                    indexdata.names = Object.keys(categories);
                }
                resolve(result)
            }
        });
    })
}

function writeJekyllMarkdown(file, data) {
    data.layout = layput;
    var ymldata = yaml.dump(data);
    var result = "---\n" + ymldata + "\n---\n";
    fs.writeFile(file, result, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });
}

loadData()
    .then(function(data) {
        var states = {};
        for (var state_name in data) {
            var state = {}
            var indicatordata = data[state_name].elements;
            //console.log(indicatordata);
            var categories = indicatordata.reduce((prev,elem) => {
                if (prev.indexOf(elem.kategorie) < 0) {
                    prev.push(elem.kategorie)
                }
                return prev;
            }, []);
            categories = categories.map((indicatorname, index) => {
                var indicators = indicatordata.filter((item) => {
                   return item.kategorie === indicatorname
                });
                var maxpoints = indicators.reduce((prev, indicator) => {
                    return prev + indicator.maximalpunkte
                }, 0);
                var points = indicators.reduce((prev, indicator) => {
                    return prev + indicator.erreichte_punkte
                }, 0);
                return {
                    name: indicatorname,
                    indicators: indicators,
                    color: colors[index],
                    punkte: points,
                    maximalpunkte: maxpoints }
            });

            state.name = state_name;
            state.link = urlify(state_name.toLowerCase());
            state.categories = categories;
            states[state_name] = state;
            writeJekyllMarkdown('_states/'+ state.link +'.md', state);
        }
        var overview = [];
        for (var state_name in states) {
            var state = states[state_name];
            var categories = state.categories.map((category) => {
                var sum_points = category.indicators.reduce((prev, indicator) => {
                    return prev + indicator.erreichte_punkte;
                }, 0);

                var sum_max = category.indicators.reduce((prev, indicator) => {
                    return prev + indicator.maximalpunkte;
                }, 0);

                return {name:category.name, points:sum_points, maxpoints:sum_max}
            });
            overview.push({name: state.name, scoring: categories})
        }
        //console.log(overview);
        jsonfile.writeFile('static/js/overview.json', overview, function (err) {
            console.error(err)
        })
    })
    .catch(console.log);

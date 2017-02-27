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
var _ = require('lodash');

var colors = ['#ffcb64', '#ff7c7c', ' #ff639c', '#d3b4ff', '#83eeff', '#6ddecb'];

var layput = "state";

// getOverview(function(err, data) {
//     jsonfile.writeFile('static/js/data/overview.json', data, function(err) {
//         console.log('overview.json written')
//     })
// });

// function getState(state, cb) {
//     load(function(err, data) {
//         if (data[state]) {
//             var state_data = _.groupBy(data[state].elements, 'kategorie');
//             states[state] = state_data;
//             cb(null, state_data);
//         } else {
//             cb(new Error("unknown key for state"), null)
//         }
//
//     })
// }

tabletop.init({
    key: 'https://docs.google.com/spreadsheets/d/10QpOTuLp01kl2Dev8ueblqCUFK8GAJD0UJXV6rBhjeo/pubhtml',
    parseNumbers: true,
    callback: function (tabletop_data, tabletop) {
        var data = tabletop_data;
        writeOverview(data);
        writeStates(data);
        writeKeys(data);
        writeCategoryNames(data);
    }
});


function writeOverview(data) {

    var cat_state_elements = _.reduce(data, function(prev, state) {
        var categories = _.chain(state.elements)
            .groupBy('kategorie')
            .map(function (cat) {
                return {
                    category: _.first(cat)['kategorie'],
                    max: _.reduce(cat, function(prev, cat_elem) { return prev + cat_elem['maximalpunkte'] }, 0),
                    value: _.reduce(cat, function(prev, cat_elem) { return prev + cat_elem['erreichte_punkte']}, 0),
                    state: state.name
                }

            })
            .value();
        return prev.concat(categories)
    }, []);

    var overview = _.chain(cat_state_elements)
        .groupBy('category')
        .map(function(category) {
            return {
                name: _.first(category)['category'],
                max: _.first(category)['max'],
                entries: _.reduce(category, function(prev, elem) {
                    prev[elem.state] = elem.value;
                    return prev;
                }, {})

            }
        })
        .value();
    jsonfile.writeFile('static/js/data/overview.json', overview, function(err) {
        console.log('overview.json written')
    })
}

function writeStates(data) {
    for (var state in data) {
        var state_data = _.groupBy(data[state].elements, 'kategorie');
        jsonfile.writeFile('static/js/data/states/' + state + '.json', state_data, function(err) {
           console.log('written' + state)
        });
    }
}

function writeKeys(data) {
    jsonfile.writeFile('static/js/data/keys.json', Object.keys(data), function(err) {
        console.log('written keys')
    });
}

function writeCategoryNames(data) {
    var result = _.reduce(data, function (prev, state) {
        _.reduce(state.elements, function (prev_inner, indicator) {
            if (prev.indexOf(indicator.kategorie) < 0) {
                prev.push(indicator.kategorie)
            }
        });
        return prev;
    }, []);
    jsonfile.writeFile('static/js/data/categoryNames.json', result, function(err) {
        console.log('category names written')
    })
}


// function loadData() {
//     return new Promise(function(resolve, reject) {
//         var spreadsheet = "https://docs.google.com/spreadsheets/d/10QpOTuLp01kl2Dev8ueblqCUFK8GAJD0UJXV6rBhjeo/pubhtml";
//
//         tabletop.init({
//             key: spreadsheet,
//             parseNumbers: true,
//             callback: function(result) {
//                 var indexdata = {data:{},names:{}};
//                 for (var key in result) {
//                     if (!result.hasOwnProperty(key)) continue;
//                     var district = result[key];
//                     var categories = district.elements.reduce(function(prev, curr) {
//                         var category = curr['kategorie'].trim();
//                         console.log(category);
//                         if (!prev[category]) {
//                             prev[category] = {};
//                         }
//                         prev[category][curr['bezeichnung']] = curr;
//                         return prev;
//                     }, {});
//                     indexdata.data[key] = categories;
//                     indexdata.names = Object.keys(categories);
//                 }
//                 resolve(result)
//             }
//         });
//     })
// }
//
// function writeJekyllMarkdown(file, data) {
//     data.layout = layput;
//     var ymldata = yaml.dump(data);
//     var result = "---\n" + ymldata + "\n---\n";
//     fs.writeFile(file, result, function(err) {
//         if(err) {
//             return console.log(err);
//         }
//         console.log("The file was saved!");
//     });
// }
//
// loadData()
//     .then(function(data) {
//         var states = {};
//         for (var state_name in data) {
//             var state = {}
//             var indicatordata = data[state_name].elements;
//             //console.log(indicatordata);
//             var categories = indicatordata.reduce((prev,elem) => {
//                 if (prev.indexOf(elem.kategorie) < 0) {
//                     prev.push(elem.kategorie)
//                 }
//                 return prev;
//             }, []);
//             categories = categories.map((indicatorname, index) => {
//                 var indicators = indicatordata.filter((item) => {
//                    return item.kategorie === indicatorname
//                 });
//                 var maxpoints = indicators.reduce((prev, indicator) => {
//                     return prev + indicator.maximalpunkte
//                 }, 0);
//                 var points = indicators.reduce((prev, indicator) => {
//                     return prev + indicator.erreichte_punkte
//                 }, 0);
//                 return {
//                     name: indicatorname,
//                     indicators: indicators,
//                     color: colors[index],
//                     punkte: points,
//                     maximalpunkte: maxpoints }
//             });
//
//             state.name = state_name;
//             state.link = urlify(state_name.toLowerCase());
//             state.categories = categories;
//             states[state_name] = state;
//             writeJekyllMarkdown('_states/'+ state.link +'.md', state);
//         }
//         var overview = [];
//         for (var state_name in states) {
//             var state = states[state_name];
//             var categories = state.categories.map((category) => {
//                 var sum_points = category.indicators.reduce((prev, indicator) => {
//                     return prev + indicator.erreichte_punkte;
//                 }, 0);
//
//                 var sum_max = category.indicators.reduce((prev, indicator) => {
//                     return prev + indicator.maximalpunkte;
//                 }, 0);
//
//                 return {name:category.name.trim(), points:sum_points, maxpoints:sum_max}
//             });
//             overview.push({name: state.name, scoring: categories})
//         }
//         //console.log(overview);
//         jsonfile.writeFile('static/js/overview.json', overview, function (err) {
//             console.error(err)
//         })
//     })
//     .catch(console.log);

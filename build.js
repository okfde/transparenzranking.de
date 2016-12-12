var yaml = require('write-yaml');
var tabletop = require('tabletop');
var jsonfile = require('jsonfile');


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

loadData()
    .then(function(data) {
        var states = {};
        for (var state_name in data) {
            var state = data[state_name];
            state = state.elements.reduce((prev, elem) => {
                if (elem.kategorie) {
                    if (!prev[elem.kategorie])
                        prev[elem.kategorie] = [];
                    prev[elem.kategorie].push(elem);
                }
                else {
                    console.log('error!!!');
                    console.log(elem);
                }
                return prev;
            }, {});
            states[state_name] = state;
            yaml('_data/'+ state_name +'.yml', state, function(err) {
                if (err) console.log(err);
            }); console.log(states);
        }
        var overview = {};
        for (var state_name in states) {
            var state = states[state_name];
            for (var cat in state) {
                var trimmed_cat = cat.trim();
                if (!overview[trimmed_cat])
                    overview[trimmed_cat] = {};
                overview[trimmed_cat][state_name] = state[cat].reduce(function(prev, elem) {
                    return {
                        points: prev.points + parseInt(elem.erreichte_punkte),
                        max: prev.max + parseInt(elem.maximalpunkte)
                    };
                }, {points: 0, max: 0})
            }
            //states[state_name] = state;
        }
        console.log(overview);
        jsonfile.writeFile('static/js/overview.json', overview, function (err) {
            console.error(err)
        })
    })
    .catch(console.log);

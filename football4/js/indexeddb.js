function cekData(storeName, id) {
    return new Promise(function (resolve, reject) {
        databasePromise(idb)
            .then(function (db) {
                var tx = db.transaction(storeName, "readonly");
                var store = tx.objectStore(storeName);
                return store.get(id);
            })
            .then(function (data) {
                if (data != undefined) {
                    resolve("favorited")
                } else {
                    reject("not favorit")
                }
            });
    });
}


function deleteDatafav(storeName, data) {
    databasePromise(idb).then(function (db) {
        var tx = db.transaction(storeName, 'readwrite');
        var store = tx.objectStore(storeName);
        //console.log("deleteDataPlayerfav: cek id= " + data);
        store.delete(data);
        return tx.complete;
    }).then(function () {
        console.log('Item deleted');
        document.getElementById("iconFav").innerHTML = "favorite_border";
        M.toast({
            html: 'Data has been successfully deleted!'
        });
    }).catch(function () {
        M.toast({
            html: 'error'
        });
    });
}

function createDataFav(dataType, data) {
    var storeName = "";
    var dataToCreate = {}
     if (dataType == "team") {
        storeName = "favorite_team"
        dataToCreate = {
            id: data.id,
            name: data.name,
            shortName: data.shortName,
            tla: data.tla,
            crestUrl: data.crestUrl,
            address: data.address,
            phone: data.phone,
            website: data.website,
            email: data.email,
            founded: data.founded,
            clubColors: data.clubColors,
            venue: data.venue,
            squad: data.squad
        }
    } else if (dataType == "match") {
        storeName = "favorite_match"
        dataToCreate = {
            id: data.match.id,
            head2head: {
                numberOfMatches: data.head2head.numberOfMatches,
                totalGoals: data.head2head.totalGoals,
                homeTeam: {
                    wins: data.head2head.homeTeam.wins,
                    draws: data.head2head.homeTeam.draws,
                    losses: data.head2head.homeTeam.losses
                },
                awayTeam: {
                    wins: data.head2head.awayTeam.wins,
                    draws: data.head2head.awayTeam.draws,
                    losses: data.head2head.awayTeam.losses
                }
            },
            match: {
                utcDate: data.match.utcDate,
                venue: data.match.venue,
                matchday: data.match.matchday,
                homeTeam: {
                    name: data.match.homeTeam.name
                },
                awayTeam: {
                    name: data.match.awayTeam.name
                }
            }
        }
    }

    console.log("data " + dataToCreate);
    databasePromise(idb).then(db => {
        const tx = db.transaction(storeName, 'readwrite');
        tx.objectStore(storeName).put(dataToCreate);

        return tx.complete;
    }).then(function () {
        console.log('Team Saved.');
        document.getElementById("iconFav").innerHTML = "favorite";
        M.toast({
            html: 'Data Liked'
        });
    }).catch(function () {
        M.toast({
            html: 'error'
        });
    });

}

function getSavedDataById(dataType) {
    // Ambil nilai query parameter (?id=)
    var urlParams = new URLSearchParams(window.location.search);
    var idParam = Number(urlParams.get("id"));

    if (dataType == "team") {
        var dataSquadHTML = ''
        var tabelSquadHTML = ''
        getDataById("favorite_team", idParam).then(function (tim) {
            // Objek JavaScript dari response.json() masuk lewat variabel data.
            console.dir("getTeamSavedById: " + tim);
            // Menyusun komponen card artikel secara dinamis
            resultPlayerDetailJSON(tim)
            dataTeamJSON = tim;
            tim.squad.forEach(function (squad) {
                dataSquadJSON = squad;
                console.log("getTeamSavedById cek squad name: " + squad.name);
                console.log("getTeamSavedById cek squad position: " + squad.position);
                dataSquadHTML += `
         <tr>
           <td >
           <a href="./playerdetail.html?id=${squad.id}"> ${squad.name}</a>
           </td>
           <td >${squad.position}</td>
         </tr>
        `
            });
            tabelSquadHTML += `<table> <tbody> ${dataSquadHTML}  </tbody> </table>`

            document.getElementById("squad").innerHTML = tabelSquadHTML;
        })
    
    } else if (dataType == "match") {
        getDataById("favorite_match", idParam).then(function (match) {
            resultMatchDetailJSON(match);
        });
    }
}

function getDataById(storeName, id) {
    return new Promise(function (resolve, reject) {
        databasePromise(idb)
            .then(function (db) {
                var tx = db.transaction(storeName, "readonly");
                var store = tx.objectStore(storeName);
                return store.get(id);
            })
            .then(function (data) {
                resolve(data);
            });
    });
}

function getAllData(storeName) {
    return new Promise(function (resolve, reject) {
        databasePromise(idb)
            .then(function (db) {
                var tx = db.transaction(storeName, "readonly");
                var store = tx.objectStore(storeName);
                return store.getAll();
            })
            .then(function (data) {
                resolve(data);
            });
    });
}

function setupDataFavHtml(dataType) {

    if (dataType == "team") {
        getAllData("favorite_team").then(function (data) {
            resultTeamFav(data);
        });
    } else if (dataType == "match") {
        getAllData("favorite_match").then(function (data) {
            resultMatchFav(data);
        });
    }
}
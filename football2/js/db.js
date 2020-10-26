
  var dbPromised = idb.open('football', 1, upgradeDb => {
    switch (upgradeDb.oldVersion) {
      case 0:
        upgradeDb.createObjectStore('matches', { 'keyPath': 'id' })
        upgradeDb.createObjectStore('teams', { 'keyPath': 'id' })
    }
  });

  

  var insertMatch = (match) => {
    dbPromised.then(db => {
      var tx = db.transaction('matches', 'readwrite');
      var store = tx.objectStore('matches')
      store.put(match)
      return tx.complete;
    }).then(() => {
      M.toast({ html: `Pertandingan ${match.homeTeam.name} VS ${match.awayTeam.name}\nberhasil disimpan!` })
      console.log('Pertandingan berhasil disimpan');
    }).catch(err => {
      console.error('Pertandingan gagal disimpan', err);
    });
  }
  
  var deleteMatch = (matchId) => {
    dbPromised.then(db => {
      var tx = db.transaction('matches', 'readwrite');
      var store = tx.objectStore('matches');
      store.delete(matchId);
      return tx.complete;
    }).then(() => {
      M.toast({ html: 'Match has been deleted!' });
      SaveMatch();
    }).catch(err => {
      console.error('Error: ', err);
    });
  }
    

  var getSaveMatch = () => {
    return dbPromised.then(db => {
      var tx = db.transaction('matches', 'readonly');
      var store = tx.objectStore('matches');
      return store.getAll();
    })
  }


  var insertTeam = (team) => {
    dbPromised.then(db => {
      var tx = db.transaction('teams', 'readwrite');
      var store = tx.objectStore('teams')
      team.createdAt = new Date().getTime()
      store.put(team)
      return tx.complete;
    }).then(() => {
      M.toast({ html: `${team.name} berhasil disimpan!` })
      console.log('Pertandingan berhasil disimpan');
    }).catch(err => {
      console.error('Pertandingan gagal disimpan', err);
    });
  }

  
var deleteTeam = (teamId) => {
  dbPromised.then(db => {
    var tx = db.transaction('teams', 'readwrite');
    var store = tx.objectStore('teams');
    store.delete(teamId);
    return tx.complete;
  }).then(() => {
    M.toast({ html: 'Team has been deleted!' });
    SaveTeams();
  }).catch(err => {
    console.error('Error: ', err);
  });
}

var getSaveTeams = () => {
  return dbPromised.then(db => {
    var tx = db.transaction('teams', 'readonly');
    var store = tx.objectStore('teams');
    return store.getAll();
  })
}
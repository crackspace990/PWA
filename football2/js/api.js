var DataMatch;
var DataTeam;
const base_url = "https://api.football-data.org/v2/";
const api_token = "25bd498e31be4b30814ac795ba3dd267"
const code_league = 2001 //champion league team_ep = `${base_url}teams/`;
const standing_ep = `${base_url}competitions/${code_league}/standings?standingType=TOTAL` ;
const team_ep = `${base_url}teams/`;
const player_ep = `${base_url}players/` ;
const match_detail_ep = `${base_url}competitions/${code_league}/matches?status=SCHEDULED`;
const match_ep = `${base_url}matches/`;

const fetchApi = url => {
  return fetch(url, {
    headers: {
     'X-Auth_Token' : api_token
    }
  });
}

// Blok kode yang akan di panggil jika fetch berhasil
function status(response) {
  if (response.status !== 200) {
    console.log("Error : " + response.status);
    // Method reject() akan membuat blok catch terpanggil
    return Promise.reject(new Error(response.statusText));
  } else {
    // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
    return Promise.resolve(response);
  }
}

// Blok kode untuk memparsing json menjadi array JavaScript
function json(response) {
  return response.json();
}

// Blok kode untuk meng-handle kesalahan di blok catch
function error(error) {
  // Parameter error berasal dari Promise.reject()
  console.log("Error : " + error);
}

// Blok kode untuk melakukan request data json

var getStandings = () => {
  if ('caches' in window) {
    caches.match(standing_ep).then(function (response) {
        if (response) {
            response.json().then(function (data) {
                Standings(data);
            });
        }
    });
}
  return fetchApi(standing_ep)
    .then(status)
    .then(json)
}

const Standings =()=> {
  var standings = getStandings()
  standings.then(data => {
    var str = JSON.stringify(data).replace(/http:/g, 'https:');
    data = JSON.parse(str);
    var html = ''
    data.standings.forEach(standing => {
      var detail = ''
      standing.table.forEach(result => {
        detail += `
            <tr>
            <td>${result.position}</td>
            <td><img class="responsive-img" width="24" height="24" src="${ result.team.crestUrl.replace(/^http:\/\//i, 'https://') || 'img/empty_badge.svg'}"> </td>
            <td>${result.team.name}</td>
            <td>${result.playedGames}</td>
            <td>${result.won}</td>
            <td>${result.draw}</td>
            <td>${result.lost}</td>
            <td>${result.points}</td>
          </tr>
          `;
      })

      html += `
        <div class="card">
        <div class="card-content">
        <h5 class="header">${standing.group}</h5>
        <table>
        <thead>
          <tr>
            <th>Position</th>
            <th>Team</th>
            <th>Name</th>
            <th>Played</th>
            <th>Won</th>
            <th>Draw</th>
            <th>Lost</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>` + detail + `</tbody>
        </table>
        </div>
        </div>
        </div>
      `
    });
    document.getElementById("articles").innerHTML = html;
})

}

var getMatches = () => {

  if ('caches' in window) {
    caches.match(match_ep).then(function (response) {
        if (response) {
            response.json().then(function (data) {
                Matches(data);
            });
        }
    });
}
  return fetchApi(match_ep)
    .then(status)
    .then(json);
}
var Matches = () => {

  var matches = getMatches()
  matches.then(data => {
    DataMatch = data;
    var str = JSON.stringify(data).replace(/http:/g, 'https:');
    data = JSON.parse(str);

    var html = ''
    data.matches.forEach(match => {
    
      html += `
            <div class="card">
              <div class="card-content card-match">
                <div class="col s10">${match.homeTeam.name}</div>
                <div class="col s2">${match.score.fullTime.homeTeam}</div>
                <div class="col s10">${match.awayTeam.name}</div>
                <div class="col s2">${match.score.fullTime.awayTeam}</div>
              </div>
              <div class="card-action right-align">
              <a class="waves-effect waves-light btn-small" onclick="insertMatchListener(${match.id})">SAVE MATCH</a>
              </div>
            </div>
          </div>
            `
    });
    document.getElementById("articles2").innerHTML = html;
  })
}


var getTeams = () => {
  if ('caches' in window) {
    caches.match(team_ep).then(function (response) {
        if (response) {
            response.json().then(function (data) {
                Teams(data);
            });
        }
    });
}
  return fetchApi(team_ep)
    .then(status)
    .then(json);
}
  
var Teams = () => {
  
  var teams = getTeams()

  teams.then(data => {
    DataTeam = data;
    var str = JSON.stringify(data).replace(/http:/g, 'https:');
    data = JSON.parse(str);
   
    var html = ''
    
    data.teams.forEach(team => {
      
      html += `
        <div class="card">
          <div class="card-content">
            <div class="center"><img width="64" height="64" src="${team.crestUrl}"></div>
            <div class="center flow-text">${team.name}</div>
            <div class="center">${team.area.name}</div>
          </div>
          <div class="card-action right-align">
              <a class="waves-effect waves-light btn-small green" onclick="insertTeamListener(${team.id})">SAVE TEAMS</a>
          </div>
        </div>
      </div>
    `
    });
    document.getElementById("articles3").innerHTML = html;
  })
}


var SaveMatch = () => {
  var matches = getSaveMatch() 
    matches.then(data => {
    var html = ''
    data.forEach(match => {
      html += `
            <div class="card">
              <div class="card-content card-match">
                <div class="col s10">${match.homeTeam.name}</div>
                <div class="col s2">${match.score.fullTime.homeTeam}</div>
                <div class="col s10">${match.awayTeam.name}</div>
                <div class="col s2">${match.score.fullTime.awayTeam}</div>
              </div>
              <div class="card-action right-align">
              <a class="waves-effect waves-light btn-small" onclick="deleteMatchListener(${match.id})">Delete</a>
              </div>
            </div>
          </div>
            `
    });
    document.getElementById("save-match").innerHTML = html;
  })
}

var insertMatchListener = matchId => {
  var match = DataMatch.matches.filter(el => el.id == matchId)[0]
  insertMatch(match)
}
var deleteMatchListener = matchId => {
    deleteMatch(matchId);
  }




var SaveTeams = () => {
    var teams = getSaveTeams()
        teams.then(data => {
          teamData = data;
          var html = ''
          data.forEach(team => {
        
        html += `
          <div class="card">
            <div class="card-content">
              <div class="center"><img width="64" height="64" src="${team.crestUrl}"></div>
              <div class="center flow-text">${team.name}</div>
              <div class="center">${team.area.name}</div>
            </div>
            <div class="card-action right-align">
                <a class="waves-effect waves-light btn-small green" onclick="deleteTeamListener(${team.id})">DELETE TEAMS</a>
            </div>
          </div>
        </div>
      `
      });
      document.getElementById("save-team").innerHTML = html;
    })
  }

  var insertTeamListener = teamId => { 
    var team = DataTeam.teams.filter(el => el.id == teamId)[0]
    insertTeam(team);
  }

  var deleteTeamListener = teamId => {
      deleteTeam(teamId);
    }






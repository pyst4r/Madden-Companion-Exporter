var express = require('express');
var bodyParser = require('body-parser');
var admin = require("firebase-admin");

const app = express();

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: 'madden-germany-nfl-export',
    clientEmail: 'firebase-adminsdk-06hjr@madden-germany-nfl-export.iam.gserviceaccount.com',
    privateKey: '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCo/kxirXWgNRGx\nB9NmNksG8opQmIxPqu1nln3EcKmLn9T4NqkESIqRbxPqYL1G0UEzx5qewg4YtWuM\nZmAl5ttWJnW5Z/SKf6K8SUEV+DeM29vCVV+eql5yYu7p94LWCS4lOjznfzlqm6Mw\nUXunXEJs/bcrT7xO7X3iIwNvkkOq+E/WWV5EUSus+d8XamcLutH66NX3C0oKvCDw\nedCNkc3I3Ep8FBu5SxqrB+0Cdd8/gt1DU4dX3jM7M5RMGkWFB9D1+zsyRhAMCyKb\npG8qqjFV60v9miYu16+GMYJ5QxhMLYZ7jnPaGN6up+7kle1vzclF2hpPKG06YPY9\ntARGjuuBAgMBAAECggEAC3ndcRQLeVoxPd7krbvBI5Mj7m41lRFr9s1i9AycjuVH\nPqXjm21br52l8hQotl7ueRg0eVR/RZFIYOvw2pIPUg3hj7ouApvBTt0ApP/Kse+a\nQFuw1yMFr+nlBJFw2p0b+541VZkvqnwwPE9EQOzEfAdMwY20IX4CPvGWwaRioQEI\nif8pfWrnQ6g6L3TP2bwSV/50lU9bIF9QFwBpTfu/m4QIlOpBvfD4UXgfisCvhgq8\nuCzMDw47wKUYuT+dw3NdAIoDNlyMIGw6uPqXt4KwF3tb6PWhBqijosXIbbjaEu8/\n7hRGQ9YM3RhTVfF4mc3stZuYHXxS0TrJ8f0P8HfckwKBgQDc2Rd2cODydalJhPRs\nmGAsYM0d7wa9u2ENV14HzictsI+WxTSJHpTsVQ3PMoA8eWSQZbWtRIHRCdPilc5a\nLAMEEh/wsmdkZyRDiGiXdqD0IQqAHZz3MKUzREQ+785idXVCZjxA+hbnMg7waF11\n8Fohp45s+CnkqTkfoRsUtSKwGwKBgQDD5EgPp7MGP5kvhKfjsrf4oXQuxPrUoVs4\n+BOgky3n8/dzCMPAfsXP3C2nukLBpmFToSkRyzZB/N2AZW4sOnBPnRNNeBbmB8LT\nYuIRnyHo9NSjBCr4u8drskVu0lkyrEdqkzljGb3Da9kTwLYQDuFnvRwYCbBQvT1m\nHLn1FqAkkwKBgQDJQYCzK7yi13y1BddkmxuRdYmWzLtc7cRMzyBehoyHg43mvMHa\nbycRk5TpC8F22r09JaMBShvvLkCMDS6mV9NLw2SeCUZVZfTTIh0GYlHdB7s080eW\nsBrr9DspC4oNibKZFuez4vQ6LhEVHlaFYsoQP0x4m1I6Ech/vWYbYdJBnwKBgGgq\nHot8kDzVWr6i2qfApAUozWAFTJ/+gUSE3eL4AGQkHcPkuDrG7qb+HKTg7ZiNwZk3\nzF/y4BIsxRf+V5xbItei3d3G6t486EOBhFb8eIqojd11XOhQ6dUBwdwRLG8+nuc0\nDEL/MCIXWiIfynA1iXShYawCkugMCPcgdV23P0bTAoGASshPKIJsnCHhx540Lusq\n/l0Z38zfqo/rCunvguBGdRpVPu8z9lZ6H+zjV8kMWsu+699J1LTOQeUwKJvERpv+\nrO0PKr5t5Z26w/9w4gl3yo4cOcIJjefv1A2QK4jwSa2hA5OjPknRL/sPfZG2sVqT\nHm8sH0XUhojYIwE04vtW8TM=\n-----END PRIVATE KEY-----\n'
  }),
  databaseURL: 'https://madden-germany-nfl-export.firebaseio.com'
});


app.set('port', (process.env.PORT || 3001));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.post('*', (req, res) => {
  console.log(req.url);
  res.sendStatus(200);
});

app.post('/:username/:platform/:leagueId/leagueteams', (req, res) => {
  const db = admin.database();
  const ref = db.ref();
  const { params: { username, leagueId }, body: { leagueTeamInfoList: teams } } = req;

  teams.forEach(team => {
    const teamRef = ref.child(`data/${username}/${leagueId}/teams/${team.teamId}`);
    teamRef.update(team);
  });

  res.sendStatus(200);
});

app.post('/:username/:platform/:leagueId/standings', (req, res) => {
  const db = admin.database();
  const ref = db.ref();
  const { params: { username, leagueId }, body: { teamStandingInfoList: teams } } = req;

  teams.forEach(team => {
    const teamRef = ref.child(`data/${username}/${leagueId}/teams/${team.teamId}`);
    teamRef.update(team);
  })

  res.sendStatus(200);
});

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

app.post('/:username/:platform/:leagueId/week/:weekType/:weekNumber/:dataType', (req, res) => {
  const db = admin.database();
  const ref = db.ref();
  const { params: { username, leagueId, weekType, weekNumber, dataType } } = req;
  const dataRef = ref.child(`data/${username}/${leagueId}/week/${weekType}/${weekNumber}/${dataType}`);

  // "defense", "kicking", "passing", "punting", "receiving", "rushing"

  switch (dataType) {
    case 'schedules': {
      const weekRef = ref.child(`data/${username}/${leagueId}/schedules/${weekType}/${weekNumber}`);
      const { body: { gameScheduleInfoList: schedules } } = req;
      dataRef.set(schedules);
      break;
    }
    case 'teamstats': {
      const { body: { teamStatInfoList: teamStats } } = req;
      teamStats.forEach(stat => {
        const weekRef = ref.child(`data/${username}/${leagueId}/stats/${stat.teamId}/team-stats/${weekType}/${weekNumber}`);
        weekRef.set(stat);
      })
      break;
    }
    case 'defense': {
      const { body: { playerDefensiveStatInfoList: defensiveStats } } = req;
      defensiveStats.forEach(stat => {
        const weekRef = ref.child(`data/${username}/${leagueId}/stats/${stat.teamId}/player-stats/${stat.rosterId}/${weekType}/${weekNumber}`);
        weekRef.update(stat);
      })
      break;
    }
    default: {
      const { body } = req;
      const property = `player${capitalizeFirstLetter(dataType)}StatInfoList`;
      const stats = body[property];
      stats.forEach(stat => {
        const weekRef = ref.child(`data/${username}/${leagueId}/stats/${stat.teamId}/player-stats/${stat.rosterId}/${weekType}/${weekNumber}`);
        weekRef.update(stat);
      })
      break;
    }
  }

  res.sendStatus(200);
});

// ROSTERS

app.post('/:username/:platform/:leagueId/freeagents/roster', (req, res) => {
  res.sendStatus(200);
});

app.post('/:username/:platform/:leagueId/team/:teamId/roster', (req, res) => {
  const db = admin.database();
  const ref = db.ref();
  const { params: { username, leagueId, teamId }, body: { rosterInfoList } } = req;
  const dataRef = ref.child(`data/${username}/${leagueId}/teams/${teamId}/roster`);
  const players = {};
  rosterInfoList.forEach(player => {
    players[player.rosterId] = player;
  });
  dataRef.set(players, (error) => {
    if (error) {
      console.log("Data could not be saved." + error);
    } else {
      console.log("Data saved successfully.");
    }
  });
  res.sendStatus(200);
});

app.listen(app.get('port'), function () { return console.log('Madden Data is running on port', app.get('port')) });

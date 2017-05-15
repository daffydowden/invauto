var Nightmare = require('nightmare');
var moment = require('moment');
var nightmare = Nightmare({show: true});

var login = function(){
  return nightmare
    .goto('https://timesheets.xcede.co.uk')
    .type('input#j_username', process.env.XCEDE_USER)
    .type('input#j_password', process.env.XCEDE_PASSWORD)
    .click('button[type="submit"]')
    .wait('#menuTable')
}

var findTimesheet = function(){
  //var nextSunday = moment().day("Sunday").add(7, 'days').format('DD/MM/YYYY');
  var nextSunday = moment().day("Sunday").format('DD/MM/YYYY');
  var newTimesheetUrl = "https://timesheets.xcede.co.uk/timesheetEntry/webEntry?placementId=21968&tsDate=" + nextSunday;
  return nightmare
    .goto(newTimesheetUrl)
    .wait('#menuTable')
}

var fillInTimesheet = function(){
  return nightmare
    .wait(1000)
    .click('.timesheetTable .decimal input[type=text]')
    .wait(1000)
    .evaluate(function(done){
      var inputs = document.querySelectorAll('.timesheetTable .decimal input[type=text]');
      for (var i=0;i<5;i++){ 
        angular.element(inputs[i]).val('1.0').trigger('input')
      }
      done();
    })
}

var submitTimesheet = function(){
  var saveBtn = 'input[type=Submit][value="Save And Submit"]';
  return nightmare
    .wait('input[type=Submit][value="Save As Draft"]')
    .click('input[type=Submit][value="Save As Draft"]')
    //.click(saveBtn)
    .wait('form h3 span.ng-binding')
    .evaluate(function(){
      return document.querySelector('form h3 span.ng-binding').innerText;
    })
    .end()
    .then(function(timesheetId){
      var timesheetId = timesheetId.replace('-','').trim();
      return timesheetId;
    })
}

//console.log(findLatestTimesheet());
login()
  .then(function(){
    console.log('Finding timesheet');
    return findTimesheet();
  }).then(function(){
    console.log('Filling in timesheet');
    return fillInTimesheet();
  }).then(function(){
    console.log('Submitting timesheet');
    return submitTimesheet();
  });

var CronJob = require('cron').CronJob;
var job = new CronJob('*/1 * * * *', function(){
		console.log('runs every minute ' + new Date());
	}, function () {
    console.log('job1 has stopped');
		job.start();
  },
  true /* Start the job right now */,
  'Asia/Singapore'
);


var job2 = new CronJob({
  cronTime: '*/2 * * * *',
  onTick: function() {
		console.log('stopping job 1 ' + new Date());
		job.stop();
  },
  start: true,
  timeZone: "America/Los_Angeles"
});

for (var i = 0; i < 5; ++i) {
	var minuteJob = new CronJob('*/1 * * * *', function(){
			var myid = minuteJob.id;
			console.log(myid + '> 1 minute job' + new Date());
		}, function () {
			console.log(myid + '> 1 minute job ended');
		},
		true,
		'Asia/Singapore'
	);	
	minuteJob.id = i;
}

var twoMinJob = new CronJob('*/2 * * * *', function(){
		console.log('2 minute job' + new Date());
	}, function () {
    console.log('2 minute job ended');
  },
  true,
  'Asia/Singapore'
);


var fiveMinJob = new CronJob('*/5 * * * *', function(){
		console.log('5 minute job' + new Date());
	}, function () {
    console.log('5 minute job ended');
  },
  true,
  'Asia/Singapore'
);
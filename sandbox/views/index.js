/**
Copyright (C) 2013 Moko365 Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

exports.init = function(req, res, next) {
    //defaults
    req.query.name = req.query.name ? req.query.name : '';
    req.query.limit = req.query.limit ? parseInt(req.query.limit) : 5;
    req.query.page = req.query.page ? parseInt(req.query.page) : 1;
    req.query.sort = req.query.sort ? req.query.sort : '-date';

    //filters
    var outcome = [];

    var mapCategory = function(programs, cb) {
    	req.app.db.models.Category.find({}).exec(function(err, categories) {
	        if (err) return next(err);
	        if (!categories) return next(); // not found

	        // Map
	        for (var i = 0; i < categories.length; i++) {
	        	var id = "ID:" + categories[i]._id;		// stringify

	        	for (var j = 0; j < programs.length; j++) {

	        		// not active yet
                    if (programs[j].isActive != true) continue;

                    // not belong to any lesson yet
                    if (!programs[j].lesson) continue;

                    // its lesson not belong to any category yet
                    if (typeof(programs[j].lesson.category) === 'undefined') continue;


	        		var map = "ID:" + programs[j].lesson.category; 		// stringify

	        		if (id === map) {

	        			var duration = programs[j].duration;
	        			var m = Math.floor(duration/60);
	        			var s = duration%60;

	        			outcome.push({
		        			lecture: programs[j].lecture,
		        			title: programs[j].title,
		        			isActive: programs[j].isActive,
		        			type: programs[j].type,
		        			views: programs[j].views,
		        			duration: {
		        				min: m,
		        				sec: s
		        			},
		        			author: {
		        				name: programs[j].author.name,
		        				user: programs[j].author.user
		        			},
		        			lesson: {
		        				name: programs[j].lesson.name,
		        				tag: programs[j].lesson.tag,
		        				followers: programs[j].lesson.followers.length,
		        				programs: programs[j].lesson.programs.length,
		        				isActive: programs[j].lesson.isActive,
		        				title: programs[j].lesson.title,
		        				desc: programs[j].lesson.desc
		        			},
		        			category: {
		        				name: categories[i].name,
		        				title: categories[i].title
		        			}
	        			});
	        		}
	        	}
	        }

	        cb(outcome.programs);
	    });
    };

    readAllSubjects(req, res, next, function(outcome) {
		var moment = require('moment');
		var ccc = require('cccount');

		/*
		[ { _id: { subject: 'Web Starter Kit: 環境與開始動手' },
		    date: '3 days ago',
		    subject: 'Web Starter Kit: 環境與開始動手',
		    isActive: true,
		    wchars: 560,
		    id: 53ad3de667c23cbd5d00001a,
		    userCreated: 
		     { id: 51c7b9e04471c752cbf7e089,
		       time: Fri Jun 27 2014 11:57:48 GMT+0800 (CST),
		       name: 'jollen' },
		    readtime: 2 } ]
		*/
		var posts = [];

        // formating 'date'
		posts = outcome.posts;

        posts.forEach(function(post) {
            post.date = moment(post.date).fromNow();
            // calculate read time
            // 平均閱讀速度約 240 字/分
            post.readtime = Math.round(post.wchars / 240);
            if (post.readtime === 0)
            	post.readtime = 1;
        });

        // Reduce (取3篇)
        posts = posts.slice(0, 3);

	    req.app.db.models.Program.pagedFind({
	            keys: 'title lecture isActive date type views userCreated.time duration lesson author',
	            populates: {
	                path: 'lesson author',
	                select: 'name category user isActive tag followers programs title desc'
	            },
	            limit: req.query.limit,
	            page: req.query.page,
	            sort: req.query.sort
	    }, function(err, programs) {
	        if (err) next(err);

	         mapCategory(programs.data, function(programs) {
				/*
				  { lecture: '001P0102_DownloadAOSP',
				    title: '1.2 下載 AOSP 源碼',
				    isActive: true,
				    type: 'video',
				    views: 33,
				    duration: 254,
				    author:
				     { name: { first: '', middle: '', last: '', full: 'Jollen Chen' },
				       user:
				        { name: 'jollen',
				          id: 51c7b9e04471c752cbf7e089,
				          emailHash: '400c529007e2242ac7132c78fc772e91' } },
				    lesson:
				     { name: 'android-porting-overview',
				       tag: [ ],
				       followers: 20,
				       programs: 15,
				       isActive: true,
				       title: 'Android Porting 系統移植入門',
				       desc: '適合零基礎，想從零開始學習 Android 底層開發的工程師。 帶領學員入門 Android 系統編譯，並了解重要的通識觀念 ' },
				    category: { name: 'android', title: 'Android 底層課程' } } ]
				 */
		        res.render('index', {
		            programs: programs,
		            posts: posts
		        });
	         });
	    });
	});
};

exports.widgets = function(req, res){
    var lessons = [];

    var getCategory = function() {
    	req.app.db.models.Category.find({}).populate('lessons').exec(function(err, categories) {
	        if (err) return next(err);
	        if (!categories) return next(); // not found

	        // Make the orders
	        var counts = 0;
	        for (var i = 0; i < categories.length; i++) {
	        	for (var j = 0; j < categories[i].lessons.length; j++) {
	        		categories[i].lessons[j].order = counts;
	        		counts++;
	        	}
	        }

	        res.render('widgets', {
	            categories: categories
	        });
	    });
    };

    getCategory();
};

exports.calendar = function(req, res, next) {
    res.render('calendar');
};

exports.code = function(req, res, next) {
    res.render('code');
};

exports.makers = function(req, res, next) {
    res.render('makers');
};

exports.yic = function(req, res, next) {
    res.render('yic');
};

exports.schools = function(req, res, next) {
    res.render('schools');
};

exports.schoolsById = function(req, res, next) {
	var id = req.params.id;
	
    res.render('schools');
};

exports.schools = function(req, res, next) {
    res.render('schools/index');
};

exports.wotcity = function(req, res, next) {
    res.render('wotcity');
};

exports.test = function(req, res, next) {
    //defaults
    req.query.name = req.query.name ? req.query.name : '';
    req.query.limit = req.query.limit ? parseInt(req.query.limit) : 5;
    req.query.page = req.query.page ? parseInt(req.query.page) : 1;
    req.query.sort = req.query.sort ? req.query.sort : '-date';

    //filters
    var outcome = [];

    var mapCategory = function(programs, cb) {
    	req.app.db.models.Category.find({}).exec(function(err, categories) {
	        if (err) return next(err);
	        if (!categories) return next(); // not found

	        // Map
	        for (var i = 0; i < categories.length; i++) {
	        	var id = "ID:" + categories[i]._id;		// stringify

	        	for (var j = 0; j < programs.length; j++) {

	        		// not active yet
                    if (programs[j].isActive != true) continue;

                    // not belong to any lesson yet
                    if (!programs[j].lesson) continue;

                    // its lesson not belong to any category yet
                    if (typeof(programs[j].lesson.category) === 'undefined') continue;


	        		var map = "ID:" + programs[j].lesson.category; 		// stringify

	        		if (id === map) {

	        			var duration = programs[j].duration;
	        			var m = Math.floor(duration/60);
	        			var s = duration%60;

	        			outcome.push({
		        			lecture: programs[j].lecture,
		        			title: programs[j].title,
		        			isActive: programs[j].isActive,
		        			type: programs[j].type,
		        			views: programs[j].views,
		        			duration: {
		        				min: m,
		        				sec: s
		        			},
		        			author: {
		        				name: programs[j].author.name,
		        				user: programs[j].author.user
		        			},
		        			lesson: {
		        				name: programs[j].lesson.name,
		        				tag: programs[j].lesson.tag,
		        				followers: programs[j].lesson.followers.length,
		        				programs: programs[j].lesson.programs.length,
		        				isActive: programs[j].lesson.isActive,
		        				title: programs[j].lesson.title,
		        				desc: programs[j].lesson.desc
		        			},
		        			category: {
		        				name: categories[i].name,
		        				title: categories[i].title
		        			}
	        			});
	        		}
	        	}
	        }

	        cb(outcome.programs);
	    });
    };

    readAllSubjects(req, res, next, function(outcome) {
		var moment = require('moment');
		var ccc = require('cccount');

		var posts = [];

        // formating 'date'
		posts = outcome.posts;

        posts.forEach(function(post) {
            post.date = moment(post.date).fromNow();
            // calculate read time
            // 平均閱讀速度約 240 字/分
            post.readtime = Math.round(post.wchars / 240);
            if (post.readtime === 0)
            	post.readtime = 1;
        });

        // Reduce (取3篇)
        posts = posts.slice(0, 3);

	    req.app.db.models.Program.pagedFind({
	            keys: 'title lecture isActive date type views userCreated.time duration lesson author',
	            populates: {
	                path: 'lesson author',
	                select: 'name category user isActive tag followers programs title desc'
	            },
	            limit: req.query.limit,
	            page: req.query.page,
	            sort: req.query.sort
	    }, function(err, programs) {
	        if (err) next(err);

	         mapCategory(programs.data, function(programs) {
				/*
				  { lecture: '001P0102_DownloadAOSP',
				    title: '1.2 下載 AOSP 源碼',
				    isActive: true,
				    type: 'video',
				    views: 33,
				    duration: 254,
				    author:
				     { name: { first: '', middle: '', last: '', full: 'Jollen Chen' },
				       user:
				        { name: 'jollen',
				          id: 51c7b9e04471c752cbf7e089,
				          emailHash: '400c529007e2242ac7132c78fc772e91' } },
				    lesson:
				     { name: 'android-porting-overview',
				       tag: [ ],
				       followers: 20,
				       programs: 15,
				       isActive: true,
				       title: 'Android Porting 系統移植入門',
				       desc: '適合零基礎，想從零開始學習 Android 底層開發的工程師。 帶領學員入門 Android 系統編譯，並了解重要的通識觀念 ' },
				    category: { name: 'android', title: 'Android 底層課程' } } ]
				 */
		        res.render('test', {
		            programs: programs,
		            posts: posts
		        });
	         });
	    });
	});
};

// Default: read the newest one for every subjects
var readAllSubjects = function(req, res, next, cb) {
    var workflow = new req.app.utility.Workflow(req, res);
    
    workflow.on('mapReduce', function() {
        // MongoDB MapReduce
        //
        // see: http://docs.mongodb.org/manual/tutorial/aggregation-with-user-preference-data/
        //      http://www.mikitamanko.com/blog/2013/08/25/mongoose-aggregate-with-group-by-nested-field/
        req.app.db.models.Post.aggregate([
            { $group : {
                _id :  { subject: '$subject'},
                date : { $last : '$date' },
                subject : {$last: '$subject'},
                isActive: {$last: '$isActive'},
                wchars: {$last: '$wchars'},
                id: {$last: '$_id'},
                userCreated: {$last: '$userCreated'}
               }
            },
            { $sort : {
               	date: -1
              }
            }]
            , function(err, posts) {
                    if (err) return workflow.emit('exception', err);

                    //Reduce
                    workflow.outcome.posts = [];

                    for (i = 0; i < posts.length; i++) {
                        if (posts[i].isActive === true)
                            workflow.outcome.posts.push(posts[i]);
                    }

                    return workflow.emit('render');
        });
    });

    workflow.on('render', function() {
        return cb(workflow.outcome);
    });

    return workflow.emit('mapReduce');
};
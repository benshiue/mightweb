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

exports = module.exports = function(app, mongoose) {
    //general sub docs
    require('./schema/Note')(app, mongoose);
    require('./schema/Status')(app, mongoose);
    require('./schema/StatusLog')(app, mongoose);


    //user system
    require('./schema/User')(app, mongoose);
    require('./schema/Admin')(app, mongoose);
    require('./schema/AdminGroup')(app, mongoose);
    require('./schema/Account')(app, mongoose);

    // Course
    require('./schema/Category')(app, mongoose);
    require('./schema/Lesson')(app, mongoose);
    require('./schema/Program')(app, mongoose);
    require('./schema/Caption')(app, mongoose);

    // other
    require('./schema/Contact')(app, mongoose);

    // history
    require('./schema/ViewHistory')(app, mongoose);

    // idea
    require('./schema/Idea')(app, mongoose);

    // subscription
    require('./schema/Subscription')(app, mongoose);

    // lean task
    require('./schema/LeanTask')(app, mongoose);

    // post
    require('./schema/Post')(app, mongoose);    

    // Pass System
    require('./schema/Pass')(app, mongoose);   
    require('./schema/Ticket')(app, mongoose);    

    // Field Log System
    require('./schema/FieldLog')(app, mongoose);    
};

var router=new $.mobile.Router({
        '#terms_page': {
            handler: 'showTerms',
            events: 's'
        },
        '#contact_page': {
            handler: 'showContact',
            events: 's'
        },
        '#feedback_page': {
            handler: 'showFeedback',
            events: 's'
        },
        '#inprogress_page':{
            handler: 'showInprogressList',
            events: 's'
        },
        '#completed_page':{
            handler: 'showCompletedList',
            events: 's'
        },
        '#inprogress_detail(?:[?/](.*))?': {
            handler: 'showInprogressDetail',
            events: 'bs'
        },
        '#completed_detail(?:[?/](.*))?': {
            handler: 'showCompletedDetail',
            events: 'bs'
        }
    }, 

    {
        showTerms: function(){

        },

        showContact: function(){

            $('#contact_content').empty();
            
            $.getJSON('http://www.c4logistics.com/mobile/contact.asp').success(function(data, status, xhr){
                $('#contact_content').append(
                    '<ul data-role="listview">' +
                        '<li>' +
                            '<a href="#feedback_page" data-transition="slide">' +
                            '<h3>' +
                                'Rate us' +
                            '</h3>' +
                            '<p>' +
                                'Rate your experience with C4 Logistics' +
                            '</p></a>' +
                        '</li>' +
                        '<li>' +
                            '<a href="mailto:' + data.Email + '">' +
                            '<h3>' +
                                'Email' +
                            '</h3>' +
                            '<p>' +
                                data.Email +
                            '</p></a>' +
                        '</li>' +
                        '<li>' +
                            '<a href="tel:' + data.Telephone.replace('(0)', '').replace(/ /g, '') + '">' +
                            '<h3>' +
                                'Telephone' +
                            '</h3>' +
                            '<p>' +
                                data.Telephone +
                            '</p></a>' +
                        '</li>' +
                    '</ul>'
                );
                                                                               
                $('#contact_page').page('destroy').page();
            })
            .fail(function(){
                $('#contact_content').append(
                    '<ul data-role="listview">' +
                        '<li>' +
                            '<a href="#feedback_page" data-transition="slide">' +
                            '<h3>' +
                                'Rate us' +
                            '</h3>' +
                            '<p>' +
                                'Rate your experience with C4 Logistics' +
                            '</p></a>' +
                        '</li>' +
                        '<li>' +
                            '<a href="mailto:ops@c4logistics.com">' +
                            '<h3>' +
                                'Email' +
                            '</h3>' +
                            '<p>ops@c4logistics.com</p></a>' +
                        '</li>' +
                        '<li>' +
                            '<a href="tel:+448451304044">' +
                            '<h3>' +
                                'Telephone' +
                            '</h3>' +
                            '<p>+ 44 (0) 845 130 40 44</p></a>' +
                        '</li>' +
                    '</ul>'
                );
                                                                               
                $('#contact_page').page('destroy').page();
            });
        },

        showFeedback: function(){
            $('#feedback_form').validate({
                submitHandler: function(form){
                    var request = $(form).serializeArray();
                    $.ajax({
                        type:'POST',
                        url: 'http://www.c4logistics.com/mobile/feedback.asp',
                        dataType: 'json',
                        async: false,
                        data: request,
                        success: function(data){
                            $('#feedback_form').find('input:text, textarea').val('');
                            $('#feedback_form').find('input:radio, input:checkbox').removeAttr('checked').removeAttr('selected');
                            navigator.notification.alert(data.Message,
                                                        function(){
                                                            $.mobile.changePage('#contact_page');
                                                        }, 'C4 Logistics', 'Ok');
                            
                        },
                        error: function(){
                           navigator.notification.alert('Sorry there has been an problem, please try again later.', null, 'C4 Logistics', 'Ok');
                        }
                    });
                }
            });
        },

        showInprogressList: function(){
            $.getJSON('http://www.c4logistics.com/mobile/inprogress.asp').success(function(data, status, xhr){
                $('#inprogress_list_content').empty();
                $('#inprogress_list_content').append('<ul id="inprogress_ul" data-role="listview" data-theme="a" data-dividertheme="a"></ul>');

                var currentDate;

                if (typeof(data.Message) != "undefined"){
                    $('#inprogress_ul').append('<li><p align="center">' + data.Message[0].Content + '</p></li>');
                }else{
                    $.each(data.Consignments, function(i, item){
                        var etaCommentCol = 'color:#090;';

                        if (item.ETAStatus == 'overdue') etaCommentCol = 'color:#F00;';
                        
                        if (currentDate != item.Date){
                           $('#inprogress_ul').append('<li data-role="list-divider" data-theme="a">' + item.Date + '</li>');
                        }
                           
                        $('#inprogress_ul').append(
                            '<li>' + 
                            '<a href="/#inprogress_detail?id=' + item.JobNumber + '" data-rel="page" data-transition="slide">' +
                            '<h3>To: ' + item.To + '</h3>' + 
                            '<p>From: <strong>' + item.From + '</strong></p>' + 
                            '<p style="' + etaCommentCol + '"><strong>' + item.ETAComment + '</strong></p>' + 
                            '<p>' + item.JobNumber + ' - Your ref: ' + item.Reference  + '</p>' + 
                            '<p>ETA: ' + item.Eta + '</p>' +
                            '<p>' + item.Comment + '</p>' + 
                            '<p>Consignment: ' + item.Package + '</p>' + 
                            '</a></li>');
                        
                        currentDate = item.Date;
                    });
                }

                $('#inprogress_page').page('destroy').page();
            });
        },

        showCompletedList: function(){
            $.getJSON('http://www.c4logistics.com/mobile/completed.asp').success(function(data, status, xhr){
                $('#completed_list_content').empty();
                $('#completed_list_content').append('<ul id="completed_ul" data-role="listview" data-theme="a" data-dividertheme="a"></ul>');

                var currentDate;                                                                
                
                if (typeof(data.Message) != "undefined"){
                    $('#completed_ul').append('<li><p align="center">' + data.Message[0].Content + '</p></li>');
                }else{
                    $.each(data.Consignments, function(i, item){
                           
                        if (currentDate != item.Date){
                           $('#completed_ul').append('<li data-role="list-divider" data-theme="a">' + item.Date + '</li>');
                        }
                           
                        $('#completed_ul').append(
                            '<li>' + 
                            '<a href="/#completed_detail?id=' + item.JobNumber + '" data-rel="page" data-transition="slide">' +
                            '<h3>To: ' + item.To + '</h3>' + 
                            '<p>From: <strong>' + item.From + '</strong></p>' + 
                            '<p>' + item.JobNumber + ' - Your ref: ' + item.Reference  + '</p>' + 
                            '<p>ETA: ' + item.Eta + '</p>' +
                            '<p>Consignment: ' + item.Package + '</p>' + 
                            '<p>POD: ' + item.PODComment + '</p>' + 
                            '</a></li>');

                        currentDate = item.Date;
                    });
                }

                $('#completed_page').page('destroy').page();
            });
        },

        showInprogressDetail: function(etype, match){
            var longCo, latCo;

            var params = router.getParams(match[1]);

            $.getJSON('http://www.c4logistics.com/mobile/inprogressdetail.asp?job=' + params.id)
            .success(function(data, status, xhr){
                $('#inprogress_job_number').empty();
                $('#inprogress_job_number').append('Job ' + params.id);

                $('#inprogress_info_content').empty();

                $('#inprogress_info_content').append('<div class="map-container"><div id="map-canvas"></div></div>');
                $('#inprogress_info_content').append('<ul id="inprogress_history" data-role="listview">')

                longCo = data.History[0].Lng;
                latCo = data.History[0].Lat;

                if (longCo == '' && latCo == ''){
                    $('#inprogress_history').append(
                        '<li>' +
                            '<h3>Location Tracking</h3>' +
                            '<p>Unable to plot the current location on the map at this time, please check again later</p>' +
                        '</li>'
                    );
                }
                
                $.each(data.History, function(i, item){
                    if (item.Name != '' & item.Description != '' & item.Occurred != ''){
                        $('#inprogress_history').append(
                            '<li>' +
                                '<h3>' + item.Name + '</h3>' +
                                '<p>' + item.Description + '</p>' +
                                '<p>' + item.Occurred + '</p>' +
                            '</li>'
                        );
                    }
                });

                var coOrds = longCo + ', ' + latCo;
                $('#map-canvas').gmap({'center': coOrds, 'zoom' : 10, 'mapTypeControl' : true, 'zoomControl' : true, 'streetViewControl' : false});
                $('#map-canvas').gmap('addMarker', {'position': coOrds});
                
                $('#inprogress_detail').page('destroy').page();
            });
        },

        showCompletedDetail: function(etype, match){
            var params = router.getParams(match[1]);
            
            $('#completed_job_number').empty();
            $('#completed_detail_content').empty();            

            $.getJSON('http://www.c4logistics.com/mobile/completeddetail.asp?job=' + params.id)
            .success(function(data, status, xhr){
                
                $('#completed_job_number').append('Job ' + params.id);

                $('#completed_detail_content').append('<ul id="completed_history" data-role="listview">')
                
                $.each(data.History, function(i, item){
                    if (item.Name != '' & item.Description != '' & item.Occurred != ''){
                        $('#completed_history').append(
                            '<li>' +
                                '<h3>' + item.Name + '</h3>' +
                                '<p>' + item.Description + '</p>' +
                                '<p>' + item.Occurred + '</p>' +
                            '</li>'
                        );
                    }
                });
                
                $('#completed_detail').page('destroy').page();
            });
        }
    }, 
    
    {
        defaultHandler: function(type, ui, page){
            $.getJSON('http://www.c4logistics.com/mobile/terms.asp').success(function(data, status, xhr){
                $('#terms_content').append(data.Content);
            });
                               
            $('#forgottenpassword').click(function(){
                  var username = $('#username').val();
                  
                  if (username.length == 0){
                    navigator.notification.alert('Please complete the user name field', null, 'C4 Logistics', 'Ok');
                  }else {
                    $.ajax({
                        type:'POST',
                        url: 'http://www.c4logistics.com/mobile/password.asp',
                        dataType: 'json',
                        async: false,
                        data: { username: username },
                        success: function(data){
                            navigator.notification.alert(data.Message, null, 'C4 Logistics', 'Ok');
                        }
                    });
                  }
            });

            $('#login').validate({
                submitHandler: function(form){
                    var request = $(form).serializeArray();
                    $.ajax({
                        type:'POST',
                        url: 'http://www.c4logistics.com/mobile/login.asp',
                        dataType: 'json',
                        async: false,
                        data: request,
                        success: function(data){
                            if (data.Success){
                                $.mobile.changePage('#inprogress_page')
                            }
                            else 
                                navigator.notification.alert('Incorrect user name and password combination.', null, 'C4 Logistics', 'Ok'); 
                        },
                        error: function(){
                            navigator.notification.alert('Sorry there has been an problem, please try again later.', null, 'C4 Logistics', 'Ok');
                        }
                    });
                }
            });
        },
        defaultHandlerEvents: 's'
    }
);
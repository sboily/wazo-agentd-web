var username = "sylvain";
var password = "sylvain";
var wazo_host = "10.41.0.2";
var agentd;
var auth;


function printDebug(data) {
    console.log(data);
}

function launch_ws(ws_url) {
    var sock = new WebSocket(ws_url);
    sock.debug = false;
    init = 0;

    sock.onmessage = function(e) {
        msg = $.parseJSON(e.data);
        if (init == 0) {
            wsInit(msg, sock);
        } else {
            events_agent_status(msg.data);
        }
    };

    sock.onclose = function() {
        printDebug('There is a problem with your websocket, please reload your page...');
        init = 0;
    };

    sock.onerror = function (e) {
        printDebug('There is a problem with your websocket, please reload your page...');
        init = 0;
    };

    return sock;
}

function wsInit(data, sock) {
    switch(data.op) {
        case 'init':
            routingKey = ['*']
            for (i = 0; i < routingKey.length; i++) { 
                op = {'op': 'subscribe', 'data': {event_name: routingKey[i]}}
                sock.send(JSON.stringify(op));
            }
            sock.send(JSON.stringify({'op': 'start'}))
            break;
        case 'start':
            init = 1;
            break;
    }
}

function draw_box(e) {
    box = $('<div>', {id: e.id})
            .appendTo(".gridly")
            .addClass("brick small");


    box.append($('<p>', {
      id: 'number',
      html: 'Agent: ' + e.number
    }));

    box.append($('<p>', {
      id: 'status',
      html: 'Logged: ' + e.logged
    }));

    eventActions(box, e);

    $('.gridly').gridly({
      columns: 12
    });
}

function listenClickLog(id) {
    $('#' + id + '>#log').click(function() {
      var id = ($(this).parent().attr('id'));
      $('#extension').data('id', id);
      dialog.dialog("open");
    });
}

function listenClickUnlog(id) {
    $('#' + id + '>#unlog').click(function() {
      id = ($(this).parent().attr('id'));
      logoffAgent(id);
    });
}

function unlogAction(id) {
    return $('<p>', { id: 'unlog' })
      .append($('<a>', { href: '#'}).html('unlog'));
}

function logAction(id) {
    return $('<p>', { id: 'log' })
      .append($('<a>', { href: '#'}).html('log'));
}

function removeActions(id) {
    $('#' + id + '>#log').remove();
    $('#' + id + '>#unlog').remove();
}

function is_logged(e) {
    return(((e) == true || (e) == "logged_in" ? true : false));
}

function eventActions(box, e) {
    removeActions(e.id);

    switch(is_logged(e.logged)) {
        case true:
          box.append(unlogAction());
          listenClickUnlog(e.id);
          break;
        case false:
          box.append(logAction());
          listenClickLog(e.id);
          break;
    }
}

function events_agent_status(e) {
    agent = {
      id: e.agent_id,
      logged: is_logged(e.status)
    }

    box = $("#" + agent.id);
    box.effect("shake", "slow");
    $("#" + agent.id + ">#status")
      .text("Logged: " + agent.logged);

    eventActions(box, agent);
}

function logoffAgent(id) {
    printDebug("Logoff agent:" + id);
    agentd.logoff_agent_by_id(id);
}

function loginAgent() {
    dialog.dialog("close");
    context = $('#context').val();
    extension =  $('#extension').val();
    id = $('#extension').data('id');
    agentd.login_agent_by_id(id, extension, context);
}


function loadAgents() {
    agentd.get_agents()
      .done(function(data) {
           $(data).each(function() {
               draw_box(this);
           });
      })
      .fail(printDebug);
}

$(function() {
    options = {
      host: wazo_host,
      https_port: 443,
      prefix: true
    }

    auth = new XiVOAuth(options);

    login = {
      username: username,
      password: password,
      expiration: 12 * 60 * 60
    }

    auth.login(login)
      .done(function(data) {
        options.token = data.data.token;
        agentd = new XiVOAgentd(options);
        ws_url = 'wss://' + wazo_host + '/api/websocketd/?token=' + options.token;
        launch_ws(ws_url);
        loadAgents();
      });

    dialog = $("#dialog-form")
      .dialog({
        autoOpen: false,
        height: 400,
        width: 450,
        modal: true,
        buttons: {
          "Login agent": loginAgent,
           Cancel: function() { dialog.dialog("close"); }
        }
    });

});

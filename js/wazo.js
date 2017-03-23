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
    $("<div id=" + e.id + "></div>").appendTo(".gridly")
                                    .addClass("brick small");
    box = "<p id='number'>Agent: " + e.number + "</p>" +
          "<p id='status'>Logged: " + e.logged + "</p>";

    if (is_logged(e.logged))
        box = box + append_unlog_action(box);

    $("#" + e.id).html(box);

    $('.gridly').gridly({
      columns: 12
    });
};

function append_unlog_action() {
    return "<p id='action' class='remove'><a href='#'>unlog</a></p>";
};

function append_log_action() {
    return "<p id='action'><a href='#'>log</a></p>";
};

function remove_unlog_action(e) {
    $("#" + e + " #action").remove();
};

function is_logged(e) {
    return(((e) == true || (e) == "logged_in" ? true : false));
};

function events_agent_status(e) {
    $("#" + e.agent_id).effect("shake", "slow");
    $("#" + e.agent_id + " #status")
      .text("Logged: " + ((e.status) == "logged_in" ? true : false));

    if (!is_logged(e.status))
        remove_unlog_action(e.agent_id);
    else
        $("#" + e.agent_id).append(append_unlog_action(e.agent_id));
};

function logoffAgent(id) {
    printDebug("Logoff agent:" + id);
    agentd.logoff_agent_by_id(id);
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

    $(document).on("click", "a" , function() {
        id = ($(this).parent().parent().attr('id'));
        logoffAgent(id);
    });

});

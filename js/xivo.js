var bus_username = "xivo";
var bus_password = "xivo";
var bus_host = "http://192.168.32.244:15674/stomp";
var agentd_host = "http://192.168.32.244:9493";

var ws = new SockJS(bus_host);
var client = Stomp.over(ws);
client.heartbeat.incoming = 0;
client.heartbeat.outgoing = 0;

var onmessage = function(m) {
    raw = $.parseJSON(m.body)
    events_agent_status(raw.data);
}

var on_connect = function(x) {
    id = client.subscribe("/exchange/xivo/status.agent", onmessage);
};

var on_error =  function() {
    console.log('error');
};

var draw_box = function(e) {
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

var append_unlog_action = function() {
    return "<p id='action' class='remove'><a href='#'>unlog</a></p>";
};

var append_log_action = function() {
    return "<p id='action'><a href='#'>log</a></p>";
};

var remove_unlog_action = function(e) {
    $("#" + e + " #action").remove();
};

var is_logged = function(e) {
    return(((e) == true || (e) == "logged_in" ? true : false));
};

var events_agent_status = function(e) {
    $("#" + e.agent_id).effect("shake", "slow");
    $("#" + e.agent_id + " #status")
      .text("Logged: " + ((e.status) == "logged_in" ? true : false));

    if (!is_logged(e.status))
        remove_unlog_action(e.agent_id);
    else
        $("#" + e.agent_id).append(append_unlog_action(e.agent_id));
};

var unlog = function (id) {
    $.ajax({
        url: agentd_host + "/1.0/agents/by-id/" + id + "/logoff",
        type: "POST",
        dataType: "json",
        ContentType: "application/json",
        accepts: { json: 'application/json' },
    });
};

var get_agents = function () {
    $.ajax({
        url: agentd_host + "/1.0/agents",
        type: "GET",
        dataType: "json",
        ContentType: "application/json",
        accepts: { json: 'application/json' },
    }).then(function(data) {
       $(data).each(function() {
           draw_box(this);
       });
    });
}

client.debug = function(e) {};

$(function() {
    client.connect(bus_username, bus_password, on_connect, on_error, '/');
    get_agents();
    $(document).on("click", "a" , function() {
        id = ($(this).parent().parent().attr('id'));
        unlog(id);
    });
});

# wazo-agentd-web

What is it ?
============

This is only un proof of concept to use xivo-agentd to login or logout an agent with a very simple web interface with javascript and html.

![Agent screenshot](/screenshots/agents.png?raw=true "Agent")

How to configure ?
==================

You need wazo 17.05 (min). Add a web service user with this ACLs.

- websocketd
- events.#
- agentd.#

How to run ?
============

Please don't forget to update the value for the host and username/password in the js/wazo.js !

To run with docker :

    git clone https://github.com/sboily/wazo-agentd-web.git
    cd wazo-agentd-web
    docker run -d -p 8000:80 -v $(pwd):/var/www/html nginx

And open your browser to http://127.0.0.1:8000

Only tested with Firefox.

Have Fun :)

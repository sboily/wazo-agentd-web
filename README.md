# wazo-agentd-web

What is it ?
============

Using xivo-agentd REST API to login or logout an agent with a very simple web interface with javascript and html. Pause status is also indicated.

![Agent screenshot](/screenshots/agents.png?raw=true "Agent")

How to configure ?
==================

You need wazo 17.05 (min). Add a web service user with this ACLs.

- websocketd
- events.#
- agentd.#

How to run ?
============

Please don't forget to update the value for the host and username/password/wazo_host in the js/wazo.js!

To run with docker :

    git clone https://github.com/sboily/wazo-agentd-web.git
    cd wazo-agentd-web
    docker run -d -p 8000:80 -v $(pwd):/var/www/html nginx

And open your browser to http://127.0.0.1:8000

Have Fun :)

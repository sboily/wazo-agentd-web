# xivo-agentd-web

How to configure ?
==================

You need the xivo-agentd from the 15.05 xivo version and add this configuration in /etc/xivo-agentd/conf.d/my-config.yml

    rest_api:
      listen: 0.0.0.0
      port: 9493
      cors:
        enabled: true
        allow_headers: Content-Type

Then you need to add a rabbitmq user.

    rabbitmqctl add_user xivo xivo
    rabbitmqctl set_user_tags xivo administrator
    rabbitmqctl set_permissions -p / xivo ".*" ".*" ".*" 

Finally you need to activating the stomp web socket

    rabbitmq-plugins enable rabbitmq_web_stomp
    service rabbitmq-server restart

How to run ?
============

To run with docker :

    git clone https://github.com/sboily/xivo-agentd-web.git
    cd xivo-agentd-web
    docker run -d -p 8000:80 -v $(pwd):/var/www/html dockerfile/nginx

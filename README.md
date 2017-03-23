# wazo-agentd-web

To run with docker :

    git clone https://github.com/sboily/wazo-agentd-web.git
    cd wazo-agentd-web
    docker run -d -p 8000:80 -v $(pwd):/var/www/html dockerfile/nginx

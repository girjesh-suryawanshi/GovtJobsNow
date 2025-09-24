Here git work on their branch main so pull from main only

Point you domain to hostinger ip address 72.60.101.23 make entry in DNS section of domain and check  by root@srv1022252:~# dig +short govtjobnow.com then it will show 72.60.101.23
                          or using 
root@srv1022252:~# nslookup govtjobnow.com
Server:         127.0.0.53
Address:        127.0.0.53#53

Non-authoritative answer:
Name:   govtjobnow.com
Address: 72.60.101.23 

======================================================================
root@srv1022252:~# nginx -T | grep server_name
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
        # server_names_hash_bucket_size 64;
        # server_name_in_redirect off;
    server_name govtjobnow.com www.govtjobnow.com;
    server_name govtjobnow.com www.govtjobnow.com;
    server_name hexasend.com www.hexasend.com;
    server_name hexasend.com www.hexasend.com;
    server_name mymealify.com www.mymealify.com;  # Replace with your actual domain
#     server_name mymealify.com www.mymealify.com;
    server_name mymealify.com www.mymealify.com;


================================================================
whenever we deploy using docker then docker will automatically create database based on .env file data here in case of govtjobnow.com data base name is govtjobsnow 
check port of deployed application so that coflict not occured before deploye and change accordignly in docker-compose.yml  
- to check application port in docker use
- root@srv1022252:~# docker ps
CONTAINER ID   IMAGE                      COMMAND                  CREATED        STATUS                    PORTS                                                                                NAMES
00171c7f7d42   nginx:alpine               "/docker-entrypoint.…"   18 hours ago   Up 18 hours               0.0.0.0:8080->80/tcp, [::]:8080->80/tcp, 0.0.0.0:8443->443/tcp, [::]:8443->443/tcp   mymealify-nginx
3c7ed63f4432   dietbiteai-mymealify-app   "dumb-init -- npm st…"   18 hours ago   Up 18 hours (unhealthy)   0.0.0.0:3002->5000/tcp, [::]:3002->5000/tcp                                          mymealify-app
62bfa7643d32   redis:7-alpine             "docker-entrypoint.s…"   18 hours ago   Up 18 hours               0.0.0.0:6380->6379/tcp, [::]:6380->6379/tcp                                          mymealify-redis
1f3d1070882d   postgres:15-alpine         "docker-entrypoint.s…"   18 hours ago   Up 18 hours (healthy)     0.0.0.0:5433->5432/tcp, [::]:5433->5432/tcp                                          mymealify-postgres
260b58f6aa09   secureshare_hexasend-app   "docker-entrypoint.s…"   24 hours ago   Up 24 hours (healthy)     0.0.0.0:3001->5000/tcp, [::]:3001->5000/tcp                                          hexasend-app
d1e884ad9cb5   govtjobsnow-app            "dumb-init -- npm st…"   25 hours ago   Up 25 hours (healthy)     127.0.0.1:4007->3000/tcp                                                             govtjobsnow_app
e00d5aa360c6   postgres:15-alpine         "docker-entrypoint.s…"   25 hours ago   Up 25 hours (healthy)     5432/tcp                                                                             govtjobsnow_db
root@srv1022252:~#
============================================================================
After cheking this you can start your deployment on vps using to run fresh-vps-deploy.sh or manually
by go to your project directory and  run docker compose up -d --build it will bild and deploy your appication
if error occure then use docker compse down to stop your docker container
you can also check error using command
- docker logs govtjobsnow_app
- and Database log using
- docker  logs govtjobsnow_db
  if any occured then find out and rectify it if you want to check database then use this scrit and run on vps
  ======================================================

  docker compose exec app node -e "
  const { Client } = require('pg');
  const client = new Client(process.env.DATABASE_URL);
  client.connect()
    .then(() => { console.log('✅ Database connected successfully!'); client.end(); })
    .catch(err => console.log('❌ Database connection failed:', err.message));""
  "
  =========================================

  
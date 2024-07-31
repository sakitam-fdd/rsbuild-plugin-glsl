# Runner
FROM nginx:alpine as runner

WORKDIR .

COPY ./nginx.conf /etc/nginx/nginx.conf

COPY . /usr/share/nginx/html

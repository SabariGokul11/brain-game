FROM nginx:alpine

WORKDIR /usr/share/nginx/html

COPY memory-game/index.html .
COPY memory-game/style.css .
COPY memory-game/script.js .

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

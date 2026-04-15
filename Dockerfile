FROM nginx:alpine

WORKDIR /usr/share/nginx/html

COPY cicd-game/index.html .
COPY cicd-game/script.js .
COPY cicd-game/style.css .

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

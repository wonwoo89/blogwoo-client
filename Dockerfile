# Scripts to be run in advance
# 1. yarn build to production mode
FROM node:alpine
COPY /server /app/blogwoo
WORKDIR /app/blogwoo
RUN npm i -g pm2
RUN npm i
EXPOSE 3000
CMD ["pm2-runtime", "ecosystem.config.js", "--env", "production"]

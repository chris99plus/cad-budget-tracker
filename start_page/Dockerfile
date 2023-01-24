FROM node:18.10 as builder

# Copy and build the start_page code
COPY ./start_page /usr/start_page
WORKDIR /usr/start_page
RUN yarn install
RUN yarn build

FROM nginx:alpine as server

COPY start_page/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /usr/start_page/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

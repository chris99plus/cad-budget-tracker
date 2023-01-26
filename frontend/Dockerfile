FROM node:18.10 as builder

# Copy and build the frontend code
COPY ./frontend /usr/frontend
WORKDIR /usr/frontend
RUN yarn install
RUN yarn build

FROM nginx:alpine as server

COPY ./frontend/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /usr/frontend/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

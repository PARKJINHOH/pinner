FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /etc/nginx/conf.d/default.conf

# Copy config nginx
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built React application to the container
COPY --from=build /app /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]
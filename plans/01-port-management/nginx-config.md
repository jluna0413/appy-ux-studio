# Reverse Proxy Configuration Template (nginx)
# Place at: /etc/nginx/sites-available/appyux-studio
# Symlink: ln -s /etc/nginx/sites-available/appyux-studio /etc/nginx/sites-enabled/

# This is an nginx config file, not TOML. Stored as .md for documentation.

## Global Settings

```nginx
worker_processes auto;
pid /run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;

    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;
```

## Upstream Definitions

```nginx
    upstream backend {
        server 127.0.0.1:8002;
    }

    upstream client_portal {
        server 127.0.0.1:5180;
    }

    upstream admin_dashboard {
        server 127.0.0.1:5181;
    }
```

## Server Block (Main)

```nginx
    server {
        listen 80;
        listen 443 ssl;
        server_name appyux.studio www.appyux.studio;

        ssl_certificate /etc/letsencrypt/live/appyux.studio/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/appyux.studio/privkey.pem;

        # Security headers
        add_header X-Frame-Options SAMEORIGIN;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";

        location / {
            # Serve static landing page or proxy to frontend
            try_files $uri $uri/ /index.html;
        }

        location /api {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location /uploads {
            proxy_pass http://backend;
        }

        location /portal {
            proxy_pass http://client_portal;
            proxy_set_header Host $host;
        }

        location /admin {
            proxy_pass http://admin_dashboard;
            proxy_set_header Host $host;
        }
    }
```

## Client Project Routing (Subdomain)

```nginx
    # Add new server blocks for each client:
    server {
        listen 443 ssl;
        server_name client-alpha.appyux.studio;

        location / {
            proxy_pass http://127.0.0.1:5200;
            proxy_set_header Host $host;
        }

        location /admin {
            proxy_pass http://127.0.0.1:5201;
            proxy_set_header Host $host;
        }

        location /api {
            proxy_pass http://127.0.0.1:5202;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
```

## HTTP to HTTPS Redirect

```nginx
    server {
        listen 80;
        server_name appyux.studio www.appyux.studio;
        return 301 https://$host$request_uri;
    }
```

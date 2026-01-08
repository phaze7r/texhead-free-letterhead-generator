# TexHead - Free Letterhead Generator for Biz Owners

A professional, free-to-use letterhead generator built with Next.js. Create, preview, and download customized letterheads as high-quality PDFs instantly.

## Features

- **Dynamic Content:** Real-time updates for company info, employee details, and letter body.
- **Live Preview:** See your changes instantly as you type.
- **Logo Support:** Upload and position your company logo.
- **Smart Signatures:**
  - **Draw:** Sign directly on the screen (touch/mouse).
  - **Type:** Generate a styled signature automatically.
  - **Upload:** Use your own signature image.
- **PDF Export:** download a clean, print-ready PDF (A4 format).

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui
- **PDF Generation:** html2canvas + jsPDF

---

## 🚀 Getting Started (Local Development)

Follow these steps to run the project on your local machine:

### Prerequisites
- Node.js 18+ installed.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/phaze7r/texodus-free-letterhead-generator.git
    cd texodus-free-letterhead-generator
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will start on **port 9002** by default (configured in `package.json`).
    Open [http://localhost:9002](http://localhost:9002) in your browser.

---

## 📦 Production Build

To create an optimized production build:

```bash
npm run build
npm start
```
The production server will typically run on port 3000.

---

## 🌍 Deployment

### Option 1: Vercel / Netlify (Recommended for easiest setup)
This project is a standard Next.js application and can be deployed with zero configuration on [Vercel](https://vercel.com) or [Netlify](https://netlify.com). Just connect your repository and deploy.

### Option 2: Self-Hosted VPS (Ubuntu/Nginx)

If you prefer hosting on your own server (AWS EC2, DigitalOcean, Hostinger VPS), follow this guide:

#### 1. Setup the Server
Ensure your server has `node`, `npm`, and `nginx` installed.

#### 2. Process Management (PM2)
Use PM2 to keep the Next.js app running in the background.

```bash
# Install PM2 globally
sudo npm install -g pm2

# Build the app
npm run build

# Start the app with PM2
pm2 start npm --name "letterhead-app" -- start

# Save the process list so it restarts on reboot
pm2 save
pm2 startup
```

#### 3. Nginx Reverse Proxy
Configure Nginx to point public traffic to your local Next.js app (running on port 3000).

Create/Edit your Nginx config (`/etc/nginx/sites-available/default` or your specific site file):

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Restart Nginx:
```bash
sudo systemctl restart nginx
```

#### 4. SSL (HTTPS)
Secure your site using Certbot (Let's Encrypt):

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## License

This project is licensed under the MIT License.

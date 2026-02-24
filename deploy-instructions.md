# AWS Deployment Instructions for Texas Undercarriage

## Option 1: AWS Amplify (Recommended - Easiest)

### Via AWS Console:
1. Go to AWS Amplify Console: https://console.aws.amazon.com/amplify/
2. Click "New app" → "Host web app"
3. Connect your GitHub repository: `seamusowens/texas-undercarriage`
4. Configure build settings (auto-detected from amplify.yml)
5. Add environment variables:
   - `DATABASE_URL=file:./prisma/dev.db`
   - `NEXTAUTH_SECRET=your-secure-random-string`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-key`
   - `STRIPE_SECRET_KEY=your-stripe-secret`
6. Click "Save and deploy"

Your site will be live at: `https://main.xxxxx.amplifyapp.com`

## Option 2: AWS EC2 (More Control)

1. Launch EC2 instance (t3.small or larger)
2. SSH into instance
3. Install Node.js 18+
4. Clone repository
5. Run:
```bash
npm install
npm run build
npm start
```

## Option 3: AWS ECS/Fargate (Container-based)

Create Dockerfile and deploy as container service.

## Notes:
- SQLite database will reset on each deployment (use PostgreSQL RDS for production)
- Update Stripe keys before going live
- Configure custom domain in Amplify settings

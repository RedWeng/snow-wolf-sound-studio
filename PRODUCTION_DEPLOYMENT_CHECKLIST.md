# Production Deployment Checklist
**Last Updated**: February 6, 2026

## 🚀 Pre-Deployment Checklist

### 1. Database Setup ✅ Ready
**Priority**: P0 - Critical

#### Supabase Setup (Recommended)
```bash
# 1. Create Supabase project at https://supabase.com
# 2. Run database migrations (create tables)
# 3. Set up Row Level Security (RLS) policies
# 4. Get connection string and API keys
```

#### Environment Variables
```env
# Add to .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

#### Files to Update
- [ ] `lib/api/database.ts` - Replace mock functions with Supabase queries
- [ ] `lib/api/waitlist.ts` - Replace mock functions with Supabase queries
- [ ] Create Supabase client in `lib/supabase/client.ts`

#### Database Tables Required
- [ ] `users` - User accounts
- [ ] `children` - Child profiles
- [ ] `sessions` - Event sessions
- [ ] `orders` - Order records
- [ ] `order_items` - Order line items
- [ ] `waitlist_entries` - Waitlist records
- [ ] `admin_actions` - Admin audit log

---

### 2. File Storage Setup ✅ Ready
**Priority**: P0 - Critical

#### Supabase Storage (Recommended)
```bash
# 1. Create storage bucket in Supabase dashboard
# 2. Set up bucket policies (public read, authenticated write)
# 3. Configure file upload limits
```

#### Files to Update
- [ ] `app/api/payment-proof/route.ts` - Implement file upload to Supabase Storage
- [ ] Add file validation (size, type)
- [ ] Add image optimization (optional)

#### Storage Buckets Required
- [ ] `payment-proofs` - Payment proof images
- [ ] `session-images` - Session promotional images (optional)

---

### 3. Email Service Setup ✅ Ready
**Priority**: P0 - Critical

#### Current Implementation
- Email service already configured in `lib/email/service.ts`
- Uses Resend API (https://resend.com)

#### Environment Variables
```env
# Add to .env.local
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

#### Email Templates to Test
- [ ] Order confirmation email
- [ ] Payment received email
- [ ] Waitlist promotion email
- [ ] Order cancellation email

#### Files Already Configured
- ✅ `lib/email/service.ts` - Email sending service
- ✅ `lib/email/templates.ts` - Email templates

---

### 4. Payment Integration Setup ⚠️ Needs Implementation
**Priority**: P0 - Critical

#### JKO Pay Integration
```bash
# 1. Register at https://www.jkopay.com/
# 2. Complete merchant verification
# 3. Get merchant ID and API credentials
# 4. Set up payment webhooks
```

#### Environment Variables
```env
# Add to .env.local
JKOPAY_MERCHANT_ID=your_merchant_id
JKOPAY_API_KEY=your_api_key
JKOPAY_API_SECRET=your_api_secret
JKOPAY_WEBHOOK_SECRET=your_webhook_secret
```

#### Files to Update
- [ ] `components/checkout/PaymentMethodSelector.tsx` - Implement JKO Pay API
- [ ] Create `app/api/payment/jkopay/route.ts` - Payment creation endpoint
- [ ] Create `app/api/webhooks/jkopay/route.ts` - Payment webhook handler
- [ ] Update order status on successful payment

#### LINE Pay Integration (Optional)
- [ ] Register for LINE Pay merchant account
- [ ] Implement LINE Pay API
- [ ] Set up QR code generation

---

### 5. Security Configuration ✅ Ready
**Priority**: P0 - Critical

#### Environment Variables
```env
# Add to .env.local
NODE_ENV=production
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=https://yourdomain.com
```

#### Security Checklist
- [ ] Enable HTTPS only
- [ ] Set up CORS policies
- [ ] Configure rate limiting
- [ ] Enable CSRF protection
- [ ] Set up API key rotation
- [ ] Configure session timeout
- [ ] Enable audit logging

---

### 6. Monitoring & Analytics 📊 Optional
**Priority**: P2 - Nice to Have

#### Recommended Tools
- [ ] Vercel Analytics (built-in)
- [ ] Sentry for error tracking
- [ ] Google Analytics for user behavior
- [ ] Supabase Dashboard for database monitoring

#### Environment Variables
```env
# Add to .env.local
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
NEXT_PUBLIC_GA_TRACKING_ID=your_ga_id
```

---

## 🧪 Testing Checklist

### Unit Tests
- [ ] Test database operations with real database
- [ ] Test email sending
- [ ] Test file upload
- [ ] Test payment integration

### Integration Tests
- [ ] Test complete order flow
- [ ] Test waitlist flow
- [ ] Test payment proof upload
- [ ] Test admin operations

### End-to-End Tests
- [ ] User registration and login
- [ ] Session browsing and selection
- [ ] Order creation and payment
- [ ] Waitlist join and promotion
- [ ] Admin dashboard operations

### Performance Tests
- [ ] Load testing with multiple concurrent users
- [ ] Database query optimization
- [ ] Image loading optimization
- [ ] API response time monitoring

---

## 🚦 Deployment Steps

### 1. Pre-Deployment
```bash
# 1. Run all tests
npm run test

# 2. Build production bundle
npm run build

# 3. Check for TypeScript errors
npm run type-check

# 4. Check for linting errors
npm run lint
```

### 2. Database Migration
```bash
# 1. Backup existing data (if any)
# 2. Run database migrations
# 3. Verify data integrity
# 4. Test database connections
```

### 3. Deploy to Vercel
```bash
# 1. Push to main branch
git push origin main

# 2. Vercel will auto-deploy
# 3. Monitor deployment logs
# 4. Verify deployment success
```

### 4. Post-Deployment
- [ ] Verify all pages load correctly
- [ ] Test order creation flow
- [ ] Test payment methods
- [ ] Test email notifications
- [ ] Test admin functions
- [ ] Monitor error logs
- [ ] Check performance metrics

---

## 🔧 Configuration Files

### Required Files
- ✅ `.env.local` - Environment variables (not in git)
- ✅ `.env.example` - Example environment variables (in git)
- ✅ `next.config.ts` - Next.js configuration
- ✅ `package.json` - Dependencies
- ✅ `tsconfig.json` - TypeScript configuration

### Vercel Configuration
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "env": {
    "NODE_ENV": "production"
  }
}
```

---

## 📞 Support Contacts

### Technical Support
- Supabase: https://supabase.com/support
- Vercel: https://vercel.com/support
- Resend: https://resend.com/support
- JKO Pay: https://www.jkopay.com/support

### Emergency Contacts
- Database Issues: Check Supabase dashboard
- Payment Issues: Contact JKO Pay support
- Email Issues: Check Resend dashboard
- Deployment Issues: Check Vercel logs

---

## 📝 Notes

### Mock Mode vs Production Mode
All database and API functions currently run in **mock mode** for development:
- Console logs show what would happen
- No actual database writes
- No actual emails sent
- No actual payments processed

To enable **production mode**:
1. Set up real database (Supabase)
2. Configure email service (Resend)
3. Integrate payment gateway (JKO Pay)
4. Update environment variables
5. Replace mock functions with real implementations

### Development vs Production
```typescript
// Current (Development)
if (process.env.NODE_ENV === 'development') {
  console.log('[DEV] Mock operation');
}

// Production (After Setup)
const { data, error } = await supabase
  .from('orders')
  .insert(orderData);
```

---

**Last Updated**: February 6, 2026
**Status**: Ready for Production Setup

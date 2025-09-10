# Single Admin Setup Guide

## Overview
The system has been configured to have **only one administrator** with specific login credentials, while allowing multiple regular users.

## Admin Account Details

### Admin Credentials
- **Email**: `admin@creative-score-hub.com`
- **Password**: You need to create this account in Supabase

### IMPORTANT: Complete Database Setup Required

**All user applications must be logged and visible to admin for approval.**

The system requires complete database setup to ensure:
- ✅ All user applications are automatically logged
- ✅ Admin can see ALL applications regardless of status
- ✅ Complete audit trail of all application changes
- ✅ Proper admin approval workflow

**Setup Steps:**

1. Go to your Supabase project → **SQL Editor**
2. Copy and paste the contents of `complete-application-logging-setup.sql`
3. Click **"Run"**
4. This will create all required tables, policies, and audit logging

**What gets logged:**
- Every application submission by users
- All status changes (draft → submitted → approved/rejected)
- Admin review actions and notes
- Complete audit trail with timestamps
- User profile information for admin review

### How to Create the Admin Account

#### Option 1: Through Supabase Dashboard (Recommended)
1. Go to your Supabase project dashboard
2. Navigate to **Authentication → Users**
3. Click **"Add user"**
4. Enter:
   - Email: `admin@creative-score-hub.com`
   - Password: Choose a secure password
   - Check "Auto Confirm User" (so no email verification needed)
5. Click **"Create user"**

#### Option 2: Through the Application
1. Go to `/admin/login` in your application
2. Try to sign up with `admin@creative-score-hub.com` 
3. The system will automatically assign admin role to this specific email

### Admin Access Points

#### 1. Direct Admin Login
- URL: `/admin/login`
- This page only accepts the admin email
- Shows clear guidance about admin credentials
- Redirects non-admin users appropriately

#### 2. Header Links
- **When not logged in**: Shows "Admin" button in header
- **When logged in as admin**: Shows "Admin Panel" in user dropdown
- **When logged in as regular user**: Shows access denied if trying to access admin areas

### System Behavior

#### For Admin User (`admin@creative-score-hub.com`)
- ✅ Full access to `/admin` dashboard
- ✅ Can view **ALL user applications** regardless of status
- ✅ Can approve, reject, or request more documents
- ✅ Can see complete audit trail of all application changes
- ✅ Real-time notifications for new application submissions
- ✅ Advanced filtering and search capabilities
- ✅ Badge shows "System Administrator"
- ✅ Access to both user dashboard and admin panel

#### For Regular Users (any other email)
- ✅ Can register and login normally
- ✅ Access to user dashboard (`/dashboard`)
- ✅ Can submit applications (automatically logged to admin)
- ✅ Can track their own application status
- ✅ Can communicate with admin through comments
- ❌ **Cannot access `/admin` routes**
- ❌ **Cannot see other users' applications**
- ❌ **No admin privileges**

### Application Logging Features

#### Automatic Logging
- **Every application submission** is automatically logged to admin dashboard
- **Status changes** are tracked with full audit trail
- **User information** is captured for admin review
- **Timestamps** for all actions and status changes

#### Admin Oversight
- **Real-time dashboard** showing all applications
- **Priority indicators** for applications needing urgent review
- **Comprehensive statistics** including approval rates
- **Search and filter** capabilities for large volumes
- **Detailed application views** with all user-provided information

### Security Features

1. **Email-based Admin Check**: Only `admin@creative-score-hub.com` gets admin privileges
2. **Route Protection**: Admin routes are protected by `AdminRoute` component
3. **Database Role Sync**: User profile automatically gets admin role for the admin email
4. **Clear Access Denial**: Non-admin users see clear messaging when trying to access admin areas

### Testing the Setup

#### Test Admin Access
1. Create admin account with email: `admin@creative-score-hub.com`
2. Go to `/admin/login`
3. Login with admin credentials
4. Should redirect to `/admin` with full dashboard access

#### Test Regular User
1. Create any other user account (e.g., `user@example.com`)
2. Login normally through `/auth/login`
3. Try to access `/admin` - should be denied
4. Should only have access to `/dashboard`

### Updating Admin Email

If you need to change the admin email:

1. Edit `/src/hooks/useAdmin.ts`
2. Change the `ADMIN_EMAIL` constant:
```typescript
const ADMIN_EMAIL = 'your-new-admin@example.com';
```
3. Create the new admin account in Supabase
4. Update any existing admin in the database if needed

### Troubleshooting

#### "Could not find the 'role' column" Error
- ✅ **FIRST**: Run `quick-fix-role-column.sql` in Supabase SQL Editor
- ✅ This adds the missing `role` column to the `user_profiles` table
- ✅ Refresh your application after running the SQL

#### "Access Denied" for Admin
- ✅ Verify you're using exactly: `admin@creative-score-hub.com`
- ✅ Check the email is spelled correctly (case-sensitive)
- ✅ Ensure the account exists in Supabase Authentication

#### Regular Users Can't Access Their Dashboard
- ✅ Make sure they're not trying to go to `/admin`
- ✅ Direct them to `/dashboard` instead
- ✅ Verify they're logged in properly

#### Admin Features Not Showing
- ✅ Check browser console for errors
- ✅ Verify admin email matches exactly
- ✅ Refresh the page after login

### Database Note

The system will automatically:
- **Log every user application** to the admin dashboard
- Create user profiles for new users
- Assign `role: 'admin'` to the admin email
- Assign `role: 'user'` to all other emails
- **Track all application status changes** with audit trail
- **Send notifications** to admin for new submissions
- Handle the profile creation on first login
- **Maintain complete audit log** of all application activities

**Admin Dashboard Features:**
- View all applications from all users
- Filter by status (pending, approved, rejected, drafts)
- See priority indicators for urgent reviews
- Access complete application details
- Approve/reject with review notes
- Track approval rates and statistics
- Search and filter large volumes of applications

This ensures complete transparency and proper oversight of all user applications while maintaining security and clear access control.

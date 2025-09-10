# 🔐 Admin Access Setup Guide

## How to Create Admin Users

### Step 1: Run the Admin Setup SQL
1. Go to your Supabase dashboard → SQL Editor
2. Copy and paste the content from `admin-setup.sql`
3. Run the SQL to add role support

### Step 2: Create Your Admin Account
1. **First, sign up normally** at `/auth/signup` with your admin email
2. **Complete the signup process** and verify your account

### Step 3: Grant Admin Access
1. Go to Supabase dashboard → Table Editor → `user_profiles`
2. Find your user record (by email)
3. Edit the `role` field and change it from `user` to `admin`
4. Save the changes

**OR** use SQL in Supabase SQL Editor:
```sql
UPDATE user_profiles 
SET role = 'admin' 
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'your-email@example.com'
);
```

### Step 4: Access Admin Panel
1. Log out and log back in
2. You should now see "Admin Panel" in your user menu
3. Navigate to `/admin` to access the admin dashboard

## User Roles

### `user` (Default)
- Can create and manage their own applications
- Access to personal dashboard
- Cannot see other users' applications

### `reviewer`
- Can view and review all applications
- Can add comments and update status
- Cannot access full admin features

### `admin`
- Full access to all applications
- Can change application status
- Access to analytics and admin features
- Can manage users (future feature)

## Admin Features Available

### Application Management
- ✅ View all applications across all users
- ✅ Filter and search applications
- ✅ Detailed application review interface
- 🔜 Update application status
- 🔜 Add review comments
- 🔜 Export application data

### Security Features
- ✅ Role-based access control
- ✅ Automatic user profile creation
- ✅ Secure route protection
- ✅ Database-level security (RLS policies)

## Multiple Admin Setup

To create multiple admin users:

```sql
-- Method 1: Update existing users
UPDATE user_profiles 
SET role = 'admin' 
WHERE id IN (
  SELECT id FROM auth.users WHERE email IN (
    'admin1@example.com',
    'admin2@example.com',
    'admin3@example.com'
  )
);

-- Method 2: Create reviewer role (limited admin access)
UPDATE user_profiles 
SET role = 'reviewer' 
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'reviewer@example.com'
);
```

## Troubleshooting

### "Access Denied" when accessing `/admin`
1. **Check your role**: Ensure your `user_profiles.role` is set to `admin` or `reviewer`
2. **Clear browser cache**: Log out and log back in
3. **Verify database**: Check if the admin setup SQL was run correctly

### Admin menu not showing
1. **Check user profile**: Ensure your profile exists in `user_profiles` table
2. **Refresh the page**: Sometimes the role needs to be refetched
3. **Check console**: Look for any JavaScript errors

### Can't see other users' applications
1. **Verify RLS policies**: Ensure the admin policies were created correctly
2. **Check role spelling**: Ensure role is exactly `admin` (lowercase)
3. **Database permissions**: Verify Supabase RLS is working correctly

## Future Admin Features

### Coming Soon
- **Application Status Management**: Update status directly from admin panel
- **Bulk Actions**: Approve/reject multiple applications
- **Advanced Analytics**: Detailed reporting and insights
- **User Management**: Manage user accounts and permissions
- **Audit Logs**: Track all admin actions
- **Email Notifications**: Automated notifications for status changes

### Advanced Features (Phase 2)
- **Document Review System**: Review uploaded documents
- **Automated Scoring**: AI-powered application scoring
- **Workflow Management**: Custom approval workflows
- **Integration APIs**: Connect with external systems
- **Mobile Admin App**: Mobile interface for admins

---

**Your admin system is now ready! 🚀**

Remember to always:
1. Sign up first as a regular user
2. Then grant admin access via database
3. Log out and back in to refresh permissions

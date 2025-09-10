# 🚨 URGENT FIX: Database Role Column Error

## The Problem
You're seeing this error:
```
Could not find the 'role' column of 'user_profiles' in the schema cache
```

This means your database is missing the `role` column needed for the admin system.

## Quick Fix (5 minutes)

### Step 1: Run Database Migration
1. **Open Supabase Dashboard**
   - Go to your Supabase project
   - Navigate to **SQL Editor**

2. **Run the Fix Script**
   - Copy the entire contents of `quick-fix-role-column.sql`
   - Paste into the SQL Editor
   - Click **"Run"**

### Step 2: Create Admin Account
1. **In Supabase Dashboard**
   - Go to **Authentication → Users**
   - Click **"Add user"**
   - Email: `admin@creative-score-hub.com`
   - Password: (choose secure password)
   - Check **"Auto Confirm User"**
   - Click **"Create user"**

2. **Set Admin Role** (In SQL Editor)
   ```sql
   UPDATE user_profiles 
   SET role = 'admin' 
   WHERE id = (
     SELECT id FROM auth.users WHERE email = 'admin@creative-score-hub.com'
   );
   ```

### Step 3: Test the Fix
1. **Refresh your application**
2. **Go to** `/admin/login`
3. **Login with admin credentials**
4. **Should work without errors**

## Alternative: If You Want Full Database Setup

If you want the complete database schema with applications table:

1. **Run** `database-schema.sql` in SQL Editor (creates all tables)
2. **Then run** `admin-setup.sql` (adds admin features)
3. **Then create admin account** as described above

## What the Fix Does

- ✅ Adds missing `role` column to `user_profiles` table
- ✅ Sets up proper permissions (RLS policies)
- ✅ Creates table if it doesn't exist
- ✅ Refreshes Supabase schema cache
- ✅ Allows admin system to work properly

## Verification

After running the fix, you should be able to:
- ✅ Access `/admin/login` without errors
- ✅ Login with admin credentials
- ✅ See admin dashboard
- ✅ No more "role column" errors in console

The error should disappear completely and the admin system should work as expected.

## If You Still Have Issues

1. **Check Supabase logs** for detailed error messages
2. **Verify the SQL ran successfully** (no error messages in SQL Editor)
3. **Clear browser cache** and refresh the page
4. **Check that the admin user exists** in Authentication → Users

# Admin Dashboard Troubleshooting Guide

## Overview
I've created a new AdminDashboard component that properly connects to Supabase and handles application details. Here's what was fixed and how to troubleshoot any issues.

## What Was Fixed

### 1. **Replaced Mock Data with Real Database Connection**
- **Previous Issue**: The old Dashboard.tsx used hardcoded mock data
- **Solution**: New AdminDashboard.tsx connects to Supabase `applications` table
- **Result**: Shows real application data from your database

### 2. **Added Application Details Functionality**
- **Previous Issue**: Details buttons had no click handlers
- **Solution**: Added `handleViewDetails()` function with modal dialog
- **Result**: Clicking the eye icon opens detailed application view

### 3. **Improved Error Handling**
- **Previous Issue**: No error feedback when database issues occur
- **Solution**: Added specific error messages for common issues
- **Result**: Clear feedback about database connection problems

## Common Errors and Solutions

### Error 1: "Database tables not found"
**Symptom**: Toast message "Database tables not found. Please run the database migration first."

**Cause**: The `applications` table doesn't exist in your Supabase database.

**Solution**:
1. Open your Supabase Dashboard
2. Go to SQL Editor
3. Run the database schema from `/database-schema.sql`
4. Run the admin setup from `/admin-setup.sql`

### Error 2: "Access Denied"
**Symptom**: Page shows "You don't have permission to access the admin dashboard."

**Cause**: Your user account doesn't have admin role.

**Solution**:
1. Go to Supabase Dashboard → Authentication → Users
2. Find your user account
3. Go to SQL Editor and run:
```sql
UPDATE user_profiles 
SET role = 'admin' 
WHERE id = 'YOUR_USER_ID_HERE';
```

### Error 3: "Failed to load applications"
**Symptom**: Loading spinner appears but no data loads, with error toast.

**Possible Causes & Solutions**:

**A. RLS (Row Level Security) Issues**
- Check if RLS policies are properly set up
- Verify your admin role is correctly assigned

**B. Supabase Connection Issues**
- Check your `.env` file has correct Supabase URL and key
- Verify environment variables are loaded

**C. Network/Authentication Issues**
- Check browser console for detailed error messages
- Verify you're logged in properly

### Error 4: Application Details Don't Show
**Symptom**: Modal opens but shows "Unknown User" or missing data.

**Cause**: User profiles not properly linked or missing data.

**Solution**:
1. Check if `user_profiles` table exists and has data
2. Verify foreign key relationships are set up correctly
3. Ensure users have created profiles after registration

## How to Test the Fix

### 1. **Check Database Setup**
```sql
-- Run this in Supabase SQL Editor to verify tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('applications', 'user_profiles');
```

### 2. **Verify Admin Access**
```sql
-- Check your user role
SELECT * FROM user_profiles WHERE id = auth.uid();
```

### 3. **Test Application Creation**
1. Log out and create a test user account
2. Submit a test application via the user dashboard
3. Log back in as admin and check if it appears

### 4. **Test Application Details**
1. Go to Admin Dashboard → All Applications tab
2. Click the eye icon on any application
3. Modal should open with full application details
4. Try approving/rejecting applications

## Key Features of the New Admin Dashboard

### 1. **Real-Time Data**
- Connects directly to Supabase database
- Shows actual applications submitted by users
- Calculates live statistics

### 2. **Application Management**
- View detailed application information
- Change application status (approve/reject/review)
- Add review notes
- Track submission dates and user information

### 3. **Enhanced UI**
- Responsive design that works on all screen sizes
- Clear status indicators with color coding
- Professional admin interface
- Proper error handling and feedback

### 4. **Security**
- Only accessible to users with admin/reviewer roles
- Protected routes ensure unauthorized access is blocked
- Secure database queries with RLS policies

## Environment Variables Required

Make sure your `.env` file contains:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Next Steps

1. **Test the Admin Dashboard**: Access `/admin` route as an admin user
2. **Submit Test Applications**: Create user accounts and submit applications
3. **Verify Application Flow**: Check that the full user → admin workflow works
4. **Check Data Persistence**: Ensure status changes and review notes are saved

## Getting Help

If you encounter any specific errors:

1. **Check Browser Console**: Look for detailed error messages
2. **Check Supabase Logs**: View real-time logs in Supabase Dashboard
3. **Verify Database State**: Use SQL Editor to check data directly
4. **Test Authentication**: Ensure admin role is properly assigned

The new AdminDashboard is now fully functional and should resolve the application details viewing error you were experiencing!

# Fix Build Errors - Complete Guide

## 🚨 Problem

**20+ TypeScript build errors** due to missing database tables and fields.

The auto-generated TypeScript types (`src/integrations/supabase/types.ts`) are outdated and don't match the actual database schema.

### **Error Examples:**
```typescript
Argument of type '"comments"' is not assignable to parameter of type 'never'
Property 'caption' does not exist on type 'Post'
Property 'parent_post_id' does not exist on type 'Post'
```

---

## ✅ Solution

Run **ONE comprehensive migration** that creates all missing tables and fields.

---

## 📋 Step-by-Step Fix

### **Step 1: Run the Migration (5 minutes)**

1. **Open Supabase Dashboard** → SQL Editor
2. **Copy the entire contents** of `supabase/migrations/007_fix_all_missing_tables_and_fields.sql`
3. **Paste into SQL Editor**
4. **Click "Run"** (or press Cmd/Ctrl + Enter)
5. **Wait for "Success. No rows returned"** message

### **Step 2: Wait for Type Regeneration (1-2 minutes)**

Supabase will automatically:
- Detect schema changes
- Regenerate `src/integrations/supabase/types.ts`
- Update all type definitions

**You'll know it's done when:**
- The timestamp on `types.ts` updates
- Build errors disappear

### **Step 3: Verify in Supabase Dashboard**

Check that tables exist:

**Navigate to:** Table Editor in Supabase Dashboard

**Expected tables:**
- ✅ `comments`
- ✅ `reports`
- ✅ `blocked_users`
- ✅ `admin_users`
- ✅ `posts` (with `caption` and `parent_post_id` columns)

### **Step 4: Verify Build Passes**

```bash
npm run build
```

**Expected output:**
```
✓ built in ~1.5s
✅ 0 TypeScript errors
```

---

## 📊 What This Migration Does

### **Creates 4 Tables:**

#### **1. comments**
```sql
- id (uuid, primary key)
- post_id (references posts)
- user_id (references profiles)
- body (text)
- created_at, updated_at
```

**RLS Policies:**
- Anyone can read comments
- Authenticated users can create comments
- Users can update/delete own comments

---

#### **2. reports**
```sql
- id (uuid, primary key)
- reporter_id (references profiles)
- reported_user_id, post_id, comment_id (optional)
- reason (text)
- description (text)
- status (pending/reviewed/resolved/dismissed)
- moderator_id, moderator_notes
- created_at, updated_at
```

**RLS Policies:**
- Users can create reports
- Users can view own reports
- Admins can view all (requires admin_users entry)

---

#### **3. blocked_users**
```sql
- id (uuid, primary key)
- blocker_id (references profiles)
- blocked_id (references profiles)
- created_at
- Constraint: no_self_block
- Constraint: unique_block (can't block twice)
```

**RLS Policies:**
- Users can view own blocks
- Users can create blocks
- Users can delete own blocks

---

#### **4. admin_users**
```sql
- id (uuid, primary key)
- user_id (unique, references profiles)
- role (moderator/admin/super_admin)
- is_active (boolean)
- created_at, created_by
```

**RLS Policy:**
- Anyone can check if user is admin (for permission checks)

---

### **Adds 2 Columns to `posts`:**

1. **caption** (text)
   - Store post descriptions/captions
   - Used in Stream UI

2. **parent_post_id** (uuid)
   - References original post for remixes
   - Enables remix feature

---

### **Creates Indexes:**

Performance indexes on:
- `comments`: post_id, user_id, created_at
- `reports`: reporter_id, post_id, comment_id, status, created_at
- `blocked_users`: blocker_id, blocked_id
- `admin_users`: user_id
- `posts`: parent_post_id

---

### **Creates Triggers:**

Auto-update triggers for:
- `comments.updated_at`
- `reports.updated_at`

---

## 🧪 Verification Checklist

After running the migration, verify everything:

### **Database Check:**
```sql
-- 1. Check all tables exist
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('comments', 'reports', 'blocked_users', 'admin_users')
ORDER BY table_name;

-- Expected: 4 rows returned

-- 2. Check posts has new columns
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'posts'
AND column_name IN ('caption', 'parent_post_id');

-- Expected: 2 rows returned

-- 3. Check RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('comments', 'reports', 'blocked_users', 'admin_users');

-- Expected: All show rowsecurity = true
```

### **Build Check:**
```bash
npm run build
```

**Expected:**
- ✅ No TypeScript errors
- ✅ Build completes successfully
- ✅ Bundle size: ~600 KB

### **Feature Check:**

Test that features work:
- [ ] Comments - Can post/view/delete comments on posts
- [ ] Reports - Can report posts/comments/users
- [ ] Blocks - Can block users
- [ ] Remix - Can click remix button (navigates to /create?remix=id)
- [ ] Captions - Posts show caption text

---

## 🐛 Troubleshooting

### **Error: "relation already exists"**
- **Cause:** Migration already ran partially
- **Fix:** Migration uses `IF NOT EXISTS` - safe to rerun
- **Action:** Run migration again, it will skip existing tables

### **Error: "policy already exists"**
- **Cause:** Policies from previous migration attempt
- **Fix:** Migration drops existing policies first
- **Action:** Run migration again

### **Types not updating**
- **Cause:** Supabase hasn't regenerated types yet
- **Fix:** Wait 60 seconds, then check again
- **Action:** Refresh Supabase dashboard → Settings → API → Check "Regenerate types"

### **Build still failing**
- **Cause:** Types haven't updated in your local files
- **Fix:** Pull latest types from Supabase
- **Action:** Delete `src/integrations/supabase/types.ts` and let Supabase regenerate it

---

## ⏱️ Timeline

| Step | Duration | Status |
|------|----------|--------|
| Run migration | 2-3 min | ⏳ Pending |
| Wait for types regeneration | 1-2 min | ⏳ Pending |
| Verify build passes | 1 min | ⏳ Pending |
| **Total** | **4-6 min** | ⏳ **Pending** |

---

## 🎯 Success Criteria

The fix is complete when:

1. ✅ Migration runs without errors
2. ✅ All 4 tables exist in database
3. ✅ `posts` has `caption` and `parent_post_id` columns
4. ✅ `src/integrations/supabase/types.ts` includes new tables
5. ✅ `npm run build` completes with 0 errors
6. ✅ All features (comments, reports, blocks, remix) work

---

## 📞 Support

If issues persist after running migration:

1. **Check Supabase logs:** Dashboard → Logs → Look for SQL errors
2. **Verify auth:** Make sure you're logged in to Supabase
3. **Check RLS policies:** Verify policies aren't blocking operations
4. **Manual type refresh:** Dashboard → Settings → API → "Generate types"

---

## 🔒 Security Notes

This migration includes:
- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Policies restrict access appropriately
- ✅ Check constraints prevent invalid data
- ✅ Cascade deletes maintain referential integrity
- ✅ Unique constraints prevent duplicates

**Safe to run in production** - Uses `IF NOT EXISTS` and `DROP POLICY IF EXISTS` to avoid errors.

---

**Status:** ✅ Migration ready to run
**Last Updated:** 2025-11-12
**Estimated Time:** 4-6 minutes total

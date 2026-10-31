# For test — Dubbing Studio

A free starter website with Kurdish, Arabic, and English UI; public project browsing; and Supabase email/password accounts.

## Included
- `index.html` — page structure
- `style.css` — responsive dark theme
- `app.js` — language switcher, project search/filter, Supabase authentication and project loading
- `supabase.sql` — database table and row-level security policies

## Step 1 — Create the Supabase project
1. Go to https://supabase.com/ and create a free account/project.
2. In your project, open **Project Settings → API**.
3. Copy the **Project URL** and the **anon/public key**.
4. Open `app.js` and replace:
   - `YOUR_SUPABASE_URL`
   - `YOUR_SUPABASE_ANON_KEY`
5. The anon/public key is designed to be used in a browser. Never put a `service_role` key in this website.

## Step 2 — Create the database
1. In Supabase, open **SQL Editor → New query**.
2. Paste all content from `supabase.sql` and run it.
3. In **Authentication → Users**, create your own account using the website or dashboard.
4. Copy your user's UUID.
5. In `supabase.sql`, replace all three instances of `REPLACE_WITH_YOUR_USER_UUID` with that UUID, then run the SQL again (or edit the policies in the SQL editor if they already exist).

Important: If you run the SQL a second time, existing policies with the same names may already exist. If so, drop those policies first from the Table Editor, or use the SQL below before rerunning:
```sql
drop policy if exists "Admin can add projects" on public.projects;
drop policy if exists "Admin can update projects" on public.projects;
drop policy if exists "Admin can delete projects" on public.projects;
```

## Step 3 — Add projects
For this starter version, add projects from **Supabase → Table Editor → projects → Insert row**:
- `title`: project title
- `category`: Anime, Movie, or Series
- `description`: short description
- `video_url`: a public YouTube video URL (or another video page URL)
- `poster_url`: optional public image URL

Visitors can browse projects without logging in. Members can create accounts and log in. The first version does not yet include a website admin upload form; projects are added through Supabase Table Editor.

Use videos and artwork you own or have permission to publish. Avoid uploading copyrighted material without permission.

## Step 4 — Test locally
Open `index.html` in a browser. For full authentication testing, it is best to serve the folder using a local web server (for example VS Code Live Server), rather than opening it as a `file://` URL.

## Step 5 — Publish free with GitHub Pages
1. Create/sign in to https://github.com/
2. Create a new **public repository** named `for-test-dubbing`.
3. Upload `index.html`, `style.css`, `app.js`, `supabase.sql`, and `SETUP.md` to the repository root.
4. In repository **Settings → Pages**, choose **Deploy from a branch**.
5. Choose branch `main`, folder `/ (root)`, then Save.
6. GitHub will show your public website URL after deployment.

## Notes
- GitHub Pages hosts the website files; it is not a video storage server.
- Use YouTube embeds/links or a video host with a suitable free plan. Free services have storage, bandwidth, and usage limits that can change.
- Supabase free projects have plan limits and may pause after inactivity. Check the current plan details before relying on it for a public launch.
- Do not share passwords or secret service-role keys.

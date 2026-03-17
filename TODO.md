# Convo Sharing TODO

## Approved Plan Steps (from analysis)

### 1. Fix Git (Remote/Push)
`Siddhartha-Nayak/convo-sharing`
- [x] Rename local branch master → main: `git branch -M main`
- [x] Push: `git push -u origin main` (successfully pushed to origin)

### 2. Firebase/.env (User: confirmed setup)
- [ ] Copy .env.example → .env, fill VITE_FIREBASE_* vars
- [ ] Verify .env ignored in .gitignore

### 3. Test Project
- [x] `npm install --legacy-peer-deps` (success)
- [starting] `npm run dev`
- [ ] Open localhost:5173, test chat/landing (needs .env Firebase config)

### 4. Polish
- [x] Update package.json name to 'convo-sharing'
- [ ] Commit/push further changes (after repo create)

*Progress tracked here. Mark [x] as complete.*

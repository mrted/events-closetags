# Production Configuration Guide

## Hardcoded Configuration

### Frontend Admin (Vercel)
The API URL is now hardcoded in `lib/api.ts`:
```typescript
const API_BASE_URL = 'https://fevent.pythonanywhere.com/api/v1';
```

**No environment variables needed!** The app will automatically connect to the production backend.

### Backend (PythonAnywhere)
All settings are hardcoded in `settings.py`:

```python
SECRET_KEY = 'django-insecure-o01(v$qh_8j!c!y46&_k%4hd12@m=(8362gk^xt(tn)_eselu_'
DEBUG = True
ALLOWED_HOSTS = ['*']
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://localhost:8081', 
    'https://event-management-admin-two.vercel.app',
]
```

**No environment variables needed!** Just deploy the code as-is.

### Mobile App (React Native)
The API URL is hardcoded in `.env`:

```
EXPO_PUBLIC_API_URL=https://fevent.pythonanywhere.com/api/v1
```

## Deployment URLs

- **Backend API**: https://fevent.pythonanywhere.com
- **Frontend Admin**: https://event-management-admin-two.vercel.app
- **Mobile App**: Expo development build

## Deployment Steps

### Frontend Admin (Vercel)
1. Push code to GitHub
2. Vercel will automatically redeploy
3. No configuration needed - API URL is hardcoded

### Backend (PythonAnywhere)  
1. Pull latest code: `git pull origin main`
2. Install requirements: `pip install -r requirements.txt`
3. Run migrations: `python manage.py migrate`
4. Create users: `python create_users.py`
5. Reload web app in PythonAnywhere dashboard

### Mobile App
1. The API URL is already configured
2. Restart Expo: `npx expo start -c`
3. Test on device or simulator

## Test Credentials

- **Admin**: `admin` / `admin123`
- **Staff**: `staff` / `staff123`
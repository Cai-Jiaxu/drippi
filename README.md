# DripDaddy
DripDaddy is a peer-to-peer (C2C) platform that lets you rent outfits from other users or list your own outfits for others to rent.

Modern web application with:
- **Frontend**: Next.js (TypeScript) + CSS Tailwind + shadcn
- **Backend**: Django REST Framework
- **Database**: Supabase
- **Auth**: Clerk

# Features
DripDaddy lets users:
1. Browse outfits posted by other users
2. List their own clothes for rent (with images, price, etc.)
3. View and manage their listings and rentals

## Local Development Setup

### 1. Clone the repository
git clone https://github.com/Cai-Jiaxu/drippi.git
cd drippi

2. Backend Setup (Django)
# Set up virtual environment
python -m venv env
source env/bin/activate  # Linux/Mac
.\env\Scripts\activate   # Windows

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp django/.env.example django/.env
# Edit django/.env with:
# - Clerk credentials
# - Supabase DB credentials

# Run migrations
python manage.py migrate

# Install dependencies
pip install -r requirements.txt

3. Frontend Setup (Next.js)
cd frontend  # or your Next.js directory name
npm install
cp .env.local.example .env.local
# Edit .env.local with:
# - Clerk publishable key
# - Supabase connection
# - API base URL

4. Run Development Servers
# Terminal 1 (Django backend)
python manage.py runserver

# Terminal 2 (Next.js frontend)
cd frontend
npm run dev

Access:
Frontend: http://localhost:3000
Django Admin: http://localhost:8000

## Configuration
Django (.env)

# Clerk Configuration
CLERK_JWT_PUBLIC_KEY=your_public_key
CLERK_API_KEY=your_api_key

# Supabase DB
DATABASE_URL=postgresql://postgres:password@db.supabase.co:5432/postgres

Next.js (.env.local)
# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard

# Supabase (for DB only)
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

## Deployment
# Frontend
vercel deploy --prod

# Backend (requires WSGI server)
pip install gunicorn
gunicorn core.wsgi:application

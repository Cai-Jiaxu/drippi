# DripDaddy

DripDaddy is a peer-to-peer (C2C) platform that lets you rent outfits from other users or list your own outfits for others to rent.

Modern web application with:  
- **Frontend**: Next.js (TypeScript) + Tailwind CSS + ShadCN UI  
- **Backend**: Django REST Framework  
- **Database**: Supabase  
- **Auth**: Clerk  

## Features

DripDaddy lets users:  
1. Browse outfits posted by other users  
2. List their own clothes for rent (with images, price, etc.)  
3. View and manage their listings and rentals  

## Local Development Setup

### 1. Clone the repository

```bash
git clone https://github.com/Cai-Jiaxu/drippi.git
cd drippi
```

### 2. Backend Setup (Django)

```bash
python -m venv env
source env/bin/activate  # Linux/Mac
.\env\Scripts\activate   # Windows

pip install -r requirements.txt

cp django/.env.example django/.env
# Edit django/.env with Clerk credentials and Supabase DB credentials

python manage.py migrate
```

### 3. Frontend Setup (Next.js)

```bash
cd frontend  # or your Next.js directory name
npm install --force

cp .env.local.example .env.local
# Edit .env.local with Clerk publishable key, Supabase connection, API base URL
```

### 4. Run Development Servers

Terminal 1 (Django backend):

```bash
python manage.py runserver
```
Terminal 2 (Next.js frontend):
```bash
cd frontend
npm run dev
```

### Configuration

Django (.env)
```bash
CLERK_JWT_PUBLIC_KEY=your_public_key
CLERK_API_KEY=your_api_key
DATABASE_URL=postgresql://postgres:password@db.supabase.co:5432/postgres
```

Next.js (.env.local)
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Contact @jiaxucai on Telegram for environment variables

#!/bin/bash

# Immediate fix script for VPS database issue
# Run this on your VPS to fix the "jobs table does not exist" error

echo "🛠️ GovtJobsNow Database Fix Script"
echo "=================================="
echo "This will fix the missing database tables on your VPS"

# Go to application directory
cd /opt/govtjobnow

echo "📊 Checking current database status..."
docker compose exec -T postgres psql -U postgres -d govtjobnow -c "\dt" || echo "⚠️ Tables not found - this is expected"

echo "🔧 Running database migration..."
# Try normal push first
if docker compose exec -T app npm run db:push; then
    echo "✅ Database migration successful!"
else
    echo "⚠️ Normal migration failed, trying force migration..."
    if docker compose exec -T app npx drizzle-kit push --force; then
        echo "✅ Force migration successful!"
    else
        echo "❌ Database migration failed. Trying alternative approach..."
        # Alternative: restart services and try again
        echo "🔄 Restarting services..."
        docker compose down
        sleep 5
        docker compose up -d
        sleep 20
        echo "🔁 Retrying database migration..."
        docker compose exec -T app npx drizzle-kit push --force
    fi
fi

echo "📋 Verifying database tables..."
docker compose exec -T postgres psql -U postgres -d govtjobnow -c "\dt"

echo "🧪 Testing application..."
sleep 10
if docker compose exec -T app curl -f http://localhost:3000/api/stats >/dev/null 2>&1; then
    echo "✅ Application is healthy!"
    echo "🎉 Database fix completed successfully!"
    echo ""
    echo "📱 Your admin dashboard should now work at: https://govtjobnow.com/admin/login"
    echo "🌐 Main website: https://govtjobnow.com"
else
    echo "⚠️ Application might still be starting up"
    echo "💡 Check logs with: docker compose logs -f app"
fi

echo ""
echo "🔍 Useful commands for monitoring:"
echo "   docker compose ps                    # Check service status"
echo "   docker compose logs -f app          # View application logs"
echo "   docker compose logs -f postgres     # View database logs"
echo "   docker compose restart              # Restart all services"
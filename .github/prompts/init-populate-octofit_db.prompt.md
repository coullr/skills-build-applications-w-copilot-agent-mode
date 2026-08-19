---
name: init-populate-octofit_db
agent: agent
description: 'Configure MongoDB and seed octofit_db for the Octofit multi-tier application'
---

Set up and populate the MongoDB data tier for the existing Express/TypeScript backend in `octofit-tracker/backend`.

Requirements:

1. Use MongoDB with Mongoose.
2. Use connection string for local MongoDB on port `27017` and database `octofit_db`.
3. Preserve existing Mongoose models and database configuration when they already exist; create or complete models for users, teams, activities, leaderboard, and workouts only as needed.
4. Add a seed script at `src/scripts/seed.ts`.
5. Include this help/description text in the seed script comments or logs:
   `Seed the octofit_db database with test data`.
6. Insert realistic sample data for all collections.
7. Before seeding, explicitly check whether MongoDB is running with `ps aux | grep mongod`. If it is unavailable, stop and report the prerequisite instead of silently claiming success.
8. Use the backend package scripts with path-qualified commands, such as `npm --prefix octofit-tracker/backend run build` and `npm --prefix octofit-tracker/backend run seed`.
9. Verify data creation through the existing API routes (`/api/users`, `/api/teams`, `/api/activities`, `/api/leaderboard`, and `/api/workouts`) after starting the backend on port `8000` when MongoDB is available.
10. If the backend or seed script is run without MongoDB, emit a clear prerequisite error that tells the user to start `mongod` and rerun the seed step.

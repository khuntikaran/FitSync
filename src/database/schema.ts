export const DATABASE_VERSION = 1;
export const DATABASE_NAME = 'FitTrackPro.db';

export const CREATE_TABLES = `
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    age INTEGER NOT NULL CHECK(age >= 13 AND age <= 100),
    gender TEXT NOT NULL CHECK(gender IN ('male', 'female', 'other')),
    height_cm REAL NOT NULL CHECK(height_cm > 0),
    weight_kg REAL NOT NULL CHECK(weight_kg > 0),
    activity_level TEXT NOT NULL CHECK(activity_level IN ('sedentary', 'light', 'moderate', 'active', 'very_active')),
    bmr REAL NOT NULL,
    tdee REAL NOT NULL,
    unit_system TEXT DEFAULT 'metric' CHECK(unit_system IN ('metric', 'imperial')),
    fitness_goal TEXT CHECK(fitness_goal IN ('lose_weight', 'maintain', 'gain_muscle')),
    target_weight_kg REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS exercises (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    primary_muscles TEXT NOT NULL,
    secondary_muscles TEXT,
    equipment TEXT NOT NULL,
    met_value REAL NOT NULL CHECK(met_value > 0),
    difficulty TEXT NOT NULL CHECK(difficulty IN ('beginner', 'intermediate', 'advanced')),
    description TEXT,
    instructions TEXT,
    tips TEXT,
    is_favorite INTEGER DEFAULT 0,
    image_asset TEXT
);

CREATE TABLE IF NOT EXISTS workout_sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    date TEXT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME,
    name TEXT NOT NULL,
    workout_type TEXT NOT NULL,
    template_id TEXT,
    total_calories_burned REAL DEFAULT 0,
    total_volume_kg REAL DEFAULT 0,
    total_duration_seconds INTEGER DEFAULT 0,
    notes TEXT,
    feeling TEXT CHECK(feeling IN ('great', 'good', 'average', 'poor', 'terrible')),
    rating INTEGER CHECK(rating >= 1 AND rating <= 5),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS workout_exercises (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    exercise_id TEXT NOT NULL,
    exercise_name TEXT NOT NULL,
    calories_burned REAL DEFAULT 0,
    duration_seconds INTEGER DEFAULT 0,
    order_index INTEGER NOT NULL,
    rest_time_seconds INTEGER DEFAULT 90,
    notes TEXT,
    FOREIGN KEY (session_id) REFERENCES workout_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (exercise_id) REFERENCES exercises(id)
);

CREATE TABLE IF NOT EXISTS exercise_sets (
    id TEXT PRIMARY KEY,
    workout_exercise_id TEXT NOT NULL,
    set_number INTEGER NOT NULL,
    reps INTEGER CHECK(reps >= 0),
    weight_kg REAL CHECK(weight_kg >= 0),
    completed INTEGER DEFAULT 0 CHECK(completed IN (0, 1)),
    rpe INTEGER CHECK(rpe >= 1 AND rpe <= 10),
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (workout_exercise_id) REFERENCES workout_exercises(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_workout_sessions_user_date ON workout_sessions(user_id, date);
CREATE INDEX IF NOT EXISTS idx_workout_exercises_session ON workout_exercises(session_id);
CREATE INDEX IF NOT EXISTS idx_exercise_sets_workout_exercise ON exercise_sets(workout_exercise_id);
`;

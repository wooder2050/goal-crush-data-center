-- Goal Crush Data Center table creation
-- Player table
CREATE TABLE players (
    player_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    birth_date DATE,
    position VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team table
CREATE TABLE teams (
    team_id SERIAL PRIMARY KEY,
    team_name VARCHAR(255) NOT NULL UNIQUE
);

-- Season table
CREATE TABLE seasons (
    season_id SERIAL PRIMARY KEY,
    season_name VARCHAR(255) NOT NULL,
    year INTEGER NOT NULL
);

-- Team-Season mapping table
CREATE TABLE team_seasons (
    id SERIAL PRIMARY KEY,
    team_id INTEGER NOT NULL REFERENCES teams(team_id) ON DELETE CASCADE,
    season_id INTEGER NOT NULL REFERENCES seasons(season_id) ON DELETE CASCADE,
    UNIQUE(team_id, season_id)
);

-- Player-Team history table
CREATE TABLE player_team_history (
    id SERIAL PRIMARY KEY,
    player_id INTEGER NOT NULL REFERENCES players(player_id) ON DELETE CASCADE,
    team_id INTEGER NOT NULL REFERENCES teams(team_id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE
);

-- Match table
CREATE TABLE matches (
    match_id SERIAL PRIMARY KEY,
    match_date DATE NOT NULL,
    season_id INTEGER NOT NULL REFERENCES seasons(season_id) ON DELETE CASCADE,
    home_team_id INTEGER NOT NULL REFERENCES teams(team_id) ON DELETE CASCADE,
    away_team_id INTEGER NOT NULL REFERENCES teams(team_id) ON DELETE CASCADE,
    home_score INTEGER,
    away_score INTEGER,
    location VARCHAR(255)
);

-- Player match statistics table
CREATE TABLE player_match_stats (
    id SERIAL PRIMARY KEY,
    match_id INTEGER NOT NULL REFERENCES matches(match_id) ON DELETE CASCADE,
    player_id INTEGER NOT NULL REFERENCES players(player_id) ON DELETE CASCADE,
    team_id INTEGER NOT NULL REFERENCES teams(team_id) ON DELETE CASCADE,
    goals INTEGER NOT NULL DEFAULT 0,
    played BOOLEAN NOT NULL DEFAULT FALSE
);

-- Player season statistics table
CREATE TABLE player_season_stats (
    id SERIAL PRIMARY KEY,
    player_id INTEGER NOT NULL REFERENCES players(player_id) ON DELETE CASCADE,
    season_id INTEGER NOT NULL REFERENCES seasons(season_id) ON DELETE CASCADE,
    team_id INTEGER NOT NULL REFERENCES teams(team_id) ON DELETE CASCADE,
    total_matches INTEGER NOT NULL DEFAULT 0,
    total_goals INTEGER NOT NULL DEFAULT 0,
    total_assists INTEGER DEFAULT 0,
    minutes_played INTEGER DEFAULT 0,
    UNIQUE(player_id, season_id, team_id)
);

-- Team season statistics table
CREATE TABLE team_season_stats (
    id SERIAL PRIMARY KEY,
    team_id INTEGER NOT NULL REFERENCES teams(team_id) ON DELETE CASCADE,
    season_id INTEGER NOT NULL REFERENCES seasons(season_id) ON DELETE CASCADE,
    matches_played INTEGER NOT NULL DEFAULT 0,
    wins INTEGER NOT NULL DEFAULT 0,
    draws INTEGER NOT NULL DEFAULT 0,
    losses INTEGER NOT NULL DEFAULT 0,
    goals_scored INTEGER NOT NULL DEFAULT 0,
    goals_conceded INTEGER NOT NULL DEFAULT 0,
    points INTEGER NOT NULL DEFAULT 0,
    UNIQUE(team_id, season_id)
);

-- Standings table
CREATE TABLE standings (
    id SERIAL PRIMARY KEY,
    season_id INTEGER NOT NULL REFERENCES seasons(season_id) ON DELETE CASCADE,
    team_id INTEGER NOT NULL REFERENCES teams(team_id) ON DELETE CASCADE,
    rank INTEGER NOT NULL,
    points INTEGER NOT NULL,
    goal_difference INTEGER NOT NULL,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(season_id, team_id)
);

-- Create indexes
CREATE INDEX idx_players_name ON players(name);
CREATE INDEX idx_matches_date ON matches(match_date);
CREATE INDEX idx_matches_season ON matches(season_id);
CREATE INDEX idx_player_match_stats_match ON player_match_stats(match_id);
CREATE INDEX idx_player_match_stats_player ON player_match_stats(player_id);
CREATE INDEX idx_player_season_stats_player ON player_season_stats(player_id);
CREATE INDEX idx_player_season_stats_season ON player_season_stats(season_id);
CREATE INDEX idx_team_season_stats_team ON team_season_stats(team_id);
CREATE INDEX idx_team_season_stats_season ON team_season_stats(season_id);
CREATE INDEX idx_standings_season ON standings(season_id);
CREATE INDEX idx_standings_rank ON standings(rank);

-- Enable Row Level Security
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_team_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_match_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_season_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_season_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE standings ENABLE ROW LEVEL SECURITY;

-- Default RLS policies (allow read access to all users)
CREATE POLICY "Allow read access to all users" ON players FOR SELECT TO public USING (true);
CREATE POLICY "Allow read access to all users" ON teams FOR SELECT TO public USING (true);
CREATE POLICY "Allow read access to all users" ON seasons FOR SELECT TO public USING (true);
CREATE POLICY "Allow read access to all users" ON team_seasons FOR SELECT TO public USING (true);
CREATE POLICY "Allow read access to all users" ON player_team_history FOR SELECT TO public USING (true);
CREATE POLICY "Allow read access to all users" ON matches FOR SELECT TO public USING (true);
CREATE POLICY "Allow read access to all users" ON player_match_stats FOR SELECT TO public USING (true);
CREATE POLICY "Allow read access to all users" ON player_season_stats FOR SELECT TO public USING (true);
CREATE POLICY "Allow read access to all users" ON team_season_stats FOR SELECT TO public USING (true);
CREATE POLICY "Allow read access to all users" ON standings FOR SELECT TO public USING (true);

-- Only authenticated users can modify data
CREATE POLICY "Allow insert for authenticated users" ON players FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow update for authenticated users" ON players FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow delete for authenticated users" ON players FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow insert for authenticated users" ON teams FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow update for authenticated users" ON teams FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow delete for authenticated users" ON teams FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow insert for authenticated users" ON seasons FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow update for authenticated users" ON seasons FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow delete for authenticated users" ON seasons FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow insert for authenticated users" ON team_seasons FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow update for authenticated users" ON team_seasons FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow delete for authenticated users" ON team_seasons FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow insert for authenticated users" ON player_team_history FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow update for authenticated users" ON player_team_history FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow delete for authenticated users" ON player_team_history FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow insert for authenticated users" ON matches FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow update for authenticated users" ON matches FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow delete for authenticated users" ON matches FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow insert for authenticated users" ON player_match_stats FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow update for authenticated users" ON player_match_stats FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow delete for authenticated users" ON player_match_stats FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow insert for authenticated users" ON player_season_stats FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow update for authenticated users" ON player_season_stats FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow delete for authenticated users" ON player_season_stats FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow insert for authenticated users" ON team_season_stats FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow update for authenticated users" ON team_season_stats FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow delete for authenticated users" ON team_season_stats FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow insert for authenticated users" ON standings FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow update for authenticated users" ON standings FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow delete for authenticated users" ON standings FOR DELETE TO authenticated USING (true);

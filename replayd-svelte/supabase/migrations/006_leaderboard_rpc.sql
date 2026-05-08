-- Migration 006: Server-side leaderboard aggregation RPC

CREATE OR REPLACE FUNCTION public.get_leaderboard(p_limit INT DEFAULT 20)
RETURNS TABLE (
  user_id UUID,
  name VARCHAR,
  games_played BIGINT,
  games_won BIGINT,
  win_rate DOUBLE PRECISION,
  avg_timeline_length DOUBLE PRECISION
) AS $$
BEGIN
  RETURN QUERY
  WITH player_stats AS (
    SELECT
      p.user_id,
      p.name,
      p.id AS player_id,
      r.id AS room_id,
      CASE WHEN r.winner_player_id = p.id THEN 1 ELSE 0 END AS is_winner
    FROM public.players p
    INNER JOIN public.rooms r ON r.id = p.room_id AND r.status = 'finished'
  ),
  timeline_counts AS (
    SELECT
      t.player_id,
      COUNT(*) AS tl_count
    FROM public.timelines t
    GROUP BY t.player_id
  ),
  aggregated AS (
    SELECT
      ps.user_id,
      (array_agg(ps.name))[1] AS name,
      COUNT(*) AS games_played,
      SUM(ps.is_winner) AS games_won,
      COALESCE(SUM(tc.tl_count), 0) AS total_timeline
    FROM player_stats ps
    LEFT JOIN timeline_counts tc ON tc.player_id = ps.player_id
    GROUP BY ps.user_id
  )
  SELECT
    a.user_id,
    a.name::VARCHAR,
    a.games_played,
    a.games_won,
    CASE WHEN a.games_played > 0 THEN a.games_won::DOUBLE PRECISION / a.games_played ELSE 0 END AS win_rate,
    CASE WHEN a.games_played > 0 THEN a.total_timeline::DOUBLE PRECISION / a.games_played ELSE 0 END AS avg_timeline_length
  FROM aggregated a
  ORDER BY a.games_won DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

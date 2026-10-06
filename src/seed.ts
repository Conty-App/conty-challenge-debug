import type { DatabaseSync } from "node:sqlite";

export function seedIncident(db: DatabaseSync): void {
  const row = db.prepare("SELECT COUNT(*) AS n FROM missions").get() as { n: number } | undefined;
  if (!row || row.n > 0) return;

  const insert = db.prepare(
    "INSERT INTO missions (id, creator_id, amount_cents, deadline_date, status) VALUES (?, ?, ?, ?, 'open')",
  );
  insert.run("msn_1842", "crt_ana", 15000, "2026-03-12");
  insert.run("msn_1900", "crt_bruno", 15000, "2026-03-20");
  insert.run("msn_2044", "crt_caio", 8000, "2026-04-02");
}

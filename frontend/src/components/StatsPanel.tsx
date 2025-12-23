import type { ActivityFilters } from "../api/types";
import { useStats } from "../hooks/useStats";

type Props = {
  filters: ActivityFilters;
};

function formatMinutes(totalMinutes: number) {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h <= 0) return `${m} min`;
  return `${h}h ${m}m`;
}

export function StatsPanel({ filters }: Props) {
  const categories =
    filters.category && filters.category.trim().length > 0 ? [filters.category.trim()] : undefined;

  const { status, total, byCategory, byDay, reload } = useStats({
    categories,
    from: filters.from,
    to: filters.to,
  });

  return (
    <div className="stats">
      <div className="statsHeader">
        <div>
          <h2 className="statsTitle">Stats</h2>
          <div className="statsHint">
            Uses filters: <strong>category/from/to</strong> (search <code>q</code> does not affect stats)
          </div>
        </div>

        <button className="statsBtn" type="button" onClick={reload} disabled={status === "loading"}>
          {status === "loading" ? "Loading..." : "Refresh"}
        </button>
      </div>

      {status === "error" && (
        <div className="statsState statsError">
          <p>Failed to load stats.</p>
          <button className="statsBtn" type="button" onClick={reload}>Retry</button>
        </div>
      )}

      {status === "loading" && <div className="statsState">Loading stats...</div>}

      {status === "success" && (
        <>
          <div className="statsCards">
            <div className="statsCard">
              <div className="statsLabel">Total time</div>
              <div className="statsValue">{formatMinutes(total?.totalMinutes ?? 0)}</div>
              <div className="statsSub">{total?.totalMinutes ?? 0} minutes</div>
            </div>

            <div className="statsCard">
              <div className="statsLabel">Days in range</div>
              <div className="statsValue">{byDay.length}</div>
              <div className="statsSub">Aggregated by date</div>
            </div>
          </div>

          <div className="statsSection">
            <h3 className="statsSectionTitle">By category</h3>
            {byCategory.length === 0 ? (
              <div className="statsEmpty">No data.</div>
            ) : (
              <ul className="statsList">
                {byCategory.map((x) => (
                  <li className="statsRow" key={x.category}>
                    <span className="statsRowKey">{x.category}</span>
                    <span className="statsRowVal">{formatMinutes(x.totalMinutes)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="statsSection">
            <h3 className="statsSectionTitle">By day</h3>
            {byDay.length === 0 ? (
              <p className="statsEmpty">No data.</p>
            ) : (
              <ul className="statsList">
                {byDay.map((x) => (
                  <li className="statsRow" key={x.date}>
                    <span className="statsRowKey">{x.date}</span>
                    <span className="statsRowVal">{formatMinutes(x.totalMinutes)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}

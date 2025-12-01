import React, { useMemo } from "react";
import { AnalyticsData, AlertType, Course, Alert } from "../types";

interface AnalyticsDashboardProps {
  data: AnalyticsData;
  onRequestCertificate: (course: Course) => void;
  onBackToDashboard: () => void;
}

/* ---------- helpers ---------- */

const prettyType = (type: string) => {
  return type.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

const severityForType = (type: AlertType | string) => {
  // map some common proctor alert types to severity levels
  if (type === "system") return "info";
  if (type === "tab-switch" || type === "fullscreen_exit") return "warning";
  if (type === "multiple-faces" || type === "phone-detected") return "critical";
  if (type.includes("looking") || type.includes("head") || type.includes("away")) return "warning";
  return "warning";
};

const severityBadgeClass = (sev: string) => {
  switch (sev) {
    case "info":
      return "bg-blue-100 text-blue-700";
    case "warning":
      return "bg-yellow-100 text-yellow-800";
    case "critical":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getAlertColor = (type: AlertType | string) => {
  switch (type) {
    case "system":
      return "text-blue-500";
    case "tab-switch":
      return "text-yellow-500";
    case "fullscreen_exit":
      return "text-yellow-600";
    case "multiple-faces":
      return "text-red-600";
    default:
      return "text-red-500";
  }
};

const groupCounts = (alerts: Alert[]) => {
  return alerts.reduce<Record<string, number>>((acc, a) => {
    const key = a.type || "unknown";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
};

/* ---------- component ---------- */

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  data,
  onRequestCertificate,
  onBackToDashboard,
}) => {
  const { score, totalQuestions, alerts, course } = data;
  const nonSystemAlerts = alerts.filter((a) => a.type !== "system");
  const pass = score / totalQuestions >= 0.75;

  // breakdown counts
  const breakdown = useMemo(() => groupCounts(alerts), [alerts]);

  // sorted timeline (newest first)
  const timeline = useMemo(() => {
    // if alerts have numeric id/time ordering, keep as-is; otherwise sort by timestamp string where possible
    const clone = [...alerts];
    // try to sort by timestamp if it's parseable, otherwise keep given order (most recent first assumed)
    clone.sort((a, b) => {
      const ta = Date.parse(a.timestamp);
      const tb = Date.parse(b.timestamp);
      if (!isNaN(ta) && !isNaN(tb)) return tb - ta;
      return b.id - a.id;
    });
    return clone;
  }, [alerts]);

  // derive malpracticeDetected: if non-system alerts exceed threshold (5 in your flow)
  const malpracticeDetected = nonSystemAlerts.length >= 5;

  return (
    <div className="bg-white p-8 rounded-lg shadow-xl max-w-5xl mx-auto">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-dark mb-1">Exam Results & Analytics</h2>
          <p className="text-md text-secondary mb-4">{course.title}</p>
        </div>

        <div className="flex gap-3 items-center">
          <div className={`p-4 rounded-lg ${pass ? "bg-green-50" : "bg-red-50"} text-center`}>
            <div className="text-xs text-gray-500">Result</div>
            <div className={`text-xl font-bold ${pass ? "text-green-700" : "text-red-700"}`}>
              {pass ? "Pass" : "Fail"}
            </div>
          </div>
          <div className="p-4 rounded-lg bg-blue-50 text-center">
            <div className="text-xs text-gray-500">Score</div>
            <div className="text-xl font-bold text-blue-700">{score} / {totalQuestions}</div>
          </div>
          <div className="p-4 rounded-lg bg-yellow-50 text-center">
            <div className="text-xs text-gray-500">Violations</div>
            <div className="text-xl font-bold text-yellow-700">{nonSystemAlerts.length}</div>
          </div>
        </div>
      </div>

      {/* Malpractice banner */}
      {malpracticeDetected && (
        <div className="mt-6 p-4 rounded-lg border-l-4 border-red-500 bg-red-50 flex items-start gap-4">
          <div className="text-red-700 font-semibold">Malpractice detected</div>
          <div className="text-sm text-red-700">
            Multiple integrity violations were recorded during this attempt. The exam may have been exited automatically.
            Please contact support for review or check the attempt history.
          </div>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Proctoring summary & timeline */}
        <div className="lg:col-span-2 space-y-6">
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="text-lg font-semibold mb-3">Proctoring Summary</h3>
            {alerts.length > 0 ? (
              <ul className="space-y-2 max-h-56 overflow-auto">
                {timeline.map((alert) => (
                  <li key={alert.id} className="flex items-start gap-3 p-2 rounded hover:bg-white">
                    <div>
                      <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${severityBadgeClass(severityForType(alert.type))}`}>
                        {prettyType(alert.type)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-800">{alert.message}</div>
                            <div className="text-xs text-gray-400 mt-1">{alert.timestamp}</div>
                    </div>
                    <div className="w-16 text-right">
                      <div className={`text-sm ${getAlertColor(alert.type)}`}>{alert.type === "system" ? "SYSTEM" : alert.type}</div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-sm text-gray-500">No alerts were recorded during the session.</div>
            )}
          </div>

          {/* Violation breakdown */}
          <div className="border rounded-lg p-4 bg-white">
            <h3 className="text-lg font-semibold mb-3">Violation Breakdown</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.keys(breakdown).length > 0 ? (
                Object.entries(breakdown).map(([type, count]) => {
                  const sev = severityForType(type);
                  return (
                    <div key={type} className="flex items-center gap-3 p-3 border rounded-md">
                      <div className={`w-9 h-9 rounded-full grid place-items-center ${severityBadgeClass(sev)}`}>
                        <span className="text-sm font-semibold">{count}</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium">{prettyType(type)}</div>
                        <div className="text-xs text-gray-500">{sev === "critical" ? "High" : sev === "warning" ? "Medium" : "Info"}</div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-sm text-gray-500 col-span-full">No recorded violations.</div>
              )}
            </div>
          </div>
        </div>

        {/* Right: quick stats + actions */}
        <div className="space-y-6">
          <div className="border rounded-lg p-4 bg-white">
            <h4 className="text-sm text-gray-500">Quick Stats</h4>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="text-gray-600">Total alerts</div>
                <div className="font-semibold">{alerts.length}</div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="text-gray-600">Non-system alerts</div>
                <div className="font-semibold">{nonSystemAlerts.length}</div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="text-gray-600">Most common</div>
                <div className="font-semibold">{Object.keys(breakdown).length ? Object.entries(breakdown).sort((a,b)=>Number(b[1]) - Number(a[1]))[0][0].replace(/-/g,' ') : '—'}</div>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-4 bg-white">
            <h4 className="text-sm text-gray-500 mb-3">Actions</h4>
            <div className="flex flex-col gap-3">
              <button
                onClick={onBackToDashboard}
                className="w-full px-4 py-2 rounded bg-gray-800 text-white text-sm font-semibold hover:opacity-95"
              >
                Back to Dashboard
              </button>

              {pass && (
                <button
                  // onClick={() => onRequestCertificate(course)}
                  // className="w-full px-4 py-2 rounded bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700"
                >
                  {/* Request Certificate */}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;

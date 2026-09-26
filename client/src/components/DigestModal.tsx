import { useEffect, useState } from "react";

import Modal from "./ui/Modal";
import {
  getProjectDigestApi,
  type ProjectDigest,
} from "../features/task/taskApi";

type Props = {
  open: boolean;
  close: () => void;
  projectId: string;
  cached: boolean;
  aiUsed: boolean;
};

export default function DigestModal({
  open,
  close,
  projectId,
}: Props) {
  const [digest, setDigest] = useState<ProjectDigest | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    getProjectDigestApi(projectId)
      .then((d) => {
        if (cancelled) return;
        setDigest(d);
        setError("");
        setLoading(false);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e.response?.data?.message || "Something went wrong.");
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, projectId]);

  const tiles = digest && [
    { label: "Total", value: digest.stats.total, color: "text-gray-800" },
    {
      label: "In progress",
      value: digest.stats.inProgress + digest.stats.review,
      color: "text-indigo-600",
    },
    { label: "Done", value: digest.stats.done, color: "text-green-600" },
    { label: "Overdue", value: digest.stats.overdue, color: "text-red-600" },
  ];

  return (
    <Modal open={open} close={close} title="Weekly digest">
      <div className="space-y-5 max-h-[70vh] overflow-y-auto">
        {loading && <p className="text-gray-500">Generating digest...</p>}

        {error && <p className="text-red-600">{error}</p>}

        {digest && tiles && (
          <>
            <div className="grid grid-cols-4 gap-2">
              {tiles.map((t) => (
                <div
                  key={t.label}
                  className="rounded-xl bg-gray-50 border border-gray-200 p-3 text-center"
                >
                  <p className={`text-2xl font-bold ${t.color}`}>{t.value}</p>
                  <p className="text-xs text-gray-500">{t.label}</p>
                </div>
              ))}
            </div>

            <p className="font-semibold text-gray-800">{digest.headline}</p>

            {digest.highlights.length > 0 && (
              <section>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Highlights
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                  {digest.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </section>
            )}

            {digest.atRisk.length > 0 && (
              <section>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  At risk
                </h3>
                <div className="space-y-2">
                  {digest.atRisk.map((r, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm"
                    >
                      <p className="font-semibold text-amber-900">{r.task}</p>
                      <p className="text-amber-800">{r.reason}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {digest.nextSteps.length > 0 && (
              <section>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Suggested next steps
                </h3>
                <ul className="list-decimal pl-5 space-y-1 text-sm text-gray-700">
                  {digest.nextSteps.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </section>
            )}

            <p className="text-xs text-gray-400">
  {digest.aiUsed
    ? "AI-generated from your tasks and activity log"
    : "Summary from your task data (AI unavailable)"}{" "}
  · {new Date(digest.generatedAt).toLocaleString()}
  {digest.cached ? " (cached)" : ""}
</p>
          </>
        )}
      </div>
    </Modal>
  );
}

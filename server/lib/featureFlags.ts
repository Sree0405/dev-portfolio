export function isJobTrackerEnabled(): boolean {
  return process.env.ENABLE_JOB_TRACKER?.trim().toLowerCase() === "true";
}

export function getFeatureFlags() {
  return {
    jobTracker: isJobTrackerEnabled(),
  };
}

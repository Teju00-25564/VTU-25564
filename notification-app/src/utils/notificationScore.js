export function getPriorityScore(type) {
  if (type === "Placement") {
    return 300;
  }

  if (type === "Result") {
    return 200;
  }

  return 100;
}

export function sortByPriority(notifications) {
  return [...notifications].sort((first, second) => {
    const scoreDifference =
      getPriorityScore(second.type) - getPriorityScore(first.type);

    if (scoreDifference !== 0) {
      return scoreDifference;
    }

    return new Date(second.timestamp) - new Date(first.timestamp);
  });
}

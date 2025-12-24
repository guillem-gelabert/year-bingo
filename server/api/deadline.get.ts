export default defineEventHandler(() => {
  return {
    deadline: getCurrentYearDeadline().toISOString(),
    isBeforeDeadline: isBeforeDeadline(),
    canEdit: canEdit(),
    isPublicViewEnabled: isPublicViewEnabled(),
  }
})

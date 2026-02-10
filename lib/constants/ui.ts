export const UI_LABELS = {
  RETRY: 'Retry',
  ADD_TRANSACTION: 'Add Transaction',
  CREATE_GOAL: 'Create Goal',
  ADD_CATEGORY: 'Add Category',
  SAVE: 'Save',
  SAVING: 'Saving...',
  LOAD_ERROR: 'Failed to load data',
  LOADING: 'Loading...',
} as const

export type UILabel = (typeof UI_LABELS)[keyof typeof UI_LABELS]

export { storage as default, StorageService } from './storage-service'
export { STORAGE_KEYS, STORAGE_PREFIX } from './keys'
export {
  checkSchemaVersion,
  migrate,
  updateSchemaVersion,
  CURRENT_SCHEMA_VERSION,
} from './schema'
export type { SchemaVersion } from './schema'
export { storageEvents } from './storage-events'

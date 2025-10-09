import { normalizePath } from "obsidian";
import path from "path";

// Export all utility classes and interfaces
export { FileOperations } from "./fileOperations";
export { FileManagementService } from "./fileManagementService";
export { ExportService } from "./exportService";
export { ExportMessageBuilder } from "./messageBuilder";
export { WarningModal } from "./warningModal";

// Export constants
export * from "./constants";

// Export interfaces and types
export * from "./interfaces";

export function joinNormPath(...segments: string[]): string {
	return normalizePath(path.join(...segments).replace(/\/+/g, "/"));
}

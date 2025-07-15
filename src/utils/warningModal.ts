import { App, Modal, Setting } from "obsidian";
import { UI_MESSAGES } from "./constants";
import { WarningModalConfig } from "./interfaces";

/**
 * Improved warning modal with better type safety and configuration
 */
export class WarningModal extends Modal {
	private rememberChoice: boolean = false;

	constructor(
		app: App,
		private config: WarningModalConfig
	) {
		super(app);
	}

	onOpen(): void {
		const { contentEl } = this;
		
		// Clear any existing content
		contentEl.empty();
		
		// Set the message
		contentEl.createEl("p", { text: this.config.message });

		// Create button container
		const buttonContainer = contentEl.createDiv({ cls: "modal-button-container" });
		
		// Add buttons
		new Setting(buttonContainer)
			.addButton((btn) =>
				btn
					.setButtonText(UI_MESSAGES.OK_BUTTON)
					.setCta()
					.onClick(async () => {
						await this.handleConfirm();
					})
			)
			.addButton((btn) =>
				btn
					.setButtonText(UI_MESSAGES.CANCEL_BUTTON)
					.onClick(() => {
						this.handleCancel();
					})
			);

		// Add remember choice option if requested
		if (this.config.rememberChoiceOption) {
			const toggleContainer = contentEl.createDiv({ cls: "modal-toggle-container" });
			toggleContainer.createDiv({ text: UI_MESSAGES.REMEMBER_CHOICE });
			
			new Setting(toggleContainer)
				.addToggle((toggle) =>
					toggle
						.setValue(false)
						.onChange((value) => {
							this.rememberChoice = value;
						})
				);
		}
	}

	onClose(): void {
		const { contentEl } = this;
		contentEl.empty();
	}

	/**
	 * Handles the confirm action
	 */
	private async handleConfirm(): Promise<void> {
		try {
			// Execute the callback if provided
			if (this.config.onConfirm) {
				await this.config.onConfirm();
			}
		} catch (error) {
			console.error("Error in warning modal confirm callback:", error);
		} finally {
			this.close();
		}
	}

	/**
	 * Handles the cancel action
	 */
	private handleCancel(): void {
		try {
			// Execute the cancel callback if provided
			if (this.config.onCancel) {
				this.config.onCancel();
			}
		} catch (error) {
			console.error("Error in warning modal cancel callback:", error);
		} finally {
			this.close();
		}
	}

	/**
	 * Gets whether the user chose to remember their choice
	 */
	getRememberChoice(): boolean {
		return this.rememberChoice;
	}

	/**
	 * Static factory method for creating a simple overwrite confirmation modal
	 */
	static createOverwriteModal(
		app: App,
		message: string,
		onConfirm: () => void | Promise<void>,
		rememberChoiceOption: boolean = false
	): WarningModal {
		return new WarningModal(app, {
			message,
			onConfirm,
			rememberChoiceOption
		});
	}

	/**
	 * Static factory method for creating an external export overwrite modal
	 */
	static createExternalOverwriteModal(
		app: App,
		onConfirm: () => void | Promise<void>
	): WarningModal {
		return new WarningModal(app, {
			message: UI_MESSAGES.EXTERNAL_OVERWRITE_CONFIRM,
			onConfirm,
			rememberChoiceOption: true
		});
	}

	/**
	 * Static factory method for creating a vault export overwrite modal
	 */
	static createVaultOverwriteModal(
		app: App,
		onConfirm: () => void | Promise<void>
	): WarningModal {
		return new WarningModal(app, {
			message: UI_MESSAGES.OVERWRITE_CONFIRM,
			onConfirm,
			rememberChoiceOption: true
		});
	}
}

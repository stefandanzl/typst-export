// Type declarations for citation-js
declare module "citation-js" {
	export class Cite {
		constructor(input: string | any[]);

		format(format: string, options?: any): Promise<any[]>;
		static async(input: string | any[]): Promise<Cite>;
		static get(data: string | any[]): Promise<any[]>;
	}
}

import { eq } from "@arkiv-network/sdk/query";
import { createArkivClients } from "./wallet";
import { jsonToPayload, ExpirationTime } from "@arkiv-network/sdk/utils";

export interface Sketch {
	id: string;
	timestamp: number;
	imageData: string;
}

export async function loadSketches(userAddress: string): Promise<Sketch[]> {
	try {
		const { publicClient } = createArkivClients();

		const result = await publicClient
			.buildQuery()
			.where(eq("type", "sketch")) // our custom attribute we set when saving
			.ownedBy(userAddress as `0x${string}`) // only sketches owned by the user
			.withPayload(true)
			.limit(10)
			.fetch();

		const sketches = result.entities
			.map((entity) => {
				try {
					const payloadText = entity.payload
						? new TextDecoder().decode(entity.payload)
						: null;
					const payload = payloadText ? JSON.parse(payloadText) : null;
					if (payload?.imageData) {
						return {
							id: entity.key,
							timestamp: payload.timestamp || 0,
							imageData: payload.imageData,
						} as Sketch;
					}
					return null;
				} catch {
					return null;
				}
			})
			.filter((s): s is Sketch => s !== null)
			.sort((a, b) => b.timestamp - a.timestamp);

		return sketches;
	} catch (error) {
		console.error("Failed to load sketches:", error);
		return [];
	}
}

export async function saveSketch(
	imageData: string,
	userAddress: string,
): Promise<string> {
	const { walletClient } = createArkivClients(userAddress as `0x${string}`);

	const { entityKey } = await walletClient.createEntity({
		payload: jsonToPayload({
			imageData,
			timestamp: Date.now(),
		}),
		contentType: "application/json",
		attributes: [{ key: "type", value: "sketch" }],
		expiresIn: ExpirationTime.fromDays(365),
	});

	return entityKey;
}

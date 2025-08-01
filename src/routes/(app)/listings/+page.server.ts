import { db } from "$lib/server/db";
import { agentQuery, listing, listingQuery, propertyQuery } from "$lib/server/db/schema";
import { desc, inArray } from "drizzle-orm";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
	const listingsPromise = db.query.listing.findMany({
		...listingQuery,
		with: {
			agent: agentQuery,
			property: { ...propertyQuery, columns: { ...propertyQuery.columns, sellerId: false } },
		},
		// where: eq(listing.status, '')
		where: inArray(listing.status, ["up", "sold", "pending"]),
		orderBy: (t) => [desc(t.status), desc(t.dateModified)],
	});

	return {
		listings: listingsPromise,
	};
};

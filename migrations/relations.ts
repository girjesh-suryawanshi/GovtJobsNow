import { relations } from "drizzle-orm/relations";
import { jobs, jobPositions, adminUsers, urlProcessingLogs } from "./schema";

export const jobPositionsRelations = relations(jobPositions, ({one}) => ({
	job: one(jobs, {
		fields: [jobPositions.jobId],
		references: [jobs.id]
	}),
}));

export const jobsRelations = relations(jobs, ({many}) => ({
	jobPositions: many(jobPositions),
	urlProcessingLogs: many(urlProcessingLogs),
}));

export const urlProcessingLogsRelations = relations(urlProcessingLogs, ({one}) => ({
	adminUser: one(adminUsers, {
		fields: [urlProcessingLogs.adminId],
		references: [adminUsers.id]
	}),
	job: one(jobs, {
		fields: [urlProcessingLogs.jobId],
		references: [jobs.id]
	}),
}));

export const adminUsersRelations = relations(adminUsers, ({many}) => ({
	urlProcessingLogs: many(urlProcessingLogs),
}));
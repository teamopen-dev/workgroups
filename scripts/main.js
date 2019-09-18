'use strict';

const {loadData} = require('./loading');
const Templates = require('./templating');
const {WORKGROUPS_BASE_URL, ORG_TITLE} = require('./env');
const {resolve: resolvePath, join: joinPath} = require('path');
const {sync: rimrafSync} = require('rimraf');
const {writeFileSync} = require('fs');
const badgen = require('badgen')

const {workgroups, members, sharedRoles} = loadData();

// Generates /workgroups
const docsPath = resolvePath(__dirname, '../workgroups');
rimrafSync(joinPath(docsPath, '*'));
for(const key in workgroups) {
	const wg = workgroups[key];
	const doc = Templates.workgroup(wg);
	writeFileSync(joinPath(docsPath, `${wg.key}.md`), doc);
}
writeFileSync(
	joinPath(docsPath, `README.md`),
	Templates.workgroupList({workgroups, sharedRoles, orgTitle: ORG_TITLE})
);

// Generates /.github/ISSUE_TEMPLATE
const templPath = resolvePath(__dirname, '../.github/ISSUE_TEMPLATE');
rimrafSync(joinPath(templPath, 'wg-*'));
for(const key in workgroups) {
	const wg = workgroups[key];
	const doc = Templates.notifyWgIssue(wg);
	writeFileSync(joinPath(templPath, `${wg.key}.md`), doc);
}
writeFileSync(
	joinPath(templPath, `wg-join-leave.md`),
	Templates.joinLeaveWgIssue({workgroups, baseUrl: WORKGROUPS_BASE_URL})
);

// Generates /badge.svg
const badge = badgen({
	label: 'Open Workgroups',
	status: Object.keys(workgroups).length.toString(),
	color: 'blue'
});
writeFileSync(resolvePath(__dirname, '../badge.svg'), badge);

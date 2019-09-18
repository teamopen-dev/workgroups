'use strict';

const {loadData} = require('./loading');
const Templates = require('./templating');
const {WORKGROUPS_BASE_URL} = require('./env');
const {resolve: resolvePath, join: joinPath} = require('path');
const {sync: rimrafSync} = require('rimraf');
const {writeFileSync} = require('fs');
const badgen = require('badgen')

const {workgroups, members} = loadData();

// Generates /workgroups
const docsPath = resolvePath(__dirname, '../workgroups');
rimrafSync(joinPath(docsPath, '*'));
for(const key in workgroups) {
	const wg = workgroups[key];
	const doc = Templates.workgroup(wg);
	writeFileSync(joinPath(docsPath, `${wg.key}.md`), doc);
}

// Generates /.github/ISSUE_TEMPLATE
const templPath = resolvePath(__dirname, '../.github/ISSUE_TEMPLATE');
rimrafSync(joinPath(templPath, 'wg-*'));
writeFileSync(
	joinPath(templPath, `wg-0-join-leave.md`),
	Templates.joinLeaveWgIssue({workgroups, baseUrl: WORKGROUPS_BASE_URL})
);
let issueTemplateIndex = 1;
for(const key in workgroups) {
	const wg = workgroups[key];
	const doc = Templates.notifyWgIssue(wg);
	writeFileSync(joinPath(templPath, `wg-${issueTemplateIndex}-${wg.key}.md`), doc);
	issueTemplateIndex++;
}

// Generates /README.md
writeFileSync(
	resolvePath(__dirname, `../README.md`),
	Templates.workgroupList(workgroups)
);

// Generates /badge.svg
const badge = badgen({
	label: 'Open Workgroups',
	status: Object.keys(workgroups).length.toString(),
	color: 'blue'
});
writeFileSync(resolvePath(__dirname, '../badge.svg'), badge);

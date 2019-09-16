'use strict';

const {loadData} = require('./loading');
const {templateWorkgroup} = require('./templating');
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
	const doc = templateWorkgroup(wg);
	writeFileSync(joinPath(docsPath, `${wg.key}.md`), doc);
}

// Generates /badge.svg
const badge = badgen({
	label: 'Open Workgroups',
	status: Object.keys(workgroups).length.toString(),
	color: 'blue'
});
writeFileSync(resolvePath(__dirname, '../badge.svg'), badge);

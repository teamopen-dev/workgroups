'use strict';

const {resolve: resolvePath} = require('path');
const {readFileSync} = require('fs');
const {parse: parseYaml} = require('yaml');

const loadYamlFile = path =>
	parseYaml(
		readFileSync(path, {encoding: 'utf8'}),
		{merge: true}
	);

const loadWorkgroups = () =>
	loadYamlFile(resolvePath(__dirname, '../data/workgroups.yml'));

const loadMembers = () =>
	loadYamlFile(resolvePath(__dirname, '../data/members.yml'));

//Add the members as a {members: [{member, roles}]} structure to each workgroup.
const populateWorkgroups = ({workgroups, members}) => {
	// Make a shallow copy with a members and key field present.
	const wgs = {};
	for(const wg in workgroups) {
		wgs[wg] = ({...workgroups[wg], key: wg, members: []});
	}

	for (const member of members) {
		for (const wg in member.workgroups) {
			if(wg in wgs === false) {
				throw new Error(`Member "${member.username}" is in an undefined workgroup "${wg}"`);
			}

			//While we're validating anyway, check the roles exist.
			const roles = member.workgroups[wg] || [];
			for(const role of roles) {
				if(role in wgs[wg].roles === false) {
					throw new Error(`Member "${member.username}" has an undefined role "${role}" in workgroup "${wg}"`);
				}
			}

			wgs[wg].members.push({member, roles});
		}
	}

	return wgs;
};

exports.loadData = () => {
	const workgroups = loadWorkgroups().workgroups;
	const members = loadMembers().members;
	const workgroupsWithMembers = populateWorkgroups({workgroups, members});

	return {
		members,
		workgroups: workgroupsWithMembers
	};
};

'use strict';

const {resolve: resolvePath} = require('path');
const {readFileSync} = require('fs');
const {create} = require('handlebars');

const mdAvatarFor = (user, size) =>
	`<img src="https://avatars.githubusercontent.com/${user}?v=4&s=${size || 32}" width="${size || 32}" height="${size || 32}" alt="${user}" />`;

const mdMemberDisplay = member =>
	member.display ?
	`${member.display} ([@${member.username}](https://github.com/${member.username}))` :
	`[@${member.username}](https://github.com/${member.username})`;

const trim = string => string.trim();
const join = (array, separator) => array.join(separator);

const loadTemplate = (path, hbs) =>
	hbs.compile(readFileSync(path, {encoding: 'utf8'}));

const loadWorkgroupMdTemplate = () => {
	const workgroupEnv = create();
	workgroupEnv.registerHelper('trim', trim);
	workgroupEnv.registerHelper('join', join);
	workgroupEnv.registerHelper('avatarFor', mdAvatarFor);
	workgroupEnv.registerHelper('memberDisplay', mdMemberDisplay);
	return loadTemplate(resolvePath(__dirname, './templates/workgroup.md.hbs'), workgroupEnv);
};

const loadWorkgroupListMdTemplate = () => {
	const workgroupEnv = create();
	workgroupEnv.registerHelper('trim', trim);
	workgroupEnv.registerHelper('join', join);
	return loadTemplate(resolvePath(__dirname, './templates/workgroup-list.md.hbs'), workgroupEnv);
};

const cache = exports.cache = {};

exports.templateWorkgroup = workgroup => {
	if('workgroup' in cache === false) {
		cache.workgroup = loadWorkgroupMdTemplate();
	}

	return cache.workgroup(workgroup);
};

exports.templateWorkgroupList = workgroups => {
	if('workgroupList' in cache === false) {
		cache.workgroupList = loadWorkgroupListMdTemplate();
	}

	return cache.workgroupList(workgroups);
};

'use strict';

const {resolve: resolvePath} = require('path');
const {readFileSync} = require('fs');
const Handlebars = require('handlebars');

const mdAvatarFor = (user, size) =>
	`<img src="https://avatars.githubusercontent.com/${user}?v=4&s=${size || 32}" width="${size || 32}" height="${size || 32}" alt="${user}" />`;

const mdMemberDisplay = member =>
	member.display ?
	`${member.display} ([@${member.username}](https://github.com/${member.username}))` :
	`[@${member.username}](https://github.com/${member.username})`;

const trim = string => (typeof string == 'string') && string.trim() || string;
const join = (array, separator) => array.join(separator);
const hasKey = (obj, key) => key in obj;

Handlebars.registerHelper('trim', trim);
Handlebars.registerHelper('join', join);
Handlebars.registerHelper('hasKey', hasKey);
Handlebars.registerHelper('avatarFor', mdAvatarFor);
Handlebars.registerHelper('memberDisplay', mdMemberDisplay);

// Handlebars adds a require() extension so we can do this.
module.exports = {
	workgroup: require('./templates/workgroup.md.hbs'),
	workgroupList: require('./templates/workgroup-list.md.hbs'),
	notifyWgIssue: require('./templates/notify-wg-issue.md.hbs'),
	joinLeaveWgIssue: require('./templates/join-leave-wg-issue.md.hbs'),
};

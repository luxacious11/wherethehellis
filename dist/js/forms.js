//reserve face
document.querySelector('#form-reserve-face').addEventListener('submit', e => {
    e.preventDefault();

    let form = e.currentTarget;
    let alias = form.querySelector('#alias').value.toLowerCase().trim();
    let face = form.querySelector('#face').value.toLowerCase().trim();

    let data = {
        SubmissionType: 'reserve-face',
        Member: alias,
        Face: face,
    }

    let staffDiscord = {
        title: `New Face Reservation`,
        text: `${capitalize(alias)} has reserved ${capitalize(face)}`,
        hook: reserveLogs,
    }

    let successMessage = `<blockquote class="fullWidth">Submission successful!</blockquote>
    <button onclick="reloadForm(this)" type="button" class="fullWidth submit">Back to form</button>`;

    form.querySelector('button[type="submit"]').innerText = `Submitting...`;

    checkClaimedFaces(form, data, successMessage, staffDiscord);
});

//reserve role
document.querySelector('#form-reserve-role').addEventListener('submit', e => {
    e.preventDefault();

    let form = e.currentTarget;
    let alias = form.querySelector('#alias').value.toLowerCase().trim();
    let plot = form.querySelector('#plot').options[form.querySelector('#plot').selectedIndex].innerText.toLowerCase().trim();
    let section = form.querySelector('#section').options[form.querySelector('#section').selectedIndex].innerText.toLowerCase().trim();
    let role = form.querySelector('#role').options[form.querySelector('#role').selectedIndex].innerText.toLowerCase().trim();
    let roleLimit = form.querySelector('#role').options[form.querySelector('#role').selectedIndex].dataset.limit;

    let data = {
        SubmissionType: 'reserve-role',
        Member: alias,
        Plot: plot,
        Section: section,
        Role: role,
        Limit: roleLimit,
        Instances: 0,
    }

    let staffDiscord = {
        title: `New Role Reservation`,
        text: `${capitalize(alias)} has reserved ${capitalize(role)} (${capitalize(section)}) from the ${capitalize(plot)} subplot.`,
        hook: reserveLogs,
    }

    let successMessage = `<blockquote class="fullWidth">Submission successful!</blockquote>
    <button onclick="reloadForm(this)" type="button" class="fullWidth submit">Back to form</button>`;

    form.querySelector('button[type="submit"]').innerText = `Submitting...`;
    
    if(data.Limit === 'unlimited') {
        sendAjax(form, data, successMessage, staffDiscord);
    } else {
        checkRoleLimit(form, data, successMessage, staffDiscord);
    }
});

//add plot
document.querySelector('#form-add-plot').addEventListener('submit', e => {
    e.preventDefault();

    let form = e.currentTarget;
    let plot = form.querySelector('#plot').value.toLowerCase().trim();
    let id = form.querySelector('#id').value.toLowerCase().trim();
    let priority = form.querySelector('#priority').value.trim();
    let overview = form.querySelector('#overview').value.trim();
    let sectionWraps = form.querySelectorAll('.section-wrap');
    let sections = [];

    sectionWraps.forEach((sectionWrap, i) => {
        let title = sectionWrap.querySelector('.section-title input').value.toLowerCase().trim();
        let priority = i + 1;
        let overview = sectionWrap.querySelector('.section-overview textarea').value.trim();
        let roleWraps = sectionWrap.querySelectorAll('.section-role');
        let roles = [];

        roleWraps.forEach((roleWrap, i) => {
            let title = roleWrap.querySelector('.role-title input').value.toLowerCase().trim();
            let priority = i + 1;
            let limit = roleWrap.querySelector('.role-limit input').value.toLowerCase().trim();
            let description = roleWrap.querySelector('.role-description input').value.trim();
            roles.push({
                role: title,
                priority: priority,
                limit: limit,
                description: description,
            });
        });

        sections.push({
            title: title,
            priority: priority,
            overview: overview,
            roles: roles,
        });
    });

    let data = {
        SubmissionType: 'add-plot',
        Plot: plot,
        PlotID: id,
        Priority: priority,
        Overview: overview,
        Sections: JSON.stringify(sections),
    }

    let staffDiscord = {
        title: `Plot Added`,
        text: `No extra actions required.`,
        hook: staffLogs,
    }

    let successMessage = `<blockquote class="fullWidth">Submission successful!</blockquote>
    <button onclick="reloadForm(this)" type="button" class="fullWidth submit">Back to form</button>`;

    form.querySelector('button[type="submit"]').innerText = `Submitting...`;

    sendAjax(form, data, successMessage, staffDiscord);
});

//add business
let addBusiness = document.querySelector('#form-add-business');
let addBusinessHours = addBusiness.querySelector('#hours');
simpleFieldToggle(addBusinessHours, '.ifSetHours', 'set hours');
document.querySelector('#form-add-business').addEventListener('submit', e => {
    e.preventDefault();

    let form = e.currentTarget;
    let alias = form.querySelector('#alias').value.toLowerCase().trim();
    let id = form.querySelector('#id').value.toLowerCase().trim().split('?showuser=').length > 1 ? form.querySelector('#id').value.toLowerCase().trim().split('?showuser=')[1] : form.querySelector('#id').value.toLowerCase().trim();
    let employer = form.querySelector('#employer').value.toLowerCase().trim();
    let category = form.querySelector('#category').options[form.querySelector('#category').selectedIndex].innerText.toLowerCase().trim();
    let location = form.querySelector('#location').options[form.querySelector('#location').selectedIndex].innerText.toLowerCase().trim();
    let locationId = form.querySelector('#location').options[form.querySelector('#location').selectedIndex].value.trim();
    let hiring = form.querySelector('#hiring').options[form.querySelector('#hiring').selectedIndex].value.trim();
    let wanted = form.querySelector('#wanted').value.trim();
    let summary = form.querySelector('#summary').value.trim();
    let hours = [];

    if(form.querySelector('#hours').options[form.querySelector('#hours').selectedIndex].value === 'set hours') {
        let hourSets = form.querySelectorAll('.hours-wrap .row');
        hourSets.forEach(set => {
            let rangeStart = set.querySelector('.days-start select').options[set.querySelector('.days-start select').selectedIndex].value.trim();
            let rangeEnd = set.querySelector('.days-end select').options[set.querySelector('.days-end select').selectedIndex].value.trim();
            let timeStart =  capitalize(set.querySelector('.time-start input').value.toLowerCase().trim(), [' ']);
            let timeEnd = set.querySelector('.time-end input').value !== `` && capitalize(set.querySelector('.time-end input').value.toLowerCase().trim(), [' ']);

            hours.push({
                range: `${rangeStart} - ${rangeEnd}`.trim(),
                time: timeEnd ? `${timeStart} - ${timeEnd}`.trim() : timeStart.trim(),
            });
        });
    } else {
        hours.push({
            text: form.querySelector('#hours').options[form.querySelector('#hours').selectedIndex].value,
        });
    }

    let data = {
        SubmissionType: 'add-business',
        Owner: JSON.stringify({
            alias: alias,
            id: id
        }),
        Employer: employer,
        Category: category,
        Location: location,
        LocationID: locationId,
        Summary: summary,
        Hours: JSON.stringify(hours),
        Hiring: hiring,
        Wanted: wanted,
    }

    let staffDiscord = {
        title: `New Business Added: ${capitalize(employer, [' ', '-'])}`,
        text: `**Submitted by:** ${capitalize(alias, [' ', '-'])} (#${id})
        **View here:** <https://wherethehellis.jcink.net/?act=Pages&kid=businesses#${cleanText(employer)}>`,
        hook: businessLogs,
    }

    let successMessage = `<blockquote class="fullWidth">Submission successful!</blockquote>
    <button onclick="reloadForm(this)" type="button" class="fullWidth submit">Back to form</button>`;

    form.querySelector('button[type="submit"]').innerText = `Submitting...`;

    sendAjax(form, data, successMessage, staffDiscord);
});

//get sorted
let sortForm = document.querySelector('#form-sort');
let requestToggle = sortForm.querySelector('#requested');
let powerToggle = sortForm.querySelector('#powertype');
let employedToggle = sortForm.querySelector('#employed');
let plotToggle = sortForm.querySelector('#subplot');
let firstToggle = sortForm.querySelector('#first');
simpleFieldToggle(requestToggle, '.ifRequest', 'y');
complexFieldToggle(powerToggle, '.ifPower', ['', 'powerless'], false);
simpleFieldToggle(employedToggle, '.ifEmployed', 'y');
simpleFieldToggle(plotToggle, '.ifPlot', 'y');
simpleFieldToggle(firstToggle, '.ifFirst', 'y');
document.querySelector('#form-sort').addEventListener('submit', e => {
    e.preventDefault();

    let form = e.currentTarget;
    let character = form.querySelector('#character').value.toLowerCase().trim();
    let accountId = getAccountID(form.querySelector('#accountid'));
    let group = getSelectText(form.querySelector('#group'));
    let groupId = getSelectValue(form.querySelector('#group'));
    let face = form.querySelector('#face').value.toLowerCase().trim();
    let requestDetails = form.querySelector('#request').value.trim();
    let powerType = getSelectValue(form.querySelector('#powertype'));
    let alias = form.querySelector('#alias').value.toLowerCase().trim();
    let parentId = getAccountID(form.querySelector('#parentid'));
    let employed = getSelectValue(form.querySelector('#employed')) === 'y' ? true : false;
    let subplot = getSelectValue(form.querySelector('#subplot')) === 'y' ? true : false;
    let first = getSelectValue(form.querySelector('#first')) === 'y' ? true : false;
    let powers = [], jobs = [], roles = [], memberData = {};

    //powers array
    if(powerType !== '' && powerType !== 'powerless') {
        form.querySelectorAll('.power').forEach(power => {
            if(power.value.trim() !== '') {
                powers.push(power.value.toLowerCase().trim());
            }
        });
    }

    //jobs array
    if(employed) {
        let jobSets = document.querySelectorAll('.job-wrap');
        jobSets.forEach(job => {
            jobs.push({
                employer: getSelectText(job.querySelector('.employer select')),
                section: job.querySelector('.job-section input').value.toLowerCase().trim(),
                position: job.querySelector('.position input').value.toLowerCase().trim(),
            });
        });
    }

    //roles array
    if(subplot) {
        let roleSets = document.querySelectorAll('.role-wrap');
        roleSets.forEach(role => {
            roles.push({
                plot: getSelectText(role.querySelector('.plot select')),
                section: getSelectText(role.querySelector('.plot-section select')),
                role: getSelectText(role.querySelector('.role select')),
            });
        });
    }

    //set character data
    let characterData = {
        SubmissionType: 'add-claims',
        Member: alias,
        Character: character,
        AccountID: accountId,
        ParentID: parentId,
        Group: group,
        GroupID: groupId,
        Face: face,
        PowerType: powerType,
        Powers: powers.length > 0 ? JSON.stringify(powers) : '',
        Jobs: jobs.length > 0 ? JSON.stringify(jobs) : '',
        Roles: roles.length > 0 ? JSON.stringify(roles) : '',
        Status: 'pending',
    }

    //set member data if first
    if(first) {
        memberData = {
            SubmissionType: 'add-member',
            Member: alias,
            AccountID: parentId,
            Group: 'writer',
            GroupID: '6',
            Pronouns: form.querySelector('#pronouns').value.toLowerCase().trim(),
            Age: form.querySelector('#age').value.trim(),
            Timezone: form.querySelector('#timezone').value.toLowerCase().trim(),
            About: form.querySelector('#about').value.trim(),
            Triggers: form.querySelector('#triggers').value.trim(),
            Language: getSelectValue(form.querySelector('#language')),
            Sex: getSelectValue(form.querySelector('#sex')),
            Violence: getSelectValue(form.querySelector('#violence')),
        }
    }

    let requestMessage = ``;
    if(getSelectValue(form.querySelector('#requested')) === 'y') {
        requestMessage = `

        > ${requestDetails}`;
    }

    let publicRequestMessage = ``;
    if(getSelectValue(form.querySelector('#requested')) === 'y') {
        publicRequestMessage = `
        
        _This character fills one or more request. Members managing those requests will be contacted prior to character approval and sorting._`;
    }

    let staffDiscord = {
        title: `New Sorting Request: ${capitalize(character)}`,
        text: `**Played by:** [${capitalize(alias, [' ', '-'])}](<https://wherethehellis.jcink.net/?showuser=${parentId}>)
        **Group:** ${capitalize(group, [' '])}
        **First Character?** ${capitalize(getSelectText(form.querySelector('#first')))}
        **Requested?** ${capitalize(getSelectText(form.querySelector('#requested')))}${requestMessage}
        
        [**View Profile**](<https://wherethehellis.jcink.net/?showuser=${accountId}>)
        
        Please add this task to the JIRA board and mark this log with a checkmark. To sort the character, assign the JIRA task to yourself, move to the In Progress status, and then follow the acceptance process outlined in the Documentation.`,
        hook: claimLogs,
        color: rgbToHex(colors[group][0], colors[group][1], colors[group][2]),
    }

    let publicDiscord = {
        title: `${capitalize(alias, [' ', '-'])} has finished ${capitalize(character)}!`,
        text: `> _${face}, ${powerType}, ${group}_

        [**Learn More**](<https://wherethehellis.jcink.net/?showuser=${accountId}>)${publicRequestMessage}`,
        hook: sort,
        notification: `<@&1239412954848432158>`,
        color: rgbToHex(colors[group][0], colors[group][1], colors[group][2]),
    }

    let successMessage = `<blockquote class="fullWidth">Submission successful!</blockquote>
    <button onclick="reloadForm(this)" type="button" class="fullWidth submit">Back to form</button>`;

    form.querySelector('button[type="submit"]').innerText = `Submitting...`;

    if(first) {
        sendAjax(form, memberData);
    }

    sendAjax(form, characterData, successMessage, staffDiscord, publicDiscord);
});

//edit member
let aliasBox = document.querySelector('#form-edit-member [value="alias"]');
let pronounsBox = document.querySelector('#form-edit-member [value="pronouns"]');
let ageBox = document.querySelector('#form-edit-member [value="age"]');
let timezoneBox = document.querySelector('#form-edit-member [value="timezone"]');
let aboutBox = document.querySelector('#form-edit-member [value="about"]');
let triggersBox = document.querySelector('#form-edit-member [value="triggers"]');
let ratingsBox = document.querySelector('#form-edit-member [value="ratings"]');
checkToggle(aliasBox, '.ifAlias');
checkToggle(pronounsBox, '.ifPronouns');
checkToggle(ageBox, '.ifAge');
checkToggle(timezoneBox, '.ifTimezone');
checkToggle(aboutBox, '.ifAbout');
checkToggle(triggersBox, '.ifTriggers');
checkToggle(ratingsBox, '.ifRatings');
document.querySelector('#form-edit-member').addEventListener('submit', e => {
    e.preventDefault();

    let form = e.currentTarget;
    let selectedChanges = Array.prototype.slice.call(form.querySelectorAll('[name="edit-member"]')).filter(item => item.checked).map(item => item.value);
    let accountId = getAccountID(form.querySelector('#parentid'));
    let alias = form.querySelector('#alias').value.toLowerCase().trim();
    let pronouns = form.querySelector('#pronouns').value.toLowerCase().trim();
    let age = form.querySelector('#age').value.trim();
    let timezone = form.querySelector('#timezone').value.toLowerCase().trim();
    let about = form.querySelector('#about').value.trim();
    let triggers = form.querySelector('#triggers').value.trim();
    let language = getSelectValue(form.querySelector('#language'));
    let sex = getSelectValue(form.querySelector('#sex'));
    let violence = getSelectValue(form.querySelector('#violence'));

    let data = {
        SubmissionType: `edit-member`,
        AccountID: accountId,
        selectedChanges,
        Alias: alias,
        Pronouns: pronouns,
        Age: age,
        Timezone: timezone,
        About: about,
        Triggers: triggers,
        Language: language,
        Sex: sex,
        Violence: violence,
    }

    form.querySelector('button[type="submit"]').innerText = `Submitting...`;

    editMember(form, data);
});

//edit character
let profile = document.querySelector('#form-edit-character #accountid');
let nameBox = document.querySelector('#form-edit-character [value="character"]');
let groupBox = document.querySelector('#form-edit-character [value="group"]');
let jobAddBox = document.querySelector('#form-edit-character [value="jobs-add"]');
let jobChangeBox = document.querySelector('#form-edit-character [value="jobs-change"]');
let jobRemoveBox = document.querySelector('#form-edit-character [value="jobs-remove"]');
let roleAddBox = document.querySelector('#form-edit-character [value="roles-add"]');
let roleChangeBox = document.querySelector('#form-edit-character [value="roles-change"]');
let roleRemoveBox = document.querySelector('#form-edit-character [value="roles-remove"]');
checkToggle(nameBox, '.ifName');
checkToggle(groupBox, '.ifGroup');
checkToggle(jobAddBox, '.ifJobAdd');
checkToggle(jobChangeBox, '.ifJobChange');
checkToggle(jobRemoveBox, '.ifJobRemove');
checkToggle(roleAddBox, '.ifRoleAdd');
checkToggle(roleChangeBox, '.ifRoleChange');
checkToggle(roleRemoveBox, '.ifRoleRemove');
profile.addEventListener('input', e => {
    pullCharacterClaims(e.currentTarget);
});
document.querySelector('#form-edit-character').addEventListener('submit', e => {
    e.preventDefault();

    let form = e.currentTarget;
    let selectedChanges = Array.prototype.slice.call(form.querySelectorAll('[name="edit-character"]')).filter(item => item.checked).map(item => item.value);
    let accountId = getAccountID(form.querySelector('#accountid'));
    let character = form.querySelector('#character').value.toLowerCase().trim();
    let group = getSelectText(form.querySelector('#group'));
    let groupId = getSelectValue(form.querySelector('#group'));

    let data = {
        SubmissionType: `edit-claims`,
        AccountID: accountId,
        selectedChanges,
        Character: character,
        Group: group,
        GroupID: groupId,
    }

    form.querySelector('button[type="submit"]').innerText = `Submitting...`;

    editCharacter(form, data);
});

//edit business
let wantedBox = document.querySelector('#form-edit-business [value="wanted"]');
let hiringBox = document.querySelector('#form-edit-business [value="hiring"]');
let hoursBox = document.querySelector('#form-edit-business [value="hours"]');
let editHours = document.querySelector('#form-edit-business #hours');
checkToggle(wantedBox, '.ifWanted');
checkToggle(hiringBox, '.ifHiring');
checkToggle(hoursBox, '.ifHours');
simpleFieldToggle(editHours, '.ifSetHours', 'set hours');
document.querySelector('#form-edit-business').addEventListener('submit', e => {
    e.preventDefault();

    let form = e.currentTarget;
    let selectedChanges = Array.prototype.slice.call(form.querySelectorAll('[name="edit-business"]')).filter(item => item.checked).map(item => item.value);
    let employer = form.querySelector('#employer').value.toLowerCase().trim();
    let hiring = form.querySelector('#hiring').options[form.querySelector('#hiring').selectedIndex].value.trim();
    let wanted = form.querySelector('#wanted').value.trim();
    let hours = [];

    if(form.querySelector('#hours').options[form.querySelector('#hours').selectedIndex].value === 'set hours') {
        let hourSets = form.querySelectorAll('.hours-wrap .row');
        hourSets.forEach(set => {
            let rangeStart = set.querySelector('.days-start select').options[set.querySelector('.days-start select').selectedIndex].value.trim();
            let rangeEnd = set.querySelector('.days-end select').options[set.querySelector('.days-end select').selectedIndex].value.trim();
            let timeStart =  capitalize(set.querySelector('.time-start input').value.toLowerCase().trim(), [' ']);
            let timeEnd = set.querySelector('.time-end input').value !== `` && capitalize(set.querySelector('.time-end input').value.toLowerCase().trim(), [' ']);

            hours.push({
                range: `${rangeStart} - ${rangeEnd}`.trim(),
                time: timeEnd ? `${timeStart} - ${timeEnd}`.trim() : timeStart.trim(),
            });
        });
    } else {
        hours.push({
            text: form.querySelector('#hours').options[form.querySelector('#hours').selectedIndex].value,
        });
    }

    let data = {
        SubmissionType: 'edit-business',
        selectedChanges: selectedChanges,
        Employer: employer,
        Hours: JSON.stringify(hours),
        Hiring: hiring,
        Wanted: wanted,
    }

    form.querySelector('button[type="submit"]').innerText = `Submitting...`;

    editBusiness(form, data);
});

//mod form
let requestType = document.querySelector('#form-moderation #type');
simpleFieldToggle(requestType, '.ifBoard', 'board');
simpleFieldToggle(requestType, '.ifThread', 'thread');
simpleFieldToggle(requestType, '.ifAccount', 'account');
simpleFieldToggle(requestType, '.ifOther', 'other');
complexFieldToggle(requestType, '.ifNotThread', ['', 'thread'], false);
document.querySelector('#form-moderation').addEventListener('submit', e => {
    e.preventDefault();

    let form = e.currentTarget;
    let type = getSelectValue(form.querySelector('#type'));
    let requester = form.querySelector('#requester').value.toLowerCase().trim();
    let board, parent, threads, moveTo, account, request;
    let discord = {
        title: `New Moderation Request: ${capitalize(type, [' '])}`,
        text: `**Requested by:** ${capitalize(requester, [' ', '-'])}\n`,
        hook: modLogs,
    };
    switch(type) {
        case `board`:
            board = form.querySelector('#board').value.toLowerCase().trim();
            parent = form.querySelector('#parent').value.toLowerCase().trim();
            request = form.querySelector('#request').value.trim();
            discord.text += `**Board Title:** ${capitalize(board)}
            **Location:** ${capitalize(parent)}
            **Request Details:**
            ${request}`;
            break;
        case `thread`:
            threads = form.querySelector('#threads').value.trim();
            moveTo = form.querySelector('#thread-location').options[form.querySelector('#thread-location').selectedIndex].innerText.trim();;
            staffMessage = `**Move To:** ${moveTo}
            **Thread(s) to Move:**
            ${threads}`;
            break;
        case `account`:
            account = form.querySelector('#account').value.toLowerCase().trim();
            request = form.querySelector('#request').value.trim();
            staffMessage = `**Account:** ${account}
            **Request:**
            ${request}`;
            break;
        case `other`:
            request = form.querySelector('#request').value.trim();
            staffMessage = `**Request:**
            ${request}`;
            break;
        default:
            break;
    }

    sendDiscordMessage(`https://discord.com/api/webhooks/${discord.hook}`, discord.title, discord.text);

    form.innerHTML = `<blockquote class="fullWidth">Submission successful!</blockquote>
    <button onclick="reloadForm(this)" type="button" class="fullWidth submit">Back to form</button>`;
});

//approve character
document.querySelector('#form-approve').addEventListener('submit', e => {
    e.preventDefault();

    let form = e.currentTarget;
    let id = getAccountID(form.querySelector('#accountid'));
    let existing = claimsDataVar.filter(item => item.AccountID === id)[0];
    let bodyText = form.querySelector('#about').value.trim();
    
    let data = {
        SubmissionType: 'approve-character',
        AccountID: id,
        Status: 'approved',
    }

    let discord = {
        title: `Welcome ${capitalize(existing.Character)}!`,
        text: `**Played by ${capitalize(existing.Member, [' ', '-'])}**
        _${existing.Face}, ${existing.PowerType}, ${existing.Group}_

        > ${bodyText}

        [**Read More**](https://wherethehellis.jcink.net/?showuser=${id})`,
        hook: announce,
        color: rgbToHex(colors[existing.Group][0], colors[existing.Group][1], colors[existing.Group][2]),
    }

    let successMessage = `<blockquote class="fullWidth">Submission successful!</blockquote>
    <button onclick="reloadForm(this)" type="button" class="fullWidth submit">Back to form</button>`;

    form.querySelector('button[type="submit"]').innerText = `Submitting...`;
    
    sendAjax(form, data, successMessage, discord);
});
/****** Plots ******/
function formatSubplots(plots, characters, reserves) {
    plots.sort((a, b) => {
        if(parseInt(a.Priority) < parseInt(b.Priority)) {
            return -1;
        } else if(parseInt(a.Priority) > parseInt(b.Priority)) {
            return 1;
        } else if(a.Plot < b.Plot) {
            return -1;
        } else if(a.Plot > b.Plot) {
            return 1;
        } else {
            return 0;
        }
    });

    let plotTabs = ``;
    let plotLabels = ``;

    plots.forEach(plot => {
        let plotName = plot.Plot;
        let id = plot.PlotID;
        let text = plot.Overview;
        let sections = plot.Sections.split('+').map(section => JSON.parse(section))[0];
        sections.sort((a, b) => {
            if(parseInt(a.Priority) < parseInt(b.Priority)) {
                return -1;
            } else if(parseInt(a.Priority) > parseInt(b.Priority)) {
                return 1;
            } else {
                return 0;
            }
        });

        let sectionHTML = ``;
        sections.forEach(section => {
            sectionHTML += `<h3 data-box-align="center">${section.title}</h3>
            <blockquote>${section.overview}</blockquote>`;

            section.roles.sort((a, b) => {
                if(parseInt(a.Priority) < parseInt(b.Priority)) {
                    return -1;
                } else if(parseInt(a.Priority) > parseInt(b.Priority)) {
                    return 1;
                } else {
                    return 0;
                }
            });

            section.roles.forEach(role => {
                sectionHTML += `<div class="h6 role--title">${role.role} (${role.limit})</div>
                ${role.description && role.description !== '' ? `<span class="role--description">${role.description}</span>` : ``}
                <div data-type="grid" data-columns="4" data-section="${section.title}" data-plot="${plotName}" data-role="${role.role}"></div>`;
            });
        });

        plotLabels += `<a href="#${id}">${plotName}</a>`;
        plotTabs += `<tag-tab data-key="#${id}">
            <div class="webpage--content-inner"><div class="scroll">
                <h2 data-box-align="center">${plotName}</h2>
                <blockquote>${text}</blockquote>
                ${sectionHTML}
            </div></div>
        </tag-tab>`;
    });

    document.querySelector(`.accordion--content[data-category="plots"]`).innerHTML = plotLabels;
    document.querySelector(`tag-tab[data-category="plots"] tag-tabset`).innerHTML = plotTabs;
    clipPlotClaims([...characters, ...reserves].filter(item => {
        if(item.Status && item.Status.toLowerCase() === 'approved') {
            return true;
        } else if(item.Timestamp && checkActiveReserve(item.Timestamp) < 14) {
            return true;
        }
        return false;
    }));
}
function clipPlotClaims(data) {
    let roles = [];
    let claimed = data.filter(item => item.Roles && item.Roles !== '' && item.Status && item.Status === 'approved');
    let reserved = data.filter(item => item.Timestamp);

    claimed.forEach(item => {
        let rolesArray = JSON.parse(item.Roles);
        rolesArray.forEach(role => {
            roles.push({
                Role: role,
                Character: item.Character,
                AccountID: item.AccountID,
                Member: item.Member,
                ParentID: item.ParentID,
                Group: item.Group,
                GroupID: item.GroupID,
                type: `claim`,
            });
        });
    });

    reserved.forEach(item => {
        roles.push({
            Role: {
                role: item.Role,
                section: item.Section,
                plot: item.Plot,
            },
            Member: item.Member,
            Timestamp: item.Timestamp,
            type: `reserve`,
        });
    });

    roles.sort((a, b) => {
        if(a.Character < b.Character) {
            return -1;
        } else if(a.Character > b.Character) {
            return 1;
        } else if(a.Member < b.Member) {
            return -1;
        } else if(a.Member > b.Member) {
            return 1;
        } else {
            return 0;
        }
    });

    roles.forEach(role => {
        let html = ``;
        if(role.type === 'claim') {
            html = formatClaim(role.Character, [`Played by <a href="?showuser=${role.ParentID}">${role.Member}</a>`], role.GroupID, `?showuser=${role.AccountID}`);
        } else if(role.type === 'reserve') {
            html = formatClaim(`Reserved by ${role.Member}`, [`Expires ${setExpiry(role.Timestamp)}`]);
        }
        document.querySelector(`[data-plot="${role.Role.plot}"][data-section="${role.Role.section}"][data-role="${role.Role.role}"]`).insertAdjacentHTML('beforeend', html);
    });
}

/****** Face Reserves ******/
function formatFaceReserves(data, claimed) {
    claimed = claimed.filter(item => item.Status && item.Status === 'approved');
    let completed = claimed.map(item => item = item.Face);
    let active = data.filter(item => checkActiveReserve(item.Timestamp));
    active = active.filter(item => !completed.includes(item.Face));
    active.sort((a, b) => {
        if (a.Face < b.Face) {
            return -1;
        } else if (a.Face > b.Face) {
            return 1;
        } else {
            return 0;
        }
    });

    let html = ``;

    active.forEach((claim, i) => {
        if(i === 0) {
            html += formatHeader(claim.Face[0], '6', `accordion--trigger`);
            html += startAccordion(`data-type="grid" data-columns="4"`);
            html += formatClaim(claim.Face, [`Reserved by ${claim.Member}`, `Expires ${setExpiry(claim.Timestamp)}`]);
        } else if(active[i - 1].Face[0] !== claim.Face[0]) {
            html += stopAccordion();
            html += formatHeader(claim.Face[0], '6', `accordion--trigger`);
            html += startAccordion(`data-type="grid" data-columns="4"`);
            html += formatClaim(claim.Face, [`Reserved by ${claim.Member}`, `Expires ${setExpiry(claim.Timestamp)}`]);
        } else {
            html += formatClaim(claim.Face, [`Reserved by ${claim.Member}`, `Expires ${setExpiry(claim.Timestamp)}`]);
        }

        if(active.length - 1 === i) {
            html += stopAccordion();
        }
    });

    document.querySelector('#clip-face-reserves').insertAdjacentHTML('beforeend', html);
}

/****** Face Claims ******/
function formatFaceClaims(data) {
    data = data.filter(item => item.Status && item.Status.toLowerCase().trim() === 'approved');
    data.sort((a, b) => {
        if (a.Face < b.Face) {
            return -1;
        } else if (a.Face > b.Face) {
            return 1;
        } else if (a.Character < b.Character) {
            return -1;
        } else if (a.Character > b.Character) {
            return 1;
        } else {
            return 0;
        }
    });

    let html = ``;

    data.forEach((claim, i) => {
        if(i === 0) {
            html += formatHeader(claim.Face[0], '6', `accordion--trigger`);
            html += startAccordion(`data-type="grid" data-columns="4"`);
            html += formatClaim(claim.Face, [`Representing <a href="?showuser=${claim.AccountID}">${claim.Character}</a>`, `Played by <a href="?showuser=${claim.ParentID}">${claim.Member}</a>`], claim.GroupID, `?showuser=${claim.AccountID}`);
        } else if(data[i - 1].Face[0] !== claim.Face[0]) {
            html += stopAccordion();
            html += formatHeader(claim.Face[0], '6', `accordion--trigger`);
            html += startAccordion(`data-type="grid" data-columns="4"`);
            html += formatClaim(claim.Face, [`Representing <a href="?showuser=${claim.AccountID}">${claim.Character}</a>`, `Played by <a href="?showuser=${claim.ParentID}">${claim.Member}</a>`], claim.GroupID, `?showuser=${claim.AccountID}`);
        } else {
            html += formatClaim(claim.Face, [`Representing <a href="?showuser=${claim.AccountID}">${claim.Character}</a>`, `Played by <a href="?showuser=${claim.ParentID}">${claim.Member}</a>`], claim.GroupID, `?showuser=${claim.AccountID}`);
        }

        if(data.length - 1 === i) {
            html += stopAccordion();
        }
    });

    document.querySelector('#clip-face-claims').insertAdjacentHTML('beforeend', html);
}

/****** Power Claims ******/
function formatPowerClaims(data) {
    data = data.filter(item => item.PowerType && item.PowerType !== `powerless` && item.Powers && item.Powers !== `` && item.Status && item.Status === 'approved');

    data.forEach(item => {
        let priority = 0;
        switch(item.PowerType) {
            case `mixed`:
                priority = 1;
                break;
            case `other`:
                priority = 2;
                break;
            default:
                break;
        }
        item.PowerTypePriority = priority;
    });

    data.sort((a, b) => {
        if(a.PowerTypePriority < b.PowerTypePriority) {
            return -1;
        } else if(a.PowerTypePriority > b.PowerTypePriority) {
            return 1;
        } else if(a.PowerType < b.PowerType) {
            return -1;
        } else if(a.PowerType > b.PowerType) {
            return 1;
        } else if(a.Character < b.Character) {
            return -1;
        } else if(a.Character > b.Character) {
            return 1;
        } else {
            return 0;
        }
    });

    let html = ``;

    data.forEach((item, i) => {
        let powers = JSON.parse(item.Powers).map(item => `<tag-highlight>${item}</tag-highlight>`).join('');
        let lines = [`<span data-type="flex" data-gap="smsquare">${powers}</span>`, `Played by <a href="?showuser=${item.ParentID}">${item.Member}</a>`];

        if(i === 0) {
            html += formatHeader(item.PowerType, 6, `accordion--trigger`);
            html += startAccordion(`data-type="grid" data-columns="4"`);
            html += formatClaim(item.Character, lines, item.GroupID, `?showuser=${item.AccountID}`);
        } else if(data[i - 1].PowerType !== item.PowerType) {
            html += stopAccordion();
            html += formatHeader(item.PowerType, 6, `accordion--trigger`);
            html += startAccordion(`data-type="grid" data-columns="4"`);
            html += formatClaim(item.Character, lines, item.GroupID, `?showuser=${item.AccountID}`);
        } else {
            html += formatClaim(item.Character, lines, item.GroupID, `?showuser=${item.AccountID}`);
        }

        if(data.length - 1 === i) {
            html += stopAccordion();
        }
    });

    document.querySelector('#clip-powers').innerHTML = html;
}

/****** Member Directory ******/
function formatMemberDirectory(members, characters) {
    members.sort((a, b) => {
        if(a.Member < b.Member) {
            return -1;
        } else if(a.Member > b.Member) {
            return 1;
        } else {
            return 0;
        }
    });

    characters.sort((a, b) => {
        if(a.Member < b.Member) {
            return -1;
        } else if(a.Member > b.Member) {
            return 1;
        } else if(a.Character < b.Character) {
            return -1;
        } else if(a.Character > b.Character) {
            return 1;
        } else {
            return 0;
        }
    });

    let labels = ``;
    let tabs = ``;
    members.forEach((member, i) => {
        let characterList = characters.filter(item => item.Member && item.Member === member.Member);

        if(i === 0) {
            labels += openMenuSection(member.Member[0], member.Member);
            tabs += openTabCategory(member.Member[0], formatTab(member.Member, formatMemberContent(member, characterList)));
        } else if (members[i - 1].Member[0] !== member.Member[0]) {
            labels += closeMenuSection();
            tabs += closeTabCategory();
            labels += openMenuSection(member.Member[0], member.Member);
            tabs += openTabCategory(member.Member[0], formatTab(member.Member, formatMemberContent(member, characterList)));
        } else {
            labels += formatLabel(member.Member);
            tabs += formatTab(member.Member, formatMemberContent(member, characterList));
        }

        if(members.length - 1 === i) {
            labels += closeMenuSection();
            tabs += closeTabCategory();
        }
    });

    document.querySelector('.webpage--menu .accordion').innerHTML = labels;
    document.querySelector('.webpage--content').innerHTML = tabs;
}
function formatMemberContent(member, characters) {
    let active = characters.filter(item => item.Status && item.Status === 'approved');

    let html = `<h2 data-box-align="center">${member.Member}</h2>
    <div class="h7" data-text-align="center">
        ${member.Group}<br>${member.Pronouns} - ${member.Age} - ${member.Timezone}
    </div>
    <div data-type="grid" data-columns="2">
        <div>
            <div class="h6">About</div>
            <blockquote>${member.About}</blockquote>
        </div>
        <div>
            <div class="h6">Triggers</div>
            <blockquote>${member.Triggers}</blockquote>
        </div>
    </div>`;

    if(active.length > 0) {
        html += `<div class="h6">Active Characters</div>
        <div data-type="grid" data-columns="4">`;

        active.forEach(character => {
            let lines = [character.Face, character.PowerType];
            html += formatClaim(character.Character, lines, character.GroupID, `?showuser=${character.AccountID}`);
        });
    
        html += `</div>`;
    }

    return html;
}

/****** Businesses ******/
function formatBusinesses(businesses, characters) {
    characters = characters.filter(item => item.Jobs && item.Jobs !== '' && item.Status && item.Status === 'approved');
    let employees = [];

    characters.forEach(character => {
        let jobs = JSON.parse(character.Jobs);
        jobs.forEach(job => {
            employees.push({
                ...job,
                Character: character.Character,
                AccountID: character.AccountID,
                GroupID: character.GroupID,
                Member: character.Member,
                ParentID: character.ParentID,
                bumpOwner: job.position.includes('owner') && job.employer !== 'self-employed' ? 1 : 0,
                bumpLeader: job.position.includes('leader') && job.employer !== 'self-employed' ? 1 : 0,
                bumpHead: job.position.includes('head') && job.employer !== 'self-employed' ? 1 : 0,
                bumpChief: job.position.includes('chief') && job.employer !== 'self-employed' ? 1 : 0,
                bumpManager: job.position.includes('manager') && job.employer !== 'self-employed' ? 1 : 0,
            });
        });
    });

    businesses.sort((a, b) => {
        if (a.Employer.toLowerCase().trim().replace('the ', '') < b.Employer.toLowerCase().trim().replace('the ', '')) {
            return -1;
        } else if (a.Employer.toLowerCase().trim().replace('the ', '') > b.Employer.toLowerCase().trim().replace('the ', '')) {
            return 1;
        } else {
            return 0;
        }
    });
    
    businesses.forEach((business, i) => {
        let employeeList = employees.filter(item => item.employer && item.employer === business.Employer);
        let menuCategory = document.querySelector(`.webpage--menu .accordion--content[data-category="${cleanText(business.Category)}"]`);
        let tabCategory = document.querySelector(`.webpage--content [data-category="${cleanText(business.Category)}"] tag-tabset`);

        let label = formatLabel(business.Employer);
        let tab = formatTab(business.Employer, formatBusinessContent(business, employeeList));

        menuCategory.insertAdjacentHTML('beforeend', label);
        tabCategory.insertAdjacentHTML('beforeend', tab);
    });


    let selfEmployedList = employees.filter(item => item.employer && item.employer === `self-employed`);

    if(selfEmployedList.length > 0) {
        let menuCategory = document.querySelector(`.webpage--menu .accordion--content[data-category="self-employed"]`);
        let tabCategory = document.querySelector(`.webpage--content [data-category="self-employed"] tag-tabset`);
        selfEmployedList = sortEmployees(selfEmployedList);

        let html = `<h2 data-box-align="center">Self-Employed</h2>
        <div data-type="grid" data-columns="4">
            ${generateEmployeeList(selfEmployedList)}
        </div>`;
    
        let label = formatLabel(`self-employed`);
        let tab = formatTab(`self-employed`, html);
    
        menuCategory.insertAdjacentHTML('beforeend', label);
        tabCategory.insertAdjacentHTML('beforeend', tab);
    }
}
function sortEmployees(employees) {
    employees.sort((a, b) => {
        if(a.section < b.section) {
            return -1;
        } else if(a.section > b.section) {
            return 1;
        } else if (a.bumpOwner > b.bumpOwner) {
            return -1;
        } else if (a.bumpOwner < b.bumpOwner) {
            return 1;
        } else if (a.bumpLeader > b.bumpLeader) {
            return -1;
        } else if (a.bumpLeader < b.bumpLeader) {
            return 1;
        } else if (a.bumpHead > b.bumpHead) {
            return -1;
        } else if (a.bumpHead < b.bumpHead) {
            return 1;
        } else if (a.bumpChief > b.bumpChief) {
            return -1;
        } else if (a.bumpChief < b.bumpChief) {
            return 1;
        } else if (a.bumpManager > b.bumpManager) {
            return -1;
        } else if (a.bumpManager < b.bumpManager) {
            return 1;
        } else if (a.position < b.position) {
            return -1;
        } else if (a.position > b.position) {
            return 1;
        } else if (a.character < b.character) {
            return -1;
        } else if (a.character > b.character) {
            return 1;
        } else {
            return 0;
        }
    });

    return employees;
}
function generateEmployeeList(data) {
    let html = ``;

    data.forEach((character, i) => {
        let lines = [character.position, `Played by <a href="?showuser=${character.ParentID}">${character.Member}</a>`];

        if(i === 0) {
            if(character.section && character.section !== '') {
                html += formatHeader(character.section, 7, ``, `data-box-align="left"`);
            }
            html += formatClaim(character.Character, lines, character.GroupID, `?showuser=${character.AccountID}`, ``, `data-employer="${character.employer}"`);
        } else if(data[i - 1].section !== character.section) {
            if(character.section && character.section !== '') {
                html += formatHeader(character.section, 7, ``, `data-box-align="left"`);
            } else if (character.section && character.section === `` && data[0].section !== ``) {
                html += formatHeader(`miscellaneous employees`, 7, ``, `data-box-align="left"`);
            }
            html += formatClaim(character.Character, lines, character.GroupID, `?showuser=${character.AccountID}`, ``, `data-employer="${character.employer}"`);
        } else {
            html += formatClaim(character.Character, lines, character.GroupID, `?showuser=${character.AccountID}`, ``, `data-employer="${character.employer}"`);
        }
    });

    return html;
}
function formatBusinessContent(business, employees) {
    //let active = employees.filter(item => item.Status && item.Status === 'approved');
    employees = sortEmployees(employees);
    let owner = JSON.parse(business.Owner);
    let hours = JSON.parse(business.Hours);

    let hiringText = ``;
    switch(business.Hiring) {
        case `yes`:
            hiringText = `Currently Hiring`;
            break;
        case `ask first`:
            hiringText = `Tentatively hiring`;
            break;
        default:
            hiringText = `Not Hiring`;
            break;
    }

    let wantedLink = ``;
    if(business.Wanted && business.Wanted !== ``) {
        wantedLink = `<tag-highlight><a href="${business.Wanted}">Learn more</a></tag-highlight>`;
    }

    let hoursText = ``;
    if(hours[0].text) {
        hoursText = `<div class="hour-set">${hours[0].text}</div>`;
    } else if(hours[0].range) {
        hours.forEach(hourSet => {
            hoursText += `<div class="hour-set"><b>${hourSet.range}</b><span>${hourSet.time}</span></div>`;
        });
    }

    let html = `<h2 data-box-align="center">${business.Employer}</h2>
    <div class="h7" data-text-align="center">
        Located in <a href="?showforum=${business.LocationID}">${business.Location}</a>
    </div>
    <div data-type="flex" style="margin: 30px 0; justify-content: center;">
    <tag-highlight>Created by <a href="?showuser=${owner.id}">${owner.alias}</a></tag-highlight>
        <tag-highlight>${hiringText}</tag-highlight>
        ${wantedLink}
    </div>
    <div data-type="grid" data-columns="2">
        <div>
            <div class="h6">About</div>
            <blockquote>${business.Summary}</blockquote>
        </div>
        <div>
            <div class="h6">Hours</div>
            <blockquote>${hoursText}</blockquote>
        </div>
    </div>`;

    if(employees.length > 0) {
        html += `<div class="h6">Employees</div>
        <div data-type="grid" data-columns="4">
            ${generateEmployeeList(employees)}
        </div>`;
    }

    return html;
}
function filterBusinesses(e) {
    let searchValue = e.value.toLowerCase().trim();
    let names = document.querySelectorAll(`.webpage--menu .accordion--content a`);
    let accordions = document.querySelectorAll(`.accordion--content`);
    let accordionTriggers = document.querySelectorAll(`.accordion--trigger`);
    let matches = [];
    if(searchValue !== '') {
        names.forEach(name => {
            let nameValue = name.innerText.toLowerCase().trim();
            if (nameValue.indexOf(searchValue) > -1) {
                name.classList.remove('hidden');
                matches.push(name);
            } else {
                name.classList.add('hidden');
            }
        });
        if(matches.length > 0) {
            matches.forEach(match => {
                match.closest('.accordion--content').classList.add('is-active');
                match.closest('.accordion--content').previousElementSibling.classList.add('is-active');
            })
        }
    } else {
        names.forEach(name => name.classList.remove('hidden'));
        accordions.forEach(accordion => accordion.classList.remove('is-active'));
        accordionTriggers.forEach(trigger => trigger.classList.remove('is-active'));
    }
}
function filterEmployees(e) {
    let searchValue = e.value.toLowerCase().trim();
    let names = document.querySelectorAll(`.webpage--content .claim > a`);
    let businesses = document.querySelectorAll(`.webpage--menu .accordion--content a`);
    let businessNames = Array.from(businesses).map(business => business.innerText.toLowerCase().trim());
    let accordions = document.querySelectorAll(`.accordion--content`);
    let accordionTriggers = document.querySelectorAll(`.accordion--trigger`);
    let matches = [];
    businesses.forEach(business => business.classList.add('hidden'));
    if(searchValue !== '') {
        names.forEach(name => {
            let nameValue = name.innerText.toLowerCase().trim();
            let employer = name.dataset.employer.toLowerCase().trim();
            let index = businessNames.findIndex(business => business === employer);
            if (nameValue.indexOf(searchValue) > -1) {
                businesses[index].classList.remove('hidden');
                matches.push(businesses[index]);
            }
        });
        if(matches.length > 0) {
            matches.forEach(match => {
                match.closest('.accordion--content').classList.add('is-active');
                match.closest('.accordion--content').previousElementSibling.classList.add('is-active');
            })
        }
    } else {
        businesses.forEach(name => name.classList.remove('hidden'));
        accordions.forEach(accordion => accordion.classList.remove('is-active'));
        accordionTriggers.forEach(trigger => trigger.classList.remove('is-active'));
    }
}

/****** Addresses ******/
function formatAddressBook(data) {
    data = data.filter(item => item.Address && item.Address !== '' && item.Status && item.Status === 'approved');
    let addresses = [];
    data.forEach(item => {
        if(item.Character && item.Character !== '') {
            addresses.push({
                title: capitalize(item.Character),
                link: `?showuser=${item.AccountID}`,
                group: item.GroupID,
                address: JSON.parse(item.Address),
            });
        } else {
            addresses.push({
                title: capitalize(item.Employer, [' ', '-']),
                link: `?act=Pages&kid=businesses#${cleanText(item.Employer)}`,
                group: ``,
                address: JSON.parse(item.Address),
            });
        }
    });

    addresses.sort((a, b) => {
        if(a.address.region < b.address.region) {
            return -1;
        } else if(a.address.region > b.address.region) {
            return 1;
        } else if(a.address.neighbourhood < b.address.neighbourhood) {
            return -1;
        } else if(a.address.neighbourhood > b.address.neighbourhood) {
            return 1;
        } else if(a.address.street < b.address.street) {
            return -1;
        } else if(a.address.street > b.address.street) {
            return 1;
        } else if(parseInt(a.address.house) < parseInt(b.address.house)) {
            return -1;
        } else if(parseInt(a.address.house) > parseInt(b.address.house)) {
            return 1;
        } else if(parseInt(a.address.apartment) < parseInt(b.address.apartment)) {
            return -1;
        } else if(parseInt(a.address.apartment) > parseInt(b.address.apartment)) {
            return 1;
        } else if(a.title < b.title) {
            return -1;
        } else if(a.title > b.title) {
            return 1;
        } else {
            return 0;
        }
    });

    let labels = ``;
    let tabs = ``;

    addresses.forEach((address, i) => {
        let lines = [`${address.address.house} ${address.address.street}`];
        if(address.address.apartment !== '') {
            lines.push(`Unit ${address.address.apartment}`)
        }

        if(i === 0) {
            labels += formatLabel(address.address.region);
            tabs += openTab(address.address.region);
            tabs += formatHeader(address.address.region, '2', '', `data-box-align="center"`);
            tabs += `<div class="accordion">`
            tabs += formatHeader(address.address.neighbourhood, '3', 'accordion--trigger');
            tabs += startAccordion(`class="accordion"`);
            tabs += formatHeader(address.address.street, '6', 'accordion--trigger');
            tabs += startAccordion(`data-type="grid" data-columns="4"`);
            tabs += formatClaim(address.title, lines, address.group, address.link);
        } else if(addresses[i - 1].address.region !== address.address.region) {
            labels += formatLabel(address.address.region);
            tabs += stopAccordion();
            tabs += stopAccordion();
            tabs += `</div>`;
            tabs += closeTab();
            tabs += openTab(address.address.region);
            tabs += formatHeader(address.address.region, '2', '', `data-box-align="center"`);
            tabs += `<div class="accordion">`
            tabs += formatHeader(address.address.neighbourhood, '3', 'accordion--trigger');
            tabs += startAccordion(`class="accordion"`);
            tabs += formatHeader(address.address.street, '6', 'accordion--trigger');
            tabs += startAccordion(`data-type="grid" data-columns="4"`);
            tabs += formatClaim(address.title, lines, address.group, address.link);
        } else if(addresses[i - 1].address.neighbourhood !== address.address.neighbourhood) {
            tabs += stopAccordion();
            tabs += stopAccordion();
            tabs += formatHeader(address.address.neighbourhood, '3', 'accordion--trigger');
            tabs += startAccordion(`class="accordion"`);
            tabs += formatHeader(address.address.street, '6', 'accordion--trigger');
            tabs += startAccordion(`data-type="grid" data-columns="4"`);
            tabs += formatClaim(address.title, lines, address.group, address.link);
        } else if(addresses[i - 1].address.street !== address.address.street) {
            tabs += stopAccordion();
            tabs += formatHeader(address.address.street, '6', 'accordion--trigger');
            tabs += startAccordion(`data-type="grid" data-columns="4"`);
            tabs += formatClaim(address.title, lines, address.group, address.link);
        } else {
            tabs += formatClaim(address.title, lines, address.group, address.link);
        }

        if(addresses.length - 1 === i) {
            tabs += stopAccordion();
            tabs += stopAccordion();
            tabs += `</div>`;
            tabs += closeTab();
        }
    });

    document.querySelector('.webpage--menu .accordion--content[data-category="addresses"]').innerHTML = labels;
    document.querySelector('.webpage--content [data-category="addresses"] tag-tabset').innerHTML = tabs;
}

/****** Connections ******/
function formatConnections(data) {
    data = data.filter(item => item.Connections && item.Connections !== '' && item.Status && item.Status === 'approved');
    
    let connections = [];
    data.forEach(item => {
        item.Connections = JSON.parse(item.Connections);
        item.Connections.forEach(connection => {
            connections.push({
                title: item.Character,
                link: `?showuser=${item.AccountID}`,
                group: item.GroupID,
                playedBy: `Played by <a href="?showuser=${item.ParentID}">${item.Member}</a>`,
                connection: connection,
            });
        });
    });

    let local = connections.filter(item => item.connection.type === 'local');
    let historical = connections.filter(item => item.connection.type === 'historical');

    formatLocalConnections(local);
    formatHistoryConnections(historical);
}
function formatLocalConnections(data) {
    let html = ``;

    data.sort((a, b) => {
        if(parseInt(a.connection.priority) < parseInt(b.connection.priority)) {
            return -1;
        } else if(parseInt(a.connection.priority) > parseInt(b.connection.priority)) {
            return 1;
        } else if(a.connection.subcategory < b.connection.subcategory) {
            return -1;
        } else if(a.connection.subcategory > b.connection.subcategory) {
            return 1;
        } else if(a.connection.category === 'local history' && b.connection.category === 'local history' && (a.connection.role < b.connection.role)) {
            return -1;
        } else if(a.connection.category === 'local history' && b.connection.category === 'local history' && (a.connection.role > b.connection.role)) {
            return 1;
        } else if(a.title < b.title) {
            return -1;
        } else if(a.title > b.title) {
            return 1;
        } else {
            return 0;
        }
    });

    data.forEach((item, i) => {
        let lines = [`${item.connection.role}`, item.playedBy];

        if(i === 0) {
            html += formatHeader(`Local Connections`, '2', ``, `data-box-align="center"`);
            html += `<div class="accordion" style="margin-top: 30px;">`
            html += formatHeader(item.connection.category, '3', 'accordion--trigger');
            html += startAccordion(`class="accordion"`);
            html += formatHeader(item.connection.subcategory, '6', 'accordion--trigger');
            html += startAccordion(`data-type="grid" data-columns="4"`);
            html += formatClaim(item.title, lines, item.group, item.link);
        } else if(data[i - 1].connection.category !== item.connection.category) {
            html += stopAccordion();
            html += stopAccordion();
            html += `</div>`;
            html += `<div class="accordion" style="margin-top: 30px;">`
            html += formatHeader(item.connection.category, '3', 'accordion--trigger');
            html += startAccordion(`class="accordion"`);
            html += formatHeader(item.connection.subcategory, '6', 'accordion--trigger');
            html += startAccordion(`data-type="grid" data-columns="4"`);
            html += formatClaim(item.title, lines, item.group, item.link);
        } else if(data[i - 1].connection.subcategory !== item.connection.subcategory) {
            html += stopAccordion();
            html += formatHeader(item.connection.subcategory, '6', 'accordion--trigger');
            html += startAccordion(`data-type="grid" data-columns="4"`);
            html += formatClaim(item.title, lines, item.group, item.link);
        } else {
            html += formatClaim(item.title, lines, item.group, item.link);
        }

        if(data.length - 1 === i) {
            html += stopAccordion();
            html += stopAccordion();
            html += `</div>`;
        }
    });

    document.querySelector('tag-tab[data-key="#local"] .scroll').innerHTML = html;
}
function formatHistoryConnections(data) {
    let html = ``;

    data.sort((a, b) => {
        if(parseInt(a.connection.priority) < parseInt(b.connection.priority)) {
            return -1;
        } else if(parseInt(a.connection.priority) > parseInt(b.connection.priority)) {
            return 1;
        } else if(a.connection.subcategory < b.connection.subcategory) {
            return -1;
        } else if(a.connection.subcategory > b.connection.subcategory) {
            return 1;
        } else if(a.connection.location < b.connection.location) {
            return -1;
        } else if(a.connection.location > b.connection.location) {
            return 1;
        } else if(a.title < b.title) {
            return -1;
        } else if(a.title > b.title) {
            return 1;
        } else {
            return 0;
        }
    });

    data.forEach((item, i) => {
        let lines = [`${item.connection.role}`, item.playedBy];

        if(i === 0) {
            html += formatHeader(`Historical Connections`, '2', ``, `data-box-align="center"`);
            html += `<div class="accordion" style="margin-top: 30px;">`
            html += formatHeader(item.connection.category, '3', 'accordion--trigger');
            html += startAccordion(`class="accordion"`);
            html += formatHeader(item.connection.subcategory, '6', 'accordion--trigger');
            html += startAccordion(`data-type="grid" data-columns="4"`);
            html += item.connection.location !== '' ? formatHeader(item.connection.location, '7', ``, `data-box-align="left" style="margin: 0 auto -20px 0"`) : ``;
            html += formatClaim(item.title, lines, item.group, item.link);
        } else if(data[i - 1].connection.category !== item.connection.category) {
            html += stopAccordion();
            html += stopAccordion();
            html += `</div>`;
            html += `<div class="accordion" style="margin-top: 30px;">`
            html += formatHeader(item.connection.category, '3', 'accordion--trigger');
            html += startAccordion(`class="accordion"`);
            html += formatHeader(item.connection.subcategory, '6', 'accordion--trigger');
            html += startAccordion(`data-type="grid" data-columns="4"`);
            html += item.connection.location !== '' ? formatHeader(item.connection.location, '7', ``, `data-box-align="left" style="margin: 0 auto -20px 0"`) : ``;
            html += formatClaim(item.title, lines, item.group, item.link);
        } else if(data[i - 1].connection.subcategory !== item.connection.subcategory) {
            html += stopAccordion();
            html += formatHeader(item.connection.subcategory, '6', 'accordion--trigger');
            html += startAccordion(`data-type="grid" data-columns="4"`);
            html += item.connection.location !== '' ? formatHeader(item.connection.location, '7', ``, `data-box-align="left" style="margin: 0 auto -20px 0"`) : ``;
            html += formatClaim(item.title, lines, item.group, item.link);
        } else if(data[i - 1].connection.location !== item.connection.location) {
            html += item.connection.location !== '' ? formatHeader(item.connection.location, '7', ``, `data-box-align="left" style="margin: 0 auto -20px 0"`) : ``;
            html += formatClaim(item.title, lines, item.group, item.link);
        } else {
            html += formatClaim(item.title, lines, item.group, item.link);
        }

        if(data.length - 1 === i) {
            html += stopAccordion();
            html += stopAccordion();
            html += `</div>`;
        }
    });

    document.querySelector('tag-tab[data-key="#historical"] .scroll').innerHTML = html;
}
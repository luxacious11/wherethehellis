//General
function initWebpages() {
    //remove staff for non-staff
    if(!document.querySelector('body').classList.contains('g-4')) {
        document.querySelectorAll('.staffOnly').forEach(item => item.remove());
    }

    //remove loading screen
    document.querySelector('body').classList.remove('loading');
    document.querySelector('#loading').remove();
    initTabs(true, '.webpage', '.webpage--menu', '.webpage--content', 'is-active', '.tab-category', ['.webpage--menu .accordion--trigger', '.webpage--menu .accordion--content', '.webpage--menu .accordion--content a', '.webpage--content .tab-category', '.webpage--content .tab-category tag-tab']);

    //accordions
    initAccordion();
}
function toggleWebpageMenu(e) {
    e.closest('.webpage--menu').classList.toggle('is-open');
}
function reloadForm(e) {
	location.reload();
}
function sendDiscordMessage(webhook, embedTitle, message, notification = null, color = null) {
    const request = new XMLHttpRequest();
    request.open("POST", webhook);

    request.setRequestHeader('Content-type', 'application/json');

    const params = {
        "content": notification,
        "embeds": [
            {
            "title": embedTitle,
            "description": message,
            "color": parseInt(color, 16)
            }
        ],
        "attachments": []
	};

    request.send(JSON.stringify(params));
}
function sendAjax(form, data, successMessage, staffDiscord, publicDiscord) {
    $(form).trigger('reset');
    
    $.ajax({
        url: `https://script.google.com/macros/s/${deployID}/exec`,   
        data: data,
        method: "POST",
        type: "POST",
        dataType: "json", 
        success: function () {
            console.log('success');
            if(staffDiscord) {
                sendDiscordMessage(`https://discord.com/api/webhooks/${staffDiscord.hook}`, staffDiscord.title, staffDiscord.text, staffDiscord.notification, staffDiscord.color);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('error');
            form.innerHTML = `Whoops! The sheet connection didn't quite work. Please refresh the page and try again! If this persists, please open the console (ctrl + shift + J) and send Lux a screenshot of what's there.`;
        },
        complete: function () {
            form.querySelector('button[type="submit"]').innerText = `Submit`;
            
            if(successMessage) {
                form.innerHTML = successMessage;
            }

            window.scrollTo(0, 0);
            
            console.log('complete');
            if(publicDiscord) {
                sendDiscordMessage(`https://discord.com/api/webhooks/${publicDiscord.hook}`, publicDiscord.title, publicDiscord.text, publicDiscord.notification, publicDiscord.color);
            }
        }
    });
}
function checkToggle(field, ifclass) {
    if(field.checked) {
        document.querySelectorAll(ifclass).forEach(item => item.classList.remove('hidden'));
    } else {
        document.querySelectorAll(ifclass).forEach(item => item.classList.add('hidden'));
    }

    field.addEventListener('change', e => {
        checkToggle(e.currentTarget, ifclass);
    });
}
function simpleFieldToggle(field, ifclass, showIf) {
    if(field.options[field.selectedIndex].value === showIf) {
        document.querySelectorAll(ifclass).forEach(item => item.classList.remove('hidden'));
    } else {
        document.querySelectorAll(ifclass).forEach(item => item.classList.add('hidden'));
    }

    field.addEventListener('change', e => {
        simpleFieldToggle(e.currentTarget, ifclass, showIf);
    });
}
function complexFieldToggle(field, ifclass, showIf, equals) {
    let show = false;
    if(showIf.includes(field.options[field.selectedIndex].value)) {
        if(equals) {
            show = true;
        }
    } else {
        if(!equals) {
            show = true;
        }
    }
    if(show) {
        document.querySelectorAll(ifclass).forEach(item => item.classList.remove('hidden'));
    } else {
        document.querySelectorAll(ifclass).forEach(item => item.classList.add('hidden'));
    }

    field.addEventListener('change', e => {
        complexFieldToggle(e.currentTarget, ifclass, showIf, equals);
    });
}
function getAccountID(field) {
    return field.value.trim().split('?showuser=').length > 1 ? field.value.split('?showuser=')[1].split('#')[0].trim() : field.value.trim();
}
function getSelectValue(field) {
    return field.options[field.selectedIndex].value.toLowerCase().trim();
}
function getSelectText(field) {
    return field.options[field.selectedIndex].innerText.toLowerCase().trim();
}

//Reserve Face
function checkActiveReserve (timestamp) {
    let current = new Date();
    let time = new Date(timestamp);
    let difference = Math.floor(((current - time) / (1000*60*60*24)));

    return difference;
}
function handleWarning(form, message) {
    if(form.querySelector('.warning')) {
        form.querySelector('.warning').remove();
    }
    form.insertAdjacentHTML('afterbegin', message);

    form.querySelector('button[type="submit"]').innerText = `Submit`;
}
function checkClaimedFaces(form, data, success, staffDiscord = null, publicDiscord = null) {
    fetch(`https://opensheet.elk.sh/${sheetID}/Claims`)
    .then((response) => response.json())
    .then((claimData) => {
        let created = claimData.filter(item => item.Face === data.Face);
        if(created.length > 0) {
            handleWarning(form, claimExists);
        } else {
            checkReservedFaces(form, data, success, staffDiscord, publicDiscord);
        }
    });
}
function checkReservedFaces(form, data, success, staffDiscord = null, publicDiscord = null) {
    fetch(`https://opensheet.elk.sh/${sheetID}/FaceReserves`)
    .then((response) => response.json())
    .then((reserveData) => {
        let existing = reserveData.filter(item => item.Face === data.Face);
        let oldReserves = [];

        if(existing.length > 0) {
            existing.forEach((reserve, i) => {
                let difference = checkActiveReserve(reserve.Timestamp);
                if(difference < 14) {
                    handleWarning(form, activeResExists);
                } else {
                    oldReserves.push(reserve);
                    existing.splice(i, 1);
                }
            });
            if(existing.length > 0) {
                handleWarning(form, activeResExists);
            } else {
                oldReserves.forEach(reserve => {
                    if(reserve.Member === data.Member) {
                        handleWarning(form, prevResExists);
                    } else {
                        sendAjax(form, data, success, staffDiscord, publicDiscord);
                    }
                });
            }
        } else {
            sendAjax(form, data, success, staffDiscord, publicDiscord);
        }
    });
}
function setExpiry(timestamp) {
    let reserveDate = new Date(timestamp);
    reserveDate.setDate(reserveDate.getDate() + 14);
    const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october',	'november', 'december'];
    let expiry = `${months[reserveDate.getMonth()]} ${reserveDate.getDate()}, ${reserveDate.getFullYear()}`;
    return expiry;
}

//Reserve Role
function setPlotOptions(data, formID, field) {
    let plotOptions = `<option value="">(select)</option>`;
    data.forEach(plot => {
        plotOptions += `<option value="${plot.PlotID}">${capitalize(plot.Plot, [' ', '-'])}</option>`;
    });
    document.querySelector(`${formID} ${field}`).innerHTML = plotOptions;

    setPlotSwitchers(formID, data);
}
function setPlotSwitchers(formID, data) {
    let form = document.querySelector(formID);
    let plotField = form.querySelector('#plot');
    let sectionField = form.querySelector('#section');
    let roleField = form.querySelector('#role');

    plotField.addEventListener('change', e => {
        let selectedPlot = e.currentTarget.options[e.currentTarget.selectedIndex].innerText.toLowerCase();
        let activePlot = data.filter(plot => selectedPlot === plot.Plot)[0];
        let sections = JSON.parse(activePlot.Sections);
        let sectionOptions = `<option value="">(select)</option>`;
        sections.forEach(section => {
            sectionOptions += `<option value="${cleanText(section.title)}">${capitalize(section.title, [' ', '-'])}</option>`;
        });
        sectionField.innerHTML = sectionOptions;
    });

    sectionField.addEventListener('change', e => {
        let selectedPlot = plotField.options[plotField.selectedIndex].innerText.toLowerCase();
        let activePlot = data.filter(plot => selectedPlot === plot.Plot)[0];
        let sections = JSON.parse(activePlot.Sections);
        let selectedSection = e.currentTarget.options[e.currentTarget.selectedIndex].innerText.toLowerCase().trim();
        let activeSection = sections.filter(section => selectedSection === section.title)[0];
        let roles = activeSection.roles;
        let roleOptions = `<option value="">(select)</option>`;
        roles.forEach(role => {
            roleOptions += `<option value="${cleanText(role.role)}" data-limit="${role.limit}">${capitalize(role.role, [' ', '-'])}</option>`;
        });
        roleField.innerHTML = roleOptions;
    });
}
function checkRoleLimit(form, data, success, staffDiscord, publicDiscord) {
    fetch(`https://opensheet.elk.sh/${sheetID}/Claims`)
    .then((response) => response.json())
    .then((claimData) => {
        let singleRoles = [];
        claimData = claimData.filter(claim => claim.Roles && claim.Roles !== '');

        claimData.forEach(item => {
            let rolesArray = JSON.parse(item.Roles);
            rolesArray.forEach(role => {
                singleRoles.push({
                    Role: role,
                    Character: item.Character,
                    AccountID: item.AccountID,
                    Member: item.Member,
                    ParentID: item.ParentID,
                    Group: item.Group,
                    GroupID: item.GroupID,
                });
            });
        });

        singleRoles.forEach(role => {
            if(role.Role.role === data.Role) {
                data.Instances++;
            }
        });

        if(data.Instances >= data.Limit) {
            handleWarning(form, limitReached);
        } else {
            checkReservedRoles(form, data, success, staffDiscord, publicDiscord);
        }
    });
}
function checkReservedRoles(form, data, success, staffDiscord = null, publicDiscord = null) {
    fetch(`https://opensheet.elk.sh/${sheetID}/PlotReserves`)
    .then((response) => response.json())
    .then((reserveData) => {
        let existing = reserveData.filter(item => item.Plot === data.Plot && item.Section === data.Section && item.Role === data.Role);

        if(existing.length > 0) {
            existing.forEach((reserve, i) => {
                let difference = checkActiveReserve(reserve.Timestamp);
                if(difference < 14) {
                    data.Instances++;
                }
            });
        }
        
        if(data.Limit !== 'unlimited' && data.Instances < data.Limit) {
            sendAjax(form, data, success, staffDiscord, publicDiscord);
        } else {
            handleWarning(form, limitReached);
        }
        
    });
}

//Get Sorted/Edit Claims
function setEmployers(data, formID, wrapClass) {
    data = data.filter(employer => employer.Hiring && (employer.Hiring === 'yes' || employer.Hiring === 'ask first'));
    data.sort((a, b) => {
        if (a.Hiring.toLowerCase() === 'yes' && b.Hiring.toLowerCase() !== 'yes') {
            return -1;
        } else if (a.Hiring.toLowerCase() !== 'yes' && b.Hiring.toLowerCase() === 'yes') {
            return 1;
        } else if (a.Employer.toLowerCase().replace('the ', '') < b.Employer.toLowerCase().replace('the ', '')) {
            return -1;
        } else if (a.Employer.toLowerCase().replace('the ', '') > b.Employer.toLowerCase().replace('the ', '')) {
            return 1;
        } else {
            return 0;
        }
    });

    let employerOptions = `<option value="">(select)</option><option value="self-employed">Self-Employed</option>`;
    data.forEach((employer, i) => {
        if(i === 0) {
            let optgroup = `Ask First`;
            if(employer.Hiring.toLowerCase() === 'yes') {
                optgroup = `Actively Hiring`;
            }
            employerOptions += `<optgroup label="${optgroup}">`;
            employerOptions += `<option value="${employer.Employer}">${capitalize(employer.Employer)}</option>`;
        }
        //Different Hiring Status
        else if (data[i - 1].Hiring.toLowerCase() !== employer.Hiring.toLowerCase()) {
            let optgroup = `Ask First`;
            if(employer.Hiring.toLowerCase() === 'yes') {
                optgroup = `Actively Hiring`;
            }
            employerOptions += `</optgroup>`;
            employerOptions += `<optgroup label="${optgroup}">`;
            employerOptions += `<option value="${employer.Employer}">${capitalize(employer.Employer)}</option>`;
        } else {
            employerOptions += `<option value="${employer.Employer}">${capitalize(employer.Employer)}</option>`;
        }
        if(i === data.length - 1) {
            employerOptions += `</optgroup>`;
        }
    });
    document.querySelector(`${formID} ${wrapClass}:last-child .employer select`).innerHTML = employerOptions;
}
function setMultiplePlotOptions(data, formID, wrapClass) {
    let plotOptions = `<option value="">(select)</option>`;
    data.forEach(plot => {
        plotOptions += `<option value="${plot.PlotID}">${capitalize(plot.Plot, [' ', '-'])}</option>`;
    });
    document.querySelector(`${formID} ${wrapClass}:last-child .plot select`).innerHTML = plotOptions;

    setMultiplePlotSwitchers(formID, data, wrapClass);
}
function setMultiplePlotSwitchers(formID, data, wrapClass) {
    let form = document.querySelector(formID);
    let plotFields = form.querySelectorAll('.plot select');
    let sectionFields = form.querySelectorAll('.plot-section select');

    plotFields.forEach(plot => {
        plot.addEventListener('change', e => {
            let row = e.currentTarget.closest(wrapClass);
            let sectionField = row.querySelector('.plot-section select');
            let selectedPlot = e.currentTarget.options[e.currentTarget.selectedIndex].innerText.toLowerCase();
            let activePlot = data.filter(plot => selectedPlot === plot.Plot)[0];
            let sections = JSON.parse(activePlot.Sections);
            let sectionOptions = `<option value="">(select)</option>`;
            sections.forEach(section => {
                sectionOptions += `<option value="${cleanText(section.title)}">${capitalize(section.title, [' ', '-'])}</option>`;
            });
            sectionField.innerHTML = sectionOptions;
        });
    });

    sectionFields.forEach(section => {
        section.addEventListener('change', e => {
            let row = e.currentTarget.closest(wrapClass);
            let plotField = row.querySelector('.plot select');
            let roleField = row.querySelector('.role select');
            let selectedPlot = plotField.options[plotField.selectedIndex].innerText.toLowerCase();
            let activePlot = data.filter(plot => selectedPlot === plot.Plot)[0];
            let sections = JSON.parse(activePlot.Sections);
            let selectedSection = e.currentTarget.options[e.currentTarget.selectedIndex].innerText.toLowerCase().trim();
            let activeSection = sections.filter(section => selectedSection === section.title)[0];
            let roles = activeSection.roles;
            let roleOptions = `<option value="">(select)</option>`;
            roles.forEach(role => {
                roleOptions += `<option value="${cleanText(role.role)}" data-limit="${role.limit}">${capitalize(role.role, [' ', '-'])}</option>`;
            });
            roleField.innerHTML = roleOptions;
        });
    });
}

//Edit Member
function editMember(form, data) {
    fetch(`https://opensheet.elk.sh/${sheetID}/Members`)
    .then((response) => response.json())
    .then((claimsData) => {
        let existing = claimsData.filter(item => item.AccountID === data.AccountID);

        //if member exists
        if(existing.length === 1) {
            existing = existing[0];
            let original = {...existing};
            let initialMessage = ``, changeMessage = ``;

            if(data.selectedChanges.includes('alias')) {
                existing.Member = data.Alias;
                if(initialMessage !== '') {
                    initialMessage += `\n`;
                    changeMessage += `\n`;
                }
                initialMessage += `**Alias:** ${capitalize(original.Member, [' ', '-'])}`;
                changeMessage += `**Alias:** ${capitalize(existing.Member, [' ', '-'])}`;
            }
    
            if(data.selectedChanges.includes('pronouns')) {
                existing.Pronouns = data.Pronouns;
                if(initialMessage !== '') {
                    initialMessage += `\n`;
                    changeMessage += `\n`;
                }
                initialMessage += `**Pronouns:** ${original.Pronoun}`;
                changeMessage += `**Pronouns:** ${existing.Pronouns}`;
            }
    
            if(data.selectedChanges.includes('age')) {
                existing.Age = data.Age;
                if(initialMessage !== '') {
                    initialMessage += `\n`;
                    changeMessage += `\n`;
                }
                initialMessage += `**Age:** ${original.Age}`;
                changeMessage += `**Age:** ${existing.Age}`;
            }
    
            if(data.selectedChanges.includes('timezone')) {
                existing.Timezone = data.Timezone;
                if(initialMessage !== '') {
                    initialMessage += `\n`;
                    changeMessage += `\n`;
                }
                initialMessage += `**Timezone:** ${original.Timezone}`;
                changeMessage += `**Timezone:** ${existing.Timezone}`;
            }
    
            if(data.selectedChanges.includes('about')) {
                existing.About = data.About;
                if(initialMessage !== '') {
                    initialMessage += `\n`;
                    changeMessage += `\n`;
                }
                initialMessage += `**About:**
                > ${original.About}\n`;
                changeMessage += `**About:**
                > ${existing.About}\n`;
            }
    
            if(data.selectedChanges.includes('triggers')) {
                existing.Triggers = data.Triggers;
                if(initialMessage !== '') {
                    initialMessage += `\n`;
                    changeMessage += `\n`;
                }
                initialMessage += `**Triggers:**
                > ${original.Triggers}\n`;
                changeMessage += `**Triggers:**
                > ${existing.Triggers}\n`;
            }
    
            if(data.selectedChanges.includes('ratings')) {
                existing.Language = data.Language;
                existing.Sex = data.Sex;
                existing.Violence = data.Violence;
                if(initialMessage !== '') {
                    initialMessage += `\n`;
                    changeMessage += `\n`;
                }
                initialMessage += `**Ratings:** ${original.Language}-${original.Sex}-${original.Violence}`;
                changeMessage += `**Ratings:** ${existing.Language}-${existing.Sex}-${existing.Violence}`;
            }

            let staffDiscord = {
                title: `Member Claims Editted: ${capitalize(original.Member, [' ', '-'])}`,
                text: `Initial Values
                ----------
                ${initialMessage}
                
                New Values
                ----------
                ${changeMessage}`,
                hook: claimLogs,
            }

            let successMessage = `<blockquote class="fullWidth">Submission successful!</blockquote>
            <button onclick="reloadForm(this)" type="button" class="fullWidth submit">Back to form</button>`;

            existing.SubmissionType = data.SubmissionType;

            sendAjax(form, existing, successMessage, staffDiscord);
        }
            
    });
}

//Edit Character
function pullCharacterClaims(field) {
    let entered = getAccountID(field);
    let existing = claimsDataVar.filter(item => item.AccountID === entered);
    let form = field.closest('form');

    if(existing.length > 0) {
        let character = existing[0];
        if(character.Jobs && character.Jobs !== '') {
            form.querySelectorAll('.ifJobChange, .ifJobRemove').forEach(item => {
                if(item.querySelector('blockquote')) {
                    item.querySelector('blockquote').remove();
                }
            });
            form.querySelector('#clip-job-change').innerHTML = formatJobChanges(character);
            form.querySelector('#clip-job-remove').innerHTML = formatJobRemoval(character);
        } else {
            form.querySelectorAll('.ifJobChange, .ifJobRemove').forEach(item => {
                if(item.querySelector('blockquote')) {
                    item.querySelector('blockquote').innerText = 'This character is not currently employed.';
                } else {
                    item.insertAdjacentHTML('beforeend', `<blockquote>This character is not currently employed.</blockquote>`)
                }
            });
        }
        if(character.Roles && character.Roles !== '') {
            form.querySelectorAll('.ifRoleChange, .ifRoleRemove').forEach(item => {
                if(item.querySelector('blockquote')) {
                    item.querySelector('blockquote').remove();
                }
            });
            form.querySelector('#clip-role-change').innerHTML = formatRoleChangesl(character);
            form.querySelector('#clip-role-remove').innerHTML = formatRoleRemoval(character);
        } else {
            form.querySelectorAll('.ifRoleChange, .ifRoleRemove').forEach(item => {
                if(item.querySelector('blockquote')) {
                    item.querySelector('blockquote').innerText = 'This character is not currently employed.';
                } else {
                    item.insertAdjacentHTML('beforeend', `<blockquote>This character is not currently employed.</blockquote>`)
                }
            });
        }
    } else {
        form.querySelectorAll('.ifRoleChange, .ifRoleRemove, .ifJobChange, .ifJobRemove').forEach(item => {
            if(item.querySelector('blockquote')) {
                item.querySelector('blockquote').innerText = 'There are no submitted characters matching the profile entered. Please confirm you have entered a profile correctly in the field above.';
            } else {
                item.insertAdjacentHTML('beforeend', `<blockquote>There are no submitted characters matching the profile entered. Please confirm you have entered a profile correctly in the field above.</blockquote>`)
            }
            item.querySelector('div').innerHTML = ``;
        });
    }
}
function editCharacter(form, data) {
    fetch(`https://opensheet.elk.sh/${sheetID}/Claims`)
    .then((response) => response.json())
    .then((claimsData) => {
        let existing = claimsData.filter(item => item.AccountID === data.AccountID);

        //if member exists
        if(existing.length === 1) {
            existing = existing[0];
            let original = {...existing};
            let initialMessage = ``, changeMessage = ``;

            if(data.selectedChanges.includes('character')) {
                existing.Character = data.Character;
                if(initialMessage !== '') {
                    initialMessage += `\n`;
                    changeMessage += `\n`;
                }
                initialMessage += `**Name:** ${capitalize(original.Character)}`;
                changeMessage += `**Name:** ${capitalize(existing.Character)}`;
            }

            if(data.selectedChanges.includes('group')) {
                existing.Group = data.Group;
                existing.GroupID = data.GroupID;
                if(initialMessage !== '') {
                    initialMessage += `\n`;
                    changeMessage += `\n`;
                }
                initialMessage += `**Group:** ${capitalize(original.Group, [' ', '-'])}`;
                changeMessage += `**Group:** ${capitalize(existing.Group, [' ', '-'])}`;
            }
            
            if(data.selectedChanges.includes('jobs-add') || data.selectedChanges.includes('jobs-change') || data.selectedChanges.includes('jobs-remove')) {
                let jobsArray = original.Jobs && original.Jobs !== '' ? JSON.parse(original.Jobs) : [];
                
                //remove jobs first
                if(data.selectedChanges.includes('jobs-remove')) {
                    let removedJobs = Array.prototype.slice.call(form.querySelectorAll('[name="remove-job"]'))
                        .filter(item => item.checked)
                        .map(item => ({
                            employer: item.dataset.employer,
                            section: item.dataset.section,
                            position: item.dataset.position,
                        }));
                    
                    removedJobs.forEach(removedJob => {
                        jobsArray.forEach(existingJob => {
                            if(cleanText(existingJob.employer) === removedJob.employer && cleanText(existingJob.section) === removedJob.section && cleanText(existingJob.position) === removedJob.position) {
                                existingJob.employer = 'remove';
                                existingJob.section = 'remove';
                                existingJob.position = 'remove';
                            }
                        });
                    });

                    jobsArray = jobsArray.filter(item => item.employer !== 'remove' && item.section !== 'remove' && item.position !== 'remove');
                }

                //then edit existing jobs
                if(data.selectedChanges.includes('jobs-change')) {
                    let editedJobs = Array.prototype.slice.call(form.querySelectorAll('#clip-job-change .job-row'));

                    editedJobs.forEach(editJob => {
                        jobsArray.forEach(job => {
                            if(cleanText(job.employer) === editJob.dataset.employer && cleanText(job.section) === editJob.dataset.section && cleanText(job.position) === editJob.dataset.position) {
                                let newSection = editJob.querySelector('.job-section input').value.toLowerCase().trim();
                                let newPosition = editJob.querySelector('.position input').value.toLowerCase().trim();
                                if(cleanText(job.section) !== cleanText(newSection) && newSection !== '') {
                                    job.section = newSection;
                                }
                                if(cleanText(job.position) !== cleanText(newPosition) && newPosition !== '') {
                                    job.position = newPosition;
                                }
                            }
                        });
                    });
                }

                //then add new jobs
                if(data.selectedChanges.includes('jobs-add')) {
                    let addedJobs = form.querySelectorAll('.job-wrap');
                    addedJobs.forEach(job => {
                        jobsArray.push({
                            employer: getSelectText(job.querySelector('.employer select')),
                            section: job.querySelector('.job-section input').value.toLowerCase().trim(),
                            position: job.querySelector('.position input').value.toLowerCase().trim(),
                        });
                    });
                }
                
                existing.Jobs = JSON.stringify(jobsArray);

                if(initialMessage !== '') {
                    initialMessage += `\n`;
                    changeMessage += `\n`;
                }
                initialMessage += `**Previous Jobs:**\n`;
                JSON.parse(original.Jobs).forEach(job => {
                    if(job.section && job.section.trim() !== '') {
                        initialMessage += `${job.employer} - ${job.position}\n`;
                    } else {
                        initialMessage += `${job.employer} - ${job.section} - ${job.position}\n`;
                    }
                });

                changeMessage += `**Updated Jobs:**\n`;
                JSON.parse(existing.Jobs).forEach(job => {
                    if(job.section && job.section.trim() !== '') {
                        changeMessage += `${job.employer} - ${job.position}\n`;
                    } else {
                        changeMessage += `${job.employer} - ${job.section} - ${job.position}\n`;
                    }
                });
            }
            
            if(data.selectedChanges.includes('roles-add') || data.selectedChanges.includes('roles-change') || data.selectedChanges.includes('roles-remove')) {
                let rolesArray = original.Roles && original.Roles !== '' ? JSON.parse(original.Roles) : [];
                
                //remove roles first
                if(data.selectedChanges.includes('roles-remove')) {
                    let removedRoles = Array.prototype.slice.call(form.querySelectorAll('[name="remove-role"]'))
                        .filter(item => item.checked)
                        .map(item => ({
                            plot: item.dataset.plot,
                            section: item.dataset.section,
                            role: item.dataset.role,
                        }));
                    
                        removedRoles.forEach(removedRole => {
                        rolesArray.forEach(existingRole => {
                            if(existingRole.plot === removedRole.plot && existingRole.section === removedRole.section && existingRole.role === removedRole.role) {
                                existingRole.plot = 'remove';
                                existingRole.section = 'remove';
                                existingRole.role = 'remove';
                            }
                        });
                    });

                    rolesArray = rolesArray.filter(item => item.plot !== 'remove' && item.section !== 'remove' && item.role !== 'remove');
                }

                //then edit existing roles
                if(data.selectedChanges.includes('roles-change')) {
                    let editedRoles = Array.prototype.slice.call(form.querySelectorAll('#clip-role-change .role-row'));

                    editedRoles.forEach(editRole => {
                        rolesArray.forEach(role => {
                            if(role.plot === editRole.dataset.plot && role.section === editRole.dataset.section && role.role === editRole.dataset.role) {
                                let newSection = getSelectText(editRole.querySelector('.role-section select'));
                                let newRole = getSelectText(editRole.querySelector('.role select'));
                                if(cleanText(role.section) !== cleanText(newSection) && newSection !== '') {
                                    role.section = newSection;
                                }
                                if(role.role !== newRole && newRole !== '') {
                                    role.role = newRole;
                                }
                            }
                        });
                    });
                }

                //then add new roles
                if(data.selectedChanges.includes('roles-add')) {
                    let addedRoles = form.querySelectorAll('.role-wrap');
                    addedRoles.forEach(addedRole => {
                        rolesArray.push({
                            plot: getSelectText(addedRole.querySelector('.plot select')),
                            section: getSelectText(addedRole.querySelector('.plot-section select')),
                            role: getSelectText(addedRole.querySelector('.role select')),
                        });
                    });
                }
                
                existing.Roles = JSON.stringify(rolesArray);

                if(initialMessage !== '') {
                    initialMessage += `\n`;
                    changeMessage += `\n`;
                }
                initialMessage += `**Previous Roles:**\n`;
                JSON.parse(original.Roles).forEach(role => {
                    initialMessage += `${role.plot} - ${role.section} - ${role.role}\n`;
                });

                changeMessage += `**Updated Roles:**\n`;
                JSON.parse(existing.Roles).forEach(role => {
                    changeMessage += `${role.plot} - ${role.section} - ${role.role}\n`;
                });
            }

            let staffDiscord = {
                title: `Character Claims Editted: ${capitalize(original.Character)}`,
                text: `Initial Values
                ----------
                ${initialMessage}
                
                New Values
                ----------
                ${changeMessage}`,
                hook: claimLogs,
                color: rgbToHex(colors[existing.Group][0], colors[existing.Group][1], colors[existing.Group][2]),
            }

            let successMessage = `<blockquote class="fullWidth">Submission successful!</blockquote>
            <button onclick="reloadForm(this)" type="button" class="fullWidth submit">Back to form</button>`;

            existing.SubmissionType = data.SubmissionType;

            sendAjax(form, existing, successMessage, staffDiscord);
        }
    });
    
    return false;
}

//Edit Business
function editBusiness(form, data) {
    fetch(`https://opensheet.elk.sh/${sheetID}/Businesses`)
    .then((response) => response.json())
    .then((claimsData) => {
        let existing = claimsData.filter(item => item.Employer === data.Employer);
        console.log(data.selectedChanges);

        //if business exists
        if(existing.length === 1) {
            existing = existing[0];
            let original = {...existing};
            let initialMessage = ``, changeMessage = ``;

            if(data.selectedChanges.includes('wanted')) {
                existing.Wanted = data.Wanted;
                if(initialMessage !== '') {
                    initialMessage += `\n`;
                    changeMessage += `\n`;
                }
                initialMessage += `**Wanted Ad:** ${original.Wanted}`;
                changeMessage += `**Wanted Ad:** ${existing.Wanted}`;
            }

            if(data.selectedChanges.includes('hiring')) {
                existing.Hiring = data.Hiring;
                if(initialMessage !== '') {
                    initialMessage += `\n`;
                    changeMessage += `\n`;
                }
                initialMessage += `**Hiring:** ${original.Hiring}`;
                changeMessage += `**Hiring:** ${existing.Hiring}`;
            }

            if(data.selectedChanges.includes('hours')) {
                existing.Hours = data.Hours;
                if(initialMessage !== '') {
                    initialMessage += `\n`;
                    changeMessage += `\n`;
                }
                initialMessage += `**Hours:**\n`;
                JSON.parse(original.Hours).forEach(set => {
                    if(set.range) {
                        initialMessage += `${set.range} (${set.time})`;
                    } else {
                        initialMessage += `${set.text})`;
                    }
                });
                changeMessage += `**Hours:**\n`;
                JSON.parse(existing.Hours).forEach(set => {
                    if(set.range) {
                        initialMessage += `${set.range} (${set.time})`;
                    } else {
                        initialMessage += `${set.text})`;
                    }
                });
            }

            let staffDiscord = {
                title: `Business Editted: ${capitalize(original.Employer, [' ', '-'])}`,
                text: `Initial Values
                ----------
                ${initialMessage}
                
                New Values
                ----------
                ${changeMessage}`,
                hook: businessLogs,
            }

            let successMessage = `<blockquote class="fullWidth">Submission successful!</blockquote>
            <button onclick="reloadForm(this)" type="button" class="fullWidth submit">Back to form</button>`;

            existing.SubmissionType = data.SubmissionType;

            sendAjax(form, existing, successMessage, staffDiscord);
        }
            
    });
}

//Adjustable Form Fields
function addRow(e) {
    if(e.closest('.multi-buttons').dataset.rowType === 'hours') {
        e.closest('.adjustable').querySelector('.rows').insertAdjacentHTML('beforeend', formatHourRow());
    } else if(e.closest('.multi-buttons').dataset.rowType === 'plotsections') {
        e.closest('.adjustable').querySelector('.rows').insertAdjacentHTML('beforeend', formatSectionFields());
    } else if(e.closest('.multi-buttons').dataset.rowType === 'plotroles') {
        e.closest('.adjustable').querySelector('.rows').insertAdjacentHTML('beforeend', formatRoleFields());
    } else if(e.closest('.multi-buttons').dataset.rowType === 'jobs') {
        e.closest('.adjustable').querySelector('.rows').insertAdjacentHTML('beforeend', formatJobFields());
        setEmployers(businessDataVar, `#${e.closest('form').getAttribute('id')}`, `.job-wrap`);
    } else if(e.closest('.multi-buttons').dataset.rowType === 'roles') {
        e.closest('.adjustable').querySelector('.rows').insertAdjacentHTML('beforeend', formatRoleClaimFields());
        setMultiplePlotOptions(subplotDataVar, `#${e.closest('form').getAttribute('id')}`, `.role-wrap`);
    }
}
function removeRow(e) {
    let rows = e.closest('.adjustable').querySelectorAll('.row');
    rows[rows.length - 1].remove();
}

//map
let regionDescription = document.querySelector('.region-desc');
let regions = document.querySelectorAll('.region');
regions.forEach(region => {
    region.addEventListener('mouseover', e => {
        let location = e.currentTarget.dataset.hover;
        regionDescription.classList.add('active');
        regionDescription.innerText = location;
    });
    region.addEventListener('mouseout', () => {
        regionDescription.classList.remove('active');
    });
});
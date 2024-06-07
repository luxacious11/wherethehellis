function formatHeader(title, level = '3', classes = ``, attributes) {
    return `<div class="fullWidth h${level} ${classes}" ${attributes}>${title}</div>`;
}
function startAccordion(attributes) {
    return `<div class="accordion--content"><div ${attributes}>`;
}
function stopAccordion() {
    return `</div></div>`;
}
function formatClaim(title, lines, group = null, link = null, classes = ``, filterAttributes = ``) {
    let html = ``;
    if(group) {
        html += `<div class="claim g-${group} ${classes}">`;
    } else {
        html += `<div class="claim ${classes}">`;
    }
    if(link) {
        html += `<a href="${link}" ${filterAttributes}>${title}</a>`;
    } else {
        html += `<b ${filterAttributes}>${title}</b>`;
    }
    lines.forEach(line => {
        html += `<span>${line}</span>`;
    })
    html += `</div>`;

    return html;
}
function formatSectionFields() {
    return `<div class="section-wrap row" data-type="grid">
        <label class="section-title">
            <b>Section Title</b>
            <span><input type="text" placeholder="Title" /></span>
        </label>
        <label class="section-overview">
            <b>Section Overview</b>
            <span><textarea placeholder="Overview"></textarea></span>
        </label>
        <label class="adjustable">
        <b>Roles</b>
        <div class="multi-buttons" data-row-type="plotroles">
            <button type="button" onclick="addRow(this)">+ Add</button>
            <button type="button" onclick="removeRow(this)">- Remove</button>
        </div>
        <div class="rows" data-type="grid"></div>
    </label>
    </div>`;
}
function formatRoleFields() {
    return `<div class="section-role row" data-type="grid" data-columns="2">
        <label class="role-title">
            <b>Role Title</b>
            <span><input type="text" placeholder="Role Name" /></span>
        </label>
        <label class="role-limit">
            <b>Role Limit</b>
            <span><input type="text" placeholder="Unlimited or a number" /></span>
        </label>
        <label class="role-description fullWidth">
            <b>Role Description</b>
            <span><input type="text" placeholder="Role Description (optional)" /></span>
        </label>
    </div>`;
}
function formatHourRow() {
    return `<div class="row" data-type="grid" data-columns="2">
        <div data-type="grid">
            <label class="days-start">
                <b>Days</b>
                <u>Start of Range</u>
                <span>
                    <select required>
                        <option value="">(select)</option>
                        <option value="mon">Monday</option>
                        <option value="tues">Tuesday</option>
                        <option value="wed">Wednesday</option>
                        <option value="thurs">Thursday</option>
                        <option value="fri">Friday</option>
                        <option value="sat">Saturday</option>
                        <option value="sun">Sunday</option>
                    </select>
                </span>
            </label>
            <label class="days-end">
                <u>End of Range</u>
                <span>
                    <select required>
                        <option value="">(select)</option>
                        <option value="mon">Monday</option>
                        <option value="tues">Tuesday</option>
                        <option value="wed">Wednesday</option>
                        <option value="thurs">Thursday</option>
                        <option value="fri">Friday</option>
                        <option value="sat">Saturday</option>
                        <option value="sun">Sunday</option>
                    </select>
                </span>
            </label>
        </div>
        <div data-type="grid">
            <label class="time-start">
                <b>Times</b>
                <u>Start of Range</u>
                <span data-type="grid">
                    <input type="text" placeholder="Opening time" required />
                </span>
            </label>
            <label class="time-end">
                <u>End of Range (optional)</u>
                <span data-type="grid">
                    <input type="text" placeholder="Closing time" />
                </span>
            </label>
        </div>
    </div>`;
}
function formatJobFields() {
    return `<div class="row job-wrap" data-type="grid" data-columns="2">
        <label class="employer fullWidth">
            <b>Employer</b>
            <span>
                <select>
                    <option value="">(select)</option>
                    <option value="self-employed">Self-Employed</option>
                </select>
            </span>
        </label>
        <label class="job-section">
            <b>Section</b>
            <span>
                <input type="text" placeholder="Section (Optional; e.g., department, branch, etc)" />
            </span>
        </label>
        <label class="position">
            <b>Position</b>
            <span>
                <input type="text" placeholder="Position" />
            </span>
        </label>
    </div>`;
}
function formatRoleClaimFields() {
    return `<div class="row role-wrap" data-type="grid" data-columns="2">
        <label class="plot fullWidth">
            <b>Plot</b>
            <span>
                <select>
                    <option value="">(select)</option>
                </select>
            </span>
        </label>
        <label class="plot-section">
            <b>Section</b>
            <span>
                <select>
                    <option value="">(select)</option>
                </select>
            </span>
        </label>
        <label class="role">
            <b>Role</b>
            <span>
                <select>
                    <option value="">(select)</option>
                </select>
            </span>
        </label>
    </div>`;
}
function formatJobChanges(data) {
    let jobs = JSON.parse(data.Jobs);
    let html = ``;
    jobs.forEach(job => {
        html += `<div data-employer="${cleanText(job.employer)}" data-section="${cleanText(job.section)}" data-position="${cleanText(job.position)}" data-type="grid" data-gap="sm" class="job-row">
            <div class="h6">${job.employer}</div>
            <div data-type="grid" data-columns="2">
                <label class="job-section">
                    <b>Section</b>
                    <span><input type="text" placeholder="${job.section}"></span>
                </label>
                <label class="position">
                    <b>Position</b>
                    <span><input type="text" placeholder="${job.position}"></span>
                </label>
            </div>
        </div>`;
    });
    
    return html;
}
function formatJobRemoval(data) {
    let jobs = JSON.parse(data.Jobs);
    let html = ``;
    jobs.forEach(job => {
        let label = ``;
        if(job.section && job.section !== '') {
            label = `${capitalize(job.employer, [' ', '-'])} - ${capitalize(job.section, [' ', '-'])} - ${capitalize(job.position, [' ', '-'])}`;
        } else {
            label = `${capitalize(job.employer, [' ', '-'])} - ${capitalize(job.position, [' ', '-'])}`;
        }
        html += `<label class="input-wrap">
            <input type="checkbox" name="remove-job" data-employer="${cleanText(job.employer)}" data-section="${cleanText(job.section)}" data-position="${cleanText(job.position)}">
            <div class="fancy-input checkbox"><i class="fa-solid fa-check"></i></div>
            <strong>${label}</strong>
        </label>`;
    });
    
    return html;
}
function formatRoleChangesl(data) {
    let roles = JSON.parse(data.Roles);
    let html = ``;

    roles.forEach(role => {
        let activePlot = subplotDataVar.filter(plot => role.plot === plot.Plot)[0];
        let sections = JSON.parse(activePlot.Sections);
        let sectionOptions = `<option value="">(select)</option>`;
        sections.forEach(section => {
            if(role.section === section.title) {
                sectionOptions += `<option value="${cleanText(section.title)}" selected>${capitalize(section.title, [' ', '-'])}</option>`;
            } else {
                sectionOptions += `<option value="${cleanText(section.title)}">${capitalize(section.title, [' ', '-'])}</option>`;
            }
        });
        let activeSection = sections.filter(section => role.section === section.title)[0];
        let plotRoles = activeSection.roles;
        let roleOptions = `<option value="">(select)</option>`;
        plotRoles.forEach(plotRole => {
            if(role.role === plotRole.role) {
                roleOptions += `<option value="${cleanText(plotRole.role)}" data-limit="${plotRole.limit}" selected>${capitalize(plotRole.role, [' ', '-'])}</option>`;
            } else {
                roleOptions += `<option value="${cleanText(plotRole.role)}" data-limit="${plotRole.limit}">${capitalize(plotRole.role, [' ', '-'])}</option>`;
            }
        });

        html += `<div data-plot="${role.plot}" data-section="${role.section}" data-role="${role.role}" data-type="grid" data-gap="sm" class="role-row">
            <div class="h6">${role.plot}</div>
            <div data-type="grid" data-columns="2">
                <label class="role-section">
                    <b>Section</b>
                    <span><select>${sectionOptions}</select></span>
                </label>
                <label class="role">
                    <b>Role</b>
                    <span><select>${roleOptions}</select></span>
                </label>
            </div>
        </div>`;
    });
    
    return html;
}
function formatRoleRemoval(data) {
    let roles = JSON.parse(data.Roles);
    let html = ``;
    roles.forEach(role => {
        html += `<label class="input-wrap">
            <input type="checkbox" name="remove-role" data-plot="${role.plot}" data-section="${role.section}" data-role="${role.role}">
            <div class="fancy-input checkbox"><i class="fa-solid fa-check"></i></div>
            <strong>${role.plot} - ${role.section} - ${role.role}</strong>
        </label>`;
    });
    
    return html;
}
function openMenuSection(category, firstLabel) {
    return `<tag-label data-category="${cleanText(category)}" class="tab-category accordion--trigger">
        <span>${category}</span>
    </tag-label>
    <div data-category="${cleanText(category)}" class="tab-category accordion--content">
        <a href="#${cleanText(firstLabel)}">${firstLabel}</a>`;
}
function closeMenuSection() {
    return `</div>`;
}
function formatLabel(label) {
    return `<a href="#${cleanText(label)}">${label}</a>`;
}
function openTabCategory(category, content) {
    return `<tag-tab class="tab-category" data-category="${cleanText(category)}">
        <tag-tabset>
            ${content}`;
}
function closeTabCategory() {
    return `</tag-tabset>
    </tag-tab>`;
}
function formatTab(label, content) {
    return `<tag-tab data-key="#${cleanText(label)}">
        <div class="webpage--content-inner"><div class="scroll">
            ${content}
        </div></div>
    </tag-tab>`;
}
function openTab(label) {
    return `<tag-tab data-key="#${cleanText(label)}">
    <div class="webpage--content-inner"><div class="scroll">`;
}
function closeTab() {
    return `</div></div>
    </tag-tab>`;
}
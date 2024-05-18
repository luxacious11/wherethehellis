/****** Plots ******/
function formatSubplots(plots, characters) {
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

    clipPlotClaims(characters.filter(item => item.Status && item.Status.toLowerCase() === 'approved'));
}
function clipPlotClaims(data) {
    let roles = [];
    data = data.filter(item => item.Roles && item.Roles !== '');

    data.forEach(item => {
        let rolesArray = item.Roles.split('+').map(role => JSON.parse(role));
        rolesArray.forEach(role => {
            roles.push({
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

    roles.sort((a, b) => {
        if(a.Character < b.Character) {
            return -1;
        } else if(a.Character > b.Character) {
            return 1;
        } else {
            return 0;
        }
    });

    roles.forEach(role => {
        let html = formatClaim(role.Character, [`Played by <a href="?showuser=${role.ParentID}">${role.Member}</a>`], role.GroupID, `?showuser=${role.AccountID}`);
        document.querySelector(`[data-plot="${role.Role.plot}"][data-section="${role.Role.section}"][data-role="${role.Role.role}"]`).insertAdjacentHTML('beforeend', html);
    });
}
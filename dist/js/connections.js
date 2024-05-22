//address
let addressType = document.querySelectorAll('.form-address #type');
addressType.forEach(field => {
    setAddressType(field);
});
document.querySelectorAll('.form-address').forEach(form => {
    form.addEventListener('submit', e => {
        e.preventDefault();
    
        let form = e.currentTarget;
        let type = getSelectValue(form.querySelector('#type')).toLowerCase().trim();
        let identifier = type === 'residential' ? getAccountID(form.querySelector('#id')) : getSelectText(form.querySelector('#employer')).toLowerCase().trim();
        let region = getSelectText(form.querySelector('#region'));
        let neighbourhood = getSelectText(form.querySelector('#neighbourhood'));
        let street = form.querySelector('#street').value.toLowerCase().trim();
        let house = form.querySelector('#houseNumber').value.trim();
        let apartment = form.querySelector('#apartmentNumber').value.trim();
    
        let address = {
            region,
            neighbourhood,
            street,
            house,
            apartment,
        }
    
        let data = {
            SubmissionType: `${type}-address`,
            AccountID: type === 'residential' ? identifier : null,
            Employer: type === 'business' ? identifier : null,
            Address: JSON.stringify(address),
        }

        let existing, discordTitle, discordText;

        if(type === 'residential') {
            existing = claimsDataVar.filter(item => item.AccountID && item.AccountID === identifier);
        } else if(type === 'business') {
            existing = businessDataVar.filter(item => item.Employer && item.Employer === identifier);
        }

        if(existing.length > 0) {
            if(existing[0].Address && existing[0].Address !== '') {
                let original = JSON.parse(existing[0].Address);
                discordTitle = `Address Changed for ${type === 'residential' ? capitalize(existing[0].Character) : capitalize(identifier, [' ', '-'])}`;
                discordText = `**Previous Address:** ${formatAddressString(original)}`;
                discordText = `**New Address:** ${formatAddressString(address)}`;
            } else {
                discordTitle = `Address Added for ${type === 'residential' ? capitalize(existing[0].Character) : capitalize(identifier, [' ', '-'])}`;
                discordText = `**Address:** ${formatAddressString(address)}`;
            }

            let discord = {
                title: discordTitle,
                text: discordText,
                hook: claimLogs
            }

            let successMessage = `<blockquote class="fullWidth">Submission successful!</blockquote>
            <button onclick="reloadForm(this)" type="button" class="fullWidth submit">Back to form</button>`;
        
            form.querySelector('button[type="submit"]').innerText = `Submitting...`;
        
            sendAjax(form, data, successMessage, discord);
        } else {
            handleWarning(form, `No ${type === 'residential' ? 'character' : 'business'} found to assign the address to. Please double check the entered ${type === 'residential' ? 'profile URK / ID' : 'business name'} and if the information is correct and the error persists, contact Lux.`);
        }
    });
});
document.querySelector('#form-search-address').addEventListener('submit', e => {
    e.preventDefault();
    let form = e.currentTarget;
    let data = [...claimsDataVar, ...businessDataVar].filter(item => item.Address && item.Address !== '');
    searchAddress(form, data);
});

function formatAddressString(address) {
    return `${address.apartment !== '' ? `${address.apartment}-` : ``}${address.house} ${capitalize(address.street).trim()}, ${capitalize(address.neighbourhood).trim()}, ${capitalize(address.region).trim()}`;
}
function setAddressType(field) {
    let value = field.options[field.selectedIndex].value;
    let form = field.closest('form');
    switch(value) {
        case 'residential':
            form.querySelectorAll('.residentOnly').forEach(item => item.classList.remove('hidden'));
            form.querySelectorAll('.typeOnly').forEach(item => item.classList.remove('hidden'));
            form.querySelectorAll('.businessOnly').forEach(item => item.classList.add('hidden'));
            break;
        case 'business':
            form.querySelectorAll('.residentOnly').forEach(item => item.classList.add('hidden'));
            form.querySelectorAll('.typeOnly').forEach(item => item.classList.remove('hidden'));
            form.querySelectorAll('.businessOnly').forEach(item => item.classList.remove('hidden'));
            break;
        default:
            form.querySelectorAll('.residentOnly').forEach(item => item.classList.add('hidden'));
            form.querySelectorAll('.typeOnly').forEach(item => item.classList.add('hidden'));
            form.querySelectorAll('.businessOnly').forEach(item => item.classList.add('hidden'));
            break;
    }
    field.addEventListener('change', e => {
        setAddressType(e.currentTarget);
    });
}
function populateBusinessList(data) {
    data.sort((a, b) => {
        if (a.Employer.toLowerCase().trim().replace('the ', '') < b.Employer.toLowerCase().trim().replace('the ', '')) {
            return -1;
        } else if (a.Employer.toLowerCase().trim().replace('the ', '') > b.Employer.toLowerCase().trim().replace('the ', '')) {
            return 1;
        } else {
            return 0;
        }
    });

    let html = `<option value="">(select)</option>`;

    data.forEach(business => {
        html += `<option value="${cleanText(business.Employer)}">${business.Employer}</option>`
    });

    document.querySelectorAll('.business-clip').forEach(clip => {
        clip.innerHTML = html;
    })
}
function searchAddress(form, data) {
    let value = form.querySelector('#name').value.toLowerCase().trim();
    let html = `<ul>`;

    let lookupList = data.map(item => ({
        name: item.Character && item.Character !== '' ? item.Character : item.Employer,
        address: JSON.parse(item.Address),
    }));
    lookupList.sort((a, b) => {
        if(a.name < b.name) {
            return -1;
        } else if(a.name > b.name) {
            return 1;
        } else {
            return 0;
        }
    })
    lookupList.forEach(item => {
        if(item.name.includes(value) && item.address) {
            let address = item.address;
            html += `<li>
                <b>${capitalize(item.name)}</b> &mdash; ${formatAddressString(address)}
            </li>`;
        }
    });
    html += `</ul>`;

    if(html === `<ul></ul>`) {
        html = `<div class="h8" style="margin-top: 30px;">No matches found.</div>`;
    }

    document.querySelector('#lookup-results').innerHTML = html;
}

//connections
let connectionType = document.querySelectorAll('#form-connection #type');
connectionType.forEach(field => {
    setConnectionType(field);
});
function setConnectionType(field) {
    let value = field.options[field.selectedIndex].value;
    let form = field.closest('form');
    switch(value) {
        case 'historical':
            form.querySelectorAll('.histOnly').forEach(item => item.classList.remove('hidden'));
            form.querySelectorAll('.typeOnly').forEach(item => item.classList.remove('hidden'));
            form.querySelectorAll('.localOnly').forEach(item => item.classList.add('hidden'));
            break;
        case 'local':
            form.querySelectorAll('.histOnly').forEach(item => item.classList.add('hidden'));
            form.querySelectorAll('.typeOnly').forEach(item => item.classList.remove('hidden'));
            form.querySelectorAll('.localOnly').forEach(item => item.classList.remove('hidden'));
            break;
        default:
            form.querySelectorAll('.histOnly').forEach(item => item.classList.add('hidden'));
            form.querySelectorAll('.typeOnly').forEach(item => item.classList.add('hidden'));
            form.querySelectorAll('.localOnly').forEach(item => item.classList.add('hidden'));
            break;
    }
    field.addEventListener('change', e => {
        setConnectionType(e.currentTarget);
    });
}
document.querySelector('#form-connection').addEventListener('submit', e => {
    e.preventDefault();

    let form = e.currentTarget;
    let type = getSelectValue(form.querySelector('#type'));
    let id = getAccountID(form.querySelector('#id'));
    let category = getSelectText(form.querySelector('#category'));
    let priority = getSelectValue(form.querySelector('#category'));
    let subcategory = form.querySelector('#subcategory').value.toLowerCase().trim();
    let location = form.querySelector('#location').value.toLowerCase().trim();
    let role = form.querySelector('#role').value.toLowerCase().trim();

    let existing = claimsDataVar.filter(item => item.AccountID && item.AccountID === id);

    if(existing.length > 0) {
        existing = existing[0];

        let connection = {
            type,
            category,
            priority,
            subcategory,
            role,
        }

        if(type === 'historical') {
            connection.location = location;
        }

        let connections = existing.Connections ? existing.Connections : [];
        connections.push(connection);

        let data = {
            SubmissionType: 'add-connection',
            AccountID: id,
            Connections: JSON.stringify(connections),
        }

        let discord = {
            title: `New Connection Added for ${capitalize(existing.Character)}`,
            text: `**Type:** ${capitalize(type)}
            **Category:** ${capitalize(category)}
            **Subcategory:** ${capitalize(subcategory)}
            **Role:** ${capitalize(role)}`,
            hook: claimLogs,
        }

        let successMessage = `<blockquote class="fullWidth">Submission successful!</blockquote>
        <button onclick="reloadForm(this)" type="button" class="fullWidth submit">Back to form</button>`;
    
        form.querySelector('button[type="submit"]').innerText = `Submitting...`;
    
        sendAjax(form, data, successMessage, discord);
    } else {
        handleWarning(form, `No ${type === 'residential' ? 'character' : 'business'} found to assign the address to. Please double check the entered ${type === 'residential' ? 'profile URK / ID' : 'business name'} and if the information is correct and the error persists, contact Lux.`);
    }
});
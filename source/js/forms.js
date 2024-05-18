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
    
    //sendAjax(form, data, successMessage, staffDiscord);
});

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
function formatClaim(title, lines, group = null, link = null) {
    let html = ``;
    if(group) {
        html += `<div class="claim g-${group}">`;
    } else {
        html += `<div class="claim">`;
    }
    if(link) {
        html += `<a href="${link}">${title}</a>`;
    } else {
        html += `<b>${title}</b>`;
    }
    lines.forEach(line => {
        html += `<span>${line}</span>`;
    })
    html += `</div>`;

    return html;
}
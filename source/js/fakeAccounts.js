const lipsum = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;
const imageTall = `https://picsum.photos/500/800`;
const imageWide = `https://picsum.photos/800/500`;

accounts = [
    {
        universal: {
            name: formatName(`Lux`.toLowerCase().trim()),
            id: parseInt(`1`),
            groupID: parseInt(`4`),
            groupName: `Admin`.toLowerCase().trim(),
            imageTall: imageTall,
            imageWide: imageWide,
            type: `writer`.toLowerCase().trim(),
        },
        character: {
            pronouns: ``.toLowerCase().trim(),
            relationship: ``.toLowerCase().trim(),
            relationshipClass: cleanText(``).toLowerCase().trim(),
            age: parseInt(``),
            ageClass: ``,
            overview: ``,
            powerType: ``,
            powerClass: cleanText(``).toLowerCase().trim(),
            neighborhood: ``,
            neighborhoodClass: cleanText(``).toLowerCase().trim(),
        },
        writer: {
            aliasClass: cleanText(`Lux`).toLowerCase().trim(),
            alias: `Lux`.toLowerCase().trim(),
            age: parseInt(`32`),
            pronouns: `she/her`.toLowerCase().trim(),
            timezone: `GMT-04:00`.toLowerCase().trim(),
            contact: `Discord`.toLowerCase().trim(),
            triggers: lipsum
        }
    },
    {
        universal: {
            name: formatName(`Fiore Amoretti`.toLowerCase().trim()),
            id: parseInt(`8`),
            groupID: parseInt(`9`),
            groupName: `Rabbit`.toLowerCase().trim(),
            imageTall: imageTall,
            imageWide: imageWide,
            type: `character`.toLowerCase().trim(),
        },
        character: {
            pronouns: `he/him`.toLowerCase().trim(),
            relationship: `it's complicated`.toLowerCase().trim(),
            relationshipClass: cleanText(`it's complicated`).toLowerCase().trim(),
            age: parseInt(`29`),
            ageClass: `2635`,
            overview: lipsum,
            powerType: `Mixed`,
            powerClass: cleanText(`Mixed`).toLowerCase().trim(),
            neighborhood: `Pacific Market`,
            neighborhoodClass: cleanText(`Pacific Market`).toLowerCase().trim(),
        },
        writer: {
            aliasClass: cleanText(`Lux`).toLowerCase().trim(),
            alias: `Lux`.toLowerCase().trim(),
            age: parseInt(`32`),
            pronouns: `she/her`.toLowerCase().trim(),
            timezone: `GMT-04:00`.toLowerCase().trim(),
            contact: `Discord`.toLowerCase().trim(),
            triggers: lipsum
        }
    },
    {
        universal: {
            name: formatName(`Spencer Al-Nazari`.toLowerCase().trim()),
            id: parseInt(`52`),
            groupID: parseInt(`3`),
            groupName: `Unsorted`.toLowerCase().trim(),
            imageTall: imageTall,
            imageWide: imageWide,
            type: `character`.toLowerCase().trim(),
        },
        character: {
            pronouns: `she/her`.toLowerCase().trim(),
            relationship: `single`.toLowerCase().trim(),
            relationshipClass: cleanText(`single`).toLowerCase().trim(),
            age: parseInt(`27`),
            ageClass: `2635`,
            overview: lipsum,
            powerType: `Enhancement`,
            powerClass: cleanText(`Enhancement`).toLowerCase().trim(),
            neighborhood: `unset`,
            neighborhoodClass: cleanText(`unset`).toLowerCase().trim(),
        },
        writer: {
            aliasClass: cleanText(`Lux`).toLowerCase().trim(),
            alias: `Lux`.toLowerCase().trim(),
            age: parseInt(`32`),
            pronouns: `she/her`.toLowerCase().trim(),
            timezone: `GMT-04:00`.toLowerCase().trim(),
            contact: `Discord`.toLowerCase().trim(),
            triggers: lipsum
        }
    },
    {
        universal: {
            name: formatName(`Emily Lawry`.toLowerCase().trim()),
            id: parseInt(`4`),
            groupID: parseInt(`8`),
            groupName: `Wolf`.toLowerCase().trim(),
            imageTall: imageTall,
            imageWide: imageWide,
            type: `character`.toLowerCase().trim(),
        },
        character: {
            pronouns: `she/her`.toLowerCase().trim(),
            relationship: `single`.toLowerCase().trim(),
            relationshipClass: cleanText(`single`).toLowerCase().trim(),
            age: parseInt(`34`),
            ageClass: `2635`,
            overview: lipsum,
            powerType: `Elemental`,
            powerClass: cleanText(`Elemental`).toLowerCase().trim(),
            neighborhood: `Holland Heights`,
            neighborhoodClass: cleanText(`Holland Heights`).toLowerCase().trim(),
        },
        writer: {
            aliasClass: cleanText(`Spyder`).toLowerCase().trim(),
            alias: `Spyder`.toLowerCase().trim(),
            age: parseInt(`26`),
            pronouns: `They/Them`.toLowerCase().trim(),
            timezone: `GMT-05:00`.toLowerCase().trim(),
            contact: `Discord`.toLowerCase().trim(),
            triggers: lipsum
        }
    },
    {
        universal: {
            name: formatName(`Spyder`.toLowerCase().trim()),
            id: parseInt(`2`),
            groupID: parseInt(`4`),
            groupName: `Admin`.toLowerCase().trim(),
            imageTall: imageTall,
            imageWide: imageWide,
            type: `writer`.toLowerCase().trim(),
        },
        character: {
            pronouns: ``.toLowerCase().trim(),
            relationship: ``.toLowerCase().trim(),
            relationshipClass: cleanText(``).toLowerCase().trim(),
            age: parseInt(``),
            ageClass: ``,
            overview: ``,
            powerType: ``,
            powerClass: cleanText(``).toLowerCase().trim(),
            neighborhood: ``,
            neighborhoodClass: cleanText(``).toLowerCase().trim(),
        },
        writer: {
            aliasClass: cleanText(`Spyder`).toLowerCase().trim(),
            alias: `Spyder`.toLowerCase().trim(),
            age: parseInt(`26`),
            pronouns: `They/Them`.toLowerCase().trim(),
            timezone: `GMT-05:00`.toLowerCase().trim(),
            contact: `Discord`.toLowerCase().trim(),
            triggers: lipsum
        }
    }
];
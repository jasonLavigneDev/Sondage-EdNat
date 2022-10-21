export const meetingTemplate = ({ sender, date }) => `
    <h4>Votre rendez vous a été confirmé</h4>
    <br/>
    <div>
        Votre rendez-vous avec ${sender.firstName} ${sender.lastName} (${sender.emails[0].address}) 
        a été confirmé pour le ${date}
    </div>
    <br/>
    <div>
        Vous pouvez l'ajouter à votre agenda en ouvrant la pièce jointe.
    </div>
    <br/>
`;

export const eventTemplate = ({ sender, title, date }) => `
<h4>Votre évenement a été confirmé</h4>
<br/>
<div>
    Votre évenement "${title}", organisé par ${sender.firstName} ${sender.lastName} (${sender.emails[0].address}), 
    a été confirmé pour le ${date}
</div>
<br/>
<div>
    Vous pouvez l'ajouter à votre agenda en ouvrant la pièce jointe.
</div>
<br/>
`;

export const adminMeetingTemplate = ({ sender, title, date, url, connected }) => `
<h4>Un créneau a été sélectionné</h4>
<br/>
<div>
    ${
      connected
        ? ` ${sender.firstName} ${sender.lastName} (${sender.emails[0].address})`
        : ` ${sender.name} (${sender.email})`
    }

    a choisi le créneau du ${date} pour le rendez-vous ${title}
</div>
<br/>
<div>
    Vous pouvez valider le créneau avec le liens suivant ${url}
</div>
<br/>
`;

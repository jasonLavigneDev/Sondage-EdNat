export const meetingTemplate = ({ sender, date }) => `
    <h4>Votre rendez vous a été confirmé</h4>
    <br/>
    <div>
        Votre rendez-vous avec ${sender} a été confirmé pour le ${date}
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
    Votre évenement "${title}", organisé par ${sender}, a été confirmé pour le ${date}
</div>
<br/>
<div>
    Vous pouvez l'ajouter à votre agenda en ouvrant la pièce jointe.
</div>
<br/>
`;

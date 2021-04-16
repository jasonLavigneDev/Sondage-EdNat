export const meeting_template = ({ sender, date }) => `
    <h4>Votre rendez vous a été confirmé</h4>
    <br/>
    <br/>
    <div>
        Votre rendez-vous avec ${sender} a été confirmé pour le ${date}
    </div>
    <br/>
    <div>
        Vous pouvez l'ajouter à votre agenda en ouvrant la pièce jointe.
    </div>
`

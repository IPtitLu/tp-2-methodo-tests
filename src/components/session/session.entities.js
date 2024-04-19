class Session {
  constructor(userId, dateDebut, dateFin, pauses = [], etatOculaire = '', remarques = '', _id = null) {
    this._id = _id;
    this.userId = userId;
    this.dateDebut = dateDebut;
    this.dateFin = dateFin;
    this.pauses = pauses;
    this.etatOculaire = etatOculaire;
    this.remarques = remarques;
  }

  toJSON() {
    return {
      id: this._id,
      userId: this.userId,
      dateDebut: this.dateDebut,
      dateFin: this.dateFin,
      pauses: this.pauses,
      etatOculaire: this.etatOculaire,
      remarques: this.remarques
    };
  }

  static fromDocument(doc) {
    return new Session(
      doc.userId,
      doc.dateDebut,
      doc.dateFin,
      doc.pauses,
      doc.etatOculaire,
      doc.remarques,
      doc._id
    );
  }
}

export default Session;

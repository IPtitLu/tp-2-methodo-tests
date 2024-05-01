class Session {
  constructor(
    userId,
    dateDebut,
    dateFin,
    pauses = [],
    etatOculaire = '',
    remarques = '',
    _id = null,
    duree,
  ) {
    this._id = _id;
    this.userId = userId;
    this.dateDebut = dateDebut;
    this.dateFin = dateFin;
    this.pauses = pauses;
    this.etatOculaire = etatOculaire;
    this.remarques = remarques;
    this.duree = this.calculateDuration();
  }

  calculateDuration() {
    // Calculer la durée en millisecondes en soustrayant la date de fin de la date de début
    const diff = Math.abs(this.dateFin - this.dateDebut);
    // Soustraire la durée des pauses éventuelles
    const pauseDuration = this.calculatePauseDuration();
    return diff - pauseDuration;
  }

  calculatePauseDuration() {
    // Calculer la durée totale des pauses en millisecondes
    let pauseDuration = 0;
    // eslint-disable-next-line no-restricted-syntax
    for (const pause of this.pauses) {
      const pauseDiff = Math.abs(pause.finPause - pause.debutPause);
      pauseDuration += pauseDiff;
    }
    return pauseDuration;
  }

  toJSON() {
    return {
      id: this._id,
      userId: this.userId,
      dateDebut: this.dateDebut,
      dateFin: this.dateFin,
      pauses: this.pauses,
      etatOculaire: this.etatOculaire,
      remarques: this.remarques,
      duree: this.duree,
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
      doc._id,
      doc.duree,
    );
  }
}

export default Session;

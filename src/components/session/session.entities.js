class Session {
    constructor(userId, dateDebut, dateFin, pauses = [], etatOculaire = '', remarques = '', _id = null) {
      if (_id) {
        this._id = _id;
      }
      this.userId = userId;
      this.dateDebut = dateDebut;
      this.dateFin = dateFin;
      this.duree = this.calculateDuration(dateDebut, dateFin, pauses);
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
        duree: this.duree,
        pauses: this.pauses,
        etatOculaire: this.etatOculaire,
        remarques: this.remarques
      };
    }
  
    addPause(debutPause, finPause) {
      const pause = {
        debutPause,
        finPause,
        duree: this.calculatePauseDuration(debutPause, finPause)
      };
      this.pauses.push(pause);
      this.duree = this.calculateDuration(this.dateDebut, this.dateFin, this.pauses);
    }
  
    calculateDuration(dateDebut, dateFin, pauses) {
      let duration = (dateFin - dateDebut) / (1000 * 60 * 60); 
      const pauseDuration = pauses.reduce((total, pause) => {
        return total + pause.duree;
      }, 0);
      return duration - pauseDuration;
    }
  
    calculatePauseDuration(debutPause, finPause) {
      return (finPause - debutPause) / (1000 * 60); 
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
  
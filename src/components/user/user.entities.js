class User {
  constructor(email, sessions = [], password, age, _id = null) {
    if (_id) {
      this._id = _id;
    }
    this.email = email;
    this.password = password;
    this.age = age;
    this.sessions = sessions;
  }

  toJSON() {
    return {
      id: this._id,
      email: this.email,
      age: this.age || null,
      sessions: this.sessions,
    };
  }
  addSession(sessionId) {
    this.sessions.push(sessionId);
  }

  removeSession(sessionId) {
    this.sessions = this.sessions.filter(session => session !== sessionId);
  }
  static fromDocument(doc) {
    return new User(doc.email, doc.sessions, doc.password, doc.age, doc._id);
  }
}

export default User;

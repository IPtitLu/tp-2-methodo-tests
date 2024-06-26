import { ObjectId } from 'mongodb';
import db from '../mongodb.db.js';
import Session from './session.entities.js';

class SessionRepository {
  constructor() {
    this.collection = db.collection('sessions');
  }

  async getById(id) {
    const query = { _id: new ObjectId(id) };
    const document = await this.collection.findOne(query);
    return document ? Session.fromDocument(document) : undefined;
  }

  async getAll() {
    const documents = await this.collection.find({}).toArray();
    return documents.map((doc) => Session.fromDocument(doc));
  }

  async create(document) {
    const response = await this.collection.insertOne(document);
    const newId = response.insertedId;
    document._id = newId;
    return Session.fromDocument(document);
  }

  async update(document) {
    const filter = { _id: new ObjectId(document._id) };
    const updateDoc = {
      $set: {
        userId: document.userId,
        dateDebut: document.dateDebut,
        dateFin: document.dateFin,
        pauses: document.pauses,
        etatOculaire: document.etatOculaire,
        remarques: document.remarques,
      },
    };

    await this.collection.updateOne(filter, updateDoc);
    return this.getById(document._id);
  }

  async deleteById(id) {
    const query = { _id: new ObjectId(id) };
    await this.collection.deleteOne(query);
  }

  async getSessionsWithinRange(startDate, endDate) {
    // Récupérer toutes les sessions dans la plage de dates spécifiée
    const sessions = await this.collection
      .find({
        dateDebut: { $gte: startDate, $lt: endDate },
      })
      .toArray();

    return sessions.map((doc) => Session.fromDocument(doc));
  }

  async getSessionsByUserId(userId) {
    const query = { userId };
    const documents = await this.collection.find(query).toArray();
    return documents.map((doc) => Session.fromDocument(doc));
  }

  async getLastSessionByUserId(userId) {
    const query = { userId };
    const sort = { dateFin: -1 }; // Trie par date de fin décroissante pour obtenir la dernière session
    const document = await this.collection.findOne(query, { sort });
    return document ? Session.fromDocument(document) : undefined;
  }

  createBsonId(id) {
    return new ObjectId(id);
  }
}

export default SessionRepository;

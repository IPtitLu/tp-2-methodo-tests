import Session from './session.entities.js';
import express from 'express';

class SessionController {
  constructor(sessionService) {
    this.sessionService = sessionService;
  }

  createSession = async (req, res) => {
    try {
      const sessionData = req.body; 
      const createdSession = await this.sessionService.addSession(new Session(sessionData));
      res.status(201).json(createdSession.toJSON());
    } catch (err) {
      res.status(403).send({ message: err.message });
    }
  };

  updateSession = async (req, res) => {
    try {
      const sessionData = { ...req.body, _id: req.params.id }; 
      const updatedSession = await this.sessionService.updateSession(new Session(sessionData));
      res.status(200).json(updatedSession.toJSON());
    } catch (err) {
      res.status(404).send({ message: err.message });
    }
  };

  getSessions = async (__, res) => {
    try {
      const sessions = await this.sessionService.getSessions();
      const sessionsJSON = sessions.map(session => session.toJSON());
      res.status(200).send(sessionsJSON);
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  };

  getSessionById = async (req, res) => {
    try {
      const { id } = req.params;
      const session = await this.sessionService.getSessionById(id);
      res.status(200).json(session.toJSON());
    } catch (err) {
      res.status(404).send({ message: 'Session not found' });
    }
  };

  deleteSessionById = async (req, res) => {
    try {
      const { id } = req.params;
      await this.sessionService.deleteSessionById(id);
      res.status(200).send({ message: 'Session deleted successfully' });
    } catch (err) {
      res.status(404).send({ message: 'Session not found' });
    }
  };

  deleteAllSessions = async (__ , res) => {
    try {
      await this.sessionService.deleteAllSessions();
      res.status(200).send({ message: 'All sessions deleted successfully' });
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  };
}

export default SessionController;

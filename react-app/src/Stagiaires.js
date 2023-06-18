import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Table, Button, Form } from 'react-bootstrap';

const API_URL = 'http://localhost:8000/api';
const TOKEN_KEY = 'notesapi_token';

// Function to check if the user is authenticated
const isAuthenticated = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  return token !== null;
};

// Function to authenticate the user and store the token in local storage
const authenticate = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

// Function to sign out the user and remove the token from local storage
const signout = () => {
  localStorage.removeItem(TOKEN_KEY);
};

// Custom hook to fetch data with authorization headers
const useAuthorizedFetch = (url) => {
  const [data, setData] = useState([]);
  const token = localStorage.getItem(TOKEN_KEY);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [url, token]);

  return data;
};

const Stagiaires = () => {
  const [selectedGroup, setSelectedGroup] = useState('');
  const [groups, setGroups] = useState([]);
  const [stagiaires, setStagiaires] = useState([]);
  const [editing, setEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newStagiaire, setNewStagiaire] = useState({ nom: '', prenom: '', address: '' });

  const fetchStagiaires = useAuthorizedFetch(`${API_URL}/stagiaires`);
  const fetchGroups = useAuthorizedFetch(`${API_URL}/groupes`);

  useEffect(() => {
    setStagiaires(fetchStagiaires);
  }, [fetchStagiaires]);

  useEffect(() => {
    setGroups(fetchGroups);
  }, [fetchGroups]);

  const handleDelete = async (id) => {
    const token = localStorage.getItem(TOKEN_KEY);

    try {
      const response = await fetch(`${API_URL}/stagiaires/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setStagiaires(stagiaires.filter((stagiaire) => stagiaire.id !== id));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (stagiaire) => {
    setEditing(true);
    setEditingId(stagiaire.id);
    setNewStagiaire({ nom: stagiaire.nom, prenom: stagiaire.prenom, address: stagiaire.address });
  };

  const handleCancel = () => {
    setEditing(false);
    setEditingId(null);
    setNewStagiaire({ nom: '', prenom: '', address: '' });
  };

  const handleSave = async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    try {
      if (editing) {
        const response = await fetch(`${API_URL}/stagiaires/${editingId}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(newStagiaire),
        });

        if (response.ok) {
          const updatedStagiaires = stagiaires.map((stagiaire) =>
            stagiaire.id === editingId ? { id: stagiaire.id, ...newStagiaire } : stagiaire
          );
          setStagiaires(updatedStagiaires);
          setEditing(false);
          setEditingId(null);
          setNewStagiaire({ nom: '', prenom: '', address: '' });
        }
      } else {
        const response = await fetch(`${API_URL}/stagiaires`, {
          method: 'POST',
          headers,
          body: JSON.stringify(newStagiaire),
        });

        if (response.ok) {
          const data = await response.json();
          setStagiaires([...stagiaires, data]);
          setNewStagiaire({ nom: '', prenom: '', address: '' });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStagiaire((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleGroupChange = (e) => {
    setSelectedGroup(e.target.value);
  };

  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="container">
      <h1>Stagiaires</h1>
      <div className="filter">
        <Form.Group>
          <Form.Control as="select" value={selectedGroup} onChange={handleGroupChange}>
            <option value="">All Groups</option>
            {groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Nom</th>
            <th>Prenom</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {stagiaires
            .filter((stagiaire) => !selectedGroup || stagiaire.groupId === selectedGroup)
            .map((stagiaire) => (
              <tr key={stagiaire.id}>
                <td>{stagiaire.id}</td>
                <td>{stagiaire.nom}</td>
                <td>{stagiaire.prenom}</td>
                <td>{stagiaire.address}</td>
                <td>
                  <Button variant="primary" size="sm" onClick={() => handleEdit(stagiaire)}>
                    Edit
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(stagiaire.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
      <h2>Add Stagiaire</h2>
      <Form>
        <Form.Group>
          <Form.Label>Nom</Form.Label>
          <Form.Control
            type="text"
            name="nom"
            value={newStagiaire.nom}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Prenom</Form.Label>
          <Form.Control
            type="text"
            name="prenom"
            value={newStagiaire.prenom}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            name="address"
            value={newStagiaire.address}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Button variant="success" onClick={handleSave}>
          {editing ? 'Update' : 'Add'}
        </Button>
      </Form>
    </div>
  );
};

export default Stagiaires;

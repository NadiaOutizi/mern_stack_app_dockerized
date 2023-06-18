import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Table, Button, Form } from 'react-bootstrap';

function Groupes() {
  const [selectedGroup, setSelectedGroup] = useState("");
  const [groupes, setGroupes] = useState([]);
  const [editing, setEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newGroupe, setNewGroupe] = useState({ nom: '', description: '' }); 

  useEffect(() => {
    const fetchGroupes = async () => {
      const response = await fetch('http://localhost:8081/api/groupes');
      const jsonGroupesData = await response.json();
      setGroupes(jsonGroupesData);
    };
    fetchGroupes();
  }, []);

  const handleDelete = async (id) => {
    const response = await fetch(`http://localhost:8081/api/groupes/${id}`, {
      method: 'DELETE'
    });
    if (response.ok) {
      setGroupes(groupes.filter(groupe => groupe.id !== id));
    }
  };

  const handleEdit = (groupe) => {
    setEditing(true);
    setEditingId(groupe.id);
    setNewGroupe({ nom: groupe.nom, description: groupe.description });
  };

  const handleCancel = () => {
    setEditing(false);
    setEditingId(null);
    setNewGroupe({ nom: '', description: '' });
  };

  const handleSave = async () => {
    if (editing) {
      const response = await fetch(`http://localhost:8081/api/groupes/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newGroupe)
      });
      if (response.ok) {
        const updatedGroupes = groupes.map(groupe => {
          if (groupe.id === editingId) {
            return { ...groupe, ...newGroupe };
          }
          return groupe;
        });
        setGroupes(updatedGroupes);
        handleCancel();
      }
    } else {
      const response = await fetch('http://localhost:8081/api/groupes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newGroupe)
      });
      if (response.ok) {
        const newGroupeWithId = { ...newGroupe, id: await response.text() };
        setGroupes([...groupes, newGroupeWithId]);
        handleCancel();
      }
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewGroupe({ ...newGroupe, [name]: value });
  };

  return (

    <div className="container mt-5">
      <h1>Groupes</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {groupes.map(groupe => (
            <tr key={groupe.id}>
              <td>{groupe.nom}</td>
              <td>{groupe.description}</td>
              <td>
                <Button variant="info" className="mr-2" onClick={() => handleEdit(groupe)}>Editer</Button>
                <Button variant="danger" onClick={() => handleDelete(groupe.id)}>Supprimer</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <h2>{editing ? 'Editer un groupe' : 'Ajouter un groupe'}</h2>
      <Form>
        <Form.Group controlId="formNom">
          <Form.Label>Nom</Form.Label>
          <Form.Control type="text" placeholder="Nom" name="nom" value={newGroupe.nom} onChange={handleInputChange} />
        </Form.Group>
        <Form.Group controlId="formDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control as="textarea" rows={3} placeholder="Description" name="description" value={newGroupe.description} onChange={handleInputChange} />
        </Form.Group>
        <Button variant="primary" onClick={handleSave}>{editing ? 'Enregistrer' : 'Ajouter'}</Button>
        {editing && <Button variant="secondary" className="ml-2" onClick={handleCancel}>Annuler</Button>}
      </Form>
    </div>
  ); 
}
export default Groupes
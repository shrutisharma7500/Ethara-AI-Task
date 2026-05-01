import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Plus, UserPlus } from 'lucide-react';
import './ProjectDetails.css';

const ProjectDetails = () => {
  const { id } = useParams();
  const [tasks, setTasks] = useState([]);
  const [project, setProject] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const { user } = useContext(AuthContext);

  // Task form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [assignedTo, setAssignedTo] = useState('');
  const [memberEmail, setMemberEmail] = useState('');

  useEffect(() => {
    fetchProjectAndTasks();
  }, [id]);

  const fetchProjectAndTasks = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const projRes = await axios.get(`${API_URL}/projects`);
      const currentProj = projRes.data.find(p => p._id === id);
      setProject(currentProj);

      const tasksRes = await axios.get(`${API_URL}/tasks/project/${id}`);
      setTasks(tasksRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      await axios.post(`${API_URL}/tasks`, {
        title, description, dueDate, priority, assignedTo, project: id
      });
      setShowTaskModal(false);
      fetchProjectAndTasks();
    } catch (err) {
      console.error(err);
      alert('Failed to create task');
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      await axios.post(`${API_URL}/projects/${id}/members`, { email: memberEmail });
      setShowMemberModal(false);
      setMemberEmail('');
      fetchProjectAndTasks();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to add member');
    }
  };

  const updateTaskStatus = async (taskId, status) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      await axios.put(`${API_URL}/tasks/${taskId}`, { status });
      fetchProjectAndTasks();
    } catch (err) {
      console.error(err);
    }
  };

  if (!project) return <div className="loading">Loading project details...</div>;

  const isAdmin = project.admin?._id === user?.id;

  return (
    <div className="project-details-container">
      <div className="projects-header">
        <div>
          <h1 className="page-title">{project.name}</h1>
          <p className="page-subtitle">{project.description}</p>
        </div>
        {isAdmin && (
          <div className="header-actions">
            <button className="btn-secondary" onClick={() => setShowMemberModal(true)}>
              <UserPlus size={18} /> Add Member
            </button>
            <button className="btn-primary" onClick={() => setShowTaskModal(true)}>
              <Plus size={18} /> New Task
            </button>
          </div>
        )}
      </div>

      <div className="kanban-board">
        {['To Do', 'In Progress', 'Done'].map(status => (
          <div className="kanban-column" key={status}>
            <div className="column-header">
              <h3>{status}</h3>
              <span className="task-count">{tasks.filter(t => t.status === status).length}</span>
            </div>
            
            <div className="task-list">
              {tasks.filter(t => t.status === status).map(task => (
                <div className="task-card" key={task._id}>
                  <div className="task-priority" data-priority={task.priority}>{task.priority}</div>
                  <h4>{task.title}</h4>
                  {task.description && <p>{task.description}</p>}
                  
                  <div className="task-footer">
                    <span className="task-assignee">
                      {task.assignedTo?.name || 'Unassigned'}
                    </span>
                    <select 
                      value={task.status} 
                      onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                      disabled={!isAdmin && task.assignedTo?._id !== user?.id}
                      className="status-select"
                    >
                      <option value="To Do">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Done">Done</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showMemberModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add Team Member</h2>
            <form onSubmit={handleAddMember}>
              <div className="form-group">
                <label>User Email</label>
                <input type="email" value={memberEmail} onChange={e => setMemberEmail(e.target.value)} required />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowMemberModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Add Member</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showTaskModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Create Task</h2>
            <form onSubmit={handleCreateTask}>
              <div className="form-group">
                <label>Title</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows="2"></textarea>
              </div>
              <div className="form-group">
                <label>Due Date</label>
                <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select value={priority} onChange={e => setPriority(e.target.value)}>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div className="form-group">
                <label>Assign To</label>
                <select value={assignedTo} onChange={e => setAssignedTo(e.target.value)}>
                  <option value="">Unassigned</option>
                  {project.members?.map(m => (
                    <option key={m._id} value={m._id}>{m.name} ({m.email})</option>
                  ))}
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowTaskModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;

import React from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

class App extends React.Component {
  state = {
    tasks: [],
    taskName: '',
  };

  componentDidMount() {
    this.socket = io('localhost:8000');
    this.socket.emit('updateData');
    this.socket.on('addTask', task => this.addTask(task));
    this.socket.on('removeTask', taskIndex => this.removeTask(taskIndex));
    this.socket.on('updateData', tasks => this.updateTasks(tasks));
  };

  removeTask(id, e) {
    const { tasks } = this.state;

    this.setState({ tasks: tasks.filter(task => task.id !== id) });
    if (e !== undefined) {
      this.socket.emit('removeTask', id);
    }
  };

  submitForm(e) {
    e.preventDefault();
    const id = uuidv4();
    const { taskName } = this.state;

    this.addTask({ id: id, name: taskName });
    this.socket.emit('addTask', { id: id, name: taskName });
  };

  addTask( task ) {
    const { tasks } = this.state;

    this.setState({ tasks: [...tasks, {id: task.id, name: task.name}] });
  };

  updateTasks(tasks) {
    this.setState({ tasks: tasks});
  };

  render() {
    const { tasks, taskName } = this.state;

    return (
      <div className="App">

        <header>
          <h1>ToDoList.app</h1>
        </header>

        <section className="tasks-section" id="tasks-section">
          <h2>Tasks</h2>

          <ul className="tasks-section__list" id="tasks-list">
            {tasks.map(task => (
              <li className='task' key={task.id}>
                {task.name}
                <button className="btn btn--red" onClick={e => this.removeTask(task.id, e)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <form id="add-task-form" onSubmit={e => this.submitForm(e)}>
            <input className="text-input"
                   value={taskName}
                   onChange={event => this.setState({ taskName: event.currentTarget.value })}
                   autoComplete="off"
                   type="text"
                   placeholder="Type your description"
                   id="task-name"/>
            <button className="btn" type="submit">Add</button>
          </form>

        </section>
      </div>
    );
  };
}

export default App;

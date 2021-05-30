import React,{Component} from "react";
import '../styles/App.css';

class App extends Component {

  constructor() {
    super();
    this.state = {
      items: [],
      input: "",
      isEditing: false,
      progress: 0
    }
  }

  componentDidMount() {
    let local_data = JSON.parse(localStorage.getItem("items"));
    if(local_data != null) {
      this.setState({items: local_data});
      this.setState({progress: localStorage.getItem("progress")});
    }
  }

  componentDidUpdate() {
    localStorage.setItem("items", JSON.stringify(this.state.items));
    localStorage.setItem("progress", this.state.progress);
  }

  isEditing = (e) => {
    if(this.state.isEditing) {
      this.submit(e);
    }
    else {
      this.setState({isEditing: true});
    }
  }

  getInput = (e) => {
    this.setState({input: e.target.value});
  }

  submit = e => {
    e.preventDefault();
    if(this.state.input.length === 0) {
      alert("Pls enter something!");
      return 0;
    }
    const item = {id: new Date().getTime(), text: this.state.input, isComplete: false};
    this.setState({items: this.state.items.concat(item), input: ""}, () => this.setProgress(this.state.items));
  }

  isDone = e => {
    let update = this.state.items.map(i => {
      if(i.id===e) {
        i.isComplete = !i.isComplete;
      }
      return i;
    });
    this.setState({items: update}, () => this.setProgress(this.state.items));
  }

  delete = e => {
    let filtered_items = this.state.items.filter(i => i.id!==e);
    this.setState({items: filtered_items}, () => this.setProgress(this.state.items));
  }

  setProgress = items => {
    let check = items.filter(i => {return i.isComplete});
    let progress = (items.length)? Math.floor((check.length / items.length) * 100): 0;
    this.setState({progress: progress});
  }

  render() {

    const {items , input, isEditing} = this.state;

    return (
      <form className="todo-list" onSubmit={this.submit}>

        <div class="progress">
          <div class="progress-bar" role="progressbar" style={{width: this.state.progress + "%"}} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">{this.state.progress + "%"}</div>
        </div>

        { (items.length)?
            items.map((i) => {
              return(
                <div className="todo-wrap" key={i.id}>
                  <span onClick={() => this.isDone(i.id)}>
                    <input type="checkbox" checked={i.isComplete}/>
                    <label className="todo">{i.text}</label>
                  </span>

                  <span className="delete-item" title="remove" onClick={() => this.delete(i.id)}>
                    <i className="fa fa-times-circle"></i>
                  </span> 
                </div>
              )
            })
            :
            <p></p>
        }
        
        { (isEditing)?
            <div className="todo-wrap"><input id="input-box" onChange={this.getInput} value={input}/></div>
          :
           <p></p>
        }

        <div id="add-todo" onClick={this.isEditing}>
          <i className="fa fa-plus"></i>&nbsp; Add an item
        </div>
      </form>
    );
  }
}

export default App;

import React, { Component } from 'react';
import logo from '../assets/images/logo.png';
import { baseUrl } from '../components/BaseUrl';
import Swal from "sweetalert2";

class Todos extends Component {

  constructor(props){
    super(props);
    this.state = {
      tasks: [],
      item: "",
      title: "",
      updateId: "",
      updateTitle: "",
      isAddingItem: false,
      isDisabled: false,
      isFetchingTasks: false,
      isUpdatingStatus: false,
      isRemovingItem: false,
      postsPerPage: 10,
      currentPage: 1,
    }
  }



  componentDidMount(){
    this.getTodoList()
  }

  getTask = (id) => {
    let params = id.split(",")
    this.setState({updateId: params[0], updateTitle: params[1]})
  }


  //=========================================
    //START OF UPDATE TASK
  //=========================================
  updateTask = async (id) => {
    console.warn(id);
    // let params = id.split(",")
    this.setState({isUpdatingStatus: true})
    let req = {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: this.state.title ? this.state.title : this.state.updateTitle,
        description: null,
        completed: true,
      }),
    };
    await fetch(`${baseUrl}todoApp/tasks/${this.state.updateId}`, req)
      .then((response) => response.json())
      .then((responseJson) => {
        console.warn(responseJson);
        if(responseJson && responseJson.id){
          this.setState({isUpdatingStatus: false, isDisabled: false})
          Swal.fire({
            title: "Success",
            text: 'Status updated successfully!',
            icon: "success",
            confirmButtonText: "OK",
          }).then(() => {
            window.location.reload()
          })
        }else{
          this.setState({isUpdatingStatus: false, isDisabled: false})
          Swal.fire({
            title: "Error!",
            text: 'An error occurred. Please try again later.',
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      })
      .catch((error) => {
        this.setState({isUpdatingStatus: false, isDisabled: false})
        Swal.fire({
          title: "Error!",
          text: error.message,
          icon: "error",
          confirmButtonText: "OK",
        });
      })
  }
  //=========================================
    //END OF UPDATE TASK
  //=========================================

  //=========================================
    //START OF DELETE TASK
  //=========================================
  deleteTask = (id) => {
    this.setState({isRemovingItem: true})
    const url = `${baseUrl}todoApp/tasks/${id}`;
    fetch(url, {
      method: 'DELETE',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
    })
      .then(res => res.json())
      .then(res => {
        // console.warn(res);
        if(res.message === "Task deleted"){
            this.setState({isRemovingItem: false});
          Swal.fire({
            title: "Success",
            text: "Task removed successfully",
            icon: "success",
            confirmButtonText: "OK",
          }).then(() => {
              window.location.reload()
          })
        }else{
          Swal.fire({
            title: "Error",
            text: "An error occurred, please try again",
            icon: "error",
            confirmButtonText: "OK",
          })
          this.setState({isRemovingItem: false});
        }
      })
      .catch(error => {
        this.setState({isRemovingItem: false});
        alert(error);
      });
  }
  //=========================================
    //END OF DELETE TASK
  //=========================================

  //=========================================
    //START OF GET ALL TASK
  //=========================================
  getTodoList = async () => {
    this.setState({ isFetchingTasks: true})
    let obj = {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    await fetch(`${baseUrl}todoApp/tasks`, obj)
      .then((response) => response.json())
      .then((responseJson) => {
        // console.warn(responseJson);
        if (responseJson) {
            this.setState({ tasks: responseJson, isFetchingTasks: false });
          }else{
            this.setState({ isFetchingTasks: false })
            Swal.fire({
              title: "Error!",
              text: "Could not retrieve todo list. Please try again later",
              icon: "error",
              confirmButtonText: "OK",
            })
          }
      })
      .catch((error) => {
        this.setState({ isFetchingTasks: false })
        Swal.fire({
          title: "Error!",
          text: error.message,
          icon: "error",
          confirmButtonText: "OK",
        });
      });
  }

  //=========================================
    //END OF GET ALL TASK
  //=========================================

  showTasks = () => {
    const { postsPerPage, currentPage, isRemovingItem, tasks } = this.state;
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = parseInt(indexOfLastPost) - parseInt(postsPerPage);
    const currentPosts = tasks.slice(indexOfFirstPost, indexOfLastPost);
    try {
      return currentPosts.map((item, index) => {
        return (
          <tr>
         <td className="text-xs font-weight-bold">{index +1}</td>
         <td className="text-xs text-capitalize font-weight-bold">{item.title}</td>
         <td className={item.completed.toString() === "true" ? 'badge bg-success mt-3' : "badge bg-warning mt-3" }>{item.completed.toString()}</td>
         <td><button className="btn btn-success" data-bs-toggle="modal" data-bs-target="#update" id={item.id} onClick={() => this.getTask(`${item.id}, ${item.title}, ${item.completed.toString()}`)}>Update</button>
         <div className="modal fade" id="update" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
           <div className="modal-dialog">
             <div className="modal-content">
               <div className="modal-header d-flex align-items-center justify-content-between bg-danger">
                 <h5 className="modal-title text-light">Update Task</h5>
                 <button type="button" className="btn btn-link m-0 p-0 text-dark fs-4" data-bs-dismiss="modal" aria-label="Close"><span class="iconify" data-icon="carbon:close"></span></button>
               </div>
               <div className="modal-body">
                 <div className="row">
                   <div clasNames="d-flex text-center">
                     <div className="d-flex flex-column">
                     <div className="mb-3">
                       <input type="text" className="form-control" id="email" aria-describedby="email"
                         placeholder="Title"
                         defaultValue={this.state.updateTitle}
                         onChange={(e) =>
                           this.setState({ title: e.target.value })
                         }
                         />
                     </div>
                     </div>
                     <div className="col-sm-12 col-lg-12 col-md-12 mb-3">
                     <label className="text-dark" htmlFor="role">Status</label>
                       <select
                         className="form-control shadow-none"
                         aria-label="Floating label select example"
                         onChange={this.handleApprovalChange}
                         id="role"
                       >
                          <option selected disabled>--Select Task Status --</option>
                          <option value="true">TRUE</option>
                          <option value="false">FALSE</option>

                       </select>
                     </div>

                     <div className="text-center" id={item.id}><button disabled={this.state.isDisabled} onClick={(e) => this.updateTask(item.id)} type="button" class="btn btn-success font-weight-bold px-5 mb-5 w-100">
                     {this.state.isUpdatingStatus ? (
                       'updating ...'
                     ) : (
                       "Update Task"
                     )}
                     </button></div>

               <div class="modal-footer">
                 <button type="button" data-bs-dismiss="modal" class="btn btn-primary">Close</button>
               </div>
             </div>
           </div>
         </div>
         </div>
         </div>
         </div>

         </td>
         <td><button className="btn btn-danger" id={item.id} onClick={() => this.deleteTask(`${item.id}`)}>Delete</button></td>
         </tr>
          );
      });
    } catch (e) {
      // Swal.fire({
      //   title: "Error",
      //   text: e.message,
      //   type: "error",
      // })
    }
  }

  //=========================================
    //START OF PAGINATION
  //=========================================
  showPagination = () => {
    const { postsPerPage, tasks } = this.state;
    const pageNumbers = [];
    const totalPosts = tasks.length;
    for(let i = 1; i<= Math.ceil(totalPosts/postsPerPage); i++){
      pageNumbers.push(i)
    }

   const paginate = (pageNumbers) => {
     this.setState({currentPage: pageNumbers})
   }
    return(
      <nav>
      <ul className="pagination mt-4" style={{float: 'right', position: 'relative', right: 54}}>
      {pageNumbers.map(number => (
        <li key={number} className={this.state.currentPage === number ? 'page-item active' : 'page-item'}>
        <button onClick={()=> paginate(number)} className="page-link">
          { number }
        </button>
       </li>
     ))}
      </ul>
      </nav>
    )
  }
  //=========================================
    //END OF PAGINATION
  //=========================================


  //=========================================
    // START OF CREATE TODO TASK
  //=========================================

  createTodo = async () => {
    const { item } = this.state;
    this.setState({isAddingItem: true, isDisabled: true})
    let req = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: `${item}`,
        description: "hello",
        completed: false,
      }),
    };
    await fetch(`${baseUrl}todoApp/tasks`, req)
      .then((response) => response.json())
      .then((responseJson) => {
        // console.warn(responseJson);
        if(responseJson){
          this.setState({isAddingItem: false, isDisabled: false})
          Swal.fire({
            title: "Success",
            text: 'Task added successfully!',
            icon: "success",
            confirmButtonText: "OK",
          }).then(() => {
            window.location.reload()
          })
        }else{
          this.setState({isAddingItem: false, isDisabled: false})
          Swal.fire({
            title: "Error!",
            text: 'An error occurred. Please try again later.',
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      })
      .catch((error) => {
        this.setState({isAddingItem: false, isDisabled: false})
        Swal.fire({
          title: "Error!",
          text: error.message,
          icon: "error",
          confirmButtonText: "OK",
        });
      })
     }
     //=========================================
       //END OF CREATE TODO TASK
     //=========================================




  render(){
    const { isAddingItem, isUpdatingStatus, isRemovingItem, isFetchingTasks } = this.state;
    return(
      <div className="container">
      <div className="text-center">
        <img src={logo} className="img-fluid profile-image-pic img-thumbnail my-3"
          width="200px" alt="logo" />
      </div>
      <div className="todo-container">
      <div className="todo-app">
        <form className="add-todo-form">
          <input className="add-todo-input" type="text" placeholder="Add item" onChange={(e) =>
            this.setState({ item: e.target.value })
          } />
          <button type="button" onClick={(e) => this.createTodo()} className="add-todo-btn">
          {isAddingItem ? (
            'adding item ...'
          ) : (
            "Add"
          )}
          </button>
        </form>

        <div className="container-fluid py-4">
        <div className="table-responsive p-0 pb-2">
          {isRemovingItem && <p className="text-center text-danger">Removing item ...</p>}
          {isUpdatingStatus && <p className="text-center text-success">Updating Status ...</p>}
      <table className="table align-items-center justify-content-center mb-0">
          <thead>
              <tr>
              <th className="text-uppercase text-secondary text-sm font-weight-bolder opacity-7 ps-2">S/N</th>
              <th className="text-uppercase text-secondary text-sm font-weight-bolder opacity-7 ps-2">Task</th>
              <th className="text-uppercase text-secondary text-sm font-weight-bolder opacity-7 ps-2">Completed</th>
              <th className="text-uppercase text-secondary text-sm font-weight-bolder opacity-7 ps-2">Update</th>
              <th className="text-uppercase text-secondary text-sm font-weight-bolder opacity-7 ps-2">Delete</th>
              </tr>
          </thead>
          {isFetchingTasks ? <div style={{ position: 'relative', top: 10, left: 250}} class="spinner-border text-success" role="status">
            <span className="sr-only">Loading...</span>
          </div> :
          <tbody>
             {this.showTasks()}
          </tbody>
        }
          </table>
          </div>
          <div style={{float: 'right'}}>
          {this.showPagination()}
          </div>
          </div>
      </div>
      </div>

      {/* Update Modal */}

      </div>
    )
  }
}

export default Todos;

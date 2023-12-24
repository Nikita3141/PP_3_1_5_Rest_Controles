async function editUser (modal, id) {
    let userJson = await userFetch.findOneUser(id)
    let user = userJson.json();

    modal.find('.modal-title').html('Edit User')

    let editButton =    `<button class="btn btn-info" id="editButton">Edit</button>`
    let closeButton =   `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>`

    modal.find('.modal-footer').append(editButton)
    modal.find('.modal-footer').append(closeButton)

    user.then(user => {
        let bodyForm = `
        <div class="offset-md-2 col-md-8 ">
            <form class="form-group text-center" id="editUser">
                <div class="form-group">
                <label for="userId" class="col-form-label"><b>Id</b></label>
                <input type="text" id="userId" value="${user.id}"  class="form-control " disabled  >
                </div>

                <div class="form-group">
                <label for="username" class="col-form-label"><b>UserName</b></label>
                <input type="text" id="username" value="${user.username}"  class="form-control username" >
                </div>

                <div class="form-group">
                <label for="lastname" class="col-form-label"><b>LastName</b></label>
                <input type="text" id="lastname" value="${user.lastname}"  class="form-control" >
                </div>

                <div class="form-group">
                <label for="age" class="col-form-label"><b>Age</b></label>
                <input type="number" id="age" value="${user.age}"  class="form-control " >
                </div>

                <div class="form-group">
                <label for="email" class="col-form-label"><b>Email</b></label>
                <input type="text" id="email" value="${user.email}"  class="form-control " >
                </div>

                <div class="form-group">
                <label for="password" class="col-form-label"><b>Password</b></label>
                <input type="text" id="password"  class="form-control " >
                </div>

                <div class="form-group">
                <label for="Role" class="col-form-label"></label>
                <select multiple id="Role" size="2" class="form-control">
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                </select>
                </div>
            </form>
        </div>
        `
        modal.find('.modal-body').append(bodyForm)
    })
    $("#editButton").on('click', async () => {
        let roles = () => {
            let array = []
            let options = document.querySelector('#Role').options
            for (let i = 0; i< options.length; i++){
                if (options[i].selected){
                    array.push(roleList[i])
                }
            }
            return array
        }
        let userId = modal.find('#userId').val().trim()
        let username = modal.find('#username').val().trim()
        let lastname = modal.find('#lastname').val().trim()
        let age = modal.find('#age').val().trim()
        let email = modal.find('#email').val().trim()
        let password = modal.find('#password').val().trim()
        let data = {
            userId :userId,
            username: username,
            lastname: lastname,
            age: age,
            email: email,
            password: password,
            roles: roles()
        }
        const res = await userFetch.updateUser(data, id)

        if (res.ok) {
            await getAllUsers ()
            modal.modal('hide')
        } else {
            let body = await res.json()
            let alert = `<div class="alert alert-danger alert-dismissible fade show offset-md-2 col-md-8" role="alert" id="errormessage">
                                ${body.info}
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                    <span aria-hidden="true">&times; </span>
                                </button>
                            </div>`
            modal.find('.modal-body').prepend(alert)
            const errorMessage = document.getElementById('errormessage');

            const closeButton = errorMessage.querySelector('.close');

            closeButton.addEventListener('click', function() {
                errorMessage.style.display = 'none';
            });
        }
    })
}